/**
 * 对话框插件
 *
 * v1.0.0
 */

;(function ($) {
    "use strict";

    var $win = $(window);
    var $html = $('html');
    var $body = $(document.body);

    var anims = ['eui-anim', 'eui-anim-01', 'eui-anim-02', 'eui-anim-03', 'eui-anim-04', 'eui-anim-05', 'eui-anim-06'];

    // 对话框类
    var Dialog = function (option) {
        this.index = ++Dialog.index;
        this.opts = $.extend({}, Dialog.DEFAULTS, option);
        this.init();
    };

    Dialog.VERSION = '1.0.0';

    // 默认配置
    Dialog.DEFAULTS = {
        type: 0, // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        shade: 0.3,
        fix: true, // 是否固定位置
        move: '.eui-dialog-header',
        title: '信息', // 标题
        offset: 'auto',
        area: 'auto',
        closeBtn: 1,
        time: 0, // 0表示不自动关闭
        zIndex: 1000000,
        maxWidth: 1000,
        shift: 0,
        icon: -1,
        scrollbar: false, // 是否允许浏览器滚动条
        tips: 2,
        anim: 'eui-anim' // 动画
    };

    // 五种原始层模式
    Dialog._type = ['dialog', 'page', 'iframe', 'loading', 'tips'];

    Dialog._end = {};

    Dialog.index = 0;

    Dialog._record = function ($dialog) {
        var area = [
            $dialog.outerWidth(),
            $dialog.outerHeight(),
            $dialog.position().top,
            $dialog.position().left + parseFloat($dialog.css('margin-left'))
        ];
        $dialog.find('.eui-dialog-max').addClass('eui-dialog-maxmin');
        $dialog.attr({area: area});
    };

    Dialog._rescollbar = function (index) {
        if ($html.attr('eui-full') == index) {
            eui.enableScrollbar();
            $html.removeAttr('eui-full');
        }
    };

    // 屏蔽Enter触发弹层
    Dialog._enter = function (e) {
        if (e.keyCode === 13) e.preventDefault();
    };

    Dialog.pt = Dialog.prototype;

    // 容器
    Dialog.pt.vessel = function (conType, callback) {
        var that = this,
            times = that.index,
            opts = that.opts;
        var zIndex = opts.zIndex + times,
            titype = typeof opts.title === 'object';
        var ismax = opts.maxmin && (opts.type === 1 || opts.type === 2);
        var titleHTML = (opts.title ? '<div class="eui-dialog-header" style="' + (titype ? opts.title[1] : '') + '">'
        + (titype ? opts.title[0] : opts.title)
        + '</div>' : '');

        opts.zIndex = zIndex;
        callback([
            // 遮罩
            opts.shade ? ('<div class="eui-dialog-shade" id="eui-dialog-shade' + times + '" times="' + times + '" style="' + ('z-index:' + (zIndex - 1) + '; background-color:' + (opts.shade[1] || '#000') + '; opacity:' + (opts.shade[0] || opts.shade) + ';') + '"></div>') : '',

            // 主体
            '<div class="eui-dialog ' + (anims[opts.shift] || '') + (' eui-dialog-' + Dialog._type[opts.type]) + (((opts.type == 0 || opts.type == 2) && !opts.shade) ? ' eui-dialog-border' : '') + ' ' + (opts.skin || '') + '" id="eui-dialog' + times + '" type="' + Dialog._type[opts.type] + '" times="' + times + '" showtime="' + opts.time + '" conType="' + (conType ? 'object' : 'string') + '" style="z-index: ' + zIndex + '; width:' + opts.area[0] + ';height:' + opts.area[1] + (opts.fix ? '' : ';position:absolute;') + '">'
            + (conType && opts.type != 2 ? '' : titleHTML)
            + '<div id="' + (opts.id || '') + '" class="eui-dialog-body' + ((opts.type == 0 && opts.icon !== -1) ? ' eui-dialog-padding' : '') + (opts.type == 3 ? ' eui-dialog-loading' + opts.icon : '') + '">'
            + (opts.type == 0 && opts.icon !== -1 ? '<i class="eui-dialog-ico eui-dialog-ico' + opts.icon + '"></i>' : '')
            + (opts.type == 1 && conType ? '' : (opts.content || ''))
            + '</div>'
            + '<span class="eui-dialog-setwin">' + function () {
                var closebtn = ismax ? '<a class="eui-dialog-min" href="javascript:;"><cite></cite></a><a class="eui-dialog-ico eui-dialog-max" href="javascript:;"></a>' : '';
                opts.closeBtn && (closebtn += '<a class="eui-dialog-ico eui-dialog-close eui-dialog-close' + (opts.title ? opts.closeBtn : (opts.type == 4 ? '1' : '2')) + '" href="javascript:;"></a>');
                return closebtn;
            }() + '</span>'
            + (opts.btn ? function () {
                var button = '';
                typeof opts.btn === 'string' && (opts.btn = [opts.btn]);
                for (var i = 0, len = opts.btn.length; i < len; i++) {
                    button += '<a class="eui-dialog-footer' + i + '">' + opts.btn[i] + '</a>'
                }
                return '<div class="eui-dialog-footer">' + button + '</div>'
            }() : '')
            + '</div>'
        ], titleHTML);
        return that;
    };

    // 初始化
    Dialog.pt.init = function () {
        var that = this,
            opts = that.opts,
            times = that.index,
            nodeIndex;
        var content = opts.content,
            conType = typeof content === 'object';

        if ($('#' + opts.id)[0]) {
            return;
        }

        if (typeof opts.area === 'string') {
            opts.area = opts.area === 'auto' ? ['', ''] : [opts.area, ''];
        }

        switch (opts.type) {
            case 0:
                opts.btn = ('btn' in opts) ? opts.btn : '确定';
                eui.closeAll('dialog');
                break;
            case 2:
                var content = opts.content = conType ? opts.content : [opts.content || 'https://www.baidu.com/', 'auto'];
                opts.content = '<iframe scrolling="' + (opts.content[1] || 'auto') + '" allowtransparency="true" id="eui-dialog-iframe' + times + '" name="eui-dialog-iframe' + times + '" onload="this.className=\'\';" class="eui-dialog-load" frameborder="0" src="' + opts.content[0] + '"></iframe>';
                break;
            case 3:
                opts.title = false;
                opts.closeBtn = false;
                opts.icon === -1 && (opts.icon === 0);
                eui.closeAll('loading');
                break;
            case 4:
                conType || (opts.content = [opts.content, 'body']);
                opts.follow = opts.content[1];
                opts.content = opts.content[0] + '<i class="eui-dialog-TipsG"></i>';
                opts.title = false;
                opts.fix = false;
                opts.tips = typeof opts.tips === 'object' ? opts.tips : [opts.tips, true];
                opts.tipsMore || eui.closeAll('tips');
                break;
        }


        // 建立容器
        that.vessel(conType, function (html, titleHTML) {
            $body.append(html[0]);
            conType ? function () {
                (opts.type == 2 || opts.type == 4) ? function () {
                    $body.append(html[1]);
                }() : function () {
                    if (!content.parents('.eui-dialog')[0]) {
                        content.show().addClass('eui-dialog-wrap').wrap(html[1]);
                        $('#eui-dialog' + times).find('.eui-dialog-body').before(titleHTML);
                    }
                }();
            }() : $body.append(html[1]);
            that.$dialog = $('#eui-dialog' + times);

            $html.attr('eui-full', times);
            opts.scrollbar || eui.disableScrollbar();
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
                (/^\d+%$/.test(opts.area[0]) || /^\d+%$/.test(opts.area[1])) && that._auto(times);
                opts.type == 4 && that.tips();
            });
        }

        opts.time <= 0 || setTimeout(function () {
            eui.close(that.index)
        }, opts.time);
        that.move().callback();
    };

    // 自适应
    Dialog.pt._auto = function (index) {
        var opts = this.opts;
        var $dialog = $('#eui-dialog' + index);
        if (opts.area[0] === '' && opts.maxWidth > 0) {
            $dialog.outerWidth() > opts.maxWidth && $dialog.width(opts.maxWidth);
        }
        var area = [$dialog.innerWidth(), $dialog.innerHeight()];
        var titHeight = $dialog.find('.eui-dialog-header').outerHeight() || 0;
        var btnHeight = $dialog.find('.eui-dialog-footer').outerHeight() || 0;

        function setHeight(elem) {
            elem = $dialog.find(elem);
            elem.height(area[1] - titHeight - btnHeight - 2 * (parseFloat(elem.css('padding')) | 0));
        }

        switch (opts.type) {
            case 2:
                setHeight('iframe');
                break;
            default:
                if (opts.area[1] === '') {
                    if (opts.fix && area[1] >= $win.height()) {
                        area[1] = $win.height();
                        setHeight('.eui-dialog-body');
                    }
                } else {
                    setHeight('.eui-dialog-body');
                }
                break;
        }
        return this;
    };

    // 计算坐标
    Dialog.pt.offset = function () {
        var that = this,
            opts = that.opts,
            $dialog = that.$dialog;
        var area = [$dialog.outerWidth(), $dialog.outerHeight()];
        var type = typeof opts.offset === 'object';
        that.offsetTop = ($win.height() - area[1]) / 2;
        that.offsetLeft = ($win.width() - area[0]) / 2;
        if (type) {
            that.offsetTop = opts.offset[0];
            that.offsetLeft = opts.offset[1] || that.offsetLeft;
        } else if (opts.offset !== 'auto') {
            that.offsetTop = opts.offset;
            if (opts.offset === 'rb') { //右下角
                that.offsetTop = $win.height() - area[1];
                that.offsetLeft = $win.width() - area[0];
            }
        }
        if (!opts.fix) {
            that.offsetTop = /%$/.test(that.offsetTop) ?
            $win.height() * parseFloat(that.offsetTop) / 100
                : parseFloat(that.offsetTop);
            that.offsetLeft = /%$/.test(that.offsetLeft) ?
            $win.width() * parseFloat(that.offsetLeft) / 100
                : parseFloat(that.offsetLeft);
            that.offsetTop += $win.scrollTop();
            that.offsetLeft += $win.scrollLeft();
        }
        $dialog.css({top: that.offsetTop, left: that.offsetLeft});
    };

    // Tips
    Dialog.pt.tips = function () {
        var that = this,
            opts = that.opts,
            $dialog = that.$dialog;
        var area = [$dialog.outerWidth(), $dialog.outerHeight()], follow = $(opts.follow);
        if (!follow[0]) follow = $body;
        var goal = {
            width: follow.outerWidth(),
            height: follow.outerHeight(),
            top: follow.offset().top,
            left: follow.offset().left
        }, tipsG = $dialog.find('.eui-dialog-TipsG');

        var guide = opts.tips[0];
        opts.tips[1] || tipsG.remove();

        goal.autoLeft = function () {
            if (goal.left + area[0] - $win.width() > 0) {
                goal.tipLeft = goal.left + goal.width - area[0];
                tipsG.css({right: 12, left: 'auto'});
            } else {
                goal.tipLeft = goal.left;
            }
            ;
        };

        //辨别tips的方位
        goal.where = [function () { //上
            goal.autoLeft();
            goal.tipTop = goal.top - area[1] - 10;
            tipsG.removeClass('eui-dialog-TipsB').addClass('eui-dialog-TipsT').css('border-right-color', opts.tips[1]);
        }, function () { //右
            goal.tipLeft = goal.left + goal.width + 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('eui-dialog-TipsL').addClass('eui-dialog-TipsR').css('border-bottom-color', opts.tips[1]);
        }, function () { //下
            goal.autoLeft();
            goal.tipTop = goal.top + goal.height + 10;
            tipsG.removeClass('eui-dialog-TipsT').addClass('eui-dialog-TipsB').css('border-right-color', opts.tips[1]);
        }, function () { //左
            goal.tipLeft = goal.left - area[0] - 10;
            goal.tipTop = goal.top;
            tipsG.removeClass('eui-dialog-TipsR').addClass('eui-dialog-TipsL').css('border-bottom-color', opts.tips[1]);
        }];
        goal.where[guide - 1]();

        /* 8*2为小三角形占据的空间 */
        if (guide === 1) {
            goal.top - ($win.scrollTop() + area[1] + 8 * 2) < 0 && goal.where[2]();
        } else if (guide === 2) {
            $win.width() - (goal.left + goal.width + area[0] + 8 * 2) > 0 || goal.where[3]()
        } else if (guide === 3) {
            (goal.top - $win.scrollTop() + goal.height + area[1] + 8 * 2) - $win.height() > 0 && goal.where[0]();
        } else if (guide === 4) {
            area[0] + 8 * 2 - goal.left > 0 && goal.where[1]()
        }

        $dialog.find('.eui-dialog-body').css({
            'background-color': opts.tips[1],
            'padding-right': (opts.closeBtn ? '30px' : '')
        });
        $dialog.css({left: goal.tipLeft, top: goal.tipTop});
    }

    // 拖拽层
    Dialog.pt.move = function () {
        var that = this,
            opts = that.opts, conf = {
            setY: 0,
            moveLayer: function () {
                var $dialog = conf.$dialog;
                var mgleft = parseInt($dialog.css('margin-left'));
                var lefts = parseInt(conf.move.css('left'));
                mgleft === 0 || (lefts = lefts - mgleft);
                if ($dialog.css('position') !== 'fixed') {
                    lefts = lefts - $dialog.parent().offset().left;
                    conf.setY = 0;
                }
                $dialog.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
            }
        };

        var movedom = that.$dialog.find(opts.move);
        opts.move && movedom.attr('move', 'ok');
        movedom.css({cursor: opts.move ? 'move' : 'auto'});

        $(opts.move).on('mousedown', function (M) {
            M.preventDefault();
            if ($(this).attr('move') === 'ok') {
                conf.ismove = true;
                conf.$dialog = $(this).parents('.eui-dialog');
                var xx = conf.$dialog.offset().left, yy = conf.$dialog.offset().top, ww = conf.$dialog.outerWidth() - 6, hh = conf.$dialog.outerHeight() - 6;
                if (!$('#eui-dialog-moves')[0]) {
                    $body.append('<div id="eui-dialog-moves" class="eui-dialog-moves" style="left:' + xx + 'px; top:' + yy + 'px; width:' + ww + 'px; height:' + hh + 'px; z-index:2147483584"></div>');
                }
                conf.move = $('#eui-dialog-moves');
                opts.moveType && conf.move.css({visibility: 'hidden'});

                conf.moveX = M.pageX - conf.move.position().left;
                conf.moveY = M.pageY - conf.move.position().top;
                conf.$dialog.css('position') !== 'fixed' || (conf.setY = $win.scrollTop());
            }
        });

        $(document).mousemove(function (M) {
            if (conf.ismove) {
                var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
                M.preventDefault();

                //控制元素不被拖出窗口外
                if (!opts.moveOut) {
                    conf.setY = $win.scrollTop();
                    var setRig = $win.width() - conf.move.outerWidth(), setTop = conf.setY;
                    offsetX < 0 && (offsetX = 0);
                    offsetX > setRig && (offsetX = setRig);
                    offsetY < setTop && (offsetY = setTop);
                    offsetY > $win.height() - conf.move.outerHeight() + conf.setY && (offsetY = $win.height() - conf.move.outerHeight() + conf.setY);
                }

                conf.move.css({left: offsetX, top: offsetY});
                opts.moveType && conf.moveLayer();

                offsetX = offsetY = setRig = setTop = null;
            }
        }).mouseup(function () {
            try {
                if (conf.ismove) {
                    conf.moveLayer();
                    conf.move.remove();
                    opts.moveEnd && opts.moveEnd();
                }
                conf.ismove = false;
            } catch (e) {
                conf.ismove = false;
            }
        });
        return that;
    };

    Dialog.pt.callback = function () {
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
        $dialog.find('.eui-dialog-footer').children('a').on('click', function () {
            var index = $(this).index();
            if (index === 0) {
                if (opts.yes) {
                    opts.yes(that.index, $dialog)
                } else if (opts['btn1']) {
                    opts['btn1'](that.index, $dialog)
                } else {
                    eui.close(that.index);
                }
            } else {
                var close = opts['btn' + (index + 1)] && opts['btn' + (index + 1)](that.index, $dialog);
                close === false || eui.close(that.index);
            }
        });

        //取消
        function cancel() {
            var close = opts.cancel && opts.cancel(that.index, $dialog);
            close === false || eui.close(that.index);
        }

        // 右上角关闭回调
        $dialog.find('.eui-dialog-close').on('click', cancel);

        // 点遮罩关闭
        if (opts.shadeClose) {
            $('#eui-dialog-shade' + that.index).on('click', function () {
                eui.close(that.index);
            });
        }

        // 最小化
        $dialog.find('.eui-dialog-min').on('click', function () {
            eui.min(that.index, opts);
            opts.min && opts.min($dialog);
        });

        // 全屏/还原
        $dialog.find('.eui-dialog-max').on('click', function () {
            if ($(this).hasClass('eui-dialog-maxmin')) {
                eui.restore(that.index);
                opts.restore && opts.restore($dialog);
            } else {
                eui.full(that.index, opts);
                opts.full && opts.full($dialog);
            }
        });

        opts.end && (Dialog._end[that.index] = opts.end);
    };

    // 需依赖原型的对外方法
    Dialog.pt.openLayer = function () {
        var that = this;

        //置顶当前窗口
        eui.zIndex = that.opts.zIndex;
        eui.setTop = function ($dialog) {
            var setZindex = function () {
                eui.zIndex++;
                $dialog.css('z-index', eui.zIndex + 1);
            };
            eui.zIndex = parseInt($dialog[0].style.zIndex);
            $dialog.on('mousedown', setZindex);
            return eui.zIndex;
        };
    };

    // 对话框
    eui.dialog = function (options) {
        var dialog = new Dialog(options);
        return dialog.index;
    };

    // 警告框
    eui.alert = function (content, options, yes) {
        var type = typeof options === 'function';
        if (type) yes = options;

        return eui.dialog($.extend({
            content: content,
            yes: yes
        }, type ? {} : options));
    };

    /**
     * 确认框
     *
     * @param content
     * @param options
     * @param yes
     * @param cancel
     * @returns {*}
     */
    eui.confirm = function (content, options, yes, cancel) {
        var type = typeof options === 'function';
        if (type) {
            cancel = yes;
            yes = options;
        }
        return eui.dialog($.extend({
            content: content,
            btn: ['确定', '取消'],
            yes: yes,
            btn2: cancel
        }, type ? {} : options));
    };

    /**
     * 消息提示
     * @param content
     * @param options
     * @param end
     * @returns {*}
     */
    eui.msg = function (content, options, end) {
        var type = typeof options === 'function';
        var skin = 'eui-dialog-msg';
        var shift = anims.length - 1;
        if (type) {
            end = options;
        }

        return eui.dialog($.extend({
            content: content,
            time: 3000,
            shade: false,
            skin: skin,
            title: false,
            closeBtn: false,
            btn: false,
            end: end,
            scrollbar: true
        }, type ? {
            skin: skin + ' eui-dialog-hui',
            shift: shift
        } : function () {
            options = options || {};
            if (options.icon === -1 || options.icon === undefined) {
                options.skin = skin + ' ' + (options.skin || 'eui-dialog-hui');
            }
            return options;
        }()));
    };

    eui.load = function (icon, options) {
        return eui.dialog($.extend({
            type: 3,
            icon: icon || 0,
            shade: 0.01
        }, options));
    };

    eui.tips = function (content, follow, options) {
        return eui.dialog($.extend({
            type: 4,
            content: [content, follow],
            closeBtn: false,
            time: 3000,
            shade: false,
            maxWidth: 210
        }, options));
    };

    // 获取子iframe的DOM
    eui.getChildFrame = function (selector, index) {
        index = index || $('.eui-dialog-iframe').attr('times');
        return $('#eui-dialog' + index).find('iframe').contents().find(selector);
    };

    // 得到当前iframe层的索引，子iframe时使用
    eui.getFrameIndex = function (name) {
        return $('#' + name).parents('.eui-dialog-iframe').attr('times');
    };

    // iframe层自适应宽高
    eui.iframeAuto = function (index) {
        if (!index) {
            return;
        }
        var heg = eui.getChildFrame('html', index).outerHeight();
        var $dialog = $('#eui-dialog' + index);
        var titHeight = $dialog.find('.eui-dialog-header').outerHeight() || 0;
        var btnHeight = $dialog.find('.eui-dialog-footer').outerHeight() || 0;
        $dialog.css({height: heg + titHeight + btnHeight});
        $dialog.find('iframe').css({height: heg});
    };

    // 重置iframe url
    eui.iframeSrc = function (index, url) {
        $('#eui-dialog' + index).find('iframe').attr('src', url);
    };

    // 设定层的样式
    eui.style = function (index, options) {
        var $dialog = $('#eui-dialog' + index),
            type = $dialog.attr('type');
        var titHeight = $dialog.find('.eui-dialog-header').outerHeight() || 0;
        var btnHeight = $dialog.find('.eui-dialog-footer').outerHeight() || 0;
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
    eui.min = function (index, options) {
        var $dialog = $('#eui-dialog' + index);
        var titHeight = $dialog.find('.eui-dialog-header').outerHeight() || 0;
        Dialog._record($dialog);
        eui.style(index, {width: 180, height: titHeight, overflow: 'hidden'});
        $dialog.find('.eui-dialog-min').hide();
        $dialog.attr('type') === 'page' && $dialog.find('eui-dialog-iframe').hide();
        Dialog._rescollbar(index);
    };

    // 还原
    eui.restore = function (index) {
        var $dialog = $('#eui-dialog' + index);
        var area = $dialog.attr('area').split(',');
        var type = $dialog.attr('type');
        eui.style(index, {
            width: parseFloat(area[0]),
            height: parseFloat(area[1]),
            top: parseFloat(area[2]),
            left: parseFloat(area[3]),
            overflow: 'visible'
        });
        $dialog.find('.eui-dialog-max').removeClass('eui-dialog-maxmin');
        $dialog.find('.eui-dialog-min').show();
        $dialog.attr('type') === 'page' && $dialog.find('eui-dialog-iframe').show();
        Dialog._rescollbar(index);
    };

    // 全屏
    eui.full = function (index) {
        var $dialog = $('#eui-dialog' + index),
            timer;
        Dialog._record($dialog);
        if (!$html.attr('eui-full')) {
            $html.css('overflow', 'hidden').attr('eui-full', index);
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            var isfix = $dialog.css('position') === 'fixed';
            eui.style(index, {
                top: isfix ? 0 : $win.scrollTop(),
                left: isfix ? 0 : $win.scrollLeft(),
                width: $win.width(),
                height: $win.height()
            });
            $dialog.find('.eui-dialog-min').hide();
        }, 100);
    };

    // 修改标题
    eui.title = function (name, index) {
        var $header = $('#eui-dialog' + (index || Dialog.index)).find('.eui-dialog-header');
        $header.html(name);
    };

    // 关闭对话框
    eui.close = function (index) {
        var $dialog = $('#eui-dialog' + index);
        var type = $dialog.attr('type');
        if (!$dialog[0]) {
            return;
        }

        if (type === Dialog._type[1] && $dialog.attr('conType') === 'object') {
            $dialog.children(':not(.eui-dialog-body)').remove();
            for (var i = 0; i < 2; i++) {
                $dialog.find('.eui-dialog-wrap').unwrap().hide();
            }
        } else {
            $dialog[0].innerHTML = '';
            $dialog.remove();
        }
        $('#eui-dialog-moves, #eui-dialog-shade' + index).remove();
        Dialog._rescollbar(index);
        $(document).off('keydown', Dialog._enter);
        typeof Dialog._end[index] === 'function' && Dialog._end[index]();
        delete Dialog._end[index];
    };

    // 关闭所有层
    eui.closeAll = function (type) {
        $.each($('.eui-dialog'), function () {
            var $this = $(this);
            var is = type ? ($this.attr('type') === type) : 1;
            is && eui.close($this.attr('times'));
            is = null;
        });
    };

    // 仿系统prompt
    eui.prompt = function (options, yes) {
        options = options || {};
        if (typeof options === 'function') yes = options;
        var prompt, content = options.formType == 2 ? '<textarea class="eui-dialog-input">' + (options.value || '') + '</textarea>' : function () {
            return '<input type="' + (options.formType == 1 ? 'password' : 'text') + '" class="eui-dialog-input" value="' + (options.value || '') + '">';
        }();
        return eui.dialog($.extend({
            btn: ['&#x786E;&#x5B9A;', '&#x53D6;&#x6D88;'],
            content: content,
            //area: ['630px', '550px'],
            skin: 'eui-dialog-prompt',
            success: function ($dialog) {
                prompt = $dialog.find('.eui-dialog-input');
                prompt.focus();
            }, yes: function (index) {
                var value = prompt.val();
                if (value === '') {
                    prompt.focus();
                } else if (value.length > (options.maxlength || 500)) {
                    eui.tips('&#x6700;&#x591A;&#x8F93;&#x5165;' + (options.maxlength || 500) + '&#x4E2A;&#x5B57;&#x6570;', prompt, {tips: 1});
                } else {
                    yes && yes(value, index, prompt);
                }
            }
        }, options));
    };

    // RequireJS
    if (typeof define === 'function') {
        define(function () { return eui; });
    }

})(jQuery);
