---
layout: post
title: 页面布局适配
categories: [javascript]
tags: [多端适配, rem, 响应式]
---

前端页面多端适配的方案有很多，常见的如：``bootstrap`` 框架、 ``rem`` 转换、 ``vw`` 转换、媒介查询、 ``transform: scale()`` 缩放。
> + ``rem`` 的模式如果给 ``html`` 设置一个 ``100px`` 可以直接内容手写 ``rem`` ，否则需要安装  ``px2rem-loader`` 辅助将 ``px`` 转换为  ``rem`` 。
+ ``vw`` 转换需要使用 ``px2vw-view-loader`` 将像素转换为 ``vw`` 单位。

# 页面布局适配

+ [transform: scale() 缩放](#transform-scale-缩放)




## transform: scale() 缩放
**缩小演示：UI 库弹层变化**

![page_layout_adaptation_03.gif](/static/img/pageLayoutAdaptation/page_layout_adaptation_03.gif)

**缩小演示：高度变化**

![page_layout_adaptation_04.gif](/static/img/pageLayoutAdaptation/page_layout_adaptation_04.gif)


**放大演示：UI 库弹层变化**

![page_layout_adaptation_05.gif](/static/img/pageLayoutAdaptation/page_layout_adaptation_05.gif)


**放大演示：高度变化**

![page_layout_adaptation_06.gif](/static/img/pageLayoutAdaptation/page_layout_adaptation_06.gif)

**放大演示：echarts清晰度变化**

![page_layout_adaptation_07.gif](/static/img/pageLayoutAdaptation/page_layout_adaptation_07.gif)


> + 布局优点：简单有效的等比缩小，可以解决 ``win10+`` 系统设置了文字放大后导致的页面布局空间变小的场景，比如设计稿为  ``1920px`` ，用户的电脑（系统为 ``win10+`` 配置了字体放大 ``150%`` ，此时页面的视口宽度会降低到 ``1280px`` 导致页面空间严重不足，即使使用了 ``flex`` 布局仍然空间不够用造成页面展示变形。
+ 布局遇到的问题：跟某些 ``css`` 动画的写法有冲突，导致应用了对应动画配置的模块字体模糊（可通过书写方式规避）。
+ 

**目录结构**

**\|--** ``/src/views/assest/css/layout.less`` - 样式配置。

**\|--** ``/src/views/utils/viewport.js`` - 缩放脚本。

**\|--** ``/src/main.js`` - 应用依赖收集入口。




**文件内容**

``/src/views/assest/css/layout.css``
```css
:root {
  --scale: 1;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background-color: violet;
}

#app {
  width: 1920px;
  height: 100%;
  background-color: #fff;
}


/* 重写 element-ui 的弹层样式（主要为了解决页面缩小后将弹层的缩放设置为和页面缩放同等大小）*/
.el-popper {
  transform-origin: 0 0 !important;
  transform: scale(var(--scale)) !important;
}
```
> + 声明 ``--scale`` 变量是为了重写 element-ui 的弹层样式（主要为了解决页面缩小后将弹层的缩放设置为和页面缩放同等大小）。




``/src/views/utils/viewport.js``
```javascript
// 节流函数 - 绑定窗口变动事件，避免频繁计算
export function throttle(method, context, THROTTLE_TIME = 300) {
  let arg = [].slice.call(arguments, 3);

  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
      method.apply(context, arg);
  }, THROTTLE_TIME);
}

const DEFAULT_ORIGINAL_WIDTH = 1920; // 原始设计稿宽
let scale = 1; // 缩放比例

// 获取视口对象
function getViewPort() {
  if (document.compatMode === 'CSS1Compat') {
      return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
      };
  } else {
      return {
          width: document.body.clientWidth,
          height: document.body.clientHeight
      };
  }
}

// 纵向缩放比例
function process() {
  const viewPort = getViewPort();
  const app = document.querySelector('#app');

  if (viewPort.width === 1920) {
      scale = 1;
      app.style.height =  '100%';
  } else {
      scale = viewPort.width / DEFAULT_ORIGINAL_WIDTH;

      /**
       * 1.反向设置 #app 元素的高度
       *   1.1 因为等比缩小放后会导致下方产生等比缩小后的留白需要抹平
       *   1.2 因为等比放大后会导致下方产生等比放大后的的高度溢出需要抹平
       ***/
      app.style.height = `${viewPort.height / scale}px`;
  }

  document.documentElement.style.setProperty('--scale', scale); // 用作第三方 ui 库修复弹层放大问题

  const cssOrigin = '0 0';
  const cssScale = `scale(${scale})`;

  app.style.webkitTransform = cssScale;
  app.style.mozTransform = cssScale;
  app.style.msTransform = cssScale;
  app.style.oTransform = cssScale;
  app.style.webkitTransformOrigin = cssOrigin;
  app.style.mozTransformOrigin = cssOrigin;
  app.style.msTransformOrigin = cssOrigin;
  app.style.oTransformOrigin = cssOrigin;
}

function resizeHandle() {
  throttle(process, null)
}

export function selfAdaptionEnable() {
  resizeHandle(); // 手动触发一次
  window.addEventListener('resize', resizeHandle, false);
}

export function selfAdaptionDisable() {
  window.removeEventListener('resize', resizeHandle, false);
}
```
> + **<font color=red>反向设置 #app 元素的高度，避免缩小留白和放大溢出。</font>**




``/src/main.js``
```javascript
import Vue from 'vue';
import router from '@/router';
import App from '@/App.vue';
import '@/assets/css/layout.css';

// UI 库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 自适应
import { selfAdaptionEnable, selfAdaptionDisable } from '@/utils/viewport.js';

Vue.use(ElementUI);

const app = new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App),
  mounted() {
      selfAdaptionEnable();
  },
  beforeDestroy() {
      selfAdaptionDisable();
  }
});

```

