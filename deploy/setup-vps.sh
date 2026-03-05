#!/bin/bash
# Merrali VPS Setup - Clone repo + Nginx + Webhook auto-deploy
set -e

echo "===== Merrali VPS Setup ====="

# 1. Clone repo
if [ ! -d "/var/www/merrali" ]; then
  echo "Cloning repo..."
  git clone https://github.com/JuanjoG92/merrali.git /var/www/merrali
else
  echo "Repo exists, pulling..."
  cd /var/www/merrali && git pull origin main
fi

# 2. Nginx config
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/merrali << 'NGINX'
server {
    listen 80;
    server_name merrali.centralchat.pro;
    root /var/www/merrali;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# Enable site
if [ ! -L "/etc/nginx/sites-enabled/merrali" ]; then
  ln -s /etc/nginx/sites-available/merrali /etc/nginx/sites-enabled/merrali
fi

# Test and reload
nginx -t && systemctl reload nginx
echo "Nginx configured!"

# 3. Webhook for auto-deploy
HOOK_DIR="/var/www/merrali/.hooks"
mkdir -p "$HOOK_DIR"
cat > "$HOOK_DIR/deploy.sh" << 'DEPLOY'
#!/bin/bash
cd /var/www/merrali
git pull origin main 2>&1
DEPLOY
chmod +x "$HOOK_DIR/deploy.sh"

# Create webhook PHP endpoint
cat > /var/www/merrali/webhook.php << 'WEBHOOK'
<?php
// GitHub webhook - auto deploy
$secret = '';
$payload = file_get_contents('php://input');

// Verify (optional, no secret for simplicity)
$branch = '';
$data = json_decode($payload, true);
if (isset($data['ref'])) $branch = $data['ref'];

if ($branch === 'refs/heads/main' || !$branch) {
    $output = shell_exec('cd /var/www/merrali && git pull origin main 2>&1');
    echo json_encode(['success' => true, 'output' => $output]);
} else {
    echo json_encode(['skipped' => true, 'branch' => $branch]);
}
WEBHOOK

# 4. SSL with certbot
echo "Setting up SSL..."
if command -v certbot &> /dev/null; then
  certbot --nginx -d merrali.centralchat.pro --non-interactive --agree-tos --email admin@centralchat.pro --redirect 2>/dev/null || echo "SSL may already exist or failed - check manually"
else
  echo "Certbot not installed - install with: apt install certbot python3-certbot-nginx"
fi

echo ""
echo "===== DONE ====="
echo "Site: https://merrali.centralchat.pro/"
echo "Webhook: https://merrali.centralchat.pro/webhook.php"
echo ""
echo "Add this webhook URL in GitHub repo settings:"
echo "  Repo → Settings → Webhooks → Add webhook"
echo "  URL: https://merrali.centralchat.pro/webhook.php"
echo "  Content type: application/json"
echo "  Events: Just the push event"
