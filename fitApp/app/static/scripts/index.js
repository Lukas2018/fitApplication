window.onload = function () {
    let timerW;
    let timerP
    let timeToWait = 3000;
    $('.arrow-down').click(function() {
        showDetails(this);
    });
    $('.weight_data .minus').click(function() {
        clearTimeout(timerW);
        decrement(this, 0.1);
        timerW = setTimeout(function () {
            data = JSON.stringify({
                'weight': $('.weight_data .data').text(),
            });
            sendData('/save_weight/', data);
            console.log('Sended weight');
        }, timeToWait);
    }); 
    $('.weight_data .plus').click(function() {
        clearTimeout(timerW);
        increment(this, 0.1);
        timerW = setTimeout(function () {
            data = JSON.stringify({
                'weight': $('.weight_data .data').text(),
            });
            sendData('/save_weight/', data);
            console.log('Sended weight');
        }, timeToWait);
    });
    $('.heart_data .minus').click(function() {
        clearTimeout(timerP);
        decrement(this, 1);
        timerP = setTimeout(function () {
            data = JSON.stringify({
                'pulse': $('.heart_data .data').text(),
            });
            sendData('/save_pulse/', data);
            console.log('Sended Pulse');
        }, timeToWait);
    }); 
    $('.heart_data .plus').click(function() {
        clearTimeout(timerP);
        increment(this, 1);
        timerP = setTimeout(function () {
            data = JSON.stringify({
                'pulse': $('.heart_data .data').text(),
            });
            sendData('/save_pulse/', data);
            console.log('Sended pulse');
        }, timeToWait);
    });
}

function showDetails(arrowElem) {
    let listElem = arrowElem.parentNode.parentNode.parentNode.querySelector('.details');
    if(arrowElem.classList.contains('arrow-up')) {
        arrowElem.classList.remove('arrow-up');
        arrowElem.classList.add('arrow-down');
        listElem.style.display = 'none';
    }
    else {
        arrowElem.classList.remove('arrow-down');
        arrowElem.classList.add('arrow-up');
        listElem.style.display = 'block';
    }
}

function decrement(elem, value) {
    elem = $(elem).parent().parent().find('.data');
    elem.text(Math.round((parseFloat(elem.text()) - value) * 10) / 10);
}

function increment(elem, value) {
    elem = $(elem).parent().parent().find('.data');
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