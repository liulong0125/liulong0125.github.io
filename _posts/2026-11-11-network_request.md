---
layout: post
title: 网络请求
categories: [网络]
tags: [xhr, fetch]
---

本章主要介绍 `web` 开发中常见的接口请求 API: xhr(XMLHttpRequest) 和 Fetch。除此之外还有实时通信 API: EventSource 和 WebSocket。

# 网络请求
+ [xhr](#xhr)
  + [xhr核心特点梳理](#xhr核心特点梳理)
  + [xhr接受数据的方式](#xhr接受数据的方式)
+ [fetch](#fetch)
  + [fetch核心特点梳理](#fetch核心特点梳理)
  + [ReadableStream](#ReadableStream)
  + [SSE](#SSE)




## xhr
诞生于 1999 年的早期浏览器网络请求标准接口。基于**<font color=red>事件监听与回调</font>**机制，将整个 HTTP 请求视为一个完整的 "文档下载事务" （发请求 -> 等全部收完 -> 一次性拿到完整结果），主要用在不刷新页整个页面的情况下与服务器交换数据。



### xhr核心特点梳理
1. 事件驱动的异步模型（基于状态机）
  + 不返回 Promise，而是通过监听 onreadystatechange、onload、onprogress、onerror 等时间来追踪请求进度。
  > 日常我们使用的 jquery 和 axios 这种三方库调用 xhr 请求时，之所以能作为 Promise 处理是三方库做了内部封装。
  + 需要开发者手动在回调中检查 xhr.readyState (0 到 4 的状态变更) 与 xhr.status 来处理结果。
2. “全量事务”隐喻与内存积累机制
  + 设计之初是为了局部刷新一小段文本或 XML ，缺乏现代 “流（Stream）”的底层抽象。
  + 文本模式（responseType: 'text'）: 虽然能在 onprogress 中提前读取部分数据，但它是通过不断向 responseText 字符串末尾拼接实现的。已读数据无法释放，长连接极易导致内存溢出。
  + 二进制/JSON 模式（json/blob/arraybuffer）: 在数据完全接受完毕 (xhr.readyState === 4) 之前， xhr.response 始终为 null，无法做到流式边下边读。
3. 单对象有状态设计（复用与分装局限）
  + 每次请求都需要通过 `new XMLHttpRequest()` 实例化一个带有内部状态（请求头、方法、URL、状态码、响应体全部耦合在一起）的对象。
  + 一旦用于现代库（如早期的 jQuery.ajax 或默认模式下的 axios）将其封装为单层 Promise，只能在 `xhr.readyState === 4` 时，统一 resolve，从而掩盖了 `xhr.readyState === 2` （响应头到达）时的提前介入能力。
4. 天然支持上传/下载进度监控与请求终止
  + 在早期（fetch 出现前以及 fetch 上传进度尚未普及的年代），xhr 最大的优势是内置了直观的 xhr.onprogress（下载进度） 和 xhr.upload.onprogress（上传进度）事件，以及原生的 xhr.abort() 取消请求能力。




### 接受数据的方式
**通过 responseType 设置接受数据的方式**

| responseType 设置 | 接受过程的底层处理方式 | 请求结束后的最终动作 | 为什么进行中读（不）到? | 结果存放字段 |
| :-: | :-: | :-: | :-: | :-: |
| `""` 或 `"text"` | 边收字节，边用字符编码（如 utf-8）事实解码为字符串，追加到文本缓冲区 | 无额外动作，直接返回完整字符串 | 字符串拼接在 js 中是常规操作，浏览器允许你随时窥探当前拼好的字符串 | xhr.response 或 xhr.responseText |
| `json` | 同上 | 收到全部文本后，调用内置的 `JSON.parse()` 进行解析 | 不完整的 JSON 字符串（如 `{ "name": "张`）无法被解析成合法对象，所以进行中只能返回 null | xhr.response |
| `blob` | 不进行任何文本解码，直接将原始（不会像 `text` 和 `json` 类型那样进行字符翻译，比如 `0x72` 转换为字母 `H`）二进制字节存入字节（8个bit）缓冲区 | 接收完所有字节后，将其封装为一个不可变 `Blob` 实例 | `Blob` 是不可变对象（Immutable），无法动态追加长度，必须等总大小确定后才能实例化 | xhr.response |

> 浏览器拿到手的数据已经是规整的 Byte（字节）了。至于 0 和 1 的物理层信号处理，甚至比操作系统还要底层 - 是由硬件（网卡）和操作系统内核共同接力完成的。




**浏览器拿字节数据的流程**  

| TCP/IP协议分层 | 核心协议/概念 | 数据形态 | 负责处理的角色 | 核心动作 |
| :-: | :-: | :-: | :-: | :-: |
| 4.应用层 | HTTP/HTTPS/WebSocket | Byte 流 -> 字符串/JSON/Blob | 浏览器 | 从系统读取字节，解析 HTTP 报文，按照 responseType 加工后交给 js |
| 3.传输层 | TCP/UDP | 连续有序的 Byte 流 | 操作系统内核 | 校验数据完整性、按序号重组数据包、按端口号分发给浏览器 |
| 2.网络层 | IP | IP 数据包（Byte 数组） | 操作系统内核 | 识别源/目标 IP 地址，处理路由与分片重组 |
| 1.网络接口层 | 以太网/Wi-Fi | 物理信号（0 和 1 Bit 流） | 网卡硬件 + 驱动程序 | 将光/电电磁波信号解调为0/1，每 8 bit 打包成 Byte 存入内存 |








## fetch
fetch API 是现代浏览器提供的一种基于 Promise 和 WHATWG Streams （流规范）的网络请求标准接口。它抛弃了传统的“事件回调”设计，将 HTTP 请求与响应抽象为“接水龙头”的管道模型，让开发者能够以异步、分块、可控的方式尽处理网络数据。

### fetch核心特点梳理
1. 双阶段异步设计（解耦响应头与响应体）
  + 第一个 `await fetch(url)`: 仅等待 HTTP 响应头（Headers）到达。此时你可以通过 `status` （如 401、404）或者 `Content-Type` 决定是否继续接受后面的 `Body` ，避免无谓消耗带宽。
  + 第二个 `await response.json/text/blob/formData/arrayBuffer()`: 或通过 `response.body` （一个原生的 ReadableStream 可读流对象实例，这里是一个可读流字符对象）手动流式消费，让真正的数据传输(body)在异步流程中分批完成，不阻塞主线程。
  > 核心用途  
  > + 分离「网络错误」和「业务 / 解析错误」
  > + 支持流式处理（大文件、分片下载、SSE 类场景基础）
  >   + 区分一个概念: 后端哪怕是一次性把完整 JSON 字符串组装好再调用 `write()` 发出去，在 TCP 层面，到前端依然是分片的字节流；“后端一次性写出” ≠ “网络上一次性整块抵达浏览器”。`write()` 方法仅仅只是把数据丢给了操作系统的 TCP 发送缓冲区，不代表网络上一个包直接发完。
  >   + 第二个 promise : 流管道（ReadableStream）的读取本身是异步 IO，**响应头收到、body 传输刚开始、流还没关闭的时候**就 resolve fetch 的 Promise。此时流只是一个通道，里面字节还在路上；想要拿到里面的内容，就必须**<font color=red>异步去消费流</font>**，消费流的操作天然返回 Promise（需要不断的读取新到的字节进行消费处理），于是就形成了我们看到的两层 Promise 形态。

2. 原生支持流式读取（ReadableStream 与背压机制）
  + 暴露 `response.body` 作为原生的 `ReadableStream`。
  + 支持逐块读取(如 `response.body.getReader()` 或 `for await ...of` )或管道流转（`response.body.pipeThrough()/pipeTo()`）。
  + 采用块消费，读完即焚的内存管理方式，处理超大文件或无线长流（如 SSE、大文件下载）时不会造成内存溢出。
  > + **背压机制**: 下游消费速度跟不上上游生产速度，形成的回流压力；背压机制就是：下游告诉上游「我忙不过来了，先停一停，别再发数据」的**<font color=red>协调机制</font>**。  
  >   + **传导层级**: 自下而上，**应用层流缓冲区** → **TCP 接收缓冲区** → **后端 TCP 发送缓冲区**，发生背压时，数据只是暂停流转不是数据丢失。
  >   + **第一层**：JS 侧 ReadableStream 内部队列（highWaterMark 高水位阈值 - 字节体积，e.g. 32kb，64kb）由于消费流的速度慢，导致流内部队列达到了背压阈值，**浏览器不再从内核 TCP 接收缓冲区里继续捞字节喂给 JS 的 ReadableStream**。
  >   + **第二层**：操作系统内核的 TCP 接收缓冲区，由于当前流队列达到了阈值，浏览器不再读内核的 TCP缓冲区，该层级的缓冲区慢慢被填满，（这就是 TCP 自带的**传输层流量控制**，是背压真正落地到网络的地方）。
  > + 相关概念
  >   + **TCP协议**是面向字节流（byte-stream）的协议，传输单位就是字节。  
  >   涉及背压的 3 个 TCP 头介绍: 
  >
  >   | 字段名称 | 英文 | 作用 | 单位 |
| ---- | ---- | ---- | ---- |
| 序列号 | Sequence Number（seq） | 当前报文携带数据的第一个字节编号 | byte |
| 确认号 | Acknowledgment Number（ack） | 接收方期望收到的下一个字节编号，**<font color=red>TCP 是可靠传输，靠 ACK 确认数据有没有送达。</font>** | byte |
| 接收窗口大小 | Window Size | 接收方当前还能接收的字节上限，**<font color=red>接收方发送，跟随着 HTTP 头一起发送</font>** | byte |
  >
  >   + **TCP 的缓冲区（我们说的 TCP 栈缓冲区）是按【字节体积】算，不是按包的数量、不是按 write 调用次数。**


3. 现代化的 Promise 与管道隐喻
  + 彻底告别 xhr 时代晦涩的 `onreadystatechange` 事件回调。
  + 支持通过 `response.clone()` 将流分流（例如一路做实时前段展示，另一路在后台做离线缓存 `ServiceWorker + CacheStorage`）。
  > 如果只消费其中一条分支，另一条一直不读，整个 body 会全部缓冲在内存，大文件（视频、大二进制）会 OOM（内存溢出）！
所以它适合**小数据、并行快速读完两个分支**；不适合超大流式文件、两边消费速度差很大的场景。




### API 学习















































