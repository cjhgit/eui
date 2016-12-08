/**
 * EUI: tab.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    // TAB 类定义
    var Tab = function (element) {
        this.element = $(element);
    };

    Tab.VERSION = '1.3.0';

    Tab.TRANSITION_DURATION = 150;

    var fn = Tab.prototype;

    // 用于切换触发区与相关事件,并在里面调用切换面板的activate
    fn.show = function () {
        var $this = this.element;
        var $ul = $this.closest('ul:not(.dropdown-menu)'); // 找到触发区的容器
        var selector = $this.data('target'); // 取得对应的面板的CSS表达式

        if (!selector) {
            selector = $this.attr('href'); // 没有则从href得到
        }

        if ($this.parent('.nav-item').hasClass('active')) {
            return;
        }

        var $previous = $ul.find('.active:last .link-item'); // 获得被激活的链接之前的链接
        var hideEvent = $.Event('hide.ui.tab', {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event('show.ui.tab', {
            relatedTarget: $previous[0]
        });

        $previous.trigger(hideEvent);
        $this.trigger(showEvent);

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
            return;
        }

        var $target = $(selector);

        this._activate($this.closest('.nav-item'), $ul);
        this._activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.ui.tab',
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: 'shown.ui.tab',
                relatedTarget: $previous[0]
            });
        })
    };

    fn._activate = function (element, container, callback) {
        var $active = container.find('> .active');
        var transition = callback
            && $.support.transition
            && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

        function next() {
            // 让之前的处于激活状态取消激活状态
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
                .one('uiTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next();

        // 开始触发CSS3 transition回调
        $active.removeClass('in');
    };


    // TAB 插件定义

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.tab');

            if (!data) {
                $this.data('ui.tab', (data = new Tab(this)));
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
        .on('click.ui.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.ui.tab.data-api', '[data-toggle="pill"]', clickHandler);

})(jQuery);
