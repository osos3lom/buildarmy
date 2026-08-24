# GitHub Configuration

This directory contains GitHub-specific configuration files for the BuildArmy project.

## Directory Structure

```
.github/
├── workflows/
│   └── deploy.yml          # GitHub Actions workflow for deployment
├── DEPLOYMENT.md           # Detailed deployment guide
├── SETUP_CHECKLIST.md      # Step-by-step setup verification
└── README.md               # This file
```

## Files Overview

### `workflows/deploy.yml`
**Purpose**: Automates building and deploying to GitHub Pages

**What it does:**
- Triggers on every push to the `main` branch
- Installs dependencies
- Runs tests (non-blocking)
- Builds the project
- Deploys to GitHub Pages

**Deployment URL**: `https://osaalam.github.io/buildarmy/`

### `DEPLOYMENT.md`
**Purpose**: Complete deployment guide with troubleshooting

**Contents:**
- How automatic deployment works
- Initial setup instructions
- Environment variable configuration
- Troubleshooting common issues
- Custom domain setup
- Performance optimization tips

### `SETUP_CHECKLIST.md`
**Purpose**: Interactive checklist to verify GitHub Pages setup

**Contains:**
- Pre-deployment checklist
- Step-by-step GitHub configuration
- Verification procedures
- Troubleshooting quick reference
- Post-deployment checklist

## Quick Start

### 1. Enable GitHub Pages
```
Settings → Pages → Source: GitHub Actions → Save
```

### 2. Push Your Code
```bash
git add .
git commit -m "ci: setup GitHub Pages"
git push origin main
```

### 3. Monitor Deployment
```
Actions tab → "Deploy to GitHub Pages" → Watch progress
```

### 4. Access Your Site
```
https://osaalam.github.io/buildarmy/
```

## GitHub Actions Workflow Status Badge

Add this to your main `README.md`:

```markdown
[![Deploy to GitHub Pages](https://github.com/osaalam/buildarmy/actions/workflows/deploy.yml/badge.svg)](https://github.com/osaalam/buildarmy/actions/workflows/deploy.yml)
```

This badge shows the current build status.

## Environment Secrets

Optional secrets you can add for production deployment:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these as "New repository secret":

| Secret | Default | Purpose |
|--------|---------|---------|
| `API_TARGET` | `https://api.example.com` | Backend API URL |
| `MEDIA_TARGET` | `https://media.example.com` | Media server URL |

## Monitoring & Debugging

### View Deployment Logs
1. Go to **Actions** tab
2. Click the latest "Deploy to GitHub Pages" run
3. Expand each step to see detailed logs

### Common Issues

| Issue | Solution |
|-------|----------|
| 404 after deploy | Check URL: `https://osaalam.github.io/buildarmy/` |
| Build fails | Check build logs in Actions tab |
| Stale content | Hard refresh (Ctrl+F5) or clear cache |
| API calls fail | Verify secrets or CORS headers |

## Automatic Deployment Rules

- ✅ Only the `main` branch triggers deployment
- ✅ Pull requests build but don't deploy
- ✅ Tests run but don't block deployment (non-blocking)
- ✅ Artifacts are built fresh each time
- ✅ Old deployments are automatically replaced

## Manual Deployment

If you need to manually trigger a deployment:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages"
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow**

## Performance

- **Build time**: ~2-3 minutes (includes npm install)
- **Deployment time**: ~1 minute after build
- **Cache**: npm dependencies cached for faster builds
- **Concurrency**: Only one deployment at a time

## Security

- ✅ No hardcoded secrets in YAML
- ✅ Secrets passed via GitHub encrypted variables
- ✅ Minimal permissions (pages write only)
- ✅ Only public repositories get GitHub Pages (free tier)
- ✅ HTTPS enabled by default

## Next Steps

1. **Setup**: Follow `SETUP_CHECKLIST.md`
2. **Deploy**: Follow `DEPLOYMENT.md`
3. **Monitor**: Check Actions tab regularly
4. **Update**: Modify `.github/workflows/deploy.yml` if needed

## Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Deploy Pages Action](https://github.com/actions/deploy-pages)
- [Upload Pages Artifact](https://github.com/actions/upload-pages-artifact)

---

**Last Updated**: 2026-08-24  
**Deployment Status**: Ready to configure  
**Live URL**: https://osaalam.github.io/buildarmy/
