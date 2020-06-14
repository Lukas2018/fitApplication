from flask_wtf import FlaskForm
from wtforms import PasswordField, SubmitField, FloatField, IntegerField, RadioField, SelectField, StringField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, EqualTo, Length, ValidationError, Email
import user


class LoginForm(FlaskForm):
    email = EmailField('Username', validators=[DataRequired('Pole wymagane'), Email('Proszę podać właściwy adres e-mail')])
    password = PasswordField('Password', validators=[DataRequired('Pole wymagane')])
    submit = SubmitField('Sign In')


    def validate_email(self, email):
        if not user.check_email(email.data):
            raise ValidationError('Brak konta z takim adresem e-mail')

    def validate_password(self, password):
        if not user.validate_password(self.email.data, password.data):
            raise ValidationError('Niezgodne hasło')


class RegisterForm(FlaskForm):
    email = EmailField('Email address', validators=[DataRequired('Pole wymagane'),
                                                    Email('Proszę podać właściwy adres e-mail'), Length(min=3, max=30)])
    password = PasswordField('Password', validators=[DataRequired('Pole wymagane'), Length(min=8)])
    password_repeat = PasswordField('Repeat Password', validators=[DataRequired('Pole wymagane'),
                                                                   EqualTo('password'), Length(min=8)])
    submit = SubmitField('Sign Up')

    def validate_email(self, email):
        if user.check_email(email.data):
            raise ValidationError('Konto z podanym adresem e-mail już istnieje')


class UserDataForm(FlaskForm):
    age = IntegerField('Age', validators=[DataRequired('Pole wymagane')])
    weight = FloatField('Weight', validators=[DataRequired('Pole wymagane')])
    height = FloatField('Height', validators=[DataRequired('Pole wymagane')])
    sex = RadioField('Sex', choices=[('0', 'Kobieta'), ('1', 'Mężczyzna')])
    target = SelectField('Target', choices=[('0', 'Chce przytyć'), ('1', 'Chcę utrzymać wagę'), ('2', 'Chcę schudnąć')])
    sport = SelectField('Sport', choices=[('0', 'Prawie brak'), ('1', 'Lekka aktywność'), ('2', 'Umiarkowana aktywność'),
                                          ('3', 'Duża aktywność'), ('4', 'Bardzo duża aktywność')])
    kcal = FloatField('Kcal', validators=[DataRequired('Pole wymagane')])
    protein = FloatField('Protein', validators=[DataRequired('Pole wymagane')])
    carbohydrates = FloatField('Carbohydrates', validators=[DataRequired('Pole wymagane')])
    fats = FloatField('Fats', validators=[DataRequired('Pole wymagane')])
    water = FloatField('Water', validators=[DataRequired('Pole wymagane')])
    steps = IntegerField('Steps', validators=[DataRequired('Pole wymagane')])


class ProductForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired('Pole wymagane')])
    manufacturer = StringField('Manufacturer')
    portion = FloatField('Portion', validators=[DataRequired('Pole wymagane')])
    kcal = FloatField('Kcal', validators=[DataRequired('Pole wymagane')])
    protein = FloatField('Protein', validators=[DataRequired('Pole wymagane')])
    carbohydrates = FloatField('Carbohydrates', validators=[DataRequired('Pole wymagane')])
    fats = FloatField('Fats', validators=[DataRequired('Pole wymagane')])