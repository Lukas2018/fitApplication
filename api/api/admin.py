from django.contrib import admin

from api.models import Product, Dish, User, Meal, Day, PhysicalActivity, Training

admin.site.register(User)
admin.site.register(Dish)
admin.site.register(Product)
admin.site.register(Meal)
admin.site.register(Day)
admin.site.register(PhysicalActivity)
admin.site.register(Training)