let somethingChanged = 0;

window.addEventListener('load', function() {
    let timerW;
    let timerP;
    let timerB;
    let timeToWait = 3000;
    $('.arrow-down').click(function() {
        showDetails($(this));
    });
    $('#water .plus').click(function() {
        if($('#water .arrow').hasClass('arrow-down')) {
            $()
        }
        addBottle();
    })
    $('.empty-bottle').click(function() {
        clearTimeout(timerB);
        fillBottle($(this));
        timerB = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromUrl(),
                'water': $('.water-data .data .current').text()
            });
            sendData('/save_water/', data, 'POST', false);
        }, timeToWait);
    });
    $('.full-bottle').click(function() {
        clearTimeout(timerB);
        emptyBottle($(this));
        timerB = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromUrl(),
                'water': $('.water-data .data .current').text()
            });
            sendData('/save_water/', data, 'POST', false);
        }, timeToWait);
    });
    $('.weight-data .minus').click(function() {
        clearTimeout(timerW);
        decrement($(this), 0.1);
        timerW = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromUrl(),
                'weight': $('.weight-data .data').text()
            });
            sendData('/save_weight/', data, 'POST', false);
        }, timeToWait);
    }); 
    $('.weight-data .plus').click(function() {
        clearTimeout(timerW);
        increment($(this), 0.1);
        timerW = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromUrl(),
                'weight': $('.weight-data .data').text()
            });
            sendData('/save_weight/', data, 'POST', false);
        }, timeToWait);
    });
    $('.heart-data .minus').click(function() {
        clearTimeout(timerP);
        decrement($(this), 1);
        timerP = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromUrl(),
                'pulse': $('.heart-data .data').text()
            });
            sendData('/save_pulse/', data, 'POST', false);
        }, timeToWait);
    }); 
    $('.heart-data .plus').click(function() {
        clearTimeout(timerP);
        increment($(this), 1);
        timerP = setTimeout(function () {
            let data = JSON.stringify({
                'date': getDateFromUrl(),
                'pulse': $('.heart-data .data').text()
            });
            sendData('/save_pulse/', data, 'POST', false);
        }, timeToWait);
    });
    $('.search-input').keyup(function() {
        searchItems(this);
    });
    $('.sport-activity').click(function() {
        createTraining(this);
    });
    getDateFromUrl();
});

window.onbeforeunload = function() {
    if(somethingChanged == 1) {
        var formData = new FormData();
        formData.append('date', getDateFromUrl());
        formData.append('weight', $('.weight-data .data').text());
        formData.append('pulse', $('.heart-data .data').text());
        formData.append('water', $('.water-data .data .current').text());
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
        navigator.sendBeacon('/save_index_data/', formData);
    }
}

function showDetails(arrowElem) {
    let listElem = arrowElem.parent().parent().parent().find('.details');
    arrowElem.removeClass('arrow-down').addClass('arrow-up');
    listElem.css('display', 'block');
    $(arrowElem).click(function() {
        hideDetails(arrowElem);
    });
}

function hideDetails(arrowElem) {
    let listElem = arrowElem.parent().parent().parent().find('.details');
    arrowElem.removeClass('arrow-up').addClass('arrow-down');
    listElem.css('display', 'none');
    arrowElem.click(function() {
        showDetails(arrowElem);
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
    bottleElem.removeClass('empty-bottle').addClass('full-bottle');
    changeWaterData($('.full-bottle').length);
    bottleElem.click(function() {
        emptyBottle(bottleElem);
    });
}

function emptyBottle(bottleElem) {
    bottleElem.removeClass('full-bottle').addClass('empty-bottle');
    changeWaterData($('.full-bottle').length);
    bottleElem.click(function() {
        fillBottle(bottleElem);
    });
}

function changeWaterData(numOfBottles) {
    somethingChanged = 1;
    let value = numOfBottles * 250;
    let expectedValue = parseInt($('.water-data .data .expected').text());
    $('.water-data .data .current').text(value);
    if(expectedValue > value) {
        $('.water-data .status').removeClass('good').addClass('bad');
    }
    else {
        $('.water-data .status').removeClass('bad').addClass('good');
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
                if(total == patternParts.length) {
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
    let sportName = $(sport).find('.activity-name').text();
    let imgClass = $(sport).find('.image').attr('class').split(' ')[0];
    console.log(imgClass);
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
    timeInput.type = 'time';
    content.appendChild(img);
    content.appendChild(activityName);
    content.appendChild(timeInput);
    /*swal({
        title: 'Add activity', 
        content: content,
        button: 'Add', 
        allowOutsideClick: "true" 
    });*/

    /*let data = JSON.stringify({
        'date': getDateFromUrl(),
        'activity': 52,
        'lose': 100,
        'time': 3600,
        'notes': '12km'
    });
    sendData('/training/', data, true);*/
}

function editTraining(training) {
    let id = 2;
    let data = JSON.stringify({
        'date': getDateFromUrl(),
        'lose': 100,
        'time': 3500,
        'notes': '12km'
    });
    let url = '/training/' + id + '/';
    sendData(url, data, 'POST', true);
}

function deleteTraining(training) {
    let id = 2;
    let data = JSON.stringify({
        'date': getDateFromUrl(),
    });
    let url = '/training/' + id + '/';
    sendData(url, data, 'DELETE', true);
}

function calculateLoseKcal(met, time, weight) {
    let lose = met * time * weight;
    return lose;
}

function sendData(endpoint, data, type, modal) {
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
        type: type,
        url: endpoint,
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        statusCode: {
            200: function() {
                if(modal == true) {
                    swal({
                        title: 'Training added successfully', 
                        icon: 'success'
                    });
                }
            },
            400: function() {
                if(modal == true) {
                    swal({
                        title: 'Bad request', 
                        icon: 'error'
                    });
                }
            },
            404: function() {
                if(modal == true) {
                    swal({
                        title: 'Not found', 
                        icon: 'error'
                    });
                }
            },
            405: function() {
                if(modal == true) {
                    swal({
                        title: 'Method not allowed', 
                        icon: 'error'
                    });
                }
            },
            500: function() {
                if(modal == true) {
                    swal({
                        title: 'Sorry, an server error occured',
                        icon: 'error'
                    });
                }
            }
        }
    });
}

function getDateFromUrl() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let date = urlParams.get('date');
    if(date == null) {
        let today = new Date();
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }
    return date;
}