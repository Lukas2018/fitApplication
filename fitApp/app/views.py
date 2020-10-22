from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from app.forms import LoginForm, RegisterForm, UserDataForm, ProductForm
from app.models import Product
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout

@login_required
def index(request):
    return render(request, 'index.html')

def login(request):
    form = LoginForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(username=email, email=email, password=password)
            print(user)
            if user is not None:
                auth_login(request, user)
                if user.userprofile.first_login == 1:
                    print(user.userprofile.first_login)
                    return redirect('/user_data')
                return redirect('/index')
    context = {
        'form': form
    }
    return render(request, 'login.html')

def logout(request):
    auth_logout(request)
    return redirect('/login')

def register(request):
    form = RegisterForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = User.objects.create_user(username=email, email=email, password=password)
            return redirect('/login')
        print(form.errors)
    context = {
        'form': form
    }
    return render(request, 'register.html', context)

def user_data(request):
    form = UserDataForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = request.user
            user.userprofile.age = form.cleaned_data['age']
            user.userprofile.weight = form.cleaned_data['weight']
            user.userprofile.height = form.cleaned_data['height']
            user.userprofile.sex = form.cleaned_data['sex']
            user.userprofile.kcal = form.cleaned_data['kcal']
            user.userprofile.protein = form.cleaned_data['protein']
            user.userprofile.carbohydrates = form.cleaned_data['carbohydrates']
            user.userprofile.fats = form.cleaned_data['fats']
            user.userprofile.water = form.cleaned_data['water']
            user.userprofile.steps = form.cleaned_data['steps']
            user.userprofile.first_login = 0
            user.save()
            return redirect('/index')
    context = {
        'form': form
    }
    return render(request, 'user_data.html', context)

def user_panel(request):
    return render(request, "user_panel.html")

def product(request):
    form = ProductForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            product = Product()
            product.name = form.cleaned_data['name']
            product.manufacturer = form.cleaned_data['manufacturer']
            product.kcal = form.cleaned_data['kcal']
            product.protein = form.cleaned_data['protein']
            product.carbohydrates = form.cleaned_data['carbohydrates']
            product.fats = form.cleaned_data['fats']
            return redirect('/index')
    context = {
        'form': form
    }
    return render(request, 'product_create.html', context)


