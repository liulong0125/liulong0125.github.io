---
layout: post
title: 常见的 npm 包收集
categories: [软件]
tags: [npm]
---

# npm

+ [element-resize-detector](#element-resize-detector)
+ [vue-grid-layout](#vue-grid-layout)
+ [vue-draggable](#vue-draggable)
+ [vue-ddompurify-html](#vue-ddompurify-html)
+ [思维导图](#思维导图)
+ [页面截图](#页面截图)
+ [地理信息服务](#地理信息服务)
+ [vue-esign](#vue-esign)
+ [sheetjs-style](#sheetjs-style)
+ [editormd](#editormd)
+ [vue-virtual-scroller](#vue-virtual-scroller)
+ [crypto-js](#crypto-js)




## element-resize-detector
可以监听元素尺寸变化进行回调函数绑定，如果是比较新的浏览器版本可以使用原生的 ``API`` [``ResizeObserver``](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 。




## vue-grid-layout
基于 Vue 开发环境的拖拽布局三方件。




## vue-draggable
基于 Vue 开发环境的拖拽三方件。



## vue-ddompurify-html
可以用来清理并渲染 HTML 字符串，以防止跨站脚本攻击（XSS）。




## 思维导图
目前收集的思维导图类的三方件 ``jsmind`` 、 ``vue-testcase-minder-editor`` 、  [``@antv/x6``](http://x6.antv.antgroup.com/examples) 、 ``@antv/g6`` 、 ``twaver`` 。




## 页面截图
常见的截图类的三方件 ``dom-to-image``、 ``dom-to-image-more`` 、  ``html2canvas`` 。
> 前两个插件在页面元素应用了 ``transform: scale(0.5)`` 缩放配置时仍然能有效截图。




## 地理信息服务
### Cesium
``Cesium`` 是一个开源的JavaScript库，用于创建基于地理空间数据的交互式三维地图应用程序，支持桌面端、web端、移动端等多平台。




### turf
``Turf`` 是用于空间分析的  ``JavaScript`` 库。它包括传统的空间操作、用于创建 ``GeoJSON`` 数据的辅助函数，以及数据分类和统计工具。
[``js`` 文件下载](https://unpkg.com/@turf/turf/turf.min.js)、[github](https://github.com/Turfjs/turf)
> + [地图区域合并demo](https://wuyunzhemu.github.io/demo-merge-map-areas/)
+ [地图区域合并demo讲解](https://juejin.cn/post/7082355815792771080)




### echarts
一个基于 JavaScript 的开源可视化图表库。
> [地理坐标/地图](https://echarts.apache.org/examples/zh/index.html#chart-type-map)





## vue-esign
 ``vue-esign`` 是一款专为 ``Vue.js`` 设计的电子签名组件，基于 ``HTML5canvas`` ，提供简单集成、流畅交互和高度可配置性，使用于在线合同签署等场景。




 ## sheetjs-style
 纯前端实现导出 ``excel`` 表格及自定义单元格样式。




## editormd
一款  ``markdown`` 编辑器。




## vue-virtual-scroller
对于大量数据的懒加载，我们可以使用虚拟滚动的技术。虚拟滚动的原理是只渲染可视区域内的数据，当用户滚动时，动态计算并渲染新的可视数据，从而实现大数据量的流畅滚动。





## crypto-js
常用的加密解密算法包。