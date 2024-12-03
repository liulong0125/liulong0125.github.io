---
layout: post
title: 响应式布局-媒介查询
categories: [css]
tags: [媒介查询]
---

媒体查询（Media queries）非常实用，尤其是当你想要根据设备的大致类型（如打印设备与带屏幕的设备）或者特定的特征和设备参数（例如屏幕分辨率和浏览器视窗宽度）来修改网站或应用程序时。[^1]

[^1]: [https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Using_media_queries](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Using_media_queries)

# 响应式布局-媒介查询
+ [页面配置](#页面配置)
+ [常见使用方式](#常见使用方式)
+ [常见媒体类型](#常见媒体类型)
+ [常见媒体规则](#常见媒体规则)
+ [逻辑操作符](#逻辑操作符)
+ [基于媒介查询的打印样式样例](#基于媒介查询的打印样式样例)
+ [名词](#名词)
    + [像素](#像素)
    + [分辨率](#分辨率)
    + [单位](#单位)




## 页面配置
```css
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<meta name="viewport" content="width=device-width, maximum-scale=3.0, minimum-scale=0.5" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /> 
/* 一般禁用页面缩放 */
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```
> + 设置 ``width=device-width`` 针对移动端浏览器生效，移动浏览器的视口宽度设置为移动浏览器厂商预设的宽度，以博主自己的手机为例：未设置的时候，打印 ``document.documentElement.clientWidth``（视口宽度） 为 980（这个值并不是物理分辨率的值，每个移动浏览器厂商内置的默认宽度都不一样，可以理解为``min-width``效果），设置后 ``document.documentElement.clientWidth`` 为 360（也是一个内置值），这样 12px 的字号在手机端查看就不会显得很小。
+ 个人手机的``window.devicePixelRatio``（设备像素比 - 物理分辨率与逻辑像素比，经过 ``width=device-width``设置后为 ``360``）为 2，查询手机参数分辨率为 720 * 1600，720 / 360 = 2。
+ ``window.screen.width`` 属性始终是 360，通过 ``window.screen.width * window.devicePixelRatio`` 可以得到屏幕的物理宽分辨率。
+ ``window.screen.height`` 属性始终是 800，通过 ``window.screen.width * window.devicePixelRatio`` 可以得到屏幕的物理高分辨率。




## 常见使用方式
```html
<!-- 方式一：样式表中使用 -->
<style type="text/css">
@media all and (min-width: 700px) and (orientation: landscape) {
    width: 100px;
}
</style>
<!-- 方式二：link标签中使用 -->
<link rel="stylesheet" media="screen and (min-width: 700px)" href="layout.css">
<!-- 方式三：css import 语法中使用 -->
<style>
@import url("layout.css") screen and (min-width: 700px);
</style>
```
> + ``min-width`` 数轴向右，e.g. ``min-width: 700px`` 表示数轴中从 700 开始往右的闭区间范围。``max-width`` 表示小于某一个范围的闭区间。




## 常见媒体类型
``all``、``print``、``screen``、``speech``，更多类型[^2]

[^2]: [https://drafts.csswg.org/mediaqueries/#media-type](https://drafts.csswg.org/mediaqueries/#media-type)




## 常见媒体规则
``min-width``、``min-height``、``max-width``、``max-height``、``width``、``height``、``device-aspect-ratio``、``orientation``、``min-resolution``，更多规则[^3]

[^3]: [https://drafts.csswg.org/mediaqueries/#media-feature](https://drafts.csswg.org/mediaqueries/#media-feature)




## 逻辑操作符
```css
/* and 操作符 */
@media (min-width: 700px) and (max-width: 800px) {
    .test {
        background-color: red;
    }
}

/* , 逗号操作符（逻辑和 css 的 "," 逗号操作符相同，版本 4 语法可以直接使用 or 操作符） */
@media (min-width: 700px), (max-width: 600px) {
    .test {
        background-color: orange;
    }
}

/* not 操作符 */
/* 和 and 操作一起使用时，是对整体的否定 */
@media not print and (min-width: 700px) {

}
/* 相当于： */
@media not (print and (min-width: 700px)) {
}


/* only 操作符 */
@media only screen and (min-width: 800px) {
    .test {
        background-color: blue;
    }
}
```
> + ``only``
    + 默认情况下，如果未指定其他类型，则使用all媒体类型。但是，如果使用not或only运算符，则必须显式指定媒体类型。
    + only关键字可防止不支持带有媒体功能的媒体查询的旧版浏览器应用给定的样式。它对现代浏览器没有影响。
+ ``not``和``,``逗号操作符一起使用时，只否定自己的部分。




## 基于媒介查询的打印样式样例
```css
@media print{
    *,*:before,*:after{
        background:transparent!important;
        color:#000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }
    a,a:visited{
        text-decoration: underline;
    }
    a[href]:after{
        content:"(" attr(href) ")";
    }
    abbr[title]:after{
        content:"(" attr(title) ")";
    }
    a[href^="#"]:after,a[href^="javascript:;"]:after{
        content:"";
    }
    pre,blockquote{
        border: 1px solid #999;
        /*只有opera浏览器起作用，避免在元素内部插入分页符*/
        page-break-inside:avoid;
    }
    thead{
        display:table-header-group;
    }
    tr,img{
        page-break-inside:avoid;
    }
    img{
        max-width:100%!important;
    }
    p,h2,h3{
        /*元素内部发生分页时，最少保留3行*/
        orphans:3;
        /*元素内部发生分页时，元素顶部最少保留3行*/
        windows:3;
    }
    h2,h3{
        /*避免在元素后面插入一个分页符*/
        page-break-after:avoid;
    }
}
```




## 名词
### 像素
px(pixed)位图的组成的最小单位。

![01](/static/img/mediaQuery/01.jpg)
> + 图片分类：位图、矢量图。
    + 位图简单理解是由一个一个不同颜色的像素点构成的图片。
    + 矢量图简单理解就是由 xml 文件配置了路径、描述、填充色组成的图片，不涉及分辨率概念，可以无限放大不失真。

### 分辨率
![02](/static/img/mediaQuery/02.jpg)

**显示分辨率**：ppi（像素每英寸），显示设备使用的单位，媒介查询的 ``screen`` 媒体类型（上图是显示分辨率的图）。

**打印分辨率**：dpi（点每英寸），打印设备使用的单位，媒介查询的 ``print`` 媒体类型。

> + 平常所说的屏显设备的分辨率 1920 * 1080 严格意义上讲，不属于分辨率范畴，率这个词大家熟知的 e.g. 速率、心率是一种（时间）单位的描述（1000转/分，80次/分），分辨率指的是1英尺所展示的像素点的个数，不过平常习惯了说分辨率多少乘多少，也都能理解所表述的意思（一个有趣的现象，win7 系统的时候，图片的分辨率描述还是严格意义上的值，到了 win10 就把分辨率的值使用宽高属性描述了，也就是大家口中常说的 xxx * xxx 的形式了）见下图：<br />![04](/static/img/mediaQuery/04.jpg)<br />
**<font color=red>注：</font>**一般显示设备上图片的分辨率（严格意义上的分辨率）信息并不重要，重要的是像素也就是 xxx * xxx 的值才重要，e.g. 使用 a.jpg（96分辨率）的图片作为基础版本，使用其创建（借助 phothoshop 软件）一个分辨率 50 的 b.jpg 以及分辨率 200 的 c.jpg 这 3 个图片在显示设备上没有任何区别，如下图：<br />
![05](/static/img/mediaQuery/05.jpg)<br />
![07](/static/img/mediaQuery/07.jpg)<br />
![06](/static/img/mediaQuery/06.jpg)<br />
也就是说，图片的分辨率（严格意义的分辨率）在不涉及打印的前提下，不用太在意。
+ 题外话，当我们需要打印一张 A4 纸大小的图片的时候，创建画板宽：``210mm`` 高 ``297mm``（印刷尺 ``A4`` 高度为  ``285mm`` )，这个时候显示分辨（``ppi``）会设置为``300``，因为最终要打印，打印机的打印分辨率``dpi``是``300``，如果显示分辨率设置的远小于打印分辨率(``dpi``)，会造成图片模糊，如下：<br />![03](/static/img/mediaQuery/03.jpg)


## 单位
1英寸 = 2.54厘米。
1磅(pt) = 1/72英寸
**<font color=red>1英寸(in) = 96像素(px)</font>**
> + css 的单位有逻辑单位 px，也有物理度量单位 in、cm、mm等，对于显示设备专门设置了一个逻辑单位和实际物理单位之间的一个转换锚定值[^4]：1in = 96px，看起来挺不可思议的将逻辑单位与物理度量单位进行了转换定义，是的没有为什么这就是行业标准，这样就意味着虽然存在物理单位，但是我们在显示设备上没法通过物理单位 e.g.  ``font-size: 1in`` 定义出来一个实实在在高 ``1in`` 的字号，因为锚定的关系存在，这个字号实际上和 ``font-size: 96px`` 的使用逻辑单位的字是一样大的。<br />![08](/static/img/mediaQuery/08.jpg)<br />
+ 题外话：1in = 96px，20in = 1920px，所以只要是 1920 * xxx 的分辨率屏，20in 就能把屏幕铺满了。


[^4]: [https://developer.mozilla.org/zh-CN/docs/Web/CSS/length](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)