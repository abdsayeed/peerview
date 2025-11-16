import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    COSMOS_ENDPOINT = os.getenv('COSMOS_ENDPOINT')
    COSMOS_KEY = os.getenv('COSMOS_KEY')
    COSMOS_DATABASE = os.getenv('COSMOS_DATABASE', 'peerviewdb')
    BLOB_CONNECTION_STRING = os.getenv('BLOB_CONNECTION_STRING')
    BLOB_CONTAINER = os.getenv('BLOB_CONTAINER', 'media')
    JWT_EXPIRATION_MINUTES = int(os.getenv('JWT_EXPIRATION_MINUTES', 15))
    RATE_LIMIT_QUESTIONS_PER_DAY = int(os.getenv('RATE_LIMIT_QUESTIONS_PER_DAY', 10))
    RATE_LIMIT_ANSWERS_PER_MINUTE = int(os.getenv('RATE_LIMIT_ANSWERS_PER_MINUTE', 5))
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    TESTING = True
    DEBUG = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
