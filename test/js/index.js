/**
 * Created by cjh1 on 2016/3/11.
 */
$(function() {

    var isEmenuOpen = true;
    $('#menu').metisMenu(
        {
            onTransitionStart: function(){
                //alert('onTransitionStart');
            },
            onTransitionEnd: function(){
                //alert('onTransitionEnd');
            }
        });
    $('#menu-minimalize').on('click', function(){
        $('.esidebar').toggleClass('emenu-min');

        if (isEmenuOpen) {
            $('.esidebar').animate(
                {width: '45px'},
                500
            );
            $('.econtent').animate(
                {'padding-left': '45px'},
                500
            );
        } else {
            $('.esidebar').animate(
                {width: '220px'},
                500
            );
            $('.econtent').animate(
                {'padding-left': '220px'},
                500
            );
        }

        isEmenuOpen = !isEmenuOpen;

        //$('.econtent').css('padding-left', '50px');
    });


    $('#sidebar').slimScroll({
        width: $('#sidebar').width(),
        height: $(window).height()
    });
    /*
    $("#chat-box-body").slimScroll({
        height: "120px",
        railOpacity: .4
    });
    */
    $('#chat-box').hide();
    $('#chat-box-toggle').on('click', function() {
        $('#chat-box').toggle();
    });
});
