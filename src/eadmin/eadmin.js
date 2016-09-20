/**
 * eAdmin 后台插件
 */
window.eadmin = {
    version: '1.0.0'
};

/**
 * Bootstrap 侧栏菜单组件
 * 修改自：metisMenu
 */

/*
 show.metisMenu
 shown.metisMenu
 hide.metisMenu
 hidden.metisMenu

 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.sortable = factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';

    function transitionEnd() {
        var el = document.createElement('mm');

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                };
            }
        }
        return false;
    }

    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('mmTransitionEnd', function () {
            called = true;
        });
        var callback = function () {
            if (!called) {
                $($el).trigger($transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    var $transition = transitionEnd();
    if (!!$transition) {
        $.event.special.mmTransitionEnd = {
            bindType: $transition.end,
            delegateType: $transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) {
                    return e.
                        handleObj.
                        handler.
                        apply(this, arguments);
                }
            }
        };
    }

    var SideMenu = function (element, options) {
        this.$element = $(element);
        this.opts = $.extend({}, SideMenu.DEFAULTS, options);
        this.transitioning = null;

        this.init();
    };

    SideMenu.TRANSITION_DURATION = 350;

    SideMenu.DEFAULTS = {
        toggle: true, // 是否不允许同时打开多个菜单项
        doubleTapToGo: false, // 点击已打开的菜单项，是否不关闭该菜单项
        preventDefault: true,
        activeClass: 'active',
        collapseClass: 'collapse',
        collapseInClass: 'in',
        collapsingClass: 'collapsing',
        onTransitionStart: false, // 菜单动画开始回调
        onTransitionEnd: false // 菜单动画结束回调
    };

    SideMenu.prototype.init = function () {
        var $this = this;
        var activeClass = this.opts.activeClass;
        var collapseClass = this.opts.collapseClass;
        var collapseInClass = this.opts.collapseInClass;

        this
            .$element
            .find('li.' + activeClass)
            .has('ul')
            .children('ul')
            .attr('aria-expanded', true)
            .addClass(collapseClass + ' ' + collapseInClass);

        this
            .$element
            .find('li')
            .not('.' + activeClass)
            .has('ul')
            .children('ul')
            .attr('aria-expanded', false)
            .addClass(collapseClass);

        //add the 'doubleTapToGo' class to active items if needed
        if (this.opts.doubleTapToGo) {
            this
                .$element
                .find('li.' + activeClass)
                .has('ul')
                .children('a')
                .addClass('doubleTapToGo');
        }

        this
            .$element
            .find('li')
            .has('ul')
            .children('a')
            .on('click.metisMenu', function (e) {
                var self = $(this);
                var $parent = self.parent('li');
                var $list = $parent.children('ul');
                if ($this.opts.preventDefault) {
                    e.preventDefault();
                }
                if (self.attr('aria-disabled') === 'true') {
                    return;
                }
                if ($parent.hasClass(activeClass) && !$this.opts.doubleTapToGo) {
                    $this.hide($list);
                    self.attr('aria-expanded', false);
                } else {
                    $this.show($list);
                    self.attr('aria-expanded', true);
                }

                if ($this.opts.onTransitionStart) {
                    $this.opts.onTransitionStart();
                }

                //Do we need to enable the double tap
                if ($this.opts.doubleTapToGo) {
                    //if we hit a second time on the link and the href is valid, navigate to that url
                    if ($this.doubleTapToGo(self) && self.attr('href') !== '#' && self.attr('href') !== '') {
                        e.stopPropagation();
                        document.location = self.attr('href');
                        return;
                    }
                }
            });
    };

    SideMenu.prototype.doubleTapToGo = function (elem) {
        var $this = this.$element;
        //if the class 'doubleTapToGo' exists, remove it and return
        if (elem.hasClass('doubleTapToGo')) {
            elem.removeClass('doubleTapToGo');
            return true;
        }
        //does not exists, add a new class and return false
        if (elem.parent().children('ul').length) {
            //first remove all other class
            $this
                .find('.doubleTapToGo')
                .removeClass('doubleTapToGo');
            //add the class on the current element
            elem.addClass('doubleTapToGo');
            return false;
        }
    };

    SideMenu.prototype.show = function (el) {
        var activeClass = this.opts.activeClass;
        var collapseClass = this.opts.collapseClass;
        var collapseInClass = this.opts.collapseInClass;
        var collapsingClass = this.opts.collapsingClass;
        var $this = $(el);
        var $parent = $this.parent('li');
        if (this.transitioning || $this.hasClass(collapseInClass)) {
            return;
        }

        $parent.addClass(activeClass);

        if (this.opts.toggle) {
            this.hide($parent.siblings().children('ul.' + collapseInClass).attr('aria-expanded', false));
        }

        $this
            .removeClass(collapseClass)
            .addClass(collapsingClass)
            .height(0);

        this.transitioning = 1;
        var complete = function () {
            if (this.transitioning && this.opts.onTransitionEnd) {
                this.opts.onTransitionEnd();
            }
            $this
                .removeClass(collapsingClass)
                .addClass(collapseClass + ' ' + collapseInClass)
                .height('')
                .attr('aria-expanded', true);
            this.transitioning = 0;
        };
        if (!$transition) {
            return complete.call(this);
        }
        $this
            .one('mmTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(SideMenu.TRANSITION_DURATION)
            .height($this[0].scrollHeight);
    };

    SideMenu.prototype.hide = function (el) {
        var activeClass = this.opts.activeClass;
        var collapseClass = this.opts.collapseClass;
        var collapseInClass = this.opts.collapseInClass;
        var collapsingClass = this.opts.collapsingClass;
        var $this = $(el);

        if (this.transitioning || !$this.hasClass(collapseInClass)) {
            return;
        }

        $this.parent('li').removeClass(activeClass);
        $this.height($this.height())[0].offsetHeight;

        $this
            .addClass(collapsingClass)
            .removeClass(collapseClass)
            .removeClass(collapseInClass);

        this.transitioning = 1;

        var complete = function () {
            if (this.transitioning && this.opts.onTransitionEnd) {
                this.opts.onTransitionEnd();
            }
            this.transitioning = 0;
            $this
                .removeClass(collapsingClass)
                .addClass(collapseClass)
                .attr('aria-expanded', false);
        };

        if (!$transition) {
            return complete.call(this);
        }
        $this
            .height(0)
            .one('mmTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(SideMenu.TRANSITION_DURATION);
    };

    SideMenu.prototype.hideAll = function () {

        var $list = this.$element.find('li.active').children('ul');
        this.hide($list);
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('mm');
            var options = $.extend({},
                SideMenu.DEFAULTS,
                $this.data(),
                typeof option === 'object' && option
            );

            if (!data) {
                $this.data('mm', (data = new SideMenu(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    var old = $.fn.sideMenu;

    $.fn.sideMenu = Plugin;
    $.fn.sideMenu.Constructor = SideMenu;

    $.fn.sideMenu.noConflict = function () {
        $.fn.sideMenu = old;
        return this;
    };
}));

/**
 * 主题
 */
;(function ($) {
    eadmin.theme = function (theme) {
        $body = $(document.body);
        var oldTheme = $body.data('theme');
        if (oldTheme) {
            $body.removeClass('theme-' + oldTheme);
        }
        $body.data('theme', theme);
        $body.addClass('theme-' + theme);
    };
})(jQuery);

/**
 * Created by cjh1 on 2016/3/25.
 */

$(document).ready(function(){

    $('#theme-blue').on('click', function(e){
        e.preventDefault();

        eadmin.theme('blue');
    });

    $('#theme-green').on('click', function(e){
        e.preventDefault();

        eadmin.theme('green');
    });

    $('#theme-default').on('click', function(e){
        e.preventDefault();

        eadmin.theme('default');
    });



    // 固定宽度
    $('#wrap-check').on('click', function () {
       $(document.body).addClass('fixed-width');
    });

    var menuState = 1; // 菜单状态（1显示，2缩进，3隐藏）
    $('#menu').sideMenu({
        toggle: true,
        onTransitionStart: function(){
            if (menuState !== 1) {
                showMenu();
            }
        },
        onTransitionEnd: function(){
            //alert('onTransitionEnd');
        }
    });
    /*
     .on('show.metisMenu', function(event) {

     // do something…

     }
     */
    function showMenu() {
        $('#sidebar').slimScroll({destroy: true});

        $sidebar = $('.esidebar');

        if (!$sidebar.hasClass('emenu-min')) {
            return;
        }

        $sidebar.toggleClass('emenu-min');

        $sidebar.css('opacity',.5);
        $sidebar.animate(
            {
                width: '220px',
                opacity: 1
            },
            400,
            function () {
                console.log($(window).height());
                $('#sidebar').slimScroll({
                    width: $('#sidebar').width(),
                    height: $(window).height(),
                });
            }
        );

        $('.econtent').animate(
            {'left': '220px'},
            400
        );
        menuState = 1;
    }

    function minMenu() {
        $('#sidebar').slimScroll({destroy: true});

        $sidebar = $('.esidebar');

        if ($sidebar.hasClass('emenu-min')) {
            return;
        }

        $sidebar.toggleClass('emenu-min');

        $sidebar.css('opacity',.5);
        $sidebar.animate(
            {
                width: '70px',
                opacity: 1
            },
            400,
            function() {
                $('#sidebar').slimScroll({
                    width: $('#sidebar').width(),
                    height: $(window).height(),
                });
            }
        );
        $('.econtent').animate(
            {'left': '70px'},
            400
        );
        menuState = 2;
    }

    function hideMenu() {
        $('#sidebar').slimScroll({destroy: true});

        $sidebar = $('.esidebar');
        $sidebar.toggleClass('emenu-min');

        $sidebar.css('opacity',.5);
        $sidebar.animate(
            {
                width: '0px',
                opacity: 1
            },
            400,
            function() {
                $('#sidebar').slimScroll({
                    width: $('#sidebar').width(),
                    height: $(window).height(),
                });
            }
        );
        $('.econtent').animate(
            {'left': '0px'},
            400
        );
        menuState = 3;
    }

    $('#menu-minimalize').on('click', function(){

        if (menuState === 1) {
            if ($(window).width() > 400) {
                minMenu();
            } else {
                hideMenu();
            }
        } else {
            showMenu();
        }
    });

    $(window).resize(function() {
        var windowWidth = $(window).width();
        if (windowWidth < 400) {
            hideMenu();
        } else if (windowWidth < 768) {
            minMenu();
        } else {
            //showMenu();
        }
    });

    // 滚动条美化
    $('#sidebar').slimScroll({
        width: $('#sidebar').width(),
        height: $(window).height(),
    });

    $('#chat-box').hide();
    $('#chat-box-toggle').on('click', function() {
        $('#chat-box').toggle();
    });

    $(document.body).css('overflow', 'hidden');

    $('#theme').on('click', function() {
        $('#side-setting').toggle();
    })
});
