from app import create_app
from app.config import config
import os

env = os.getenv('FLASK_ENV', 'development')
app = create_app(config[env])

if __name__ == '__main__':
    print("\n" + "="*60)
    print("📡 Registered API Endpoints:")
    print("="*60)
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            methods = ','.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
            print(f"{methods:8} {rule.rule}")
    print("="*60 + "\n")
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )
