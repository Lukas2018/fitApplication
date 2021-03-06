from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from app.forms import LoginForm, RegisterForm, UserDataForm, PasswordChangeForm, ProductForm
from app.models import Product, Day, Nutrientes, PhysicalActivity, Training, MealSet, MealType, Meal, MealProduct
from app.basic_functions import convert_seconds_to_time_string, calculate_kcal, calculate_proteins, add_zero_if_needed
from app.basic_functions import calculate_carbohydrates, calculate_fats, create_csv
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponse
import datetime
import json
import math
import csv

def redirect_if_not_user_data_fill(func):
    def wrapper(request):
        if request.user.is_authenticated:
            if request.user.userprofile.first_login == 1:
                return redirect('/user_data')
            return func(request)
        return redirect('/login')
    return wrapper

def redirect_if_user_authenticated(func):
    def wrapper(request):
        if request.user.is_authenticated:
            return redirect('/index')
        return func(request)
    return wrapper

@login_required
@redirect_if_not_user_data_fill
def index(request):
    user = request.user
    date = datetime.datetime.now()
    if request.GET.dict():
        day_param = request.GET.dict()['date']
        year = int(day_param.split('-')[0])
        month = int(day_param.split('-')[1])
        day = int(day_param.split('-')[2])
        date = datetime.date(year, month, day)
    day = user.day_set.filter(date=date).first()
    if day is None:
        previous_day = user.day_set.filter(date__lte=date).order_by('-date').first()
        next_day = user.day_set.filter(date__gte=date).order_by('date').first()
        meal_set = MealSet()
        meal_set.save()
        if previous_day is not None:
            day = Day(date=date, weight=previous_day.weight, pulse=previous_day.pulse, 
                        expected_kcal=previous_day.expected_kcal, expected_protein = previous_day.expected_protein, 
                        expected_carbohydrates = previous_day.expected_carbohydrates, expected_fats = previous_day.expected_fats,
                        expected_water = previous_day.expected_water, expected_steps = previous_day.expected_steps, 
                        meal_set=meal_set, user=user)
        elif next_day is not None:
            day = Day(date=date, weight=next_day.weight, pulse=next_day.pulse, 
                        expected_kcal=next_day.expected_kcal, expected_protein = next_day.expected_protein, 
                        expected_carbohydrates = next_day.expected_carbohydrates, expected_fats = next_day.expected_fats,
                        expected_water = next_day.expected_water, expected_steps = next_day.expected_steps, 
                        meal_set=meal_set, user=user)
        else:
            day = Day(date=date, weight=user.userprofile.weight, pulse=user.userprofile.pulse, 
                        expected_kcal=user.userprofile.kcal, expected_protein = user.userprofile.protein, 
                        expected_carbohydrates = user.userprofile.carbohydrates, expected_fats = user.userprofile.fats,
                        expected_water = user.userprofile.water, expected_steps = user.userprofile.steps, 
                        meal_set=meal_set, user=user)
        day.save()
    date = add_zero_if_needed(day.date.day) + '/' + add_zero_if_needed(day.date.month) + '/' + str(day.date.year)
    activites = PhysicalActivity.objects.all()
    empty_bottles = math.ceil((day.expected_water - day.water)/250)
    full_bottles = math.ceil(day.expected_water / 250) - empty_bottles
    trainings = day.training_set.all()
    meals = day.meal_set.meal_set.all()
    breakfast = meals.filter(meal_type=MealType.objects.filter(name='Breakfast').first()).first()
    lunch = meals.filter(meal_type=MealType.objects.filter(name='Lunch').first()).first()
    dinner = meals.filter(meal_type=MealType.objects.filter(name='Dinner').first()).first()
    others = meals.filter(meal_type=MealType.objects.filter(name='Other').first()).first()
    if breakfast is not None:
        breakfast = breakfast.mealproduct_set.all()
    if lunch is not None:
        lunch = lunch.mealproduct_set.all()
    if dinner is not None:
        dinner = dinner.mealproduct_set.all()
    if others is not None:
        others = others.mealproduct_set.all()
    context = {
        'empty_loop_times': range(1, empty_bottles + 1),
        'full_loop_times': range(1, full_bottles + 1),
        'day': day,
        'date': date,
        'workout_time': convert_seconds_to_time_string(day.activity_time),
        'activities': activites,
        'meals': meals,
        'breakfast': breakfast,
        'lunch': lunch,
        'dinner': dinner,
        'others': others,
        'trainings': trainings
    }
    return render(request, 'index.html', context)

@redirect_if_user_authenticated
def login(request):
    form = LoginForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(username=email, email=email, password=password)
            if user is not None:
                auth_login(request, user)
                if user.userprofile.first_login == 1:
                    return redirect('/user_data')
                return redirect('/index')
    context = {
        'form': form,
    }
    return render(request, 'login.html', context)

@login_required
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
    context = {
        'form': form
    }
    return render(request, 'register.html', context)

@login_required
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
            user.save()
            if user.userprofile.first_login == 1:
                user.userprofile.first_login = 0
                user.userprofile.pulse = 60
                user.save()
                meal_set = MealSet()
                meal_set.save()
                day = Day(date=datetime.datetime.now(), weight=user.userprofile.weight, pulse=user.userprofile.pulse, 
                            expected_kcal=user.userprofile.kcal, expected_protein = user.userprofile.protein, 
                            expected_carbohydrates = user.userprofile.carbohydrates, expected_fats = user.userprofile.fats,
                            expected_water = user.userprofile.water, expected_steps = user.userprofile.steps, meal_set=meal_set, user=user)
                day.save()
            else:
                day = user.day_set.filter(date=datetime.datetime.now()).first()
                day.weight = form.cleaned_data['weight']
                day.expected_kcal = form.cleaned_data['kcal']
                day.expected_protein = form.cleaned_data['protein']
                day.expected_carbohydrates = form.cleaned_data['carbohydrates']
                day.expected_fats = form.cleaned_data['fats']
                day.expected_water = form.cleaned_data['water']
                day.expected_steps = form.cleaned_data['steps']
                day.save()
                return redirect('/user_panel')
            return redirect('/index')
    if request.user.userprofile.first_login == 0:
        form = UserDataForm(initial={'sex': request.user.userprofile.sex})
    context = {
        'form': form
    }
    return render(request, 'user_data.html', context)

@login_required
def calendar(request):
    return render(request, 'calendar.html')

@login_required
def analyze(request):
    return render(request, 'analyze.html')

@login_required  
def user_panel(request):
    context = {}
    if request.GET:
        context['success'] = 1
    return render(request, 'user_panel.html', context)

@login_required
def password_change(request):
    user = request.user
    form = PasswordChangeForm(user, request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            new_password = form.cleaned_data['new_password']
            user.set_password(new_password)
            user.save()
            return redirect('/user_panel')
    context = {
        'form': form
    }
    return render(request, 'password_change.html', context)

@login_required
def product_creation(request):
    form = ProductForm(request.POST or None)
    error = 0
    if request.method == 'POST':
        if form.is_valid():
            try:
                product = Product()
                nutrientes = Nutrientes()
                product.name = form.cleaned_data['name']
                product.manufacturer = form.cleaned_data['manufacturer']
                product.user = request.user
                nutrientes.kcal = form.cleaned_data['kcal']
                nutrientes.portion = form.cleaned_data['portion']
                nutrientes.protein = form.cleaned_data['protein']
                nutrientes.carbohydrates = form.cleaned_data['carbohydrates']
                nutrientes.fats = form.cleaned_data['fats']
                nutrientes.save()
                product.nutrient = nutrientes
                product.save()
                return redirect(request.POST.get('next') + '?successful=1')
            except:
                error = 1
    context = {
        'form': form,
        'error': error
    }
    return render(request, 'product_create.html', context)

@login_required
def product_operation(request, id):
    error = 0
    form = ProductForm(request.POST or None)
    product = Product.objects.filter(id=id).first()
    if product is None:
        return HttpResponse(status=404)
    if request.method == 'POST':
        if form.is_valid():
            try:
                product.name = form.cleaned_data['name']
                product.manufacturer = form.cleaned_data['manufacturer']
                product.nutrient.kcal = form.cleaned_data['kcal']
                product.nutrient.portion = form.cleaned_data['portion']
                product.nutrient.protein = form.cleaned_data['protein']
                product.nutrient.carbohydrates = form.cleaned_data['carbohydrates']
                product.nutrient.fats = form.cleaned_data['fats']
                product.nutrient.save()
                product.save()
                return redirect(request.POST.get('next') + '?successful=1')
            except:
                error = 1
    if request.method == 'DELETE':
        if request.is_ajax():
            try:
                product.delete()
            except:
                return HttpResponse(status=500)
            return HttpResponse('OK', status=200)
    context = {
        'form': form,
        'product': product,
        'is_edit': True,
        'error': error
    }
    return render(request, 'product_create.html', context)

@login_required
def meal(request):
    user = request.user
    meal_type = request.GET['meal_type']
    year = int(request.GET['date'].split('/')[2])
    month = int(request.GET['date'].split('/')[1])
    day = int(request.GET['date'].split('/')[0])
    date = datetime.date(year, month, day)
    day = user.day_set.filter(date=date).first()
    meal_set = day.meal_set
    meal = meal_set.meal_set.filter(meal_type=MealType.objects.filter(name=meal_type).first()).first()
    if meal is None:
        meal = Meal(meal_type=MealType.objects.filter(name=meal_type).first(), meal_set=meal_set)
        meal.save()
    products = meal.mealproduct_set.all()
    context = {
        'meal_type': request.GET['meal_type'],
        'day': day,
        'meal': meal,
        'meal_set': meal_set,
        'date': request.GET['date'],
        'products': products
    }
    return render(request, 'meal.html', context)

@login_required
def meal_creation(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                meal_set = day.objects.filter(meal_set=MealSet.objects.filter(id=data['mealSetId']).first()).first().meal_set
                if meal_set is not None:
                    meal_type = MealType.objects.filter(name=data['mealType']).first()
                    if meal_type is not None:
                        meal = meal_set.meal_set.filter(meal_type=meal_type)
                        if meal is None:
                            meal = Meal()
                            meal.meal_type = meal_type
                            meal.meal_set = meal_set
                            meal.save()
                        products = data['products']
                        summary_kcal = 0
                        summary_protein = 0
                        summary_carbohydrates = 0
                        summary_fats = 0
                        for item in products:
                            product = Product.objects.filter(id=item['id']).first()
                            if product is not None:
                                portion = float(item['portion'])
                                kcal = calculate_kcal(product.id, portion)
                                protein = calculate_proteins(product.id, portion)
                                carbohydrates = calculate_carbohydrates(product.id, portion)
                                fats = calculate_fats(product.id, portion)
                                try:
                                    meal_product = MealProduct()
                                    meal_product.meal = meal
                                    meal_product.product = product
                                    meal_product.portion = portion
                                    meal_product.kcal = kcal
                                    meal_product.protein = protein
                                    meal_product.carbohydrates = carbohydrates
                                    meal_product.fats = fats
                                    meal_product.save()
                                except:
                                    return HttpResponse('Server error occured', status=500)
                                summary_kcal = summary_kcal + kcal
                                summary_protein = summary_protein + protein
                                summary_carbohydrates = summary_carbohydrates + carbohydrates
                                summary_fats = summary_fats + fats
                        try:
                            meal.summary_kcal = summary_kcal
                            meal.summary_protein = summary_protein
                            meal.summary_carbohydrates = summary_carbohydrates
                            meal.summary_fats = summary_fats
                            meal.save()
                        except:
                            return HttpResponse('Server error occured', status=500)
                        return HttpResponse('OK', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def meal_operation(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                meal_set = MealSet.objects.filter(id=int(data['mealSetId'])).first()
                if day.meal_set == meal_set:
                    meal = Meal.objects.filter(id=int(data['mealId']), meal_set=meal_set).first()
                    if meal is not None:
                        meal_product = meal.mealproduct_set.filter(id=int(data['mealProductId'])).first()
                        if meal_product is not None:
                            kcal = float(data['kcal'])
                            portion = float(data['portion'])
                            protein = float(data['protein'])
                            carbohydrates = float(data['carbohydrates'])
                            fats = float(data['fats'])
                            try:
                                meal.summary_kcal = round(meal.summary_kcal - meal_product.kcal + kcal, 1)
                                meal.summary_portion = round(meal.summary_portion - meal_product.portion + portion, 1)
                                meal.summary_protein = round(meal.summary_protein - meal_product.protein + protein, 1)
                                meal.summary_carbohydrates = round(meal.summary_carbohydrates - meal_product.carbohydrates + carbohydrates, 1)
                                meal.summary_fats = round(meal.summary_fats - meal_product.fats + fats, 1)
                                day.summary_kcal = round(day.summary_kcal - meal_product.kcal + kcal, 1)
                                day.summary_protein = round(day.summary_protein - meal_product.protein + protein, 1)
                                day.summary_carbohydrates = round(day.summary_carbohydrates - meal_product.carbohydrates + carbohydrates, 1)
                                day.summary_fats = round(day.summary_fats - meal_product.fats + fats, 1)
                                meal_product.kcal = kcal
                                meal_product.portion = portion
                                meal_product.protein = protein
                                meal_product.carbohydrates = carbohydrates
                                meal_product.fats = fats
                                meal.save()
                                day.save()
                                meal_product.save()
                            except:
                                return HttpResponse('Server error occured', status=500)
                            return HttpResponse('Ok', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)


@login_required
def delete_product_from_meal(request):
    if request.is_ajax():
        if request.method == 'DELETE':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                meal_set = MealSet.objects.filter(id=int(data['mealSetId'])).first()
                if day.meal_set == meal_set:
                    meal = Meal.objects.filter(id=int(data['mealId']), meal_set=meal_set).first()
                    if meal is not None:
                        meal_product = meal.mealproduct_set.filter(id=int(data['mealProductId'])).first()
                        if meal_product is not None:
                            try:
                                meal.summary_kcal = round(meal.summary_kcal - meal_product.kcal, 1)
                                meal.summary_portion = round(meal.summary_portion - meal_product.portion, 1)
                                meal.summary_protein = round(meal.summary_protein - meal_product.protein, 1)
                                meal.summary_carbohydrates = round(meal.summary_carbohydrates - meal_product.carbohydrates, 1)
                                meal.summary_fats = round(meal.summary_fats - meal_product.fats, 1)
                                day.summary_kcal = round(day.summary_kcal - meal_product.kcal, 1)
                                day.summary_protein = round(day.summary_protein - meal_product.protein, 1)
                                day.summary_carbohydrates = round(day.summary_carbohydrates - meal_product.carbohydrates, 1)
                                day.summary_fats = round(day.summary_fats - meal_product.fats, 1)
                                meal.save()
                                day.save()
                                meal_product.delete()
                            except:
                                return HttpResponse('Server error occured', status=500)
                            return HttpResponse('Ok', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def save_index_data(request):
    if request.method == 'POST':
        user = request.user
        data = request._post
        year = int(data['date'].split('-')[0])
        month = int(data['date'].split('-')[1])
        day = int(data['date'].split('-')[2])
        date = datetime.date(year, month, day)
        day = user.day_set.filter(date=date).first()
        if day is not None:
            try:
                user.userprofile.weight = float(data['weight'])
                user.userprofile.pulse = int(data['pulse'])
                day.weight = float(data['weight'])
                day.pulse = int(data['pulse'])
                day.water = int(data['water'])
                day.steps = int(data['steps'])
                user.save()
                day.save()
            except:
                return HttpResponse('Server error occured', status=500)
            return HttpResponse('OK', status=200)
        return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required       
def save_steps(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                try:
                    day.steps = int(data['steps'])
                    day.save()
                except:
                    return HttpResponse('Server error occured', status=500)
                return HttpResponse('OK', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required       
def save_weight(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                try:
                    user.userprofile.weight = float(data['weight'])
                    day.weight = float(data['weight'])
                    user.save()
                    day.save()
                except:
                    return HttpResponse('Server error occured', status=500)
                return HttpResponse('OK', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def save_pulse(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                try:
                    user.userprofile.pulse = int(data['pulse'])
                    day.pulse = int(data['pulse'])
                    user.save()
                    day.save()
                except:
                    return HttpResponse('Server error occured', status=500)
                return HttpResponse('OK', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def save_water(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                try:
                    day.water = int(data['water'])
                    user.save()
                    day.save()
                except:
                    return HttpResponse('Server error occured', status=500)
                return HttpResponse('OK', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def training_creation(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is not None:
                activity = PhysicalActivity.objects.filter(id=int(data['activity'])).first()
                if activity is not None:
                    training = Training()
                    try:
                        day.lose_kcal = round(day.lose_kcal + data['lose'], 1)
                        day.activity_time = round(day.activity_time + data['time'])
                        training.lose_kcal = data['lose']
                        training.notes = data['notes']
                        training.time = data['time']
                        training.day = day
                        training.physical_activity = activity
                        day.save()
                        training.save()
                    except:
                        return HttpResponse('Server error occured', status=500)
                    data = {
                        'id': training.id,
                        'activity_name': activity.name,
                        'met': activity.met,
                        'class_name': activity.image_class
                    }
                    data = json.dumps(data)
                    return HttpResponse(data, content_type='application/json', status=200)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def training_operation(request, id):
    if request.is_ajax():
        user = request.user
        data = json.loads(request.body)
        year = int(data['date'].split('-')[0])
        month = int(data['date'].split('-')[1])
        day = int(data['date'].split('-')[2])
        date = datetime.date(year, month, day)
        day = user.day_set.filter(date=date).first()
        if request.method == 'POST':
            if day is not None:
                training = Training.objects.filter(id=id, day=day).first()
                if training is not None:   
                    try:
                        day.lose_kcal = round(day.lose_kcal + data['lose'] - training.lose_kcal, 1)
                        day.activity_time = round(day.activity_time + data['time'] - training.time)
                        training.lose_kcal = data['lose']
                        training.notes = data['notes']
                        training.time = data['time']
                        training.day = day
                        day.save()
                        training.save()
                    except:
                        return HttpResponse('Server error occured', status=500)
                    return HttpResponse('OK', status=200)
                return HttpResponse(status=404)
            return HttpResponse('Bad request', status=400)
        if request.method == 'DELETE':
            if day is not None:
                training = Training.objects.filter(id=id, day=day).first()
                if training is not None:   
                    try:
                        day.lose_kcal = round(day.lose_kcal - training.lose_kcal, 1)
                        day.activity_time = round(day.activity_time - training.time)
                        day.save()
                        training.delete()
                    except:
                        return HttpResponse(status=500)
                    return HttpResponse('OK', status=200)
                return HttpResponse(status=404)
            return HttpResponse('Bad request', status=400)
    return HttpResponse('Method not allowed', status=405)

@login_required
def get_day_data(request):
    if request.is_ajax():
        if request.method == 'GET':
            user = request.user
            date = json.loads(list(request.GET.dict().keys())[0])['date']
            year = int(date.split('-')[0])
            month = int(date.split('-')[1])
            day = int(date.split('-')[2])
            day = user.day_set.filter(date=datetime.datetime(year, month, day)).first()
            if day is None:
                return HttpResponse(status=204)
            data = {
                'kcal': day.summary_kcal,
                'expected_kcal': day.expected_kcal,
                'lose_kcal': day.lose_kcal,
                'protein': day.summary_protein,
                'expected_protein': day.expected_protein,
                'carbohydrates': day.summary_carbohydrates,
                'expected_carbohydrates': day.expected_carbohydrates,
                'fats': day.summary_fats,
                'expected_fats': day.expected_fats,
                'water': day.water,
                'expected_water': day.expected_water,
                'steps': day.steps,
                'expected_steps': day.expected_steps,
                'workout': convert_seconds_to_time_string(day.activity_time),
                'weight': day.weight,
                'pulse': day.pulse,
            }
            data = json.dumps(data)
            return HttpResponse(data, content_type='application/json', status=200)
    return HttpResponse('Method not allowed', status=405)

@login_required
def get_day_specific_data(request):
    if request.is_ajax():
        if request.method == 'GET':
            user = request.user
            data = json.loads(list(request.GET.dict().keys())[0])
            left_date = data['leftDate']
            right_date = data['rightDate']
            left_year = int(left_date.split('-')[0])
            left_month = int(left_date.split('-')[1])
            left_day = int(left_date.split('-')[2])
            right_year = int(right_date.split('-')[0])
            right_month = int(right_date.split('-')[1])
            right_day = int(right_date.split('-')[2])
            data_type = data['type']
            data = {}
            last_non_null_value = user.day_set.filter(date__lte=datetime.date(left_year, left_month, left_day)).order_by('-date').first()
            start_date = datetime.date(left_year, left_month, left_day)
            end_date = datetime.date(right_year, right_month, right_day)
            delta = datetime.timedelta(days=1)
            summary = None
            expected = None
            while start_date <= end_date:
                day = user.day_set.filter(date=start_date).first()
                date = start_date.strftime("%Y-%m-%d")
                if day is not None:
                    if data_type == 'kcal':
                        summary = day.summary_kcal
                        expected = day.expected_kcal
                    elif data_type == 'protein':
                        summary = day.summary_protein
                        expected = day.expected_protein
                    elif data_type == 'carbohydrates':
                        summary = day.summary_carbohydrates,
                        expected = day.expected_carbohydrates
                    elif data_type == 'fats':
                        summary = day.summary_fats,
                        expected = day.expected_fats
                    elif data_type == 'steps':
                        summary = day.steps,
                        expected = day.expected_steps
                    elif data_type == 'workout':
                        summary = day.activity_time
                    elif data_type == 'water':
                        summary = day.water,
                        expected = day.expected_water
                    elif data_type == 'weight':
                        summary = day.weight
                    elif data_type == 'pulse':
                        summary = day.pulse
                    last_non_null_value = day
                else:
                    if last_non_null_value is not None:
                        if data_type == 'weight':
                            summary = last_non_null_value.weight
                        elif data_type == 'pulse':
                            summary = last_non_null_value.pulse
                        elif data_type == 'kcal':
                            summary = 0
                            expected = last_non_null_value.expected_kcal
                        elif data_type == 'protein':
                            summary = 0
                            expected = last_non_null_value.expected_protein
                        elif data_type == 'carbohydrates':
                            summary = 0
                            expected = last_non_null_value.expected_carbohydrates
                        elif data_type == 'fats':
                            summary = 0
                            expected = last_non_null_value.expected_fats
                        elif data_type == 'steps':
                            summary = 0
                            expected = last_non_null_value.expected_steps
                        elif data_type == 'workout':
                            summary = 0
                        elif data_type == 'water':
                            summary = 0
                            expected = last_non_null_value.expected_water
                    else:
                        if data_type != 'weight' and data_type != 'pulse':
                            summary = 0
                if summary is not None and expected is not None:
                    data[date] = {
                        'summary': summary,
                        'expected': expected
                    }
                elif summary is not None:
                    data[date] = {
                        'summary': summary
                    }
                start_date += delta
            data = json.dumps(data)
            return HttpResponse(data, content_type='application/json', status=200)
    return HttpResponse('Method not allowed', status=405)

@login_required
def get_user_products(request):
    if request.is_ajax():
        if request.method == 'GET':
            user = request.user
            data = {}
            products = Product.objects.filter(user=user)
            if products.count() == 0:
                return HttpResponse('No products', status=204)
            for product in products:
                data[product.id] = {
                    'name': product.name,
                    'manufacturer': product.manufacturer,
                    'nutrientes': {
                        'kcal': product.nutrient.kcal,
                        'protein': product.nutrient.protein,
                        'carbohydrates': product.nutrient.carbohydrates,
                        'fats': product.nutrient.fats,
                        'portion': product.nutrient.portion
                    }
                }
            data = json.dumps(data)
            return HttpResponse(data, content_type='application/json', status=200)
    return HttpResponse('Method not allowed', status=405)

@login_required
def export(request):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="export.csv"'
        writer = csv.writer(response)
        create_csv(writer, user, data)
        return response
    return HttpResponse('Method not allowed', status=405)