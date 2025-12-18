# Azure App Service Setup Guide

## Current Status
✅ GitHub Actions configured
✅ Backend code deployed
❌ Startup command needs configuration

## Fix the 403 Error

### Set Startup Command in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service: `peerview-backend-cpeff0b9eqhdanar`
3. Go to **Configuration** → **General settings**
4. Set **Startup Command** to:
   ```bash
   gunicorn app:app --bind=0.0.0.0:8000 --timeout 600
   ```
5. Click **Save**
6. Wait 30-60 seconds for the app to restart
7. Test: https://peerview-backend-cpeff0b9eqhdanar.switzerlandnorth-01.azurewebsites.net/health

## Verify Configuration

### 1. Check app.py
✅ Located at: `backend/app.py`
✅ Contains: `app = Flask(__name__)`

### 2. Check requirements.txt
✅ Located at: `backend/requirements.txt`
✅ Contains: `flask` and `gunicorn`

### 3. Environment Variables
Go to **Configuration** → **Application settings** and verify:
- `AZURE_COSMOS_ENDPOINT`
- `AZURE_COSMOS_KEY`
- `AZURE_STORAGE_CONNECTION_STRING`
- `JWT_SECRET_KEY`
- `APPINSIGHTS_INSTRUMENTATION_KEY` (optional)

## Monitor Logs

After setting the startup command:
1. Go to **Monitoring** → **Log stream**
2. Look for:
   - `Starting gunicorn`
   - `Booting worker`
   - `Listening at: http://0.0.0.0:8000`

## Test Endpoints

Once running, test these:
- Health: `/health`
- Register: `POST /v1/auth/register`
- Login: `POST /v1/auth/login`
- Questions: `GET /v1/questions`

## Deployment URL
https://peerview-backend-cpeff0b9eqhdanar.switzerlandnorth-01.azurewebsites.net
