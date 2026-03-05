import subprocess, os, re

print("=== FIXING campolatam nginx ===")

# 1) Limpiar le_http_01_cert_challenge.conf - quitar bloque de campolatam
challenge_file = '/etc/letsencrypt/le_http_01_cert_challenge.conf'
try:
    with open(challenge_file, 'r') as f:
        content = f.read()
    # Eliminar cualquier server block que mencione campolatam
    cleaned = re.sub(r'server\s*\{[^{}]*campolatam[^{}]*\}', '', content, flags=re.DOTALL)
    with open(challenge_file, 'w') as f:
        f.write(cleaned)
    print(f"Cleaned {challenge_file}")
    print(f"Remaining content: {cleaned[:200]}")
except Exception as e:
    print(f"Challenge file error: {e}")

# 2) Escribir config nginx completa para campolatam (80 redirect + 443 proxy)
nginx_cfg = """server {
    listen 80;
    listen [::]:80;
    server_name campolatam.centralchat.pro;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name campolatam.centralchat.pro;
    ssl_certificate /etc/letsencrypt/live/campolatam.centralchat.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/campolatam.centralchat.pro/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    client_max_body_size 100M;
    location / {
        proxy_pass http://127.0.0.1:3802;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
"""
with open('/etc/nginx/sites-available/campolatam', 'w') as f:
    f.write(nginx_cfg)
print("Nginx config written OK")

# 3) Symlink
link = '/etc/nginx/sites-enabled/campolatam'
if os.path.lexists(link):
    os.remove(link)
os.symlink('/etc/nginx/sites-available/campolatam', link)
print("Symlink OK")

# 4) Test nginx
r = subprocess.run(['nginx', '-t'], capture_output=True, text=True)
print("nginx -t:", r.returncode)
print(r.stderr[-300:] if r.stderr else "OK")

if r.returncode != 0:
    print("ERROR - nginx test failed, NOT reloading")
    exit(1)

# 5) Reload nginx
subprocess.run(['systemctl', 'reload', 'nginx'])
print("Nginx reloaded")

# 6) Verify PM2
r3 = subprocess.run(['pm2', 'list', 'campolatam'], capture_output=True, text=True)
print("PM2:", "online" if "online" in r3.stdout else r3.stdout[-200:])

# 7) Test final
import time, urllib.request, ssl
time.sleep(2)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in ['http://campolatam.centralchat.pro/', 'https://campolatam.centralchat.pro/']:
    try:
        req = urllib.request.urlopen(url, context=ctx, timeout=8)
        print(f"{url} => {req.status}")
    except urllib.error.HTTPError as e:
        print(f"{url} => HTTP {e.code}")
    except Exception as e:
        print(f"{url} => {type(e).__name__}: {e}")

print("=== DONE ===")
