---
layout: post
title: 事件循环
categories: [事件循环]
tags: [微任务, 宏任务]
---

为什么要有微任务和宏任务？因为 ``javascript`` 是单线程的编程语言，一次只能执行一个任务，为了更好地解决异步编程和多任务场景，引入了任务（微任务和宏任务）队列进行任务调度，代码执行流进入后执行同步代码，遇到微任务和宏任务进行收集放置到各自的任务队列，同步代码执行完毕后，执行当前事件循环周期内的微任务，下一个事件循环执行当前周期收集的宏任务队列，宏任务队列收集到的微任务和宏任务继续加入队列如此循环往复。

# 事件循环
+ [分类](#分类)
+ [其它](#其它)





## 分类
### 宏任务
1. 整体脚本代码。
2. setTimeout、setInterval、setImmidate 的回调函数。
3. 用户的交互操作的回调函数。
4. UI 渲染。
5. I/O操作。

> + ``setTimeout`` 使用 ``setTimeout(() => { // to do...}, 0);`` 实现在下一个事件循环执行回调函数（定时器在执行指定的函数或代码之前应该等待的时间，单位是毫秒。如果省略该参数，则使用值 0，意味着“立即”执行，或者更准确地说，在下一个事件循环执行。）[^1]。
+ **<font color=red>setImmediate</font>** 是一个用于在 ``Node.js`` 中执行异步操作（宏任务）的函数。它类似于 ``setTimeout(() => { // to do...}, 0);`` 0 延迟的定时器，在下一个事件循环中执行（Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop.）[^2]。<br /> ``setImmidate`` 方法浏览器大部分都不支持，[点此查看](https://caniuse.com/?search=setImmediate)，如果是工程化的前端项目可以通过安装 ``npm install --save setimmediate`` 此 ``polyfill`` 给 ``window`` 对象添加该方法。
+ ``Javascript`` 中的 ``I/O`` 操作：文件 ``I/O`` 操作： ``FileReader`` 文件读取；网络 ``I/O`` 操作：``HTTP`` 请求、 ``WebScoket`` 通信；用户输入/输出： ``console.log`` 、 ``<input>`` 元素输入。

[^1]: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout
[^2]: https://nodejs.org/zh-cn/learn/asynchronous-work/understanding-setimmediate#understanding-setimmediate




## 其它
1. 微任务执行是产生的微任务会插入到当前微任务队列后面，执行仍然遭遇宏任务。
2. 页面加载完毕后添加过渡动画类名的时候，要放在宏任务里添加类名，如果放在微任务里面下一次事件循环的时候检测不到类名变化，无法实现动画效果。
> + UI 渲染也属于宏任务。














