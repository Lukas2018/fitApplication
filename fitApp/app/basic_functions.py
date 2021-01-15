import math
import csv
import datetime
from app.models import Product, Day

def convert_seconds_to_time_string(seconds):
    hours = math.floor(seconds/3600)
    minutes = math.floor((seconds % 3600) / 60)
    seconds = seconds - hours * 3600 - minutes * 60
    result = add_zero_if_needed(hours) + ':' + add_zero_if_needed(minutes) + ':' + add_zero_if_needed(seconds)
    return result

def add_zero_if_needed(time):
    if time < 10:
        return '0' + str(time)
    return str(time)

def calculate_kcal(product_id, portion):
    product = Product.objects.filter(id=product_id).first()
    factor = round(portion/product.nutrient.portion, 3)
    kcal = round(factor * product.nutrient.kcal, 1)
    return kcal
    
def calculate_proteins(product_id, portion):
    product = Product.objects.filter(id=product_id).first()
    factor = round(portion/product.nutrient.portion, 3)
    protein = round(factor * product.nutrient.protein, 1)
    return protein

def calculate_carbohydrates(product_id, portion):
    product = Product.objects.filter(id=product_id).first()
    factor = round(portion/product.nutrient.portion, 3)
    carbohydrates = round(factor * product.nutrient.carbohydrates, 1)
    return carbohydrates

def calculate_fats(product_id, portion):
    product = Product.objects.filter(id=product_id).first()
    factor = round(portion/product.nutrient.portion, 3)
    fats = round(factor * product.nutrient.fats, 1)
    return fats

def create_csv(writer, user, data):
    headers = []
    for key in data.keys():
        if data[key] != 0:
            if key == 'leftDate':
                headers.append('date')
            elif key != 'rightDate':
                headers.append(key)
    writer.writerow(headers)
    left_date = data['leftDate']
    right_date = data['rightDate']
    left_year = int(left_date.split('-')[0])
    left_month = int(left_date.split('-')[1])
    left_day = int(left_date.split('-')[2])
    right_year = int(right_date.split('-')[0])
    right_month = int(right_date.split('-')[1])
    right_day = int(right_date.split('-')[2])
    start_date = datetime.date(left_year, left_month, left_day)
    end_date = datetime.date(right_year, right_month, right_day)
    delta = datetime.timedelta(days=1)
    while start_date <= end_date:
        day = user.day_set.filter(date=start_date).first()
        row = []
        row.append(start_date.strftime("%Y-%m-%d"))
        if day is not None:
            if data['kcal'] == 1:
                row.append(day.summary_kcal)
            if data['protein'] == 1:
                row.append(day.summary_protein)
            if data['carbohydrates'] == 1:
                row.append(day.summary_carbohydrates)
            if data['fats'] == 1:
                row.append(day.summary_fats)
            if data['activity'] == 1:
                row.append(day.activity_time)
            if data['steps'] == 1:
                row.append(day.steps)
            if data['burnedKcal'] == 1:
                row.append(day.lose_kcal)
            if data['water'] == 1:
                row.append(day.water)
            if data['weight'] == 1:
                row.append(day.weight)
            if data['pulse'] == 1:
                row.append(day.pulse)
        else:
            if data['kcal'] == 1:
                row.append(0)
            if data['protein'] == 1:
                row.append(0)
            if data['carbohydrates'] == 1:
                row.append(0)
            if data['fats'] == 1:
                row.append(0)
            if data['activity'] == 1:
                row.append(0)
            if data['steps'] == 1:
                row.append(0)
            if data['burnedKcal'] == 1:
                row.append(0)
            if data['water'] == 1:
                row.append(0)
            if data['weight'] == 1:
                row.append('-')
            if data['pulse'] == 1:
                row.append('-')
        writer.writerow(row)
        start_date += delta