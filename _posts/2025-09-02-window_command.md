---
layout: post
title: windows 常用命令
categories: [windows]
tags: [常用命令]
---

本文主要介绍常用的 ``shell`` 命令。

# windows 常用命令
+ [服务](#服务)
+ [定时任务](#定时任务)


## 服务
1. ``win + r`` 后输入 ``services.msc`` 打开服务面板。
2. ``win + r`` 后输入 ``net start Spooler`` 启动。




## 定时任务
1. ``win + r`` 后输入 ``shutdown /s /f /t 3600`` 1小时候关闭电脑。
> + ``\s`` 关机。
+ ``\f`` 强制正在运行的应用程序关闭，不进行前台警告。
+ ``/t`` 多少秒后关闭。
+ **<font color=red>注：</font>**通过运行 ``shutdown /a`` 取消关机计划。