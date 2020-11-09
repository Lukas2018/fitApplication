window.onload = function() {
    renderWaterData();
    let type = 'bar';
    let labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    let label = "mililitres of water";
    let data = [12, 19, 3, 5, 2, 3];
    renderChart(type, labels, label, data)
}

function renderWaterData() {
    let label = 'ml';
    $('.title .name').text('Water');
}

function renderStepsData() {
    let label = 'steps';
    $('.title .name').text('Steps');
}

function renderWeightData() {
    let label = 'kg';
    $('.title .name').text('Weight');
}

function renderPulseData() {
    let label = 'pulse'
    $('.title .name').text('Pulse');
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