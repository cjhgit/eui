/**
 * 对话框插件
 *
 * v1.0.0
 */

if (!eui) {
    var eui = {};
}

eui.on = function (obj, event, func) {
    $(document).off(event, obj).on(event, obj, func);
};

eui.modaloptions = {
    id: 'bsmodal',
    close: true, // 是否显示关闭按钮
    title: 'title',
    showHeader: true, // 是否显示头部
    showFooter: true, // 是否显示脚部
    btn: false, // 是否显示两个按钮
    okbtn: '确定',
    qubtn: '取消',
    msg: '',
    backdrop: 'static'
};

eui.modalstr = function (opt) {
    var start = '<div class="modal fade" id="' + opt.id + '" style="position:fixed;top:20px;">';
    start += '<div class="modal-dialog"><div class="modal-content">';
    var end = '</div></div></div>';

    var head = '';
    if (opt.showHeader) {
        head += '<div class="modal-header">';
        if (opt.close) {
            head += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        }
        head += '<h3 class="modal-title" id="bsmodaltitle">' + opt.title + '</h3></div>';
    }

    var body = '<div class="modal-body"><p><h4>' + opt.msg + '</h4></p></div>';

    var foot = '';
    if (opt.showFooter) {
        foot += '<div class="modal-footer"><button type="button" class="btn btn-primary bsok">' + opt.okbtn + '</button>';
        if (opt.btn) {
            foot += '<button type="button" class="btn btn-default bscancel">' + opt.qubtn + '</button>';
        }
        foot += '</div>';
    }

    return start + head + body + foot + end;
};

eui.alert = function (options, func) {
    // options
    var opts = $.extend({}, eui.modaloptions);

    opts.title = '提示';
    opts.close = false;

    if (typeof options == 'string') {
        opts.msg = options;
    } else {
        $.extend(opts, options);
    }

    // add
    $('body').append(eui.modalstr(opts));

    // init
    var $modal = $('#' + opts.id);
    $modal.modal(opts);

    // bind
    eui.on('button.bsok', 'click', function () {
        if (func) {
            func();
        }
        $modal.modal('hide');
    });
    eui.on('#' + opts.id, 'hidden.bs.modal', function () {
        $modal.remove();
    });

    // show
    //$modal.modal();
};

eui.confirm = function (options, ok, cancel) {

    var opt = $.extend({}, eui.modaloptions);

    opt.title = '确认';
    opt.close = false;

    if (typeof options == 'string') {
        opt.msg = options;
    } else {
        $.extend(opt, options);
    }
    opt.btn = true;

    // 添加到body
    $('body').append(eui.modalstr(opt));

    // 初始化
    var $modal = $('#' + opt.id);
    $modal.modal(opt);

    // 绑定事件
    eui.on('button.bsok', 'click', function () {
        if (ok) {
            ok();
        }
        $modal.modal('hide');
    });
    eui.on('button.bscancel', 'click', function () {
        if (cancel) {
            cancel();
        }
        $modal.modal('hide');
    });
    eui.on('#' + opt.id, 'hidden.bs.modal', function () {
        $modal.remove();
    });

    // 显示
    $modal.modal('show');
};

eui.info = function (options, func) {
    // options
    var opts = $.extend({}, eui.modaloptions);

    opts.title = '提示';
    opts.close = false;
    opts.backdrop = true;

    if (typeof options == 'string') {
        opts.msg = options;
    } else {
        $.extend(opts, options);
    }

    // add
    $('body').append(eui.modalstr(opts));

    // init
    var $modal = $('#' + opts.id);
    $modal.modal(opts);

    // bind
    eui.on('button.bsok', 'click', function () {
        if (func) {
            func();
        }
        $modal.modal('hide');
    });
    eui.on('#' + opts.id, 'hidden.bs.modal', function () {
        $modal.remove();
    });

    // show
    //$modal.modal();
};
