$( document ).ready(function() {
    previousTab();
});

function calculate() {
    nextTab();
    let age = $('#age').val();
    let weight = $('#weight').val()
    let height = $('#height').val()
    let sex = $('#user_data_form input[type="radio"]:checked').val();
    let sport = $('#user_data_form .sport select').val();
    let target = $('#user_data_form .target select').val();
    let bmr = 0;
    let protein = 0;
    let carbohydrates = 0;
    let fats;
    let steps = 10000;
    let water;
    if(sex == 0) {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    if(sport == 0) {
        bmr = bmr * 1.2;
        protein = weight * 1.2;
        carbohydrates = weight * 3;
        steps = 5000;
    }
    else if(sport == 1) {
        bmr = bmr * 1.4;
        protein = weight * 1.5;
        carbohydrates = weight * 3.5;
        steps = 6000;
    }
    else if(sport == 2) {
        bmr = bmr * 1.6;
        protein = weight * 1.9;
        carbohydrates = weight * 4.0;
        steps = 8000;
    }
    else if(sport == 3) {
        bmr = bmr * 1.8;
        protein = weight * 2.3;
        carbohydrates = weight * 4.5;
        steps = 10000;
    }
    else if(sport == 4) {
        bmr = bmr * 2.0;
        protein = weight * 2.8;
        carbohydrates = weight * 5;
        steps = 120000;
    }
    if(target == 0) {
        bmr = bmr + 250;
    }
    else if(target == 2) {
        bmr = bmr - 250;
    }
    if((weight > 120) && ((sport == 0) || (sport == 1)) ) {
        steps = 3000;
    }
    if(age > 70) {
        steps = 4000;
    }
    water = weight * 30;
    bmr = Math.floor(bmr);
    protein = Math.floor(protein);
    carbohydrates = Math.floor(carbohydrates);
    fats = Math.floor((bmr - 4*protein - 4*carbohydrates) / 9);
    $('#kcal').val(bmr);
    $('#protein').val(protein);
    $('#carbohydrates').val(carbohydrates);
    $('#fats').val(fats);
    $('#steps').val(steps);
    $('#water').val(water);
}

function nextTab(){
    $('.first-part').addClass('d-none');
    $('.second-part').removeClass('d-none')
}

function previousTab(){
    $('.first-part').removeClass('d-none');
    $('.second-part').addClass('d-none')
}
