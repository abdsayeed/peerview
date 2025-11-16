# Azure Cosmos DB & Blob Storage Setup Guide

## 📋 Prerequisites
- Azure account (free tier works!)
- Azure Portal access: https://portal.azure.com

---

## 🗄️ Step 1: Create Azure Cosmos DB

### 1.1 Create Cosmos DB Account
1. Go to **Azure Portal** → Click **"Create a resource"**
2. Search for **"Azure Cosmos DB"**
3. Select **"Azure Cosmos DB for NoSQL"** → Click **"Create"**

### 1.2 Configure Settings
```
Subscription: [Your subscription]
Resource Group: peerview-rg (create new)
Account Name: peerview-cosmos-db (must be globally unique)
Location: East US (or closest to you)
Capacity mode: Serverless ⭐ (free tier friendly)
```

### 1.3 Get Credentials
1. After deployment, go to your Cosmos DB account
2. Click **"Keys"** in the left menu
3. Copy these values:
   - **URI** → Your `COSMOS_ENDPOINT`
   - **PRIMARY KEY** → Your `COSMOS_KEY`

**Example:**
```
COSMOS_ENDPOINT=https://peerview-cosmos-db.documents.azure.com:443/
COSMOS_KEY=ABC123xyz789yourLongKeyHere==
```

---

## 📦 Step 2: Create Azure Blob Storage

### 2.1 Create Storage Account
1. Go to **Azure Portal** → Click **"Create a resource"**
2. Search for **"Storage Account"**
3. Click **"Create"**

### 2.2 Configure Settings
```
Storage account name: peerviewstorage (lowercase, no special chars)
Region: East US (same as Cosmos DB)
Performance: Standard
Redundancy: LRS (Locally-redundant storage)
```

### 2.3 Create Container
1. After deployment, go to your Storage Account
2. Click **"Containers"** in the left menu
3. Click **"+ Container"**
4. Configure:
   ```
   Name: media
   Public access level: Blob (anonymous read access for blobs)
   ```
5. Click **"Create"**

### 2.4 Get Connection String
1. Click **"Access keys"** in the left menu
2. Click **"Show"** next to key1
3. Copy the **Connection string**

**Example:**
```
BLOB_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=peerviewstorage;AccountKey=yourKeyHere==;EndpointSuffix=core.windows.net
```

---

## ⚙️ Step 3: Update Your .env File

Open `.env` file and replace placeholders:

```bash
# Generate a new secret key (run in PowerShell):
# [System.Guid]::NewGuid().ToString()
SECRET_KEY=your-generated-guid-here

# From Cosmos DB "Keys" section
COSMOS_ENDPOINT=https://peerview-cosmos-db.documents.azure.com:443/
COSMOS_KEY=your-cosmos-primary-key-here
COSMOS_DATABASE=peerviewdb

# From Storage Account "Access keys"
BLOB_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=peerviewstorage;AccountKey=your-key-here==;EndpointSuffix=core.windows.net
BLOB_CONTAINER=media

# Default settings (can keep as is)
JWT_EXPIRATION_MINUTES=15
RATE_LIMIT_QUESTIONS_PER_DAY=10
RATE_LIMIT_ANSWERS_PER_MINUTE=5
```

---

## ✅ Step 4: Verify Setup

### 4.1 Activate Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

### 4.2 Run Verification Script
```powershell
.\manage.ps1 verify
```

This checks:
- ✅ Python version
- ✅ Dependencies installed
- ✅ Environment variables set
- ✅ Cosmos DB connection
- ✅ Blob Storage connection

### 4.3 Expected Output
```
✅ Python version: 3.x.x
✅ Dependencies installed
✅ Environment variables configured
✅ Cosmos DB connection successful
✅ Blob Storage connection successful

All checks passed! ✨
```

---

## 🚀 Step 5: Start Backend Server

```powershell
.\manage.ps1 start
```

Server will start at: **http://localhost:5000**

---

## 🧪 Step 6: Test the Connection

### Test 1: Health Check
```powershell
curl http://localhost:5000/
```

Expected:
```json
{
  "message": "PeerView API is running",
  "status": "healthy"
}
```

### Test 2: Register a User
```powershell
$body = @{
    email = "test@example.com"
    password = "Test123!"
    name = "Test User"
    role = "student"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

If successful, your Cosmos DB is working! ✅

### Test 3: Login
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "Test123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "Token: $($response.data.token)"
```

---

## 💰 Cost Estimates (Free Tier)

### Cosmos DB (Serverless)
- **First 1 GB storage:** FREE
- **First 400 RU/s:** FREE
- **After free tier:** ~$0.25 per million operations

### Blob Storage (LRS)
- **First 5 GB:** FREE
- **After free tier:** ~$0.018 per GB/month

**Total for development:** Basically FREE! 🎉

---

## 🔒 Security Best Practices

1. **Never commit .env to Git**
   - Already in `.gitignore` ✅

2. **Firewall Settings**
   - Cosmos DB: Allow Azure services + your IP
   - Storage: Configure as needed

3. **Rotate Keys Regularly**
   - Use Azure Key Vault for production

4. **Use Managed Identity** (Production)
   - Avoid storing keys in code

---

## 🐛 Troubleshooting

### Issue: "Cosmos DB connection failed"
**Solutions:**
1. Check firewall settings in Azure Portal
2. Verify `COSMOS_ENDPOINT` format includes `https://` and `:443/`
3. Ensure `COSMOS_KEY` has no extra spaces
4. Check if Cosmos DB account is active

### Issue: "Blob Storage upload failed"
**Solutions:**
1. Verify `BLOB_CONNECTION_STRING` is complete
2. Check if container `media` exists
3. Verify container has correct access level (Blob)
4. Check storage account firewall settings

### Issue: "Module not found" errors
**Solution:**
```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 📚 Next Steps

1. ✅ Setup Azure resources
2. ✅ Update .env file
3. ✅ Verify connections
4. ✅ Start backend server
5. 🎨 Connect frontend to backend (update API_URL in frontend config)
6. 🚀 Deploy to Azure App Service (see DEPLOYMENT.md)

---

## 🔗 Useful Links

- **Azure Portal:** https://portal.azure.com
- **Cosmos DB Docs:** https://learn.microsoft.com/en-us/azure/cosmos-db/
- **Blob Storage Docs:** https://learn.microsoft.com/en-us/azure/storage/blobs/
- **Azure Free Tier:** https://azure.microsoft.com/free/

---

## 💡 Pro Tips

1. **Use Azure CLI for faster setup:**
   ```bash
   # Install Azure CLI
   winget install Microsoft.AzureCLI
   
   # Login
   az login
   
   # Create resources
   az cosmosdb create --name peerview-cosmos-db --resource-group peerview-rg
   az storage account create --name peerviewstorage --resource-group peerview-rg
   ```

2. **Monitor costs:**
   - Azure Portal → Cost Management + Billing
   - Set up budget alerts

3. **Backup data:**
   - Cosmos DB has automatic backups
   - Export important data regularly

---

**Need Help?** Run `.\manage.ps1 verify` to diagnose issues! 🛠️
