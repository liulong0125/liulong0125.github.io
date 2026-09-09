---
layout: post
title: ahk 的使用
categories: [软件]
tags: [autohotkey]
---

AutoHotkey是一个windows上的开源软件，用于做自动化的处理 将所有用键盘操作和鼠标点击的事件自动化。

# 快捷键

+ [输入法配置](#输入法配置)
+ [AHK 热键配置](#ahk-热键配置)
+ [AHK 按键概览](#ahk-按键概览)
+ [Hbuilder 快捷键配置](#hbuilder-快捷键配置)
+ [VSCode 快捷键配置](#vscode-快捷键配置)




## 输入法配置
![输入法配置](/static/img/software/ahk/05.jpg)




## AHK 热键配置

+ 窗体激活设置
  + 单窗口激活使用 `#IfWinActive ahk_class 窗口类名`。
  + 多窗口激活使用 `#If WinActive("ahk_class SWT_Window0") || WinActive("ahk_class Chrome_WidgetWin_1")` 多敞口需要使用函数。
  + 如果不需要窗体限制删除限制条件就是针对全部窗口。
  + 常见的 窗口类名（ahk_class）
    + Windows 原生
      - 记事本：`ahk_class Notepad`
      - CMD 命令行：`ahk_class ConsoleWindowClass`
      - 文件资源管理器：`ahk_class CabinetWClass`
      - 任务管理器：`ahk_class TaskManagerWindow`
      - 新版 UWP 应用（计算器、照片）：`ahk_class ApplicationFrameWindow`
    + 浏览器 / Electron（Chromium 内核，全部共用一个 class）
      + Chrome、Edge、VSCode、Notion、Discord、Figma 客户端：`ahk_class Chrome_WidgetWin_1`
    + Java SWT
      + DBeaver、Eclipse、STS：`ahk_class SWT_Window0`
    + Qt 程序
      + 很多跨平台软件：`Qt5QWindowIcon` / `Qt6QWindowIcon`
    + 其他常用软件
      - Firefox 火狐：`ahk_class MozillaWindowClass`
      - PC 微信主窗口：`ahk_class WeChatMainWndForPC`
      - Word：`ahk_class OpusApp`
      - WPS 文字：`ahk_class Afx:400000:8`

+ 关于何时带有 return？
  + 当行模式无需带 return，非单行模式需要带。

{% raw %}
```html
!2::Edit
!3::Reload

; -------------------------------- 1.  html --------------------------------------------------

:*:hdiv::<div></div>{Left 6} ; div标签
:*:htable::<table cellpadding="0" cellspacing="0" border="0"></table>{Left 8} ;table标签
:*:htr::<tr></tr>{Left 5} ;tr标签
:*:htd::<td></td>{Left 5} ;td标签
:*:hth::<th></th>{Left 5} ;td标签
:*:haa::<a href="{shift down}{3}{shift up}"></a>{Left 4} ;a标签
:*:hul::<ul></ul>{Left 5} ; ul标签
:*:h11::<h1></h1>{Left 5} ; li标签
:*:hdl::<dl></dl>{Left 5} ; dl 标签
:*:hdt::<dt></dt>{Left 5} ; dt 标签
:*:hdd::<dd></dd>{Left 5} ; dd 标签
:*:himg::<img src="" />{Left 4} ;img标签
:*:hem::<em></em>{Left 5} ; em 标签
:*:hstrong::<strong></strong>{Left 9} ; strong标签
:*:hspan::<span></span>{Left 7} ; span 标签
:*:hbr::<br /> ; br 标签
:*:hiframe::<iframe name="" frameborder="0" scrolling="no" src=""></iframe>{Left 11} ; iframe 标签
:*:hscript::<script src="" type="text/javascript"></script>{Left 34} ; script 标签
:*:hlink::<link rel="stylesheet" href="" type="text/css" />{Left 20} ; link 标签
:*:hheader::<header></header>{Left 9} ; header 标签
:*:hfooter::<footer></footer>{Left 9} ; footer 标签
:*:harticle::<article></article>{Left 10} ; article 标签
:*:hsection::<section></section>{Left 10} ; section 标签
:*:haside::<aside></aside>{Left 8} ; aside 标签
:*:htplt::<template></template>{Left 11} ; template 标签
:*:hblock::<block></block>{Left 8} ; block 标签
:*:htext::<text></text>{Left 8} ; text 标签
:*:hview::<view></view>{Left 7} ; text 标签
:*:hslot::<slot></slot>{Left 7} ; slot 标签

; -------------------------------- 2.  特殊字符 -----------------------------------------------

:*:''::''{Left}  ;  ' 单引号
:*:""::''{Left}  ;  ' 双引号

; -------------------------------- 3.  js语句 -------------------------------------------------

:*:jlog::console.log();{Left 2}  ; 输出 控制台语句
:*:jtab::console.table();{Left 2}  ; 输出 控制台语句
:*:jsto::setTimeout(function(){{}{}}, 2000);{Left 9}{Enter 2}{Up}{Tab}  ; setTimeout

; -------------------------------- 4.  markdown 输入习惯定义 -----------------------------------

:*:mdcenter::<center><font size=2 color=gray></font></center>{Left 16} ; 文字居中实现
:*:mdzhu::<font color=red>****</font>{Left 9} ; 注：红色加粗
:*:mdversion::<div class="version-wrap" id=""><span class="version-anchor version-prev"target=""></span><span class="version-anchor version-next" target=""></span></div> ; 代码版本标记模板
:*:````::````{Left} ; 行内代码
:*:``cb::````````````{Left 3}{Enter 2}{Up 2}{Right 3} ; 代码块

; -------------------------------- 5.  输入习惯定义 --------------------------------------------

^;::  ; 冒号后自带空格
send {:}{Space}{Shift Down}{Shift Up}
return

+Enter::  ; shift键+回车键  将光标移动到下一行
send {End}{Enter} 
return

CapsLock::  ; 大写键实现中英文切换，禁用 shift 和  ctrl 切换输入法，可避免使用 shift 别的组合键对输入法的冲突影响
send {Ctrl Down} {Space} {Ctrl Up}
return

+Alt::  ; 选中当前行
send {Home}{Shift Down}{End}{Shift Up} 
return

+Tab:: ; 返回行首
send {Home}
return

+Ctrl:: ;返回行尾
send {End}
return

*RAlt:: ; 左右Ctrl+Alt 实现上下移动方向箭
if GetKeyState("LCtrl") {
  send {Left}
  return
} else if GetKeyState("Shift") {
  send {Up}
  return
} else if GetKeyState("LAlt") {
  send {Right}
  return
} else {
  send {Down}
  return
}
```
{% endraw %}




## AHK 按键概览
![按键概览](/static/img/software/ahk/01.jpg)




## Hbuilder 快捷键配置
![Hbuilder快捷键配置](/static/img/software/ahk/02.jpg)




## VSCode 快捷键配置
+ 中文语言配置
`contrl + shift + p` 输入 "Configure Display Language" 点击 en 下面的添加其它语言包，安装 Chinese 简体中文， 安装完成后重启再次 `contral + shift + p` 即可选择 “zh-cn" 简体中文。

+ 字体大小配置
“文件” - "首选项“ - ”设置“ - "Editor: Font Size" 配置编辑器文字大小

+ Tab 缩进配置
“文件” - "首选项“ - ”设置“ - "Editor: Tab Size" 配置编辑器 Tab 缩进的空格数量

+ 颜色配置
点击左下角齿轮图标，选择 ”颜色主题“

+ 快捷键配置
点击左下角齿轮图标，选择 ”键盘快捷方式“

![VSCode快捷键](/static/img/software/ahk/04.jpg)