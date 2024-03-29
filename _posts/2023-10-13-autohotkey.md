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
{% raw %}
```html
!1::Suspend
!2::Edit
!3::Reload

#IfWinActive ahk_class SWT_Window0 ;  微信小程序 IDE 热键定义

; ----------------1.  html & css----------------

:*:hdiv::<div></div>{Left 6} ; div标签
return

:*:htable::<table cellpadding="0" cellspacing="0" border="0"></table>{Left 8} ;table标签
return

:*:htr::<tr></tr>{Left 5} ;tr标签
return

:*:htd::<td></td>{Left 5} ;td标签
return

:*:hth::<th></th>{Left 5} ;td标签
return

:*:haa::<a href="{shift down}{3}{shift up}"></a>{Left 4} ;a标签
return

:*:hul::<ul></ul>{Left 5} ; ul标签
return

:*:h11::<h1></h1>{Left 5} ; li标签
return

:*:hdl::<dl></dl>{Left 5} ; dl 标签
return

:*:hdt::<dt></dt>{Left 5} ; dt 标签
return

:*:hdd::<dd></dd>{Left 5} ; dd 标签
return

:*:himg::<img src="" />{Left 4} ;img标签
return

:*:hh1::<h1></h1>{Left 5} ; h1标签
return

:*:hh2::<h2></h2>{Left 5} ;h2标签
return

:*:hh3::<h3></h3>{Left 5} ;h3标签
return

:*:hh4::<h4></h4>{Left 5} ; h4标签
return

:*:hpp::<p></p>{Left 4} ; p 标签
return

:*:hii::<i></i>{Left 4} ; i 标签
return

:*:hem::<em></em>{Left 5} ; em 标签
return

:*:hstrong::<strong></strong>{Left 9} ; strong标签
return

:*:hbb::<b></b>{Left 4} ; b标签
return

:*:hform::<form action="{shift down}{3}{shift up}" method="post"></form>{Left 7} ; form标签
return

:*:hcheck::<input type="checkbox" name=""/> ; checkbox标签
return

:*:hfield::<fieldset></fieldset>{Left 11} ; fieldset 标签
return

:*:hradio::<input type="radio" name="" /> ; radio 标签
return

:*:texth::<textarea name=""></textarea>{Left 11} ; textarea 标签
return

:*:hipt::<input type="text" name="" value="" /> ; input标签
return

:*:hslt::<select name=""></select>{Left 9} ; select 标签
return

:*:hopt::<option value=""></option>{Left 11} ; option 标签
return

:*:hlabel::<label></label>{Left 8} ; lable标签
return

:*:hbtn::<button type="button"></button>{Left 9} ; button 标签
return

:*:hspan::<span></span>{Left 7} ; span 标签
return

:*:hbr::<br /> ; br 标签
return

:*:hiframe::<iframe name="" frameborder="0" scrolling="no" src=""></iframe>{Left 11} ; iframe 标签
return

:*:hscript::<script src="" type="text/javascript"></script>{Left 34} ; script 标签
return

:*:hlink::<link rel="stylesheet" href="" type="text/css" />{Left 20} ; link 标签
return

:*:hheader::<header></header>{Left 9} ; header 标签
return

:*:hfooter::<footer></footer>{Left 9} ; footer 标签
return

:*:harticle::<article></article>{Left 10} ; article 标签
return

:*:hsection::<section></section>{Left 10} ; section 标签
return

:*:haside::<aside></aside>{Left 8} ; aside 标签
return

:*:htplt::<template></template>{Left 11} ; template 标签
return

:*:hblock::<block></block>{Left 8} ; block 标签
return

:*:htext::<text></text>{Left 8} ; text 标签
return

:*:hview::<view></view>{Left 7} ; text 标签
return

:*:hslot::<slot></slot>{Left 7} ; slot 标签
return

:*:psrc::position:relative; ; 相对定位
return

:*:psac::position:absolute; ; 绝对定位
return

:*:psfc::position:fixed; ; fix 定位
return

:*:bgcc::background-color:#;{Left 1} ; 背景色css
return

:*:bgic::background-image:;{Left 1} ; 背景图css
return

; ----------------2.  特殊字符----------------

:*:jj::''{Right}{Backspace}{Left}  ;  ' 单引号 - 针对 hbuilder 更改
return

:*:kk::""{Left}   ; " 双引号
return

:*:ll::{{}{}}{Left}   ; {} 花括号
return

:*:;;::{[}{]}{Left}   ; [] 中括号
return

; ----------------3.  js语句----------------

:*:jlog::console.log();{Left 2}  ; 输出 控制台语句
return

:*:jtab::console.table();{Left 2}  ; 输出 控制台语句
return

:*:jalt::alert();{Left 2}  ; [] 中括号
return

:*:jbyid::document.getElementById(''){Left 2}  ; byid 通过id获取元素
return

:*:jsto::setTimeout(function(){{}{}},2000);{Left 8}  ; setTimeout
return

:*:jsio::setInterval(function(){{}{}},1000);{Left 8}  ; setTimeout
return

; ----------------4.  单词----------------
:*:tplt::template ; template
return

; ----------------5.  mackdown 输入习惯定义----------------
:*:mdcenter::<center><font size=2 color=gray></font></center>{Left 16} ; 文字居中实现
return

:*:mdzhu::<font color=red>****</font>{Left 9} ; 注：红色加粗
return

:*:mdspan::<span id=""></span>{Left 9} ; span 标签添加 ID 进行跳转
return

:*:mdaa::<a href="{shift down}{3}{shift up}"></a>{Left 6} ; a标签输入跳转
return

; ----------------6.  输入习惯定义----------------
:*://::{Space}//{Space} ; 行尾注释空格
return

^;::  ; 冒号后自带空格
send {:}{Space}{Shift Down}{Shift Up}
return

^,::  ; 逗号后自带空格
send {,}{Space}
return

+Enter::  ; shift键+回车键  将光标移动到下一行
send {End}{Enter} 
return

CapsLock::  ; 大写键实现中英文切换，禁用 shift 和  ctrl 切换输入法，可避免使用 shift 别的组合键对输入法的冲突影响
send {Ctrl Down} {Space} {Ctrl Up}
return

+{:: ; {} 大括号
send {{}{}}{Left}
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

if GetKeyState("LCtrl")
{
send {Left}
return
}else if GetKeyState("Shift")
{
send {Up}
return
}else if GetKeyState("LAlt")
{
send {Right}
return
}else
{
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