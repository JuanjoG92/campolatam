#!/bin/bash
# Fix Nginx for merrali with SSL
cat > /etc/nginx/sites-available/merrali << 'NGINX'
server {
    listen 80;
    listen 443 ssl;
    server_name merrali.centralchat.pro;
    root /var/www/merrali;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/merrali.centralchat.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/merrali.centralchat.pro/privkey.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php-fpm.sock;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
NGINX

nginx -t && systemctl reload nginx && echo "Merrali Nginx OK!"
