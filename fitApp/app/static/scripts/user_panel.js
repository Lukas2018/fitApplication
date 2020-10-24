function show_account_data() {
    document.getElementById('user_products').style.display = 'none';
    document.getElementById('user_meals').style.display = 'none';
    document.getElementById('account_data').style.display = 'block';
}
function load_products() {
    product_div = document.getElementById('user_products_list');

    document.getElementById('account_data').style.display = 'none';
    document.getElementById('user_meals').style.display = 'none';
    document.getElementById('user_products').style.display = 'block';
}

function load_meals() {
    meal_div = document.getElementById('user_meals_list');

    document.getElementById('account_data').style.display = 'none';
    document.getElementById('user_products').style.display = 'none';
    document.getElementById('user_meals').style.display = 'block';
}