/**
 * EUI: base.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    var UI = {
        version: '1.3.0'
    };

    var bodyIsOverflowing;
    var scrollbarWidth;
    var originalBodyPad;

    var $body = $(document.body);

    // 检查是否有滚动条,并计算滚动条宽度
    UI._checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        scrollbarWidth = UI._measureScrollbar();
    };

    // 计算滚动条宽度的一种方法
    UI._measureScrollbar = function () { // thx walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        $body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        $body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };

    // 设置又内边距(估计和滚动条有关)
    UI.setScrollbar = function () {
        var bodyPad = parseInt(($body.css('padding-right') || 0), 10);
        originalBodyPad = document.body.style.paddingRight || '';
        if (bodyIsOverflowing) {
            $body.css({'padding-right': bodyPad + scrollbarWidth, 'overflow': 'hidden'});
        }
    };

    // 禁用窗口滚动条
    UI.disableScrollbar = function () {
        UI._checkScrollbar();
        UI.setScrollbar();
    };

    // 使用窗口滚动条
    UI.enableScrollbar = function () {
        $body.css({'padding-right': originalBodyPad});
        if ($body[0].style.removeProperty) {
            $body[0].style.removeProperty('overflow');
        } else {
            $body[0].style.removeAttribute('overflow');
        }

    };

    // 背景遮罩层
    UI.overlay = function (option) {
        if (option === 'hide') {
            var $overlay = $('#ui-overlay');
            $overlay.hide();
        } else {
            var opts = $.extend({}, UI.overlay.DEFAULT, option);
            var $overlay = $('#ui-overlay');
            if ($overlay.length) {
                $overlay.show();
            } else {
                $overlay = $('<div id="ui-overlay" class="ui-overlay"></div>');
                $overlay.css({
                    backgroundColor: opts.bgColor,
                    opacity: opts.opacity
                });
                $overlay.on('click', function () {

                });
                $(document.body).append($overlay);
            }
        }
    };

    UI.overlay.DEFAULT = {
        bgColor: '#000',
        opacity: 0.3,
        zIndex: 10000,
        onClick: function () {},
        clickHide: false
    };

    $.fn.fullscreen = function (option) {
        return $(this).each(function () {
            if (option === 'cancel') {
                $(this).removeClass('ui-fullscreen');
            } else if (option === 'toggle') {
                $(this).toggleClass('ui-fullscreen');
            } else {
                $(this).addClass('ui-fullscreen');
            }
        });
    };

    window.UI = window.ui = UI;

})(jQuery);
