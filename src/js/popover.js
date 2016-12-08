/**
 * EUI: popover.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    var Popover = function (element, options) {
        this.init('popover', element, options);
    };

    if (!$.fn.tooltip) {
        throw new Error('Popover requires tooltip.js');
    }

    Popover.VERSION = '1.3.0';

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'hover',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });


    // NOTE: POPOVER 继承 tooltip.js

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    var fn = Popover.prototype;

    Popover.prototype.constructor = Popover;

    fn.getDefaults = function () {
        return Popover.DEFAULTS
    };

    fn.setContent = function () {
        var $tip = this.tip();
        var title = this.getTitle();
        var content = this.getContent();

        $tip.find('.popover-title')[this.opts.html ? 'html' : 'text'](title);
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.opts.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content);

        $tip.removeClass('fade top bottom left right in');

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) {
            $tip.find('.popover-title').hide();
        }
    };

    fn.hasContent = function () {
        return this.getTitle() || this.getContent();
    };

    fn.getContent = function () {
        var $e = this.$element;
        var o = this.opts;

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content);
    };

    fn.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.popover');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) {
                return;
            }
            if (!data) {
                $this.data('ui.popover', (data = new Popover(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    }

    var old = $.fn.popover;

    $.fn.popover = Plugin;
    $.fn.popover.Constructor = Popover;

    $.fn.popover.noConflict = function () {
        $.fn.popover = old;
        return this;
    }
})(jQuery);
