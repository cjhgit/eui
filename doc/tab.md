# Tab

## 方法

### $(selector).tab(options)	 

### $(selector).tab('show')	

显示tab的某一项，其中selector是nav-tabs里面的链接。

```
// 通过名称选取标签页
$('#myTab a[href="#profile"]').tab('show')

// 选取第一个标签页
$('#myTab a:first').tab('show')

// 选取最后一个标签页
$('#myTab a:last').tab('show')

// 选取第三个标签页（从 0 开始索引）
$('#myTab li:eq(2) a').tab('show')
```

## 参数

### interval

type: number	default: 5000

自动循环每个项目之间延迟的时间（毫秒）。如果为 false，轮播将不会自动循环。

### pause

type: String, default: hover

鼠标进入时暂停轮播循环，鼠标离开时恢复轮播循环。
wrap	boolean	true	轮播是否连续循环。

## 事件

### show.bs.tab

该事件在标签页显示时触发，但是必须在新标签页被显示之前。分别使用 event.target 和 event.relatedTarget 来定位到激活的标签页和前一个激活的标签页。

### shown.bs.tab

该事件在标签页显示时触发，但是必须在某个标签页已经显示之后。分别使用 event.target 和 event.relatedTarget 来定位到激活的标签页和前一个激活的标签页。

### hide.bs.show

该事件在标签页隐藏之前触发。

### hiden.bs.show

该事件在标签页隐藏之后触发。

## Example

例子

``` frame
<iframe width="100%" height="300" src="http://runcode.yunser.com/code/embed?id=1474342703" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
```