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
      throw new Error('手动抛出'); // 最常用，手动跑出基础错误，使用
    ```
    : `throw` 可以抛出**任意类型值**，不限制只能抛 `Error` 实例；但只有 `Error` 实例拥有 `stack`、`name`、`cause` 等调试信息。
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

> + `AggregateError` 在 `ES2021(ES12)` 正式纳入标准。
    + 强相关于 `Promise.any` ，`Promise.any` 规则：只要有一个 `Promise` 成功就 `resolve` ；全部 `reject` 的时候，抛出 `AggregateError` 。类似于 `EvalError` 强相关于 `window.eval()` 方法一样。
    + 错误对象的核心属性 `errors` 只读数组，存放所有原始错误，也就是所有 `reject` 原因。
    + 兼容性
      + Node.js：v15+
      + 现代浏览器：Chrome 85+, Firefox 79+, Safari 14.1+
      + 低版本环境需要 core-js polyfill




## 主动捕获















## 被动监听

+ **监听策略**
被动监听，常用来将异常报错进行上报处理，不过对于 `SyntaxError` 语法解析错误这种非运行时错误如果要进行捕获的话，需要调整捕获策略，将捕获脚本单独写成静态文件，并在 `<head>` 标签手动引入。之所以这么做，是因为如果要捕获这个阶段的错误进行上报，尤其是移动端开发，存在这种场景，当前的开发环境的浏览器在 `.browserslistrc` 的影响范围内，但是目标避免错误捕获脚本也被打包至 `chunk` 块，





































