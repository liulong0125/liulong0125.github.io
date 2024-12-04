---
layout: post
title: css 过渡、动画及转换
categories: [css]
tags: [css 动画]
---

本篇主要介绍与实现``css`` 动画相关的 3 个概念：过渡、动画及转换。

# css 动画与转换

+ [过渡](#过渡)
  + [过渡的拆分写法](#过渡的拆分写法)
  + [过渡的简写法](#过渡的简写法)
  + [缓动类型](#缓动类型)
  + [贝塞尔曲线](#贝塞尔曲线)
  + [过渡事件](#过渡事件)
    + [事件分类](#事件分类)
    + [切换过渡](#切换过渡)
+ [动画](#动画)
  + [关键帧](#关键帧)
  + [动画的拆分写法](#动画的拆分写法)
  + [动画的简写法](#动画的简写法)
  + [animation-fill-mode](#animation-fill-mode)
  + [animation-direction](#animation-direction)
  + [animation-iteration-count](#animation-iteration-count)
  + [animation-play-state](#animation-play-state)
+ [转换](#转换)
  + [预备知识](#预备知识)
  + [平移](#平移)
  + [缩放](#缩放)
  + [旋转](#旋转)
  + [斜切](#斜切)
  + [使用 matrix 实现镜像效果](#使用-matrix-实现镜像效果)
  + [多值书写](#多值书写)




## 过渡
过渡可以为一个元素在不同状态之间切换的时候定义不同的过渡效果。比如在不同的伪元素之间切换，像是 ``:hover`` ， ``:active`` 或者通过 ``JavaScript`` 实现的状态变化。

### 过渡的拆分写法

```html
<!-- css -->
<style>
    /**
    * @note: 过度
    * @tip: 注意事项 
    *      1. transition: 属性 持续时间 缓动函数 延迟
    *          1.1 属性： 特殊值 "all", 单个去写时需要设置","分割
    *          1.2 持续时间 & 延迟： 单位都是 "s"
    *          1.3 通过添加和删除 class 类来实现
    *          1.4 依赖 position 属性的动画，需要有初始值，否则不会产生动画
    * */
    #transition {
        position: relative;left: 0;
        width: 50px;height: 50px;
        font-size: 40px;line-height: 50px;text-align: center;
        background-color: blue;
        /* transition-property: all; */
        transition-property: left, width, background-color;
        transition-duration: 1s;
        transition-timing-function: ease-in;
        transition-delay: 0s;
    }
    #transition.transition {
        width: 100px;background-color: green;
        left: 200px;
    }
</style>
<!-- html -->
<div id="transition">A</div>
<!-- js -->
<script>
    setTimeout(() => {
        $('#transition').addClass('transition');    
    }, 1000);
</script>
```




### 过渡的简写法
```html
<!-- css -->
<style>
    /**
    * @note: 动画
    * @tip: 注意事项 
    *      1. 属性和书写 css 时保持一致，不能使用驼峰格式; eg: background-color
    *      2. 多个属性使用 "," 逗号进行分割
    *      3. 多属性时，最后一个属性一定要有","逗号，否则会不生效
    * */
    #transition {
        position: relative;left: 0;
        width: 50px;height: 50px;
        background-color: red;
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
        /* 多个属性触发条件一致 */
        /* transition: left, width, background-color, 3s; */
        /* 多个属性触发条件不一致时需要单独书写 */
        transition: left 1s, width 3s, background-color 5s;
    }
    #transition.transition {
        left: 200px;width: 100px;height: 100px;background-color: green;
    }
</style>
<!-- html -->
<div id="transition">A</div>
<!-- js -->
<script>
    setTimeout(() => {
        $('#transition').addClass('transition');    
    }, 1000);
</script>
```
> + **<font color=red>注：</font>**多属性时，每个属性都要单独写，后面的使用 "," 逗号进行分割。




### 缓动类型
``transition-timing-function: linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n, n, n, n);``
> + **<font color=red>注：</font>**使用 ``cubic-bezier`` 贝塞尔曲线时，第 1 个和第 3 个参数的取值范围在 0 ~ 1 之间。




### 贝塞尔曲线
![css_animate_01.jpg](/static/img/cssAnimate/css_animate_01.jpg)
> + ``P1`` & ``P2`` 点的 ``x`` 坐标必须在 ``[0, 1]`` 闭区间范围内，``y`` 坐标无限制； ``P1`` & ``P2`` 点的坐标:  ``cubic-bezier(P1x, P1y, P2x, P2y);`` e.g.  ``cubic-bezier(0.68, -0.55, 0.27, 1.55);``。
+ 贝塞尔曲线调试，通过控制台的样式操作面板进行调试：<br />![css_animate_02.jpg](/static/img/cssAnimate/css_animate_02.jpg)




### 过渡事件
#### 事件分类
过渡事件有 3 种：``transitionstart`` 、 ``transitionrun`` 、 ``transitionend`` 。
```html
<!-- css -->
<style>
    /**
    * @note: 事件
    * @tip: 注意事项 
    *      1. 每个属性都会触发一次事件
    *      2. 目前 transitionend 兼容性还可以, transitionend 事件触发结束前移除事件不会再触发
    *      3. 兼容性写法： webkitTransitionEnd、mozTransitionEnd、webkitTransitionEnd 、oTransitionEnd; 兼容性下发需要使用驼峰方式
    * */
    #transition {
        position: relative;left: 0;
        width: 50px;height: 50px;
        background-color: red;
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
        transition: left 1s, width 3s, height 5s, background-color 7s;
    }
    #transition.transition {
        left: 200px;width: 100px;height: 100px;background-color: green;
    }
</style>
<!-- html -->
<div id="transition">A</div>
<!-- js -->
<script>
    $('#transition').bind('transitionend transitionstart transitionrun', e => {
        // 每一个属性都会触发该事件, 会触发四次
        console.log(e.type);
    });
    
    // 事件在触发前解除绑定不会再触发
    setTimeout(() => {
        $('#transition').unbind('transitionend transitionstart transitionrun');
    }, 2000);

    setTimeout(() => {
        $('#transition').addClass('transition');
    }, 1000);
</script>
```
> + **<font color=red>注：</font>**1. 每一个属性都会触发该事件, 会触发四次；2. 事件在触发前解除绑定不会再触发。




#### 切换过渡
```html
<!-- css -->
<style>
    /**
      * @note: 事件
      * @tip: 注意事项 
      *      1. 通过类名切换时不会卡顿
      *      2. 动画的没次剩余运行时间都是根据当前的状态来决定，而非增加删除时从 0 开始
      * */
    #transition {
      position: relative;left: 0;
      width: 50px;height: 50px;
      background-color: red;
      font-size: 40px;line-height: 50px;text-align: center;color: #fff;
      background-color: green;
      transition: left 10s ease 0s;
    }
    #transition.transition {
      left: 200px;
    }
</style>
<!-- html -->
<div id="transition">A</div>
<!-- js -->
<script> 
let $transition = $('#transition');

$transition.bind('webkitTransitionEnd transitionend',function(){
    console.log('transitionend');
});

setTimeout(() => {
  $transition.addClass('transition');
  setTimeout(() => {
    $transition.removeClass('transition');
    setTimeout(() => {
        $transition.addClass('transition');
    }, 1000);
  }, 5000);
}, 1000);
</script>
```

> + 以上实例中多次移除和添加过渡类名，只会触发一次 ``transitionend`` 事件。
+ 动画的每次剩余运行时间都是根据当前的状态来决定，而非增加删除时从 0 开始（比如说动画时长 ``10s`` , 运行到第 ``5s`` 时移除了 ``class`` , 这时元素会反向运行, 过了一秒后又添加上了 ``class`` 这时运行时长就只有 ``6s`` ）。






## 动画
``animation`` 属性用来指定一组或多组动画，每组之间用逗号相隔。

### 关键帧
```html
<!-- css -->
<style>
    @keyframes flash {
      from, 40% {
          margin-top: 0;
      }

      to, 60% {
          margin-top: 100px;
      }
    }

    .animation {
      animation: flash 10s linear 0s infinite alternate both;
    }

    .animation-alternate-reverse {
      animation-direction: alternate-reverse;
    }

    .test {
      float: left;
      width: 100px;height: 100px;background-color: silver;
    }
</style>
<!-- html -->
<div class="test animation"></div>
<div class="test animation animation-alternate-reverse"></div>
```




### 动画的拆分写法

```css
/* 关键类定义 */
.flash {
  -webkit-animation-name: flash;
	animation-name: flash;
  -webkit-animation-direction: alternate;
  animation-direction: alternate;
}

/* 运动属性定义 */
.animated {
  -webkit-animation-duration: 10s;
  animation-duration: 10s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

/* 重复次数 */
.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

/* 交替 */
.animated.alternate-reverse {
  -webkit-animation-direction: alternate-reverse;
  animation-direction: alternate-reverse;
}
```



#### 动画的简写法

```css
.animation {
  animation: flash 10s linear 0s infinite alternate both;
}
```




### animation-fill-mode
1.  ``none`` :  动画结束后恢复最初的样子(默认值)。
2.  ``forwards`` : 动画结束应用最后一帧的样式。
3.  ``backwards`` : 动画结延迟开始时，应用第一帧的样式。
4.  ``both`` : 同时应用 2 & 3。



### animation-direction
1.  ``normal`` : ``from - to`` 运行。
2.  ``reverse`` : ``to - from`` 运行。
3.  ``alternate`` : 交替运行(在运行次数大于 1 时才能体现出来)。
4.  ``alternate-reverse`` : 交替运行 `` to - from`` (在运行次数大于 1 时才能体现出来)。




### animation-iteration-count
1. ``number`` : 支持 0，以及 浮点数，e.g. 0.5 就是只运动动画的一般；支持特殊值 ``infinite`` 表示无限循环。




### animation-play-state
1. ``paused`` : 暂停。
2.  ``running`` : 运行。




## 转换
``CSS`` 的 ``transform`` 属性允许你旋转、缩放、倾斜或平移给定元素。这是通过修改 ``CSS`` 视觉格式化模型的坐标空间实现的。

### 预备知识
**矩阵**

![css_animate_03.jpg](/static/img/cssAnimate/css_animate_03.jpg)
> + 矩阵相乘，第一项的行与第二项的列相乘，``x``  轴坐标为 ``x = ax + cy +e;``， ``y`` 轴坐标为 ``y = bx + dy +f;``。 

**几何性质**

![css_animate_04.jpg](/static/img/cssAnimate/css_animate_04.jpg)


### 平移
1.  ``x = ax + cy + e;``  当  ``a = 1``; ``c = 0`` ; 即可满足： ``x = x + e`` 。
2.  ``y = bx + dy + f;`` 当 ``b = 0`` ; ``d = 1`` ; 即可满足：  ``y = y + f`` 。

```html
<!-- css -->
<style>
    /**
      * @note: 平移
      *      1. 等效矩阵: transform: matrix(a, b, c, d, e, f);
      * @tip: 注意事项
      *      1. 可单独书写: transform: translateX(100px); transform: translateY(100px)
      *      2. matrix 的单位只能是数值
      * */
    #transform-translate {
        width: 50px;height: 50px;
        background-color: red;
        /*transform: translate(100px, 100px);*/
        transform: matrix(1, 0, 0, 1, 100, 100);
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
    }
</style>
<!-- html -->
<div id="transform-translate">A</div>
```
> + **<font color=red>matrix 的不能带单位只能是数值</font>**

 


### 缩放
1.  ``x = ax + cy + e`` ; 当 ``a = (0, ∞)``; ``c = 0`` ; 即可满足： ``x = ax + e`` ;
2.  ``y = bx + dy + e`` ; 当 ``d = (0, ∞)`` ; ``b = 0`` ; 即可满足： ``y = dy + f`` ;

```html
<!-- css -->
<style>
    /**
    * @note: 缩放
    *      1. 等效矩阵： matrix(a, b, c, d, e, f);
    * @tip: 注意事项
    *      1. 单独书写： transform: scaleX(4)；transform: scaleY(4)
    *      2. 合并书写：transform: scale(4, 4);
    *      3. matrix & scale 单位只能是数值
    * */
    #transform-scale {
        margin: 100px;
        width: 50px;height: 50px;
        background-color: red;
        transform: scale(4, 4);
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
    }
</style>
<!-- html -->
<div id="transform-scale">A</div>
```
> + **<font color=red>注：</font>** ``matrix`` & ``scale`` 只能为数值




### 旋转
![css_animate_05.jpg](/static/img/cssAnimate/css_animate_05.jpg)

**三角函数**
1.  ``cos(A + B) = cosAcosB - sinAsinB`` 【X 轴】
2.  ``cos(A - B) = cosAcosB + sinAsinB`` 
3.  ``sin(A + B) = sinAcosB + cosAsinB`` 【Y 轴】
4.  ``sin(A - B) = sinAcosB + cosAsinB`` 
> + ``A`` 为原始角度， ``B`` 为增加角度； ``X`` 轴变换为 ``X = xcosB - ysinB`` , 水平轴为第一个三角函数 ``cosθ`` ； ``Y`` 轴变换为 ``Y = ycosB + xsinB`` , 垂直轴为第三个三角函数 ``sinθ`` 。
+ ``Y = ycosB + xsinB`` 需要颠倒一下顺序和矩阵对应 ``Y = xsinB + ycosB`` 。

```html
<!-- css -->
<style>
    /**
     * @note: 旋转
     *      1. 等效矩阵： transform：matrix(cosθ, sinθ, -sinθ, cosθ, 0, 0);
     * @tip: 注意事项 
     *      1. 不可单独书写，一个度数两个坐标公用: transform: rotate(-45deg);
     *      2. 参数为正时，顺时针旋转；参数为负时，逆时针旋
     *      3. rotate 的取值范围： 0 ~ 360deg
     *      4. matrix 的取值范围： 0 ~ 1
     * */
    #transform-rotate {
        width: 50px;height: 50px;
        background-color: red;
        /*transform: rotate(-45deg);*/
        transform: matrix(0.707106, 0.707106, -0.707106, 0.707106, 0, 0);
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
    }
</style>
<!-- html -->
<div id="transform-rotate">A</div>
```
> **<font color=red>注：</font>** ``matirx`` 参数只能为数值, 且只有一个角度值。 ``rotate`` 参数为 ``0 ~ 360deg`` 。




### 斜切
![css_animate_06.jpg](/static/img/cssAnimate/css_animate_06.jpg)

**三角函数**
1.  ``x = ax + tanθ2y + e`` ; 当 ``a = 1`` ; ``e = 0`` ;即可满足： ``x = x + tanθ2y`` 。
2.  ``y = tanθ1x + dy + f`` ; 当 ``d = 1`` ; ``f = 0`` ; 即可满足： ``y = tanθ1x + y`` 。

```html
<!-- css -->
<style>
    /**
    * @note: 斜切
    *      1. 等效矩阵： transform：matrix(1, tanB, tanA, 1, 0, 0);
    * @tip: 注意事项 
    *      1. 参数为正时，顺时针旋转；参数为负时，逆时针旋
    *      2. 分开/合并书写: skew(30deg, 30deg);skewX(30deg);skewY(30deg);
    *      2. rotate 的取值范围： 0 ~ 90deg
    *      3. matrix 的取值范围： 0 ~ infinity
    * */
    #transform-skew {
        width: 50px;height: 50px;
        background-color: red;
        transform: skew(30deg, 30deg);
        /* transform: matrix(1, 0.577350, 0.577350, 1, 0, 0); */
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
    }
</style>
<!-- html -->
<div id="transform-skew">A</div>
```




### 使用 matrix 实现镜像效果
```html
<!-- css -->
<style>
    /**
    * @note: 镜像反转 x = 1x + 0y + 0; y = 0x + 1y + 0;
    * */
    #transform-skew {
        width: 50px;height: 50px;
        background-color: red;
        transform: matrix(-1, 0, 0, 1, 0, 0);
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
    }
</style>
<!-- html -->
<div id="transform-skew">B</div>
```




### 多值书写
```html
<!-- css -->
<style>
    #transform-skew {
        width: 50px;height: 50px;
        background-color: red;
        transform: translate(100px, 100px) rotate(45deg) scale(0.5) skew(30deg, 30deg);
        font-size: 40px;line-height: 50px;text-align: center;color: #fff;
    }
</style>
<!-- html -->
<div id="transform-skew">A</div>
```
> + **<font color=red>多个值需要使用空格分隔</font>**。