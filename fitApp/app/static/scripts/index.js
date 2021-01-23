let somethingChanged = 0;

window.addEventListener('load', function() {
    let timerW;
    let timerP;
    let timerB;
    let timeToWait = 3000;
    $('.arrow-down').click(function() {
        showDetails($(this));
    });
    $('.down-arrow-black').click(function() {
        showTrainingDetails($(this));
    });
    $('#water .plus').click(function() {
        if($('#water .arrow').hasClass('arrow-down')) {
            showDetails($('#water .arrow'));
        }
        addBottle();
    })
    $('.empty-bottle').click(function() {
        clearTimeout(timerB);
        fillBottle($(this));
        timerB = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'water': $('.water-data .data .current').text()
            });
            sendData('/save_water/', data);
        }, timeToWait);
    });
    $('.full-bottle').click(function() {
        clearTimeout(timerB);
        emptyBottle($(this));
        timerB = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'water': $('.water-data .data .current').text()
            });
            sendData('/save_water/', data);
        }, timeToWait);
    });
    $('.weight-data .minus').click(function() {
        clearTimeout(timerW);
        decrement($(this), 0.1);
        timerW = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'weight': $('.weight-data .data').text()
            });
            sendData('/save_weight/', data);
        }, timeToWait);
    }); 
    $('.weight-data .plus').click(function() {
        clearTimeout(timerW);
        increment($(this), 0.1);
        timerW = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'weight': $('.weight-data .data').text()
            });
            sendData('/save_weight/', data);
        }, timeToWait);
    });
    $('.heart-data .minus').click(function() {
        clearTimeout(timerP);
        decrement($(this), 1);
        timerP = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'pulse': $('.heart-data .data').text()
            });
            sendData('/save_pulse/', data);
        }, timeToWait);
    }); 
    $('.heart-data .plus').click(function() {
        clearTimeout(timerP);
        increment($(this), 1);
        timerP = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'pulse': $('.heart-data .data').text()
            });
            sendData('/save_pulse/', data);
        }, timeToWait);
    });
    $('#step-counter').change(function() {
        let steps = $('#step-counter').val();
        if(steps == "") {
            steps = 0;
        }
        let data = JSON.stringify({
            'date': getDateFromCurrentDay(),
            'steps': steps
        });
        $('.steps-data .data .current').text(steps);
        changeStatus($('.steps-data'));
        sendData('/save_steps/', data);
    })
    $('.product-operations .trash').each(function() {
        $(this).on('click', function() {
            deleteMealProduct(this);
        });
    });
    $('.product-operations .edit').each(function() {
        $(this).on('click', function() {
            editMealProduct(this);
        });
    });
    $('.product-operations .loupe').each(function() {
        $(this).on('click', function() {
            detailMealProduct(this);
        });
    });
    $('.search-input').keyup(function() {
        searchItems(this);
    });
    $('.sport-activity').click(function() {
        createTraining(this);
    });
    $('.training-operations .trash').each(function() {
        $(this).on('click', function() {
            deleteTraining(this);
        })
    });
    $('.training-operations .edit').each(function() {
        $(this).on('click', function() {
            editTraining(this);
        })
    });
    $('.training-time .data').each(function() {
        if($(this).text().split(':').length == 1) {
            $(this).text(convertSecondsToTimeString(parseInt($(this).text())));
        }
    })
});

window.onbeforeunload = function() {
    if(somethingChanged == 1) {
        var formData = new FormData();
        formData.append('date', getDateFromCurrentDay());
        formData.append('weight', $('.weight-data .data').text());
        formData.append('pulse', $('.heart-data .data').text());
        formData.append('water', $('.water-data .data .current').text());
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
        navigator.sendBeacon('/save_index_data/', formData);
    }
}

function showDetails(arrowElem) {
    let listElem = arrowElem.parent().parent().parent().find('.meal-details');
    arrowElem.removeClass('arrow-down').addClass('arrow-up');
    listElem.css('display', 'block');
    $(arrowElem).click(function() {
        hideDetails(arrowElem);
    });
}

function hideDetails(arrowElem) {
    let listElem = arrowElem.parent().parent().parent().find('.meal-details');
    arrowElem.removeClass('arrow-up').addClass('arrow-down');
    listElem.css('display', 'none');
    arrowElem.click(function() {
        showDetails(arrowElem);
    });
}

function showTrainingDetails(arrowElem) {
    let listElem = arrowElem.parent().parent().parent().find('.training-details');
    arrowElem.removeClass('down-arrow-black').addClass('up-arrow-black');
    listElem.css('display', 'flex');
    $(arrowElem).click(function() {
        hideTrainingDetails(arrowElem);
    });
}

function hideTrainingDetails(arrowElem) {
    let listElem = arrowElem.parent().parent().parent().find('.training-details');
    arrowElem.removeClass('up-arrow-black').addClass('down-arrow-black');
    listElem.css('display', 'none');
    $(arrowElem).click(function() {
        showTrainingDetails(arrowElem);
    });
}

function addBottle() {
    emptyBottles = $('.empty-bottle');
    if(emptyBottles.length == 0) {
        $('#bottles').append('<div class="empty-bottle image size-30"></div>');
        let bottleElem = $('.empty-bottle').last();
        bottleElem.click(function() {
            fillBottle(bottleElem);
        });
    }
    else {
        fillBottle(emptyBottles.first());
    }
}

function fillBottle(bottleElem) {
    somethingChanged = 1;
    bottleElem.removeClass('empty-bottle').addClass('full-bottle');
    let value = $('.full-bottle').length * 250;
    $('.water-data .data .current').text(value);
    changeStatus($('.water-data'))
    bottleElem.click(function() {
        emptyBottle(bottleElem);
    });
}

function emptyBottle(bottleElem) {
    somethingChanged = 1;
    bottleElem.removeClass('full-bottle').addClass('empty-bottle');
    let value = $('.full-bottle').length * 250;
    $('.water-data .data .current').text(value);
    changeStatus($('.water-data'))
    bottleElem.click(function() {
        fillBottle(bottleElem);
    });
}

function changeStatus(element) {
    let current = parseFloat($(element).find('.data .current').text())
    let expected = parseFloat($(element).find('.data .expected').text())
    let status = $(element).find('.status');
    if(current >= expected) {
        status.removeClass('bad').addClass('good');
    }
    else {
        status.removeClass('good').addClass('bad');
    }
}

function decrement(elem, value) {
    somethingChanged = 1;
    elem = elem.parent().parent().find('.data');
    elem.text(Math.round((parseFloat(elem.text()) - value) * 10) / 10);
}

function increment(elem, value) {
    somethingChanged = 1;
    elem = elem.parent().parent().find('.data');
    elem.text(Math.round((parseFloat(elem.text()) + value) * 10) / 10);
}

function sendData(endpoint, data) {
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
    });
}

function editMealProduct() {
    let content = createModalProductContent();
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
            let mealProductId = 0;
            let kcal = 0;
            let portion = 0;
            let protein = 0;
            let carbohydrates = 0;
            let fats = 0;
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'id': mealProductId,
                'kcal': kcal,
                'portion': portion,
                'protein': protein,
                'carbohydrates': carbohydrates,
                'fats': fats
            });

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
            let mealSetId = $('#meals').attr('class').split('meal-set-id-')[1].split(' ')[0];
            let mealId = product.parent().attr('class').split('meal-id-')[1].split(' ')[0];
            let mealProductId = product.attr('class').split('product-id-')[1].split(' ')[0];
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'mealSetId': mealSetId,
                'mealId': mealId,
                'mealProductId': mealProductId
            });
            removeMealProduct(data);
        }
    });
}

function detailMealProduct(product) {
    product = $(product).parent().parent();
    let content = createModalProductContent(product);
    swal({
        title: 'Product details', 
        content: content,
        buttons: {
            confirm: 'Ok',
        }, 
        allowOutsideClick: 'true' 
    })
}

function createModalProductContent(productElement) {
    let content = document.createElement('div');
    content.className = 'content';
    let productName = document.createElement('div');
    productName.innerHTML = productElement.find('.product-name').text();
    let detailContent = document.createElement('div');
    detailContent.className = 'detail-content';
    let kcalContainer = document.createElement('div');
    let kcalName = document.createElement('div');
    kcalName.innerHTML = 'Kcal:';
    let kcalValue = document.createElement('div');
    kcalValue.innerHTML = productElement.find('.product-kcal .data').text();
    kcalContainer.appendChild(kcalName);
    kcalContainer.appendChild(kcalValue);
    let portionContainer = document.createElement('div');
    let portionName = document.createElement('div');
    portionName.innerHTML = 'Portion:';
    let portionValue = document.createElement('div');
    portionValue.innerHTML = productElement.find('.product-portion').val() + 'g';
    portionContainer.appendChild(portionName);
    portionContainer.appendChild(portionValue);
    let proteinContainer = document.createElement('div');
    let proteinName = document.createElement('div');
    proteinName.innerHTML = 'Protein:';
    let proteinValue = document.createElement('div');
    proteinValue.innerHTML = productElement.find('.product-protein').val() + 'g';
    proteinContainer.appendChild(proteinName);
    proteinContainer.appendChild(proteinValue);
    let carboContainer = document.createElement('div');
    let carboName = document.createElement('div');
    carboName.innerHTML = 'Carbohydrates:';
    let carboValue = document.createElement('div');
    carboValue.innerHTML = productElement.find('.product-carbohydrates').val() + 'g';
    carboContainer.appendChild(carboName);
    carboContainer.appendChild(carboValue);
    let fatsContainer = document.createElement('div');
    let fatsName = document.createElement('div');
    fatsName.innerHTML = 'Fats:';
    let fatsValue = document.createElement('div');
    fatsValue.innerHTML = productElement.find('.product-fats').val() + 'g';
    fatsContainer.appendChild(fatsName);
    fatsContainer.appendChild(fatsValue);
    detailContent.appendChild(kcalContainer);
    detailContent.appendChild(portionContainer);
    detailContent.appendChild(proteinContainer);
    detailContent.appendChild(carboContainer);
    detailContent.appendChild(fatsContainer);
    content.appendChild(productName);
    content.appendChild(detailContent);
    return content;
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
                let kcal = parseFloat(parseFloat($('.meal-product.product-id-' + data.mealProductId + ' .product-kcal .data').text()).toFixed(1));
                let protein = parseFloat(parseFloat($('.meal-product.product-id-' + data.mealProductId + ' .product-protein').val()).toFixed(1));
                let carbohydrates = parseFloat(parseFloat($('.meal-product.product-id-' + data.mealProductId + ' .product-carbohydrates').val()).toFixed(1));
                let fats = parseFloat(parseFloat($('.meal-product.product-id-' + data.mealProductId + ' .product-fats').val()).toFixed(1));
                updateFoodSummary(kcal, protein, carbohydrates, fats, 0, 0, 0, 0);
                updateMealSummary(data.mealId, kcal, protein, carbohydrates, fats, 0, 0, 0, 0);
                removeProductElement(data.mealProductId);
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

function removeProductElement(id) {
    $('.meal-product.product-id-' + id).remove();
}

function updateFoodSummary(oldKcal, oldProtein, oldCarbohydrates, oldFats, kcal, protein, carbohydrates, fats) {
    let totalKcal = parseFloat($('.kcal-data .data .current').text());
    totalKcal = totalKcal - oldKcal + kcal;
    $('.kcal-data .data .current').text(totalKcal.toFixed(1));
    let totalProtein = parseFloat($('.protein-data .data .current').text());
    totalProtein = totalProtein - oldProtein + protein;
    $('.protein-data .data .current').text(totalProtein.toFixed(1));
    let totalCarbo = parseFloat($('.carbohydrates-data .data .current').text());
    totalCarbo = totalCarbo - oldCarbohydrates + carbohydrates;
    $('.carbohydrates-data .data .current').text(totalCarbo.toFixed(1));
    let totalFats = parseFloat($('.fats-data .data .current').text());
    totalFats = totalFats - oldFats + fats;
    $('.fats-data .data .current').text(totalFats.toFixed(1));
}

function updateMealSummary(id, oldKcal, oldProtein, oldCarbohydrates, oldFats, kcal, protein, carbohydrates, fats) {
    let mealSummary = $('.meal-id-' + id).parent().find('.meal-summary');
    let totalKcal = parseFloat(mealSummary.find('.summary-kcal').text());
    totalKcal = totalKcal - oldKcal + kcal;
    mealSummary.find('.summary-kcal').text(totalKcal.toFixed(1));
    let totalProtein = parseFloat(mealSummary.find('.summary-protein').text());
    totalProtein = totalProtein - oldProtein + protein;
    mealSummary.find('.summary-protein').text(totalProtein.toFixed(1));
    let totalCarbo = parseFloat(mealSummary.find('.summary-carbohydrates').text());
    totalCarbo = totalCarbo - oldCarbohydrates + carbohydrates;
    mealSummary.find('.summary-carbohydrates').text(totalCarbo.toFixed(1));
    let totalFats = parseFloat(mealSummary.find('.summary-fats').text());
    totalFats = totalFats - oldFats + fats;
    mealSummary.find('.summary-fats').text(totalFats.toFixed(1));
}

function searchItems(search) {
    let pattern = $(search).val().toLowerCase().trim();
    let patternParts = pattern.split(' ');
    let items = $('.sport-activity');
    if(pattern != '') {
        let matched = 0;
        for(let i=0; i < items.length; i++) {
            let find = false;
            let sport = $(items[i]).find('.activity-name').text();
            let sportParts = sport.split(' ');
            if(sportParts.length != 1) {
                let total = 0;
                for(let j=0; j < sportParts.length; j++) {
                    for(let k=0; k < patternParts.length; k++) {
                        if(sportParts[j].toLowerCase().startsWith(patternParts[k].toLowerCase())) {
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
                if(sport.toLowerCase().startsWith(pattern)) {
                    find = true;
                    matched++;
                }
            }
            if(find == false) {
                $(items[i]).css('display', 'none');
            }
            else {
                $(items[i]).css('display', 'flex');
            }
            if(matched == 5) {
                break;
            }
        }
    }
    else {
        items.each(function() {
            $(this).css('display', 'none');
        });
    }
}

function createTraining(sport) {
    let content = createModalTrainingContent(sport, null, null);
    swal({
        title: 'Add activity', 
        content: content,
        buttons: {
            confirm: 'Add',
            cancel: true
        }, 
        allowOutsideClick: 'true' 
    }).then(function(willAdd) {
        if(willAdd) {
            let sportId = parseInt($(sport).attr('class').split('sport-activity-id-')[1].split(' ')[0]);
            let sportMet = parseFloat($(sport).attr('class').split('activity-met-')[1].split(' ')[0]);
            let weight = parseFloat($('.weight-data .data').text());
            let time = convertTimeStringToSeconds($('#input-activity-time').val() + ":00");
            let lose = calculateLoseKcal(sportMet, time, weight);
            let note = $('#input-note').val();
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'activity': sportId,
                'lose': lose,
                'time': time,
                'notes': note
            });
            addTraining('/training/', data);
        }
        $('.search-input').val('');
        $('.sport-activity').each(function() {
            $(this).css('display', 'none');
        })
    });
}

function editTraining(training) {
    training = $(training).parent().parent().parent();
    let time = training.find('.training-time .data').text();
    time = time.split(':')[0] + ':' + time.split(':')[1];
    let note = training.find('.training-note').text();
    let content = createModalTrainingContent(training, time, note);
    swal({
        title: 'Edit activity', 
        content: content,
        buttons: {
            confirm: 'Edit',
            cancel: true
        }, 
        allowOutsideClick: 'true' 
    }).then(function(willEdit) {
        if(willEdit) {
            let sportMet = parseFloat($(training).find('.training-data').attr('class').split('activity-met-')[1].split(' ')[0]);
            let weight = parseFloat($('.weight-data .data').text());
            let time = convertTimeStringToSeconds($('#input-activity-time').val() + ":00");
            let lose = calculateLoseKcal(sportMet, time, weight);
            let note = $('#input-note').val();
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
                'lose': lose,
                'time': time,
                'notes': note
            });
            let id = training.attr('id').split('-')[2];
            editTrainingData(id, data);
        }
    });
}

function deleteTraining(training) {
    console.log(training);
    swal({
        title: 'Removing training',
        text: 'Are you sure you want to remove this training?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if(willDelete) {
            let id = $(training).attr('class').split('id-')[1].split(' ')[0];
            let data = JSON.stringify({
                'date': getDateFromCurrentDay(),
            });
            removeTraining(id, data);
        }
    });
}

function createModalTrainingContent(sport, time, note) {
    if(time == null) {
        time = '00:00';
    }
    let sportName = $(sport).find('.activity-name').text();
    let imgClass = $(sport).find('.image').attr('class').split(' ')[0];
    let content = document.createElement('div');
    content.className = 'content';
    let img = document.createElement('div');
    img.classList.add('modal-img');
    img.classList.add('image');
    img.classList.add(imgClass);
    img.classList.add('size-40');
    let activityName = document.createElement('div');
    activityName.innerHTML = sportName;
    let timeInput = document.createElement('input');
    timeInput.id = 'input-activity-time';
    timeInput.type = 'time';
    timeInput.value = time;
    let textarea = document.createElement('textarea');
    textarea.id = 'input-note';
    textarea.maxLength = 255;
    textarea.placeholder = 'Your training notes...';
    textarea.value = note;
    content.appendChild(img);
    content.appendChild(activityName);
    content.appendChild(timeInput);
    content.appendChild(textarea);
    return content;
}

function calculateLoseKcal(met, time, weight) {
    time = (time / 3600).toFixed(2);
    let lose = met * time * weight;
    return parseFloat(lose.toFixed(1));
}

function addTraining(endpoint, data) {
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
            200: function(responseData) {
                swal({
                    title: 'Training added successfully', 
                    icon: 'success'
                });
                data = JSON.parse(data);
                addTrainingElement(data, responseData);
                updateActivitySummary(0, 0, data.time, data.lose);
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

function addTrainingElement(data, responseData) {
    let trainings = $('#trainings');
    let trainingContainer = $('<div id="training-id-' + responseData['id'] + '" class="training"></div>');
    let trainingDataContainer = $('<div class="training-data activity-met-' + responseData['met'] + '"></div>');
    let trainingImage = $('<div class="' + responseData['class_name'] + ' image size-40"></div>');
    let trainingName = $('<div class="activity-name">' + responseData['activity_name'] + '</div>');
    let trainingOperationsContainer = $('<div class="training-operations"></div>');
    let trainingEdit = $('<div class="image edit size-25 id-' + responseData['id'] +'"></div>');
    let trainingDelete = $('<div class="image trash size-25 id-' + responseData['id'] + '"></div>');
    let trainingArrow = $('<div class="image down-arrow-black size-25"></div>');
    let trainingDetailsContainer = $('<div class="training-details"></div>');
    let trainingTime = $('<div class="training-time">Time: &nbsp;' + '<div class="data">' + convertSecondsToTimeString(data.time) + '</div></div>');
    let trainingKcal = $('<div class="training-kcal">Burned kcal: &nbsp;' + '<div class="data">' + data.lose + '</div></div>');
    let trainingNote = $('<div class="training-note">' + data.notes + '</div>');
    trainingEdit.click(function() {
        editTraining(this);
    })
    trainingDelete.click(function() {
        deleteTraining(this);
    })
    trainingArrow.click(function() {
        showTrainingDetails($(this));
    })
    trainingOperationsContainer.append(trainingEdit);
    trainingOperationsContainer.append(trainingDelete);
    trainingOperationsContainer.append(trainingArrow);
    trainingDataContainer.append(trainingImage);
    trainingDataContainer.append(trainingName);
    trainingDataContainer.append(trainingOperationsContainer);
    trainingDetailsContainer.append(trainingTime);
    trainingDetailsContainer.append(trainingKcal);
    trainingDetailsContainer.append(trainingNote);
    trainingContainer.append(trainingDataContainer);
    trainingContainer.append(trainingDetailsContainer);
    trainings.append(trainingContainer);
}

function editTrainingData(id, data) {
    let url = '/training/' + id + '/';
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
        url: url,
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        statusCode: {
            200: function() {
                swal({
                    title: 'Training has been updated', 
                    icon: 'success'
                });
                let time = convertTimeStringToSeconds($('#training-id-' + id + ' .training-time .data').text());
                let lose = parseFloat($('#training-id-' + id + ' .training-kcal .data').text());
                data = JSON.parse(data);
                updateActivitySummary(time, lose, data.time, data.lose);
                editTrainingElement(id, data);
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

function editTrainingElement(id, data) {
    let training = $('#trainings').find('#training-id-' + id);
    training.find('.training-time .data').text(convertSecondsToTimeString(data.time));
    training.find('.training-kcal .data').text(data.lose);
    training.find('.training-note').text(data.notes);
}

function removeTraining(id, data) {
    let url = '/training/' + id + '/';
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
        url: url,
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        statusCode: {
            200: function() {
                swal({
                    title: 'Training has been removed', 
                    icon: 'success'
                });
                let time = convertTimeStringToSeconds($('#training-id-' + id + ' .training-time .data').text());
                let lose = parseFloat($('#training-id-' + id + ' .training-kcal .data').text());
                updateActivitySummary(time, lose, 0, 0);
                removeTrainingElement(id);
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

function removeTrainingElement(id) {
    $('#trainings').find('#training-id-' + id).remove();
}

function updateActivitySummary(oldTime, oldLose, time, lose) {
    let totalKcal = parseFloat($('.kcal-lose .data').text());
    totalKcal = totalKcal - oldLose + lose;
    $('.kcal-lose .data').text(totalKcal.toFixed(1));
    let totalTime = $('.workout-data .data').text();
    totalTime = convertTimeStringToSeconds(totalTime) - oldTime + time;
    $('.workout-data .data').text(convertSecondsToTimeString(totalTime));
}

function getDateFromCurrentDay() {
    let currentDate = $('.current-date').text();
    let date = currentDate.split('/')[2] + '-' + currentDate.split('/')[1] + '-' + currentDate.split('/')[0];
    return date;
}