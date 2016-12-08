/**
 * EUI: modal.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

+function ($) {
    'use strict';

    // 对话框类
    var Modal = function (element, options) {
        this.opts = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$dialog = this.$element.find('.modal-dialog');
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;
        this.ignoreBackdropClick = false;

        // 如果是远程内容,就加载,并触发loaded.ui.modal事件
        if (this.opts.remote) {
            this.$element
                .find('.modal-content')
                .load(this.opts.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    };

    Modal.VERSION = '1.3.0';

    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;

    Modal.DEFAULTS = {
        backdrop: true, // 点击对话框周围位置隐藏对话框
        keyboard: true, // 按 esc 键关闭对话框
        show: true // 模态框初始化之后就立即显示出来
    };

    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    };

    // 显示对话框
    Modal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.bs.modal', {relatedTarget: _relatedTarget});

        this.$element.trigger(e); // 触发show.bs.modal事件

        if (this.isShown || e.isDefaultPrevented()) {
            return;
        }

        this.isShown = true;

        // 有滚动条的话,就设置滚动条的宽度
        this.checkScrollbar();
        // padding-right 属性在原来的基础上 + 上面算出来的滚动条的宽度
        this.setScrollbar();
        this.$body.addClass('modal-open');

        //如果options.keyboard配置为true则监听keyup.dismiss.bs.modal事件, 功能就是按esc键,就调用hide方法
        this.escape();
        this.resize();

        // 包含 data-dismiss="modal" 属性的元素注册关闭处理器
        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

        this.$dialog.on('mousedown.dismiss.bs.modal', function () {
            that.$element.one('mouseup.dismiss.bs.modal', function (e) {
                if ($(e.target).is(that.$element)) {
                    that.ignoreBackdropClick = true;
                }
            });
        });

        // backdrop函数:背景逻辑, 回调函数功能:显示model逻辑
        this.backdrop(function () {
            // 浏览器是否支持动画 & model的元素包含fade class
            var transition = $.support.transition && that.$element.hasClass('fade');

            // 没有父元素(例:还未append的$("<div></div>")),则将model附加到body上,
            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body); // don't move modals dom position
            }

            // 将model元素设置成显示(jq.show方法), 并移动到最上面
            that.$element.show().scrollTop(0);

            that.adjustDialog();

            //动画效果准备
            if (transition) {
                that.$element[0].offsetWidth; // force reflow
            }

            that.$element.addClass('in');

            that.enforceFocus();

            var e = $.Event('shown.bs.modal', {relatedTarget: _relatedTarget});

            transition ?
                that.$dialog // wait for modal to slide in
                    .one('uiTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e);
                    })
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e);
        });
    };

    // 隐藏对话框
    Modal.prototype.hide = function (e) {
        if (e) {
            e.preventDefault();
        }

        e = $.Event('hide.bs.modal');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) {
            return;
        }

        this.isShown = false;

        this.escape();
        this.resize();

        $(document).off('focusin.bs.modal');

        this.$element
            .removeClass('in')
            .off('click.dismiss.bs.modal')
            .off('mouseup.dismiss.bs.modal');

        this.$dialog.off('mousedown.dismiss.bs.modal');

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('uiTransitionEnd', $.proxy(this.hideModal, this))
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    };

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (document !== e.target &&
                    this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    };

    // 按 esc 键隐藏对话框
    Modal.prototype.escape = function () {
        if (this.isShown && this.opts.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    };

    Modal.prototype.resize = function () {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal');
        }
    };

    Modal.prototype.hideModal = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.$body.removeClass('modal-open');
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger('hidden.bs.modal');
        })
    };

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };

    Modal.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.opts.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $(document.createElement('div'))
                .addClass('modal-backdrop ' + animate)
                .appendTo(this.$body);

            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return;
                }
                if (e.target !== e.currentTarget) return;
                this.opts.backdrop == 'static'
                    ? this.$element[0].focus()
                    : this.hide();
            }, this));

            if (doAnimate) {
                this.$backdrop[0].offsetWidth; // force reflow
            }

            this.$backdrop.addClass('in');

            if (!callback) {
                return;
            }

            doAnimate ?
                this.$backdrop
                    .one('uiTransitionEnd', callback)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback();

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function () {
                that.removeBackdrop();
                callback && callback();
            };
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('uiTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove();

        } else if (callback) {
            callback();
        }
    };

    // 下面的方法用来处理内容溢出的对话框

    Modal.prototype.handleUpdate = function () {
        this.adjustDialog();
    };

    Modal.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    };

    Modal.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    };

    // 检查是否有滚动条,并计算滚动条宽度
    Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar();
    };

    // 设置又内边距(估计和滚动条有关)
    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        this.originalBodyPad = document.body.style.paddingRight || '';
        if (this.bodyIsOverflowing) {
            this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
        }
    };

    // 还原上面内边距设置
    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad);
    };

    // 计算滚动条宽度的一种方法
    Modal.prototype.measureScrollbar = function () { // thx walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };


    // 对话框插件定义
    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.modal');
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) {
                data = new Modal(this, options);
                $this.data('bs.modal', data);
            }
            if (typeof option == 'string') {
                data[option](_relatedTarget);
            } else if (options.show) {
                data.show(_relatedTarget);
            }
        });
    }

    var old = $.fn.modal;

    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;

    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };

    $(document).on('click.ui.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        if ($this.is('a')) {
            e.preventDefault();
        }

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) {
                return; // only register focus restorer if modal will actually get shown
            }
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus');
            });
        });
        Plugin.call($target, option, this);
    });

}(jQuery);
