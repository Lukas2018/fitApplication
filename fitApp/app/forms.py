from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.forms import ModelForm

class LoginForm(forms.Form):
    email = forms.EmailField(min_length=5)
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)

    def clean(self):
        cleaned_data = super(LoginForm, self).clean()
        return cleaned_data


class RegisterForm(forms.Form):
    email = forms.EmailField(min_length=5)
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    password_repeat = forms.CharField(widget=forms.PasswordInput, min_length=8)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        email = cleaned_data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None
        if user is not None:
            raise forms.ValidationError('Email already exists')
        password1 = cleaned_data.get('password')
        password2 = cleaned_data.get('password_repeat')
        print(password2)
        if password1 != password2:
            raise forms.ValidationError('Passwords not matched')
        return cleaned_data

class UserDataForm(forms.Form):
    age = forms.IntegerField()
    weight = forms.FloatField()
    height = forms.FloatField()
    sex = forms.ChoiceField(choices=[('0', 'Kobieta'), ('1', 'Mężczyzna')], widget=forms.RadioSelect)
    target = forms.ChoiceField(choices=[('0', 'Chce przytyć'), ('1', 'Chcę utrzymać wagę'), ('2', 'Chcę schudnąć')], widget=forms.Select)
    sport = forms.ChoiceField(choices=[('0', 'Prawie brak'), ('1', 'Lekka aktywność'), ('2', 'Umiarkowana aktywność'),
                                          ('3', 'Duża aktywność'), ('4', 'Bardzo duża aktywność')], widget=forms.Select)
    kcal = forms.FloatField()
    protein = forms.FloatField()
    carbohydrates = forms.FloatField()
    fats = forms.FloatField()
    water = forms.FloatField()
    steps = forms.IntegerField()

class ProductForm(forms.Form):
    name = forms.CharField()
    manufacturer = forms.CharField()
    portion = forms.FloatField()
    kcal = forms.FloatField()
    protein = forms.FloatField()
    carbohydrates = forms.FloatField()
    fats = forms.FloatField()