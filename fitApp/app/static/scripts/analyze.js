let currentView = -1;

window.onload = function() {
    $('.down-arrow').click(function() {
        switchSubMenu($(this));
    });
    $('#select-period').change(function() {
        switchSelect();
    });
    $('#select-chart-type').change(function() {
        switchSelect();
    });
    $('.kcal-menu').click(function() {
        subMenuClick(this, 'kcal', 0);
    });
    $('.protein-menu').click(function() {
        subMenuClick(this, 'protein', 1);
    });
    $('.carbohydrates-menu').click(function() {
        subMenuClick(this, 'carbohydrates', 2);
    });
    $('.fats-menu').click(function() {
        subMenuClick(this, 'fats', 3);
    });
    $('.steps-menu').click(function() {
        subMenuClick(this, 'steps', 4);
    });
    $('.water-menu').click(function() {
        subMenuClick(this, 'water', 5);
    });
    $('.weight-menu').click(function() {
        subMenuClick(this, 'weight', 6);
    });
    $('.pulse-menu').click(function() {
        subMenuClick(this, 'pulse', 7);
    });
}

function switchSubMenu(element) {
    if(element.hasClass('down-arrow')){
        element.removeClass('down-arrow');
        element.addClass('up-arrow');
        element.parent().find('.sub-menu').css('display', 'block');
    }
    else {
        element.removeClass('up-arrow');
        element.addClass('down-arrow');
        element.parent().find('.sub-menu').css('display', 'none');
    }
}

function subMenuClick(element, dataType, viewValue) {
    if(!$(element).hasClass('active')) {
        $('.sub-menu').find('.active').removeClass('active');
        $(element).addClass('active');
        $('.content').css('display', 'block');
        $('.content-image').css('display', 'none');
        resetSelects();
        currentView = viewValue;
        let data = prepareData(dataType);
        getData('/get_day_specific_data/', data);
    }
}

function switchSelect() {
    if(currentView == 0) {
        let data = prepareData('kcal');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 1) {
        let data = prepareData('protein');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 2) {
        let data = prepareData('carbohydrates');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 3) {
        let data = prepareData('fats');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 4) {
        let data = prepareData('steps');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 5) {
        let data = prepareData('water');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 6) {
        let data = prepareData('weight');
        getData('/get_day_specific_data/', data);
    }
    else if(currentView == 7) {
        let data = prepareData('pulse');
        getData('/get_day_specific_data/', data);
    }
}

function resetSelects() {
    $('#select-period').val(0);
    $('#select-chart-type').val(0);
}

function renderData(data) {
    let label;
    let info;
    let isSum = true;
    let beginValue = 0;
    if(currentView == 0) {
        label = 'Kcal';
        info = 'calories';
    }
    else if(currentView == 1) {
        label = 'Protein';
        info = 'grams of proteins';
    }
    else if(currentView == 2) {
        label = 'Carbohydrates';
        info = 'grams of carbohydrates';
    }
    else if(currentView == 3) {
        label = 'Fats';
        info = 'grams of fats';
    }
    else if(currentView == 4) {
        label = 'Steps';
        info = 'steps';
    }
    else if(currentView == 5) {
        label = 'Water';
        info = 'mililitres of water';
    }
    else if(currentView == 6) {
        label = 'Weight';
        info = 'kilograms';
        isSum = false;
        beginValue = 50;
    }
    else if(currentView == 7) {
        label = 'Pulse';
        info = 'beats per minute';
        isSum = false;
        beginValue = 60;
    }
    if(($('#select-period').val() == 4) || ($('#select-period').val() == 5)) {
        data = stackDataIntoMonths(data);
    }
    let values = $.map(data, function(value, key) { return value });
    console.log(values);
    let labels = Object.keys(data);
    console.log(labels);
    let chartType = getChartType();
    fillStats(values, isSum, info);
    $('.title .name').text(label);
    clearCanvas();
    renderChart(chartType, labels, label, values, beginValue);
}

function prepareData(type) {
    let periodValue = $('#select-period').val();
    let data;
    if(periodValue == 0) {
        data = getThisWeekDates();
    }
    else if(periodValue == 1) {
        data = getLastWeekDates();
    }
    else if(periodValue == 2) {
        data = getThisMonthDates();
    }
    else if(periodValue == 3) {
        data = getLastMonthDates();
    }
    else if(periodValue == 4) {
        data = getThisYearDates();
    }
    else {
        data = getLastYearDates();
    }
    let dataToSend = JSON.stringify({
        'leftDay': data[0],
        'leftMonth': data[1],
        'leftYear': data[2],
        'rightDay': data[3],
        'rightMonth': data[4],
        'rightYear': data[5],
        'type': type
    });
    return dataToSend;
}

function stackDataIntoMonths(data) {
    let keys = Object.keys(data);
    let year = parseInt(keys[0].split('-')[0]);
    let monthNum = parseInt(keys[keys.length - 1].split('-')[1]);
    let lastDay = parseInt(keys[keys.length - 1].split('-')[2]);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let outputData = {};
    let k = 0;
    for(let i = 0; i < monthNum; i++) {
        let tempData;
        if(i != monthNum - 1) {
            tempData = new Array(daysInMonth(i, year));
            for(let j = 1; j <= daysInMonth(i, year); j++) {
                tempData[j - 1] = data[keys[k]];
                k++;
            }
        }
        else {
            tempData = new Array(lastDay);
            for(let j = 1; j <= lastDay; j++) {
                tempData[j - 1] = data[keys[k]];
                k++;
            }
        }
        outputData[months[i]] = meanValue(tempData);
    }
    return outputData;
}

function getChartType() {
    let chartTypeVal = $('#select-chart-type').val();
    if(chartTypeVal == 0) {
        return 'line';
    }
    else {
        return 'bar';
    }
}

function fillStats(data, isSum, info) {
    $('.additional-info').text(info);
    $('.max .value').text(maxValue(data));
    $('.min .value').text(minValue(data));
    $('.mean .value').text(meanValue(data));
    if(isSum) {
        $('.sum').css('display', 'block');
        $('.sum .value').text(sumValue(data));
    }
    else {
        $('.sum').css('display', 'none');
    }
}

function maxValue(data) {
    let max = parseFloat(data[0]);
    for(let i = 1; i < data.length; i++) {
        let value = parseFloat(data[i]);
        if(value > max) {
            max = value;
        }
    }
    return max.toFixed(1);
}

function minValue(data) {
    let min = parseFloat(data[0]);
    for(let i = 1; i < data.length; i++) {
        let value = parseFloat(data[i]);
        if(value < min) {
            min = value;
        }
    }
    return min.toFixed(1);
}

function meanValue(data) {
    let sum = sumValue(data);
    return (sum / data.length).toFixed(1);
}

function sumValue(data) {
    let sum = 0;
    for(let i = 0; i < data.length; i++) {
        sum = sum + parseFloat(data[i]);
    }
    return sum.toFixed(1);
}

function getThisWeekDates() {
    let today = new Date();
    let first = today.getDate() - today.getDay() + 1;
    let leftDate = new Date(today.setDate(first));
    let rightDate = new Date();
    return generateDateArray(leftDate, rightDate);
}

function getLastWeekDates() {
    let today = new Date();
    let first = today.getDate() - today.getDay() + 1 - 7;
    let last = first + 6;
    let leftDate = new Date(today.setDate(first));
    let rightDate = new Date(today.setDate(last));
    return generateDateArray(leftDate, rightDate);
}

function getThisMonthDates() {
    let today = new Date();
    let leftDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let rightDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return generateDateArray(leftDate, rightDate);
}

function getLastMonthDates() {
    let today = new Date();
    let month = today.getMonth() - 1;
    let year = today.getFullYear();
    if(month == -1) {
        month = 11;
        year = year - 1;
    }
    let leftDate = new Date(year, month, 1);
    let rightDate = new Date(year, month, daysInMonth(month, year));
    return generateDateArray(leftDate, rightDate);
}

function getThisYearDates() {
    let today = new Date();
    let leftDate = new Date(today.getFullYear(), 0, 1);
    let rightDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return generateDateArray(leftDate, rightDate);
}

function getLastYearDates() {
    let today = new Date();
    let leftDate = new Date(today.getFullYear() - 1, 0, 1);
    let rightDate = new Date(today.getFullYear() - 1, 11, 31);
    return generateDateArray(leftDate, rightDate);
}

function generateDateArray(leftDate, rightDate) {
    let data = new Array(6);
    data[0] = leftDate.getDate();
    data[1] = leftDate.getMonth() + 1;
    data[2] = leftDate.getFullYear();
    data[3] = rightDate.getDate();
    data[4] = rightDate.getMonth() + 1;
    data[5] = rightDate.getFullYear();
    return data;
}

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
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
                renderData(data);
            },
            204: function() {
                console.log('No data on this day');
            }
        }
    });
}

function clearCanvas() {
    $('#my-chart').remove();
    $('.chart-container').append('<canvas id="my-chart" width="200" height="600"></canvas>');
}

function renderChart(type, labels, label, data, begin) {
    var ctx = document.getElementById('my-chart');
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'white',
                        suggestedMin: begin,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'white'
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0
                }
            }
        }
    });
}