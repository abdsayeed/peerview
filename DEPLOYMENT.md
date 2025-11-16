## Deployment Guide for Azure

### Azure App Service Deployment

#### 1. Create Azure Resources

**Create Resource Group:**
```bash
az group create --name peerview-rg --location eastus
```

**Create Cosmos DB Account:**
```bash
az cosmosdb create \
  --name peerview-cosmos \
  --resource-group peerview-rg \
  --kind GlobalDocumentDB \
  --locations regionName=eastus failoverPriority=0 \
  --default-consistency-level Session
```

**Create Cosmos DB Database:**
```bash
az cosmosdb sql database create \
  --account-name peerview-cosmos \
  --resource-group peerview-rg \
  --name peerviewdb
```

**Create Cosmos DB Containers:**
```bash
az cosmosdb sql container create \
  --account-name peerview-cosmos \
  --database-name peerviewdb \
  --name users \
  --partition-key-path "/email" \
  --throughput 400 \
  --resource-group peerview-rg

az cosmosdb sql container create \
  --account-name peerview-cosmos \
  --database-name peerviewdb \
  --name questions \
  --partition-key-path "/questionId" \
  --throughput 400 \
  --resource-group peerview-rg
```

**Create Storage Account:**
```bash
az storage account create \
  --name peerviewstorage \
  --resource-group peerview-rg \
  --location eastus \
  --sku Standard_LRS
```

**Create Blob Container:**
```bash
az storage container create \
  --name media \
  --account-name peerviewstorage \
  --public-access off
```

#### 2. Get Connection Strings

**Cosmos DB:**
```bash
az cosmosdb keys list \
  --name peerview-cosmos \
  --resource-group peerview-rg \
  --type connection-strings
```

**Storage Account:**
```bash
az storage account show-connection-string \
  --name peerviewstorage \
  --resource-group peerview-rg
```

#### 3. Create App Service

**Create App Service Plan:**
```bash
az appservice plan create \
  --name peerview-plan \
  --resource-group peerview-rg \
  --sku B1 \
  --is-linux
```

**Create Web App:**
```bash
az webapp create \
  --name peerview-api \
  --resource-group peerview-rg \
  --plan peerview-plan \
  --runtime "PYTHON:3.11"
```

#### 4. Configure App Settings

```bash
az webapp config appsettings set \
  --name peerview-api \
  --resource-group peerview-rg \
  --settings \
    SECRET_KEY="your-super-secret-jwt-key" \
    COSMOS_ENDPOINT="your-cosmos-endpoint" \
    COSMOS_KEY="your-cosmos-key" \
    COSMOS_DATABASE="peerviewdb" \
    BLOB_CONNECTION_STRING="your-blob-connection-string" \
    BLOB_CONTAINER="media" \
    JWT_EXPIRATION_MINUTES="15" \
    RATE_LIMIT_QUESTIONS_PER_DAY="10" \
    RATE_LIMIT_ANSWERS_PER_MINUTE="5" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"
```

#### 5. Deploy Application

**Using Azure CLI:**
```bash
az webapp up \
  --name peerview-api \
  --resource-group peerview-rg \
  --runtime PYTHON:3.11
```

**Or using Git:**
```bash
git remote add azure https://peerview-api.scm.azurewebsites.net/peerview-api.git
git push azure main
```

#### 6. Enable Always On

```bash
az webapp config set \
  --name peerview-api \
  --resource-group peerview-rg \
  --always-on true
```

#### 7. Configure Startup Command

```bash
az webapp config set \
  --name peerview-api \
  --resource-group peerview-rg \
  --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 app:app"
```

### GitHub Actions Deployment

#### 1. Get Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name peerview-api \
  --resource-group peerview-rg \
  --xml
```

#### 2. Add GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Paste the publish profile XML

#### 3. Push to Main Branch

The GitHub Actions workflow in `.github/workflows/azure-deploy.yml` will automatically deploy on push to main.

### Verify Deployment

```bash
curl https://peerview-api.azurewebsites.net/
```

### Monitor Application

**View Logs:**
```bash
az webapp log tail \
  --name peerview-api \
  --resource-group peerview-rg
```

**Enable Application Insights:**
```bash
az monitor app-insights component create \
  --app peerview-insights \
  --location eastus \
  --resource-group peerview-rg

az webapp config appsettings set \
  --name peerview-api \
  --resource-group peerview-rg \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="your-insights-connection-string"
```

### Scale Application

```bash
az appservice plan update \
  --name peerview-plan \
  --resource-group peerview-rg \
  --sku P1V2
```

### Security Checklist

- ✅ Use strong `SECRET_KEY` in production
- ✅ Enable HTTPS only
- ✅ Configure CORS with specific origins
- ✅ Set up Azure Key Vault for secrets
- ✅ Enable authentication on App Service
- ✅ Configure firewall rules on Cosmos DB
- ✅ Use private endpoints for storage
- ✅ Enable diagnostic logging
- ✅ Set up alerts and monitoring
- ✅ Regular security updates

### Cost Optimization

- Use consumption-based pricing for Cosmos DB
- Enable auto-scale on App Service
- Use CDN for static content
- Implement caching strategies
- Monitor and optimize throughput
