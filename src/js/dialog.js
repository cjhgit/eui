/**
 * EUI dialog.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    "use strict";

    var UI = window.UI;
    var $win = $(window);
    var $html = $('html');
    var $body = $(document.body);

    // 对话框类
    var Dialog = function (option) {
        this.index = ++Dialog.index;
        this.opts = $.extend({}, Dialog.DEFAULTS, option);
        this.init();
    };

    Dialog.VERSION = '1.3.0';

    Dialog.TYPE_ALERT = 0;
    Dialog.TYPE_DIALOG = 1;
    Dialog.TYPE_FRAME = 2;
    Dialog.TYPE_LOADING = 3;
    Dialog.TYPE_TIP = 4;

    // 默认配置
    Dialog.DEFAULTS = {
        btn: false,
        type: 0, // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        shade: 0.3,
        title: '信息', // 标题
        offset: 'auto',
        size: 'auto',
        closeBtn: 'icon icon-close',
        time: 0, // 0表示不自动关闭
        zIndex: 1000000,
        maxWidth: 1000,
        anim: 'anim-dialog', // 动画
        icon: false,
        scrollbar: false, // 是否允许浏览器滚动条
        tips: 2,
        fix: true, // 是否固定位置
        draggable: {
            hander: '.dialog-header',
            containment: document
        },
        position: {
            x: 'center',
            y: 'center'
        }
    };

    // 五种原始层模式
    Dialog._type = ['common', 'page', 'iframe', '', 'tips'];

    Dialog._end = {};

    Dialog.index = 0;

    Dialog._record = function ($dialog) {
        var size = [
            $dialog.outerWidth(),
            $dialog.outerHeight(),
            $dialog.position().top,
            $dialog.position().left + parseFloat($dialog.css('margin-left'))
        ];
        $dialog.find('.dialog-max').addClass('dialog-maxmin');
        $dialog.attr({size: size});
    };

    Dialog._rescollbar = function (index) {
        if ($html.attr('ui-full') == index) {
            UI.enableScrollbar();
            $html.removeAttr('ui-full');
        }
    };

    // 屏蔽Enter触发弹层
    Dialog._enter = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    var fn = Dialog.prototype;

    // 容器
    fn.vessel = function (conType, callback) {
        var that = this,
            times = that.index,
            opts = that.opts;
        var zIndex = opts.zIndex + times;
        var titype = false;
        var ismax = opts.maxmin && (opts.type === 1 || opts.type === 2);
        var titleHTML = '';
        if (opts.title) {
            titleHTML = '<header class="dialog-header"><div class="dialog-title">'
                + opts.title + '</div></header>';
        }

        opts.zIndex = zIndex;

        // 遮罩
        var shadeHtml = opts.shade ? ('<div class="dialog-shade" id="dialog-shade' + times + '" times="' + times
        + '" style="' + ('z-index:' + (zIndex - 1)
        + '; background-color:' + (opts.shade[1] || '#000')
        + '; opacity:' + (opts.shade[0] || opts.shade) + ';')
        + '"></div>') : '';

        // 主体
        var dialogHtml =

            '<section class="dialog ' + opts.anim + (' dialog-' + Dialog._type[opts.type])
            + (((opts.type == 0 || opts.type == 2) && !opts.shade) ? ' dialog-border' : '')
            + ' ' + (opts.skin || '') + '" id="dialog' + times + '" type="' + Dialog._type[opts.type] + '" times="' + times + '" conType="' + (conType ? 'object' : 'string')
            + '" style="z-index: ' + zIndex + '; width:' + opts.size[0] + ';height:' + opts.size[1] + (opts.fix ? '' : ';position:absolute;') + '">'
            + (conType && opts.type != 2 ? '' : titleHTML)
            // body
            + '<div id="' + (opts.id || '') + '" class="dialog-body'
            + ((opts.type == 0 && opts.icon) ? ' dialog-padding' : '')
            + (opts.type == 3 ? ' dialog-loading' + opts.icon : '') + '">'

            + (opts.type == 0 && opts.icon ? '<i class="dialog-icon ' + opts.icon + '"></i>' : '')
            + (conType ? '' : (opts.content || ''))
            + '</div>'
            // setwin
            + '<span class="dialog-setwin">'
            + function () {
                var closebtn = ismax ? '<a class="dialog-min" href="#"><i class="icon icon-minus"></i></a><a class="dialog-ico dialog-max" href="#"><i class="icon icon-max"></i> </a>' : '';
                opts.closeBtn && (closebtn += '<a class="dialog-close ' + (opts.title ? opts.closeBtn : (opts.type == 4 ? 'icon icon-close' : 'dialog-ico dialog-close2')) + '" href="javascript:;"></a>');
                return closebtn;
            }()
            + '</span>'
            // footer
            + (function () {
                if (!opts.btn) {
                    return '';
                }

                var button = '';
                typeof opts.btn === 'string' && (opts.btn = [opts.btn]);
                for (var i = 0, len = opts.btn.length; i < len; i++) {
                    button += '<a class="btn dialog-btn' + i + '">' + opts.btn[i] + '</a>'
                }
                return '<footer class="dialog-footer">' + button + '</footer>'
            })()
            + '</section>';

        callback(shadeHtml, dialogHtml, titleHTML);
        return that;
    };

    // 初始化
    fn.init = function () {
        var that = this,
            opts = that.opts,
            times = that.index,
            nodeIndex;
        var content = opts.content,
            conType = typeof content === 'object';

        if ($('#' + opts.id)[0]) {
            return;
        }

        if (typeof opts.size === 'string') {
            opts.size = opts.size === 'auto' ? ['', ''] : [opts.size, ''];
        }

        switch (opts.type) {
            case 0:
                opts.btn = ('btn' in opts) ? opts.btn : '确定';
                UI.closeAll('dialog');
                break;
            case 2:
                var content = opts.content = conType ? opts.content : [opts.content || 'https://www.baidu.com/', 'auto'];
                opts.content = '<iframe scrolling="' + (opts.content[1] || 'auto') + '" allowtransparency="true" id="dialog-iframe' + times + '" name="dialog-iframe' + times + '" onload="this.className=\'\';" class="dialog-load" frameborder="0" src="' + opts.content[0] + '"></iframe>';
                break;
            case 3:
                opts.title = false;
                opts.closeBtn = false;
                UI.closeAll('loading');
                break;
            case 4:
                conType || (opts.content = [opts.content, 'body']);
                opts.follow = opts.content[1];
                opts.content = opts.content[0] + '<i class="dialog-TipsG"></i>';
                opts.title = false;
                opts.fix = false;
                opts.tips = typeof opts.tips === 'object' ? opts.tips : [opts.tips, true];
                opts.tipsMore || UI.closeAll('tips');
                break;
        }


        // 建立容器
        that.vessel(conType, function (shadeHtml, dialogHtml, titleHTML) {
            $body.append(shadeHtml);
            conType ? function () {
                (opts.type == 2 || opts.type == 4) ? function () {
                    $body.append(dialogHtml);
                }() : function () {
                    if (!content.parents('.dialog')[0]) {
                        content.show().addClass('dialog-wrap');
                        if (typeof content.wrap == 'function') { // TODO 加个判断，解决一个特殊的bug
                            content.wrap(dialogHtml);
                        } else {
                            content.loop(dialogHtml);
                        }

                        $('#dialog' + times).find('.dialog-body').before(titleHTML);
                    }
                }();
            }() : $body.append(dialogHtml);
            that.$dialog = $('#dialog' + times);

            $html.attr('ui-full', times);
            opts.scrollbar || UI.disableScrollbar();
        })._auto(times);

        $(document).off('keydown', Dialog._enter).on('keydown', Dialog._enter);
        that.$dialog.on('keydown', function (e) {
            $(document).off('keydown', Dialog._enter);
        });

        // 坐标自适应浏览器窗口尺寸
        opts.type == 4 ? that.tips() : that.offset();
        if (opts.fix) {
            $win.on('resize', function () {
                that.offset();
                (/^\d+%$/.test(opts.size[0]) || /^\d+%$/.test(opts.size[1])) && that._auto(times);
                opts.type == 4 && that.tips();
            });
        }

        opts.time && setTimeout(function () {
            UI.close(that.index)
        }, opts.time);
        opts.draggable && that.draggable();
        that.callback();
    };

    // 自适应
    fn._auto = function (index) {
        var opts = this.opts;
        var $dialog = $('#dialog' + index);
        if (opts.size[0] === '' && opts.maxWidth > 0) {
            $dialog.outerWidth() > opts.maxWidth && $dialog.width(opts.maxWidth);
        }
        var size = [$dialog.innerWidth(), $dialog.innerHeight()];
        var titHeight = $dialog.find('.dialog-header').outerHeight() || 0;
        var btnHeight = $dialog.find('.dialog-footer').outerHeight() || 0;

        function setHeight(elem) {
            elem = $dialog.find(elem);
            elem.height(size[1] - titHeight - btnHeight - 2 * (parseFloat(elem.css('padding')) | 0));
        }

        switch (opts.type) {
            case 2:
                setHeight('iframe');
                break;
            default:
                if (opts.size[1] === '') {
                    if (opts.fix && size[1] >= $win.height()) {
                        size[1] = $win.height();
                        setHeight('.dialog-body');
                    }
                } else {
                    setHeight('.dialog-body');
                }
                break;
        }
        return this;
    };

    // 计算坐标
    fn.offset = function () {
        var that = this;
        if (that.opts.position) {
            that.$dialog.pot(that.opts.position);
        }
    };

    // Tips
    fn.tips = function () {
        var that = this,
            opts = that.opts,
            $dialog = that.$dialog;
        var size = [$dialog.outerWidth(), $dialog.outerHeight()], follow = $(opts.follow);
        if (!follow[0]) follow = $body;
        var goal = {
            width: follow.outerWidth(),
            height: follow.outerHeight(),
            top: follow.offset().top,
            left: follow.offset().left
        }, tipsG = $dialog.find('.dialog-TipsG');

        var guide = opts.tips[0];
        opts.tips[1] || tipsG.remove();

        goal.autoLeft = function () {
            if (goal.left + size[0] - $win.width() > 0) {
                goal.tipLeft = goal.left + goal.width - size[0];
                tipsG.css({right: 12, left: 'auto'});
            } else {
                goal.tipLeft = goal.left;
            }
            ;
        };

        //辨别tips的方位
        goal.where = [function () { //上
            goal.autoLeft();
            goal.tipTop = goal.top - size[1] - 10;
            tipsG.removeClass('dialog-TipsB').addClass('dialog-TipsT').css('border-right-color', opts.tips[1]);
        }, function () { //右
            goal.tipLeft = goal.left + goal.width + 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('dialog-TipsL').addClass('dialog-TipsR').css('border-bottom-color', opts.tips[1]);
        }, function () { //下
            goal.autoLeft();
            goal.tipTop = goal.top + goal.height + 10;
            tipsG.removeClass('dialog-TipsT').addClass('dialog-TipsB').css('border-right-color', opts.tips[1]);
        }, function () { //左
            goal.tipLeft = goal.left - size[0] - 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('dialog-TipsR').addClass('dialog-TipsL').css('border-bottom-color', opts.tips[1]);
        }];
        goal.where[guide - 1]();

        /* 8*2为小三角形占据的空间 */
        if (guide === 1) {
            goal.top - ($win.scrollTop() + size[1] + 8 * 2) < 0 && goal.where[2]();
        } else if (guide === 2) {
            $win.width() - (goal.left + goal.width + size[0] + 8 * 2) > 0 || goal.where[3]()
        } else if (guide === 3) {
            (goal.top - $win.scrollTop() + goal.height + size[1] + 8 * 2) - $win.height() > 0 && goal.where[0]();
        } else if (guide === 4) {
            size[0] + 8 * 2 - goal.left > 0 && goal.where[1]()
        }

        $dialog.find('.dialog-body').css({
            'background-color': opts.tips[1],
            'padding-right': (opts.closeBtn ? '30px' : '')
        });
        $dialog.css({left: goal.tipLeft, top: goal.tipTop});
    }

    // 拖拽层
    fn.draggable = function () {
        var that = this;
        that.$dialog.draggable({
            hander: '.dialog-header',
            containment: document
        });
        return that;
    };

    fn.callback = function () {
        var that = this,
            $dialog = that.$dialog,
            opts = that.opts;
        that.openLayer();
        if (opts.success) {
            if (opts.type == 2) {
                $dialog.find('iframe').on('load', function () {
                    opts.success($dialog, that.index);
                });
            } else {
                opts.success($dialog, that.index);
            }
        }

        //按钮
        $dialog.find('.dialog-footer').children('a').on('click', function () {
            var index = $(this).index();
            if (index === 0) {
                if (opts.yes) {
                    opts.yes(that.index, $dialog)
                } else if (opts['btn1']) {
                    opts['btn1'](that.index, $dialog)
                } else {
                    UI.close(that.index);
                }
            } else {
                var close = opts['btn' + (index + 1)] && opts['btn' + (index + 1)](that.index, $dialog);
                close === false || UI.close(that.index);
            }
        });

        // 取消
        function cancel() {
            var close = opts.cancel && opts.cancel(that.index, $dialog);
            close === false || UI.close(that.index);
        }

        // 右上角关闭回调
        $dialog.find('.dialog-close').on('click', cancel);

        // 点遮罩关闭
        if (opts.shadeClose) {
            $('#dialog-shade' + that.index).on('click', function () {
                UI.close(that.index);
            });
        }

        // 最小化
        $dialog.find('.dialog-min').on('click', function (e) {
            e.preventDefault();

            UI.min(that.index, opts);
            opts.min && opts.min($dialog);
        });

        // 全屏/还原
        $dialog.find('.dialog-max').on('click', function (e) {
            e.preventDefault();

            if ($(this).hasClass('dialog-maxmin')) {
                UI.restore(that.index);
                opts.restore && opts.restore($dialog);
            } else {
                UI.full(that.index, opts);
                opts.full && opts.full($dialog);
            }
        });

        opts.end && (Dialog._end[that.index] = opts.end);
    };

    // 需依赖原型的对外方法
    fn.openLayer = function () {
        var that = this;

        //置顶当前窗口
        UI.zIndex = that.opts.zIndex;
        UI.setTop = function ($dialog) {
            var setZindex = function () {
                UI.zIndex++;
                $dialog.css('z-index', UI.zIndex + 1);
            };
            UI.zIndex = parseInt($dialog[0].style.zIndex);
            $dialog.on('mousedown', setZindex);
            return UI.zIndex;
        };
    };

    // 对话框
    UI.dialog = function (options) {
        var dialog = new Dialog(options);
        return dialog.index;
    };

    // 获取子iframe的DOM
    UI.getChildFrame = function (selector, index) {
        index = index || $('.dialog-iframe').attr('times');
        return $('#dialog' + index).find('iframe').contents().find(selector);
    };

    // 得到当前iframe层的索引，子iframe时使用
    UI.getFrameIndex = function (name) {
        return $('#' + name).parents('.dialog-iframe').attr('times');
    };

    // iframe层自适应宽高
    UI.iframeAuto = function (index) {
        if (!index) {
            return;
        }
        var heg = UI.getChildFrame('html', index).outerHeight();
        var $dialog = $('#dialog' + index);
        var titHeight = $dialog.find('.dialog-header').outerHeight() || 0;
        var btnHeight = $dialog.find('.dialog-footer').outerHeight() || 0;
        $dialog.css({height: heg + titHeight + btnHeight});
        $dialog.find('iframe').css({height: heg});
    };

    // 重置iframe url
    UI.iframeSrc = function (index, url) {
        $('#dialog' + index).find('iframe').attr('src', url);
    };

    // 设定层的样式
    UI.style = function (index, options) {
        var $dialog = $('#dialog' + index),
            type = $dialog.attr('type');
        var titHeight = $dialog.find('.dialog-header').outerHeight() || 0;
        var btnHeight = $dialog.find('.dialog-footer').outerHeight() || 0;
        if (type === Dialog._type[1] || type === Dialog._type[2]) {
            $dialog.css(options);
            if (type === Dialog._type[2]) {
                $dialog.find('iframe').css({
                    height: parseFloat(options.height) - titHeight - btnHeight
                });
            }
        }
    };

    // 最小化
    UI.min = function (index, options) {
        var $dialog = $('#dialog' + index);
        var titHeight = $dialog.find('.dialog-header').outerHeight() || 0;
        Dialog._record($dialog);
        UI.style(index, {width: 180, height: titHeight, overflow: 'hidden'});
        $dialog.find('.dialog-min').hide();
        $dialog.attr('type') === 'page' && $dialog.find('dialog-iframe').hide();
        Dialog._rescollbar(index);
    };

    // 还原
    UI.restore = function (index) {
        var $dialog = $('#dialog' + index);
        var size = $dialog.attr('size').split(',');
        var type = $dialog.attr('type');
        UI.style(index, {
            width: parseFloat(size[0]),
            height: parseFloat(size[1]),
            top: parseFloat(size[2]),
            left: parseFloat(size[3]),
            overflow: 'visible'
        });
        $dialog.find('.dialog-max').removeClass('dialog-maxmin');
        $dialog.find('.dialog-min').show();
        $dialog.attr('type') === 'page' && $dialog.find('dialog-iframe').show();
        Dialog._rescollbar(index);
    };

    // 全屏
    UI.full = function (index) {
        var $dialog = $('#dialog' + index),
            timer;
        Dialog._record($dialog);
        if (!$html.attr('ui-full')) {
            $html.css('overflow', 'hidden').attr('ui-full', index);
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            var isfix = $dialog.css('position') === 'fixed';
            UI.style(index, {
                top: isfix ? 0 : $win.scrollTop(),
                left: isfix ? 0 : $win.scrollLeft(),
                width: $win.width(),
                height: $win.height()
            });
            $dialog.find('.dialog-min').hide();
        }, 100);
    };

    // 修改标题
    UI.title = function (name, index) {
        var $header = $('#dialog' + (index || Dialog.index)).find('.dialog-header');
        $header.html(name);
    };

    // 关闭对话框
    UI.close = function (index) {
        var $dialog = $('#dialog' + index);
        var type = $dialog.attr('type');
        if (!$dialog[0]) {
            return;
        }

        if ((type === Dialog._type[0] || type === Dialog._type[1]) && $dialog.attr('conType') === 'object') {
            $dialog.children(':not(.dialog-body)').remove();
            for (var i = 0; i < 2; i++) {
                $dialog.find('.dialog-wrap').unwrap().hide();
            }
        } else {
            $dialog[0].innerHTML = '';
            $dialog.remove();
        }
        $('#dialog-moves, #dialog-shade' + index).remove();
        Dialog._rescollbar(index);
        $(document).off('keydown', Dialog._enter);
        typeof Dialog._end[index] === 'function' && Dialog._end[index]();
    };

    // 关闭所有层
    UI.closeAll = function (type) {
        $.each($('.dialog'), function () {
            var $this = $(this);
            var is = type ? ($this.attr('type') === type) : 1;
            is && UI.close($this.attr('times'));
            is = null;
        });
    };



    UI.Dialog = Dialog;

    function Plugin(options) {
        return $(this).each(function () {

            var $this = $(this);

            var data = $this.data('ui.dialog');

            if (options === 'hide') {
                var index = $this.data('dialog-index');
                //data['hide'];
                UI.close(index);
            } else {
                var type = 0;
                if (options && options.type) {
                    type = options.type;
                }
                var opt = $.extend({}, options, {
                    type: type,
                    content: $(this),
                })
                var index = UI.dialog(opt);
                $this.data('dialog-index', index);
            }
        });
    }

    // 支持jQuery
    $.fn.dialog = Plugin;

    // RequireJS
    if (typeof define === 'function') {
        define(function () { return UI; });
    }

})(jQuery);

// overlay
;(function ($) {

    $.fn.overlay = function (options) {
        return $(this).each(function () {

            var $this = $(this);

            var data = $this.data('ui.dialog');

            if (options === 'hide') {
                var index = $this.data('dialog-index');
                UI.close(index);
            } else {
                var opt = $.extend({}, options, {
                    type: 1,
                    content: $(this),
                })
                var index = UI.dialog(opt);
                $this.data('dialog-index', index);
            }
        });
    }
})(jQuery);

// confirm
;(function ($) {

    /* 确认框 */
    UI.confirm = function (content, options, yes, cancel) {
        if (typeof options === 'function') {
            cancel = yes;
            yes = options;
            options = {};
        }

        return UI.dialog($.extend({
            type: 0,
            closeBtn: 'icon icon-close',
            title: '信息',
            content: content,
            btn: ['确定', '取消'],
            yes: yes,
            btn2: cancel
        }, options));
    };

    UI.loading = function (icon, options) {
        return UI.dialog($.extend({
            type: 3,
            skin: 'dialog-loading',
            icon: icon || 0,
            shade: 0.01
        }, options));
    };

    UI.tips = function (content, follow, options) {
        return UI.dialog($.extend({
            type: 4,
            content: [content, follow],
            closeBtn: false,
            time: 3000,
            shade: false,
            maxWidth: 210
        }, options));
    };

    // frame
    UI.frame = function (content, options) {
        return UI.dialog($.extend({
            type: 2,
            content: content,
            closeBtn: 'icon icon-close',
            title: '信息',
            btn: ['确定'],
        }, options));
    };


})(jQuery);

// alert
;(function ($) {
    function Alert() {

    }

    Alert.DEFAULTS = {
        type: 0,
        skin: 'dialog-alert',
        title: '信息',
        closeBtn: 'icon icon-close',
        btn: ['确定'],
    };

    UI.Alert = Alert;

    // 警告框
    UI.alert = function (content, options, yes) {
        if (typeof options === 'function') {
            yes = options;
            options = {};
        }
        if (options && options.content) {
            content = $(options.content);
        }
        return UI.dialog($.extend({}, Alert.DEFAULTS, {
            content: content,
            yes: yes,
        }, options));
    };
})(jQuery);

// prompt
;(function ($) {
    function Prompt() {

    }

    Prompt.DEFAULTS = {
        type: 0,
        skin: 'dialog-prompt',
        title: '信息',
        btn: ['确定', '取消'],
        closeBtn: 'icon icon-close',
    };

    UI.Prompt = Prompt;

    UI.prompt = function (options, yes) {
        options = options || {};
        if (typeof options === 'function') {
            yes = options;
        }
        var prompt, content = options.formType == 2 ? '<textarea class="form-control dialog-input">' + (options.value || '') + '</textarea>' : function () {
            return '<input type="' + (options.formType == 1 ? 'password' : 'text') + '" class="form-control dialog-input" value="' + (options.value || '') + '">';
        }();
        return UI.dialog($.extend({}, Prompt.DEFAULTS, {
            content: content,
            success: function ($dialog) {
                prompt = $dialog.find('.dialog-input');
                prompt.focus();
            },
            yes: function (index) {
                var value = prompt.val();
                if (value === '') {
                    prompt.focus();
                } else if (value.length > (options.maxlength || 500)) {
                    UI.tips('最多输入' + (options.maxlength || 500) + '个字数', prompt, {tips: 1});
                } else {
                    yes && yes(value, index, prompt);
                }
            }
        }, options));
    };
})(jQuery);

// msg
;(function ($) {
    /* 消息提示 */
    function Message() {

    }

    Message.DEFAULTS = {

    };

    UI.msg = function (content, options, end) {
        if (typeof options === 'function') {
            end = options;
            options = {};
        }

        return UI.dialog($.extend({
            type: 0,
            content: content,
            time: 3000,
            shade: false,
            skin: 'dialog-msg',
            title: false,
            closeBtn: false,
            btn: false,
            end: end,
            scrollbar: true,
        }, options));
    };
})(jQuery);
