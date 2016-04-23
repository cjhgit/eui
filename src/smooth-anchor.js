// 平滑滚动插件，使页面内的所有锚点链接平滑滚动
(function($){
    $.smoothAnchor = function(options){

        var DEFAULTS = {
            time: 800, // 滚动时间
            direction: 1 // 应该是方向，1代表垂直方向，2代表水平方向
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
