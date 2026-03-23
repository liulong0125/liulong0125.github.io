---
layout: post
title: jekyll 插件
categories: [软件]
tags: [jekyll, 博客, 流程图]
---

本章节主要介绍使用 jekyll 过程中的常用插件。

# jekyll 插件
+ [mermaid.js](#mermaidjs)
 


## mermaid.js
[官网](https://mermaid.js.org/)、[中文网](https://mermaid.nodejs.cn/intro/)、[github](https://github.com/mermaid-js/mermaid)、[cdn](https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js)。

在 ``jekyll`` 中使用  ``mermaid.js``，需要安装 ``jekyll-mermaid`` 插件。[官方安装示例](https://rubygems.org/gems/jekyll-mermaid)
1. ``gem install jekyll-mermaid`` 安装插件包（在项目根目录下执行）。
2. 配置 ``_config.yml`` 文件，设置 ``plugins: [jekyll-mermaid]``，当然如果已经有安装的插件直接给数组后面添加即可。 
3. xxx。
4. 最后把新加的插件给 ``Gemfile`` 文件追加``gem 'jekyll-mermaid'`` 配置，方便以后查询。

```mermaid
graph LR
    A[用户访问登录页] --> B{已登录?};
    B -->|是| C[跳转到首页];
    B -->|否| D[显示登录表单];
    D --> E[用户输入账号密码];
    E --> F[点击登录按钮];
    F --> G{验证成功?};
    G -->|是| H[记录登录状态];
    G -->|否| I[显示错误信息];
    I --> D;
    H --> C;
```