var monthText = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

window.onload = function () {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    fillTable(month, year);
    fillHeader(month, year);
    fillBarHeader(day, month, year);
    $('.' + year + '-' + (month + 1) + '-' + day + ' p').addClass('active');
    let data = JSON.stringify({
        'year': year,
        'month': month + 1,
        'day': day
    });
    getData('/get_day_data/', data);
    $('.prev-month').click(function() {
        prevMonth();
    })
    $('.next-month').click(function() {
        nextMonth();
    })
    $('.prev-year').click(function() {
        prevYear();
    })
    $('.next-year').click(function() {
        nextYear();
    })
}

function fillTable(month, year) {
    let date = new Date(year, month, 1);
    let day = date.getDay();
    let dayIterator = 1;
    let monthLength = daysInMonth(month, year);
    let today = new Date();
    let currentDay = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    if(day == 0) {
        day = 7;
    }
    let element = $('<div class="c-cal-row c-days"></div>');
    $('.c-cal-container').append(element);
    for(let i = 1; i < day; i++) {
        element.append('<div class="c-cal-cel"></div>');
    }
    for(let i = day; i < 8; i++) {
        element.append('<div class="c-cal-cel ' + year + '-' + (month+1) + '-' + dayIterator + '"><p>' + dayIterator + '</p></div>');
        dayIterator++;
    }
    for(dayIterator; dayIterator <= monthLength;) {
        let newElement = $('<div class="c-cal-row c-days"></div>');
        $('.c-cal-container').append(newElement);
        for(let i = 1; i < 8; i++) {
            newElement.append('<div class="c-cal-cel ' + year + '-' + (month+1) + '-' + dayIterator + '"><p>' + dayIterator + '</p></div>');
            dayIterator++;
            if(dayIterator > monthLength) {
                break;
            }
        }
    }
    if((month == currentMonth) && (year == currentYear)) {
        $('.' + year + '-' + (month + 1) + '-' + currentDay + ' p').addClass('today');
    }
    $('.c-cal-cel p').click(function() {
        addClickOnCells(this);
    })
    let rows = $('.c-cal-container').find('.c-days').length;
    if(rows == 6) {
        $('.c-cal-container').css('padding-bottom', '57%');
    }
    else if(rows == 5) {
        $('.c-cal-container').css('padding-bottom', '51%');
    }
    else {
        $('.c-cal-container').css('padding-bottom', '46%');
    }
}

function fillHeader(month, year) {
    $('.c-paginator-month').text(monthText[month]);
    $('.c-paginator-year').text(year);
}

function fillBarHeader(day, month, year) {
    $('.c-aside-num').text(day);
    $('.c-aside-month').text(monthText[month]);
    $('.c-aside-year').text(year);
}

function fillBarData(data) {
    $('.kcal-data .data .current').text(data['kcal']);
    $('.kcal-lose .data').text(data['lose_kcal']);
    $('.protein-data .data .current').text(data['protein']);
    $('.carbohydrates-data .data .current').text(data['carbohydrates']);
    $('.fats-data .data .current').text(data['fats']);
    $('.steps-data .data .current').text(data['steps']);
    $('.water-data .data .current').text(data['water']);
    $('.weight-data .data').text(data['weight']);
    $('.heart-data .data').text(data['pulse']);
}

function clearTable() {
    $('.c-cal-container').find('.c-days').remove();
}

function addClickOnCells(element) {
    let classList = $(element).parent().attr('class').split(" ");
        for(let i = 0; i < classList.length; i++) {
            if(classList[i] != 'c-cal-cel') {
                let date = classList[i].split("-");
                let year = date[0];
                let month = date[1];
                let day = date[2];
                let data = JSON.stringify({
                    'year': year,
                    'month': month,
                    'day': day
                });
                fillBarHeader(day, month - 1, year);
                getData('/get_day_data/', data);
                $('.c-cal-container').find('.active').removeClass('active');
                $(element).addClass('active');
            }
        }
}

function prevMonth() {
    let month = $('.c-paginator-month').text();
    let monthNum = monthNumber(month) - 1;
    let year = parseInt($('.c-paginator-year').text());
    if(monthNum == -1) {
        monthNum = 11;
        year--;
    }
    clearTable();
    fillTable(monthNum, year);
    fillHeader(monthNum, year);
}

function nextMonth() {
    let month = $('.c-paginator-month').text();
    let monthNum = monthNumber(month) + 1;
    let year = parseInt($('.c-paginator-year').text());
    if(monthNum == 12) {
        monthNum = 0;
        year++;
    }
    clearTable();
    fillTable(monthNum, year);
    fillHeader(monthNum, year);
}

function prevYear() {
    let month = $('.c-paginator-month').text();
    let monthNum = monthNumber(month);
    let year = parseInt($('.c-paginator-year').text()) - 1;
    clearTable();
    fillTable(monthNum, year);
    fillHeader(monthNum, year);
}

function nextYear() {
    let month = $('.c-paginator-month').text();
    let monthNum = monthNumber(month);
    let year = parseInt($('.c-paginator-year').text()) + 1;
    clearTable();
    fillTable(monthNum, year);
    fillHeader(monthNum, year);
}

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function monthNumber(month) {
    for(let i = 0; i < monthText.length; i++) {
        if(monthText[i] == month) {
            return i;
        }
    }
}

function getData(endpoint, data) {
    $.ajax({
        url: endpoint,
        type: 'GET',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        statusCode: {
            200: function(data) {
                fillBarData(data);
            },
            204: function() {
                console.log('No data on this day');
            }
        }
    });
}