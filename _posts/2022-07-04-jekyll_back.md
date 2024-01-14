---
layout: post
title: jekyll 的使用
categories: [其它]
tags: [其它]
---

jekyll 备份。

# jekyll + github 搭建个人静态博客站点
+ [jekyll 简介](#jekyll-简介)
+ [Liquid 简介](#liquid-简介)
+ [开发环境搭建](#开发环境搭建)
+ [快速搭建](#快速搭建)
+ [jekyll 配置项](#jekyll 配置项)
+ [实战](#实战)



------------------------ 未完成 ---------------------------

{% raw %}
```
1. jekyll-less 使用 less 写样式
2. 分页 Html 内的代码。
3. 全局变量：paginator 变量。
```
{% endraw %}



## jekyll 简介

**<font color=red>Jekyll 是一个静态网站生成器。用你喜欢的 标记语言书写内容并交给 Jekyll 处理，它将利用模板为你创建一个静态网站。你可以 调整你想要的网址样式、在网站上显示哪些数据 等等。</font>**

[中文官网](https://jekyll.com.cn)、[英文官网](https://jekyllrb.com/)、[主题模板官网](http://jekyllthemes.org/)

> +   **其它静态网站生成器：**
>     1. [hexo](https://hexo.io/docs/) 需要本地生成 html 上传，jekyll 只需要写 markdown 即可。
>     2. [hugo](#https://gohugo.io/documentation/)。



## Liquid 简介

[Liquid 教程](https://liquid.bootcss.com/basics/introduction/)

**<font color=red>Liquid是一种模板语言,可以在HTML页面中使用它;而他的作用就是使用标记、对象和过滤器的组合来加载一些动态内容（Jekyll 的模板语法使用的 Liquid 书写）。</font>**

### 组成结构

+   插值

    +   设置为文本

    {% raw %}
    ```html
    <div>{{ page.title }}</div>
    ```
    {% endraw %}

    +   设置为属性

    {% raw %}
    ```html
    <a href="/{{ page.permlink }}"></a>{{ page.title }}</a>
    ```
    {% endraw %}

    

+   标记

    +   控制文本设置

    {% raw %}
    ```html
    {% if page.title %}
    <div>一起学习 {{ page.title }}</div>
    {% endif %}
    ```
    {% endraw %}

    

    +   控制属性设置

    {% raw %}
    ```html
    <meta name="description" content="{% if page.title %}{{ page.title }}{% else %}{{ site.description }}{% endif %}" />
    ```
    {% endraw %}

    

+   过滤器

    +   改变输出

    {% raw %}
    ```html
    <!-- index.html -->
    <div>{{ "index" | append: ".html" }}</div>
    ```
    {% endraw %}

    

    +   多过滤器作用

    {% raw %}
    ```html
    <!-- Hello Jack! -->
    <div>{{ "jack!" | capitalize | prepend: "Hello " }}</div>
    ```
    {% endraw %}

    

### 操作符

+   基本操作符

    {% raw %}
    ```
    == 相等
    != 不相等
    > 大于
    < 小于
    >= 大于等于
    <= 小于等于
    or 逻辑或
    and 逻辑与
    ```
    {% endraw %}

    {% raw %}
    ```html
    {% if page.layout == "default" %}
    默认布局
    {% endif %}
    
    {% if product.type == "衬衣" or product.type == '短袖' %}
    商品为夏季装
    {% endif %}
    ```
    {% endraw %}

    

+   contains 包含

{% raw %}
```html
{% if page.title contains 'vue' %}
vue系列教程
{% endif %}

<!-- 检查字符串数组 -->
{% if site.data.test contains 'test1' %}
数组字符串包含 'test1' 字符串
{% endif %}
```
{% endraw %}



>   +   仅限检查字符串子串。
>   +   数组类型包含必须有子项和匹配项严格相等才行，字符串仅仅只是子串即可。



### 真值与假值

+   nil 和 false 之外的值都是真值

{% raw %}
```html
{% assign str = '' %}

{% if str %}
空字符串是真值
{% endif %}



{% assign num = 0 %}

{% if num %}
0 是真值
{% endif %}

```
{% endraw %}



### 数据类型

+   String 字符串 - 将变量的值包裹在单引号或双引号之中就声明了一个字符串。

{% raw %}
```html
{% assign str = '字符串声明' %}
```
{% endraw %}



+   Number  数值

{% raw %}
```html
{% assign numIntegar = 25 %}
{% assign numFloat = 25.0 %}
{{  numIntegar }}
{{  numFloat }}
```
{% endraw %}

>   +   浮点数的末尾 0 不会被清除。



+   Boolean 布尔值

{% raw %}
```html
{% assign t = true %}
{% assign f = false %}
{{  t }}
{{  f }}
```
{% endraw %}

>   +   直接输出，会转换为字符串 "true"、"false" 进行输出。



+   Nil 特殊空值

{% raw %}
```
不存在的变量输出{{ abc }}标签输出{{ page.xxx }}

{% if abc == nil %}
nil 判等
{% endif %}

{% if page.xxx == nil %}
nil 判等
{% endif %}
```
{% endraw %}

>   +   不存在的变量 abc 和不存在的对象属性 page.xxx 都不会输出（空格都不会）。
>   +   上述场景判等 nil 成立。



+   Array  数组，可以存储任何类型的数据。

    +   遍历数组

    {% raw %}
    ```html
    页面标签：
    {% for tag in page.tags %}
    {{ tag }}
    {% endfor %}
    ```
    {% endraw %}

    

    +   访问特定项

    {% raw %}
    ```html
    页面第一个标签：{{ page.tags[0] }}
    ```
    {% endraw %}

    

    +   初始化数组

    {% raw %}
    ```html
    <!-- 游泳 -->
    {% assign hoppysStr = '游泳,跑步,看书' %}
    {% assign hoppysArr = hoppysStr | split: ',' %}
    生成的数组第一项: {{ hoppysArr[0] }}
    ```
    {% endraw %}

    >   +   Liquid 语法不支持初始化数组，可以通过 filter 生成数组。



### 控制空白字符输出
{% raw %}
通过给插值和代码块设置 {{-  -}}、{%- -%} 来清除多余的空白字符。
{% endraw %}
![blogs-16](/static/img/blogs/blogs-16.jpg)



### 标记

+   注释

{% raw %}
```html
正文内容 {%- comment -%} 注释内容不输出 {%- endcomment -%} 输出。
```
{% endraw %}



+   控制流

    +   if endif

    {% raw %}
    ```
    {% if page.title %}
        {{ page.title }}
    {% endif %}
    ```
    {% endraw %}

    +   unless endunless 和 if 相反
    +   if elsif else endif

    {% raw %}
    ```
    {% assign num = 2 %}
    {% if num == 1 %}
    1
    {% elsif num == 2 %}
    2
    {% else %}
    {{ num }}
    {% endif %}
    ```
    {% endraw %}

    >   +   elsif 不是 elseif

    +   case when ese endcase

    {% raw %}
    ```
    {% assign num = 2 %}
    {% case num %}
        {% when 1 %}
    1
        {% when 2 %}
    2
        {% else %}
    {{ num }}
    {% endcase %}
    ```
    {% endraw %}



+   迭代/循环

    +   for in

    {% raw %}
    ```html
    {% for tag in page.tags %}
    {{ tag }}
    {% endfor %}
    ```
    {% endraw %}

    +   for in break/continue

    {% raw %}
    ```
    {% for i in (1..5) %}
        {% if i == 3 %}
            {% continue %}
        {% elsif i == 4 %}
            {% break %}
        {% else %}
            {{ i }}
        {% endif %}
    {% endfor %}
    ```
    {% endraw %}

    +   for in limit

    {% raw %}
    ```
    {% for i in (1..5) limit:3 %}
        {{ i }}
    {% endfor %}
    ```
    {% endraw %}

    +   for in offset

    {% raw %}
    ```
    {% for i in (1..5) offset:3 %}
        {{ i }}
    {% endfor %}
    ```
    {% endraw %}

    +   for in range(start..end)

    {% raw %}
    ```
    {% assign count = 5 %}
    {% for i in (1..count) offset:3 %}
        {{ i }}
    {% endfor %}
    ```
    {% endraw %}

    +   for in reversed 翻转循环

    {% raw %}
    ```html
    <!-- 5 4 3 -->
    {% assign count = 5 %}
    {% for i in (1..count) reversed offset:2 %}
        {{ i }}
    {% endfor %}
    
    <!-- 4 3 -->
    {% assign count = 5 %}
    {% for i in (1..count) reversed offset:2 limit:2 %}
        {{ i }}
    {% endfor %}
    ```
    {% endraw %}

    >   +   reversed 要放到 offset 后面。

    +   cycle 循环交替输出字符串

    {% raw %}
    ```html
    <!-- odd even odd even -->
    {% cycle 'odd', 'even' %}
    {% cycle 'odd', 'even' %}
    {% cycle 'odd', 'even' %}
    {% cycle 'odd', 'even' %}
    ```
    {% endraw %}

    +   tablerow in endtablerow 输出一个表格

    {% raw %}
    ```html
    <table>
        {% tablerow tag in page.tags %}
            {{ tag }}
        {% endtablerow %}
    </table>
    ```
    {% endraw %}

    {% raw %}
    ```html
    <table>
        {% tablerow tag in page.tags cols:2 %}
            {{ tag }}
        {% endtablerow %}
    </table>
    ```
    {% endraw %}

    >   +   设置 cols:2 后，如果 tags 超过了 2 个就会折行生成第二行 tr。

    {% raw %}
    ```html
    <table>
        {% tablerow tag in page.tags cols:2 limit:3 %}
            {{ tag }}
        {% endtablerow %}
    </table>
    ```
    {% endraw %}

    >   +   limit 针对的是项数量，比如 tags 有 4 项，第四项不会输出。

    {% raw %}
    ```html
    <table>
        {% tablerow tag in page.tags cols:2 offset:1 %}
            {{ tag }}
        {% endtablerow %}
    </table>
    ```
    {% endraw %}

    >   +   offset 对应的是从 0 开始。

    {% raw %}
    ```html
    <table>
        {% tablerow i in (1..5) cols:2 %}
            {{ i }}
        {% endtablerow %}
    </table>
    ```
    {% endraw %}

    >   +   range 同样适用于 tablerow。

    

+   raw endraw 原始内容

    {% raw %}
    ```html
    <!-- {% assign num = 10 %} -->
    \{% raw %\}
        \{% assign num = 10 %\}
    \{% endraw %\}
    ```
    {% endraw %}
    
    >   +   如果要输出代码片段最好使用 {% raw %} {% endraw %} 进行包裹，否则代码块中如果包含了 jekyll 语法（比如书写 ahk 脚本时的 {Left 5} 的会导致报错。
    
    
    
+   assign 变量
    
    +   常规声明。
    
    {% raw %}
    ```html
    {% assign num = 10 %}
        {{ num }}
    
    {% assign str = 'jack' %}
    {{ str }}
    ```
    {% endraw %}
    
    +   通过定义捕获区间创建变量初始值。
    
    {% raw %}
    ```html
    {% capture cVar %}
    变量的内容
    {% endcapture %}
    {{ cVar }}
    ```
    {% endraw %}
    
    +   increment 声明变量会自增长 / decrement 声明变量自减
    
    {% raw %}
    ```html
    <!-- 1 2 2 -->
    {% increment my_counter %}
    {{ my_counter }}
    {{ my_counter }}
    
    <!-- 2 3 4 4 -->
    {% increment my_counter %}
    {% increment my_counter %}
    {{ my_counter }}
    {{ my_counter }}
    
    <!-- 3 4 5 10 -->
    {% assign var = 10 %}
    {% increment var %}
    {% increment var %}
    {% increment var %}
    {{ var }}
    
    <!-- 3 4 5 6 -->
    {% increment var %}
    {% increment var %}
    {% increment var %}
    {{ var }}
    ```
    {% endraw %}
    
    >   +   increment 声明时会自增长，插值第一次输出时也会自增长。
    >   +   如果连续调用多次 increment 会根据总共调用的次数为基础值输出。
    >   +   当 assign 和 increment 同时定义同名变量时，assign 的插值输出优先级高。
    
    
    
### 过滤器

{% raw %}
```html
<!-- 数值：返回数值的绝对值 -->
{{ -17 | abs }}
<!-- 数值：浮点数向上取整: 2 -->
{{ 1.2 | ceil }}
<!-- 数值：限制数值的最小值: 5 -->
{{ 4 | at_least: 5 }}
<!-- 数值：限制数值的最大值: 3 -->
{{ 8 | at_least: 3 }}
<!-- 数值：向下取整 -->
{{ 1.2 | floor }}
{{ 1.9 | floor }}
{{ '1.2' | floor }}
{{ '1.9' | floor }}
<!-- 数值：四舍五入 -->
{{ 1.9 | round }}





<!-- 字符串：首字母转换大写: Jack -->
{{ 'jack' | capitalize }}
<!-- 字符串：字母全大写 -->
{{ 'abc' | upcase }}
<!-- 字符串：字母全小写 -->
{{ "Jack·Liu" | downcase }}
<!-- 字符串：前/后拼接，可以使用变量 -->
{{ ".html" | prepend: "index" }}
{{ '/about' | append: '.html' }}
{% assign file = '.html' %}
{{ '/about' | append: file  }}
<!-- 字符串：删除左侧和右侧空白字符 -->
a{{ '   a, b, c ' | lstrip | rstrip }}c
a{{ '   a, b, c ' | strip }}c
<!-- 字符串：删除所有子串 -->
{{ 'abcabc' | remove: 'a' }}
<!-- 字符串：删除第一个出现的子串 -->
{{ 'abcabc' | remove_first: 'a' }}
<!-- 字符串：替换所有子串 -->
{{ 'abcabc' | replace: 'a', '我' }}
<!-- 字符串：替换第一个出现的子串 -->
{{ 'abcabc' | replace_first: 'a', '我' }}
<!-- 字符串：字符串长度 & 点标记发 -->
{% assign st = 'abcd' %}
{{ st.size }}
<!-- 字符串：通过位置和长度截取子串 -->
{{ 'abcd' | slice: 1, 1 }}
<!-- 字符串：删除 Html 标签 -->
{{ 'I <i>am</i> jack' | strip_html }}
<!-- 字符串：删除 换行字符 -->
{% capture str %}
Hello
World
{% endcapture %}
{{ str | strip_newlines }}
<!-- 字符串：字符串截断，总长度要算上 ... 三个字符 -->
{{ "I am jack." | truncate: 7 }}
<!-- 字符串：字符串截断，自定义省略符，可以设置空字符清除 -->
{{ "I am jack." | truncate: 7, '' }}
<!-- 字符串：单词截断，总长度不需要要算上 ... 三个字符 -->
{{ "I am jack." | truncatewords: 2 }}
<!-- 字符串：urlencode 编码 & 解码 -->
{{ "龙神" | url_encode }}
{{ "%E9%BE%99%E7%A5%9E" | url_decode }}




<!-- 日期：格式化(大写为全称)： %a - 星期, %b - 月(英文), %m - 月(数值), %d - 日, %y 年, %H - 时, %M 分-->
{{ page.date | date: "%a, %b %d, %y" }}




<!-- 数组：合并为字符串 -->
{% assign arr = 'a, b, c' | split: ', ' %}
{{ arr | join: ', ' }}
<!-- 数组：翻转 -->
{{ 'a, b, c' | split: ', ' | reverse }}
<!-- 数组：输出首项 & 末项, 可以使用过滤器形式，也可以使用 点标记法 -->
{% assign arr = 'one, two, three' | split: ', ' %}
{{ arr.first }}
{{ arr.last }}
{% assign first = 'one, two, three' | split: ', ' | first %}
{% assign last = 'one, two, three' | split: ', ' | last %}
{{ first }}
{{ last }}
<!-- 数组：删除数组中的空值 nil -->
{% assign tags = site.posts | map: 'tags' | compact %}
{{ tags }}
<!-- 数组：合并 -->
{% assign tags1 = 'vue, javascript' | split: ', ' %}
{% assign tags2 = 'c, python' | split: ', ' %}
{% assign tags3 = 'go, 'java' | split: ', ' %}
{% assign tags = tags1 | concat: tags2 | concat: tags3 %}
{{ tags }}
<!-- 数组：筛选数组中的每一项的属性组成新的数组 -->
{% assign tagsList = site.posts | map: 'tags' %}
{% for tags in tagsList %}
    {% for tag in tags %}
        <div>{{ tag }}</div>
    {% endfor %}
{% endfor %}
<!-- 数组：数组长度 & 点标记法 -->
{% assign arr = '1, 2, 3' | split: ', ' %}
{{ arr }}
{% if arr.size > 2 %}
    数组项大于 2 项
{% endif %}
<!-- 数组：排序，自然排序 -->
{{ 'b, a, d, c' | split: ', ' | sort }}
<!-- 数组：排序，自然排序，忽略大小写 -->
{{ 'b, a, D, c' | split: ', ' | sort_natural }}
<!-- 数组：字符串数组去重 -->
{% assign arr = "ants, bugs, bees, bugs, ants" | split: ", " %}
{{ arr | uniq | join: ', '}}





<!-- 其它：默认值配置，未被定义的时候也有效 -->
{{ count | default: 2.99 }}
<!-- 其它：换行符转换为 <br/> 标签 -->
{% capture str %}
Hello
World
{% endcapture %}
{{ str | newline_to_br }}
<!-- 其它：数学运算 - 求商 -->
{{ 17 | divided_by: 4 }}
<!-- 其它：数学运算 - 减法 -->
{{ 4 | minus: 2 }}
<!-- 其它：数学运算 - 求模 -->
{{ 4 | modulo: 2 }}
<!-- 其它：数学运算 - 加法 -->
{{ 4 | plus: 2 }}
<!-- 其它：数学运算 - 乘法 -->
{{ 3 | times: 2 }}
```
{% endraw %}

>   +   split 过滤器的特别说明：
>
>   {% raw %}
>   ```html
>   <!-- 分隔符在末尾的时候不会再次分割,分隔符不在末尾的时候会分割 -->
>   <!-- result.size: 1 -->
>   {% assign result = 'a/' | split: '/' %}
>   {{ result.size }}
>   <!-- result.size: 2 -->
>   {% assign result = '/a' | split: '/' %}
>   {{ result.size }}
>
>   ```
>   {% endraw %}





## 开发环境搭建

### ruby & msys2 安装

[Ruby下载](https://rubyinstaller.org) - 一种计算机编程语言。

[MSYS2 下载](https://www.msys2.org/) - MSYS2 是 windows 下构建 shell 脚本的运行运行环境软件。



![blogs-05](/static/img/blogs/blogs-08.jpg)



![blogs-05](/static/img/blogs/blogs-07.jpg)

{% raw %}
```yaml
# 安装完成后验证
ruby -v

# 安装完成后的 gcc 目录, 
D:\Ruby27-x64\msys64\mingw64\bin

# 查看 gcc 版本
gcc --version
```
{% endraw %}

>   +   如果通过 ``ridk install`` 选择 3 后安装失败的化，可以去官网进行下载软件安装



### RubyGems 安装

+   [RubyGems下载](https://rubygems.org/pages/download)  - ruby 环境下安装依赖包命令 e.g ``gem install jekyll`` 安装 jekyll 开发包。

{% raw %}
```ruby
# 将下载的 rubygems-3.2.20.zip 文件解压到任意目录，并在目录下运行如下命令
ruby setup.rb

# 安装完成后执行如下命令查看安装结果
gem -v
```
{% endraw %}

>+   如果通过 "ridk install" 选择 3 后安装，会自动安装 RubyGems



+   配置镜像

{% raw %}
```json
gem sources --remove https://rubygems.org/
gem sources --add https://gems.ruby-china.com/
gem sources -l
gem sources --update
```
{% endraw %}

> +   确保只有 ``https://gems.ruby-china.com/`` 。
> +   ``gem update --system`` 网上说更新镜像后需要更新 gem 如果更新 gem 失败，下载稳定版本的 ruby 会有内置 gem。
> +   ``gem sources --update`` 更新源缓存。



### 安装 jekyll

{% raw %}
```json
// 必须安装, 安装成功后 jekyll -v 产看版本
gem install jekyll
// 如果使用的标记语言是Markdown(jekyll的默认 markdown 解析器是 maruku 性能没有 rdiscount 好, 需要在中配置 _config.yml markdown: rdiscount)，则需要另外安装
gem install rdiscount
// 如果使用的标记语言是Textile,则需要另外安装
gem install RedCloth
// 如需安装和github pages相同版本的jekyll，那么不需要安装上面这几个，直接用下面命令安装
gem install github-pages
// 如果需要分页插件
gem install jekyll-paginate
// 如果需要 bundler
gem install bundler

// 通过执行 bundle install 安装项目要求版本的 Gemfile & Gemfile.lock 的依赖包跑起来。
// 不过安装之前需要先配置 bundle 的源
// 修改 bundle 源，新增映射
bundle config mirror.https://rubygems.org/ https://gems.ruby-china.com/
// 删除旧映射
bundle config --delete https://rubygems.org/
// 安装项目依赖包
bundle install
```
{% endraw %}

>   +   如果安装 jekyll 报错且乱码，需要进入 cmd 切换系统语言 ``chcp 850``。
>
>   +   bundler 是 Gem 依赖管理工具，用来管理多版本 gem 的，查看版本`` bundler -v`` 。
>       +   如果安装爆各种版本不兼容问题，直接删除 Gemfile.lock 文件运行 ``bundle install`` 即可。
>
>   +   rvm 是用来管理多版本的 ruby 的，安装命令 ``curl -sSL https://get.rvm.io | bash -s stable``。
>   +   ``gem list`` 查看所安装的 gem 包。
>   +   gem 安装指定版本的包 ``gem install bundler -v 1.14.6`` 。



### 运行 jekyll

{% raw %}
```json
// 默认本地网址 http://localhost:4000
jekyll serve --server http://localhost:4000
// 如果你的博客网站是类似http://localhost:4000/blog/index.html这样的路径。那么，在运行时，需要添加参数base-url
jekyll serve --base-url '/blog' --server
// 命令行中指定端口号
jekyll serve --port 3000

// 创建模板
// 在当前目录下创建 testblog 博客目录
jekyll new testblog
// 进入目录
cd /d f:/testblog
// 启动服务
jekyll serve
```
{% endraw %}


> +   如果电脑安装了福昕阅读器，福昕阅读器的一个服务默认端口为 4000 与 jekyll 的默认端口号会冲突，可以通过 --port 3000 手动指定启动服务的端口号。
>
> +   自己创建时出现了问题，直接使用 fork 一个别人的仓可以直接运行。
>
> +   如果下载的模板里面存在 Gemfile 的话，可以直接把 Gemfile 删除就可以启动，也可以通过面的方式执行 bundle install 安装项目要求版本的依赖包跑起来，不过安装之前需要先配置 bundle 的源。



### 遇到的坑

![blogs-09](/static/img/blogs/blogs-09.jpg)

>   +   需要通过 ``bundle exec jekyll serve``  命令启动。



![blogs-05](/static/img/blogs/blogs-10.jpg)

>   +   遇到依赖包没有安装的，需要根据提示在 Gemfile 中添加对应的安装包。



![blogs-05](/static/img/blogs/blogs-11.jpg)

>   +   直接删除 ``Gemfile.lock`` 文件，重新执行 ``bundle install`` 。



## 快速搭建

[github](https://github.com/xudailong/xudailong.github.io)、[gitee.com](https://gitee.com/xudailong/xudailong)

**<font color=red>fork 成熟的个人博客仓入门，或者上 jekyll 主题官网下载一个模板。</font>**



![blogs-01](/static/img/blogs/blogs-01.jpg)

<center><font size=2 color=gray>克隆代码到自己 github 下</font></center>

![blogs-02](/static/img/blogs/blogs-02.jpg)

>   +   重命名项目为固定的格式。

![blogs-03](/static/img/blogs/blogs-03.jpg)

>   +   进入 github pages 页面配置。

![blogs-04](/static/img/blogs/blogs-04.jpg)

>   +   配置 github page。



![blogs-05](/static/img/blogs/blogs-05.jpg)

>   +   输入 github pags 个人域名即可访问。



## jekyll 配置项

[GitHub Pages 教程](https://docs.github.com/cn/pages)



### _config.yml

[yaml 教程](https://www.runoob.com/w3cnote/yaml-intro.html)

**<font color=red>全局配置文件。很多配置选项都会直接从命令行中进行设置，但是如果你把那些配置写在这儿，你就不用非要去记住那些命令了。</font>**

>   +   GitHub Pages 网站中的 _config.yml 的不能修改的默认配置。
>
>   {% raw %}
>   ```yaml
>   lsi: false
>   safe: true
>   source: [your repo's top level directory]
>   incremental: false
>   highlighter: rouge
>   gist:
>   noscript: false
>   kramdown:
>   math_engine: mathjax
>   syntax_highlighter: rouge
>                                                                   
>   ```
>   {% endraw %}



+   markdown 转换 & 语法高亮。

    +   官网默认配置。

        {% raw %}
        ```yaml
            # markdown 转换引擎。
            markdown            : kramdown
            highlighter         : rouge
            lsi                 : false
            excerpt_separator   : "\n\n"
            incremental         : false
            
        ```
        {% endraw %}
    
        
    
    +   常用的 markdown 转换引擎。
    
        +   kramdown - 转换引擎是 ruby 语言实现的解析器。
    
        +   rdiscount - 性能强于 maruku 。
    
        +   maruku - 默认转换引擎。
    
            >   +   ``markdown: rdiscount`` 需要安装 ``gem install rdiscount`` 。
    
            
    
    +   语法高亮配置。
    
        +   pygments - jekyll3.0 之前的默认语法高亮插件，该插件基于 python 环境, 所以很多教程里都让搭建 jekyll 之前先配置 python 环境。
        +   rouge - jekyll3.0 之后的默认语法高解析器。
        
        >   +   语法高亮配置。
        >
        >      {% raw %}
        >      ```yaml
        >      # 详细配置配置
        >      kramdown:
        >      math_engine: mathjax
        >      syntax_highlighter: rouge
        >      # 简单配置
        >      highlighter: rouge
        >                                                               
        >      # jekyll 3.0 后已弃用
        >      highlighter: pygments
        >      ```
        >      {% endraw %}

        >   +   使用第三方高亮工具 eg. ``highlight.js`` 。必须关闭 ``_config.yml`` 文件禁用 Jekyll 的语法高亮。\
        >
        >       {% raw %}
        >       ```
        >           kramdown:
        >               syntax_highlighter_opts:
        >                   disable: true
        >                                                                                                               
        >       ```
        >       {% endraw %}



+   plugins 配置。

    +   第一步： 配置  ``_config.yml`` 。

        {% raw %}
        ```yaml
        # Jekyll < 3.5.0 版本使用的字段是 gems: [jekyll-paginate]
        plugins: [jekyll-paginate]
        
        paginate: 20
        per_page: 20
        paginate_path: "/page:num/"
            
        ```
            {% endraw %}

    +   第二步： 配置 Gemfile 文件。

        {% raw %}
        ```yaml
        source 'https://gems.ruby-china.com/'
        
        group :jekyll_plugins do
        gem 'jekyll'
        gem 'jekyll-paginate'
        gem 'jekyll-gist'
        gem 'jekyll-watch'
        gem 'kramdown'
        gem 'rouge'
        end
            
        ```
        {% endraw %}

    +   第三步：执行 bundle install 安装 Gemfile 中列出的插件。

    >   +   GitHub Pages 使用默认启用且不能禁用的插件。
    >       +   jekyll-coffeescript
    >       +   jekyll-default-layout
    >       +   jekyll-gist
    >       +   jekyll-github-metadata
    >       +   jekyll-optional-front-matter
    >       +   jekyll-paginate
    >       +   jekyll-readme-index
    >       +   jekyll-titles-from-headings
    >       +   jekyll-relative-links

    

+   服务器配置。

    {% raw %}
    ```yaml
        # 服务器配置项。
        detach              : false
        port                : 4000
        host                : 127.0.0.1
        baseurl             : "" # does not include hostname
        show_dir_listing    : false
    ```
    {% endraw %}
        
    
        >   +   配置在 _config.yaml 中，就不需要 ``jekyll serve --port 4001``  启动的时候携带参数指定端口号了。



+   输出配置。

    {% raw %}
    +   ```yaml
        permalink           : date
        paginate_path       : /page:num
        ```
        {% endraw %}
        
        >   +    permalink 枚举值。
        >        +    date - /:categories/:year/:month/:day/:title.html
        >        +    pretty - /:categories/:year/:month/:day/:title/
        >        +    none - /:categories/:title.html 
        >        +    自定义 - ``permalink: /blog/:month-:day-:year/:title.html``



+   markdown 编译详细配置。

    {% raw %}
    ```yaml
        # Markdown Processors
        rdiscount:
          extensions        : []
        
        redcarpet:
          extensions        : []
        
        kramdown:
          auto_ids          : true
          entity_output     : as_char
          toc_levels        : 1..6
          smart_quotes      : lsquo,rsquo,ldquo,rdquo
          input             : GFM
          hard_wrap         : false
          footnote_nr       : 1
          show_warnings     : false
    ```
    {% endraw %}
    
    >     +   markdown 编译[具体配置项](https://www.jekyll.com.cn/docs/configuration/markdown/)。


### _posts

**<font color=red>存放已发布的博客的文件夹。</font>**

+   命名。

    +   文件命名需要和 _config.yml 中的 permalink 保持一致。

    >   +   eg. ``2015-07-11-welcome-to-jekyll.md`` 。
    >   +   文件名称不能为中文，否则就会找不到。

    

+   内容。

    {% raw %}
    ```markdown
        ---
        layout: post
        title: 我的第一篇博客
        categories: [vue]
        tags: [生命周期]
        ---
        
        # 欢迎访问
        
        **你好**, 这是我的第一篇博客.
        
        希望你能喜欢!
    ```
    {% endraw %}

    >   +   layout - 配置博客文章使用的布局页面，值为位置存放在 ``_layouts`` 文件夹下的 ``html`` 文件名。
    >
    >   +   title - html 页面的 title。
    >
    >   +   categories - 文章所属的类目。
    >
    >       >   +   categories: [javascript, vue] 生成的就是2级目录 ``/javascript/vue/2015/07/11/hello-jekyll.html``
    >       >
    >       >   +   如果只有一个就不需要数组包裹。
    >
    >   +   tags - 文章的标签。

      

    

+   全局变量。

    +   content 变量。- 引用的文件的内容，一层一层嵌套。

        ![blogs-13](/static/img/blogs/blogs-13.jpg)

        >   +   对于 about 页面和 index 页面而言 \{\{  content \}\} 就是 html 本身，对于 _posts 下的 markdown 文件而言 \{\{  content \}\} 就是 markdown 文件本身。
    
        
    
    +   paginator 变量。
    
        **<font color=red>使用范围仅限于 index.html 文件中。index.html 文件的位置可以位于子目录中 ``blog/index.html``。</font>**
    
        +   基本配置。
        
        {% raw %}
        ```html
        # _config.yml 文件分页配置
        # ----------------------- 插件 -----------------
        plugins: [jekyll-paginate, jekyll-gist]
        # 分页中每页显示 5 条博客
        paginate: 2
        paginate_path: "/page:num/"
        ```
        {% endraw %}
        
        
        
        +   属性大全。

        | 属性名 | 描述 |
        | --- | --- |
        | `paginator.page`              | 当前页面的编号                            |
        | `paginator.per_page`            | 每页的帖子数                              |
        | `paginator.posts`              | 当前页面可用的帖子                        |
        | `paginator.total_posts`        | 帖子总数                                  |
        | `paginator.total_pages`        | 总页数                                    |
        | `paginator.previous_page`      | 上一页的编号，或者`nil`如果不存在上一页   |
        | `paginator.previous_page_path` | 上一页的路径，或者`nil`如果不存在上一页   |
        | `paginator.next_page`          | 下一页的编号，或者`nil`如果不存在后续页   |
        | `paginator.next_page_path`     | 下一页的路径，或者`nil`如果不存在后续页面 |

    
    
    +   site 变量。- 存在于全局 \_includes、_layouts、根目录 html 文件。
    
        +   site.categories
    
        {% raw %}
        ```
        {% for category in site.categories %}
            <h3>{{ category[0] }}</h3>
            <ul>
                {% for post in category[1] %}
                    <li><a href="{{  post.url }}">{{ post.title }}</a></li>
                {% endfor %}
            </ul>
        {% endfor %}
        ```
        {% endraw %}
        
        >   +   site.categories 循环的 category 为整个博客内容。category[0] 为博客的目录。category[1] 为博客的正文。
        >   +   category[1] 有 url 和 title 属性。
        
        
        
        +   site.tags
        
        {% raw %}
        ```html
        {% for tag in site.tags %}
            <h3>{{ tag[0]}}</h3>
            <ul>
                {% for post in tag[1] %}
                    <li><a href="{{  post.url }}">{{ post.title }}</a></li>
                {% endfor %}
            </ul>
        {% endfor %}
        ```
        {% endraw %}
        
        >   +   tag[1] 和 category[1] 一样都是存放的博客的 url 和 title 属性。
        
        
        
        +   site.posts
        
        {% raw %}
        ```html
        ---
        layout: post
        title: 我的第一篇博客
        categories: [vue]
        tags: [生命周期, 组件通信]
        excerpt_separator: <!--more-->
        ---
        
        # 欢迎访问
        
        **你好**, 这是我的第一篇博客.
        说真的，挺有趣的~！
        <!--more-->
        希望你能喜欢!
        
        <ul>
          {% for post in site.posts %}
            <li>
              <a href="{{ post.url }}">{{ post.title }}</a>
              {{ post.excerpt }}
            </li>
          {% endfor %}
        </ul>
        ```
        {% endraw %}
        
        >   +   会输出从 “# 欢迎访问.... 说着的挺有趣的~!" 结束。如果不设置摘录默认 ``post.excerpt`` 获取第一段落。
        
        
        
        +   属性大全。
        
        | 属性名                      | 描述                                                         |
        | --- | --- |
        | `site.time`                 | 当前时间（运行`jekyll`命令时）。                             |
        | `site.pages`                | 所有页面的列表。                                             |
        | `site.posts`                | 所有帖子的反向时间列表。                                     |
        | `site.related_posts`        | 如果正在处理的页面是一个帖子，则它包含最多十个相关帖子的列表。默认情况下，这些是最近的十个帖子。要获得高质量但计算速度慢的结果，请使用（[潜在语义索引](https://en.wikipedia.org/wiki/Latent_semantic_analysis#Latent_semantic_indexing)）选项运行`jekyll`命令。另请注意，GitHub Pages在生成站点时不支持该选项。`--lsi``lsi` |
        | `site.static_files`         | 所有[静态文件](https://www.jekyll.com.cn/docs/static-files/)的列表（即没有被 Jekyll 的转换器或 Liquid 渲染器处理的文件）。每个文件有五个属性：`path`、`modified_time`、`name`和。`basename``extname` |
        | `site.html_pages`           | `site.pages`列出以 . 结尾的子集`.html`。                     |
        | `site.html_files`           | `site.static_files`列出以 . 结尾的子集`.html`。              |
        | `site.collections`          | 所有集合（包括帖子）的列表。                                 |
        | `site.data`                 | 包含从位于`_data`目录中的 YAML 文件加载的数据的列表。        |
        | `site.documents`            | 每个集合中所有文档的列表。                                   |
        | `site.categories.CATEGORY`  | 类别中所有帖子的列表`CATEGORY`。                             |
        | `site.tags.TAG`             | 带有标签的所有帖子的列表`TAG`。                              |
        | `site.url`                  | 包含您网站的 url，因为它在`_config.yml`. 例如，如果您`url: http://mysite.com`的配置文件中有，那么它可以在 Liquid 中以`site.url`. 对于开发环境有[一个例外](https://www.jekyll.com.cn/news/#3-siteurl-is-set-by-the-development-server)，如果你是`jekyll serve`在开发环境中运行，`site.url`将设置为 、 和 SSL 相关选项的`host`值`port`。这默认为`url: http://localhost:4000`. |
        | `site.[CONFIGURATION_DATA]` | 通过命令行设置的所有变量`_config.yml`都可以通过`site`变量获得。例如，如果您`foo: bar`的配置文件中有，那么它可以在 Liquid 中以`site.foo`. Jekyll 不会解析对`_config.yml`in`watch`模式的更改，您必须重新启动 Jekyll 才能看到变量的更改。 |
    
    
    
    
    
    +   page 变量。- 当 include 的内容为 .md 文件时，page 变量可用。
    
        +   预定义全局变量 - 在 markdown 文件开头定义。
    
        {% raw %}
        ```html
        ---
        layout: post
        title: 我的第一篇博客
        categories: [vue]
        tags: [生命周期, 组件通信]
        excerpt_separator: <!--more-->
        permalink: 2015-07-11-blog1
        published: true
        ---
        ```
        {% endraw %}
        
        >   +   layout - 博客嵌入的布局页面，与 _layouts 文件夹下的文件名称对应。
        >   +   permalink - 博客的自定义 URL 可以单独设置，必须是具体的值而不是格式配置。
        >   +   published - 设置为 false 时不会显示。
        
        
        
        +   自定义变量 - 在 post 的 html 内部访问。
        
        {% raw %}
        ```html
        ----
        hoppy: running
        ----
        
        <h1>{{ page.hoppy }}</h1>
        ```
        {% endraw %}
        
        
        
        +   预定义页面变量。
        
            {% raw %}
            ```
            page.date - 日期格式 YYYY-MM-DD HH:MM:SS +/-TTTT。
            page.categories/tags。        
            ```
            {% endraw %}
        
        
        
        +   属性大全。
        
        | 属性名            | 描述                                                         |
        | --- | --- |
        | `page.content`    | 页面的内容，渲染或未渲染取决于正在处理的 Liquid 以及正在处理的内容`page`。 |
        | `page.title`      | 页面的标题。                                                 |
        | `page.excerpt`    | 文档的未渲染摘录。                                           |
        | `page.url`        | 帖子的 URL，不带域，但带有前导斜杠，例如`/2008/12/14/my-post.html` |
        | `page.date`       | 分配给帖子的日期。这可以通过在格式中指定新的日期/时间`YYYY-MM-DD HH:MM:SS`（假设为 UTC）或`YYYY-MM-DD HH:MM:SS +/-TTTT`（使用与 UTC 的偏移量来指定时区。例如`2008-12-14 10:30:00 +0900`）在 Post 的前面事项中被覆盖。 |
        | `page.id`         | 集合或帖子中文档的唯一标识符（在 RSS 提要中有用）。例如`/2008/12/14/my-post``/my-collection/my-document` |
        | `page.categories` | 此帖子所属的类别列表。类别源自目录上方的目录结构`_posts`。例如，在 的帖子`/work/code/_posts/2008-12-24-closures.md`会将此字段设置为`['work', 'code']`。这些也可以在[front matter](https://www.jekyll.com.cn/docs/front-matter/)中指定。 |
        | `page.collection` | 此文档所属的集合的标签。例如`posts`，对于一个帖子，或者`puppies`对于一个位于 path 的文档`_puppies/rover.md`。如果不是集合的一部分，则返回一个空字符串。 |
        | `page.tags`       | 这篇文章所属的标签列表。这些可以在[front matter](https://www.jekyll.com.cn/docs/front-matter/)中指定。 |
        | `page.dir`        | 源目录与文章或页面文件之间的路径，例如`/pages/`. 这可以被`permalink`前面的[内容](https://www.jekyll.com.cn/docs/front-matter/)覆盖。 |
        | `page.name`       | 帖子或页面的文件名，例如`about.md`                           |
        | `page.path`       | 原始帖子或页面的路径。示例用法：链接回 GitHub 上的页面或帖子源。这可以在[前面的事情](https://www.jekyll.com.cn/docs/front-matter/)中被覆盖。 |
        | `page.next`       | 下一篇文章相对于当前文章在 中的位置`site.posts`。返回`nil`最后一个条目。 |
        | `page.previous`   | 上一篇文章相对于当前文章在 中的位置`site.posts`。返回`nil`第一个条目。 |


+   静态资源。
    +   eg. ``/assets/img/avatar.png`` 图片存放路径。使用时用 markdown 语法引入图片即可 ``![avatar](/assets/avatar.png)`` 。



### _drafts

**<font color=red>drafts 是未发布的文章。这些文件的格式中都没有 title.MARKUP 数据。</font>**



### _includes

{% raw %}
**<font color=red>你可以加载这些包含部分到你的布局或者文章中以方便重用。可以用这个标签 {% include file.ext %} 来把文件 _includes/file.ext 包含进来。html 片段。</font>**
{% endraw %}

>   +   该目录下只能存放 html 片段，不存在开头变量声明。
>   +   片段可以互相引用。


+   包含 ``_include`` 目录的文件。

{% raw %}
```html
{%  include footer.html %}
```
{% endraw %}



+   包含非 ``_include`` 目录的文件。

{% raw %}
```html
{% include_relative mydir/footer.html %}
```
{% endraw %}



+   通过变量引入。

{% raw %}
```html
{% assign test = 'test.html' %}
{% include {{ test }} %}
```
{% endraw %}

>   +   需要将变量使用 \{\{  \}\} 包裹起来。



+   引入时注入变量。

    +   基本使用。

    {% raw %}
    ```html
    {% include note.html param="我是参数" title="片段标题" %}
    
    
    <div>
    	<span>携带的参数：</span><b>{{ include.param }}</b>
    </div>
    ```
    {% endraw %}

    >   +   如果有多个参数，使用空格分开即可。
    >   +   考虑到不携带参数的场景，可以使用 {{ include.param  | default: "xxx" }} 过滤器来设置默认值。

    

    +   传递变量。

        +   需要传递带有变量的字符串：``"The latest version of {{ site.product_name }} is now available."`` 。

        {% raw %}
        ```html
        {% capture download_note %}
        The latest version of {{ site.product_name }} is now available.
        {% endcapture %}
        
        {% include note.html content=download_note %}
        ```
        {% endraw %}

+   布局变量定义。

{% raw %}
```html
---
layout: default
city: xian
---
<h1>{{  layout.city }}</h1>
```
{% endraw %}

>   +   布局变量声明存在于 _layouts 文件夹中，在 _includes 文件夹下定义无效。



+   页面布局集成。

    +   ``_layouts`` 目录下的 ``html`` 文件配置 ``layout: default`` 就能继承 ``_layout/default.html`` 的页面布局。



### _layouts

**<font color=red>layouts 是包裹在文章外部的模板。布局可以在 YAML 头信息中根据不同文章进行选择。 这将在下一个部分进行介绍。标签 {{ content }} 可以将content插入页面中。</font>**



### _data

**<font color=red>放一些其他配置文件，格式可以是 ``.yml/.yaml/.json/.csv``。比如有一个文件叫members.json,如果想引用这个文件里的内容就通过site.data.membres来引用。</font>**





## 实战



{% raw %}
```
待完成：

	1. head.html 的 <title> 标签未判断 page 不存在时，显示 site.title。
	2. head.html 的 link 搜索引擎收录的字段生成，未使用 tags，也未判断是否存在 page 的场景。
	3. 分页模块。
```
{% endraw %}





### 目录结构搭建

+   根目录
    +   about.html - 关于
    +   index.html - 网站索引

+   \_includes 目录
    +   head.html - ``<head>`` 标签内容。
    +   header.html - 页眉。
    +   navigation.html - 左侧导航。



### 静态文件

+   scss 的使用。

![blogs-14](/static/img/blogs/blogs-14.jpg)



### 模块设计

+   navigation 模块。

    +   导航项目配置。

    ![blogs-15](/static/img/blogs/blogs-15.jpg)

    >   +   ``_data`` 目录下的 json 文件通过 site 全局变量 site.data.xxx 进行访问。

    

    +   导航选中项配置。
    
    ![blogs-16](/static/img/blogs/blogs-17.jpg)



+   文章列表。

    +   使用全局对象 paginator.posts 进行博客循环。

    {% raw %}
    ```
    // 日期格式
    {{  post.date | date: "%Y-%B-%D" }}
    
    // 概要使用 content + 字符截断 就可以生成
    {{ post.content | strip_html | truncate: 40 }}
    ```
    {% endraw %}

    

+   tags 模块。



### 插件使用

+   锚点跳转



### 搜索功能

**<font color=red>基于网站根目录配置的 site.xml/json 文件通过把网站的 posts 内容遍历生成后，通过 ajax 请求返回结果与关键字进行匹配后插入搜索的结果列表中，每一项都有 url。</font>**