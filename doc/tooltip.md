# Tooltip

## 参数

### animation

{boolean} 默认值：true。提示工具使用 CSS 渐变滤镜效果。


### html

{boolean}

默认值：false 

向提示工具插入 HTML。如果为 false，jQuery 的 text 方法将被用于向 dom 插入内容。如果您担心 XSS 攻击，请使用 text。


### placement

string|function

默认值：top

规定如何定位提示工具（即 top|bottom|left|right|auto）。

当指定为 auto 时，会动态调整提示工具。例如，如果 placement 是 "auto left"，提示工具将会尽可能显示在左边，在情况不允许的情况下它才会显示在右边。



### selector

string
默认值：false

如果提供了一个选择器，提示工具对象将被委派到指定的目标。



### title

string | function

默认值：''

如果未指定 title 属性，则 title 选项是默认的 title 值。



### trigger

string

默认值：'hover focus'

定义如何触发提示工具： click| hover | focus | manual。您可以传递多个触发器，每个触发器之间用空格分隔。



### content

string | function
默认值：''

如果未指定 data-content 属性，则使用默认的 content 值。


### delay

number | object
默认值：0

延迟显示和隐藏提示工具的毫秒数 - 对 manual 手动触发类型不适用。如果提供的是一个数字，那么延迟将会应用于显示和隐藏。如果提供的是对象，结构如下所示：

### delay:
{ show: 500, hide: 100 }


### container

string | false
默认值：false

向指定元素追加提示工具。
实例： container: 'body'


## 方法

### tooltip(options)

向元素集合附加提示工具句柄。


### tooltip('toggle')

切换显示/隐藏元素的提示工具。


### tooltip('show')

显示元素的提示工具。


### tooltip('hide')

隐藏元素的提示工具。


### tooltip('destroy')

隐藏并销毁元素的提示工具。

## 事件

### show.bs.tooltip

当调用 show 实例方法时立即触发该事件。


### shown.bs.tooltip

当提示工具对用户可见时触发该事件（将等待 CSS 过渡效果完成）。


### hide.bs.tooltip

当调用 hide 实例方法时立即触发该事件。

### hidden.bs.tooltip

当提示工具对用户隐藏时触发该事件（将等待 CSS 过渡效果完成）。

