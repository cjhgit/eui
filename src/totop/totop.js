/**
 * Created by cjh1 on 2016/3/9.
 */
// 返回顶部小插件
(function($) {

    $.fn.backToTop = function(options) {

        var defaults = {
            topOffset: 300, // 开始显示返回顶部链接时与页面顶部的距离（像素）
            opacityOffset: 1200, // 开始变半透明时与页面顶部的距离（像素）
            duration: 700, // 返回顶部滚动的时间(ms)
        };
        var opts = $.extend(defaults, options);

        var $elem = $(this); // 返回顶部链接

        // 隐藏或显示返回顶部链接
        $(window).scroll(function() {
            if ($(this).scrollTop() > opts.topOffset) {
                $elem.show();
                //$elem.css('
                //$elem.addClass('cd-is-visible')
            } else {
                //$elem.removeClass('cd-is-visible cd-fade-out');
                $elem.hide();
            }

            if ($(this).scrollTop() > opts.opacityOffset) {
                //$elem.addClass('cd-fade-out');
            }
        });

        // 平滑返回顶部
        $elem.on('click', function(event) {
            event.preventDefault();
            $('body,html').animate({
                    scrollTop: 0 ,
                },
                opts.duration
            );
        });

        return this;
    }
})(jQuery);

$(document).ready(function($) {
    // 返回顶部
    $('.to-top').backToTop();
});