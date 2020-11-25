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
            sendData('/save_water/', data);
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
            sendData('/save_water/', data);
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
            sendData('/save_weight/', data);
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
            sendData('/save_weight/', data);
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
            sendData('/save_pulse/', data);
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
            sendData('/save_pulse/', data);
        }, timeToWait);
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