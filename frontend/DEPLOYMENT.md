# Azure Static Web Apps Configuration

This file provides the configuration for deploying the PeerView frontend to Azure Static Web Apps.

## Deployment Configuration

### Build Configuration

```yaml
app_location: "/frontend"
api_location: ""
output_location: "dist"
```

### Environment Variables

Set these in Azure Portal → Static Web App → Configuration:

```
VITE_API_BASE_URL=https://your-backend-api.azurewebsites.net
```

### Routes Configuration

Create a `staticwebapp.config.json` file in the frontend root:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.{css,js,jpg,png,gif,svg,ico,woff,woff2,ttf,eot}"]
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "content-security-policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "text/javascript",
    ".css": "text/css"
  }
}
```

## Deployment Steps

### Using Azure Portal

1. **Create Static Web App**
   - Go to Azure Portal
   - Create new Static Web App
   - Connect to your GitHub repository
   - Select branch: `main`
   - Build presets: Custom
   - App location: `/frontend`
   - Api location: (leave empty)
   - Output location: `dist`

2. **Configure Environment Variables**
   - Go to Configuration
   - Add `VITE_API_BASE_URL`
   - Save

3. **Deploy**
   - Azure automatically deploys on push to main branch
   - Check Actions tab in GitHub for build status

### Using GitHub Actions

The workflow is automatically created by Azure. It should look like:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          api_location: ""
          output_location: "dist"
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

### Using Azure CLI

```bash
# Install Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name peerview-rg --location eastus

# Create static web app
az staticwebapp create \
  --name peerview-frontend \
  --resource-group peerview-rg \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location eastus \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist" \
  --login-with-github

# Set environment variables
az staticwebapp appsettings set \
  --name peerview-frontend \
  --setting-names VITE_API_BASE_URL=https://your-backend.azurewebsites.net
```

## Custom Domain Setup

1. **Add Custom Domain**
   - Go to Custom domains in Azure Portal
   - Add custom domain
   - Follow DNS configuration instructions

2. **Configure DNS**
   - Add CNAME record pointing to your Static Web App URL
   - Wait for DNS propagation (up to 48 hours)

3. **Enable HTTPS**
   - Azure automatically provisions SSL certificate
   - Force HTTPS redirect in configuration

## Performance Optimization

### Caching Headers

```json
{
  "routes": [
    {
      "route": "/assets/*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "route": "/index.html",
      "headers": {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    }
  ]
}
```

### Compression

Azure Static Web Apps automatically compresses:
- `.js` files
- `.css` files
- `.html` files
- `.json` files

## Monitoring

### Application Insights

1. Create Application Insights resource
2. Add instrumentation key to Static Web App
3. Monitor:
   - Page views
   - Performance
   - Errors
   - Custom events

### Logs

View logs in:
- Azure Portal → Static Web App → Logs
- Application Insights → Logs

## Troubleshooting

### Build Fails

- Check Node.js version in GitHub Actions
- Verify all dependencies are in `package.json`
- Check build logs in GitHub Actions

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Redeploy after adding variables
- Clear cache and rebuild

### Routing Issues

- Verify `staticwebapp.config.json` is in place
- Check `navigationFallback` configuration
- Ensure all routes are protected properly

### CORS Issues

- Configure CORS in backend API
- Add allowed origins in backend
- Check network tab for CORS errors

## Cost Optimization

Azure Static Web Apps pricing tiers:

- **Free**: 
  - 100 GB bandwidth/month
  - 0.5 GB storage
  - 2 custom domains

- **Standard**:
  - Unlimited bandwidth
  - 100 GB storage
  - Unlimited custom domains
  - SLA 99.95%

## Security Best Practices

1. **Use HTTPS only**
2. **Set security headers** (see config above)
3. **Implement CSP** (Content Security Policy)
4. **Enable authentication** for protected routes
5. **Regularly update dependencies**
6. **Use secrets for sensitive data**

## Backup and Recovery

1. **Git Repository**: Source of truth
2. **Azure Backup**: Automatic
3. **Rollback**: Via GitHub revert or Azure portal

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router with Static Sites](https://reactrouter.com/en/main/guides/deploying)
