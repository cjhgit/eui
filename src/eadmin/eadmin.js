/**
 * Created by cjh1 on 2016/3/25.
 */

$(document).ready(function(){
    var thtmes = 'theme-default theme-blue theme-green';
    function selectTheme(theme) {
        if (theme === 'blue') {
            $('body').removeClass(thtmes);
            $('body').addClass('theme-blue');
        } else if (theme === 'green') {
            $('body').removeClass(thtmes);
            $('body').addClass('theme-green');
        } else {
            $('body').removeClass(thtmes);
            $('body').addClass('theme-default');
        }
    }

    $('#theme-blue').on('click', function(e){
        e.preventDefault();

        selectTheme('blue');
    });

    $('#theme-green').on('click', function(e){
        e.preventDefault();

        selectTheme('green');
    });

    $('#theme-default').on('click', function(e){
        e.preventDefault();

        selectTheme('default')
    });

    $("[data-toggle='tooltip']").tooltip();
    $('[data-toggle="popover"]').popover();


});
