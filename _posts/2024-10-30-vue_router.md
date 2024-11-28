---
layout: post
title: vue-router 的使用
categories: [vue-router]
tags: [vue-router]
---

本篇主要介绍 ``vuex-router`` 的使用，用 ``Vue.js + Vue Router`` 创建单页应用，感觉很自然：使用 Vue.js ，我们已经可以通过组合组件来组成应用程序，当你要把 ``vue-router`` 添加进来，我们需要做的是，将组件 ( ``components`` ) 映射到路由 ( ``routes`` )，然后告诉 ``vue-router`` 在哪里渲染它们( [vue-router 3官网](https://v3.router.vuejs.org/zh/guide/)、[vue-router 4官网](https://router.vuejs.org/zh/guide/))。**<font color=red>其中会穿插着将 vue-router 3 和 4 的版本差异。</font>**

# vue-router

+ [基础](#基础)
    + [基础使用](#基础使用)
    + [标签路由](#标签路由)
    + [脚本路由](#脚本路由)
    + [数据打印](#数据打印)
    + [导航守卫](#导航守卫)
        + [守卫分类](#守卫分类)
        + [进入页面路由执行顺序](#进入页面路由执行顺序)
        + [离开页面路由执行顺序](#离开页面路由执行顺序)
        + [页面复用时路由执行顺序](#页面复用时路由执行顺序)
        + [关于 next 调用](#关于-next-调用)
+ [进阶](#进阶)
    + [通配符](#通配符)
    + [组件传参](#组件传参)
    + [重定向和别名](#重定向和别名)
    + [路由嵌套](#路由嵌套)
    + [动态路由](#动态路由)
    + [重置路由表](#重置路由表)
    + [面包屑](#面包屑)
    + [多视图](#多视图)
    + [动画](#动画)
    + [keep-alive](#keep-alive)




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



**history 模式非脚手架（@vue/cli、vite）搭建的场景，需要单独资源找不到资源返回索引页 index.html 文件**
+ 配置方式1： ``"dev": "cross-env NODE_ENV=development webpack-dev-server --host 0.0.0.0 --port 8888 --open --useLocalIp --history-api-fallback --config webpack.config.js",`` 直接在  ``package.json`` 命令行中添加 ``--history-api-fallback``。
+ 配置方式2：在 ``webpack.conf.js`` 文件中进行如下配置（更细致的配置见(官网)[https://www.webpackjs.com/configuration/dev-server/#devserverhistoryapifallback]）：

```javascript
    // 进行跨域代理 - 配置
    devServer: {
        // 开发环境下资源请求映射到 /public 目录下, 可以直接通过 / 访问 public 下的 index.html 入口 html 文件
        contentBase: path.join(__dirname, '/public'), 
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/g,
                    to: '/index.html' // 通过 contentBase 配置后，这里就不用带 public 目录前缀了
                }
            ]
        }
    }
```





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
#### 守卫分类
+ 全局守卫
``beforeEach``/ ``beforeResolve``/ ``afterEach`` 
> + ``beforeEach``  - 鉴权处理阶段
> + ``afterEach`` - 页面标题配置
> + ``beforeResolve`` - 所有组件内的守卫和异步路由组件被解析后执行



+ 路由独享守卫
``beforeEnter`` - 用的比较少


+ 组件守卫
``beforeRouteEnter``/ ``beforeRouteLeave`` / ``beforeRouteUpdate`` / ``watch: '$route'``
> + ``beforeRouteEnter`` - 一般通过用来判断内容是否存在通过回调函数给当前页面标志位翻面（因为支持会掉函数能获取上下文对象）给个被删除提示，避免页面显示空内容。
+ ``beforeRouteUpdate`` - 组件复用重复用 id 拉取数据时使用（路由参数为变更前的值，有 next）
+ ``watch: '$route'`` - 组件复用重复用 id 拉取数据时使用（路由参数为变更后的值，无 next）
+  ``beforeRouteLeave`` - 用的比较少



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
### 通配符
使用通配符 "*" 星号，可以匹配任意路径。
```javascript
[
    {
        // 会匹配以 `/test-` 开头的任意路径
        path: '/test-*'
    },
    {
        // 会匹配所有路径 - 通常放到最后用作 404 匹配展示
        path: '*'
    }
]
```

![vue_router_03.jpg](/static/img/vueRouter/vue_router_03.jpg)

> + **<font color=red>vue-router 4 变动</font>**
```javascript
[
  {
    path: '/test-:id(.*)*', // 通配符写法变成了 “动态参数 + 正则” 方式
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ '@/views/test.vue')
  },
  {
    path: '/:notFound(.*)', // 404 的写法（至于动态参数名字叫 notFound 还是 page404 随意）
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ '@/views/test.vue')
  }
]
```
![vue_router_04.png](/static/img/vueRouter/vue_router_04.jpg)





### 组件传参
可以通过给路由表配置 ``props`` 属性，就可以在组件的 ``props`` 声明中接受组件的参数。在了解组件传参之前先了解一下**动态路径参数**：

 ```javascript
[
    {
        // 动态路径参数以 : 开头，具体的值对应在 $route.params 对象中的 key 和 value
        path: '/test5/:id',
        name: 'test5',
        meta: {
            title: '测试5'
        },
        component: () => import('@/views/test/test5.vue')
    },
    {
        path: '/test6/:bookname?', // 可以通过量词限定符 "?" 设置为非必填参数
        name: 'test6',
        meta: {
            title: '测试6'
        },
        component: () => import('@/views/test/test6.vue')      
    }
]
 ```
 > + e.g. ``/test5/555`` 对应 ``this.$route.params.id`` 值为 555。
 + ``"?"`` 非必填参数修饰符。




**组件传参的设置类型：**

1\. 布尔值
```javascript
{
    path: '/test5/:id',
    props: true
    // 省略...
}
```


2\. 函数
```javascript
{
    path: '/test5/:id',
    // 对 id 参数进行扩充，函数的入参为当前路由
    props: route => ({ id: `${route.params.id}_test` })
    // 省略...
}
```
> + 返回的对象在组件中使用 ``props`` 接受的时候按照属性填写。
+ 函数方式可以把查询字符串也作为属性返回，比较灵活。


3\. 对象
```javascript
{
    path: '/test5/:id',
    // 对 id 参数进行扩充，函数的入参为当前路由
    props: {
        hoppy: 'sing' // 优先级高于动态路径参数 id，组件会拿不到默认的 id
    }
    // 省略...
}
```

**组件中的使用:**
```vue
{% raw %}
<template>
    <div>{{ id }}</div>
</template>

<script>
    export default {
        name: 'test',
        props: ['id', 'hoppy'],
        // 省略...
    }
</script>
{% endraw %}
```




### 重定向和别名
```javascript
[
    {
        path: '/redirectdemo',
        alias: '/abc', // path 的别名，访问效果一样
        name: 'redirectdemo',
        redirect: '/demo' // 重定向到 /demo
    },
    {
        path: '/demo',
        name: 'demo',
        meta: {
            title: 'demo'
        },
        component: () => import('@/views/demo')
    },
]
```
> + 重定向支持函数。
+ 初次进入 ``redirect`` 页面时，会显示  ``this.$route`` 会有 ``redirectedFrom`` 字段表示从哪个路由重定向的。
+ ``alias`` 支持字符串数组。






### 路由嵌套

**路由配置**
```javascript
[
    {
        path: '/demo',
        name: 'demo',
        meta: {
            title: 'demo'
        },
        // redirect: '/demo/demo1' // 如果 demo1 的 path 为 'demo1'，通过重定向一样可以默认展示 demo1 子路由
        component: () => import('@/views/demo'),
        children: [
            {
                path: '', // path 为空的时候默认展示该子路由
                name: 'demo1',
                meta: {
                    title: 'demo1'
                },
                component: () => import('@/views/demo1')
            },
            {
                path: 'demo2',
                name: 'demo2',
                meta: {
                    title: 'demo2'
                },
                component: () => import('@/views/demo2')
            },
        ]
    }
]
```
> + 自路由如果 ``path`` 为空的时候默认展示该子路由，如果不想设置为空，也要默认展示，可以给父层加一个 ``redirect`` 进行重定向。


**Vue 文件**
```vue
<!-- demo.vue -->
<template>
    <div class="container">
        <div>demo页面</div>
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'demo'
    };
</script>

<!-- demo1.vue -->
<template>
    <div>demo1</div>
</template>

<script>
    export default {
        name: 'demo1'
    };
</script>

<!-- demo2.vue -->
<template>
    <div>demo2</div>
</template>

<script>
    export default {
        name: 'demo1'
    };
</script>
```

**嵌套场景的动态参数**

1\. 路由配置
```javascript
[
    {
        path: '/demo/:id', // 外层路由有个 id 参数
        name: 'demo',
        meta: {
            title: 'demo'
        },
        component: () => import('@/views/demo'),
        children: [
            {
                path: 'demo1/:age', // 内层路由有个 age 参数
                name: 'demo1',
                meta: {
                    title: 'demo1'
                },
                component: () => import('@/views/demo/demo1')
            },
            {
                path: 'demo2',
                name: 'demo2',
                meta: {
                    title: 'demo2'
                },
                component: () => import('@/views/demo/demo2')
            },
        ]
    }
]
```
![vue_router_05.jpg](/static/img/vueRouter/vue_router_05.jpg)




### 动态路由
**1.目录结构**

**\|--** ``/src/views/`` - 页面视图目录。

**\|-----** ``/src/views/index.vue`` - index页。

**\|-----** ``/src/views/about.vue`` - about页。

**\|-----** ``/src/views/404.vue`` - 404页。

**\|-----** ``/src/views/admin.vue`` - admin页（嵌套路由，包含 adminPeople、adminProject 这 2 个页面）。

**\|-----** ``/src/views/adminPeople.vue`` - adminPeople页。

**\|-----** ``/src/views/adminProject.vue`` - adminProject页。

**\|--** ``/src/router/`` - 路由配置目录。

**\|-----** ``/src/router/constantRoutes.js`` - 白名单路由（登录、注册、首页、关于、忘记密码、404等等）。

**\|-----** ``/src/router/asyncRoutes.js`` - 需要权限过滤的路由（后台管理、个人中心等等）。

**\|-----** ``/src/router/index.js`` - 创建路由实例以及路由重置方法 resetRouter。

**\|--**``/src/App.vue`` - 应用入口模板。

**\|--**``/src/main.js`` - 应用依赖收集入口。




**2.文件内容**

**``/src/views/index.vue``**
```vue
{% raw %}
<template>
  <div>index页</div>
</template>
{% endraw %}
```




**``/src/views/about.vue``**
```vue
{% raw %}
<template>
  <div>about页</div>
</template>
{% endraw %}
```




**``/src/views/404.vue``**
```vue
{% raw %}
<template>
  <div>404页</div>
</template>
{% endraw %}
```




**``/src/views/admin.vue``**
```vue
{% raw %}
<template>
  <div>
    <div>admin页</div>
    <router-view />
  </div>
</template>
{% endraw %}
```
> + 嵌套路由，包含 adminPeople、adminProject 这 2 个页面。




**``/src/views/adminPeople.vue``**
```vue
{% raw %}
<template>
  <div>人员管理</div>
</template>
{% endraw %}
```




**``/src/views/adminProject.vue``**
```vue
{% raw %}
<template>
  <div>项目管理</div>
</template>
{% endraw %}
```




**``/src/router/constantRoutes.js``**
```javascript
{% raw %}
// 白名单路由表
export const constantRoutes = [
  { // 首页重定向
    path: '/',
    redirect: '/index'
  },
  { // index页
    path: '/index',
    name: 'index',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/index.vue')
  },
  { // about页
    path: '/about',
    name: 'about',
    meta: {
      title: 'about页'
    },
    component: () => import('@/views/about.vue')
  },
  { // 404页
    path: '/404',
    name: '404',
    meta: {
      title: '404'
    },
    component: () => import('@/views/404.vue')
  }
];

// 404重定向（放到最后，动态路由筛选后追加到最后，避免屏蔽后面的路由导致不可访问）
export const redirect404 =  {
  path: '*',
  name: 'redirect404',
  meta: {
    title: 'redirect404'
  },
  redirect: '/404'
};
{% endraw %}
```
> + 算上 404 页面，总共 3 个白名单页面， ``index页``、``about页`` 和  ``404页`` 。
+ 404 重定向路由要放到最后，动态路由拼接完成后追加到路由表的末尾，避免屏蔽后面的路由导致不可访问。




**``/src/router/asyncRoutes.js``**
```javascript
{% raw %}
// 鉴权路由（后端会返回需要被管控的路由，比如demo中的 adminPeople 和 adminProject
export const asyncRoutes = [
  {
    path: '/admin',
    name: 'admin',
    meta: {
      title: '管理页'
    },
    component: () => import('@/views/admin.vue'),
    children: [
      {
        path: 'adminPeople',
        name: 'adminPeople',
        meta: {
          title: 'adminPeople页'
        },
        component: () => import('@/views/adminPeople.vue')
      },
      {
        path: 'adminProject',
        name: 'adminProject',
        meta: {
          title: 'adminProject页'
        },
        component: () => import('@/views/adminProject.vue')
      }
    ]
  }
];
{% endraw %}
```
> + 需要鉴权的路由：``adminPeople`` 、``adminProject``，后台会返回一个有权限的路由名称数组，提供给前端筛选。




**``/src/router/index.js``**
```javascript
{% raw %}
import Vue from 'vue';
import Router from 'vue-router';
export { constantRoutes, redirect404 } from './constantRoutes.js';
export { asyncRoutes } from './asyncRoutes.js';

Vue.use(Router);

// 创建路由对象
const createRouter = () => new Router({
  routes: constantRoutes, // 实例化的时候，只设置白名单路由
  mode: 'history' // 可以不写，默认采用 hash 模式
});

// 路由对象实例化
const router = createRouter();

// 路由重置
export function resetRouter() {
  const newRouter = createRouter();

  router.matcher = newRouter.matcher; // 路由重置
};

let firstEnter = true; // 首次加载时的标示（首次加载进行鉴权）

// 模拟后端请求 - 获取鉴权数据
function getAuthData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      /**
       * 1.后端数据只返回有权限的叶子节点（叶子节点有权限父级节点也就有权限）
       * 2.可以手动修改模拟的返回数据测试页面是否有访问权限
      */
      resolve(['adminPeople', 'adminProject']);
    }, 3000);
  });
}

/**
 * @note 路由筛选方法 - 由于会有嵌套路由场景，需要进行递归处理
 * @param {Array} asyncRoutes - [ 总的异步路由数组，也就是 asyncRoutes 数组 ]
 * @param {Array} authRouters - [ 允许访问的异步路由名称数组，也就是 getAuthData 方法模拟后端返回的叶子节点数组 ]
 * @return { Array } list - [ 过滤后的允许访问的异步路由数组 ]
 */
export function filterAsyncRoutes(asyncRoutes, authRouters) {
  const list = [];

  asyncRoutes.forEach(route => {
    // 进行浅拷贝，存在递归时需要对  children 进行重写，避免影响原始数据
    let temp = { ...route };

    if (temp.children) {
      temp.children = filterAsyncRoutes(temp.children, authRouters);

      if (temp.children.length) {
        list.push(temp);
      }
    } else {
      if (authRouters.includes(temp.name)) {
        list.push(temp);
      }
    }
  });

  return list;
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  if (firstEnter) {
    firstEnter = false;
    let list = await getAuthData();

    if (list && list.length) {
      filterAsyncRoutes(asyncRoutes, list);
      // 避免路由直接访问异步路由白屏（动态添加的路由不会立即生效，需要在下一次跳转生效），需要进行一次重定向
      next(to.fullPath);
    } else {
      next(true);
    }
  } else {
    next(true);
  }
});

export default router;
{% endraw %}
```
> + 实例化的时候，只设置白名单路由。




**``/src/App.vue``**
```javascript
{% raw %}
<template>
  <div id="app">
    <router-view />
  </div>
</template>
{% endraw %}
```




**``/src/main.js``**
```javascript
{% raw %}
import Vue from 'vue';
import router from '@/router';
import App from '@/App.vue';

new Vue({ // eslint-disable-line
    el: '#app',
    router,
    render: h => h(App, { domProps: { id: 'app' } })
});
{% endraw %}
```




**3.说明**

1. 通过鉴权动态增加的路由直接访问不能生效需要下一次路由时生效, 需要设置一个 refresh 标量来处理标记是否为刷新状态进入。
2. 通过 beforeEach 路由时判断 to.path 是否为异步加载的路由，可以通过 to.path 的命名规则比如：/admin 开头的都为异步路由，或者通过 path-to-regexp 进行判断（不能通过 to.name 判断，异步路由第一次访问时没有 name 属性，只有 to.path & to.fullPath）。
3. 动态增加路由的方法
    1. VueRouter3 通过 router.addRoutes([数组项]);进行动态扩展 - 参数为数组。
    2. VueRouter4 通过 router.addRoute(数组项);进行动态扩展 - 参数为对象。




### 重置路由表




### 面包屑




### 动画
录制 gif 图



### keep-alive






