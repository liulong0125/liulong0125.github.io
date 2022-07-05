---
layout: post
title: 取色器(ColorPicker) API
categories: [kindEditor]
tags: [kindEditor]
---

# [取色器(ColorPicker) API](http://kindeditor.net/docs/colorpicker.html#id1)

Contents

-   取色器(ColorPicker) API
    -   [K.colorpicker(options)](http://kindeditor.net/docs/colorpicker.html#k-colorpicker-options)



## [K.colorpicker(options)](http://kindeditor.net/docs/colorpicker.html#id2)

创建取色器。

-   -   参数:

        object options: 配置信息

-   返回: KColorPicker

-   继承: KWidget ( [K.widget(options)](http://kindeditor.net/docs/widget.html#k-widget) )

示例:

```
var colorpicker = K.colorpicker({
        x : 100,
        y : 200,
        z : 1000,
        selectedColor : 'default',
        click : function(color) {
                alert(color);
        }
});
```