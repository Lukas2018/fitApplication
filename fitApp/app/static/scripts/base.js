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