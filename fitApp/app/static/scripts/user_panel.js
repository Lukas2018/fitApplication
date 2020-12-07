window.addEventListener('load', function() {
    $('.add-product').click(function() {
        window.location = '/product/';
    });
    $('.add-meal').click(function() {
        window.location = '/meal/';
    });
    $('.search-input').keyup(function() {
        searchItems(this);
    })
});

function showAccountData() {
    $('#user-products').css('display', 'none');
    $('#user-meals').css('display', 'none');
    $('#account-data').css('display', 'block');
}

function showProducts() {
    $('#account-data').css('display', 'none');
    $('#user-meals').css('display', 'none');
    $('#user-products').css('display', 'block');
    clearList('.products-list');
    clearParagraph('#user-products-list p');
    clearSearch('#user-products .search-input');
    getUserProducts();
}

function showMeals() {
    $('#account-data').css('display', 'none');
    $('#user-products').css('display', 'none');
    $('#user-meals').css('display', 'block');
    clearList('.meals-list');
    clearParagraph('#user-meals-list p');
    clearSearch('#user-meals .search-input');
    getUserMeals();
}

function searchItems(search) {
    let pattern = $(search).val().toLowerCase().trim();
    let patternParts = pattern.split(' ');
    let items = $('.item');
    for(let i=0; i < items.length; i++) {
        let find = false;
        let product = $(items[i]).find('.item-name').text();
        let productParts = product.split(' ');
        if(productParts.length != 1) {
            let total = 0;
                for(let j=0; j < productParts.length; j++) {
                    for(let k=0; k < patternParts.length; k++) {
                        if(productParts[j].toLowerCase().startsWith(patternParts[k].toLowerCase())) {
                            total++;
                            break;
                        }
                    }
                }
                if(total == patternParts.length) {
                    find = true;
                }
        }
        else {
            if(product.toLowerCase().startsWith(pattern)) {
                find = true;
            }
        }
        if(find == false) {
            $(items[i]).css('display', 'none');
        }
        else {
            $(items[i]).css('display', 'block');
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
        let element = $('<li class="product-' + ids[i] + ' product item"></li>');
        let productDetails = $('<div class="product-details"></div>');
        let productOptions = $('<div class="product-options"></div>');
        let productName = $('<span class="product-name product-data item-name">' + product['name'] + '</span>');
        let manufacturer = $('<span class="product-manufacturer product-data">Manufacturer: ' + product['manufacturer'] + '</span>');
        let portion = $('<span class="product-portion product-data">Portion: ' + nutrient['portion'] + ' [g]</span>');
        let kcal = $('<span class="product-kcal product-data">Kcal: ' + nutrient['kcal'] + '</span>');
        let protein = $('<span class="product-protein product-data">Protein: ' + nutrient['protein'] + ' [g]</span>');
        let carbohydrates = $('<span class="product-carbohydrates product-data">Carbohydrates: ' + nutrient['carbohydrates'] + ' [g]</span>');
        let fats = $('<span class="product-fats product-data">Fats: ' + nutrient['fats'] + ' [g]</span>');
        let editOption = $('<div class="edit size-25 image"></div>');
        let removeOption = $('<div class="trash size-25 image"></div>');
        editOption.click(function() {
            redirectToEdit(ids[i]);
        });
        removeOption.click(function() {
            removeProduct(ids[i]);
        })
        productDetails.append(productName);
        productDetails.append(manufacturer);
        productDetails.append(kcal);
        productDetails.append(portion);
        productDetails.append(protein);
        productDetails.append(carbohydrates);
        productDetails.append(fats);
        productOptions.append(editOption);
        productOptions.append(removeOption);
        element.append(productDetails);
        element.append(productOptions);
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

function removeListElement(id) {
    $('.product-' + id).remove();
}

function clearParagraph(p) {
    $(p).text('');
}

function clearSearch(search) {
    $(search).val('');
}

function redirectToEdit(id) {
    window.location = '/product/' + id;
}

function removeProduct(id) {
    swal({
        title: "Removing product",
        text: "Are you sure you want to remove this product?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            removeUserProduct(id);
        }
    });
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

function removeUserProduct(id) {
    url = '/product/' + id;
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
        url: url,
        type: 'DELETE',
        statusCode: {
            200: function() {
                swal({
                    title: 'Product has been removed!', 
                    icon: 'success'
                });
                removeListElement(id);
                if($('.product').length == 0) {
                    fillWithData('#user-products-list p', 'You have no products');
                }
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