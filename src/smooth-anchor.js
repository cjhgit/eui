// ƽ�����������ʹҳ���ڵ�����ê������ƽ������
(function($){
    $.smoothAnchor = function(options){

        var DEFAULTS = {
            time: 800, // ����ʱ��
            direction: 1 // Ӧ���Ƿ���1����ֱ����2����ˮƽ����
        };

        var opts = $.extend({}, DEFAULTS, options);

        $(document).on('click', 'a[href*=#]', function(){
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname) {
                var $target = $(this.hash);
                $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
                if ($target.length) {
                    if (opts.direction == 1) {
                        $('html,body').animate({
                            scrollTop: $target.offset().top
                        }, opts.time);
                    } else if (opts.direction == 2) {
                        $('html,body').animate({
                            scrollLeft: $target.offset().left
                        }, opts.time);
                    } else {
                        alert('argument error');
                    }
                    return false;
                }
            }
        });
    };
})(jQuery);
