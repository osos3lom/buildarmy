# GitHub Pages Deployment - Quick Start

Get your BuildArmy app live on GitHub Pages in 5 minutes!

## 5-Minute Setup

### 1️⃣ Enable GitHub Pages (1 min)
```
Repository → Settings → Pages → Source: GitHub Actions → Save
```

### 2️⃣ Push to Main (1 min)
```bash
git add .
git commit -m "ci: setup GitHub Pages deployment"
git push origin main
```

### 3️⃣ Watch Deployment (2 min)
```
Repository → Actions tab → "Deploy to GitHub Pages" → Watch status turn ✅
```

### 4️⃣ Access Your App (1 min)
```
https://osaalam.github.io/buildarmy/
```

**Done!** 🎉

---

## Verify It Works

- [ ] Navigate to `https://osaalam.github.io/buildarmy/`
- [ ] App loads without errors
- [ ] Open DevTools (F12) → Console tab → No red errors
- [ ] Test a few interactions (navigation, buttons, etc.)

---

## If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| **404 Error** | URL must be exactly `https://osaalam.github.io/buildarmy/` |
| **Build Failed** | Check Actions logs → "Deploy to GitHub Pages" run |
| **Stale Content** | Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac) |
| **API Errors** | Add secrets: Settings → Secrets → `API_TARGET`, `MEDIA_TARGET` |

---

## What Happens Automatically

Every time you push to `main`:

```
📤 git push
   ↓
🔄 GitHub Actions triggers
   ↓
📦 npm install (dependencies)
   ↓
✅ npm run test (tests)
   ↓
🏗️ npm run build (creates dist/)
   ↓
🚀 Deploy to GitHub Pages
   ↓
🌐 Live at https://osaalam.github.io/buildarmy/
```

---

## Configuration Files Added

```
✅ .github/workflows/deploy.yml       # Automation workflow
✅ .github/DEPLOYMENT.md              # Detailed guide
✅ .github/SETUP_CHECKLIST.md         # Verification steps
✅ .github/QUICKSTART.md              # This file
✅ public/.nojekyll                   # Jekyll disable
✅ package.json                       # Updated homepage
✅ vite.config.ts                     # GitHub Pages base path
```

---

## Add Status Badge to README

Show the build status in your README:

```markdown
![Deploy Status](https://github.com/osaalam/buildarmy/actions/workflows/deploy.yml/badge.svg)
```

Click the badge to see build history.

---

## Production Configuration

### Optional: Add API Secrets

If your app calls APIs, add these secrets:

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Example Value |
|------|----------------|
| `API_TARGET` | `https://api.yourdomain.com` |
| `MEDIA_TARGET` | `https://media.yourdomain.com` |

The workflow will automatically use these during build.

### Optional: Custom Domain

To use your own domain instead of `github.io`:

1. Go to **Settings → Pages**
2. Under "Custom domain", enter your domain
3. Follow GitHub's DNS setup instructions
4. Verify domain

---

## Useful Commands

```bash
# Test locally before pushing
npm run build        # Build for production
npm run preview      # Preview the build
npm run test         # Run tests

# Check workflow status
git log --oneline    # See recent commits

# Manual trigger (if needed)
# Go to Actions tab → Run workflow
```

---

## Monitoring

Check build status anytime:

1. **Dashboard**: `https://github.com/osaalam/buildarmy`
2. **Actions**: Click the "Actions" tab
3. **Badge**: Check README status badge

---

## What's Next?

- ✅ Deployment is ready
- 📝 See `DEPLOYMENT.md` for detailed guide
- ✅ See `SETUP_CHECKLIST.md` to verify everything
- 🐛 Troubleshooting in each file

---

## Need Help?

- **Workflow Issues**: Check `.github/workflows/deploy.yml`
- **Deployment Help**: Read `.github/DEPLOYMENT.md`
- **Setup Issues**: Use `.github/SETUP_CHECKLIST.md`
- **GitHub Pages Docs**: https://docs.github.com/en/pages

---

**Live Site**: https://osaalam.github.io/buildarmy/

**Status**: ✅ Ready to deploy
