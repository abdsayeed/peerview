# PeerView Backend - Getting Started

Welcome to PeerView Backend! This guide will help you get up and running quickly.

## Prerequisites

✅ Python 3.8 or higher installed
✅ Azure account with Cosmos DB and Storage Account
✅ Git (optional, for version control)

## Installation Steps

### Step 1: Install Dependencies

```powershell
.\manage.ps1 install
```

This will:
- Create a virtual environment
- Install all required packages
- Create a `.env` file from template

### Step 2: Configure Azure Credentials

Edit `.env` file with your Azure credentials:

1. **Get Cosmos DB Credentials:**
   - Go to Azure Portal → Cosmos DB Account
   - Copy `URI` to `COSMOS_ENDPOINT`
   - Copy `PRIMARY KEY` to `COSMOS_KEY`

2. **Get Storage Credentials:**
   - Go to Azure Portal → Storage Account
   - Access Keys → Copy connection string to `BLOB_CONNECTION_STRING`

3. **Set Secret Key:**
   - Generate a random secret: `[System.Guid]::NewGuid().ToString()`
   - Set it as `SECRET_KEY`

### Step 3: Verify Setup

```powershell
.\manage.ps1 verify
```

This checks:
- Python version
- Dependencies
- Environment configuration
- Azure connections

### Step 4: Start the Server

```powershell
.\manage.ps1 start
```

Server will start at: `http://localhost:5000`

### Step 5: Test the API (Optional)

In a new terminal:

```powershell
.\manage.ps1 test
```

## Quick Commands

| Command | Description |
|---------|-------------|
| `.\manage.ps1 install` | Install all dependencies |
| `.\manage.ps1 verify` | Verify setup and configuration |
| `.\manage.ps1 start` | Start the Flask server |
| `.\manage.ps1 test` | Run integration tests |
| `.\manage.ps1 clean` | Clean cache and temp files |
| `.\manage.ps1 help` | Show all commands |

## First API Calls

### 1. Health Check
```powershell
curl http://localhost:5000/
```

### 2. Register Admin User
```powershell
$body = @{
    email = "admin@peerview.com"
    password = "Admin123"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 3. Login and Get Token
```powershell
$loginBody = @{
    email = "admin@peerview.com"
    password = "Admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.data.token
Write-Host "Token: $token"
```

### 4. Use Token for Protected Endpoints
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/admin/all" `
    -Method Get `
    -Headers $headers
```

## Project Structure

```
PeerView/
├── app.py              # Main application
├── config.py           # Configuration
├── controllers/        # API endpoints
├── services/           # Azure services
├── models/             # Data models
├── utils/              # Helper functions
├── tests/              # Test suite
└── examples/           # API examples
```

## Common Issues

### Issue: "Import module not found"
**Solution:** Activate virtual environment
```powershell
.\venv\Scripts\Activate.ps1
```

### Issue: "Cosmos DB connection failed"
**Solution:** Check your `.env` file:
- Verify `COSMOS_ENDPOINT` is correct
- Verify `COSMOS_KEY` is correct
- Check Azure Cosmos DB firewall settings

### Issue: "Blob Storage upload failed"
**Solution:** Check your `.env` file:
- Verify `BLOB_CONNECTION_STRING` is correct
- Ensure container `media` exists or will be auto-created

### Issue: "Token expired"
**Solution:** Tokens expire after 15 minutes. Login again to get a new token.

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure Azure credentials
3. ✅ Verify setup
4. ✅ Start server
5. ✅ Test API endpoints
6. 📖 Read `examples/API_USAGE.md` for detailed API documentation
7. 🚀 Deploy to Azure (see `DEPLOYMENT.md`)

## Documentation

- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Project overview
- `QUICKSTART.md` - Quick start guide
- `DEPLOYMENT.md` - Deployment instructions
- `examples/API_USAGE.md` - API usage examples

## Support

Need help? Check:
1. Run `.\manage.ps1 verify` to diagnose issues
2. Check server logs for error details
3. Review documentation files
4. Ensure all Azure services are configured

## Development Workflow

```powershell
# Daily workflow
.\manage.ps1 start          # Start development server
# Make changes to code
# Test in browser/Postman
.\manage.ps1 test           # Run tests
.\manage.ps1 clean          # Clean up (optional)
```

Happy coding! 🚀
