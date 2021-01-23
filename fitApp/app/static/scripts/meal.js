window.addEventListener('load', function() {
    $('#save-meal-button').click(function() {
        if($('.product').length == 0) {
            swal({
                title: 'Add products to meal before you save it', 
                icon: 'warning'
            });
        }
        else {
            saveMeal();
        }
    });
    $('.product .trash').each(function() {
        $(this).on('click', function() {
            removeProductFromMealList(this)
        })
    });
});

function addProductToMealList(id, name, manufacturer, kcal, portion, protein, carbohydrates, fats) {
    let numbers = $('.product').length + 1;
    let product = $('<tr class="product product-id-' + id + '"></tr>');
    let number = $('<th class="number" scope="row">' + numbers + '</div>')
    let productName = $('<td class="product-name">' + name + '</td>');
    let productManufacturer = $('<td class="product-manufacturer">' + manufacturer + '</td>');
    let productKcal = $('<td class="product-kcal">' + kcal + '</td>');
    let productPortion = $('<td class="product-portion">' + portion + '</td>');
    let productProtein = $('<td class="product-protein">' + protein + '</td>');
    let productCarbohydrates = $('<td class="product-carbohydrates">' + carbohydrates + '</td>');
    let productFats = $('<td class="product-fats">' + fats + '</td>');
    let productOperations = $('<td class="product-operations"></td>');
    let productEdit = $('<div class="image edit size-20"></div>');
    let productRemove = $('<div class="image trash size-20"></div>');
    productRemove.click(function() {
        removeProductFromMealList(this);
    })
    productOperations.append(productEdit);
    productOperations.append(productRemove);
    product.append(number);
    product.append(productName);
    product.append(productManufacturer);
    product.append(productKcal);
    product.append(productPortion);
    product.append(productProtein);
    product.append(productCarbohydrates);
    product.append(productFats);
    product.append(productOperations);
    $('#meal-products').append(product);
}

function removeProductFromMealList(product) {
    let id = $(product).parent().parent().attr('class').split('product-id-')[1].split(' ')[0];
    $('#meal-products').find('.product-id-' + id).remove();
}

function updateMealSummary(oldKcal, newKcal, oldProtein, newProtein, oldCarbohydrates, newCarbohydrates, oldFats, newFats) {

}

function saveMeal() {
    let mealId = $('.c-meal').attr('class').split('meal-id-')[1].split(' ')[0];
    let products = $('.product');
    let productList = {};
    
    for(let i=0; i < products.length; i++) {
        let product = products[i];
        let productId = $(product).attr('class').split('product-id-')[1].split(' ')[0];
        let productKcal = $(product).find('.product-kcal').text();
        let productPortion = $(product).find('.product-portion').text();
        let productProtein = $(product).find('.product-protein').text();
        let productCarbohydrates = $(product).find('.product-carbohydrates').text();
        let productFats = $(product).find('.product-fats').text();
        productList[productId] = {
            'kcal': productKcal,
            'portion': productPortion,
            'protein': productProtein,
            'carbohydrates': productCarbohydrates,
            'fats': productFats
        }
    }
    let data = {
        'mealId': mealId,
        'products': productList
    }
    saveMealToDatabase('/meal/', data)
}

function saveMealToDatabase(endpoint, data) {
    let csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
                xhr.setRequestHeader('content-type', 'application/json');
            }
        }
    });
    $.ajax({
        type: 'POST',
        url: endpoint,
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        statusCode: {
            200: function() {
                swal({
                    title: 'Meal saved', 
                    icon: 'success'
                });
                
            },
            400: function() {
                swal({
                    title: 'Bad request', 
                    icon: 'error'
                });
            },
            404: function() {
                swal({
                    title: 'Not found', 
                    icon: 'error'
                });
            },
            405: function() {
                swal({
                    title: 'Method not allowed', 
                    icon: 'error'
                });
            },
            500: function() {
                swal({
                    title: 'Sorry, an server error occured',
                    icon: 'error'
                });
            }
        }
    });
}