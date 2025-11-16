import unittest
from app import create_app
from app.services.cosmos_service import cosmos_service
import json

class TestAuthEndpoints(unittest.TestCase):
    def setUp(self):
        app = create_app()
        self.app = app.test_client()
        self.app.testing = True
    
    def test_health_check(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
    
    def test_register_missing_fields(self):
        response = self.app.post('/auth/register',
                                 data=json.dumps({}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 422)
    
    def test_register_invalid_email(self):
        response = self.app.post('/auth/register',
                                 data=json.dumps({
                                     'email': 'invalid-email',
                                     'password': 'Test1234',
                                     'role': 'student'
                                 }),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 422)
    
    def test_register_weak_password(self):
        response = self.app.post('/auth/register',
                                 data=json.dumps({
                                     'email': 'test@example.com',
                                     'password': 'weak',
                                     'role': 'student'
                                 }),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 422)
    
    def test_login_missing_fields(self):
        response = self.app.post('/auth/login',
                                 data=json.dumps({}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 422)

class TestValidation(unittest.TestCase):
    def test_email_validation(self):
        from app.utils.validators import validate_email_format, ValidationError
        
        with self.assertRaises(ValidationError):
            validate_email_format('invalid-email')
        
        self.assertTrue(validate_email_format('test@example.com'))
    
    def test_password_validation(self):
        from app.utils.validators import validate_password_strength, ValidationError
        
        with self.assertRaises(ValidationError):
            validate_password_strength('weak')
        
        self.assertTrue(validate_password_strength('Strong123'))
    
    def test_role_validation(self):
        from app.utils.validators import validate_role, ValidationError
        
        with self.assertRaises(ValidationError):
            validate_role('invalid_role')
        
        self.assertTrue(validate_role('student'))
        self.assertTrue(validate_role('teacher'))
        self.assertTrue(validate_role('admin'))

class TestJWT(unittest.TestCase):
    def test_token_generation(self):
        from app.utils.jwt_helper import generate_token, decode_token
        
        token = generate_token('user123', 'test@example.com', 'student')
        self.assertIsNotNone(token)
        
        payload = decode_token(token)
        self.assertEqual(payload['userId'], 'user123')
        self.assertEqual(payload['email'], 'test@example.com')
        self.assertEqual(payload['role'], 'student')
    
    def test_invalid_token(self):
        from app.utils.jwt_helper import decode_token
        
        payload = decode_token('invalid.token.here')
        self.assertIsNone(payload)

class TestPasswordHashing(unittest.TestCase):
    def test_password_hashing(self):
        from app.utils.password_helper import hash_password, verify_password
        
        password = 'TestPassword123'
        hashed = hash_password(password)
        
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password('WrongPassword', hashed))

if __name__ == '__main__':
    unittest.main()
