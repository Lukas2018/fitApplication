let currentView = -1;

window.addEventListener('load', function() {
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
    $('.workout-menu').click(function() {
        subMenuClick(this, 'workout', 5);
    });
    $('.water-menu').click(function() {
        subMenuClick(this, 'water', 6);
    });
    $('.weight-menu').click(function() {
        subMenuClick(this, 'weight', 7);
    });
    $('.pulse-menu').click(function() {
        subMenuClick(this, 'pulse', 8);
    });
});

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
        if(viewValue == 7 || viewValue == 8) {
            disableSelectOptions();
        }
        currentView = viewValue;
        let data = prepareData(dataType);
        getData('/get_day_specific_data/', data);
    }
}

function switchSelect() {
    let data;
    if(currentView == 0) {
        data = prepareData('kcal');
    }
    else if(currentView == 1) {
        data = prepareData('protein');
    }
    else if(currentView == 2) {
        data = prepareData('carbohydrates');
    }
    else if(currentView == 3) {
        data = prepareData('fats');
    }
    else if(currentView == 4) {
        data = prepareData('steps');
    }
    else if(currentView == 5) {
        data = prepareData('workout');
    }
    else if(currentView == 6) {
        data = prepareData('water');
    }
    else if(currentView == 7) {
        data = prepareData('weight');
    }
    else if(currentView == 8) {
        data = prepareData('pulse');
    }
    getData('/get_day_specific_data/', data);
}

function resetSelects() {
    if($('#select-period option[value="4"]').length == 0) {
        $('#select-period').append('<option value="4">This year</option>');
    }
    if($('#select-period option[value="5"]').length == 0) {
        $('#select-period').append('<option value="5">Previous year</option>');
    }
    $('#select-period').val(0);
    $('#select-chart-type').val(0);
}

function disableSelectOptions() {
    $('#select-period option[value="4"]').remove();
    $('#select-period option[value="5"]').remove();
}

function renderData(data) {
    let label;
    let info;
    let isSum = true;
    let beginValue = 0;
    let isTime = false;
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
        label = 'Workout time';
        info = 'exercise time';
        isTime = true;
    }
    else if(currentView == 6) {
        label = 'Water';
        info = 'mililitres of water';
    }
    else if(currentView == 7) {
        label = 'Weight';
        info = 'kilograms';
        isSum = false;
        beginValue = 50;
    }
    else if(currentView == 8) {
        label = 'Pulse';
        info = 'beats per minute';
        isSum = false;
        beginValue = 60;
    }
    let values = $.map(data, function(value, key) { return value });
    let dataSummary = getDataType(values, 'summary');
    let dataExpected = getDataType(values, 'expected');
    let labels = Object.keys(data);
    if(($('#select-period').val() == 4) || ($('#select-period').val() == 5)) {
        data = stackDataIntoMonths(dataSummary, labels);
        dataExpected = null;
        labels = Object.keys(data);
        dataSummary = $.map(data, function(value, key) { return value });
        label = label + " mean";
    }
    let chartType = getChartType();
    fillStats(dataSummary, info, isSum, isTime);
    $('.title .name').text(label);
    clearCanvas();
    renderChart(chartType, labels, label, dataSummary, dataExpected, beginValue, isTime);
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
        'leftDate': data[0],
        'rightDate': data[1],
        'type': type
    });
    return dataToSend;
}

function stackDataIntoMonths(data, keys) {
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
                tempData[j - 1] = data[k];
                k++;
            }
        }
        else {
            tempData = new Array(lastDay);
            for(let j = 1; j <= lastDay; j++) {
                tempData[j - 1] = data[k];
                k++;
            }
        }
        outputData[months[i]] = meanValue(tempData);
    }
    return outputData;
}

function getDataType(data, type) {
    let resultsData = new Array(data.length);
    if(data[data.length - 1][type] === undefined) {
        return null;
    }
    for(let i = 0; i < data.length; i++) {
        resultsData[i] = data[i][type];
    }
    return resultsData;
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

function fillStats(data, info, isSum, isTime) {
    $('.additional-info').text(info);
    let max = maxValue(data);
    let min = minValue(data);
    let mean = meanValue(data);
    let sum = sumValue(data);
    if(isTime) {
        max = convertSecondsToTimeString(max);
        min = convertSecondsToTimeString(min);
        mean = convertSecondsToTimeString(mean);
        sum = convertSecondsToTimeString(sum);
    }
    $('.max .value').text(max);
    $('.min .value').text(min);
    $('.mean .value').text(mean);
    if(isSum) {
        $('.sum').css('display', 'block');
        $('.sum .value').text(sum);
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
    let minusDay = today.getDay();
    if(minusDay == 0) {
        minusDay = 7;
    }
    let first = today.getDate() - minusDay + 1;
    let leftDate = new Date(today.setDate(first));
    let rightDate = new Date();
    return generateDateArray(leftDate, rightDate);
}

function getLastWeekDates() {
    let today = new Date();
    let minusDay = today.getDay();
    if(minusDay == 0) {
        minusDay = 7;
    }
    let first = today.getDate() - minusDay - 6;
    let last = first + 6;
    let leftDate = new Date(today.setDate(first));
    today = new Date();
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
    let data = new Array(2);
    leftDate = leftDate.getFullYear() + '-' + (leftDate.getMonth() + 1) + '-' + leftDate.getDate();
    rightDate = rightDate.getFullYear() + '-' + (rightDate.getMonth() + 1) + '-' + rightDate.getDate();
    data[0] = leftDate;
    data[1] = rightDate;
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
        }
    });
}

function clearCanvas() {
    $('#my-chart').remove();
    $('.chart-container').append('<canvas id="my-chart" width="200" height="600"></canvas>');
}

function renderChart(type, labels, label, dataSummary, dataExpected, begin, isTime) {
    let datasets = [{
        label: label,
        data: dataSummary,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
    }];

    if(dataExpected != null) {
        datasets[1] = {
            label: 'Expected value',
            data: dataExpected,
            type: 'line',
            borderColor: 'red',
            fill: false
        }
    }
    var ctx = document.getElementById('my-chart');
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'white',
                        suggestedMin: begin,
                        callback: function(label, index, labels) {
                            if(isTime) {
                                return convertSecondsToTimeString(label);
                            }
                            return label;
                        }
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

function convertSecondsToTimeString(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor(seconds - hours * 3600 - minutes * 60);
    let result = addZeroIfNeeded(hours) + ':' + addZeroIfNeeded(minutes) + ':' + addZeroIfNeeded(seconds);
    return result;
}

function addZeroIfNeeded(time) {
    if(time < 10) {
        return '0' + time
    }
    return time
}