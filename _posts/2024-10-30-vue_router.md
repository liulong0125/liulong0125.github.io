---
layout: post
title: vue-router 的使用
categories: [vue-router]
tags: [vue-router]
---

本篇主要介绍 ``vuex-router`` 的使用，用 ``Vue.js + Vue Router`` 创建单页应用，感觉很自然：使用 Vue.js ，我们已经可以通过组合组件来组成应用程序，当你要把 ``vue-router`` 添加进来，我们需要做的是，将组件 ( ``components`` ) 映射到路由 ( ``routes`` )，然后告诉 ``vue-router`` 在哪里渲染它们( [vue-router 3官网](https://v3.router.vuejs.org/zh/guide/)、[vue-router 4官网](https://router.vuejs.org/zh/guide/))。**<font color=red>其中会穿插着将 vue-router 3 和 4 的版本差异。</font>**

# Vuex

+ [基础](#基础)
    + [基础使用](#基础使用)
    + [标签路由](#标签路由)
    + [脚本路由](#脚本路由)
    + [数据打印](#数据打印)
    + [导航守卫](#导航守卫)
        + [进入页面路由执行顺序](#进入页面路由执行顺序)
        + [离开页面路由执行顺序](#离开页面路由执行顺序)
        + [页面复用时路由执行顺序](#页面复用时路由执行顺序)
        + [关于 next 调用](#关于-next-调用)
+ [进阶](#进阶)
    + [动态路由](#动态路由)
+ [注意事项](#注意事项)
+ [Vue3 中的使用](#vue3-中的使用)
    + [使用方式](#使用方式)




## 基础
### 基础使用
**1.目录结构**

**--** ``/src/router/index.js`` - 路由文件。

**--**``/src/main.js`` - 入口文件。




**2.文件内容**

**2.1 ``index.js``**

```javascript
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'root',
        meta: {
            title: '根目录'
        },
        redirect: '/index' // 重定向
    },
    {
        path: '/index', // 首页
        name: 'index',
        meta: {
            title: '首页'
        },
        component: () => import('@/views/index') // 通过 import 进行异步路由引入（异步路由打包会单独进行打包）
    },
    {
        path: '/about',
        name: 'about',
        meta: {
            title: '关于'
        },
        component: () => import('@/views/about')
    },
    {
        path: '/404', // 404 页
        name: '404',
        meta: {
            title: '404'
        },
        component: () => import('@/views/404')
    },
    {
        path: '*', // 未匹配的通配符（将所有未匹配到的路由重定向到 404 页，需要写到最后）
        name: 'redirect404',
        meta: {
            title: 'redirect404'
        },
        redirect: '/404'
    }
];

// 创建路由对象
const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0}), // 路由切换垂直滚动设置为 0
    routes: constantRoutes, // 路由表
    mode: 'hash' // 路由模式 hash（可以不写，默认采用 hash 模式）
});

// 路由对象实例化
const router = createRouter();

// 路由重置
export function resetRouter() {
    const newRouter = createRouter();

    router.matcher = newRouter.matcher; // 路由重置
}

export default router;
```

**常见的路由引入方式如下（语法基于 webpack 框架）：**


1\. **同步**路由引入方式：

```javascript
import index from '@/views/index/index.vue';
    
{
    path: '/index',
    name: 'index',
    meta: {
        title: '首页'
    },
    component: index
}
```

2\. **异步**路由引入方式一：
```javascript
{
    path: '/index',
    name: 'index',
    meta: {
        title: '首页'
    },
    component: () => import('@/views/index/index.vue)
}
```

3\. **异步**路由引入方式二：
```javascript
{
    path: '/index',
    name: 'index',
    meta: {
        title: '首页'
    },
    component: (resolve) => require(['@/views/index/index.vue'], resolve)
}
```
> webpack3 支持的语法，高版本的 webpack 直接调用 ``() => require('@/views/index/index.vue')`` 即可。




**关于路由切换后回退的页面滚动**

```javascript
// 滚动函数第第三个入参，是浏览器记录的对应路由页面的上次滚动距离，可以根据路由选择性决定滚动策略
const scrollBehavior = (to, from , position) => {
    if (position) {
        return position;
    } else {
        return {
            x: 0,
            y: 0
        };
    }
}
```
> **<font color=red>编程路由（调用 this.$router.go(-1)、浏览器前进后退按钮这两种会触发浏览器记录的滚动距离，Vue3 对象是 left/top，Vue2 对象是 x/y。</font>**




2.2 **``main.js``**
```javascript
import Vue from 'vue';
import router from '@/router';

// App 模板
import App from '@/App.vue';

new Vue({ // eslint-disable-line
    el: '#app', // 挂载的元素
    router,
    render: h => h(App, { domProps: { id: 'app' } }) //html 文件的 id 为 app 的元素在 实例挂在后会属性消失需要再次设置
});
```
> **<font color=red>注：</font>** ``Vue3`` 使用 ``createApp`` 方法创建后不存在 id 属性消失问题。






### 标签路由

```vue
<!--
    to: 可以绑定对象也可以绑定, 可以是字符串
    tag: 渲染的标签
    replace: 存在即可, 不生成跳转记录
    active-class: 导航激状态的类名, 默认值 'router-link-active'
-->
<router-link
    tag="a"
    replace
    active-class="router-link-active"
    :to="{ name: 'test', params: { id: '999' }, query: { age: 22 } }"
>
    跳转至 test.vue
</router-link>
<router-link
    tag="a"
    to="/test/999?age=22"
    replace
    active-class="router-link-active">
    跳转至 test.vue
</router-link>
```

> 对象模式  ``name & path`` 不能同时存在, 存在  ``path`` 会忽略  ``params``。




### 脚本路由
``Vue`` 实例内部通过 ``$router`` 访问路由实例，进行导航。

```js
// 字符串
this.$router.push('/test/999?age=22');

// 对象 - path (params 会被忽略)
this.$router.push({
    path: '/test/999',
    query: {
        age: 22
    }
});

// 对象 - name
this.$router.push({
    name: 'test',
    params: {
        id: '999'
    },
    query: {
        age: 22
    }
});

// 不生成记录
this.$router.replace('/test/999?age=22');

// 前进后退
this.$router.go(1);
this.$router.go(-1);
```

> 对象模式  ``name & path`` 不能同时存在, 存在  ``path`` 会忽略  ``params``。




### 数据打印
**1.``this.$router`` （实例）打印。**

![vue_router_01.png](/static/img/vueRouter/vue_router_01.png)


**2.``this.$route``（页面当前路由）打印。**

![vue_router_02.png](/static/img/vueRouter/vue_router_02.png)




### 导航守卫
#### 进入页面路由执行顺序

| 导航名称 | 类型 | 执行顺序 | this指向 | next |
| :--- | :--- | :--- | :--- | :--- |
| beforeEach | 全局 | 1 | n/a | required |
| beforeEnter | 路由 | 2 | n/a | required |
| beforeRouteEnter | 组件 | 3 | n/a | required |
| beforeResolve | 全局 | 4 | n/a | required |
| afterEach | 全局 | 5 | n/a | n/a |

> ``beforeRouteEnter`` 唯一一个支持 ``next`` 回调函数的路由, 回调函数参数为当前路由上下文。




#### 离开页面路由执行顺序

| 导航名称         | 类型 | 执行顺序 | this指向 | next     |
| :--------------- | :--- | :------- | :------- | :------- |
| beforeRouteLeave | 组件 | 1        | enable   | required |

> ``beforeRouteLeave`` 执行后，剩下的路由执行顺序和进入页面的执行顺序一样。




### 页面复用时路由执行顺序

| 导航名称          | 类型 | 执行顺序 | this指向 | next     |
| :---------------- | :--- | :------- | :------- | :------- |
| beforeEach        | 全局 | 1        | n/a      | required |
| beforeRouteUpdate | 组件 | 2        | enable   | required |
| afterEach         | 全局 | 3        | n/a      | n/a      |
| watch: '$route'   | 组件 | 4        | enable   | n/a      |

>  ``watch: '$route'`` 触发时，``this`` 的 ``props`` 参数为路由更新后的参数。




### 关于 next 调用
1.  ``vue-router 3 next`` 为必填项( ``watch: '$route' & afterEach`` 不涉及)且必须显式调用, ``vue-router 4`` 为非必填项, 只需要返回路径、真、不返回都通过。

2. ``next`` 传参：
    1. 不传值 - 路由通过。
    2. 布尔值 - true 通过、false 失败。
    3. 字符串 - 路由路径。
    4. 对象 -  ``path + query`` \| ``name + params + query``。
    5. 函数 - 只有 ``beforeRouteEnter`` 支持， 回调函数参数为当前路由上下文。




## 进阶
### 动态路由
**1.目录结构**

**--** ``/src/router/`` - 路由目录。

**-----** ``/src/router/constantRoutes.js`` - 白名单路由（登录、注册、忘记密码、404等等）。

**-----** ``/src/router/asyncRoutes.js`` - 需要权限过滤的路由（后台管理、个人中心等等）。

**-----** ``/src/router/routes.js`` - 路由统一出口引用时可以按需引入。

**-----** ``/src/router/index.js`` - 创建路由实例以及路由重置方法 resetRouter。

**--**``/src/main.js``。




**2.文件内容**

**``constantRoutes.js``**

**``asyncRoutes.js``**

**``routes.js``**

**``index.js``**




**3.说明**

1. 通过鉴权动态增加的路由直接访问不能生效需要下一次路由时生效, 需要设置一个 refresh 标量来处理标记是否为刷新状态进入。
2. 通过 beforeEach 路由时判断 to.path 是否为异步加载的路由，可以通过 to.path 的命名规则比如：/admin 开头的都为异步路由，或者通过 path-to-regexp 进行判断（不能通过 to.name 判断，异步路由第一次访问时没有 name 属性，只有 to.path & to.fullPath）。
3. 动态增加路由的方法
    1. VueRouter3 通过 router.addRoutes([数组项]);进行动态扩展 - 参数为数组。
    2. VueRouter4 通过 router.addRoute(数组项);进行动态扩展 - 参数为对象。