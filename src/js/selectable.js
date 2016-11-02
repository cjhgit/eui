/**
 * EUI selectable tool
 */
(function ($) {
    $.fn.selectable = function (option) {
        return $(this).each(function () {
            var $elem = $(this);
            var opts = $.extend({}, $.fn.selectable.DEFAULTS, option);
            $elem.on('click', opts.item, function (e) {
                e.preventDefault();

                $elem.find(opts.item + '.' + opts.activeClass).removeClass(opts.activeClass);
                $(this).addClass(opts.activeClass);

                opts.selected(e, this);
            })
        });
    };

    $.fn.selectable.DEFAULTS = {
        item: '.item',
        activeClass: 'active',
        selected: function(event, item) {},
        unselected: function(event, item) {},
    };

    // TODO destory、disable、enable、
})(jQuery);
