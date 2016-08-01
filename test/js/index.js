/**
 * Created by cjh1 on 2016/3/11.
 */
$(function() {

    var menuState = 1; // 菜单状态（1显示，2缩进，3隐藏）
    $('#menu').metisMenu({
        toggle: true,
        onTransitionStart: function(){
            if (menuState !== 1) {
                showMenu();
            }
        },
        onTransitionEnd: function(){
            //alert('onTransitionEnd');
        }
    });
    /*
    .on('show.metisMenu', function(event) {

      // do something…

  }
    */
    function showMenu() {
        $('#sidebar').slimScroll({destroy: true});

        $sidebar = $('.esidebar');

        if (!$sidebar.hasClass('emenu-min')) {
            return;
        }

        $sidebar.toggleClass('emenu-min');

        $sidebar.css('opacity',.5);
        $sidebar.animate(
            {
                width: '220px',
                opacity: 1
            },
            400,
            function () {
                console.log($(window).height());
                $('#sidebar').slimScroll({
                    width: $('#sidebar').width(),
                    height: $(window).height(),
                });
            }
        );

        $('.econtent').animate(
            {'left': '220px'},
            400
        );
        menuState = 1;
    }

    function minMenu() {
        $('#sidebar').slimScroll({destroy: true});

        $sidebar = $('.esidebar');

        if ($sidebar.hasClass('emenu-min')) {
            return;
        }

        $sidebar.toggleClass('emenu-min');

        $sidebar.css('opacity',.5);
        $sidebar.animate(
            {
                width: '70px',
                opacity: 1
            },
            400,
            function() {
                $('#sidebar').slimScroll({
                    width: $('#sidebar').width(),
                    height: $(window).height(),
                });
            }
        );
        $('.econtent').animate(
            {'left': '70px'},
            400
        );
        menuState = 2;
    }

    function hideMenu() {
        $('#sidebar').slimScroll({destroy: true});

        $sidebar = $('.esidebar');
        $sidebar.toggleClass('emenu-min');

        $sidebar.css('opacity',.5);
        $sidebar.animate(
            {
                width: '0px',
                opacity: 1
            },
            400,
            function() {
                $('#sidebar').slimScroll({
                    width: $('#sidebar').width(),
                    height: $(window).height(),
                });
            }
        );
        $('.econtent').animate(
            {'left': '0px'},
            400
        );
        menuState = 3;
    }

    $('#menu-minimalize').on('click', function(){

        if (menuState === 1) {
            if ($(window).width() > 400) {
                minMenu();
            } else {
                hideMenu();
            }
        } else {
            showMenu();
        }
    });

    $(window).resize(function() {
        var windowWidth = $(window).width();
        if (windowWidth < 400) {
            hideMenu();
        } else if (windowWidth < 768) {
            minMenu();
        } else {
            showMenu();
        }
    });

    // 滚动条美化
    $('#sidebar').slimScroll({
        width: $('#sidebar').width(),
        height: $(window).height(),
    });

    $('#chat-box').hide();
    $('#chat-box-toggle').on('click', function() {
        $('#chat-box').toggle();
    });

    $(document.body).css('overflow', 'hidden');

    $('#theme').on('click', function() {
        $('#side-setting').toggle();
    })
});
