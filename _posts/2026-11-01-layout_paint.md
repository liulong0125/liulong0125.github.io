---
layout: post
title: 重排重绘
categories: [渲染]
tags: [动画]
---

本章节介绍，通过 js 修改 dom 元素样式后，页面的绘制逻辑。

# 重排重绘
+ [前言](#前言)
+ [概念](#概念)
+ [css属性分类](#css属性分类)
+ [查看方式](#查看方式)



## 前言
触发渲染的场景。
+ 首次页面渲染（HTML、CSS 解析完成，初始样式重算）。
+ JS 修改 DOM、修改样式（`style`、`classList`、增删节点）。
+ 用户交互：hover /active 伪类、窗口 resize、屏幕旋转。
+ 资源就绪：自定义字体加载完成、部分图片加载（较少）。
  + 自定义字体在未加载完成之前，会使用系统默认字体进行渲染页面。
  + 图片元素没有提前写宽高，靠图片原生尺寸撑开容器。
  + CSS 里用图片作为尺寸相关的值: 比如 `background-size: auto`，背景图加载前不知道原图尺寸，加载完成后影响背景尺寸计算，触发样式重算。
  + content 用了图片（::before/after）: 图片加载完伪元素才有尺寸，会触发样式重算和布局。
    ```css
    .box::before{
      content: url("pic.png");
    }
    ```
+ CSS 自身变化：transition /animation、动态修改 style 标签 /link 样式表。
  `transition`（过渡）、`animation`（关键帧动画），本质是**浏览器自动持续修改 CSS 属性**，每帧给节点打上脏标记，在渲染阶段走样式重算，再根据你动画的属性，决定要不要 Layout、Paint。




## 概念
+ **样式重算 Recalculate Style**: 主线程参与。
  + **输入**: DOM 树 + CSS 样式表（style 标签、外部 css、内联 style）。  
  js 脚本修改元素样式，落脚点是输入中的 `内联 style` ，当然还有其它的操作方式 `sheet.insertRule` 往样式表动态插入规则。
  + **输入**: **计算样式 ComputedStyle**，每个 DOM 节点一套最终样式值。
  + **做的事情**:
    + **选择器匹配**：对每个脏 DOM 节点（有样式修改的节点），拿着 DOM 节点，去匹配所有可用的 CSS 规则，找出所有和这个节点对应的样式声明。
    + **CSS 层叠计算**: 按照优先级规则（`!important` > 内联样式 > ID 选择器 > 类选择器 > 标签选择器），冲突样式之间决出最终生效值。
    + **样式继承**：如果某个属性没有直接设置，则从它的父元素继承对应样式（比如 color、font 系列属性）。
    + **单位换算**：把相对单位 `em / rem / % / vw` 等，换算成浏览器内部统一的像素 px。  
      **并不是所有相对单位，都会在样式重算阶段直接算出最终 px 数值；一部分相对单位可以独立换算，另一部分只能记录依赖关系，要等到 Layout 才能算出最终像素**。
      + 不依赖父容器布局尺寸 → 样式重算阶段就能算出 px。
        + `rem`: 相对于根元素 html 的`font-size`。根字体大小是一个**全局样式常量**，不需要等父盒子布局，样式阶段就可以直接算出 px。
        + `vw/vh/vmin/vmax`: 相对于视口宽度，视口大小全局已知，样式阶段就可以换算。
      + 依赖布局上下文、父盒子的真实尺寸 → 样式重算只能记录规则，算不出最终 px。  
        样式重算阶段：**只能标记「取值 = 父布局宽度 × 0.5」这个计算公式**，拿不到父盒子最终宽度，所以没法算出 150px。
  必须等到 Layout，父盒子排版完成、得到真实宽度之后，才代入公式算出最终像素。
        ```css
          .parent { width:300px; }
          .child { width:50%; }
        ```
    + **输出计算样式**: 生成这个 DOM 节点一套最终确定的样式结果（ComputedStyle，例如 width:200px、opacity:1），交给后续布局阶段使用。
  + **特点**:
    + 只算**被标记为脏的节点**，以及受继承影响的子节点，不是全页面重算。
    + 开销和脏节点数量、选择器复杂度挂钩（通配符、深层后代选择器会变慢）。
    + 这一步**还不知道元素放在哪里、多大**，只是算出每个元素有什么样式。  
    flex/grid/table 这类弹性、自动分配空间的布局模型，是一套独立的空间分配算法，**放在 Layout 阶段执行**；
所以就算写了 width，最终实际占用尺寸依然由 Layout 决定。




+ **布局回流 Layout**: 主线程参与。
  + **输入**：DOM 树 + 上面产出的 ComputedStyle
  + **输出**：**布局树 Layout Tree + 布局信息（盒子坐标、宽高）**
  + **做的事情**:
    + 从 DOM 树筛选出**需要显示的节点**（`display:none` 直接丢掉，不进布局树）。
    + 根据盒模型、文档流、float、flex、grid、position，递归计算每个盒子：content/padding/border/margin。
    + 算出每个元素在视口内的坐标 x,y、宽高。
    + 递归子元素：父盒子尺寸变化会推动子元素重新排版（连锁回流）。
  + **特点**:
    + 这一步才知道元素**占多大位置、摆在哪**，所以 `offsetWidth/getBoundingClientRect` 需要 Layout 结果。
    + **只有布局属性改动才会触发 Layout**（width/margin/flex-basis 等）。
    + 修改 `transform / opacity`（分层后）不会触发 Layout。




+ **构建绘制指令 Paint**: 主线程参与。
  + **输入**：布局树 + 计算样式。
  + **输出**：**绘制列表（Display List）**，一串按绘制顺序记录的绘制指令。
  + **做的事情**:
    + 遍历布局树，按堆叠顺序（z-index）安排绘制顺序（先底层背景，再文字、图片）。
    + 生成绘制指令：画矩形、填充颜色、绘制文字、绘制阴影、绘制图片。  
    **该步骤不直接生成像素！**只是一份 “画什么、在哪画” 的命令清单，画像素在 `光栅 Raster` 。
    + 分层判断：浏览器在这里决定要不要给元素单独创建**GraphicsLayer（渲染层）**。
      + 常见分层条件：3D transform、will-change、video、canvas、css 动画。
      + 分层之后这个图层可以单独交给合成线程处理。
  + **特点**:
    + 绘制属性（background-color、box-shadow、color）改动：直接**跳过 布局回流 Layout**，走到这一步。
    + 已分层 transform/opacity 改动：直接跳过 `样式重算 Recalculate Style` 、 `布局回流 Layout` 、 `构建绘制指令 Paint` ，直接走到合成。




+ **光栅 Raster**: 光栅线程参与，也叫栅格化，把绘制指令转换为显存纹理。
  + **输入**：主线程传过来的绘制列表（或者单个图层的绘制指令）。  
  类似指令：在 (x,y) 画矩形、画文字、画阴影、画 SVG 路径，是**矢量绘制指令，还不是像素**；光栅化就是把这套指令 → 变成一块块显存纹理（tile 纹理），交给合成线程使用。  
  **矢量绘制指令**: 只记录图形参数、绘图动作，没有像素，**光栅化之后才会算出像素**。
  **纹理**: **就是位图数据放到 GPU 显存里之后，带上 GPU 配套元信息的一种 GPU 资源存储形式。**
  + **输出**：浏览器调用光栅器，按图层、按坐标，算出每个位置是什么颜色，生成一块像素数据，这块像素数据就叫 **Bitmap（位图）**，存放在**像素缓冲区**里。  
    光栅是分层做的：不是整张页面一次性光栅，是按前面 Paint 阶段分出的独立图层，分别生成各自的位图纹理。后面合成阶段，就是把这一层一层的位图，交给 GPU 叠加、平移、变换，最后输出到屏幕。  
  + **做的事情**:
    + 根据绘制指令把矢量图形、文字、阴影转换成点阵像素纹理，交给 GPU 显存。
    + 浏览器会开多个光栅线程并行光栅，不阻塞主线程。
    + 对于大图、复杂阴影，光栅开销很高。
  + **特点**:
    + 分层图层会单独光栅。
    + 如果不分层，所有元素在同一个图层一起光栅。
    + 光栅完成之后，得到一张张纹理图，交给合成线程。




+ **图层合成 Composite**: 合成线程参与。
  + **输入**：多张光栅好的图层纹理、每个图层的变换信息（transform、opacity）。
  + **输出**：提交给屏幕的最终画面。
  + **做的事情**:
    + 合成线程拿到所有图层，根据图层层级、transform、opacity 做**纹理变换叠加**。  
    **纹理变换叠加**: 多个图层各自完成纹理映射之后，它们在屏幕空间会重叠在一起；GPU 按照**堆叠顺序（z-index）**从上往下做颜色混合，这个过程就是我们说的纹理叠加，核心是**透明混合**: 如果上层图层不是完全不透明（`opacity < 1`，或者本身有半透明像素），GPU 会拿上层像素颜色 + 下层已经算出的像素颜色，按透明度公式加权，算出最终这一点的颜色。
    + GPU 做纹理映射、平移缩放、透明度混合（硬件加速）。  
    **纹理映射** : 建立「纹理上的坐标」和「屏幕面片坐标」的对应关系。
    + 合成线程完全独立于主线程！这就是 transform 动画流畅的根本原因。
    + 合成完成，把最终帧提交到屏幕。
  + **特点**:
    + 分层元素修改 `transform / opacity`：主线程完全不参与，且直接进入当前步骤。合成线程直接复用已经光栅好的纹理，只改图层位置透明度，开销极低。




+ **其他说明**
  + 当用 js 设置样式值时，不会立即触发渲染逻辑，会在当前同步代码和微任务队列执行完成后渲染。
  + 当用 js 通过 `offsetWidth / offsetHeight`、`clientWidth / clientHeight`、`scrollWidth / scrollHeight`、`getBoundingClientRect()`、`getComputedStyle()`（读取盒模型相关布局值时）方法，访问元素属性时，如果此时元素有脏标记（也就是在访问的时候这个元素已经通过脚本改过样式）会立即触发 `样式计算` -> `Layout` ，再把结果返回，不会再往下走绘制、光栅。如果没有脏标记直接存缓存读取。
  >
  ```javascript
    box.style.width = '200px'; // 打脏标记，此时还没有样式重算、Layout
    const w = box.offsetWidth; // 触发 样式计算 -> 重排
  ```
  + `requestAnimationFrame` 的回调函数**运行在主线程**，每一次触发回调，回调里面的 JS 代码都会占用主线程。时序: 宏任务 → 清空微任务 → **rAF 回调（主线程执行 JS）** → 样式重算 → Layout → Paint...。此方法注册的回调帧也不属于任务队列，会在下一次的任务队列执行完成后，渲染前调用。
  >
  ```javascript
  function animate() {
    x += 2;
    box.style.width = `${100 + x}px`; // 布局属性
    requestAnimationFrame(animate);
  }
  ```
  + 渲染不属于任务队列（宏任务与微任务），只是事件循环每一轮迭代里，固定的中间阶段，不是一个 “任务”，是一轮循环里流程的一环。





## css属性分类
通过 js 修改不同类别的 `css` 会触发不同渲染逻辑。  
+ **布局属性** - 改变几何占位、盒模型，触发完整的绘制链路。
**逻辑链路**: 样式重算 → **Layout** → Paint → Raster → Composite。  
**特点**: 改变元素**几何盒子（大小、位置、文档流排布）**，会影响周边元素。  
**开销**：最高，主线程参与了 样式重算、Layout 布局、Paint 绘制。  
**现象**: R元素几何占位改变，可能推动兄弟、子、后续元素，连锁布局，Rendering 面板会**绿色闪烁（Paint flashing）**。  
**代表属性**:
```plaintext
盒子本身（盒模型）：
width、height、padding、margin、border-width
定位相关：
top、left、right、bottom（static 以外的定位）
排版 / 字体相关：
font-size、line-height、font-family、text-align
布局控制：
display、float、clear、position
flex：flex-basis、flex-grow、flex-shrink
grid：grid-template-columns、grid-template-rows
```




+ **绘制属性** - 跳过 Layout，触发重绘 Repaint。  
**逻辑链路**: 样式重算 → 跳过 Layout → Paint 绘制 → Raster 光栅 → Composite 合成。  
**特点**: 元素的位置、尺寸不变，只是像素外观变了；浏览器要重新画这一块、重新生成位图。  
**开销**：中等，主线程参与 Paint。  
**现象**: Rendering 面板会**绿色闪烁（Paint flashing）**。  
**代表属性**:
```plaintext
color
background-color
background-image
border-color
outline
text-decoration
box-shadow
border-radius
visibility
filter（blur、grayscale 等大部分filter）
clip-path
mask
```




+ **合成属性** - 仅 Composite，跳过 Layout、Paint、Raster。  
**逻辑链路**: 轻量样式重算 → 直接到 Composite 合成。  
**特点**：位图内容完全不变，只是修改图层怎么摆放、透明程度；像素本身不用重新生成。  
**开销**：最低，主线程不参与逐帧绘制，CSS 动画可交给合成线程跑，不怕主线程阻塞。  
**现象**: **不会绿色闪烁，没有重绘**。  
**属性**: 仅 `transform`、`opacity`。



+ **其它说明**
  + `filter: blur()` : `blur` 属于绘制属性，会触发重绘光栅，不能纯合成加速。
  + `transform` 不是天然合成属性: 元素和其他元素挤在同一个根图层的时候，改 transform 依然会触发重绘。必须成为独立合成层才走纯合成链路。也就是说如果一开始就设置了 transform 属性会被提升为独立图层。
  + `opacity` 同上。




## 查看方式





















