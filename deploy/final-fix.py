import subprocess, os, time, urllib.request, ssl

print("=== FINAL FIX ===")

# 1. Vaciar completamente el archivo de challenge (cert ya emitido, no hace falta)
challenge_file = '/etc/letsencrypt/le_http_01_cert_challenge.conf'
with open(challenge_file, 'w') as f:
    f.write('')
print("Challenge file cleared OK")

# 2. Forzar config campolatam completa (80 redirect + 443 proxy)
nginx_cfg = 'server {\n    listen 80;\n    listen [::]:80;\n    server_name campolatam.centralchat.pro;\n    return 301 https://$host$request_uri;\n}\nserver {\n    listen 443 ssl http2;\n    listen [::]:443 ssl http2;\n    server_name campolatam.centralchat.pro;\n    ssl_certificate /etc/letsencrypt/live/campolatam.centralchat.pro/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/campolatam.centralchat.pro/privkey.pem;\n    include /etc/letsencrypt/options-ssl-nginx.conf;\n    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;\n    client_max_body_size 100M;\n    location / {\n        proxy_pass http://127.0.0.1:3802;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_read_timeout 86400;\n    }\n}\n'

with open('/etc/nginx/sites-available/campolatam', 'w') as f:
    f.write(nginx_cfg)
print("Nginx config written OK")

link = '/etc/nginx/sites-enabled/campolatam'
if os.path.lexists(link):
    os.remove(link)
os.symlink('/etc/nginx/sites-available/campolatam', link)
print("Symlink OK")

# 3. Test nginx
r = subprocess.run(['nginx', '-t'], capture_output=True, text=True)
print("nginx test:", "OK" if r.returncode == 0 else "FAIL")
if r.returncode != 0:
    print(r.stderr)
    exit(1)

# 4. Restart nginx (no solo reload, para limpiar cache de config en memoria)
subprocess.run(['systemctl', 'restart', 'nginx'])
print("Nginx restarted")

# 5. Asegurar PM2 campolatam corre
r2 = subprocess.run(['pm2', 'describe', 'campolatam'], capture_output=True, text=True)
if 'online' not in r2.stdout:
    subprocess.run(['pm2', 'start', '/var/www/campolatam/server.js', '--name', 'campolatam'])
    print("PM2 started")
else:
    subprocess.run(['pm2', 'restart', 'campolatam', '--update-env'])
    print("PM2 restarted")

time.sleep(3)

# 6. Test final
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in ['https://campolatam.centralchat.pro/', 'https://campolatam.centralchat.pro/login', 'https://campolatam.centralchat.pro/api/search/stats']:
    try:
        req = urllib.request.urlopen(url, context=ctx, timeout=8)
        print(f"OK {url} => {req.status}")
    except urllib.error.HTTPError as e:
        print(f"ERR {url} => HTTP {e.code}")
    except Exception as e:
        print(f"ERR {url} => {e}")

print("=== DONE ===")
