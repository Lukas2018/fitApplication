from jwt import encode
import datetime
from config import Config

JWT_SECRET = Config.JWT_SECRET
JWT_SESSION_TIME = 5


def create_day_list_token(user_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'day': datetime.datetime.now(),
        'list': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_meal_detail_token(user_id, meal_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'meal': meal_id,
        'detail': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_meal_save_token(user_id, meal_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'meal': meal_id,
        'save': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_dish_list_token(user_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'dish': True,
        'list': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_dish_add_token(user_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'dish': True,
        'add': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_dish_update_token(user_id, dish_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'dish': dish_id,
        'update': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_dish_delete_token(user_id, dish_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'dish': dish_id,
        'delete': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_dish_detail_token(user_id, dish_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'dish': dish_id,
        'detail': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_product_list_token(user_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'product': True,
        'list': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_product_add_token(user_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'product': True,
        'add': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_product_update_token(user_id, product_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'product': product_id,
        'update': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_product_delete_token(user_id, product_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'product': product_id,
        'delete': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()


def create_product_detail_token(user_id, product_id):
    exp = datetime.datetime.now() + datetime.timedelta(minutes=JWT_SESSION_TIME)
    payload = {
        'iss': 'web',
        'exp': exp,
        'user': user_id,
        'product': product_id,
        'detail': True
    }
    return encode(payload, JWT_SECRET, 'HS256').decode()