/**
 * EUI rotateable.js 1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        }
    }

    function Rotateable(elem, option) {

        var that = this;
        that.opts = $.extend({}, Rotateable.DEFAULTS, option);
        that.elem = elem;
        that.$elem = $(elem);
        that.rotating = false;
        that.down = false;

        that.init();
    }

    Rotateable.DEFAULTS = {
        handle: false, // 拖动按钮。document: 整个文档
        centerX: 0, // 圆心点x 默认 对象中心x
        centerY: 0, // 圆心点y 默认 对象中心y,
        start: function(event, ui) {}, // 开始旋转
        rotate: function(event, ui) {}, // 旋转中
        end: function(event, ui) {}, // 旋转结束
    };


    Rotateable.getDeg = function ($elem) {

        /*
         * 解析matrix矩阵，0°-360°，返回旋转角度
         * 当a=b||-a=b,0<=deg<=180
         * 当-a+b=180,180<=deg<=270
         * 当a+b=180,270<=deg<=360
         *
         * 当0<=deg<=180,deg=d;
         * 当180<deg<=270,deg=180+c;
         * 当270<deg<=360,deg=360-(c||d);
         * */
        function getmatrix(a, b, c, d, e, f) {
            var aa = Math.round(180 * Math.asin(a) / Math.PI);
            var bb = Math.round(180 * Math.acos(b) / Math.PI);
            var cc = Math.round(180 * Math.asin(c) / Math.PI);
            var dd = Math.round(180 * Math.acos(d) / Math.PI);
            var deg = 0;
            if (aa == bb || -aa == bb) {
                deg = dd;
            } else if (-aa + bb == 180) {
                deg = 180 + cc;
            } else if (aa + bb == 180) {
                deg = 360 - cc || 360 - dd;
            }
            return deg >= 360 ? 0 : deg;
        }

        var matrix = $elem.css('transform');
        var deg = 0;
        var reg = /matrix\(([\d\D]*)\)/;
        if (matrix !== 'none') {
            var arr = reg.exec(matrix)[1].split(',');
            deg = getmatrix(parseFloat(arr[0].trim()), parseFloat(arr[1].trim()), parseFloat(arr[2].trim()),
                parseFloat(arr[3].trim()), parseFloat(arr[4].trim()), parseFloat(arr[5].trim()))
        }
        return deg;
    };

    var fn = Rotateable.prototype;

    fn.init = function () {
        var that = this;
        var opts = that.opts;

        // 鼠标移动时处理事件
        function movehandle(e) {
            e.stopPropagation();

            var deg = angle(opts.centerX, opts.centerY, e.clientX, e.clientY - that.startDeg);
            rotate(deg);

            if (!that.rotating) {
                that.rotating = true;
                that.opts.start(e, that.elem);
            } else {
                e.deg = deg;
                that.opts.rotate(e, that.elem);
            }
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
            that.$elem.css('transform', 'rotateZ(' + (that.startRotate + angle) + 'deg)');
        }

        //初始化圆心点
        if (opts.centerX == 0 && opts.centerY == 0) {
            opts.centerX = that.$elem.offset().left + that.$elem.outerWidth() / 2;
            opts.centerY = that.$elem.offset().top + that.$elem.outerHeight() / 2
        }

        if (!opts.handle) {
            that.$handle = $('<div class="ui-rotate-handle"></div>');
            that.$elem.append(that.$handle);
            //that.$handle = that.$elem.find('.resizable-handle');
        } else {
            that.$handle = $(opts.handle);
        }


        that.$handle.on('mousedown.ui.rotateable', function (e) {
            that.down = true;
            e.stopPropagation();

            that.startDeg = angle(opts.centerX, opts.centerY, event.clientX, event.clientY);
            that.startRotate = Rotateable.getDeg(that.$elem);

            $(document).on('mousemove.ui.rotateable', movehandle);
        });

        $(document).on('mouseup', function (e) {
            that.down = false;
            $(document).off('mousemove.ui.rotateable');

            if (that.rotating) {
                that.rotating = false;
                that.opts.end(e, that.elem);
            }
        });
    };

    fn.enable = function () {

    };

    fn.disable = function () {

    };

    fn.destroy = function () {
        var that = this;
        that.$handle.off('.ui.rotateable');
        if (!that.opts.handle) {
            that.$elem.find('.ui-rotate-handle').remove();
        }
        that.$elem.removeData('ui.rotateable');
    };

    UI.Rotateable = Rotateable;

    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.rotateable');
            if (!data) {
                data = new Rotateable(this, option);
                $this.data('ui.rotateable', data);
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });
    }

    $.fn.rotateable = Plugin;
})(jQuery);
