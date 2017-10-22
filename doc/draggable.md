# Draggable

## Description

一个类似 jQuery UI Draggable 的插件。


## 参数

### axis

类型： String，默认：'both'

取值：

'both'： 可上下左右移动
'x'： 只能左右移动
'y'：只能上下移动


### hander

类型：String | Boolean，默认： false

把柄元素，选择器，就是鼠标必须点击该元素才能实现拖拽，false 表示点击该元素的任意位置都可以实现拖拽功能。


### containment - 容器

类型： String | Array | Boolean，默认：false

containment可选值：'parent'、document、window、element、'selector'

设置改属性后，元素只能在容易里面移动。

.

### drag - 拖拽回调

类型： Function，默认： function(event, ui) {}

元素拖拽过程中，会不断回调该函数。



### start - 拖拽开始回调

类型： Function，默认： function(event, ui) {}

元素开始被拖拽时回调。


### stop - 拖拽结束回调

类型： Function，默认： function(event, ui) {}

元素停止拖拽时回调。


## 方法

### $(selector).draggable(option);

### disable

$(selector).draggable('disable');

### enable

$(selector).draggable('enable');


### destroy

$(selector).draggable('destroy');


