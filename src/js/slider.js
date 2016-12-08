/**
 * EUI: slider.js 1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    var SELETOR_INDICATORS = '.slider-indicators';
    var SELECTOR_ITEM = '.item';
    var CLASS_SLIDER = 'slider';
    var EVENT_SLID = 'slid.ui.slider';
    var EVENT_SLIDER = 'slide.ui.slider';

    // 轮播图类
    var Slider = function (element, options) {
        var that = this;

        that.$element = $(element);
        that.$indicators = that.$element.find(SELETOR_INDICATORS);
        that.opts = options;
        that.paused = null; // 是否已经停止滑动
        that.sliding = null; // 是否正在滑动
        that.interval = null;
        that.$active = null;
        that.$items = null;

        that.curIndex = 0;
        that.$list = that.$element.find('.slider-inner');
        that.$items = that.$list.children();
        var count = that.$items.length;
        that.count = count;
        // 复制item
        // 复制后面
        that.pad = that.opts.column - 1;
        if (that.pad < 1) {
            that.pad = 1;
        }
        for (var i = 0; i < that.pad; i++) {
            var $copy = that.$items.eq(i).clone(true);
            $copy.addClass('copy');
            $copy.removeClass('active');
            that.$list.append($copy);
        }
        // 复制前面
        for (var i = 0; i < that.pad; i++) {
            var $copy = that.$items.eq(count - (i + 1)).clone(true);
            $copy.addClass('copy');
            $copy.removeClass('active');
            that.$list.prepend($copy);
        }

        function resize() {
            that.itemWidth = that.$element.width() / that.opts.column;
            var width = that.itemWidth * (count + 2 * (that.pad));
            //that.$list.hide();
            that.$list.width(width);
            that.$list.children().width(that.itemWidth);
        };

        resize();



        var offset = that.pad * that.itemWidth * -1; // TODO


        that.disableTransition();
        that.offset(offset, false);

        that.$element.resize(function () {
            resize();
        });

        that.opts.keyboard && that.$element.on('keydown.ui.slider', $.proxy(that.keydown, that));

        that.opts.pause == 'hover' && !('ontouchstart' in document.documentElement) && that.$element
            .on('mouseenter.ui.slider', $.proxy(that.pause, that))
            .on('mouseleave.ui.slider', $.proxy(that.cycle, that));


    };

    Slider.VERSION = '1.3.0';
    Slider.v = 2.00;

    Slider.TRANSITION_DURATION = 600;

    Slider.DEFAULTS = {
        interval: 5000, // 自动循环每个项目之间延迟的时间量。如果为 false，轮播将不会自动循环
        pause: 'hover',
        loop: true, // 轮播是否循环播放
        keyboard: true,
        column: 1,
    };

    var fn = Slider.prototype;

    fn.offset = function (offset, anim) {
        var that = this;

        if (anim) {
            that.$list.animate({
                'margin-left': offset + 'px'
            }, 500)
        } else {
            that.$list.css('margin-left', offset + 'px');
        }

        //that.$list.css('transform', 'translate3d(' + offset + 'px, 0px, 0px)');
    };

    fn.disableTransition = function () {
        var that = this;

        //that.$list.css('transition', 'inherit');
    };

    fn.enableTransition = function () {
        var that = this;

        //that.$list.css('transition', 'transform .6s ease-in-out');
        //that.$list.css('transition', 'all .6s ease-in-out');
    };

    fn.keydown = function (e) {
        var that = this;

        if (/input|textarea/i.test(e.target.tagName)) {
            return;
        }
        switch (e.which) {
            case 37:
                that.prev();
                break;
            case 39:
                that.next();
                break;
            default:
                return;
        }

        e.preventDefault()
    };

    fn.cycle = function (e) {
        var that = this;

        e || (that.paused = false);

        that.interval && clearInterval(that.interval);

        that.opts.interval
        && !that.paused
        && (that.interval = setInterval($.proxy(that.next, that), that.opts.interval));

        return that;
    };

    fn.getIndex = function () {
        var that = this;

        return that.curIndex
    };

    fn.getItemIndex = function (item) {
        var that = this;

        that.$items = item.parent().children(SELECTOR_ITEM);
        return that.$items.index(item || that.$active);
    };

    /**
     * 获取下一个要显示的item
     * @param {string} direction 'prev' or 'next'
     * @param active
     * @returns {*}
     */
    fn.getItemForDirection = function (direction, active) {
        var that = this;

        var activeIndex = that.getItemIndex(active);
        /*var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (that.count - 1));
        if (willWrap && !that.opts.wrap) {
            return active;
        }*/

        var delta = direction == 'prev' ? -1 : 1;
        var itemIndex = (activeIndex + delta);
        if (itemIndex > that.count + that.pad - 1) {
            itemIndex = that.pad;
        }
        if (itemIndex < that.pad -  1) { // TODO
            itemIndex = that.count + that.pad - 1;
        }
        return that.$items.eq(itemIndex)
    };

    // 滑动到某个轮播项
    fn.to = function (pos) {
        var that = this;

        var activeIndex = that.getItemIndex(that.$active = that.$element.find(SELECTOR_ITEM + '.active'));

        if (pos < 0 || pos > that.count - 1) {
            return;
        }

        if (that.sliding) {
            return that.$element.one(EVENT_SLID, function () {
                that.to(pos)
            });
        }// yes, "slid"

        if (that.curIndex == pos) {
            return that.pause().cycle();
        }

        var preIndex = that.curIndex;
        that.curIndex = pos;

        return that.slide(pos > preIndex ? 'next' : 'prev', that.$items.eq(pos));
    };

    fn.pause = function (e) {
        var that = this;

        e || (that.paused = true);

        if (that.$element.find('.next, .prev').length && $.support.transition) {
            that.$element.trigger($.support.transition.end);
            that.cycle(true);
        }

        that.interval = clearInterval(that.interval);

        return that;
    };

    fn.next = function () {
        var that = this;

        if (that.curIndex === (that.count - 1) && !that.opts.loop) {
            return;
        }

        that.curIndex++;
        if (that.curIndex > that.count - 1) {
            that.curIndex = 0;
        }

        if (that.sliding) {
            return;
        }
        that.$active = that.$element.find(SELECTOR_ITEM + '.active')
        var activeIndex = that.$active.index();
        if (activeIndex === that.count + that.pad - 1) {
            var offset = that.itemWidth * (that.pad - 1) * -1;
            that.offset(offset, false);
        }
        return that.slide('next');
    };

    fn.prev = function () {
        var that = this;

        if (that.curIndex === 0 && !that.opts.loop) {
            return;
        }

        that.curIndex--;
        if (that.curIndex < 0) {
            that.curIndex = that.count - 1;
        }

        if (that.sliding) {
            return;
        }
        that.$active = that.$element.find(SELECTOR_ITEM + '.active')
        var activeIndex = that.$active.index();
        if (activeIndex === that.pad - 1) {
            var offset = that.itemWidth * (that.count + that.pad - 1) * -1;
            that.offset(offset, false);
            that.$active.removeClass('active');
            that.$list.find(SELECTOR_ITEM).eq(that.count + that.pad - 1).addClass('active');
        }
        return that.slide('prev');
    };

    /**
     * 切换
     * @param type 'next' or 'prev'
     * @param next 跳转到的item
     * @returns {*}
     */
    fn.slide = function (type, next) {
        var that = this;
        that.enableTransition();

        var $active = that.$element.find(SELECTOR_ITEM + '.active');
        var $next = next || that.getItemForDirection(type, $active);
        var isCycling = that.interval;
        var direction = type == 'next' ? 'left' : 'right';
        var that = that;

        if ($next.hasClass('active')) {
            return (that.sliding = false);
        }

        var relatedTarget = $next[0];
        var slideEvent = $.Event(EVENT_SLIDER, {
            relatedTarget: relatedTarget,
            direction: direction
        });
        that.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) {
            return;
        }

        that.sliding = true;

        isCycling && that.pause();

        if (that.$indicators.length) {
            that.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(that.$indicators.children()[that.getIndex()]);
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event(EVENT_SLID, {relatedTarget: relatedTarget, direction: direction}); // yes, "slid"
        //if (false) {
        if ($.support.transition && that.$element.hasClass('slide')) {

            var offset = $next.index() * -1 * that.itemWidth; // TODO
            that.offset(offset, true);

            $active.removeClass('active');
            $next.addClass('active');
            that.sliding = false;
            that.$element.trigger(slidEvent);

            $active
                .one('uiTransitionEnd', function () {
                    that.disableTransition();
                    //that.$list.css('transform', 'translate3d(' + offset + 'px, 0px, 0px)');
                    //$next.removeClass([type, direction].join(' ')).addClass('active');
                    //$active.removeClass(['active', direction].join(' '));
                    /*that.sliding = false;
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0);*/
                })
                .emulateTransitionEnd(Slider.TRANSITION_DURATION);
        } else {
            var offset = $next.index() * -1 * that.itemWidth; // TODO
            that.offset(offset, true);
            $active.removeClass('active');
            $next.addClass('active');
            that.sliding = false;
            that.$element.trigger(slidEvent);
        }

        isCycling && that.cycle();

        return that;
    };

    fn.slideTo = function (pos) {
        pos = parseInt(pos);

        var that = this;
        if (that.curIndex === pos) {
            return false;
        }

        var isCycling = that.interval;

        var slideEvent = $.Event(EVENT_SLIDER, {
            //relatedTarget: relatedTarget, TODO
            //direction: direction
        });
        that.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) {
            return;
        }

        that.sliding = true;

        isCycling && that.pause();

        if (that.$indicators.length) {
            that.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(that.$indicators.children()[pos]);
            $nextIndicator && $nextIndicator.addClass('active')
        }

        //var slidEvent = $.Event(EVENT_SLID, {relatedTarget: relatedTarget, direction: direction}); // yes, "slid"

        if ($.support.transition && that.$element.hasClass('slide')) {

            var offset = (pos + that.pad) * -1 * that.itemWidth; // TODO
            that.offset(offset, true);

            that.$items.eq(that.curIndex).removeClass('active');
            that.$items.eq(pos).addClass('active');

            that.sliding = false;
            //that.$element.trigger(slidEvent);

        } else {
            var offset = $next.index() * -1 * that.itemWidth; // TODO
            that.offset(offset, true);
            $active.removeClass('active');
            $next.addClass('active');
            that.sliding = false;
            that.$element.trigger(slidEvent);
        }

        isCycling && that.cycle();

        that.curIndex = pos;

        return that;
    };

    // 轮播插件定义
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui-slider');
            var options = $.extend({}, Slider.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action = typeof option == 'string' ? option : options.slide;

            if (!data) {
                data = new Slider(this, options);
                $this.data('ui-slider', data);
            }
            if (typeof option == 'number') {
                data.to(option);
            } else if (action) {
                data[action]();
            } else if (options.interval) {
                data.pause().cycle();
            }
        });
    }

    var old = $.fn.slider;

    $.fn.slider = Plugin;
    $.fn.slider.Constructor = Slider;

    $.fn.slider.noConflict = function () {
        $.fn.slider = old;
        return this;
    };

    var clickHandler = function (e) {
        var href;
        var $this = $(this);
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        if (!$target.hasClass(CLASS_SLIDER)) {
            return;
        }

        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr('data-slide-to');
        if (slideIndex) {
            options.interval = false;
        }

        Plugin.call($target, options);

        if (slideIndex) {
            $target.data('ui-slider').slideTo(slideIndex);
        }

        e.preventDefault();
    };

    $(document)
        .on('click.ui.slider.data-api', '[data-slide]', clickHandler)
        .on('click.ui.slider.data-api', '[data-slide-to]', clickHandler);

    $(window).on('load', function () {
        $('[data-ride="slider"]').each(function () {
            var $slider = $(this);
            Plugin.call($slider, $slider.data());
        });
    });
})(jQuery);
