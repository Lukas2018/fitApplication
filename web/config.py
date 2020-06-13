import os

from dotenv import load_dotenv

load_dotenv()


class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET = os.getenv('JWT_SECRET')
    CSRF_SECRET_KEY = os.getenv('CSRF_SECRET_KEY')
