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
    let month = today.getMonth();
    let year = today.getFullYear();
    fillTable(month, year);
    fillHeader(month, year);
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
    if(day == 0) {
        day = 7;
    }
    let element = $('<div class="c-cal-row c-days"></div>');
    $('.c-cal-container').append(element);
    for(let i = 1; i < day; i++) {
        element.append('<div class="c-cal-cel"></div>');
    }
    for(let i = day; i < 8; i++) {
        element.append('<div data-day="' + year + '-' + (month+1) + '-' + dayIterator + '"class="c-cal-cel"><p>' + dayIterator + '</p></div>');
        dayIterator++;
    }
    for(dayIterator; dayIterator <= monthLength;) {
        let newElement = $('<div class="c-cal-row c-days"></div>');
        $('.c-cal-container').append(newElement);
        for(let i = 1; i < 8; i++) {
            newElement.append('<div data-day="' + year + '-' + (month+1) + '-' + dayIterator + '"class="c-cal-cel"><p>' + dayIterator + '</p></div>');
            dayIterator++;
            if(dayIterator > monthLength) {
                break;
            }
        }
    }
    let rows = $('.c-cal-container').find('.c-days').length;
    if(rows == 6) {
        $('.c-cal-container').css('padding-bottom', '58%');
    }
    else if(rows == 5) {
        $('.c-cal-container').css('padding-bottom', '50%');
    }
    else {
        $('.c-cal-container').css('padding-bottom', '42%');
    }
}

function fillHeader(month, year) {
    $('.c-paginator-month').text(monthText[month]);
    $('.c-paginator-year').text(year);
}

function clearTable() {
    $('.c-cal-container').find('.c-days').remove();
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