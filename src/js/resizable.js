/**
 * EUI: resizable.js v1.3.1
 *
 * https://github.com/cjhgit/eui
 */

;(function ($) {
    'use strict';

    var doc = document,
        win = window,
        root = doc.documentElement;

    function Resizable(el, options) {
        var that = this;

        that.element = el;
        that.$elem = $(el);

        that.opts = $.extend({}, Resizable.DEFAULTS, options);
        that.resizing = false;
        that.maxHeight = that.opts.maxHeight;
        that.maxWidth = that.opts.maxWidth;
        that.minWidth = that.opts.minWidth;
        that.minHeight = that.opts.minHeight;

        that.draggable = that.opts.draggable;
        that.within = that.opts.within;
        that.threshold = that.opts.threshold;
        that.handles = that.opts.handles;

        that.createHandles();
    }

    Resizable.DEFAULTS = {
        maxWidth: false,
        maxHeight: false,
        minWidth: 0,
        minHeight: 0,
        resize: function(event, ui) {},
        start: function(event, ui) {},
        end: function(event, ui) {}
    };

    var fn = Resizable.prototype;

    fn.threshold = 10; // Threshold size

    /** Make itself draggable to the row */
    fn.draggable = false;

    /** Create handles according to options */
    fn.createHandles = function () {
        var that = this;

        //init handles
        var handles;

        //parse value
        if ($.isArray(that.handles)) {
            handles = {};
            for (var i = that.handles.length; i--;){
                handles[that.handles[i]] = null;
            }
        } else if (typeof that.handles === 'string') {
            handles = {};
            var arr = that.handles.match(/([swne]+)/g);
            for (var i = arr.length; i--;){
                handles[arr[i]] = null;
            }
        } else if (typeof that.handles === 'object') {
            handles = that.handles;
        }
        //default set of handles depends on position.
        else {
            var position = getComputedStyle(that.element).position;
            var display = getComputedStyle(that.element).display;
            //if display is inline-like - provide only three handles
            //it is position: static or display: inline
            if (/inline/.test(display) || /static/.test(position)){
                handles = {
                    s: null,
                    se: null,
                    e: null
                };

                //ensure position is not static
                that.$elem.css('position', 'relative');
            }
            //else - all handles
            else {
                handles = {
                    s: null,
                    se: null,
                    e: null,
                    ne: null,
                    n: null,
                    nw: null,
                    w: null,
                    sw: null
                };
            }
        }


        //create proper number of handles
        var handle;
        for (var direction in handles) {
            handles[direction] = that.createHandle(handles[direction], direction);
        }

        //save handles elements
        that.handles = handles;
    }


    /** Create handle for the direction */
    fn.createHandle = function(handle, direction){
        var that = this;

        var el = that.element;

        //make handle element
        if (!handle) {
            handle = document.createElement('div');
            handle.classList.add('resizable-handle');
        }

        //insert handle to the element
        that.element.appendChild(handle);
        //save direction
        handle.direction = direction;

        //detect self.within
        var within = that.within === 'parent' ? that.element.parentNode : that.within;
        var position = that.$elem.parent().css('position');
        var parentTop;
        var parentLeft;
        if (position === 'absolute' || position === 'relative') {
            parentTop = that.$elem.parent().offset().top;
            parentLeft = that.$elem.parent().offset().left;
        } else {
            parentTop = 0;
            parentLeft = 0;
        }

        var $handle = $(handle);
        $handle.on('mousedown', function (e) {
            e.stopPropagation();

            that.down = true;
            that.curHander = this;
            that.bottomY = that.$elem.offset().top + that.$elem.outerHeight();
            that.rightX = that.$elem.offset().left + that.$elem.outerWidth();
        });

        $(document).on('mousemove', function (e) {
            if (!that.down) {
                return true;
            }
            //e.stopPropagation();

            var pageX = e.pageX;
            var pageY = e.pageY;

            var direct = that.curHander.direction;




            if (direct === 'e' || direct === 'se' || direct === 'ne') {
                var width = pageX - that.$elem.offset().left;
                if (that.maxWidth && width > that.maxWidth) {
                    width = that.maxWidth;
                }
                if (that.minWidth && width < that.minWidth) {
                    width = that.minWidth;
                }
                that.$elem.width(width)
            }
            if (direct === 's' || direct === 'se' || direct === 'sw') {
                var height = pageY - that.$elem.offset().top;
                if (that.maxHeight && height > that.maxHeight) {
                    height = that.maxHeight;
                }
                if (that.minHeight && height < that.minHeight) {
                    height = that.minHeight;
                }
                that.$elem.height(height);
            }
            if (direct === 'w' || direct === 'sw' || direct === 'nw') {


                var width = that.rightX - pageX;
                var left = pageX - parentLeft;
                if (that.maxWidth && width > that.maxWidth) {
                    left = left + (width - that.maxWidth);
                    width = that.maxWidth;
                }
                if (that.minWidth && width < that.minWidth) {
                    left = left - (that.minWidth - width);
                    width = that.minWidth;
                }

                that.$elem.width(width);

                that.$elem.css('left', left + 'px');
            }
            if (direct === 'n' || direct === 'ne' || direct === 'nw') {
                var height = that.bottomY - pageY;
                var top = pageY - parentTop;
                if (that.maxHeight && height > that.maxHeight) {
                    top = top + (height - that.maxHeight);
                    height = that.maxHeight;
                }
                if (that.minHeight && height < that.minHeight) {
                    top = top - (that.minHeight - height);
                    height = that.minHeight;
                }

                that.$elem.height(height);
                that.$elem.css('top', top + 'px');
            }

            if (!that.resizing) {
                that.resizing = true;
                that.opts.start(e, that.elem);
            } else {
                that.opts.resize(e, that.elem);
            }
        });

        $(document).on('mouseup', function(e) {
            //e.stopPropagation();

            that.down = false;
            if (that.resizing) {
                that.resizing = false;
                that.opts.end(e, that.elem);
            }
            //clear cursor & pointer-events
            /*css(root, {
                'cursor': null
            });

            //get back cursors
            for (var h in self.handles){
                css(self.handles[h], 'cursor', self.handles[h].direction + '-resize');
            }*/
        });

        $(handle).css('cursor', direction + '-resize');

        //append proper class
        handle.classList.add('resizable-handle-' + direction);
        handle.classList.add('ui-scale');
        handle.classList.add('ui-scale-' + direction);

        return handle;
    };

    fn.enable = function () {
        //remove all handles
        for (var hName in this.handles){
            $(this.handles[hName]).show();
        }
    };

    fn.disable = function () {
        //remove all handles
        for (var hName in this.handles){
            $(this.handles[hName]).hide();
        }
    };

    fn.destroy = function () {
        //remove all handles
        for (var hName in this.handles){
            $(this.handles[hName]).remove();
        }

        this.$elem.removeData('ui.resizable');
        this.element = null;
    };

    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.resizable');
            if (!data) {
                data = new Resizable(this, option);
                $this.data('ui.resizable', data);
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    $.fn.resizable = Plugin;
})(jQuery);
