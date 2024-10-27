---
layout: post
title: vue 项目脚手架
categories: [软件]
tags: [vue]
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


> + 推荐安装版本 5.0.8。





## Vite

```
npm create vue@latest
```

> 安装将 ``nodejs`` 版本升级到 ``18+``（16.20.2 也可以） 以上，``win7`` 不能安装 ``14+`` 以上的版本，需要在系统环境变量新建环境变量 ``NODE_SKIP_PLATFORM_CHECK`` 值设置为``1``。




