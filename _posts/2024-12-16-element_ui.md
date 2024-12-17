---
layout: post
title: elementUI 使用技巧
categories: [elementUI]
tags: [elementUI, UI库]
---

# elementUI 使用技巧

+ [el-select](#el-select)
+ [el-table](#el-table)




## el-select
1. teleported（仅 ``element-plus`` 支持）
是否使用 ``teleport`` （vue3 新特性）。设置成 ``true`` 则会被追加到 ``append-to`` 的位置。
> 用来解决 ``el-popover`` 中包含 ``el-select`` 选择下拉选项后触发了 ``el-popover`` 的弹层隐藏。


2. persistent（仅 ``element-plus`` 支持）
下拉框未激活时，不渲染弹层占位符 ``dom`` 元素，减少性能开销。




## el-table
1. header-cell-style

2. doLayout()