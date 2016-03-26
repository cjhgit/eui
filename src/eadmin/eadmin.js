/**
 * Created by cjh1 on 2016/3/25.
 */

$(document).ready(function(){
    var thtmes = 'theme-default theme-blue theme-green';

    $('#theme-blue').on('click', function(e){
        e.preventDefault();

        $('body').removeClass(thtmes);
        $('body').addClass('theme-blue');
    });

    $('#theme-green').on('click', function(e){
        e.preventDefault();

        $('body').removeClass(thtmes);
        $('body').addClass('theme-green');
    });

    $('#theme-default').on('click', function(e){
        e.preventDefault();

        $('body').removeClass(thtmes);
    });
});