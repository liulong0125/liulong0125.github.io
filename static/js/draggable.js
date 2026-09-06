(function () {
  var dragging = null;
  var zooming = null;
  var diffX = 0;
  var diffY = 0;

  function handleEvent(event) {
    var target = event.target;

    switch(event.type) {
      case 'mousedown':
        do {
          if (target.className && target.className.indexOf('draggable') > -1) {
            dragging = target;

            break;
          }

          target = target.parentNode;
        } while (target);

        if (dragging) {
          diffX = event.clientX - dragging.offsetLeft;
          diffY = event.clientY - dragging.offsetTop;
        }
        break;
      case 'mousemove':
        if (dragging) {
          dragging.style.bottom = 'initial'; // 重置默认的底部距离
          dragging.style.left = (event.clientX - diffX) + 'px';
          dragging.style.top = (event.clientY - diffY) + 'px';
        }
        break;
      case 'mouseup':
        dragging = null;
        break;
      case 'mousewheel':
        var zooming;

        do {
          if (target.className && target.className.indexOf('draggable') > -1) {
            zooming = target;

            break;
          }

          target = target.parentNode;
        } while (target);
        
        if (zooming) {
          event.preventDefault();
          event.stopPropagation();

          if (event.wheelDelta > 0) {
            zooming.style.maxHeight = parseInt(zooming.style.maxHeight) + 10 + 'px';
          } else {
            zooming.style.maxHeight = parseInt(zooming.style.maxHeight) - 10 + 'px';
          }
        }
        break;
    }
  }

  document.addEventListener('mousedown', handleEvent, false);
  document.addEventListener('mousemove', handleEvent, false);
  document.addEventListener('mouseup', handleEvent, false);
  document.addEventListener('mousewheel', handleEvent, { passive: false });
})();