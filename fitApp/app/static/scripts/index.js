window.onload = function () {
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
                'water': $('.water_data .data .current').text(),
            });
            sendData('/save_water/', data);
        }, timeToWait);
    });
    $('.full-bottle').click(function() {
        clearTimeout(timerB);
        emptyBottle($(this));
        timerB = setTimeout(function () {
            let data = JSON.stringify({
                'water': $('.water_data .data .current').text(),
            });
            sendData('/save_water/', data);
        }, timeToWait);
    });
    $('.weight_data .minus').click(function() {
        clearTimeout(timerW);
        decrement($(this), 0.1);
        timerW = setTimeout(function () {
            let data = JSON.stringify({
                'weight': $('.weight_data .data').text(),
            });
            sendData('/save_weight/', data);
        }, timeToWait);
    }); 
    $('.weight_data .plus').click(function() {
        clearTimeout(timerW);
        increment($(this), 0.1);
        timerW = setTimeout(function () {
            let data = JSON.stringify({
                'weight': $('.weight_data .data').text(),
            });
            sendData('/save_weight/', data);
        }, timeToWait);
    });
    $('.heart_data .minus').click(function() {
        clearTimeout(timerP);
        decrement($(this), 1);
        timerP = setTimeout(function () {
            let data = JSON.stringify({
                'pulse': $('.heart_data .data').text(),
            });
            sendData('/save_pulse/', data);
        }, timeToWait);
    }); 
    $('.heart_data .plus').click(function() {
        clearTimeout(timerP);
        increment($(this), 1);
        timerP = setTimeout(function () {
            let data = JSON.stringify({
                'pulse': $('.heart_data .data').text(),
            });
            sendData('/save_pulse/', data);
        }, timeToWait);
    });
}

window.onbeforeunload = function() {
    var formData = new FormData();
    formData.append('weight', $('.weight_data .data').text());
    formData.append('pulse', $('.heart_data .data').text());
    formData.append('water', $('.water_data .data .current').text());
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    navigator.sendBeacon('/save_index_data/', formData);
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
        $('#bottles').append('<li class="empty-bottle image"></li>');
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
    let value = numOfBottles * 250;
    let expectedValue = parseInt($('.water_data .data .expected').text());
    $('.water_data .data .current').text(value);
    if(expectedValue > value) {
        $('.water_data .status').removeClass('good').addClass('bad');
    }
    else {
        $('.water_data .status').removeClass('bad').addClass('good');
    }
}

function decrement(elem, value) {
    elem = elem.parent().parent().find('.data');
    elem.text(Math.round((parseFloat(elem.text()) - value) * 10) / 10);
}

function increment(elem, value) {
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
        dataType: 'json'
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}