/**
 * eui-draggable
 */
;
(function ($) {
    'use strict';

    function Draggable(elem, option) {
        var that = this;
        that.init(elem, option);
    }

    Draggable.DEFAULTS = {
        axis: 'both',
        hander: false,
        containment: false,
        //cancel
        //containment可选值：'parent', 'document', 'window', [x1, y1, x2, y2].
        drag: function(event, ui) {},
        start: function(event, ui) {},
        stop: function(event, ui) {},
    };

    Draggable.fn = Draggable.prototype;

    Draggable.fn.init = function (elem, option) {
        var that = this;

        that.disabled = false;
        that.dragging = false;
        var $emem = $(elem);
        that.elem = $emem[0];

        var xPage;
        var yPage;
        var X;//
        var Y;//
        var xRand = 0;//
        var yRand = 0;//
        var father = $emem.parent();

        var opts = $.extend({}, Draggable.DEFAULTS, option);
        that.opts = opts;
        var movePosition = opts.axis;

        var hander = opts.hander ? $emem.find(opts.hander) : $emem;
        that.hander = hander;

        //---初始化
        father.css({'position': 'relative', 'overflow': 'hidden'}); // TODO 不能随便添加relative
        $emem.css({'position': 'absolute'});

        hander.data('pre-cursor', hander.css('cursor'));
        hander.css({'cursor': 'move'});

        var faWidth = father.width();
        var faHeight = father.height();
        var thisWidth = $emem.width() + parseInt($emem.css('padding-left')) + parseInt($emem.css('padding-right'));
        var thisHeight = $emem.height() + parseInt($emem.css('padding-top')) + parseInt($emem.css('padding-bottom'));

        var mDown = false;//
        var positionX;
        var positionY;
        var moveX;
        var moveY;

        var minX = -1;
        var maxX = -1;//faWidth - thisWidth
        var minY = -1;
        var maxY = -1;//faHeight - thisHeight

        if (opts.containment) {
            var $containment = $(opts.containment);
            maxX = $containment.width() - $emem.width();
            maxY = $containment.height() - $emem.height();
            if (opts.containment === window || opts.containment === document) {
                minX = minY = 0;
            } else {
                minX = $containment.offset().left
                minY = $containment.offset().top
            }
        }

        hander.mousedown(function (e) {
            father.children().css({'zIndex': '0'});
            $emem.css({'zIndex': '1'});
            mDown = true;
            X = e.pageX;
            Y = e.pageY;
            positionX = $emem.position().left;
            positionY = $emem.position().top;
            return false;
        });

        $(document).mouseup(function (e) {
            mDown = false;

            if (that.dragging) {
                that.dragging = false;
                that.opts.stop(e, that.elem);
            }
        });

        $(document).mousemove(function (e) {
            if (!mDown || that.disabled) {
                return;
            }

            xPage = e.pageX;//--
            moveX = positionX + xPage - X;

            yPage = e.pageY;//--
            moveY = positionY + yPage - Y;



            function thisXMove() { //x轴移动
                var ptX = moveX;
                var ptY = moveY;

                $emem.css({'left': ptX});

                if (minX !== -1 && moveX < minX) {
                    ptX = minX;
                }
                if (maxX !== -1 && moveX > maxX) {
                    ptX = maxX;
                }
                $emem.css({'left': ptX});
                return moveX;
            }

            function thisYMove() { //y轴移动
                if (mDown == true) {
                    $emem.css({'top': moveY});
                } else {
                    return;
                }
                if (minY !== -1 && moveY < minY) {
                    $emem.css({'top': minY});
                }
                if (maxY !== -1 && moveY > maxY) {
                    $emem.css({'top': maxY});
                }
                return moveY;
            }

            function thisAllMove() { //全部移动
                if (mDown == true) {
                    $emem.css({'left': moveX, 'top': moveY});
                } else {
                    return;
                }
                if (minX !== -1 && moveX < minX) {
                    $emem.css({'left': minX});
                }
                if (maxX !== -1 && moveX > maxX) {
                    $emem.css({'left': maxX});
                }
                if (minY !== -1 && moveY < minY) {
                    $emem.css({'top': minY});
                }
                if (maxY !== -1 && moveY > maxY) {
                    $emem.css({'top': maxY});
                }
            }

            if (movePosition.toLowerCase() == 'x') {
                thisXMove();
            } else if (movePosition.toLowerCase() == 'y') {
                thisYMove();
            } else if (movePosition.toLowerCase() == 'both') {
                thisAllMove();
            }

            if (!that.dragging) {
                that.dragging = true;
                that.opts.start(e, that.elem);
            } else {
                that.opts.drag(e, that.elem);
            }
        });
    };

    Draggable.fn.enable = function () {
        var that = this;

        that.hander.css({'cursor': 'move'});
        that.disabled = false;
    };

    Draggable.fn.disable = function () {
        var that = this;

        if (!that.disabled) {
            that.hander.css('cursor', that.hander.data('pre-cursor'));
            that.disabled = true;
        }
    };

    $.fn.draggable = function (option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('eui-draggable');
            if (!data) {
                data = new Draggable(this, option);
                $this.data('eui-draggable', data);
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };
})(jQuery);
