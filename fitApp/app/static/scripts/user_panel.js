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
    $('#export-btn').click(function() {
        exportData();
    })
});

function showAccountData() {
    $('#user-products').css('display', 'none');
    $('#user-export').css('display', 'none');
    $('#account-data').css('display', 'block');
}

function showProducts() {
    $('#account-data').css('display', 'none');
    $('#user-export').css('display', 'none');
    $('#user-products').css('display', 'block');
    clearList('.products-list');
    clearParagraph('#user-products-list p');
    clearSearch('#user-products .search-input');
    getUserProducts();
}

function showUserExport() {
    $('#account-data').css('display', 'none');
    $('#user-products').css('display', 'none');
    $('#user-export').css('display', 'block');
}

function searchItems(search) {
    let pattern = $(search).val().toLowerCase().trim();
    let patternParts = pattern.split(' ');
    let items = $('.item');
    if(pattern != '') {
        let matched = 0;
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
                    if(total >= patternParts.length) {
                        find = true;
                        matched++;
                    }
            }
            else {
                if(product.toLowerCase().startsWith(pattern)) {
                    find = true;
                    matched++;
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
    else {
        items.each(function() {
            $(this).css('display', 'block');
        });
    }
}

function loadProducts(data) {
    let productList = $('.products-list');
    let products = $.map(data, function(value, key) { return value });
    let ids = Object.keys(data);
    for(let i=0; i < ids.length; i++) {
        let product = products[i];
        let nutrient = product['nutrientes'];
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

function removeUserProduct(id) {
    url = '/product/' + id + '/';
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

function exportData() {
    let dateLeft = $('#start').val();
    let dateRight = $('#end').val();
    if(dateLeft == '' || dateRight == '') {
        swal({
            title: 'Fill dates to export the data', 
            icon: 'warning'
        });
    }
    else if(dateLeft > dateRight) {
        swal({
            title: 'Starting date cannot be greater than ending date', 
            icon: 'warning'
        });
    }
    else {
        let kcal = Number($('#kcal').prop('checked'));
        let protein = Number($('#protein').prop('checked'));
        let carbohydrates = Number($('#carbohydrates').prop('checked'));
        let fats = Number($('#fats').prop('checked'));
        let activity = Number($('#activity').prop('checked'));
        let steps = Number($('#steps').prop('checked'));
        let burnedKcal = Number($('#burned-kcal').prop('checked'));
        let water = Number($('#water').prop('checked'));
        let weight = Number($('#weight').prop('checked'));
        let pulse = Number($('#pulse').prop('checked'));
        if(!kcal && !protein && !carbohydrates && !fats && !activity && !steps && !burnedKcal && !water && !weight && !pulse) {
            swal({
                title: 'Check at least one data type to export', 
                icon: 'warning'
            });
        }
        else {
            let data = JSON.stringify({
                'leftDate': dateLeft,
                'rightDate': dateRight,
                'kcal': kcal,
                'protein': protein,
                'carbohydrates': carbohydrates,
                'fats': fats,
                'activity': activity,
                'steps': steps,
                'burnedKcal': burnedKcal,
                'water': water,
                'weight': weight,
                'pulse': pulse,
            });
            exportDataFromServer(data);
        }
    }
}

function exportDataFromServer(data) {
    let request = new XMLHttpRequest();
    let fileName = "export.csv";
    request.open('POST', '/export/', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.responseType = 'blob';
    request.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    request.onload = function(e) {
        if (this.status === 200) {
            let blob = this.response;
            if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, fileName);
            }
            else{
                let downloadLink = window.document.createElement('a');
                let contentTypeHeader = request.getResponseHeader("Content-Type");
                downloadLink.href = window.URL.createObjectURL(new Blob([blob], { type: contentTypeHeader }));
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
    };
    request.send(data);
}