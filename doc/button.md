# Button

## Class

 EUI 提供了一些选项来定义按钮的样式，具体如下表所示：

以下样式可用于<a>, <button>, 或 <input> 元素上：

```
.btn	为按钮添加基本样式	尝试一下
.btn-default	默认/标准按钮	
.btn-primary	原始按钮样式（未被操作）	
.btn-success	表示成功的动作	
.btn-info	该样式可用于要弹出信息的按钮	
.btn-warning	表示需要谨慎操作的按钮	
.btn-danger	表示一个危险动作的按钮操作	
.btn-link	让按钮看起来像个链接 (仍然保留按钮行为)	
.btn-lg	制作一个大按钮	
.btn-sm	制作一个小按钮	
.btn-xs	制作一个超小按钮	
.btn-block	块级按钮(拉伸至父元素100%的宽度)	
.active	按钮被点击	
.disabled	禁用按钮	
```

## Option

### loadingText

类型： String，默认值：‘加载中...’



## Method

### $(selector).button('toggle')

切换按钮状态。

### $(selector).button('loading')

该方法设置按钮状态为 loading - 即将按钮置为禁用状态并将文字内容切换为 loading。通过使用 'data-loading-text' 属性可以在按钮元素上定义 loading 文本。

### $(selector).button('reset')

该方法重置按钮状态，并将按钮上的文本还原为原始值。

### $(selector).button(string)

该方法重置按钮状态，并将按钮上的文本重置为传入的值。