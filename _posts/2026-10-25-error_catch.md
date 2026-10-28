---
layout: post
title: 错误捕获
categories: [javascript]
tags: [错误]
---

本文主要介绍 `javascript` 中的错误分类以及错误的处理方式。

# 错误捕获
+ [错误类型](#错误类型)
+ [主动捕获](#主动捕获)
+ [被动监听](#被动监听)




## 错误类型
**1.Error**: 基础通用错误，自己手动抛异常常用。

> + 对于错误的抛出类型， `js` 未做限制，可以使任何类型，使用 `try-catch` 的配套语句 `throw` 进行错误抛出。
    : ```javascript
      throw 12345;
      throw 'Hello world!';
      throw true;
      throw { name: 'javascript' };
      throw new Error('手动抛出'); // 最常用，手动跑出基础错误使用
    ```
    : `throw` 可以抛出**任意类型值**，不限制只能抛 `Error` 实例；但只有 `Error` 实例拥有 `stack`、`name`、`cause` 等调试信息。
    : `console.error()` 并不会抛出错误只是将内容输出到控制台的**<font color=red>错误面板</font>**而已。
+ 标准属性
  + `name` : 错误类型名称，如 `TypeError`、`AggregateError`。
  + `message` : 错误描述文本， `new Error('xxx')` 的入参。
  + `cause` : `ES2022` 新增，常用于业务侧（ `try-catch` ）的异常治理，将原始错误通过注入 `Error` 第二个参数的 `cause` 配置项，并通过第一个参数暴露出一个对用户友好的错误描述，用于隐藏底层技术细节。
  : ```javascript
    try {
        try {
            const originErr = new Error('后端查询用户时，数据库存在脏数据错误...')
          } catch (e) {
            throw new Error('数据库查询异常', { cause: e });
          }
    } catch (e) {
        throw new Error('用户查询异常', { cause: e });
    }
    window.addEventListener('unhandledrejection', event => {
          const err = event.reason;
          if (reason instanceof Error) {
            showToast(err.message); // 用户侧包装后的提醒
            reportError(formatErr(err)); // 上报错误日志
          }
    });
    function formatErr(e) {
        if (e instanceof Error) {
          return {
            name: e.name,
            message: e.message,
            stack: e.stack,
            cause: e.cause ? formatErr(e.cause) : null // 使用递归保存完整链路
          }
        } else {
          return e;
        }
    }
  ```
  + `errors` : `AggregateError` 独有的标准属性，存放全部子错误对象， `AggregateError` 在 `ES2021(ES12)` 正式纳入标准。
+ 非标准属性
  + `stack` : 堆栈跟踪字符串，包含调用链路、文件、行号列号。



**2.SyntaxError**: 语法解析错误，属于**解析期**错误，不是运行时错误，在解析期间就被 `js` 引擎拒绝。  




**3.运行时错误**: 代码语法合法，解析成功，执行阶段抛出，可被 `try/catch` 捕获。

| 错误类型 | 说明 | 典型场景 |
| --- | --- | --- |
| ReferenceError | 引用不存在的标识符；暂时性死区访问 | 访问未声明变量、let/const TDZ 提前读取 |
| TypeError | 值类型不符合预期，非法操作 | 调用 undefined 的属性、非函数执行、const 重复赋值 |
| RangeError | 参数/数值超出合法范围 | Array(-1)、递归栈溢出、toFixed 参数超限 |
| URIError | URI 编解码函数传入非法参数 | decodeURIComponent('%zz') |
| EvalError | eval 执行相关错误，现代标准已很少抛出 | 旧版 JS 中 eval 异常，现代引擎一般不再产生 |
| AggregateError | ES2021新增，聚合多个独立错误，通过 `.errors` 获取错误数组 | Promise.any() 所有Promise全部reject；批量校验、并行任务多错误收集 |

**`AggregateError`** 在 `ES2021(ES12)` 正式纳入标准。
  + 强相关于 `Promise.any` ，`Promise.any` 规则：只要有一个 `Promise` 成功就 `resolve` ；全部 `reject` 的时候，抛出 `AggregateError` 。类似于 `EvalError` 强相关于 `window.eval()` 方法一样。
  + 必须所有的都失败才会抛出错误，单个 `reject` 并不会冒泡到 `unhandledrejection` 事件。
  + `Promise.any` 的 `then` 会掉函数的入参是第一个完成的 `Promise` 的 `resolve` 的值，跟书写顺序无关。
  + 错误对象的核心属性 `errors` 只读数组，存放所有原始错误，也就是所有 `reject` 原因。
  + 兼容性
    + Node.js：v15+。
    + 现代浏览器：Chrome 85+, Firefox 79+, Safari 14.1+。
    + 低版本环境需要 core-js polyfill。




## 主动捕获
**同步捕获**: 使用 `try-catch` 进行同步代码的异常捕获。无法捕获 `setTimeout` （宏任务）和  `Promise` 内部同步代码（内部的报错等同于 `reject` 了该 `Promise` ）以及回调（微任务）错误。
+ **基础模式**
```javascript
try {
    throw new Error('主动抛出错误');
} catch (err) {
    // 拦截异常，手动接管，错误不再向上冒泡
    console.log('捕获同步错误：', err.message);
}
```
> `Optional catch binding` （可选 catch 绑定）， `ES2019(ES10)` 开始如果不需要访问 `error` 对象，可以不带括号（ `Node.js 10+` ）。




+ **完整模式**
```javascript
try {
    throw new Error('主动抛出错误');
} catch (err) {
    // 拦截异常，手动接管，错误不再向上冒泡
    console.log('捕获同步错误：', err.message);
} finally {
    // 无论成功失败，一定会执行，常用于关闭 loading
    console.log('finally执行');
}
```
> 不要在 `fianlly` 语句内部执行 `return` 和 通过 `throw` 抛出错误，优先级会高于 `try` 和 `catch` 。




+ **简写模式**
```javascript
try {
    throw new Error('主动抛出错误');
} finally {
    // 不对可能出现的错误进行捕获，使其向上冒泡进行全局统一兜底处理，只在此处做清扫工作
    console.log('finally执行');
}
``` 




**微任务捕获**: 针对 `Promise` 和 `async/await` 的错误捕获。
+ **`Promise链式`**
```javascript
try {
    Promise.reject('手动抛出错误1'); // 需要 .catch(error => {}) 进行捕获
    Promise.reject().catch(() => {
        throw new Error('手动抛出错误2');
    }); // 需要 .catch(error => {}) 进行捕获
    new Promise((resolve, reject) => {
        throw new Error('手动抛出错误3'); // 相当于 Promise 被 reject了
    }); // 需要 .catch(error => {}) 进行捕获
    Promise.resolve().then(() => {
        throw new Error('手动抛出错误4');
    }); // 需要 .catch(error => {}) 进行捕获
    Promise.resolve().finally(() => {
        throw new Error('手动抛出错误5');
    }); // 需要 .catch(error => {}) 进行捕获
} catch (e) {
    console.log('无法捕获微任务错误，次语句不会打印')
}
```

> `finally` 后面仍然可以跟 `catch` 。



+ **`async/await`**

`async/await` **是 Promise 的语法糖**，本身不是微任务；真正放进微任务队列的是 `Promise` 的回调（也就是 await 后面的代码）。
```javascript
  // 语法糖
  async function fn() {
      await Promise.resolve(1);
      console.log('微任务的回调');
  }
  // 等价于
  function fn() {
      return Promise.resolve(1).then(() => {
          console.log('微任务的回调');
      })
  }
```
> + `async/await` 能被同步的 `try-catch` 捕获的根本原因是: 当执行流遇到 `await` 时，会把当前 async 函数挂起；函数的执行上下文、局部状态、代码位置都会被引擎保留，它的调用帧会从主线调用栈移出，让出主线程。等到 Promise settle（变成 fulfilled /rejected）之后，引擎恢复这个 async 函数的执行流，回到 `await` 这一行继续执行。如果是 reject 场景，会在这个位置抛出异常；**因为恢复执行时，代码位置仍然处在外层 try 的语法块内部，所以这个异常可以被就近的 catch 捕获**。
+ 虽然 `Promise.then` 和 `async/await` 都不会阻塞主线程，前者是注册一个**全新独立的回调函数**，回调运行时，有它自己全新的调用帧，是一条全新的执行流；**它拿不到外层函数暂停前的执行流、代码断点**，外层函数早就跑完、退出了。外层的 `try` 语法域和这个新回调没关系。而后者把整个 async 函数**挂起，保存完整的执行上下文（断点、局部变量、当前所在语法块，比如 try 内部）**；等 Promise settle，在微任务里**恢复原来这一条执行流**，回到断点继续跑，还处在原来的 `try` 语法域内。


+ **`Promise`并发**  
111





## 被动监听

+ **监听策略**
被动监听，常用来将异常报错进行上报处理，不过对于 `SyntaxError` 语法解析错误这种非运行时错误如果要进行捕获的话，需要调整捕获策略，将捕获脚本单独写成静态文件，并在 `<head>` 标签手动引入。之所以这么做，是因为如果要捕获这个阶段的错误进行上报，尤其是移动端开发，存在这种场景，当前的开发环境的浏览器在 `.browserslistrc` 的影响范围内，但是目标避免错误捕获脚本也被打包至 `chunk` 块，




+ 跨站点脚本问题
































