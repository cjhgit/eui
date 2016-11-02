/**
 * Rotateable
 */
;(function ($) {

    function Rotateable(elem, option) {
        var ops = $.extend({}, Rotateable.DEFAULTS, option);
        var $elem = $(elem);

        var down = false;

        $handle = $('<div class="resizable-handle resizable-handle-n eui-rotate-handle" style="cursor: n-resize;"></div>');
        $elem.append($handle);

        //初始化
        function Init() {
            //初始化圆心点
            if (ops.centerX == 0 && ops.centerY == 0) {
                ops.centerX = $elem.offset().left + $elem.width() / 2;
                ops.centerY = $elem.offset().top + $elem.height() / 2
            }

            var $handle;

            if (!ops.handle) {
                $handle = $elem.find('.resizable-handle');
            } else {
                $handle = $(ops.handle);
            }


            $handle.on('mousedown', function (e) {
                down = true;
                e.stopPropagation();

                $(document).on('mousemove', movehandle);
            });



            $(document).on('mouseup', function (event) {
                down = false;
                $(document).off('mousemove', movehandle);
            });
        }

        // 鼠标移动时处理事件
        function movehandle(event) {
           /* if (!down) {
                return;
            }*/

            event = event || window.event;
            event.stopPropagation();

            var deg = angle(ops.centerX, ops.centerY, event.clientX, event.clientY);
            rotate(deg);
        }

        // 计算两点的线在页面中的角度
        function angle(centerx, centery, endx, endy) {
            var diff_x = endx - centerx,
                diff_y = endy - centery;
            var c = 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI);
            c = c <= -90 ? (360 + c) : c;
            return c + 90;
        }

        // 设置角度
        function rotate(angle, step) {
            $($elem).css('transform', 'rotateZ(' + angle + 'deg)');
        }

        Init();
    }

    Rotateable.DEFAULTS = {
        //handle: document,           //拖动按钮 默认 整个文档
        centerX: 0,                      //圆心点x 默认 对象中心x
        centerY: 0,                      //圆心点y 默认 对象中心y
    };

    $.fn.rotateable = function (options) {

        return $(this).each(function () {
            new Rotateable(this, options);
        });
    };
})(jQuery);
