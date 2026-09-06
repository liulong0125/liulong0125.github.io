// 文档加载完毕
$(document).ready(function() {
    console.log('代码折叠...');

    $('div.highlighter-rouge').each((i, elm) => {
      var $elm = $(elm);

      if (elm.scrollHeight > 150) {
        $elm.append('<div class="view-all view-all-top">展开↓</div><div class="view-all view-all-bottom">展开↓</div>');
        $elm.addClass('locked');
      }
    });

    $(document).on('click', '.view-all', function(event) {
      var $target = $(event.target);
      var text =  $target.text();
      var $sibling;

      text === '展开↓' ? text = '收起↓' : text = '展开↓';
      $target.parent().toggleClass('locked');

      if ($target.hasClass('view-all-top')) {
        $sibling = $target.next();
      } else {
        $sibling = $target.prev();
      }

      $target.text(text);
      $sibling.text(text);
    });
});