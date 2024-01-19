---
layout: post
title: jQuery 分页插件
categories: [jQuery]
tags: [jQuery, 分页插件]
---

# jQuery 分页插件
+ [Css](#css)
+ [Js](#js)
+ [Html](#html)




## Css
```css
.ui-pagination {
    display: flex;
    border-left: 1px solid #e2e2e2;
    font-family: Tahoma,'Microsoft YaHei';font-size: 12px;line-height: 28px;

    .prev,
    .next {
        font-family: SimSun;
    }

    .item,
    .divide {
        border: 1px solid #e2e2e2;border-left: none 0;
        padding: 0 10px;
        color: #333
    }

    .item.selected,
    .item:hover {
        background-color: #274693;color: #fff
    }

    .divide {
        display: none;
    }


    .disabled {
        color: #e2e2e2;
    }

    .disabled:hover {
        color: #e2e2e2;
        background-color: #fff;
        cursor: not-allowed;
    }
}
```




## Js
```javascript
(function($){
	//字符串拼接函数
	var strObj = {
			divide: '<span class="divide">&hellip;</span>',
			prev: '<a class="item prev" href="javascript:void(0);">上一页</a>',
			next: '<a class="item next" href="javascript:void(0);">下一页</a>',
			items: '<a class="item" href="javascript:void(0);"></a>'
		};

    /*
        @初始化
    */
	function init(opts) {
		var self = $(this),
			page, // 需要计算的值
			reminder, // 页数修正
			str = '', // 拼接字符串
			cItems, // 绑定响应事件的元素集合
			cDivides, // 分隔元素集合
			hasDivide = false, // 一个标志位,表示是否存在分隔符
			leftRange, // 显示分隔符的左区间
			rightRange; // 显示分隔符的右区间

		page = parseInt(opts.total / opts.pageSize);
		reminder = opts.total % opts.pageSize;

		if (reminder !== 0) { // 页数修正
			page++;
		}

		if (opts.pageCount % 2 === 1) { // 修正pageCount,如果用户传入的不为偶数,如果直接使用影响到计算问题
			opts.pageCount++;
		}

		if(page >= opts.pageCount + 2) { // 判断是否显示分隔符(必须是要比显示页数打上2页以上才行)
			hasDivide = true;
		}
	
		if (opts.currentPage > page) { // 页码上限调整(有可能用户存入了书签,但是访问的数据被删掉了,总页码数已经小于当时存储的当前页)
			opts.currentPage = page;
		}

		leftRange = opts.pageCount; // 计算左分隔符区间就等于pageCount
		rightRange = page - (opts.pageCount / 2);
		rightDiff = opts.pageCount + opts.pageCount / 2 + 1; // 判断右区间的一个偏移值
		str = spellPage(page, opts.pageCount, hasDivide); // 结构拼接-只有初始化的时候会调用
		self.html(str);
		cItems = self.find('.item');
		cDivides = self.find('.divide');
		self.data('pagination', $.extend(
			{},
			opts,
			{
				page: page,
				hasDivide: hasDivide,
				cItems: cItems,
				cDivides: cDivides,
				leftRange: leftRange,
				rightRange: rightRange,
				rightDiff: rightDiff,
				prev: self.find('.prev'),
				next: self.find('.next')
			}));

		fillPageNumber.call(this); // 页码填充
		pageStatus.call(this); // 对应状态的管理

		if (typeof opts.loaded === 'function') { // 调用回调函数
			opts.loaded(opts.currentPage);
		}
	}
	
    /*
        @拼写页码字符串
            1. 判断当前页码是否在分隔符显示区间,没有分隔符的问题很简单
            2. 拼接的时候是拼接的完整结构,不进行页码填充
    */
	function spellPage(page, pageCount, hasDivide) {

		var str = '',
			start = 1,
			end;

		if (hasDivide) { // 存在分隔符-带分第二个分隔符,带尾巴
			end = pageCount + 1;

			for (;start <= end;start++) { // 以页码为准
				if(start === 1){ // 第一个分隔符
					str += strObj.items + strObj.divide;
				} else if (start === end) {
					str += strObj.divide + strObj.items;
				} else { //常规拼接
					str+=strObj.items;
				}
			}
		} else {
			end = page; // 以page为准
			for (;start <= end;start++) {
				str += strObj.items;
			}
		}

		return strObj.prev + str + strObj.next;
	}
	
	// 进行对应的角码值填充和显示隐藏
	function fillPageNumber() {
		var data = $(this).data('pagination'),
			start = 1, // 第一个页码(下标)
			end = data.page, // 最后一个页码(下表)[不存在翻页的情况下,下表就是等于页码数]
			pStart = 2, // 只有存在分隔符的分页类型才会用到一下三个变量
			pEnd,
			pageNumStart; // 第二个页码的起始值

        // 带分隔符(上下页 + pageCount + 3)
		if(data.hasDivide) {
			end = pEnd = data.pageCount + 1; // 下一页前面的位置

			if (data.currentPage < data.leftRange) { // 如果当前页码在左闭区间
				pageNumStart = 2;
			} else if (data.currentPage >= data.leftRange) { // 左区间以外
				pageNumStart = data.currentPage - data.pageCount / 2 + 1; // 起始页码计算方式固定不变

				if (data.page >= data.rightDiff) {
					if (data.currentPage >= data.rightRange) { // 只有总页数大于了最小右侧偏移量时,才有意义考虑右区间
						pEnd = data.page - pageNumStart + 2; // 修正的结束位置
					}
				} else {
					pEnd = data.page - pageNumStart + 2;
				}
			}

			data.cItems.each(function(currentPage) {
				var $this = $(this);

				if (currentPage === start) {
					$this.text(currentPage);
				} else if (currentPage >= pStart && currentPage < pEnd) { // 页码自增
					$this.text(pageNumStart);
					pageNumStart++;
					$this.show();
				} else if (currentPage === pEnd) { //剩下的隐藏
					$this.text(data.page).show();	
				} else if (currentPage > pEnd && currentPage <= end) {
					$this.hide();
				}
			});
		}else{
			//没有翻页的页码填充,只会在初始化时执行一次(点击事件就屏蔽掉)
			data.cItems.each(function(currentPage) {
				if(currentPage >= start && currentPage <= end) {
					$(this).text(currentPage);
				}
			});
		}
	}
	

    /*
        @对应状态的管理 - 状态调整-预防相邻的尾页和前一页出现...分隔符
    */
	function pageStatus() {
		var self = $(this),
			data = self.data('pagination'),
			which = data.currentPage; // 具体需要添加选中状态的那个元素的角码-在后面不停的进行修正(这个值是没有分隔符的情况下的正确值)

		
		if (data.hasDivide) { //存在分隔符
			if (data.currentPage >= data.leftRange) {
				which = data.pageCount / 2 + 1;
			}
		}

		data.cItems.removeClass('selected').eq(which).addClass('selected'); // 设置选中项

		// 设置上下页的状态
		if (data.page === 1) { // 如果只有1页
			data.prev.addClass('disabled');
			data.next.addClass('disabled');
		} else {
			data.prev.removeClass('disabled');
			data.next.removeClass('disabled');

			if (data.currentPage === 1) {
				data.prev.addClass('disabled');
			} else if (data.currentPage === data.page) {
				data.next.addClass('disabled');	
			}
		}

		if (data.hasDivide) { // 设置分隔符
			data.cDivides.show();

			if (data.currentPage < data.leftRange) {
				data.cDivides.eq(0).hide();
			} else if (data.currentPage >= data.rightRange) {
				data.cDivides.eq(1).hide();
			}
		}
	}

    /*
        @点击事件 直接调用 pageStatus 函数完成状态变更
    */
	function clickHanlder(target) {
		var data = $(this).data('pagination'),
			$target = $(target);

		if ($target.hasClass('item')) {
			if ($target.hasClass('disabled') || $target.hasClass('selected')) { // 如果是点击的 -禁用的翻页键- 和 -当前键- 结束
				return;	
			}

			if ($target.hasClass('prev')) {
				data.currentPage--;
			} else if ($target.hasClass('next')) {
				data.currentPage++;	
			} else {
				data.currentPage = $target.text();
			}

			
			if(data.hasDivide){ // 如果存在分隔符,页码重新填充
				fillPageNumber.call(this); // 页码重新填充
			}
			
			pageStatus.call(this); // 状态设置
			
			if (typeof data.currentChange === 'function') { //调用回调函数
				data.currentChange(data.currentPage);
			}
		}
	}
	
	//函数主体
	$.fn.pagination = function(opts) {
		var options = $.extend({}, $.fn.pagination.defaults, opts, strObj);

		return this.each(function() {
            var self = $(this),
                that = this;

			//由于功能简单只需要一个初始化函数即可
			init.call(this,options);
            self.delegate('.item', 'click', function(event) {
                clickHanlder.call(that,event.target);
            });
		});
	};

	// 默认参数
	$.fn.pagination.defaults = {
        total: 0, // 数据总条数
		pageCount: 8, // 页码按钮数量（非偶数转换为偶数）
		pageSize: 10, // 每页显示的条目数
		currentPage: 1, // 默认显示第一页,也有可能显示别的
		loaded: null, // 初始化回调函数
		currentChange: null //点击页码的回调函数-可以设置具体需要的hash键值对
	};
})(jQuery);
```




## Html
```html
<!-- 分页 -->
<div class="ui-pagination"></div>

<!-- 分页 -->
<script type="text/javascript">
    function loadedCallback(index) {
        console.log('[ui-pagination] loadCallback', index);
    }

    function currentChange(index) {
        var url = window.location.protocol + '//'  + window.location.host;

        if (index !== '1') {
            url += '{{ site.paginate_path }}'.replace(':num', index);
        }

        window.location.href = url;
    }

    $('.ui-pagination').pagination({
            total: {{ paginator.total_posts }},
            pageCount: 6,
            pageSize: {{ paginator.per_page }},
            currentPage: {{ paginator.page }},
            loaded: loadedCallback,
            currentChange: currentChange
        });
</script>
```