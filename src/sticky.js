/**
 * 悬停插件
 *
 * Date: 2016-4-2
 */

(function ($) {
    $.fn.posfixed = function (options) {
        var defaults = {
            offset: 0
        };
        var opts = $.extend({}, defaults, options);

        var $this = $(this);
        var initPos = $this.offset().top;

        $(window).scroll(function (event) {
            var offsetTop = $this.offset().top - $(window).scrollTop();

            if (offsetTop <= opts.offset) {
                $this.css({
                    'position': 'fixed',
                    'top': opts.offset + 'px'
                });
            }
            if ($this.offset().top <= initPos) {
                $this.css("position", "static");
            }
        });
    }
})(jQuery);
