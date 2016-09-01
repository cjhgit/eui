/**
 * 基本框架
 */

;(function ($) {
    var eui = {
        version: '1.0'
    };

    var bodyIsOverflowing;
    var scrollbarWidth;
    var originalBodyPad;

    var $body = $(document.body);

    // 检查是否有滚动条,并计算滚动条宽度
    eui._checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        scrollbarWidth = eui._measureScrollbar();
    };

    // 计算滚动条宽度的一种方法
    eui._measureScrollbar = function () { // thx walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        $body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        $body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };

    // 设置又内边距(估计和滚动条有关)
    eui.setScrollbar = function () {
        var bodyPad = parseInt(($body.css('padding-right') || 0), 10);
        originalBodyPad = document.body.style.paddingRight || '';
        if (bodyIsOverflowing) {
            $body.css({'padding-right': bodyPad + scrollbarWidth, 'overflow': 'hidden'});
        }
    };

    // 禁用窗口滚动条
    eui.disableScrollbar = function () {
        eui._checkScrollbar();
        eui.setScrollbar();
    };

    // 使用窗口滚动条
    eui.enableScrollbar = function () {
        $body.css({'padding-right': originalBodyPad});
        if ($body[0].style.removeProperty) {
            $body[0].style.removeProperty('overflow');
        } else {
            $body[0].style.removeAttribute('overflow');
        }

    };

    // 背景遮罩层
    eui.overlay = function (option) {
        if (option === 'hide') {
            var $overlay = $('#eui-overlay');
            $overlay.hide();
        } else {
            var opts = $.extend({}, eui.overlay.DEFAULT, option);
            var $overlay = $('#eui-overlay');
            if ($overlay.length) {
                $overlay.show();
            } else {
                $overlay = $('<div id="eui-overlay" class="eui-overlay"></div>');
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

    eui.overlay.DEFAULT = {
        bgColor: '#000',
        opacity: 0.3,
        zIndex: 10000,
        onClick: function () {},
        clickHide: false
    };

    window.eui = eui;
})(jQuery);

