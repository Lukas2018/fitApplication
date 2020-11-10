let currentView = 0;

window.onload = function() {
    $('.down-arrow').click(function() {
        switchSubMenu($(this));
    });
    $('.kcal-menu').click(function() {
        renderKcalData();
    });
    $('.protein-menu').click(function() {
        renderProteinData();
    });
    $('.carbohydrates-menu').click(function() {
        renderCarbohydratesData();
    });
    $('.fats-menu').click(function() {
        renderFatsData();
    });
    $('.steps-menu').click(function() {
        renderStepsData();
    });
    $('.water-menu').click(function() {
       renderWaterData(); 
    });
    $('.weight-menu').click(function() {
        renderWeightData();
    });
    $('.pulse-menu').click(function() {
        renderPulseData();
    });
    prepareData();
    renderWaterData();
    let type = 'bar';
    let labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    let label = "mililitres of water";
    let data = [12, 19, 3, 5, 2, 3];
    renderChart(type, labels, label, data);
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

function renderKcalData() {
    let label = 'kcal';
    $('.title .name').text('Kcal');
}

function renderProteinData() {
    let label = 'proteins';
    $('.title .name').text('Proteins');
}

function renderCarbohydratesData() {
    let label = 'carbohydrates';
    $('.title .name').text('Carbohydrates');
}

function renderFatsData() {
    let label = 'fats';
    $('.title .name').text('Fats');
}

function renderStepsData() {
    let label = 'steps';
    $('.title .name').text('Steps');
}

function renderWaterData() {
    let label = 'ml';
    $('.title .name').text('Water');
}

function renderWeightData() {
    let label = 'kg';
    $('.title .name').text('Weight');
}

function renderPulseData() {
    let label = 'pulse';
    let data = prepareData();
    prepareLabels();
    $('.title .name').text('Pulse');
}

function prepareData() {
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
        'LeftDay': data[0],
        'LeftMonth': data[1],
        'LeftYear': data[2],
        'RightDay': data[3],
        'RightMonth': data[4],
        'RightYear': data[5]
    });
    return getData('/', dataToSend);
}

function prepareLabels() {
    let periodValue = $('#select-period').val();
    let labels;
    if((periodValue == 0) || (periodValue == 1)) {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
    else if((periodValue == 2) || (periodValue == 3)) {

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
    $('.max .value').text(max);
    $('.min .value').text(min);
    $('.mean .value').text(mean);
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
    let sum = 0;
    for(let i = 0; i < data.length; i++) {
        sum = sum + data[i];
    }
    return (sum / data.length).toFixed(2);
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
                console.log(data);
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
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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