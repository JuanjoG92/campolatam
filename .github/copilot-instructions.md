# Copilot Instructions - Merrali

## Proyecto
Plataforma web de importación y exportación de productos para Paraguay, Argentina, Brasil y países de la zona. Marca: "Merrali".  
URL de producción: **https://merrali.centralchat.pro/**

## Stack técnico
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (NO frameworks, NO TypeScript, NO bundlers)
- **NO hay .sln ni compilación**. NUNCA usar `run_build`.

## Repositorio Git
- **Repo**: `https://github.com/JuanjoG92/merrali.git`
- **Branch principal**: `main`
- **Carpeta local**: `C:\merrali`

## Flujo de trabajo y deploy
- SIEMPRE modificar archivos en LOCAL (`C:\merrali`).
- Hacer commit y push a GitHub:
   ```powershell
   cd C:\merrali; git add -A; git commit -m "descripción del cambio"; git push origin main
   ```
- El despliegue al VPS es AUTOMÁTICO vía webhook - NUNCA hacer ssh para git pull ni actualizar manualmente el VPS.
- Verificar en: https://merrali.centralchat.pro/
- NUNCA subir archivos con `scp`. Todo va por git.
- NUNCA compilar ni usar `run_build`.
- Usar `;` como separador en PowerShell, NO `&&`.
- **NO modificar archivos en VPS por comandos directos; todo debe hacerse a través de `git push` y `git pull`.**

## VPS
- IP: `172.96.8.245`
- SSH: `ssh -i "$env:USERPROFILE\.ssh\nueva_llave" root@172.96.8.245`
- Ruta del proyecto en VPS: `/var/www/merrali`
- Servidor web: Nginx
- Dominio: `merrali.centralchat.pro`

## Estructura del proyecto
```
merrali/
├── index.html           Landing page principal
├── css/app.css           Estilos globales (dark/light, responsive)
├── js/app.js             JS principal
├── media/
│   └── images/           Imágenes de productos y logos
├── .github/copilot-instructions.md
```

## Paleta de colores
- Primary: `#1e40af` (blue)
- Secondary: `#f59e0b` (amber)
- Accent: `#059669` (emerald)
- Dark base: `#0f172a` / Light base: `#f8fafc`

## Reglas de código
- Archivos modulares de 500-700 líneas máximo.
- Mobile-first: todo responsive.
- No agregar dependencias externas (solo Font Awesome y Google Fonts Inter que ya están).

## i18n
- Idiomas: ES (default), PT, EN
- Sistema: atributos `data-i18n` en HTML + objeto de traducciones en JS.

## Git workflow
- Cuando el usuario diga "haz commit y push", ejecutar sin preguntar:
  ```powershell
  cd C:\merrali; git add -A; git commit -m "mensaje descriptivo"; git push origin main
  ```
