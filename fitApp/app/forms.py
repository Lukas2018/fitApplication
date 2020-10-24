from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.forms import ModelForm

class LoginForm(forms.Form):
    email = forms.EmailField(min_length=5)
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super(LoginForm, self).clean()
        email = cleaned_data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None
        print(user)
        if user is None:
            raise forms.ValidationError('Incorrect e-mail or password')
        else:
            password = cleaned_data.get('password')
            if not user.check_password(password):
                raise forms.ValidationError('Incorrect e-mail or password')
        return cleaned_data


class RegisterForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput, min_length=8, error_messages={'min_length': 'Your password is too short'})
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

    def clean(self):
        cleaned_data = super(UserDataForm, self).clean()
        return cleaned_data

class PasswordChangeForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput)
    new_password = forms.CharField(widget=forms.PasswordInput, error_messages={'min_length': 'New password is too short'})
    new_password2 = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super(PasswordChangeForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super(PasswordChangeForm, self).clean()
        old_password = cleaned_data.get('old_password')
        if self.user.check_password(old_password):
           new_password = cleaned_data.get('new_password')
           new_password2 = cleaned_data.get('new_password2')
           if new_password != new_password2:
               raise forms.ValidationError('Passwords not matched')
        else:
            raise forms.ValidationError('Your current password is incorrect')
        return cleaned_data

class ProductForm(forms.Form):
    name = forms.CharField()
    manufacturer = forms.CharField()
    portion = forms.FloatField()
    kcal = forms.FloatField()
    protein = forms.FloatField()
    carbohydrates = forms.FloatField()
    fats = forms.FloatField()

    def clean(self):
        cleaned_data = super(ProductForm, self).clean()
        return cleaned_data