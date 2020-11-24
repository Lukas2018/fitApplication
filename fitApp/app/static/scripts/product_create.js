window.onload = function() {
    $('#next').val(document.referrer);
    if($('#error').val() == 1) {
        swal({
            title: "Sorry, an server error occured", 
            icon: "error"
        });
    }
}