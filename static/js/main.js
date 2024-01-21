// 文档加载完毕
$(document).ready(function() {
    console.log('文档加载完毕...');

    // 工具函数 - 截流函数
    function throttle(method, context, THROTTLE_TIME = 1000) {
        let arg = [].slice.call(arguments, 3);
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
            method.apply(context, arg);
        }, THROTTLE_TIME);
    }

    // index 首页博客列表跳转
    $('.gd-wrap-blogs').delegate('.gd-blogs', 'click', function(e) {
        var $this = $(this);

        window.open($this.attr('url'), '_blank');
    });



    // 分类 & 标签 & 返回顶部 内联跳转模块 ------------------------------------------------------------------
    // 分类点击
    $('#sidebar-category').delegate('.sidebar-item', 'click', function(e) {
        var hash = $(this).attr('hash');
        var type = $(this).attr('type');
        var target = $('#' + hash)[0];

        if (type === 'scroll') {
            target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        } else if (type === 'turn') {
            document.location.href = '/category/#' + hash;
        }
    });

    // 标签点击
    $('#sidebar-tag').delegate('.sidebar-item', 'click', function(e) {
        var hash = $(this).attr('hash');
        var type = $(this).attr('type');
        var target = $('#' + hash)[0];

        if (type === 'scroll') {
            target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        } else if (type === 'turn') {
            document.location.href = '/tag/#' + hash;
        }
    });

    // 返回顶部
    $('#scroll-top').click(function(e) {
        document.body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    });




    // 搜索模块 --------------------------------------------------------------------------------------------------
    var $searchLayer = $('#search-layer');
    var $input = $('#search-layer-input input');
    var $current = $('#search-current-result');
    var $history = $('#search-history-result');
    var database = window.localStorage.getItem('database');
    var history = window.localStorage.getItem('history');

    if (database) {
        database = JSON.parse(database);
    }

    if (history) {
        history = JSON.parse(history);
    }

    // 搜索 - 点击搜索框
    $('#search').click(function(e) {
        var htmlStr = '';

        $searchLayer.show();
        $input[0].focus();

        // 历史搜索展示
        if (history) {
            history.forEach(item => {
                htmlStr += '<div class="search-layer-result-item">' + htmlEscape(item) + '</div>';
            });
        } else {
            htmlStr = '<div class="search-layer-result-item empty">没有数据</div>';
        }

        $history.html(htmlStr);
    });

    // 搜索 - 点击取消
    $('#search-layer-input span').click(function(e) {
        $searchLayer.hide();
        $input.prop('value', '');
        $current.html('<div class="search-layer-result-item empty">没有数据</div>');
    });

    // 搜索 - 输入字符
    $('#search-layer-input input').keyup(function(e) {
        throttle(searchHandle, null, undefined, e)
    });

    // 搜索 - 输入字符 - 截流处理
    function searchHandle(e) {
        // 不存在时加载 json 文件
        if (!database) {
            $.get('/database.json').then(response => {
                database = response;
                window.localStorage.setItem('database', JSON.stringify(database));
                searchCallback(e);
            });
        } else {
            searchCallback(e);
        }
    }

    // 搜索 - 输入字符 - 回调函数
    function searchCallback(e) {
        var result = [];
        var value = e.target.value;
        var reg = new RegExp(quotemeta(value), 'ig');
        var htmlStr = '';

        // 搜索字符小于 2 的跳过
        if (value.length < 2) {
            return;
        }

        database.forEach(item => {
            if (item.title) {
                var title = item.title.split(reg);

                if (title.length >= 2) {
                    result.push({
                        title: title,
                        url: item.url
                    });
                }
            }
        });

        // 存在匹配结果
        if (result.length) {
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                var text = item.title.join('<i>' + htmlEscape(value) + '</i>');
                
                htmlStr += '<div class="search-layer-result-item" url="' + item.url + '">' + text + '</div>';
            }
        } else {
            htmlStr += '<div class="search-layer-result-item empty">没有数据</div>';
        }

        $current.html(htmlStr);
    }

    // 搜索 - 工具函数 - 转换 html 字符
    function htmlEscape(text) {
        return text.replace(/[<>"&]/g, function(match) {
            switch (match) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case '"':
                    return '&quot;';
            }
        })
    }

    // 搜索 - 工具函数 - 过滤正则元字符
    var regFilter = /[{}[\]*?.+:^$|()\\\-^]/g;

    function quotemeta(text) {
        regFilter.lastIndex = 0;

        return text.replace(regFilter, function(match) {
            return '\\' + match;
        })
    }

    // 搜索 - 搜索结果项点击（打开新的窗口）
    $current.delegate('div', 'click', function(e) {
        var $this = $(this);

        if ($this.hasClass('empty')) {
            return;
        } else {
            var search = $input.prop('value');

            if (history) {
                var index = history.indexOf(search);

                // 已存在重新排序到最前面
                if (index !== -1) {
                    history.splice(index, 1);
                }

                history.unshift(search);
            } else {
                history = [search]
            }

            window.localStorage.setItem('history', JSON.stringify(history));
            window.open($this.attr('url'), '_blank');
        }
    });

    // 搜索 - 搜索历史点击
    $history.delegate('div', 'click', function(e) {
        var $this = $(this);

        if ($this.hasClass('empty')) {
            return;
        } else {
            $input.prop('value', $this.text());
            $input.keyup();
        }
    });

    

    // 导航右侧悬停模块 --------------------------------------------------------------------------------------------------
    // 详情页 - 按照模板写 h1 下面会有 ul 目录结构
    var $structure = $('.markdown-body h1').next();
    var $structureFixed = $('#structure-fixed');
    var hList = [];
    var $aList = [];
    var hFilterList = [];

    // 有目录结构再处理
    if ($structure && $structure.size() === 1 && $structure.prop('tagName').toLowerCase() === 'ul') {
        // 添加独有的类名进行格式化，再进行元素循环添加序号
        $structure.addClass('structure');
        setSerialNumber($structure, '');

        // 添加滚动右下角导航高亮
        document.addEventListener('scroll', function(e){
            throttle(setCurrentPosition);
        }, false);

        // 克隆到右下角
        if (document.documentElement.clientWidth > 1080) {
            $structureFixed.removeClass('collapse');
        }
        $structureFixed.delegate('#structure-fixed-collapse', 'click', function() {
            $structureFixed.toggleClass('collapse');
        });
        $structureFixed.append($structure.clone());
        $aList = $structureFixed.find('a');
    }

    function setSerialNumber($ul, prefix) {
        $ul.each(curry(serialNumber, null, prefix));
    }

    function serialNumber(index, elm, prefix) {
        var $li = $(elm).children();

        $li.each(curry(serialNumberRecursive, null, prefix));
    }

    function serialNumberRecursive(index, elm, prefix) {
        var $a = $(elm).children('a');
        var $ul = $(elm).children('ul');
        var prefix = (prefix + (index + 1)) + '.';
        var html = prefix + $a.html();

        $a.html(html);

        // 给对应的 h 标签替换内容，并收集元素
        var hElm = $('[id=' + $a.attr('href').slice(1) + ']');

        if (hElm.size()) {
            hElm.html(html)
            hList.push(hElm[0]);
        }

        if ($ul.size()) {
            setSerialNumber($ul, prefix);
        }
    }

    function curry(fn, context) {
        var args = [].slice.call(arguments, 2);

        return function() {
            var innerArgs = [].slice.call(arguments);
            var finalArgs = innerArgs.concat(args);

            return fn.apply(context, finalArgs);
        }
    }

    // 设置右下角的目录
    function setCurrentPosition() {
        var target;
        hFilterList = []; // 筛选前先清空

        for (var i = 0; i < hList.length; i++) {
            var bounding = hList[i].getBoundingClientRect();
            // 标题在视口的上面的时候进行记录，只取负数里面最小的一个，用来应对视口之内没有标题的场景
            if (bounding.top < 0) {
                hFilterList[0] = hList[i];
            } else {
                if (bounding.top < document.documentElement.clientHeight) {
                    hFilterList[1] = hList[i];
                    break;
                }
                break;
            }
        }

        // 设置高亮效果
        if (hFilterList[1]) {
            target = hFilterList[1];
        } else if (hFilterList[0]) {
            target = hFilterList[0];
        }

        $aList.each(function(index, elm) {
            if (elm.getAttribute('href') === '#' + target.id) {
                elm.className = 'highlight';

                // 由于有滚动条，需要把当前高亮项滚动到顶部
                $('#structure-fixed .structure')[0].scrollTop = elm.offsetTop;
            } else {
                elm.className = '';
            }
        });
    }
});