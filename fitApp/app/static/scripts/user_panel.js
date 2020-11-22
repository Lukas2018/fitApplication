window.onload = function() {
    $('.add-product').click(function() {
        window.location = '/product/';
    });
    $('.add-meal').click(function() {
        window.location = '/meal/';
    });
    $('.search-input').keyup(function() {
        searchItems(this);
    })
}

function showAccountData() {
    document.getElementById('user-products').style.display = 'none';
    document.getElementById('user-meals').style.display = 'none';
    document.getElementById('account-data').style.display = 'block';
}

function showProducts() {
    productDiv = document.getElementById('user-products-list');

    document.getElementById('account-data').style.display = 'none';
    document.getElementById('user-meals').style.display = 'none';
    document.getElementById('user-products').style.display = 'block';
    clearList('.products-list');
    clearParagraph('#user-products-list p');
    clearSearch('#user-products .search-input');
    getUserProducts();
}

function showMeals() {
    mealDiv = document.getElementById('user-meals-list');

    document.getElementById('account-data').style.display = 'none';
    document.getElementById('user-products').style.display = 'none';
    document.getElementById('user-meals').style.display = 'block';
    clearList('.meals-list');
    clearParagraph('#user-meals-list p');
    clearSearch('#user-meals .search-input');
    getUserMeals();
}

function searchItems(search) {
    let patern = $(search).val().toLowerCase();
    let items = $('.item');
    items.each(function() {
        $(this).css('display', 'block');
    });
    for(let i=0; i < items.length; i++) {
        let find = false;
        let product = $(items[i]).find('.item-name').text();
        let productParts = product.split(' ');
        if(patern.split(" ").length == 1) {
            for(let j=0; j < productParts.length; j++) {
                if(productParts[j].toLowerCase().startsWith(patern)) {
                    find = true;
                    break;
                }
            }
        }
        else {
            if(product.toLowerCase().includes(patern)) {
                find = true;
            }
        }
        if(find == false) {
            $(items[i]).css('display', 'none');
        }
    }
}

function loadProducts(data) {
    let productList = $('.products-list');
    let products = $.map(data, function(value, key) { return value });
    let ids = Object.keys(data);
    for(let i=0; i < ids.length; i++) {
        let product = products[i];
        let nutrient = product['nutrientes'][0];
        let element = $('<li class="product item"></li>');
        let productName = $('<span class="product-name product-data item-name">' + product['name'] + '</span>');
        let manufacturer = $('<span class="product-manufacturer product-data">Manufacturer: ' + product['manufacturer'] + '</span>');
        let portion = $('<span class="product-portion product-data">Portion: ' + nutrient['portion'] + ' [g]</span>');
        let kcal = $('<span class="product-kcal product-data">Kcal: ' + nutrient['kcal'] + '</span>');
        let protein = $('<span class="product-protein product-data">Protein: ' + nutrient['protein'] + ' [g]</span>');
        let carbohydrates = $('<span class="product-carbohydrates product-data">Carbohydrates: ' + nutrient['carbohydrates'] + ' [g]</span>');
        let fats = $('<span class="product-fats product-data">Fats: ' + nutrient['fats'] + ' [g]</span>');
        element.append(productName);
        element.append(manufacturer);
        element.append(kcal);
        element.append(portion);
        element.append(protein);
        element.append(carbohydrates);
        element.append(fats);
        productList.append(element);
    }
}

function loadMeals(data) {

}

function fillWithData(element, text) {
    $(element).text(text);
}

function clearList(listName) {
    $(listName).empty();
}

function clearParagraph(p) {
    $(p).text('');
}

function clearSearch(search) {
    $(search).val('');
}
function getUserProducts() {
    $.ajax({
        url: '/get_user_products/',
        type: 'GET',
        statusCode: {
            200: function(data) {
                loadProducts(data);
            },
            204: function() {
                fillWithData('#user-products-list p', 'You have no products');
            }
        }
    });
}

function getUserMeals() {
    $.ajax({
        url: '/get_user_meals/',
        type: 'GET',
        statusCode: {
            200: function(data) {
                loadMeals(data);
            },
            204: function() {
                fillWithData('#user-meals-list p', 'You have no meals');
            }
        }
    });
}