window.addEventListener('load', function() {
    if($('#error').val() == 1) {
        swal({
            title: 'Sorry, an server error occured', 
            icon: 'error'
        });
    }
    if($('#success').val() == 1) {
        swal({
            title: 'Operation completed successfully', 
            icon: 'success'
        }).then(function() {
            let url = 'http://localhost:8000/' + window.location.href.split('/')[3];
            console.log(url)
            window.history.pushState("", "", url);
        });
    }
});

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

function convertSecondsToTimeString(seconds) {
    let hours = Math.floor(seconds/3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor(seconds - hours * 3600 - minutes * 60);
    result = addZeroIfNeeded(hours) + ':' + addZeroIfNeeded(minutes) + ':' + addZeroIfNeeded(seconds);
    return result;
}

function convertTimeStringToSeconds(time) {
    time = time.split(':');
    let hours = parseInt(cutZeroIfNeeded(time[0]));
    let minutes = parseInt(cutZeroIfNeeded(time[1]));
    let seconds = parseInt(cutZeroIfNeeded(time[2]));
    return 3600*hours + 60*minutes + seconds; 
}

function addZeroIfNeeded(time) {
    if(time < 10) {
        return '0' + time.toString();
    }
    return time.toString();
}

function cutZeroIfNeeded(time) {
    if(time[0] == '0') {
        return time[1];
    }
    return time;
}