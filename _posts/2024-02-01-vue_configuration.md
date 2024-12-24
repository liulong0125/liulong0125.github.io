---
layout: post
title: vue 项目脚手架
categories: [Vue, 软件]
tags: [脚手架]
---

本章介绍 ``vue`` 项目本地初始化。

# Vue 项目脚手架

+ [Vue CLI](#vue-cli)
+ [Vite](#vite)



## Vue CLI

```
// 全局安装脚手架 npm 包
npm install -g @vue/cli

// 查看版本
vue --version

// 全局升级 Vue CLI
npm update @vue/cli -g

// 创建项目
vue create demo

// 创建项目 - 图形界面，可以选择安装版本 vue2 还是 vue3
vue ui
```

推荐安装版本 5.0.8 版本，``win7`` 安装完成后执行命令  ``vue -V`` 报错 -4054 错误解决方法： ``\node_modules\@vue\cli\node_modules\@achrinza\node-ipc\entities\Defaults.js`` 添加一行代码如图所示：

![vue_configuration_01.jpg](/static/img/vueConfiguration/vue_configuration_01.jpg)

> + 通过安装低版本的 ``nodejs`` e.g. v12.20.0 可以绕过这个 ``vue -V`` 的错误.
+ 创建好项目后 win7 运行还是会报错 -4054，解决方法和上面一样，把项目中的 ``\node_modules\@achrinza\node-ipc\entities\Defaults.js`` 也进行修正，如果想彻底规避 ``win7`` 有这个错误，就安装低版本的 ``@vue/cli`` 。




## Vite

```
npm create vue@latest
```

> 安装将 ``nodejs`` 版本升级到 ``18+``（16.20.2 也可以） 以上，``win7`` 不能安装 ``14+`` 以上的版本，需要在系统环境变量新建环境变量 ``NODE_SKIP_PLATFORM_CHECK`` 值设置为``1``。




