# Wrangler CLI Guide

## Overview

Wrangler is Cloudflare's official CLI tool for deploying to Cloudflare Pages and Workers. This guide covers using Wrangler for instant local deployment of Cat Collector.

## Installation

### One-time Setup

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Quick Commands

### Deploy Commands

```bash
# Quick deploy (allows uncommitted changes)
npm run deploy

# Production deploy (requires clean git state)
npm run deploy:prod

# Preview deployment (test before production)
npm run deploy:preview

# Or use wrangler directly
wrangler pages deploy . --project-name=cat-collector
```

### Development

```bash
# Start local dev server
npm run dev
# Or
python -m http.server 8000
```

## Deployment Workflows

### Workflow 1: Instant Deploy (Fastest)

Perfect for quick testing and iteration:

```bash
# 1. Make your changes
# 2. Test locally if needed
npm run dev

# 3. Deploy immediately
npm run deploy
```

✅ **Advantages:**

- Deploys in ~10 seconds
- No git commit needed
- Perfect for testing
- Creates unique preview URL

### Workflow 2: Production Deploy

For official releases:

```bash
# 1. Make your changes
# 2. Test thoroughly
npm run dev

# 3. Commit to git
git add .
git commit -m "Description of changes"

# 4. Deploy to production
npm run deploy:prod

# 5. Push to GitHub (optional, for backup)
git push origin main
```

### Workflow 3: GitHub Auto-Deploy

Standard workflow (no Wrangler needed):

```bash
# 1. Make changes
# 2. Commit and push
git add .
git commit -m "Description"
git push origin main

# 3. Cloudflare automatically deploys
# Wait ~1 minute
```

## Configuration

### wrangler.toml

```toml
name = "cat-collector"
compatibility_date = "2025-10-03"
pages_build_output_dir = "."

[env.production]
name = "cat-collector"
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "python -m http.server 8000",
    "deploy": "wrangler pages deploy . --project-name=cat-collector --commit-dirty=true",
    "deploy:prod": "wrangler pages deploy . --project-name=cat-collector --branch=main",
    "preview": "wrangler pages deploy . --project-name=cat-collector --branch=preview"
  }
}
```

## Common Commands

### Deployment

```bash
# Deploy with uncommitted changes
wrangler pages deploy . --project-name=cat-collector --commit-dirty=true

# Deploy specific directory
wrangler pages deploy ./dist --project-name=cat-collector

# Deploy to specific branch
wrangler pages deploy . --project-name=cat-collector --branch=preview
```

### Project Management

```bash
# List all projects
wrangler pages project list

# View project details
wrangler pages project show cat-collector

# List deployments
wrangler pages deployment list --project-name=cat-collector

# Tail logs
wrangler pages deployment tail --project-name=cat-collector
```

### Development

```bash
# Run local dev server with Wrangler
wrangler pages dev .

# Or use simple HTTP server
python -m http.server 8000
```

## Understanding Deployments

### Deployment URLs

Each deployment gets a unique URL:

```
Production:  https://cats.andernet.dev
Preview:     https://[hash].cat-collector.pages.dev
Direct:      https://[hash].cat-collector.pages.dev
```

### Deployment Types

1. **Production Deployment**
   - Connected to custom domain
   - Permanent URL: cats.andernet.dev
   - Created by: GitHub push to main OR `npm run deploy:prod`

2. **Preview Deployment**
   - Temporary hash-based URL
   - Perfect for testing
   - Created by: `npm run deploy` OR `npm run deploy:preview`
   - Useful for sharing with team

## Troubleshooting

### Authentication Issues

```bash
# Re-authenticate
wrangler logout
wrangler login
```

### Deployment Fails

```bash
# Check if logged in
wrangler whoami

# Verify project exists
wrangler pages project list

# Check for errors
wrangler pages deployment list --project-name=cat-collector
```

### Uncommitted Changes Warning

```bash
# Allow deploying with uncommitted changes
wrangler pages deploy . --project-name=cat-collector --commit-dirty=true

# Or use the npm script
npm run deploy
```

### Wrong Project

```bash
# Make sure project name matches
wrangler pages project list

# Update wrangler.toml if needed
name = "cat-collector"  # Must match your Cloudflare project
```

## Best Practices

### When to Use Each Method

**Use Wrangler (`npm run deploy`) when:**

- Quick testing needed
- Iterating rapidly
- Testing before committing
- Sharing preview with team
- Emergency hotfix

**Use GitHub auto-deploy when:**

- Official releases
- Want full git history
- Team collaboration
- Automated CI/CD
- Standard workflow

### Development Workflow

```bash
# Daily workflow
1. npm run dev              # Test locally
2. Make changes             # Edit code
3. Refresh browser          # See changes
4. npm run deploy           # Test on real domain
5. Verify on preview URL    # Check deployment
6. git commit & push        # Save to git
```

## Advanced Usage

### Environment Variables

```bash
# Set environment variable
wrangler pages secret put API_KEY --project-name=cat-collector

# List secrets
wrangler pages secret list --project-name=cat-collector
```

### Custom Domains

Configured in Cloudflare dashboard:

- Production: cats.andernet.dev
- Staging: staging.cats.andernet.dev (optional)

### Rollback

```bash
# List deployments
wrangler pages deployment list --project-name=cat-collector

# Get deployment ID, then rollback in dashboard
# Or use git revert
git revert HEAD
git push origin main
```

## Performance Tips

### Fast Deployment

1. **Use `.wranglerignore`** - Exclude unnecessary files:

   ```
   docs/
   node_modules/
   .git/
   ```

2. **Compress assets** - Wrangler automatically compresses files

3. **Cache busting** - Use version query strings:

   ```html
   <link rel="stylesheet" href="styles.css?v=2.3.2">
   ```

### Monitoring

```bash
# Watch deployment status
wrangler pages deployment tail --project-name=cat-collector

# View recent deployments
wrangler pages deployment list --project-name=cat-collector
```

## Files Overview

### Wrangler-Related Files

```
cat-collector/
├── wrangler.toml          # Wrangler configuration
├── .wranglerignore        # Files to exclude from deployment
├── .gitignore             # Git ignore (includes Wrangler cache)
├── package.json           # NPM scripts for easy deployment
└── docs/
    ├── DEPLOYMENT.md      # General deployment guide
    └── WRANGLER_GUIDE.md  # This file
```

## Quick Reference

```bash
# Setup (one-time)
npm install -g wrangler
wrangler login

# Deploy commands
npm run deploy          # Quick deploy
npm run deploy:prod     # Production deploy
npm run deploy:preview  # Preview deploy

# Development
npm run dev            # Local server

# Utilities
wrangler whoami        # Check auth
wrangler pages project list
wrangler pages deployment list --project-name=cat-collector
```

## Resources

- **Wrangler Docs**: <https://developers.cloudflare.com/workers/wrangler/>
- **Pages Docs**: <https://developers.cloudflare.com/pages/>
- **Dashboard**: <https://dash.cloudflare.com/>
- **Project**: cat-collector
- **Live Site**: <https://cats.andernet.dev>

---

**Pro Tip**: Use `npm run deploy` for rapid iteration, then commit to GitHub when satisfied! 🚀
