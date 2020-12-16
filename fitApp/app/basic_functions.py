import math
from app.models import Product

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