/**
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 *
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */


+function ($) {
    'use strict';

    // TAB 类定义

    var Tab = function (element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element);
        // jscs:enable requireDollarBeforejQueryAssignment
    };

    Tab.VERSION = '3.3.6';

    Tab.TRANSITION_DURATION = 150;
    //Tab.SELECTOR_ITEM = '.nav-item';

    // 用于切换触发区与相关事件,并在里面调用切换面板的activate
    Tab.prototype.show = function () {
        var $this = this.element;
        var $ul = $this.closest('ul:not(.dropdown-menu)'); // 找到触发区的容器
        var selector = $this.data('target'); // 取得对应的面板的CSS表达式

        if (!selector) {
            selector = $this.attr('href'); // 没有则从href得到
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        if ($this.parent('.nav-item').hasClass('active')) {
            return;
        }

        var $previous = $ul.find('.active:last .link-item'); // 获得被激活的链接之前的链接
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        });

        $previous.trigger(hideEvent);
        $this.trigger(showEvent);

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
            return;
        }

        var $target = $(selector);

        this.activate($this.closest('.nav-item'), $ul);
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            });
        })
    };

    // 这方法不应该放到原型上，应该做成私有方法
    Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active');
        var transition = callback
            && $.support.transition
            && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

        function next() {
            // 让之前的处于激活状态处于激活状态
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false);
            //让当前面板处于激活状态
            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true);

            if (transition) {
                element[0].offsetWidth; // reflow for transition
                element.addClass('in');
            } else {
                element.removeClass('fade');
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true);
            }

            // 执行回调，目的是触发shown事件
            callback && callback();
        }

        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next();

        // 开始触发CSS3 transition回调
        $active.removeClass('in');
    };


    // TAB 插件定义

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.tab');

            if (!data) {
                $this.data('bs.tab', (data = new Tab(this)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        })
    }

    var old = $.fn.tab;

    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;

    $.fn.tab.noConflict = function () {
        $.fn.tab = old;
        return this
    };

    // TAB DATA-API

    var clickHandler = function (e) {
        e.preventDefault();
        Plugin.call($(this), 'show')
    };

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);

}(jQuery);
