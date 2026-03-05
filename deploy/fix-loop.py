import subprocess, os, time, urllib.request, ssl

print("=== FIX REDIRECT LOOP ===")

# Config con port 80 Y 443 ambos proxeando (evita loop con Cloudflare Flexible SSL)
nginx_cfg = 'server {\n    listen 80;\n    listen [::]:80;\n    server_name campolatam.centralchat.pro;\n    client_max_body_size 100M;\n    location / {\n        proxy_pass http://127.0.0.1:3802;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_read_timeout 86400;\n    }\n}\nserver {\n    listen 443 ssl http2;\n    listen [::]:443 ssl http2;\n    server_name campolatam.centralchat.pro;\n    ssl_certificate /etc/letsencrypt/live/campolatam.centralchat.pro/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/campolatam.centralchat.pro/privkey.pem;\n    include /etc/letsencrypt/options-ssl-nginx.conf;\n    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;\n    client_max_body_size 100M;\n    location / {\n        proxy_pass http://127.0.0.1:3802;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_read_timeout 86400;\n    }\n}\n'

with open('/etc/nginx/sites-available/campolatam', 'w') as f:
    f.write(nginx_cfg)
print("Config written")

link = '/etc/nginx/sites-enabled/campolatam'
if os.path.lexists(link):
    os.remove(link)
os.symlink('/etc/nginx/sites-available/campolatam', link)

r = subprocess.run(['nginx', '-t'], capture_output=True, text=True)
print("nginx -t:", "OK" if r.returncode == 0 else r.stderr)
if r.returncode != 0:
    exit(1)

subprocess.run(['systemctl', 'reload', 'nginx'])
print("Nginx reloaded")
time.sleep(2)

# Test directo bypass DNS (testea nginx puro)
import socket
results = []
for port, scheme in [(80, 'http'), (443, 'https')]:
    ctx = ssl.create_default_context() if scheme == 'https' else None
    if ctx:
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    try:
        req = urllib.request.Request(f'{scheme}://127.0.0.1/', headers={'Host': 'campolatam.centralchat.pro'})
        resp = urllib.request.urlopen(req, context=ctx, timeout=5) if ctx else urllib.request.urlopen(req, timeout=5)
        results.append(f"DIRECT {scheme}:{port} => {resp.status}")
    except urllib.error.HTTPError as e:
        results.append(f"DIRECT {scheme}:{port} => HTTP {e.code}")
    except Exception as e:
        results.append(f"DIRECT {scheme}:{port} => {e}")

for r in results:
    print(r)
print("=== DONE ===")
