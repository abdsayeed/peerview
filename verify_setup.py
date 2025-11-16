import sys
import os
from colorama import init, Fore, Style

init(autoreset=True)

def check_python_version():
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"{Fore.GREEN}✓ Python {version.major}.{version.minor}.{version.micro} (Compatible)")
        return True
    else:
        print(f"{Fore.RED}✗ Python {version.major}.{version.minor}.{version.micro} (Requires 3.8+)")
        return False

def check_dependencies():
    print(f"\n{Fore.CYAN}Checking dependencies...")
    required = [
        'flask', 'flask_cors', 'jwt', 'bcrypt', 
        'azure.cosmos', 'azure.storage.blob', 'dotenv'
    ]
    missing = []
    
    for package in required:
        try:
            if package == 'dotenv':
                __import__('dotenv')
            elif package == 'flask_cors':
                __import__('flask_cors')
            elif package == 'jwt':
                __import__('jwt')
            else:
                __import__(package)
            print(f"{Fore.GREEN}✓ {package}")
        except ImportError:
            print(f"{Fore.RED}✗ {package}")
            missing.append(package)
    
    if missing:
        print(f"\n{Fore.YELLOW}Missing dependencies. Run: pip install -r requirements.txt")
        return False
    return True

def check_env_file():
    print(f"\n{Fore.CYAN}Checking environment configuration...")
    
    if not os.path.exists('.env'):
        print(f"{Fore.RED}✗ .env file not found")
        print(f"{Fore.YELLOW}  Copy .env.example to .env and configure it")
        return False
    
    print(f"{Fore.GREEN}✓ .env file exists")
    
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = [
        'SECRET_KEY', 'COSMOS_ENDPOINT', 'COSMOS_KEY', 
        'COSMOS_DATABASE', 'BLOB_CONNECTION_STRING', 'BLOB_CONTAINER'
    ]
    
    missing_vars = []
    placeholder_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            print(f"{Fore.RED}✗ {var} not set")
            missing_vars.append(var)
        elif 'your-' in value or 'change' in value.lower():
            print(f"{Fore.YELLOW}⚠ {var} contains placeholder value")
            placeholder_vars.append(var)
        else:
            print(f"{Fore.GREEN}✓ {var} configured")
    
    if missing_vars:
        print(f"\n{Fore.RED}Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    if placeholder_vars:
        print(f"\n{Fore.YELLOW}Warning: Update placeholder values for: {', '.join(placeholder_vars)}")
        return True
    
    return True

def check_project_structure():
    print(f"\n{Fore.CYAN}Checking project structure...")
    
    required_dirs = ['app', 'app/routes', 'app/services', 'app/models', 'app/utils', 'tests', 'docs']
    required_files = ['run.py', 'app/__init__.py', 'app/config.py', 'requirements.txt', 'README.md']
    
    all_good = True
    
    for directory in required_dirs:
        if os.path.isdir(directory):
            print(f"{Fore.GREEN}✓ {directory}/")
        else:
            print(f"{Fore.RED}✗ {directory}/")
            all_good = False
    
    for file in required_files:
        if os.path.isfile(file):
            print(f"{Fore.GREEN}✓ {file}")
        else:
            print(f"{Fore.RED}✗ {file}")
            all_good = False
    
    return all_good

def test_azure_connections():
    print(f"\n{Fore.CYAN}Testing Azure connections...")
    
    try:
        from app.services.cosmos_service import cosmos_service
        cosmos_service.initialize()
        print(f"{Fore.GREEN}✓ Cosmos DB connection successful")
        cosmos_ok = True
    except Exception as e:
        print(f"{Fore.RED}✗ Cosmos DB connection failed: {str(e)}")
        cosmos_ok = False
    
    try:
        from app.services.blob_service import blob_service
        blob_service.initialize()
        print(f"{Fore.GREEN}✓ Blob Storage connection successful")
        blob_ok = True
    except Exception as e:
        print(f"{Fore.RED}✗ Blob Storage connection failed: {str(e)}")
        blob_ok = False
    
    return cosmos_ok and blob_ok

def main():
    print(f"{Fore.CYAN}{Style.BRIGHT}")
    print("=" * 60)
    print("       PeerView Backend - Setup Verification")
    print("=" * 60)
    print(Style.RESET_ALL)
    
    checks = []
    
    checks.append(("Python Version", check_python_version()))
    checks.append(("Dependencies", check_dependencies()))
    checks.append(("Environment Config", check_env_file()))
    checks.append(("Project Structure", check_project_structure()))
    
    if checks[1][1] and checks[2][1]:
        checks.append(("Azure Connections", test_azure_connections()))
    else:
        print(f"\n{Fore.YELLOW}⚠ Skipping Azure connection tests (fix above issues first)")
    
    print(f"\n{Fore.CYAN}{Style.BRIGHT}")
    print("=" * 60)
    print("                    Summary")
    print("=" * 60)
    print(Style.RESET_ALL)
    
    passed = sum(1 for _, result in checks if result)
    total = len(checks)
    
    for check_name, result in checks:
        status = f"{Fore.GREEN}PASS" if result else f"{Fore.RED}FAIL"
        print(f"{check_name:.<40} {status}")
    
    print(f"\n{Fore.CYAN}Result: {passed}/{total} checks passed")
    
    if passed == total:
        print(f"\n{Fore.GREEN}{Style.BRIGHT}✓ All checks passed! Ready to run the application.")
        print(f"\n{Fore.CYAN}Start the server with: {Fore.WHITE}python app.py")
    else:
        print(f"\n{Fore.YELLOW}⚠ Some checks failed. Fix the issues above before running.")
    
    print(Style.RESET_ALL)

if __name__ == '__main__':
    main()
