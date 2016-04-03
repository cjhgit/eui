/**
 * Alert
 * v1.0.0
 *
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

+function ($) {
    'use strict';

    var dismiss = '[data-dismiss="alert"]';
    var SELECTOR_ALERT = '.eui-alert';
    var EVEMT_CLOSE = 'close.eui.alert';
    var EVEMT_CLOSED = 'closed.eui.alert';

    // ALERT CLASS DEFINITION
    var Alert = function (el) {
        $(el).on('click', dismiss, this.close)
    };

    Alert.VERSION = '3.3.6';

    Alert.TRANSITION_DURATION = 150;

    Alert.prototype.close = function (e) {
        var $this = $(this);
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        var $parent = $(selector);

        if (e) {
            e.preventDefault();
        }

        if (!$parent.length) {
            $parent = $this.closest(SELECTOR_ALERT);
        }

        $parent.trigger(e = $.Event(EVEMT_CLOSE));

        if (e.isDefaultPrevented()) {
            return;
        }

        $parent.removeClass('in');

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger(EVEMT_CLOSED).remove();
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement();
    };


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('eui.alert');

            if (!data) {
                data = new Alert(this);
                $this.data('eui.alert', data);
            }
            if (typeof option == 'string') {
                data[option].call($this)
            }
        })
    }

    var old = $.fn.alert;

    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old;
        return this;
    };


    // ALERT DATA-API
    // ==============

    $(document).on('click.eui.alert.data-api', dismiss, Alert.prototype.close);

}(jQuery);
