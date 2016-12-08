# Editor

## 介绍

eui-editor 是一个轻量的网页富文本编辑器。

## 开始使用

引入eui-editor.js 和 eui-editor.css。

使用
所有菜单：
```
[
        'source',
        '|',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        'emotion',
        '|',
        'img',
        'video',
        'location',
        'insertcode',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ];
```

## 方法

editor.command(e, 'insertHtml', linkHtml); 光标处插入HTML


editor.create()

创建编辑器

editor.disable()

禁用编辑器



**选区相关**

editor.getRangeText()

获取选中的纯文本。



editor.getRangeElem()

获取选区对应的DOM对象。



editor.isRangeEmpty()

选区内容是否为空。



**命令相关**

editor.queryCommandState(cmd)



editor.execCommand(cms)




```
// 初始化编辑器的内容
    editor.$txt.html('<p>要初始化的内容</p>');
editor.$txt.append('<p>新追加的内容</p>');
// 配置 onchange 事件
    editor.onchange = function () {
        // 编辑区域内容变化时，实时打印出当前内容
        console.log(this.$txt.html());
    };
```

