---
layout: post
title: ahk 的使用
categories: [软件]
tags: [autohotkey]
---

AutoHotkey是一个windows上的开源软件，用于做自动化的处理 将所有用键盘操作和鼠标点击的事件自动化。

# 快捷键

+ [准备工作](#准备工作)
+ [AHK 热键配置](#ahk-热键配置)
+ [AHK 按键概览](#ahk-按键概览)




## 准备工作
1\. 新增一个英文输入键盘“英文(美国)美式键盘”，中文输入法只保留搜狗输入法其它的删除（设置 Ctrl + Space 为中英文到搜狗输入法切换，后面的热键定义未占用该按键组合），高级设置保留 Ctrl + Space 进行搜狗和英文键盘切换。

![ahk_05](/static/img/software/ahk/05.jpg)

![ahk_03](/static/img/software/ahk/03.jpg)

> 进入方式（ win7 系统）: 开始菜单 → **控制面板** → **时钟、语言和区域** → **更改键盘和其他输入法** -> **键盘和语言** -> **更改键盘**

2\. 设置搜狗输入法的中英文切换为“无”，避免 Ctrl 或 Shift 被后面定义的热键影响了中英输入法，同时将搜狗输入法停留在中文。

![ahk_02](/static/img/software/ahk/02.jpg)

![ahk_04](/static/img/software/ahk/04.jpg)


## AHK 热键配置

+ 窗体激活设置
  + 单窗口激活使用 `#IfWinActive ahk_class 窗口类名`。
  + 多窗口激活使用 `#If WinActive("ahk_class SWT_Window0") || WinActive("ahk_class Chrome_WidgetWin_1")` 多窗口需要使用函数。
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
!1::Suspend
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

; -------------------------------- 2.  js语句 -------------------------------------------------

:*:jlog::console.log();{Left 2}  ; 输出 控制台语句
:*:jtab::console.table();{Left 2}  ; 输出 控制台语句
:*:jsto::setTimeout(function() {{}{}}, 2000);{Left 9}{Enter 2}{Up}{Tab}  ; setTimeout

; -------------------------------- 3.  markdown 输入习惯定义 -----------------------------------

:*:mdcenter::<center><font size=2 color=gray></font></center>{Left 16} ; 文字居中实现
:*:mdzhu::<font color=red>****</font>{Left 9} ; 注：红色加粗
:*:mdversion::<div class="version-wrap" id=""><span class="version-anchor version-prev"target=""></span><span class="version-anchor version-next" target=""></span></div> ; 代码版本标记模板
:*:````:: ```` {Left 2} ; 行内代码
:*:``cb::````````````{Left 3}{Enter 2}{Up 2}{Right 3} ; 代码块

; -------------------------------- 4.  输入习惯定义 --------------------------------------------

^'::  ; 输出单引号
send {' 2}{Left}
return

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