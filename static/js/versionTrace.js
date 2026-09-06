// 文档加载完毕
$(document).ready(function() {
    console.log('版本追溯...');

    $(document).on('click', '.version-anchor', function(event) {
      console.log('点击版本按钮', event.target);
      var $target = $(event.target);
      var codeId = $target.attr('target');

      var $codeElm = $('#' + codeId).next().clone();

      $codeElm.removeClass('locked');
      $codeElm.find('.view-all').remove();
      $('#dialog-version').html($codeElm).show();
    });

    $(document).on('dblclick', '#dialog-version', function(event) {
      $('#dialog-version').css({
        left: '200px',
        top: 'initial',
        bottom: '0px',
        'max-height': '460px'
      }).hide();
    });
});