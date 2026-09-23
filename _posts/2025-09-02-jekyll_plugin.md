---
layout: post
title: mermaid.js
categories: [软件]
tags: [jekyll, 博客, 流程图]
---

本章节主要介绍使用 markdown 的插件 jekyll 的使用。

# mermaid.js
+ [前言](#前言)
  + [环境配置](#环境配置)
  + [示例](#示例)
+ [流程图](#流程图)
  + [单节点](#单节点)
  + [多节点](#多节点)
  + [节点形状](#节点形状)
  + [连线](#连线)




## 前言
``Mermaid`` 是一个基于 ``JavaScript`` 的图表和作图工具，它使用类似 ``Markdown`` 的文本定义和渲染器来创建和修改复杂的图表。``Mermaid`` 的主要目的是帮助文档跟上开发的步伐。
[官网](https://mermaid.js.org/)、[中文学习网](https://docs.min2k.com/zh/mermaid/intro/)、[github](https://github.com/mermaid-js/mermaid)。

### 环境配置
在 ``jekyll`` 中使用  ``mermaid.js``，需要安装 ``jekyll-mermaid`` 插件。[官方安装示例](https://rubygems.org/gems/jekyll-mermaid)，由于[github插件支持白名单](https://docs.github.com/zh/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)中没有 ``jekyll-mermaid`` ，不能通过 ``gem install jekyll-mermaid`` 的方式安装，静态页会不生效，需要通过传统 ``<script>`` 标签的方式引入。

```html
<!-- 将改代码放到 js 代码统一执行的入口处，e.g. 当前静态页放到了 body 的结尾处  -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  
  // 关闭自动渲染逻辑（依托于 DOMContentLoaded 事件，此时无法修改默认的扫描元素类，需要手动调用 mermaid.run 进行掌控）
  mermaid.initialize({ startOnLoad: false });

  // 由于 markdown 的解析器 kramdown（当前项目使用的解析器，常用的解析器e.g. kramdown、rdiscount、maruku），生成的元素的类名携带了 "language-" 前缀，需要使用 mermaid.run 方法修改元素选择器（高版本已经不支持在 mermaid.initialize 中设置了）
  await mermaid.run({ querySelector: '.language-mermaid' });
  console.log('图表渲染完成...');
</script>
```

### 示例
+ 代码块（流程图类型）
````
```mermaid
flowchart LR
  A --> B
```
````
> 输出以上代码块参照 [markdown中展示代码块](/软件/2023/10/08/markdown.html#代码块)

+ 运行结果
```mermaid
flowchart LR
  A --> B
```




### 流程图
流程图由节点（几何形状）和边（箭头或线条）组成。Mermaid 代码定义了节点和边的生成方式，并支持不同类型的箭头、多方向箭头以及与子图的任意链接。

#### 单节点
````
```mermaid
flowchart LR
  id[文本]
  节点2["`**加粗内容**`"]
  节点3["`行1
  
  行2

  行3`"]
```
````
```mermaid
flowchart LR
  id[文本]
  节点2["`**加粗内容**`"]
  节点3["`行1
  
  行2

  行3`"]
```

> + 使用  ``flowchart``/ ``graph`` 开头，紧跟着是流程图的布局方向。
+ "[文本]" 此内容为非必填，不填写就展示文本 ``id`` 。
+ 如果需要对节点文本使用 ``markdown`` 格式，需要使用  ``""``（双引号）将文本括起来，再使用 `` ` ``（反单引号）号将 ``markdown`` 格式内容括起来。




#### 多节点
````
```mermaid
flowchart LR
  节点1["我是❤"]
  节点2["`**加粗内容**`"]
  节点3["`行1
  
  行2

  行3`"]

  节点1 --> 节点2 --> 节点3
```
````
```mermaid
flowchart LR
  节点1["我是❤"]
  节点2["`**加粗内容**`"]
  节点3["`行1
  
  行2

  行3`"]

  节点1 --> 节点2 --> 节点3
```

> + 各个节点之间的 ``id`` 通过使用 ``-->`` 进行节点连接线。
+ 布局方向
    + TB - 从上到下
    + TD - 自上而下 / 与从上到下相同
    + BT - 从底部到顶部
    + RL - 从右到左
    + LR - 从左到右




#### 节点形状
+ 基础节点形状
```mermaid
flowchart LR
  A("A(圆角节点)")
  B(["B([体育场形状节点])"])
  C[["C[[子程序形状节点]]"]]
  D[("D[(圆柱形装节点)]")]
  E(("E((圆形节点))"))
  F>"F>不对称形装节点]"]
  G{"G{菱形节点}"}
  H[/"H[/平行四边形节点/]"/]
  I[\"I[\翻转平行四边形节点\]"\]
  J[/"J[/梯形形节点\]"\]
  K[\"K[\翻转梯形节点/]"/]
  L((("L(((双圆形节点)))")))

  A --> B --> C --> D
  E --> F --> G --> H
  I --> J --> K --> L
```




+ 新节点形状
需要 ``mermaid.js`` 版本 ``v11.3.0+`` 声明方式，e.g.  ``id@{ shape: 形装名称, label: "展示的文本" }`` 。
```mermaid
flowchart LR
  A@{ shape: manual-file, label: "A@{ shape: manual-file, label: \"文件处理\" }" }
  B@{ shape: manual-input, label: "B@{ shape: manual-input, label: \"用户输入\" }" }
  C@{ shape: docs, label: "C@{ shape: docs, label: \"多个文档\" }" }
  D@{ shape: procs, label: "D@{ shape: procs, label: \"过程自动化\" }" }
  E@{ shape: paper-tape, label: "E@{ shape: paper-tape, label: \"纸质记录\" }" }
  F@{ shape: hex, label: "F@{ shape: hex, label: \"准备条件\" }" }


  G@{ shape: notch-rect, label: "G@{ shape: notch-rect, label: \"卡片\" }" }
  H@{ shape: lin-rect, label: "H@{ shape: lin-rect, label: \"有线过程\" }" }
  I@{ shape: sm-circ, label: "I@{ shape: sm-circ, label: \"小开始\" }" }
  J@{ shape: framed-circle, label: "J@{ shape: framed-circle, label: \"停止\" }" }
  K@{ shape: fork, label: "K@{ shape: fork, label: \"分叉或合并\" }" }
  L@{ shape: hourglass, label: "L@{ shape: hourglass, label: \"整理\" }" }
  M@{ shape: comment, label: "M@{ shape: comment, label: \"注释左大括号\" }" }
  N@{ shape: brace-r, label: "N@{ shape: brace-r, label: \"注释右大括号\" }" }
  O@{ shape: braces, label: "O@{ shape: braces, label: \"注释\" }" }
  P@{ shape: bolt, label: "P@{ shape: bolt, label: \"通信链接\" }" }
  Q@{ shape: doc, label: "Q@{ shape: doc, label: \"文档\" }" }
  R@{ shape: delay, label: "R@{ shape: delay, label: \"延迟\" }" }
  S@{ shape: das, label: "S@{ shape: das, label: \"直接访问存储\" }" }
  T@{ shape: lin-cyl, label: "T@{ shape: lin-cyl, label: \"磁盘存储\" }" }
  U@{ shape: curv-trap, label: "U@{ shape: curv-trap, label: \"显示\" }" }
  V@{ shape: div-rect, label: "V@{ shape: div-rect, label: \"分割过程\" }" }
  W@{ shape: tri, label: "W@{ shape: tri, label: \"提取\" }" }
  X@{ shape: win-pane, label: "X@{ shape: win-pane, label: \"内部存储\" }" }
  Y@{ shape: f-circ, label: "Y@{ shape: f-circ, label: \"交点\" }" }
  Z@{ shape: lin-doc, label: "Z@{ shape: lin-doc, label: \"有线文档\" }" }
  AA@{ shape: notch-pent, label: "AA@{ shape: notch-pent, label: \"循环限制\" }" }
  AB@{ shape: processes, label: "AB@{ shape: processes, label: \"多个过程\" }" }
  AC@{ shape: bow-rect, label: "AC@{ shape: bow-rect, label: \"存储数据\" }" }
  AD@{ shape: cross-circ, label: "AD@{ shape: cross-circ, label: \"总结\" }" }
  AE@{ shape: tag-doc, label: "AE@{ shape: tag-doc, label: \"标记文档\" }" }
  AF@{ shape: tag-rect, label: "AF@{ shape: tag-rect, label: \"标记过程\" }" }


  A --> B --> C
  D --> E --> F
  G --> H --> I
  K --> L --> M
  N --> O --> P
  Q --> R --> Sr
  T --> U --> V
  W --> X --> Y --> Z

  AA --> AB --> AC
  AD --> AE --> AF
```




#### 连线
````
```mermaid
flowchart LR
// 实线 > 粗实线 > 箭头实线 > 箭头粗实线
A --- B === C --> D ==> E

// 文本实线 > 文本粗实线 > 文本箭头实线 > 文本箭头粗实线
F -- 文本 --- G == 文本 === H -- 文本 --> I == 文本 ==> J

// 虚线 > 箭头虚线
K -.- L -.-> M

// 文本虚线 > 文本箭头虚线
K -. 文本 .- L -. 文本 .-> M

// 无形连接（布局使用，强制使得 N O P 不折行）
N ~~~ O ~~~ P
N --> Q
P --> Q
```
````
```mermaid
flowchart LR
A --- B === C --> D ==> E

F -- 文本 --- G == 文本 === H -- 文本 --> I == 文本 ==> J

K -. 文本 .- L -. 文本 .-> M

N ~~~ O ~~~ P
N --> Q
P --> Q
```
