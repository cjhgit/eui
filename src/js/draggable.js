/**
 * EUI draggable.js v17.5.1
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    function Draggable(elem, option) {
        var that = this;
        that.init(elem, option);
    }

    Draggable.DEFAULTS = {
        axis: 'both', // 可选值 'x'、'y'、'both'
        hander: false,
        containment: false, // 可选值 'parent'、document、window、element、'selector'
        drag: function(event, ui) {},
        start: function(event, ui) {},
        end: function(event, ui) {}
    };

    var fn = Draggable.prototype;

    fn.init = function (elem, option) {
        var that = this;

        that.disabled = false;
        that.dragging = false;
        var $emem = $(elem);
        that.$elem = $emem;
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

        that.hander = opts.hander ? $emem.find(opts.hander) : $emem;

        //---初始化
        //father.css({'position': 'relative', 'overflow': 'hidden'}); // TODO 不能随便添加relative
        $emem.css({'position': 'absolute'});

        that.hander.data('pre-cursor', that.hander.css('cursor'));
        that.hander.css({'cursor': 'move'});

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
            var $containment = (opts.containment === 'parent') ? $emem.parent() : $(opts.containment);

            maxX = $containment.width() - $emem.width();
            maxY = $containment.height() - $emem.height();
            if (opts.containment === window || opts.containment === document) {
                minX = minY = 0;
            } else if (opts.containment === 'parent') {
                minX = 0
                minY = 0
            } else {
                minX = $containment.offset().left
                minY = $containment.offset().top
            }
        }

        that.hander.on('mousedown.ui.draggable', function (e) {
            //father.children().css({'zIndex': '0'});
            //$emem.css({'zIndex': '1'});
            mDown = true;
            X = e.pageX;
            Y = e.pageY;
            positionX = $emem.position().left;
            positionY = $emem.position().top;
            return false;
        });

        $(document).on('mouseup.ui.draggable', function (e) {
            mDown = false;

            if (that.dragging) {
                that.dragging = false;
                that.opts.end(e, that.elem);
            }
        });

        $(document).on('mousemove.ui.draggable', function (e) {
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

    fn.enable = function () {
        var that = this;

        that.hander.css({'cursor': 'move'});
        that.disabled = false;
    };

    fn.disable = function () {
        var that = this;

        if (!that.disabled) {
            that.hander.css('cursor', that.hander.data('pre-cursor'));
            that.disabled = true;
        }
    };

    fn.destroy = function () {
        var that = this;

        that.hander.css('cursor', that.hander.data('pre-cursor'));
        that.$elem.removeData('ui.draggable');
        that.hander.off('.ui.draggable');
        $(document).off('.ui.draggable');
    };

    $.fn.draggable = function (option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.draggable');
            if (!data) {
                data = new Draggable(this, option);
                $this.data('ui.draggable', data);
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };
})(jQuery);
