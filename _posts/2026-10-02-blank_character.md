---
layout: post
title: 空白字符
categories: [字符]
tags: [空白字符]
---

本章节主要介绍常见空白字符的用途。

# 空白字符
+ [零宽系列](#零宽系列)
  + [普通零宽字符](#普通零宽字符)
  + [Bidi 控制字符](#bidi-控制字符)
+ [控制文本方向的字符](#控制文本方向的字符)




## 零宽系列
**零宽系列空白字符都是不可见空白字符，用于排版（零宽系列字符都可以技术上用来绕过敏感词，前提是平台未做防范的化）。**

### 普通零宽字符
**普通零宽字符主要用于字符的断行、字形连字、合并。**
1. 零宽空格（\u200b）: 精准指定字符串的折断点进行精准换行。尽管 css 样式 `word-break: break-all;` 或 `overflow-wrap: break-word;` 都能实现文字折行不过是全局一刀切按照宽度剩余折行。

    | 特性 | overflow-wrap: break-word | \u200B 零宽空格 |
    |---|---|---|
    | 断行位置 | 浏览器自动随机切，不可控 | **开发者精确指定断点** |
    | 空白占位 | 无额外空白 | 不可见，不占宽度 |
    | 语义控制 | 无法区分“可以断/不能断” | 想在哪断就在哪标记，其余位置强制不折 |
    | 适用场景 | 普通文本段落 | 密钥、哈希、订单号、长ID、无分隔串 |
    | 缺点 | 乱切，破坏业务字符串视觉分组 | 需要预处理字符串插入\u200B |

    **扩展用途**
      + 用途1: 社交平台排版，强行换行/留空，也可以通过该字符和空格组合单独呈现一样，避免社交软件删除多余空行实现特殊排版。
      + 用途2: 大厂内部的 "文本数字盲水印"，将工号转换为二进制的 0 和 1 (按照字符的 Unicode 码点拆解)，**零宽空格**代表 0 ，**零宽不连字**代表 1，混入到段落中，复制的时候就会把看不到的字符也复制分享了，便于追踪。




2. 零宽不连字（\u200c）: 阻止两个字符自动连续，e.g. 阿拉伯语或某些连体**字形**（加和不加零宽不连字，字形完全不一样），以波斯语：**می‌بی**（意思：看见）为例。

    |  项目  |  带 ZWNJ（می‌بی） |  不带 ZWNJ（میبی） |
    | :--- | :---: | :---: |
    |  字符串  |  می‌بی |  میبی |
    | Unicode码点 | U+0645 U+06CC U+200C U+0628 U+06CC | U+0645 U+06CC U+0628 U+06CC |
    | 渲染效果 |  می‌بی（**ی 和 ب 中间断开，不连笔**，两个词素视觉分离） |  میبی（**ی 和 ب 自动连成一条连体曲线**，变成一整个连续字形） |
    | 含义说明 |  语法正确：前缀 `می` + 词根 `بی`（持续体标记） |  字形错误，字体自动把 `ی` 尾部和后面 `ب` 连接，变成单个连体串，不符合波斯语正字法 |

    > 有的地区比如伊朗（伊斯兰语/法尔西键盘）物理键盘上就有单独的 ZWNJ 按键，是日常高频输入键，波斯语大量需要控制字母连写。




3. 零宽连字（\u200d）: 强行将两个字符连接在一起。Emoji 组合就是用它实现的，e.g. 👨 + \u200D + 👩 + \u200D + 👧 + \u200D + 👦 → 👨‍👩‍👧‍👦（一家四口：爸妈 + 女儿 + 儿子），👨‍👩‍👧‍👦 对应的 js 字符串声明 `\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66` ，虽然视觉上是一个字符实际上字符长度为 16。
> Emoji 的连接必须遵循 Unicode 联盟制定的官方规范，通过审批才能实线连字表情包效果。




7. 零宽不换行空格（\ufeff）: 禁止在标记处进行字符换行。
> 扩展用途: 此字符的原始用途基本废弃。Unicode 规范建议：**不要再把 \ufeff 当作零宽不换行空格使用**，它优先作为 [BOM(Byte Order Mark 字节序标记)](http://127.0.0.1:4001/%E5%AD%97%E7%AC%A6/2026/09/20/character_encoding.html#%E5%A4%A7%E7%AB%AF%E5%BA%8F%E5%B0%8F%E7%AB%AF%E5%BA%8F)，如果确实需要零宽不换行效果，改用 `\u2060`（Word Joiner，单词连接符）。




### Bidi 控制字符
世界文字分两种书写方向: 
1. RTL：从右往左（阿拉伯语、希伯来语）: 键盘依次按下希伯来字母伯来字母：א <- ב <- ג，字符序列在内存数组中的存储顺序从左到右[א ,ב ,ג]，页面渲染顺序 גבא。
2. LTR：从左往右（中文、英文、数字）: 键盘依次按下 a -> b -> c，字符序列在内存数组中的存储顺序从左到右[a, b, c]，页面渲染顺序 abc。

![blank_character_01.gif](/static/img/blank_character/01.gif)

依次输入 3 个希伯来字母和 3 个英文字母，可以直观的看到两种不同的书写方式，整个过程光标都是始终在字符序列的最后面，希伯来语的时候光标没有动是因为从右向左书写时左侧就是字符序列的最后面。


Bidi 控制字符（Bidirectional Formatting Characters，双向文本控制字符），主要用于文本阅读顺序、字符重排逻辑，**内存里存逻辑顺序（按键顺序），渲染时自动重排成视觉顺序**，解决同一段落同时包含 LTR（英 / 中文）与 RTL（阿拉伯、希伯来）文本的排版问题。

当一段文本**同时混有 LTR 和 RTL 文字**时，浏览器 / 编辑器 / 终端会用一套叫 **Unicode Bidi 算法**自动猜排版顺序（入门材料: [《UBA 基础：Unicode 双向算法入门》](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics.zh-hans.html)、[《Bidi Unicode 控制字符使用问答》](https://www.w3.org/International/questions/qa-bidi-unicode-controls.zh-hans.html)）。

**Bidi 类别汇总**

| Bidi类别 | Bidi缩写 | 全称 | 描述 | 典型字符 |
| ---- | -------- | ---- | ---- | -------- |
| Strong | L | Left_To_Right | 强从左到右字符，拥有L方向，隐式Bidi的基础强类型 | 英文字母、汉字、假名、&amp;lrm;(U+200E) |
| Strong | R | Right_To_Left | 强从右到左字符，拥有R方向 | 希伯来字母、&amp;rlm;(U+200F) |
| Strong | AL | Arabic_Letter | 阿拉伯类强RTL字母，阿拉伯脚本文字 | 阿拉伯字母、叙利亚字母、&amp;alm;(U+061C) |
| Strong | LRE | Left_To_Right_Embedding | 显式LTR嵌入控制字符，入栈开启LTR嵌入上下文 | U+202A |
| Strong | RLE | Right_To_Left_Embedding | 显式RTL嵌入控制字符，入栈开启RTL嵌入上下文 | U+202B |
| Strong | LRO | Left_To_Right_Override | 显式LTR强制覆盖，强制后续字符逻辑方向LTR，覆盖字符原生Bidi类型 | U+202D |
| Strong | RLO | Right_To_Left_Override | 显式RTL强制覆盖，强制后续字符逻辑方向RTL，覆盖字符原生Bidi类型 | U+202E |
| Weak | EN | European_Number | 欧洲数字，弱类型数字 | 0-9拉丁数字 |
| Weak | AN | Arabic_Number | 阿拉伯数字，阿拉伯-印度数字体系 | 阿拉伯文数字٠١٢٣ |
| Weak | ES | European_Separator | 欧洲数字分隔符，数字附属弱符号 | 加号`+`、减号`-` |
| Weak | ET | European_Terminator | 数字终止符，数字前后附属标记 | 货币符号、度数符号 |
| Weak | CS | Common_Separator | 通用数字分隔符，可用于数字之间的分隔 | 逗号`,`、点`.`、冒号`:` |
| Weak | NSM | Nonspacing_Mark | 非间距组合标记，附着在前一个字符上，继承前字符Bidi类型 | 重音符号、变音标记 |
| Weak | BN | Boundary_Neutral | 边界中性，可忽略的格式控制字符，W阶段直接跳过不参与Bidi运算 | 大量零宽控制字符、非字符码点 |
| Weak | PDF | Pop_Directional_Format | 弹出方向格式，结束LRE/RLE/LRO/RLO嵌入/覆盖上下文，弹出嵌入栈 | U+202C |
| Neutral | B | Paragraph_Separator | 段落分隔符，P规则按该字符切分独立段落，每段独立计算Bidi | 段落分隔符U+2029 |
| Neutral | S | Segment_Separator | 片段分隔符，段内片段分隔 | Tab制表符U+0009 |
| Neutral | WS | Whitespace | 空白字符，中性空白，N规则参与方向继承 | 半角（普通）空格、不间断空格 |
| Neutral | ON | Other_Neutral | 其他中性，普通标点与符号，无原生方向，依靠N规则继承邻近强字符方向 | `[ ] ( ) , ! @ # $` |
| Isolate | LRI | Left_To_Right_Isolate | LTR隔离，开启LTR隔离盒，盒内外Bidi上下文互不干扰 | U+2066 |
| Isolate | RLI | Right_To_Left_Isolate | RTL隔离，开启RTL隔离盒，盒内外Bidi上下文互不干扰 | U+2067 |
| Isolate | FSI | First_Strong_Isolate | 首强隔离，开启隔离盒，隔离盒内base level由盒内第一个强字符自动判定 | U+2068 |
| Isolate | PDI | Pop_Directional_Isolate | 弹出隔离，关闭LRI/RLI/FSI隔离盒，弹出隔离栈 | U+2069 |


**Bidi不同类别的特性**

| 顶层分组 | 英文名称 | 核心含义 | 包含的Bidi缩写列表 |
| ---- | ---- | ---- | ---- |
| Strong | 强类型 | 自带固定阅读方向，作为Bidi算法的方向基准锚点 | L, R, AL, LRE, RLE, LRO, RLO |
| Weak | 弱类型 | 无独立方向，依附相邻字符，在W阶段完成重分类 | EN, AN, ES, ET, CS, NSM, BN, PDF |
| Neutral | 中性类型 | 无原生方向，N阶段根据邻近强字符继承方向 | B, S, WS, ON |
| Isolate | 隔离类型 | 创建独立Bidi隔离盒，切断盒子内外方向上下文传播 | LRI, RLI, FSI, PDI |


**Bidi推导流程**

| 阶段 | 名称 | 执行时机 | 核心任务 | 关键行为 | 隐式模式（无Bidi控制字符） | 显式模式（含Bidi控制字符） |
| ---- | ---- | -------- | -------- | -------- | ---- | ---- |
| P | Paragraph Rules 段落规则 | 第1步 | 段落切分、确定段落Base Level | 按B段落分隔符切文本；扫描首强字符确定base level，初始化所有字符初始level | ✅执行 | ✅执行 |
| X | Explicit Rules 显式规则 | 第2步（P之后） | 维护嵌入栈/隔离栈，设置字符初始level | 遇到LRE/RLE/LRO/RLO/PDF/LRI/RLI/FSI/PDI，操作栈，覆盖初始level | ❌跳过，不运行 | ✅执行，Bidi控制字符在此生效 |
| W | Weak Rules 弱字符规则 | 第3步（X/P之后） | 修正Weak类字符Bidi_Class | 处理NSM、BN、EN、AN、ES、ET、CS；仅修改类型标签，不改动level | ✅执行 | ✅执行 |
| N | Neutral Rules 中性规则 | 第4步（W之后） | 给Neutral字符分配临时方向 | N0成对括号（按照 N1 -> N2）的计算方式算出方向；N1左右强字符反向，就继承段落基础方向；N2左右强字符同向，就近继承。 | ✅执行 | ✅执行 |
| I | Implicit Rules 隐式层级规则 | 第5步（N之后） | 计算最终Embedding Level，划分Bidi Run | 根据字符方向和当前level，冲突则level+1；相同连续level合并成Bidi Run | ✅执行 | ✅执行 |
| L | Lines Rules 行重排规则 | 第6步（I之后） | 生成屏幕绘制顺序 | 按行处理；从高level到低level遍历，奇数level反转Run内部字符顺序 | ✅执行 | ✅执行 |

**Bidi 控制字符就是一组看不见的零宽指令，用来<font color=red>干预</font>、<font color=red>引导</font>这套算法，手动指定文字方向、范围。**Bidi 控制字符分为两大类：**标记类**、**嵌入**、**重写类**、**现代隔离类**。
> 没有 Bidi 控制字符时，UBA（Bidi 算法）本身依然完整独立运行（隐式模式）；只是在混合 LTR/RTL 场景，自动推导的结果不一定符合人的预期。




#### 标记类
**1. 从左到右标记（LRM - Left-to-Right Mark，\u200e、&amp;lrm;）**: 插入一个标记，告诉 Bidi 引擎: **就近的文本基准方向是 LTR**，影响后面的弱类型的字符（一个简洁的基础例子: 阿拉伯语 - `الإصدار &lrm;1.2.0`，中文 - `版本 1.2.0` ）。

+ 隐式模式计算正确场景
    + 中文: `你好，Mr. Li! 很高兴见到你！` 。
    + 希伯来文: `שלום, Mr. Li! נעים לפגוש אותך!`。
    
  > 隐式计算逻辑
    1. 段落首字符：`ש`（希伯来字母，**强 RTL**）。
    2. Bidi 隐式判定：**整段段落基线方向 = RTL**。
    3. 分段渲染<br />
      1. `שלום,` : RTL 希伯来语，正常从右向左排。  
      2. `Mr. Li!` : 拉丁英文，属于 LTR 片段，嵌入在 RTL 段落内部，Bidi 会自动局部反转（放到右侧呈现）这个英文片段，英文单词顺序保持正确 Mr. Li。  
      3. `נעים לפגוש אותך!` : 后续希伯来语继续 RTL，**<font color=red>最终视觉顺序完全符合预期，不需要 LRM</font>**。

+ 隐式模式计算错误场景:
  + 中文: `房间 105, 房间 105`。
  + 希伯来文: `Room 105, חדר 105`。

  > 隐式计算逻辑
    1. 段落首字符：`R`（希伯来字母，**强 LTR**）。
    2. Bidi 隐式判定：**整段段落基线方向 = LTR**。
    3. 分段渲染<br />
      1. `Room 105, ` : LTR 拉丁英文 + ，正常从从向左排。  
      2. `חדר 105`&lrm; : 105 属于 EN 弱类型无独立方向，依附相邻字符，按照紧邻的希伯来语的 RTL，视觉呈现到了左侧（RTL 从右到左排版）。
    4. 纠错: 由于 105 视觉呈现到了左侧不符合语义，需要在希伯来语最后一个字符输入完成后通过增加一个 &amp;lrm; 标记影响后续的 105 弱类型字符，保持从左到右展示，再视觉上脱离了 RTL 布局保持语义，修正结果 `Room 105, חדר&lrm; 105`。

**2. 从右到左标记（RLM - Right-to-Left Mark，\u200f、&amp;rlm;）**: 插入一个标记，告诉 Bidi 引擎: **就近的文本基准方向是 RTL**，影响后面的弱类型的字符（原理同上，不过场景刚好相反，就不在赘述）。




#### 嵌入类
**1. 左到右嵌入（Left-to-Right Embedding，\u202a）**: 开辟一个新 Bidi 嵌入层级（embedding level），**主要用来修改该区域内中性字符的方向继承规则**；同时划定一个边界，**跨边界时弱字符的就近匹配不能穿透这个层级边界**。

**2. 右到左嵌入（Right-to-Left Embedding，\u202b）**: 逻辑同上。

> **结束 LRO/RLO/RLE/LRE 的方向控制（PDF - Pop Directional Formatting，\u202C）**: 栈弹出符，不是独立的开启标记。




#### 重写类
**1. 从左向右强制覆盖（LRO - Left-to-Right Override，\u202d）**: 强制**它后面所有字符**，无视字符本身的方向属性，**全部当作 “从左向右（LTR）” 渲染**（和 RLO 逻辑同理，参考 RLO 的具体示例）。

**2. 从右向左强制覆盖（RLO - Right-to-Left Override，\u202e）**: 强制**它后面所有字符**，无视字符本身的方向属性，**全部当作 “从右向左（RTL）” 渲染**。
 + 使用 RLO 强制定义后续文字的书写方式，e.g. 在希伯来语和英语混排的场景，直接在第一个字符定义 RLO 进行强制覆盖书写方式， `&#x202e;חדר 105 abc` -> &#x202e;חדר 105 abc&#x202C;，可以看到对于本身就是 RTL 的文字没有影响，对于非 RTL 字符全部进行强制翻转，105 也按照 RTL 方式呈现，依次输入 1 -> 0 -> 5，这几个字符就按照 RTL 渲染，就像希伯来语一样，导致了翻转渲染 501，以此类推，对 abc 也是。
 + 退出强制覆盖状态需要使用 `&#x202C;（PDF - Pop Directional Formatting）` 进行终止。
 + 该控制符最大的用途主要用在了木马欺骗，因为只是**视觉上反转显示，底层原始字符串不变**，e.g. 文件名 `test\u202egpj.exe` 在 windows 资源管理器中会显示为 `testexe.jpg`，常被用于木马伪装。

> **结束 LRO/RLO/RLE/LRE 的方向控制（PDF - Pop Directional Formatting，\u202C）**: 栈弹出符，不是独立的开启标记。




#### 现代隔离类
**1. 左向隔离（Left-to-Right Isolate，\u2066）**: 开启 LTR 隔离域；内外 Bidi 上下文隔离，不污染外部（替换 LRE）。


**2. 右向隔离（Right-to-Left Isolate，\u2067）**: 开启 RTL 隔离域；内外 Bidi 上下文隔离（替换 RLE）。


**3. 首强隔离（First-Strong Isolate，\u2068）**: 自动探测隔离块内第一个强字符，自动选择 LTR/RTL 隔离。
> 等价 HTML `dir="auto"`。

> + **隔离弹出符（PDI - Pop Directional Isolate，\u2069）**: 弹出 LRI/RLI/FSI 的隔离栈；**不能用来关闭 LRE/RLE/LRO/RLO**。
+ W3C/Unicode 推荐替代老旧 LRE/RLE/LRO/RLO，最大的区别在于老的写法如果没有写终止符持续影响后续文字，隔离类型的不会影响后续出现的强类型之后的字符（新的写法没有嵌入栈，不影响 level 的计算）。







































