/**
 * ui.selectable
 *
 * https://github.com/cjhgit/eui
 */
(function ($) {
    'use strict';

    function Selectable(elem, option) {
        var $elem = $(elem);
        var opts = $.extend({}, Selectable.DEFAULTS, option);
        $elem.on('click', opts.item, function (e) {
            e.preventDefault();

            $elem.find(opts.item + '.' + opts.activeClass).removeClass(opts.activeClass);
            $(this).addClass(opts.activeClass);

            opts.selected(e, this);
        })
    }

    Selectable.DEFAULTS = {
        item: '.item',
        activeClass: 'active',
        selected: function(event, item) {},
        unselected: function(event, item) {},
    };

    $.fn.selectable = function (option) {
        return $(this).each(function () {
            new Selectable(this, option);
        });
    };

    // TODO destory、disable、enable、
})(jQuery);
