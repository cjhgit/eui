/**
 * Created by cjh1 on 2016/8/3.
 */
$(document).ready(function() {
    $('.mycarousel').slider();

    function menuClick(id, e) {
        e.preventDefault();

        alert('点击了菜单' + id)
    };

    $('#card-example').card({
        full: true,
        tools: ['edit', 'move', 'refresh', 'full', 'min', 'menu', 'close'],
        menu: [{id:1, text:'菜单一', click: menuClick}, {id:2, text:'菜单二', click: menuClick}],
        menuCallback: menuClick,
        onRefresh: function () {
            alert('点击了刷新');
        }
    });
    $('#card2').card({
        tools: ['close'],
    });
    $('#card3').card({});

    // 按钮示例
    $('#test-btn').on('click', function() {
        $('#test-btn').button({
            loadingText: '发送中...'
        });
        $('#test-btn').button('loading');
        setInterval(function(){
            $('#test-btn').button('reset');
        }, 3000);
    });

    $('#test').button();

    // popover
    $('#show-qrcode').popover({
        html : true,
        title: function() {
            return '113';
        },
        content: function() {
            return $("#qrcode-demo").html();
            //return '456';
        }
    });

    $('#btn-tips-1').on('click', function () {

    });

    $('#btn-tips-1').on('mouseover', function () {
        eui.tips('Hi，我是tips', '#btn-tips-1');
    });

    // tip


    /*eui.tips('我是另外一个tips，只不过我长得跟之前那位稍有些不一样。', '#btn-tips-1', {
        tips: [1, '#3595CC'],
        time: 4000,
    });*/
});


$(document).ready(function() {

    $('#btn1').on('click', function() {
        eui.alert('内容', function () {
            eui.msg('hehe');
        });
        /*eui.confirm('你喜欢编程吗?', function(index) {
         eui.msg('你点了确定');
         }, function() {
         eui.msg('你点了取消');
         });*/
        /*eui.confirm('你喜欢编程吗?', {title:'提示'}, function(index){
         eui.close(index);
         });*/
        /*eui.alert('内容', {
         icon: 5,
         });*/
        /*eui.alert('内容', {
         title: '提示',
         btn: '我知道了'
         });*/
    });
    $('#alert-callback').on('click', function() {
        eui.alert('内容', function() {
            eui.alert('这是回调函数的内容');
        });
    });
    $('#btn2').on('click', function() {
        eui.msg('内容');
    });
    $('#btn-confirm').on('click', function() {
        eui.confirm('你喜欢编程吗?', {icon: 3, title:'提示'}, function(index){
            eui.close(index);
        });
    });
    $('#confirm-callback').on('click', function() {
        eui.confirm('你喜欢编程吗?', {icon: 3, title:'提示', btn: ['喜欢','不喜欢'] }, function(index){
            eui.msg('我也喜欢');
            eui.close(index);
        }, function(index) {
            eui.msg('为什么啊');
            eui.close(index);
        });
    });

    $('#btn-msg').on('click', function() {
        eui.msg('你好啊');
    });

    $('#btn-frame').on('click', function() {
        //iframe层
        eui.dialog({
            maxmin: true,
            type: 2,
            title: 'layer mobile页',
            shadeClose: true,
            shade: 0.8,
            area: ['380px', '90%'],
            content: 'http://layer.layui.com/mobile/' //iframe的url
        });
    });

    $('#btn-prompt').on('click', function() {
        eui.prompt({
            title: '输入任何口令，并确认',
            formType: 1 //prompt风格，支持0-2
        }, function(pass){
            eui.prompt({title: '随便写点啥，并确认', formType: 2}, function(text){
                eui.msg('演示完毕！您的口令：'+ pass +' 您最后写下了：'+ text);
            });
        });
        /*eui.load(4, {
         scrollbar: false,
         shadeClose: true,
         shade: [0.5, '#000'] //0.1透明度的白色背景
         });*/
    });

});
