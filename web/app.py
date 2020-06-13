import json
from functools import wraps

import requests
from flask import Flask, session, redirect, url_for, render_template, make_response, flash

import tokens
import user
from config import Config
from flask_wtf import CSRFProtect

from forms import RegisterForm, LoginForm, UserDataForm, ProductForm

app = Flask(__name__)
app.config.from_object(Config)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = Config.SECRET_KEY
app.config['WTF_CSRF_SECRET_KEY'] = Config.CSRF_SECRET_KEY
csrf.init_app(app)


def authorize(f):
    @wraps(f)
    def decorated_function(*args, **kws):
        if not 'username' in session:
            return redirect(url_for('login'))
        return f(*args, **kws)

    return decorated_function


@app.route('/')
@app.route('/index')
@authorize
def index():
    user_id = session['id']
    #token = tokens.create_day_list_token(user_id)
    token = 0
    headers = {
        'Authorization': token
    }
    """user_resp = requests.get('http://api:5001/user/' + str(id))
    if user_resp.status_code == 200:
        user_resp = user_resp.json()
    day_resp = requests.get('http://api:5001/user/' + str(id) + '/day', headers=headers)
    if day_resp.status_code == 200:
        return "Hello"
    else:
        flash(day_resp.content.decode(), 'warning')"""
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        data = {
            "email": email
        }
        headers = {
            'Content-type': 'application/json'
        }
        resp = requests.get('http://api:5001/userValidate/', headers=headers, data=json.dumps(data))
        data = json.loads(resp.content)
        session['id'] = data['id']
        session['username'] = email
        if int(data['first_login']) == 1:
            response = make_response(redirect(url_for('user_data')))
        else:
            response = make_response(redirect(url_for('index')))
        return response
    return render_template('login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'username' in session:
        return redirect(url_for('index'))
    form = RegisterForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        response = make_response(redirect(url_for('login')))
        resp = user.add_user(email, password)
        if resp.status_code == 200:
            flash(resp.content.decode(), 'success')
        else:
            flash(resp.content.decode(), 'warning')
        return response
    return render_template('register.html', form=form)


@app.route('/logout')
@authorize
def logout():
    session.pop('username', None)
    session.pop('id', None)
    return redirect(url_for('login'))


@app.route('/user_data', methods=['GET', 'POST'])
def user_data():
    form = UserDataForm()
    if form.validate_on_submit():
        response = make_response(redirect(url_for('index')))
        user_id = session['id']
        data = {
            'id': user_id,
            'email': session['username'],
            'age': form.age.data,
            'sex': form.sex.data,
            'first_login': 0,
            'weight': form.weight.data,
            'height': form.height.data,
            'kcal': form.kcal.data,
            'protein': form.protein.data,
            'carbohydrates': form.carbohydrates.data,
            'fats': form.fats.data,
            'water': form.water.data,
            'steps': form.steps.data
        }
        headers = {
            'Content-type': 'application/json'
        }
        resp = requests.patch('http://api:5001/user/' + str(user_id), headers=headers, data=json.dumps(data))
        if resp.status_code == 200:
            flash(resp.content.decode(), 'success')
        else:
            flash(resp.content.decode(), 'warning')
        return response
    return render_template('user_data.html', form=form)


@app.route('/product_create', methods=['GET', 'POST'])
@authorize
def product_create():
    form = ProductForm()
    if form.validate_on_submit():
        user_id = session['id']
        response = make_response(redirect(url_for('index')))
        token = tokens.create_product_add_token(user_id)
        data = {
            'user_id': user_id,
            'name': form.name.data,
            'manufacturer': form.manufacturer.data,
            'kcal': form.kcal.data,
            'protein': form.protein.data,
            'carbohydrates': form.carbohydrates.data,
            'fats': form.fats.data
        }
        headers = {
            'Content-type': 'application/json',
            'Authorization': token
        }
        resp = requests.post('http://api:5001/product/', headers=headers, data=json.dumps(data))
        if resp.status_code == 200:
            flash(resp.content.decode(), 'success')
        else:
            flash(resp.content.decode(), 'warning')
        return response
    return render_template('product_create.html', form=form)


@app.route('/product_update', methods=['GET', 'POST'])
@authorize
def product_update():
    form = ProductForm()
    if form.validate_on_submit():
        user_id = session['id']
        product_id = 0
        response = make_response(redirect(url_for('index')))
        token = tokens.create_product_update_token(user_id, product_id)
        data = {
            'user_id': user_id,
            'product_id': product_id,
            'name': form.name.data,
            'manufacturer': form.manufacturer.data,
            'kcal': form.kcal.data,
            'protein': form.protein.data,
            'carbohydrates': form.carbohydrates.data,
            'fats': form.fats.data
        }
        headers = {
            'Content-type': 'application/json',
            'Authorization': token
        }
        resp = requests.put('http://api:5001/product/', headers=headers, data=json.dumps(data))
        if resp.status_code == 200:
            flash(resp.content.decode(), 'success')
        else:
            flash(resp.content.decode(), 'warning')
        return response
    return render_template('product_create.html', form=form)


@app.route('/product_delete', methods=['POST'])
@authorize
def product_delete():
    user_id = session['id']
    product_id = 0
    response = make_response(redirect(url_for('index')))
    token = tokens.create_product_delete_token(user_id, product_id)
    data = {
        'user_id': user_id,
        'product_id': product_id
    }
    headers = {
        'Content-type': 'application/json',
        'Authorization': token
    }
    resp = requests.delete('http://api:5001/product/' + str(product_id), headers=headers, data=json.dumps(data))
    if resp.status_code == 200:
        flash(resp.content.decode(), 'success')
    else:
        flash(resp.content.decode(), 'warning')
    return response


if __name__ == '__main__':
    app.run()
