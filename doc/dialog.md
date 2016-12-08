# Dialog

## 参数

### closeBtn 关闭按钮

类型：String/Boolean，默认：'icon icon-close' 

EUI 提供了两种风格的关闭按钮，可通过配置'icon icon-close'和'icon icon-close2'来展示，如果不显示，则closeBtn: false



### draggable - 拖拽

类型：Object | Boolean

默认：{ hander: '.dialog-header', containment: document }

### hander：允许拖拽的位置。

containment：限制拖拽范围

如果不允许拖拽，可设置成 false。

点击 这里 可以查看更多关于这个参数用法的介绍。



### title - 对话框标题

类型：String | Boolean

如果不需要显示标题，可设成 false。



### fix - 是否固定位置

类型： Boolean，默认：true。



### icon - 图标

类型：String | Boolean，默认： false

图标的样式类名，不需要显示图标可设成 false。



### maxWidth: 最大宽度。

类型：Number



### position - 位置

类型：Object，默认： { x: 'center', y: 'center' }

默认窗口水平居中和垂直居中，

如果要置于右下角，可设置成 { x: 'rightEdge', y: 'bottomEdge' }

点击 这里 可以查看更多关于这个参数用法的介绍。



### scrollbar - 是否允许浏览器滚动条

默认 false



### shade - 遮罩层

类型：Number | Boolean，默认0.3。

取值 0-1，表示遮罩层的透明度。

如果不需要遮罩层，可设成 false



### size - 宽高

类型：String/Array，默认：'auto'

在默认状态下，dialog是宽高都自适应的，但当你只想定义宽度时，你可以size: '500px'，高度仍然是自适应的。当你宽高都要定义时，你可以size: ['500px', '300px']。



### time - 自动关闭对话框时间

类型：Number，默认：0

单位毫秒。

0表示不自动关闭。



### yes - 确定按钮回调方法

类型：Function，默认：null

该回调携带两个参数，分别为当前层索引、当前层DOM对象。



### zIndex - 层级。

类型：Number



## Method

eui.alert(content, options, yes) - 普通信息框

eui.confirm(content, options, yes, cancel) - 询问框

eui.eui(content, options, end) - 提示框

eui.load(icon, options) - 加载层

eui.tips(content, follow, options) - tips层

eui.close(index) - 关闭特定层

eui.closeAll(type) - 关闭所有层

