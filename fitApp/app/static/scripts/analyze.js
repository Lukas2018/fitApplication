let currentView = -1;

window.onload = function() {
    $('.down-arrow').click(function() {
        switchSubMenu($(this));
    });
    $('.kcal-menu').click(function() {
        currentView = 0;
        renderKcalData();
    });
    $('.protein-menu').click(function() {
        currentView = 1;
        renderProteinData();
    });
    $('.carbohydrates-menu').click(function() {
        currentView = 2;
        renderCarbohydratesData();
    });
    $('.fats-menu').click(function() {
        currentView = 3;
        renderFatsData();
    });
    $('.steps-menu').click(function() {
        currentView = 4;
        renderStepsData();
    });
    $('.water-menu').click(function() {
        currentView = 5;
        let data = prepareData('water');
        getData('/get_day_specific_data/', data);
    });
    $('.weight-menu').click(function() {
        currentView = 6;
        let data = prepareData('weight');
        getData('/get_day_specific_data/', data)
    });
    $('.pulse-menu').click(function() {
        currentView = 7;
        let data = prepareData('pulse');
        getData('/get_day_specific_data/', data);
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

function renderData(data) {
    if(currentView == 0) {
        renderKcalData(data);
    }
    else if(currentView == 1) {
        renderProteinData(data);
    }
    else if(currentView == 2) {
        renderCarbohydratesData(data);
    }
    else if(currentView == 3) {
        renderFatsData(data);
    }
    else if(currentView == 4) {
        renderStepsData(data);
    }
    else if(currentView == 5) {
        renderWaterData(data);
    }
    else if(currentView == 6) {
        renderWeightData(data);
    }
    else if(currentView == 7) {
        renderPulseData(data);
    }
}

function renderKcalData(data) {
    let label = 'kcal';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Kcal');
    renderChart('bar', labels, label, values);
}

function renderProteinData(data) {
    let label = 'proteins';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Proteins');
    renderChart('bar', labels, label, values);
}

function renderCarbohydratesData(data) {
    let label = 'carbohydrates';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Carbohydrates');
    renderChart('bar', labels, label, values);
}

function renderFatsData(data) {
    let label = 'fats';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Fats');
    renderChart('bar', labels, label, values);
}

function renderStepsData(data) {
    let label = 'steps';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Steps');
    renderChart('bar', labels, label, values);
}

function renderWaterData(data) {
    let label = 'ml';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Water');
    renderChart('line', labels, label, values);
}

function renderWeightData(data) {
    let label = 'kg';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Weight');
    renderChart('line', labels, label, values);
}

function renderPulseData(data) {
    let label = 'pulse';
    let values = $.map(data, function(value, key) { return value });
    let labels = prepareLabels(data);
    fillStats(values);
    $('.title .name').text('Pulse');
    renderChart('bar', labels, label, values);
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

function prepareLabels(data) {
    let periodValue = $('#select-period').val();
    let labels;
    if((periodValue == 0) || (periodValue == 1)) {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
    else if((periodValue == 2) || (periodValue == 3)) {
        labels = Object.keys(data);
    }
    else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    return labels;
}

function fillStats(data) {
    let max = maxValue(data);
    let min = minValue(data);
    let mean = meanValue(data);
    let sum = sumValue(data);
    $('.max .value').text(max);
    $('.min .value').text(min);
    $('.mean .value').text(mean);
    $('.sum .value').text(sum);
}

function maxValue(data) {
    let max = data[0];
    for(let i = 1; i < data.length; i++) {
        if(data[i] > max) {
            max = data[i];
        }
    }
    return max;
}

function minValue(data) {
    let min = data[0];
    for(let i = 1; i < data.length; i++) {
        if(data[i] < min) {
            min = data[i];
        }
    }
    return min;
}

function meanValue(data) {
    let sum = sumValue(data);
    return (sum / data.length).toFixed(2);
}

function sumValue(data) {
    let sum = 0;
    for(let i = 0; i < data.length; i++) {
        sum = sum + data[i];
    }
    return sum;
}
function getThisWeekDates() {

}

function getLastWeekDates() {

}

function getThisMonthDates() {
    let data = new Array(6);
    let today = new Date();
    data[0] = 1;
    data[1] = today.getMonth() + 1;
    data[2] = today.getFullYear();
    data[3] = today.getDate();
    data[4] = today.getMonth() + 1;
    data[5] = today.getFullYear();
    return data;
}

function getLastMonthDates() {
    let data = new Array(6);
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    if(month == 0) {
        month = 12;
        year = year - 1;
    }
    data[0] = 1;
    data[1] = month;
    data[2] = year;
    data[3] = daysInMonth(month, year);
    data[4] = month;
    data[5] = year;
    return data;
}

function getThisYearDates() {
    let data = new Array(6);
    let today = new Date();
    data[0] = 1;
    data[1] = 1;
    data[2] = today.getFullYear();
    data[3] = today.getDate();
    data[4] = today.getMonth() + 1;
    data[5] = today.getFullYear();
    return data;
}

function getLastYearDates() {
    let data = new Array(6);
    let today = new Date();
    data[0] = 1;
    data[1] = 1;
    data[2] = today.getFullYear() - 1;
    data[3] = 31
    data[4] = 12;
    data[5] = today.getFullYear() - 1;
    return data;
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
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

function renderChart(type, labels, label, data) {
    var ctx = document.getElementById('myChart');
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
                        beginAtZero: true,
                        fontColor: 'white'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'white'
                    }
                }]
            }
        }
    });
}