from passlib.hash import argon2
import requests
import json


def add_user(email, password):
    hashed_password = hash_password(password)
    data = {
        "email": email,
        "password": hashed_password
    }
    print(data)
    headers = {'Content-type': 'application/json'}
    resp = requests.post('http://api:5001/userValidate/', headers=headers, data=json.dumps(data))
    return resp


def check_email(email):
    data = {
        "email": email
    }
    headers = {'Content-type': 'application/json'}
    resp = requests.get('http://api:5001/userValidate/', headers=headers, data=json.dumps(data))
    if resp.status_code == 404:
        return False
    return True


def validate_password(email, password):
    if check_email(email):
        data = {
            "email": email
        }
        headers = {'Content-type': 'application/json'}
        resp = requests.get('http://api:5001/userValidate/', headers=headers, data=json.dumps(data))
        db_password = resp.json()['password']
        if argon2.verify(password, db_password):
            return True
    return False


def hash_password(password):
    return argon2.using(rounds=10).hash(password)
