# Keep backend running and restart on crash
$ErrorActionPreference = "Continue"

Write-Host "Starting PeerView Backend..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    try {
        python run.py
    }
    catch {
        Write-Host "Backend crashed. Restarting in 2 seconds..." -ForegroundColor Red
        Start-Sleep -Seconds 2
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Backend stopped with exit code $LASTEXITCODE. Restarting..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}
