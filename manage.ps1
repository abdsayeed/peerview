param(
    [Parameter(Position=0)]
    [ValidateSet('start', 'test', 'verify', 'install', 'clean', 'help')]
    [string]$Command = 'help'
)

$VENV_PATH = ".\venv\Scripts\Activate.ps1"
$APP_FILE = "app.py"

function Show-Help {
    Write-Host "`n==================================" -ForegroundColor Cyan
    Write-Host "   PeerView Backend Management" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "`nUsage: .\manage.ps1 [command]`n"
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  start    " -ForegroundColor Green -NoNewline
    Write-Host "- Start the Flask application"
    Write-Host "  test     " -ForegroundColor Green -NoNewline
    Write-Host "- Run integration tests"
    Write-Host "  verify   " -ForegroundColor Green -NoNewline
    Write-Host "- Verify setup and configuration"
    Write-Host "  install  " -ForegroundColor Green -NoNewline
    Write-Host "- Install dependencies"
    Write-Host "  clean    " -ForegroundColor Green -NoNewline
    Write-Host "- Clean cache and temporary files"
    Write-Host "  help     " -ForegroundColor Green -NoNewline
    Write-Host "- Show this help message"
    Write-Host "`nExamples:" -ForegroundColor Yellow
    Write-Host "  .\manage.ps1 start"
    Write-Host "  .\manage.ps1 verify"
    Write-Host "  .\manage.ps1 test`n"
}

function Start-App {
    Write-Host "`n🚀 Starting PeerView Backend...`n" -ForegroundColor Cyan
    
    if (-not (Test-Path $VENV_PATH)) {
        Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
        Write-Host "   Run: .\manage.ps1 install`n" -ForegroundColor Yellow
        return
    }
    
    if (-not (Test-Path ".env")) {
        Write-Host "❌ .env file not found!" -ForegroundColor Red
        Write-Host "   Copy .env.example to .env and configure it`n" -ForegroundColor Yellow
        return
    }
    
    & $VENV_PATH
    Write-Host "✓ Virtual environment activated" -ForegroundColor Green
    Write-Host "✓ Starting Flask server...`n" -ForegroundColor Green
    
    python $APP_FILE
}

function Run-Tests {
    Write-Host "`n🧪 Running Integration Tests...`n" -ForegroundColor Cyan
    
    if (-not (Test-Path $VENV_PATH)) {
        Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
        Write-Host "   Run: .\manage.ps1 install`n" -ForegroundColor Yellow
        return
    }
    
    & $VENV_PATH
    
    Write-Host "⚠️  Make sure the server is running in another terminal!" -ForegroundColor Yellow
    Write-Host "   Start server with: .\manage.ps1 start`n" -ForegroundColor Yellow
    
    Start-Sleep -Seconds 2
    
    python test_api.py
}

function Verify-Setup {
    Write-Host "`n🔍 Verifying Setup...`n" -ForegroundColor Cyan
    
    if (-not (Test-Path $VENV_PATH)) {
        Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
        Write-Host "   Run: .\manage.ps1 install`n" -ForegroundColor Yellow
        return
    }
    
    & $VENV_PATH
    python verify_setup.py
}

function Install-Dependencies {
    Write-Host "`n📦 Installing Dependencies...`n" -ForegroundColor Cyan
    
    if (-not (Test-Path "venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv venv
        Write-Host "✓ Virtual environment created`n" -ForegroundColor Green
    }
    
    & $VENV_PATH
    Write-Host "✓ Virtual environment activated" -ForegroundColor Green
    
    Write-Host "`nUpgrading pip..." -ForegroundColor Yellow
    python -m pip install --upgrade pip --quiet
    
    Write-Host "Installing requirements..." -ForegroundColor Yellow
    pip install -r requirements.txt
    
    Write-Host "`n✓ Dependencies installed successfully!`n" -ForegroundColor Green
    
    if (-not (Test-Path ".env")) {
        Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "✓ .env file created" -ForegroundColor Green
        Write-Host "⚠️  Configure .env with your Azure credentials`n" -ForegroundColor Yellow
    }
}

function Clean-Project {
    Write-Host "`n🧹 Cleaning Project...`n" -ForegroundColor Cyan
    
    $cleanItems = @(
        "__pycache__",
        "*.pyc",
        "*.pyo",
        "*.log",
        ".pytest_cache",
        "*.egg-info",
        "dist",
        "build"
    )
    
    foreach ($item in $cleanItems) {
        if ($item -like "*.*") {
            Get-ChildItem -Recurse -Filter $item | ForEach-Object {
                Remove-Item $_.FullName -Force
                Write-Host "✓ Removed: $($_.FullName)" -ForegroundColor Green
            }
        } else {
            Get-ChildItem -Recurse -Directory -Filter $item | ForEach-Object {
                Remove-Item $_.FullName -Recurse -Force
                Write-Host "✓ Removed: $($_.FullName)" -ForegroundColor Green
            }
        }
    }
    
    Write-Host "`n✓ Project cleaned successfully!`n" -ForegroundColor Green
}

switch ($Command) {
    'start' { Start-App }
    'test' { Run-Tests }
    'verify' { Verify-Setup }
    'install' { Install-Dependencies }
    'clean' { Clean-Project }
    'help' { Show-Help }
    default { Show-Help }
}
