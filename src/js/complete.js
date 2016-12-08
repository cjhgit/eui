/**
 * Complete 输入框输入提示插件
 * v1.0.0
 *
 * Depends:
 *  ui.core.js
 *
 * https://github.com/cjhgit/eui
 */

!function ($) {
    "use strict";

    var Complete = function (element, options) {
        this.init(element, options);
    }

    Complete.VERSION = '1.3.0';
    Complete.v = 1.00;

    Complete.DEFAULTS = {
        source: [],
        items: 8, // 显示的最大数量
        menu: '<ul class="complete dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        display: 'name',
        val: 'id',
        itemSelected: function () { },
        ajax: {
            url: null,
            timeout: 300,
            method: 'post',
            triggerLength: 3,
            loadingClass: null,
            displayField: null,
            preDispatch: null,
            preProcess: null
        },
        filter: false,
        width: 'auto', // 宽度，auto则根据输入框的大小自动设置宽度
        height: 0,
        // 邮箱相关
        email: false,
        emailSource: ['qq.com', '163.com', 'sina.com', '126..com', 'sohu.com', "gmail.com",
            "yahoo.com", "hotmail.com", "outlook.com", "live.com", "aol.com", "mail.com"],

        //var domainSource = ["com", "net", "org", "co", "io", "me", "cn", "com.cn"];

        // 高级接口
        // TODO

        reset: false
    }

    Complete.prototype = {

        constructor: Complete,

        init: function (element, options) {
            this.userOptions = options;
            this.$element = $(element);
            this.opts = $.extend(true, {}, Complete.DEFAULTS, options);
            this.$menu = $(this.opts.menu).appendTo('body');
            if (this.opts.width) {
                if (this.opts.width === 'auto') {
                    this.$menu.css('width', this.$element.outerWidth() + 'px');
                } else {
                    this.$menu.css('width', this.opts.width + 'px');
                }
            }
            this.shown = false;

            this.$element.attr('autocomplete', 'off');

            // Method overrides
            this.eventSupported = this.opts.eventSupported || this.eventSupported;
            this.grepper = this.opts.grepper || this.grepper;
            this.highlighter = this.opts.highlighter || this.highlighter;
            this._lookup = this.opts._lookup || this._lookup;
            this.matcher = this.opts.matcher || this.matcher;
            this.render = this.opts.render || this.render;
            this.select = this.opts.select || this.select;
            this.sorter = this.opts.sorter || this.sorter;
            this.source = this.opts.source || this.source;
            if (!this.source.length) {

                var ajax = this.opts.ajax;

                if (typeof ajax === 'string') {
                    this.ajax = $.extend({}, Complete.DEFAULTS.ajax, { url: ajax });
                } else {
                    this.ajax = $.extend({}, Complete.DEFAULTS.ajax, ajax);
                }

                if (!this.ajax.url) {
                    this.ajax = null;
                }
            }

            this._event();
        },

        //  Utils
        //=============================================================================================================

        //  Check if an event is supported by the browser eg. 'keypress'
        //  * This was included to handle the "exhaustive deprecation" of jQuery.browser in jQuery 1.8
        eventSupported: function(eventName) {
            var isSupported = (eventName in this.$element);

            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;');
                isSupported = typeof this.$element[eventName] === 'function';
            }

            return isSupported;
        },

        //  AJAX
        //=============================================================================================================

        //  Handle AJAX source
        ajaxer: function () {
            var that = this,
                query = that.$element.val();

            if (query === that.query) {
                return that;
            }

            // Query changed
            that.query = query;

            // Cancel last timer if set
            if (that.ajax.timerId) {
                clearTimeout(that.ajax.timerId);
                that.ajax.timerId = null;
            }

            if (!query || query.length < that.ajax.triggerLength) {
                // Cancel the ajax callback if in progress
                if (that.ajax.xhr) {
                    that.ajax.xhr.abort();
                    that.ajax.xhr = null;
                    that.ajaxToggleLoadClass(false);
                }

                return that.shown ? that.hide() : that;
            }

            // Query is good to send, set a timer
            that.ajax.timerId = setTimeout(function() {
                $.proxy(that.ajaxExecute(query), that)
            }, that.ajax.timeout);

            return that;
        },

        //  Execute an AJAX request
        ajaxExecute: function(query) {
            this.ajaxToggleLoadClass(true);

            // Cancel last call if already in progress
            if (this.ajax.xhr) this.ajax.xhr.abort();

            var params = this.ajax.preDispatch ? this.ajax.preDispatch(query) : { query : query };
            var jAjax = (this.ajax.method === "post") ? $.post : $.get;
            this.ajax.xhr = jAjax(this.ajax.url, params, $.proxy(this.ajaxLookup, this));
            this.ajax.timerId = null;
            $.ajax({
                url: this.ajax.url,
                dataType: 'JSON',
                success: function () {
                }
            });
        },

        //  Perform a lookup in the AJAX results
        ajaxLookup: function (data) {
            var items;

            this.ajaxToggleLoadClass(false);

            if (!this.ajax.xhr) return;

            if (this.ajax.preProcess) {
                data = this.ajax.preProcess(data);
            }

            // Save for selection retreival
            this.ajax.data = data;

            items = this.grepper(this.ajax.data);
            items = this.sorter(items);

            if (!items || !items.length) {
                return this.shown ? this.hide() : this;
            }

            this.ajax.xhr = null;

            return this.render(items.slice(0, this.opts.items)).show();
        },

        //  Toggle the loading class
        ajaxToggleLoadClass: function (enable) {
            if (!this.ajax.loadingClass) return;
            this.$element.toggleClass(this.ajax.loadingClass, enable);
        },

        //=============================================================================================================
        //  Data manipulation
        //=============================================================================================================

        //  Search source
        _lookup: function (event) {
            var that = this;

            if (that.ajax) {
                that.ajaxer();
            } else {
                that.query = that.$element.val();
                if (!that.query) {
                    return that.shown ? that.hide() : that;
                }

                var items;
                if (that.opts.email) {
                    items = that.emailSource();
                } else {
                    items = that.grepper(that.source);

                }
                items = this.sorter(items);
                if (!items || !items.length) {
                    return that.shown ? that.hide() : that;
                }
                return that.render(items.slice(0, that.opts.items)).show();
            }
        },

        //  Filters relevent results
        grepper: function(data) {

            var that = this,
                items;

            if (data && data.length && !data[0].hasOwnProperty(that.opts.display)) {
                return null;
            }

            items = $.grep(data, function (item) {
                if (!that.opts.filter) {
                    return true;
                }
                return that.matcher(item[that.opts.display], item);
            });

            return items;
        },

        //  Looks for a match in the source
        matcher: function (item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase());
        },

        //  Sorts the results
        sorter: function (items) {
            var that = this,
                beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item;

            while (item = items.shift()) {
                if (!item[that.opts.display].toLowerCase().indexOf(this.query.toLowerCase())) {
                    beginswith.push(item);
                } else if (~item[that.opts.display].indexOf(this.query)) {
                    caseSensitive.push(item);
                } else {
                    caseInsensitive.push(item);
                }
            }

            return beginswith.concat(caseSensitive, caseInsensitive);
        },

        emailSource: function () {
            var that = this;

            that.query = that.$element.val();

            var user = that.query;
            var at;

            var index;
            if ((index = that.query.indexOf('@')) !== -1) {
                at = '';
                user = that.query.substring(0, index + 1);
            } else {
                at = '@';
                user = that.query;
            }

            var ret = [];
            for (var i = 0; i < that.opts.emailSource.length; i++) {
                ret.push({
                    id: i,
                    name: user + at + that.opts.emailSource[i]
                });
            }
            return ret;

        },

        //=============================================================================================================
        //
        //  DOM manipulation
        //
        //=============================================================================================================

        //  Shows the results list
        show: function () {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });

            this.$menu.css({
                top: pos.top + pos.height,
                left: pos.left
            });

            this.$menu.show();
            this.shown = true;

            return this;
        },

        //------------------------------------------------------------------
        //
        //  Hides the results list
        //
        hide: function () {
            this.$menu.hide();
            this.shown = false;
            return this;
        },

        //  Highlights the match(es) within the results
        highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
            });
        },

        //  Renders the results list
        render: function (items) {
            var that = this;

            var len = items.length;
            var html = '';
            for (var i = 0; i < len; i++) {
                var item = items[i];
                var ii = $(that.opts.item).attr('data-value', item[that.opts.val]);
                ii.find('a').html(that.highlighter(item[that.opts.display], item));
                var ret = ii[0];
                html += ret.outerHTML;
            }

            this.$menu.html(html);
            this.$menu.children().first().addClass('active');
            return this;
        },

        //  Item is selected
        select: function () {
            var $selectedItem = this.$menu.find('.active');
            this.$element.val($selectedItem.text()).change();
            this.opts.itemSelected($selectedItem, $selectedItem.attr('data-value'), $selectedItem.text());
            return this.hide();
        },

        //  Selects the next result
        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var next = active.next();

            if (!next.length) {
                next = $(this.$menu.find('li')[0]);
            }

            next.addClass('active');
        },

        //  Selects the previous result
        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }

            prev.addClass('active');
        },

        //  Events
        //=============================================================================================================

        //  Listens for user events
        _event: function () {
            this.$element.on('blur', $.proxy(this.blur, this))
                .on('keyup', $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keypress, this));
            } else {
                this.$element.on('keypress', $.proxy(this.keypress, this));
            }

            this.$menu.on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this));
        },

        //  Handles a key being raised up
        keyup: function (e) {
            e.stopPropagation();
            e.preventDefault();

            switch (e.keyCode) {
                case 40:
                // down arrow
                case 38:
                    // up arrow
                    break;
                case 9:
                // tab
                case 13:
                    // enter
                    if (!this.shown) {
                        return;
                    }
                    this.select();
                    break;
                case 27:
                    // escape
                    this.hide();
                    break;
                default:
                    this._lookup();
            }
        },

        //  Handles a key being pressed
        keypress: function (e) {
            e.stopPropagation();
            if (!this.shown) {
                return;
            }

            switch (e.keyCode) {
                case 9:
                // tab
                case 13:
                // enter
                case 27:
                    // escape
                    e.preventDefault();
                    break;
                case 38: // 方向键上
                    e.preventDefault();
                    this.prev();
                    break;
                case 40: // 方向键下
                    e.preventDefault();
                    this.next();
                    break;
            }
        },

        //  Handles cursor exiting the textbox
        blur: function (e) {
            var that = this;
            e.stopPropagation();
            e.preventDefault();
            setTimeout(function () {
                if (!that.$menu.is(':focus')) {
                    that.hide();
                }
            }, 150)
        },

        //  Handles clicking on the results list
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
        },

        //  Handles the mouse entering the results list
        mouseenter: function (e) {
            this.$menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        },

        reload: function () {
            this.this.source = this.userOptions.resource;
        }
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.attr('data-complete'),
                options = typeof option === 'object' && option;

            if (option.reset || !data) {
                $this.attr('data-complete', (data = new Complete(this, options)));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    //  Plugin definition
    $.fn.complete =Plugin;

    $.fn.complete.Constructor = Complete;

    window.UI = window.UI || {};
    window.UI.Complete = Complete;

    //  DOM-ready call for the Data API (no-JS implementation)
    //
    //  Note: As of Bootstrap v2.0 this feature may be disabled using $('body').off('.data-api') TODO
    //  More info here: https://github.com/twitter/bootstrap/tree/master/js
    //
    $(function () {
        $('body').on('focus.complete.data-api', '[data-provide="complete"]', function (e) {
            var $this = $(this);

            if ($this.data('complete')) {
                return;
            }

            e.preventDefault();
            $this.complete($this.data());
        })
    });

} (jQuery);
