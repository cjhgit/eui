/**
 * 返回顶部插件
 * 时间：2016-3-16 23:45:37
 */
(function($) {

    $.fn.euiToTop = function(options) {

        var defaults = {
            topOffset: 300, // 滚动条距离顶部多少像素时显示返回顶部按钮
            duration: 700, // 返回顶部滚动时间(ms)
        };
        var opts = $.extend({}, defaults, options);

        var $this = $(this);

        $this.hide().on('click', function(event) {
            event.preventDefault();
            $('body,html').animate({
                    scrollTop: 0
                },
                opts.duration
            );
        });

        $(window).scroll(function() {
            if ($(this).scrollTop() > opts.topOffset) {
                $this.fadeIn();
            } else {
                $this.fadeOut();
            }
        });

        return this;
    }
})(jQuery);
