# Selectable

## 介绍

类似 jQuery UI selectable 的小插件。

## Option

### item

selector，默认'.item'

可以选择的每一项


### activeClass

类型： String，默认： 'active'

选中项的样式


### selected

类型： Function，默认 function(event, item) {}

选中回调


### unselected

类型： Function，默认： function(event, item) {}

取消选中回调


## 方法

$(selector).selectable(option);
