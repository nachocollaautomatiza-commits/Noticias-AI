# 🧠 Memoria Claude — Proyecto Noticias AI
_Última actualización: 2026-08-19_

## ✅ Aprendizajes críticos del workflow

### 1. Ruta directa al .github-config (NO usar find)
El archivo `.github-config` es oculto y `find` NO lo detecta en el mount de Cowork.
**Siempre usar ruta directa:**
```bash
cat "/sessions/determined-beautiful-hopper/mnt/Noticias AI/.github-config"
```
Esto funciona perfectamente. El archivo contiene GITHUB_TOKEN, GITHUB_REPO, GITHUB_USER, NETLIFY_TOKEN, NETLIFY_SITE_ID.

### 2. Ruta directa de la carpeta (NO usar find para detectar)
```bash
NOTICIAS_DIR="/sessions/determined-beautiful-hopper/mnt/Noticias AI"
TOKEN=$(grep GITHUB_TOKEN "$NOTICIAS_DIR/.github-config" | cut -d'=' -f2 | tr -d '[:space:]')
```

### 3. Guardar HTML con bash heredoc (NUNCA Write tool)
El Write tool de Cowork NO tiene acceso a la carpeta montada. Siempre usar bash:
```bash
cat > "/sessions/determined-beautiful-hopper/mnt/Noticias AI/briefing-YYYY-MM-DD.html" << 'HTMLEOF'
[CONTENIDO]
HTMLEOF
```

### 4. Push script correcto (incluye .nojekyll)
```bash
NOTICIAS_DIR="/sessions/determined-beautiful-hopper/mnt/Noticias AI"
TOKEN=$(grep GITHUB_TOKEN "$NOTICIAS_DIR/.github-config" | cut -d'=' -f2 | tr -d '[:space:]')
REPO_URL="https://${TOKEN}@github.com/nachocollaautomatiza-commits/Noticias-AI.git"
TODAY=$(date +%Y-%m-%d)

rm -rf /tmp/noticias-push && mkdir -p /tmp/noticias-push
cp -r "$NOTICIAS_DIR/." /tmp/noticias-push/
cd /tmp/noticias-push
rm -rf .git .github .github-config .netlify-token .netlify _DEPLOY-AHORA.bat _template_notas.md proceso.docx netlify-deploy.js
touch .nojekyll
git init
git config user.email "nachocolla.automatiza@gmail.com"
git config user.name "Claude AI Briefing Bot"
git branch -m main
git remote add origin "$REPO_URL"
git add .
git commit -m "📰 AI Briefing - $TODAY"
git push -f origin main
```

### 5. Sin .nojekyll → GitHub Pages falla silenciosamente
GitHub Pages usa Jekyll por default y falla en nuestros HTML. El `touch .nojekyll` es CRÍTICO.

## 📊 Historial de briefings
- 2026-08-19: ✅ Publicado (EU AI Act, Hermes Herald, Claude Code v2.1.234, Gemini 3.7 Flash)
- 2026-07-02: ✅ Publicado (deployment #27 — primer push con .nojekyll)
- Anteriores: disponibles en la carpeta

## 🌐 URLs
- Web: https://nachocollaautomatiza-commits.github.io/Noticias-AI/
- Repo: https://github.com/nachocollaautomatiza-commits/Noticias-AI
