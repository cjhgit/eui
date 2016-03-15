/**
 * Created by cjh1 on 2016/3/9.
 */
// ���ض���С���
(function($) {

    $.fn.backToTop = function(options) {

        var defaults = {
            topOffset: 300, // ��ʼ��ʾ���ض�������ʱ��ҳ�涥���ľ��루���أ�
            opacityOffset: 1200, // ��ʼ���͸��ʱ��ҳ�涥���ľ��루���أ�
            duration: 700, // ���ض���������ʱ��(ms)
        };
        var opts = $.extend(defaults, options);

        var $elem = $(this); // ���ض�������

        // ���ػ���ʾ���ض�������
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

        // ƽ�����ض���
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
    // ���ض���
    $('.to-top').backToTop();
});