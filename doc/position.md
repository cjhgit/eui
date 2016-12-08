# Position

## Description

eui-position 是一个元素定位插件，可以根据一个元素快速地定位另一个元素。


## 参数

### position

类型：String，默认 'absolute‘

'absolute'或'fixed'



### relativeTo： 相对元素

默认window

相对位置的元素，如document或者一个jQuery对象。


### x：水平位置

默认 'left'

取值'left'、'leftEdge'、'right', 'rightEdge'、'center'、'overlay



### y： 重置位置

默认 'top'

取值'top'、'topEdge'、'bottom'、'bottomEdge'、'center'、'overlay',



### z： z-index

默认 false

z：默认'auto'，值可以是'auto'或是一个数字。offsetX: 15



### offsetX

类型： Number，默认 0



### offsetY

类型： Number，默认0



### inBoundX: true,


inBoundY: true,

boundingBox: window,

includeMargin: false

$('#positionedBox').place('reset')// set options.place({relativeTo: document,x: 'leftEdge',y: 'overlay',boundingBox: document});

## 方法
