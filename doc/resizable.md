# Resizable            

## 说明

eui-resizable 是一个元素拖拽插件，类似 jQuery-UI resizable的接口设计。

## 选项

handles

默认：*

List of handles to support. Valid handles:&nbsp;`s`,&nbsp;`se`,&nbsp;`e`,&nbsp;`ne`,&nbsp;`n`,&nbsp;`nw`,&nbsp;`w`,&nbsp;`sw`. May be specified as an object, array, or comma-separated string.

resize

默认：<span style="background-color: transparent;">undefined</span>

Resize&nbsp;event&nbsp;handler.

threshold

默认：10

A&nbsp;movement&nbsp;threshold&nbsp;required&nbsp;to&nbsp;start&nbsp;resize&nbsp;-&nbsp;whether&nbsp;array,&nbsp;number&nbsp;or&nbsp;function.

maxHeight - 最大高度

类型：Number、Boolean，默认：false

maxWidth - 最大宽度

类型：Number、Boolean，默认：false

minHeight - 最小高度

类型：Number、Boolean，默认：0

minWidth - 最小宽度

类型：Number、Boolean，默认：0

within

默认：<span style="background-color: transparent;">document</span>

Restrict&nbsp;movement&nbsp;within&nbsp;the&nbsp;container.&nbsp;Pass&nbsp;'parent'&nbsp;to&nbsp;take&nbsp;parent&nbsp;node.

draggable

默认：<span style="background-color: transparent;">false</span>

Make element&nbsp;<span>draggable</span>&nbsp;<span style="background-color: transparent;">as well. Set an object to pass options to draggable.</span>
<div>
</div>

resize - 拖拽回调

类型： Function，默认：&nbsp;function(event,&nbsp;ui)&nbsp;{}

元素拖拽过程中，会不断回调该函数。

start - 拖拽开始回调

类型： Function，默认：&nbsp;function(event,&nbsp;ui)&nbsp;{}

元素开始被拖拽时回调。

stop - 拖拽结束回调

类型： Function，默认：&nbsp;function(event,&nbsp;ui)&nbsp;{}

元素停止拖拽时回调。

## 事件

resize

Element&nbsp;resized.&nbsp;Called&nbsp;on&nbsp;self.

                        