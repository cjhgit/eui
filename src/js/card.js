/**
 * EUI card.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    // 类定义
    function Card($elem, opts) {
        this.$header = $elem.find('.card-header');
        this.$body = $elem.find('.card-body');
        this.opts = opts;
        this.$elem = $elem;

        $elem.addClass('card-ex');

        this.init();
    }

    Card.VERSION = '1.0.0';

    Card.DEFAULTS = {
        tools: [],
        draggable: true, // 是否可拖动
        connectWith: '.ui-sortable',
        //This parameter accepts string ['both', 'vertical', 'horizontal', 'none']. none means disable resize
        resize: 'both',
        minWidth: 200, // 最小宽度
        minHeight: 100, // 最小高度
        maxWidth: 1200, // 最大宽度
        maxHeight: 700, // 最大高度
        stateful: false, // If you set this to true you must specify data-inner-id. Plugin will save (in localStorage) it's states such as
                         // pinned, unpinned, collapsed, minimized, fullscreen, position among it's siblings
                         // and apply them when you reload the browser
        unpin: {
            icon: 'fa fa-arrows', //You can user glyphicons if you do not want to use font-awesome
            tooltip: 'Unpin'               //tooltip text, If you want to disable tooltip, set it to false
        },
        reload: {
            icon: 'fa fa-refresh', //You can user glyphicons if you do not want to use font-awesome
            tooltip: 'Reload'           //tooltip text, If you want to disable tooltip, set it to false
        },
        minimize: {
            icon: 'fa fa-minus', //icon is shown when panel is not minimized
            icon2: 'fa fa-plus', //icon2 is shown when panel is minimized
            tooltip: 'Minimize'         //tooltip text, If you want to disable tooltip, set it to false
        },
        expand: {
            icon: 'fa fa-expand', //icon is shown when panel is not on full screen（glyphicon glyphicon-resize-full）
            icon2: 'fa fa-compress', //icon2 is shown when pane is on full screen state(glyphicon glyphicon-resize-small)
            tooltip: 'Fullscreen'       //tooltip text, If you want to disable tooltip, set it to false
        },
        close: {
            icon: 'fa fa-close', //You can user glyphicons if you do not want to use font-awesome（glyphicon glyphicon-remove）
            tooltip: 'Close'            //tooltip text, If you want to disable tooltip, set it to false
        },
        editTitle: {
            icon: 'fa fa-edit',
            icon2: 'fa fa-bold', // TODO 更改图标
            tooltip: 'Edit title'
        }
    };

    var fn = Card.prototype;

    // 初始化
    fn.init = function () {
        var opts = this.opts;
        var that = this;

        var ul = $('<ul class="card-tool-list"></ul>');

        for (var i = 0; i < opts.tools.length; i++) {
            switch (opts.tools[i]) {
                case 'refresh': // 刷新
                    var refresh = $('<li><a title="刷新"><i class="card-tool-icon fa fa-refresh"></i></a></li>');
                    ul.append(refresh);
                    break;
                case 'edit': // 编辑
                    var edit = $('<li><a title="编辑"><i class="card-tool-icon fa fa-edit"></i></a></li>');
                    ul.append(edit);
                    edit.on('click', function () {
                        alert(1);
                    });
                    break;
                case 'move': // 移动
                    var move = $('<li><a title="移动"><i class="card-tool-icon fa fa-arrows"></i></a></li>');
                    ul.append(move);
                    this.initMove(move);
                    break;
                case 'close': // 关闭
                    var remove = $('<li><a title="关闭"><i class="card-tool-icon '
                        + opts.close.icon + '"></i></a></li>')
                    ul.append(remove);
                    removeable(remove, this.$elem);
                    break;
                case 'full': // 全屏
                    var full = $('<li><a title="全屏"><i class="card-tool-icon fa fa-expand"></i></a></li>');
                    full.on('click', function () {
                        that.toggleFull($(this));
                    });
                    ul.append(full);
                    break;
                case 'min': // 最小化
                    var minus = $('<li><a title="最小化/最大化"><i class="card-tool-icon fa fa-minus"></i></a></li>');
                    ul.append(minus);
                    this.toggleSize(minus);
                    break;
                case 'menu': // 菜单
                    var $menu = this.createMenu();
                    ul.append($menu);
                    break;
            }
        }

        this.$header.append(ul);
    };

    // 生成菜单
    fn.createMenu = function () {
        var that = this;
        var opts = this.opts;
        var $elem = this.$elem;

        var html = '<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" data-func="editTitle" title=""><i class="card-tool-icon fa fa-wrench"></i></a>' +
            '<ul class="dropdown-menu dropdown-menu-right">';
        for (var i = 0; i < this.opts.menu.length; i++) {
            html += '<li><a href="#" data-id="' + this.opts.menu[i].id + '">' + this.opts.menu[i].text + '</a></li>';
        }
        html += '</ul></li>';

        this.$elem.on('click', '.dropdown-menu a', function (e) {
            var id = $(this).data('id');
            if (opts.menuCallback) {
                opts.menuCallback(id, e);
            }
        });

        var $menu = $(html);
        return $menu;
    };

    // 收缩展开
    fn.toggleSize = function (minus) {
        var that = this;

        minus.on('click', function () {
            var icon = minus.find('.card-tool-icon');
            if (icon.hasClass('fa-minus')) {
                icon.removeClass('fa-minus');
                icon.addClass('fa-plus');

                that.$body.slideUp(500);
            } else {
                icon.removeClass('fa-plus');
                icon.addClass('fa-minus');
                that.$body.slideDown(500);
            }

            /*$this.resizable({
             disabled: true
             });*/
        });
    };

    // 切换全屏
    fn.toggleFull = function (ele) {
        var $elem = this.$elem;
        var opts = this.opts;

        var FULL_CLASS = 'card-ex-full';
        var icon = ele.find('.card-tool-icon');
        if ($elem.hasClass(FULL_CLASS)) {
            $elem.removeClass(FULL_CLASS);
            $elem.attr('style', $elem.attr('data-old-style'));

            icon.removeClass(opts.expand.icon2);
            icon.addClass(opts.expand.icon);
        } else {
            if ($elem.attr('style')) {
                $elem.attr('data-old-style', $elem.attr('style'))
            } else {
                $elem.attr('data-old-style', '');
            }

            icon.removeClass(opts.expand.icon);
            icon.addClass(opts.expand.icon2);

            $elem.css({
                'position': 'fixed',
                'top': '0',
                'right': '0',
                'bottom': '0',
                'left': '0',
                'z-index': '10000',
                'margin-bottom': '0'
            });
            $elem.addClass(FULL_CLASS);
        }

    };

    fn.initMove = function (move) {
        var $elem = this.$elem;
        var opts = this.opts;

        move.on('click', function () {
            if ($elem.hasClass('panel-unpin')) {
                $elem.removeClass('panel-unpin');
                $elem.draggable({
                    disabled: true
                });

                $elem.attr('style', $elem.attr('data-old-style'));
            } else {
                $elem.addClass('panel-unpin');
                $elem.draggable({
                    cursor: "move",
                    handle: ".card-header",
                    disabled: false
                });

                if ($elem.attr('style')) {
                    $elem.attr('data-old-style', $elem.attr('style'))
                } else {
                    $elem.attr('data-old-style', '');
                }

                $elem.css({
                    'top': 100,
                    'left': 100,
                    width: 400,
                });

                $elem.resizable({
                    minWidth: opts.minWidth,
                    maxWidth: opts.maxWidth,
                    minHeight: opts.minHeight,
                    maxHeight: opts.maxHeight
                });
            }
        });
    }

    function removeable(remove, $this) {
        remove.on('click', function() {
            $this.remove();
        });
    }

    function Plugin(options) {
        return this.each(function () {
            var $this = $(this);
            var opts = $.extend({}, Card.DEFAULTS, options);
            var data = $this.data('ui-card');
            if (!data) {
                $this.data('ui-card', (data = new Card($(this), opts)));
            }

            if (typeof options == 'string') {
                data[options];
            }
        });
    }

    $.fn.card = Plugin;



})(jQuery);
