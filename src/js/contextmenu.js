/**
 * contextmenu.js v16.12.1
 * 上下文菜单插件
 */

UI.$curContextElem = null;

;(function ($) {
    function Context(elem, option) {
        var that = this;
        that.opts = $.extend({}, Context.DEFAULTS, option);
        that.elem = elem;
        var $menu = $(that.opts.content);
        $menu.css('zIndex', 10000001);

        function pot($elem, x, y) {
            var width = $elem.outerWidth();
            var height = $elem.outerHeight();
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            var ptX = x;
            var ptY = y;

            if (ptY < winHeight - height) {

            } else if (ptY > height) {
                ptY = y - height;
            } else {
                ptY = winHeight - height;
            }

            if (ptX < winWidth - width) {

            } else if (ptX > width) {
                ptX = x - width;
            } else {
                ptX = winWidth - width;
            }

            $elem.css({
                'left': ptX,
                'top': ptY
            });
        }

        function handle(elem, e) {
            e.preventDefault();
            e.stopPropagation();

            if (UI.$curContextElem) {
                UI.$curContextElem.hide();
            }
            UI.$curContextElem = $menu;

            pot($menu, e.clientX, e.clientY);

            //$overlay.show();
            $menu.show();
            that.opts.show && that.opts.show(elem);

            $menu.addClass('context-active');

            UI.$curContextElem = $menu;

        }

        if (that.opts.item) {
            $(elem).on('contextmenu', that.opts.item, function (e) {
                handle(this, e);
                return true;
            });
        } else {
            $(elem).on('contextmenu', function (e) {
                handle(this, e);
                return true;
            });
        }


        $menu.on('contextmenu', function () {
            return false;
        });


    }

    Context.DEFAULTS = {
        //content
        show: function (ui) {},
        hide: function (ui) {}
    };

    $.fn.contextmenu = function (option) {
        return $(this).each(function (e) {
            new Context(this, option);
        });
    }
})(jQuery);

$(document).on('click', function (e) {
    if ($(e.target).parents(".context-active").length == 0
        || $(e.target).is('.dropdown-menu a')) {
        if (UI.$curContextElem) {
            UI.$curContextElem.hide();
            UI.$curContextElem.removeClass('context-active');
            UI.$curContextElem = null;
        }
    }
});
