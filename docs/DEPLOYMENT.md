# Deployment Guide - Cat Collector

## Live Site

🌐 **Production URL**: <https://cats.andernet.dev>

## Hosting Platform

**Cloudflare Pages** - Connected to GitHub repository

## Deployment Setup

### Repository

- **GitHub**: `and3rn3t/cats`
- **Branch**: `main`
- **Auto-deploy**: ✅ Enabled (deploys on every push to main)

### Build Configuration

```text
Project name: cat-collector
Production branch: main
Framework preset: None
Build command: (none - pure vanilla JavaScript!)
Build output directory: / (root)
Custom domain: cats.andernet.dev
```

## Deployment Process

### Automatic Deployment

Every time you push to `main`, Cloudflare Pages automatically:

1. Detects the push
2. Deploys the latest code
3. Invalidates the CDN cache
4. Makes changes live in ~1 minute

### Manual Steps

```bash
# 1. Make your changes
# 2. Test locally
python -m http.server 8000
# Visit http://localhost:8000

# 3. Commit changes
git add .
git commit -m "Your commit message"

# 4. Push to GitHub
git push origin main

# 5. Cloudflare automatically deploys!
# Visit https://cats.andernet.dev
```

## Features

### ✅ Enabled Features

- **SSL/TLS**: Automatic HTTPS certificate
- **Global CDN**: Fast loading worldwide
- **Auto-deployment**: Push to deploy
- **Preview deployments**: Branch previews available
- **Custom domain**: cats.andernet.dev
- **Analytics**: Cloudflare Web Analytics (optional)
- **No build step**: Pure vanilla JS, HTML, CSS

### 🚀 Performance

- **No bundling** needed
- **No transpilation** needed
- **No node_modules** to deploy
- Static files served directly from CDN
- Browser caching with version query strings

## Rollback

If you need to rollback to a previous version:

1. Go to Cloudflare Dashboard → Pages → cat-collector
2. Click **Deployments** tab
3. Find the previous successful deployment
4. Click **"..."** → **Rollback to this deployment**

Or via git:

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Cache Invalidation

The game uses version query strings for cache busting:

```html
<link rel="stylesheet" href="styles.css?v=2.3.2">
<script src="game.js?v=2.3.2"></script>
```

When releasing a new version:

1. Update version numbers in `index.html`
2. Commit and push
3. Cloudflare automatically serves new files

## Custom Domain Setup

Current setup:

- **Domain**: cats.andernet.dev
- **DNS**: Managed by Cloudflare
- **SSL**: Auto-provisioned Let's Encrypt certificate
- **Status**: ✅ Active

## Monitoring

### Check Deployment Status

1. Visit: <https://dash.cloudflare.com/>
2. Navigate to: Workers & Pages → cat-collector
3. View: Recent deployments and logs

### Check Live Site

- **Production**: <https://cats.andernet.dev>
- **Health check**: Verify game loads and dialogs work

## Troubleshooting

### Deployment Failed

- Check Cloudflare dashboard for error logs
- Verify git push succeeded: `git status`
- Check build logs in Cloudflare Pages dashboard

### Changes Not Showing

- **Hard refresh**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- **Clear cache**: Browser DevTools → Network tab → "Disable cache"
- **Check version**: Look at query strings in Network tab
- **Verify deployment**: Check Cloudflare dashboard for successful deployment

### Dialog Issues

- Verify `dialog[open]` CSS rules are present
- Check that dialogs are outside `<main>` container
- Test with browser DevTools console: `document.querySelectorAll('dialog')`

## Version History

### v2.3.2 (2025-10-03) - Current

- ✅ Web Audio API sound system
- ✅ Dialog display hotfix
- ✅ Custom domain deployment
- 🌐 **Live**: <https://cats.andernet.dev>

### Previous Versions

See [CHANGELOG.md](../CHANGELOG.md) for full version history

## Future Enhancements

Potential Cloudflare features to explore:

- **Analytics**: Enable Cloudflare Web Analytics
- **Functions**: Add Cloudflare Functions for leaderboards
- **D1 Database**: Store global high scores
- **R2 Storage**: Host assets if needed
- **Workers**: Add API endpoints for multiplayer features

## Support

- **Cloudflare Docs**: <https://developers.cloudflare.com/pages/>
- **GitHub Issues**: Use repository issues for bug reports
- **Local Development**: `python -m http.server 8000`

---

**Note**: No CI/CD pipeline needed! Pure vanilla JavaScript means instant deployment. 🚀
