/**
 * 轮播插件
 * v1.0.0
 *
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

+function ($) {
    'use strict';

    var SELETOR_INDICATORS = '.eui-slider-indicators';
    var SELECTOR_ITEM = '.item';
    var CLASS_SLIDER = 'eui-slider';
    var EVENT_SLID = 'slid.eui.slider';
    var EVENT_SLIDER = 'slide.eui.slider';

    // 轮播图类
    var Slider = function (element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find(SELETOR_INDICATORS);
        this.options = options;
        this.paused = null; // 是否已经停止滑动
        this.sliding = null; // 是否正在滑动
        this.interval = null;
        this.$active = null;
        this.$items = null;

        this.options.keyboard && this.$element.on('keydown.eui.slider', $.proxy(this.keydown, this));

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.eui.slider', $.proxy(this.pause, this))
            .on('mouseleave.eui.slider', $.proxy(this.cycle, this))
    };

    Slider.VERSION = '3.3.6';

    Slider.TRANSITION_DURATION = 600;

    Slider.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    };

    Slider.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) {
            return;
        }
        switch (e.which) {
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default:
                return;
        }

        e.preventDefault()
    };

    Slider.prototype.cycle = function (e) {
        e || (this.paused = false);

        this.interval && clearInterval(this.interval);

        this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

        return this;
    };

    Slider.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children(SELECTOR_ITEM);
        return this.$items.index(item || this.$active);
    };

    Slider.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (this.$items.length - 1));
        if (willWrap && !this.options.wrap) {
            return active;
        }
        var delta = direction == 'prev' ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex)
    };

    // 滑动到某个轮播项
    Slider.prototype.to = function (pos) {
        var that = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find(SELECTOR_ITEM + '.active'));

        if (pos > (this.$items.length - 1) || pos < 0) {
            return;
        }

        if (this.sliding) {
            return this.$element.one(EVENT_SLID, function () {
                that.to(pos)
            });
        }// yes, "slid"

        if (activeIndex == pos) {
            return this.pause().cycle();
        }

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
    };

    Slider.prototype.pause = function (e) {
        e || (this.paused = true);

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }

        this.interval = clearInterval(this.interval);

        return this;
    };

    Slider.prototype.next = function () {
        if (this.sliding) {
            return;
        }
        return this.slide('next');
    };

    Slider.prototype.prev = function () {
        if (this.sliding) {
            return;
        }
        return this.slide('prev');
    };

    /**
     * 切换
     * @param type
     * @param next
     * @returns {*}
     */
    Slider.prototype.slide = function (type, next) {
        var $active = this.$element.find(SELECTOR_ITEM + '.active');
        var $next = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == 'next' ? 'left' : 'right';
        var that = this;

        if ($next.hasClass('active')) {
            return (this.sliding = false);
        }

        var relatedTarget = $next[0];
        var slideEvent = $.Event(EVENT_SLIDER, {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) {
            return;
        }

        this.sliding = true;

        isCycling && this.pause();

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event(EVENT_SLID, {relatedTarget: relatedTarget, direction: direction}); // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type);
            $next[0].offsetWidth;// force reflow
            $active.addClass(direction);
            $next.addClass(direction);
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active');
                    $active.removeClass(['active', direction].join(' '));
                    that.sliding = false;
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0);
                })
                .emulateTransitionEnd(Slider.TRANSITION_DURATION);
        } else {
            $active.removeClass('active');
            $next.addClass('active');
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }

        isCycling && this.cycle();

        return this;
    };

    // 轮播插件定义
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('eui.slider');
            var options = $.extend({}, Slider.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action = typeof option == 'string' ? option : options.slide;

            if (!data) {
                data = new Slider(this, options);
                $this.data('eui.slider', data);
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
            $target.data('eui.slider').to(slideIndex);
        }

        e.preventDefault();
    };

    $(document)
        .on('click.eui.slider.data-api', '[data-slide]', clickHandler)
        .on('click.eui.slider.data-api', '[data-slide-to]', clickHandler);

    $(window).on('load', function () {
        $('[data-ride="slider"]').each(function () {
            var $slider = $(this);
            Plugin.call($slider, $slider.data());
        });
    });
}(jQuery);
