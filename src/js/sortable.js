/**
 * EUI: sortable.js v1.3.0
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    function Sortable(elem, option) {
        var that = this;

        that.opts = $.extend({}, Sortable.DEFAULTS, option);
        that.elem = elem;
        that.$elem = $(elem);

        var $dragging, placeholders = $();

        var isHandle, index;
        var items = that.$elem.children(that.opts.item);
        that.newItems = that.$elem.children(that.opts.item);
        var placeholder = $('<' + (/^(ul|ol)$/i.test(elem.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
        that.$elem.on('mousedown', that.opts.handle, function () {
            isHandle = true;
        }).mouseup(function () {
            isHandle = false;
        });
        that.$elem.data('items', that.opts.item);
        placeholders = placeholders.add(placeholder);
        if (that.opts.connectWith) {
            $(that.opts.connectWith).add(elem).data('connectWith', that.opts.connectWith);
        }
        that.$elem.on('mousedown.ui.sortable', that.opts.item, function (e) {
            $(this).attr('draggable', 'true');
        });
        that.$elem.on('dragstart.ui.sortable', that.opts.item, function (e) {
            if (that.opts.handle && !isHandle) {
                return false;
            }
            isHandle = false;
            var dt = e.originalEvent.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('Text', 'dummy');
            index = ($dragging = $(this)).addClass('sortable-dragging').index();

            that.newItems = that.$elem.children(that.opts.item);

            typeof that.opts.start === 'function' && that.opts.start(e, that.elem);
        });
        that.$elem.on('dragend.ui.sortable', that.opts.item, function (e) {
            if (!$dragging) {
                return;
            }
            $dragging.removeClass('sortable-dragging').show();
            placeholders.detach();
            if (index != $dragging.index()) {
                $dragging.parent().trigger('sortupdate', {item: $dragging});
            }
            $dragging = null;

            typeof that.opts.end === 'function' && that.opts.end(e, that.elem);
        });
        items.not('a[href], img').on('selectstart.ui.sortable', function () {
            this.dragDrop && this.dragDrop();
            return false;
        });
        items.add([elem, placeholder]);

        that.$elem.on('dragover.ui.sortable dragenter.ui.sortable drop.ui.sortable', that.opts.item, function (e) {
            if (!that.newItems.is($dragging) && that.opts.connectWith !== $($dragging).parent().data('connectWith')) {
                return true;
            }
            if (e.type == 'drop') {
                e.stopPropagation();
                placeholders.filter(':visible').after($dragging);
                $dragging.trigger('dragend.ui.sortable');
                return false;
            }
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'move';
            if (that.newItems.is(this)) {
                if (that.opts.forcePlaceholderSize) {
                    placeholder.height($dragging.outerHeight());
                }
                $dragging.hide();
                $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
                placeholders.not(placeholder).detach();
            } else if (!placeholders.is(this) && !$(this).children(that.opts.item).length) {
                placeholders.detach();
                $(this).append(placeholder);
            }

            typeof that.opts.sort === 'function' && that.opts.sort(e, that.elem);

            return false;
        });
    }

    Sortable.DEFAULTS = {
        item: 'li',
        connectWith: false,
        forcePlaceholderSize: true,
        //handle
        start: function(event, ui) {}, // 开始排序
        sort: function(event, ui) {}, // 排序中
        end: function(event, ui) {}, // 排序结束
    };

    var fn = Sortable.prototype;

    fn.enable = function () {
        var that = this;
        that.$elem.children(that.$elem.data('items')).attr('draggable', true);

        return that;
    };

    fn.disable = function () {
        var that = this;
        that.$elem.children(that.$elem.data('items')).attr('draggable', false);
        return that
    };

    fn.destroy = function () {
        var that = this;
        var items = that.$elem.children(that.$elem.data('items')).attr('draggable', false);

        items.add(elem).removeData('connectWith items')
            .off('.ui.sortable');
        that.$elem.removeData('ui.sortable');
        return that
    };

    fn.option = function () {

    };

    $.fn.sortable = function (option) {

        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.sortable');
            if (!data) {
                data = new Sortable(this, option);
                $this.data('ui.sortable', data);
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };
})(jQuery);
