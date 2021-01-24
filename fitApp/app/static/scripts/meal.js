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
    $('.product .edit').each(function() {
        $(this).on('click', function() {
            editMealProduct(this);
        })
    });
    $('.product .trash').each(function() {
        $(this).on('click', function() {
            deleteMealProduct(this);
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

function editMealProduct(product) {
    product = $(product).parent().parent();
    let content = createModalProductContent(product);
    swal({
        title: 'Product edit', 
        content: content,
        buttons: {
            confirm: 'Edit',
            cancel: true
        }, 
        allowOutsideClick: 'true' 
    }).then(function(willEdit) {
        if(willEdit) {
            let date = $('.date').text().split('/');
            date = date[2] + '-' + date[1] + '-' + date[0];
            let mealSetId = $('.c-meal').attr('class').split('meal-set-id-')[1].split(' ')[0];
            let mealId = $('.c-meal').attr('class').split('meal-id-')[1].split(' ')[0];
            let mealProductId = product.attr('class').split('product-id-')[1].split(' ')[0];
            let kcal = $('.modal-kcal-value').text();
            let portion = $('.modal-portion-value').val();
            let protein = $('.modal-protein-value').text();
            let carbohydrates = $('.modal-carbohydrates-value').text();
            let fats = $('.modal-fats-value').text();
            let data = JSON.stringify({
                'date': date,
                'mealSetId': mealSetId,
                'mealId': mealId,
                'mealProductId': mealProductId,
                'kcal': kcal,
                'portion': portion,
                'protein': protein,
                'carbohydrates': carbohydrates,
                'fats': fats
            });
            editMealProductInDatabase(data);
        }
    });
}

function createModalProductContent(productElement) {
    let content = document.createElement('div');
    let id = document.createElement('input');
    id.className = 'modal-product-id';
    id.type = 'hidden';
    id.value = $(productElement).attr('class').split('product-id-')[1].split(' ')[0];
    content.className = 'content';
    let productName = document.createElement('div');
    productName.className = 'modal-product-name';
    productName.innerHTML = $(productElement).find('.product-name').text();
    let portionName = document.createElement('label');
    portionName.innerHTML = 'Portion [g]';
    portionName.className = 'modal-portion-name';
    let portionValueHidden = document.createElement('input');
    portionValueHidden.type = 'hidden';
    portionValueHidden.value = $(productElement).find('.product-portion').text();
    portionValueHidden.className = 'modal-portion-value-hidden';
    let portionValue = document.createElement('input');
    portionValue.type = 'number';
    portionValue.value = $(productElement).find('.product-portion').text();
    portionValue.className = 'modal-portion-value';
    portionValue.setAttribute('min', 0.1);
    portionValue.setAttribute('step', 0.1);
    portionValue.addEventListener('change', recalculateProductSummary);
    let detailContent = document.createElement('div');
    detailContent.className = 'detail-content';
    let kcalContainer = document.createElement('div');
    let kcalName = document.createElement('div');
    kcalName.innerHTML = 'Calories [kcal]';
    let kcalValue = document.createElement('div');
    kcalValue.innerHTML = $(productElement).find('.product-kcal').text();
    kcalValue.className = 'modal-kcal-value';
    let kcalValueHidden = document.createElement('input');
    kcalValueHidden.type = 'hidden';
    kcalValueHidden.value = $(productElement).find('.product-kcal').text();
    kcalValueHidden.className = 'modal-kcal-value-hidden';
    kcalContainer.appendChild(kcalName);
    kcalContainer.appendChild(kcalValue);
    kcalContainer.appendChild(kcalValueHidden);
    let proteinContainer = document.createElement('div');
    let proteinName = document.createElement('div');
    proteinName.innerHTML = 'Protein [g]';
    let proteinValue = document.createElement('div');
    proteinValue.innerHTML = $(productElement).find('.product-protein').text();
    proteinValue.className = 'modal-protein-value';
    let proteinValueHidden = document.createElement('input');
    proteinValueHidden.type = 'hidden';
    proteinValueHidden.value = $(productElement).find('.product-protein').text();
    proteinValueHidden.className = 'modal-protein-value-hidden';
    proteinContainer.appendChild(proteinName);
    proteinContainer.appendChild(proteinValue);
    proteinContainer.appendChild(proteinValueHidden);
    let carboContainer = document.createElement('div');
    let carboName = document.createElement('div');
    carboName.innerHTML = 'Carbohydrates [g]';
    let carboValue = document.createElement('div');
    carboValue.innerHTML = $(productElement).find('.product-carbohydrates').text();
    carboValue.className = 'modal-carbohydrates-value';
    let carboValueHidden = document.createElement('input');
    carboValueHidden.type = 'hidden';
    carboValueHidden.value = $(productElement).find('.product-carbohydrates').text();
    carboValueHidden.className = 'modal-carbohydrates-value-hidden';
    carboContainer.appendChild(carboName);
    carboContainer.appendChild(carboValue);
    carboContainer.appendChild(carboValueHidden);
    let fatsContainer = document.createElement('div');
    let fatsName = document.createElement('div');
    fatsName.innerHTML = 'Fats [g]';
    let fatsValue = document.createElement('div');
    fatsValue.innerHTML = $(productElement).find('.product-fats').text();
    fatsValue.className = 'modal-fats-value';
    let fatsValueHidden = document.createElement('input');
    fatsValueHidden.type = 'hidden';
    fatsValueHidden.value = $(productElement).find('.product-fats').text();
    fatsValueHidden.className = 'modal-fats-value-hidden';
    fatsContainer.appendChild(fatsName);
    fatsContainer.appendChild(fatsValue);
    fatsContainer.appendChild(fatsValueHidden);
    detailContent.appendChild(kcalContainer);
    detailContent.appendChild(proteinContainer);
    detailContent.appendChild(carboContainer);
    detailContent.appendChild(fatsContainer);
    content.appendChild(id);
    content.appendChild(productName);
    content.appendChild(portionName);
    content.appendChild(portionValueHidden);
    content.appendChild(portionValue);
    content.appendChild(detailContent);
    return content;
}

function recalculateProductSummary() {
    let oldPortion = parseFloat($('.modal-portion-value-hidden').val());
    let newPortion = parseFloat($('.modal-portion-value').val());
    let ratio = parseFloat((newPortion/oldPortion).toFixed(2));
    let oldKcal = parseFloat($('.modal-kcal-value-hidden').val());
    $('.modal-kcal-value').text((oldKcal * ratio).toFixed(1));
    let oldProtein = parseFloat($('.modal-protein-value-hidden').val());
    $('.modal-protein-value').text((oldProtein * ratio).toFixed(1));
    let oldCarbohydrates = parseFloat($('.modal-carbohydrates-value-hidden').val());
    $('.modal-carbohydrates-value').text((oldCarbohydrates * ratio).toFixed(1));
    let oldFats = parseFloat($('.modal-fats-value-hidden').val());
    $('.modal-fats-value').text((oldFats * ratio).toFixed(1));
}

function editMealProductInDatabase(data) {
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
        url: '/meal_edit/',
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        statusCode: {
            200: function() {
                swal({
                    title: 'Product has been updated', 
                    icon: 'success'
                });
                data = JSON.parse(data);
                let id = data.mealProductId;
                let kcal = parseFloat($('.product-id-' + id).find('.product-kcal').text());
                let portion = parseFloat($('.product-id-' + id).find('.product-portion').text());
                let protein = parseFloat($('.product-id-' + id).find('.product-protein').text());
                let carbohydrates = parseFloat($('.product-id-' + id).find('.product-carbohydrates').text());
                let fats = parseFloat($('.product-id-' + id).find('.product-fats').text());
                updateMealSummary(kcal, portion, protein, carbohydrates, fats, data.kcal, data.portion, data.protein, data.carbohydrates, data.fats);
                updateProductSummary(id, data.kcal, data.portion, data.protein, data.carbohydrates, data.fats);
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
function deleteMealProduct(product) {
    product = $(product).parent().parent();
    swal({
        title: 'Removing product',
        text: 'Are you sure you want to remove this product from your meal?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if(willDelete) {
            let date = $('.date').text().split('/');
            date = date[2] + '-' + date[1] + '-' + date[0];
            let mealSetId = $('.c-meal').attr('class').split('meal-set-id-')[1].split(' ')[0];
            let mealId = $('.c-meal').attr('class').split('meal-id-')[1].split(' ')[0];
            let mealProductId = product.attr('class').split('product-id-')[1].split(' ')[0];
            let data = JSON.stringify({
                'date': date,
                'mealSetId': mealSetId,
                'mealId': mealId,
                'mealProductId': mealProductId
            });
            removeMealProduct(data);
        }
    });
}

function removeMealProduct(data) {
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
        type: 'DELETE',
        url: '/delete_product_from_meal/',
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        statusCode: {
            200: function() {
                swal({
                    title: 'Product has been removed', 
                    icon: 'success'
                });
                data = JSON.parse(data);
                let id = data.mealProductId;
                let kcal = parseFloat(parseFloat($('.product-id-' + id + ' .product-kcal').text()).toFixed(1));
                let portion = parseFloat(parseFloat($('.product-id-' + id + ' .product-portion').text()).toFixed(1));
                let protein = parseFloat(parseFloat($('.product-id-' + id + ' .product-protein').text()).toFixed(1));
                let carbohydrates = parseFloat(parseFloat($('.product-id-' + id + ' .product-carbohydrates').text()).toFixed(1));
                let fats = parseFloat(parseFloat($('.product-id-' + id + ' .product-fats').text()).toFixed(1));
                updateMealSummary(kcal, portion, protein, carbohydrates, fats, 0, 0, 0, 0, 0);
                removeProductFromMealList(id);
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

function removeProductFromMealList(id) {
    $('#meal-products').find('.product-id-' + id).remove();
}

function updateMealSummary(oldKcal, oldPortion, oldProtein, oldCarbohydrates, oldFats, newKcal, newPortion, newProtein, newCarbohydrates, newFats) {
    let kcal = parseFloat($('.summary-kcal').text())
    kcal = kcal - oldKcal + parseFloat(newKcal);
    $('.summary-kcal').text(kcal.toFixed(1));
    let portion = parseFloat($('.summary-portion').text());
    portion = portion - oldPortion + parseFloat(newPortion);
    $('.summary-portion').text(portion.toFixed(1));
    let protein = parseFloat($('.summary-protein').text());
    protein = protein - oldProtein + parseFloat(newProtein);
    $('.summary-protein').text(protein.toFixed(1));
    let carbohydrates = parseFloat($('.summary-carbohydrates').text());
    carbohydrates = carbohydrates - oldCarbohydrates + parseFloat(newCarbohydrates);
    $('.summary-carbohydrates').text(carbohydrates.toFixed(1));
    let fats = parseFloat($('.summary-fats').text());
    fats = fats - oldFats + parseFloat(newFats);
    $('.summary-fats').text(fats.toFixed(1));
}

function updateProductSummary(id, kcal, portion, protein, carbohydrates, fats) {
    $('.product-id-' + id + ' .product-kcal').text(kcal);
    $('.product-id-' + id + ' .product-portion').text(portion);
    $('.product-id-' + id + ' .product-protein').text(protein);
    $('.product-id-' + id + ' .product-carbohydrates').text(carbohydrates);
    $('.product-id-' + id + ' .product-fats').text(fats);
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