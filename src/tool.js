/**
 * 小工具
 * Created by cjh1 on 2016/3/30.
 */

+function($) {
    'use strict';

    $(document).on('click', '[data-remove-target]', function(e) {
        var selector = $(this).data('remove-target');
        var $target = $(selector);

        if (e) {
            e.preventDefault();
        }

        $target.remove();
    });

    $(document).on('click', '[data-show-target]', function(e) {
        var selector = $(this).data('show-target');
        var $target = $(selector);

        if (e) {
            e.preventDefault();
        }

        $target.show();
    });

    $(document).on('click', '[data-hide-target]', function(e) {
        var selector = $(this).data('hide-target');
        var $target = $(selector);

        if (e) {
            e.preventDefault();
        }

        $target.hide();
    });

    $(document).on('click', '[data-toggle-target]', function(e) {
        var selector = $(this).data('toggle-target');
        var $target = $(selector);

        if (e) {
            e.preventDefault();
        }

        $target.toggle();
    });
}(jQuery);
