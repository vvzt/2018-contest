
// 各种事件
// PC、移动端兼容
var controlEvents = (function (src, dom) {
  this.isDown = false;
  this.isUp = false;
  this.direction = null; // 方向
  this._temp_offset = { x: 0, y: 0 };
  this._temp_touch = { startX: 0, startY: 0 };
  this.fn = null; // 去抖用
  this.duration = 200; // 去抖间隔


  var mousedown = 'ontouchstart' in document ? 'touchstart' : 'mousedown';
  var mouseup = 'ontouchend' in document ? 'touchend' : 'mouseup';
  var mousemove = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
  
  // 去抖
  // 调用addNum函数进行计算
  function checkFn () {
    if(fn) {
      clearTimeout(fn);
      fn = null;
    }
    var callbacks = [ // 此数组中为addNum后 执行的callback函数
        function () { setTimeout(panel.generateNum, 0, src, dom) },
        function () { setTimeout(panel.setPosition, 30, src, dom) },
        function () { info.textContent = score }
      ];
    return fn = setTimeout(calc.addNum, duration, direction, callbacks);
  }

  // 初始化位置信息
  function initTouchTemp () {
    _temp_touch.startX = 
    _temp_touch.startY = 
    _temp_touch.endX = 
    _temp_touch.endY = 0;
    direction = null;
  }
  function initMouseTemp () {
    _temp_offset.x = 0;
    _temp_offset.y = 0;
    direction = null;
  }

  // PC端
  function mousedownFn () {
    isDown = true;
    isUp = false;
  }
  function mouseupFn () {
    isDown = false;
    isUp = true;
    initMouseTemp();
  }
  function mousemoveFn (e) {
    if(isDown) {
      _temp_offset.x = e.movementX;
      _temp_offset.y = e.movementY;
      if( Math.abs(_temp_offset.y) > 30 ) {
        direction = _temp_offset.y > 0 ? 'down' : 'up';
        checkFn();
      } else if ( Math.abs(_temp_offset.x) > 30 ) {
        direction = _temp_offset.x > 0 ? 'right' : 'left';
        checkFn();
      }
    } else {
      initMouseTemp();
    }
  }

  // 移动端
  function touchdownFn (e) {
    mousedownFn();
    _temp_touch.startX = e.changedTouches[0].pageX;
    _temp_touch.startY = e.changedTouches[0].pageY;
  }
  function touchupFn (e) {
    mouseupFn();
    initTouchTemp();
  }
  function touchmoveFn (e) {
    if(isDown) {
      var distanceX = e.changedTouches[0].pageX - _temp_touch.startX;
      var distanceY = e.changedTouches[0].pageY - _temp_touch.startY;

      if( Math.abs(distanceX) > 100 ) {
        direction = distanceX > 0 ? 'right' : 'left';
        checkFn();
      } else if ( Math.abs(distanceY) > 100 ) {
        direction = distanceY > 0 ? 'down' : 'up';
        checkFn();
      }

    } else {
      initTouchTemp();
    }
  }

  // 键盘
  function keyboardFn (e) {
    var key = e.key;
    if(key === 'ArrowUp') {
      direction = 'up';
      checkFn();
    }
    if(key === 'ArrowDown') {
      direction = 'down';
      checkFn();
    }
    if(key === 'ArrowLeft') {
      direction = 'left';
      checkFn();
    }
    if(key === 'ArrowRight') {
      direction = 'right';
      checkFn();
    }
  }


  // 绑定
  var bindEvents = function () {
    wrapper.addEventListener(mousedown, mousedown === 'mousedown' ? mousedownFn : touchdownFn);
    wrapper.addEventListener(mouseup, mouseup === 'mouseup' ? mouseupFn : touchupFn);
    wrapper.addEventListener(mousemove, mousemove === 'mousemove' ? mousemoveFn : touchmoveFn);
    document.onkeydown = 'onkeydown' in document ? keyboardFn : null;
  }
  // 解绑
  var unBindEvents = function () {
    wrapper.removeEventListener(mousedown, mousedown === 'mousedown' ? mousedownFn : touchdownFn);
    wrapper.removeEventListener(mouseup, mouseup === 'mouseup' ? mouseupFn : touchupFn);
    wrapper.removeEventListener(mousemove, mousemove === 'mousemove' ? mousemoveFn : touchmoveFn);
    document.onkeydown = null;
  }
  
  return {
    bindEvents: function () { return bindEvents() },
    unBindEvents: function () { return unBindEvents() },
    getDirection: function () { return direction }
  }
})(pan, body);

