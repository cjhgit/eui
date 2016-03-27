/**
 * Bootstrap panel 增强版
 * 时间：2016-3-17 00:08:24
 */
;
(function ($) {

    $.fn.euiPanel = function (options) {

        var opts = $.extend({}, $.fn.euiPanel.defaults, options);
        return this.each(function () {
            $this = $(this);

            //var opts = $.extend({}, opts, $this.data());
            euiPanel($this, opts);
        });
    };

    $.fn.euiPanel.defaults = {
        draggable: true, // 是否可拖动
        connectWith: '.ui-sortable',
        //This parameter accepts string ['both', 'vertical', 'horizontal', 'none']. none means disable resize
        resize: 'both',
        minWidth: 200, // 最小宽度
        minHeight: 100, // 最小高度
        maxWidth: 1200, // 最大宽度
        maxHeight: 700, // 最大高度
        tooltips: true,
        toggleIcon: 'glyphicon glyphicon-cog',
        expandAnimation: 100,
        collapseAnimation: 100,
        state: 'pinned', // pinned, unpinned, collapsed, minimized, fullscreen,
        initialIndex: null,
        stateful: false, // If you set this to true you must specify data-inner-id. Plugin will save (in localStorage) it's states such as
                         // pinned, unpinned, collapsed, minimized, fullscreen, position among it's siblings
                         // and apply them when you reload the browser
        unpin: {
            icon: 'glyphicon glyphicon-move', //You can user glyphicons if you do not want to use font-awesome
            tooltip: 'Unpin'               //tooltip text, If you want to disable tooltip, set it to false
        },
        reload: {
            icon: 'glyphicon glyphicon-refresh', //You can user glyphicons if you do not want to use font-awesome
            tooltip: 'Reload'           //tooltip text, If you want to disable tooltip, set it to false
        },
        minimize: {
            icon: 'glyphicon glyphicon-minus', //icon is shown when panel is not minimized
            icon2: 'glyphicon glyphicon-plus', //icon2 is shown when panel is minimized
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
            icon: 'glyphicon glyphicon-pencil',
            icon2: 'glyphicon glyphicon-floppy-disk',
            tooltip: 'Edit title'
        }
    };

    $.fn.euiPanel.version = 1.0;
    //$('.euipanel').euiPanel();

    function euiPanel($this, opts) {
        var header = $this.find('.panel-heading');
        var body = $this.find('.panel-body');

        // 切换全屏
        var fullS = function (ele) {
            var FULL_CLASS = 'eui-panel-full';
            var icon = ele.find('.panel-control-icon');
            if ($this.hasClass(FULL_CLASS)) {
                $this.removeClass(FULL_CLASS);
                $this.attr('style', $this.attr('data-old-style'));

                icon.removeClass(opts.expand.icon2);
                icon.addClass(opts.expand.icon);
            } else {
                if ($this.attr('style')) {
                    $this.attr('data-old-style', $this.attr('style'))
                } else {
                    $this.attr('data-old-style', '');
                }

                icon.removeClass(opts.expand.icon);
                icon.addClass(opts.expand.icon2);

                $this.css({
                    'position': 'fixed',
                    'top': '0',
                    'right': '0',
                    'bottom': '0',
                    'left': '0',
                    'z-index': '10000',
                    'margin-bottom': '0'
                });
                $this.addClass(FULL_CLASS);
            }

        };

        // 收缩展开
        function toggleSize(minus) {
            minus.on('click', function () {
                var icon = minus.find('.panel-control-icon');
                if (icon.hasClass('glyphicon-minus')) {
                    icon.removeClass('glyphicon-minus');
                    icon.addClass('glyphicon-plus');

                    body.slideUp(500);
                } else {
                    icon.removeClass('glyphicon-plus');
                    icon.addClass('glyphicon-minus');
                    body.slideDown(500);
                }

                $this.resizable({
                    disabled: true
                });
            });
        }

        function initMove(move) {
            move.on('click', function () {
                if ($this.hasClass('panel-unpin')) {
                    $this.removeClass('panel-unpin');
                    $this.draggable({
                        disabled: true
                    });

                    $this.attr('style', $this.attr('data-old-style'));
                } else {
                    $this.addClass('panel-unpin');
                    $this.draggable({
                        cursor: "move",
                        handle: ".panel-heading",
                        disabled: false
                    });

                    if ($this.attr('style')) {
                        $this.attr('data-old-style', $this.attr('style'))
                    } else {
                        $this.attr('data-old-style', '');
                    }

                    $this.css({
                        'top': 100,
                        'left': 100,
                        width: 400,
                    });

                    $this.resizable({
                        minWidth: opts.minWidth,
                        maxWidth: opts.maxWidth,
                        minHeight: opts.minHeight,
                        maxHeight: opts.maxHeight
                    });
                }


            });
        }

        var init = function ($header) {
            var dropdown = $('<div class="dropdown"></div>');
            var ul = $('<ul class="dropdown-menu dropdown-menu-right"></ul>');
            var edit = $('<li><a data-func="editTitle" data-tooltip="Edit title" data-toggle="tooltip" data-title="Edit title" data-placement="bottom" data-original-title="" title=""><i class="panel-control-icon glyphicon glyphicon-pencil"></i><span class="control-title">Edit title</span></a></li>');
            ul.append(edit);

            edit.on('click', function () {
                alert(1);
            });
            var move = $('<li><a data-func="editTitle" data-tooltip="Edit title" data-toggle="tooltip" data-title="Edit title" data-placement="bottom" data-original-title="" title=""><i class="panel-control-icon glyphicon glyphicon-move"></i><span class="control-title">Edit title</span></a></li>');
            ul.append(move);
            initMove(move);

            var refresh = $('<li><a data-func="editTitle" data-tooltip="Edit title" data-toggle="tooltip" data-title="Edit title" data-placement="bottom" data-original-title="" title=""><i class="panel-control-icon glyphicon glyphicon-refresh"></i><span class="control-title">Edit title</span></a></li>');
            ul.append(refresh);

            var minus = $('<li><a data-func="editTitle" data-tooltip="Edit title" data-toggle="tooltip" data-title="Edit title" data-placement="bottom" data-original-title="" title=""><i class="panel-control-icon glyphicon glyphicon-minus"></i><span class="control-title">Edit title</span></a></li>');
            ul.append(minus);
            toggleSize(minus);

            var full = $('<li><a data-func="editTitle" data-tooltip="Edit title" data-toggle="tooltip" data-title="Edit title" data-placement="bottom" data-original-title="" title=""><i class="panel-control-icon glyphicon glyphicon-resize-full"></i><span class="control-title">Edit title</span></a></li>')
            ul.append(full);


            full.on('click', function () {
                fullS($(this));
            });

            var remove = $('<li><a data-func="editTitle" data-tooltip="Edit title" data-toggle="tooltip" data-title="Edit title" data-placement="bottom" data-original-title="" title=""><i class="panel-control-icon '
                + opts.close.icon + '"></i><span class="control-title">Edit title</span></a></li>')
            ul.append(remove);
            removeable(remove, $this);

            dropdown.append(ul);
            $header.append(dropdown);
        };

        init(header);

        $this.addClass('euipanel');
    }

    function removeable(remove, $this) {
        remove.on('click', function() {
            $this.remove();
        });
    }

})(jQuery);
