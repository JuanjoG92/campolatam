import subprocess, os

cfg = """server {
    listen 443 ssl http2;
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

# Escribir config
with open('/etc/nginx/sites-available/campolatam', 'w') as f:
    f.write(cfg)
print("Config escrita OK")

# Crear symlink
link = '/etc/nginx/sites-enabled/campolatam'
if os.path.lexists(link):
    os.remove(link)
os.symlink('/etc/nginx/sites-available/campolatam', link)
print("Symlink creado OK")

# Test nginx
r = subprocess.run(['nginx', '-t'], capture_output=True, text=True)
print(r.stdout + r.stderr)

# Reload nginx
r2 = subprocess.run(['systemctl', 'reload', 'nginx'], capture_output=True, text=True)
print("Nginx reloaded:", r2.returncode)

# Test HTTP
import urllib.request, ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
try:
    req = urllib.request.urlopen('https://campolatam.centralchat.pro/', context=ctx, timeout=5)
    print("HTTP CODE:", req.status)
except Exception as e:
    print("Error:", e)

print("DONE")
