
var pan = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
var nodes = [
  [],
  [],
  [],
  []
]
var score = 0; // 总分
var config = {
  initCount: 4, // 初始化个数
  randomCount: 2 // 随机生成最大个数
}

// 最大数字
var MAX_NUM = 2048;

// DOM
var info = document.querySelector('.info');
var wrapper = document.querySelector('#wrapper');
var container = document.querySelector('#container');
var body = container.querySelector('#gameBody');
var mirror = container.querySelector('.bodyMirror');
var winner = container.querySelector('.winner');

// var pan = [
//   [1, 2, 4, 8],
//   [16, 32, 64, 128],
//   [256, 512, 1024, 2048],
//   [32, 16, 8, 4]
// ];





window.onload = function () {
  // 页面加载完毕后
  // 绑定事件并初始化即可
  panel.setPosition(JSON.parse(JSON.stringify(pan)), mirror); // mirror作底
  controlEvents.bindEvents();
  panel.init(pan);
  panel.setPosition(pan, body);

}





// 布局、状态 设置
// 对游戏容器的初始化、修改等
var panel = (function watcher () {
  this.fn = null;

  // 全部置0
  this.setZero = function (src) {
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        src[i][j] = 0;
      });
    });
    score = 0;
  }

  // 更新位置
  this.setPosition = function (src, dom) {
    var max = 0;
    var zeroCount = 0;
    var fragment = document.createDocumentFragment();
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        max = x > max ? x : max; // 同时获得最大值
        zeroCount += x === 0 ? 1 : 0;

        var div = document.createElement('div');
        div.setAttribute('class', 'nodeNum' + ' num' + x);
        div.textContent = x === 0 ? '' : x;
        fragment.appendChild(div);

        nodes[i][j] = div;
      });
    });
    dom.innerHTML = '';
    dom.appendChild(fragment);

    // 判断游戏是否结束
    isEnding(src, dom, max, zeroCount);

  }

  // 初始化
  this.init = function (src) {
    var count = config.initCount;
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        if(count > 0 && Math.random() > (0.8 - count*0.2*(i+0.1)/2)) {
          src[i][j] = 2;
          count--;
        } else {
          if(count === config.initCount) src[i][j] = i+j===2*(src.length-1) ? 2 : x; // 最少生成一个2
        }
      });
    });
  }

  // 生成数字
  this.generateNum = function (src) {
    var count = config.randomCount;
    var zeroCount = 0;
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        if(x === 0 && Math.random() > (1 - (count*0.1))) { 
          src[i][j] = 2;
          count--;
          zeroCount += x === 0 ? 1 : 0;
        }
      });
    });
  }

  // 判断是否游戏结束
  this.isEnding = function (src, dom, max, count) {
    if(max === MAX_NUM || count === 0) {

      if(!isDead()) return;

      var wrapper = document.createElement('div');
      var ins_el = document.createElement('p');
      var score_el = document.createElement('p');
      var confirm = document.createElement('input');

      wrapper.setAttribute('class', 'endingWrapper');
      ins_el.setAttribute('class', 'endingWords');
      score_el.setAttribute('class', 'endingScore');
      confirm.setAttribute('class', 'endingConfirm');
      confirm.setAttribute('type', 'button');
      confirm.setAttribute('value', 'RESTART');

      ins_el.textContent = count === 0 ? 'OH NO ~ YOU ARE FAILED -.-' : 'NICE ~ YOU DID IT !';
      score_el.textContent = 'FINAL SCORE  ' + score;

      // 点击重开
      confirm.addEventListener('click', function () {
        panel.restart(src, dom);
        winner.removeChild(wrapper);
        winner.style.display = 'none';
      });

      ins_el.appendChild(score_el);
      wrapper.appendChild(ins_el);
      wrapper.appendChild(confirm);
      setTimeout(function () {
        winner.appendChild(wrapper);
        winner.style.display = 'block';
      }, 2000);

    }

  }

  // 判断是否死局
  this.isDead = function (src) {
    var deadCount = 0;
    for(var i=0; i<src.length; i++) {
      for(var j=0; j<src[0].length; j++) {
        var temp = src[i][j];
        if( temp === src[i][j-1] || temp === src[i][j+1] || ( src[i-1] && temp === src[i-1][j]) || (pan[i+1] && temp === pan[i+1][j]) ) {
          continue;
        }
        deadCount++;
      }
    }
    console.log(deadCount);
    return deadCount === src.length*src[0].length;
  }

  return {
    init: function (src) { return init(src) },
    setPosition: function (src, dom) { return fn = setTimeout(setPosition, 200, src, dom) },
    generateNum: function (src) { return generateNum(src) },
    restart: function (src, dom) {
      setZero(src);
      init(src);
      return setPosition(src, dom);
    }
  }
})();














// 各种事件
// PC、移动端兼容
// 对外暴露绑定、解绑、动作方向接口
var controlEvents = (function () {
  this.isDown = false;
  this.isUp = false;
  this.direction = null;
  this._temp_offset = { x: 0, y: 0 };
  this._temp_touch = { startX: 0, startY: 0 };
  this.fn = null;


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
    return fn = setTimeout(addNum, 100, direction,
      [ // 此数组中为addNum后 执行的callback函数
        function () { setTimeout(panel.generateNum, 50, pan, body) },
        function () { setTimeout(panel.setPosition, 50, pan, body) },
        function () { info.textContent = score }
      ]
    );
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
  this.bindEvents = function () {
    wrapper.addEventListener(mousedown, mousedown === 'mousedown' ? mousedownFn : touchdownFn);
    wrapper.addEventListener(mouseup, mouseup === 'mouseup' ? mouseupFn : touchupFn);
    wrapper.addEventListener(mousemove, mousemove === 'mousemove' ? mousemoveFn : touchmoveFn);
    document.onkeydown = 'onkeydown' in document ? keyboardFn : null;
  }
  // 解绑
  this.unBindEvents = function () {
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
})();







  // 游戏逻辑
  // 传入 方向、回调数组
  // 回调函数将会在最后全部调用
function addNum (dir, callback) {
  if(dir === 'up' || dir === 'down') {

    for(var i=0; i<pan[0].length; i++) {

      var temp = [];
      for(var j=0; j<pan.length; j++) {
        temp[j] = pan[j][i];
      }
      var _pos = [];

      // 列相加
      if(dir === 'down') temp.reverse();
      for(var k=0; k<temp.length-1; k++) {

        for(var l=k+1; l<temp.length; l++) {
          
          if(temp[k] > 0) {
            if(temp[l] === temp[k]) {
              _pos.push({ beforePos: l, afterPos: k });
              temp[k] += temp[k];
              temp[l] = 0;
              score += temp[k];
              break;
            } else if(temp[l] > 0) break;
          } else {
            if(temp[l] > 0) {
              _pos.push({ beforePos: l, afterPos: k });
              temp[k] += temp[l];
              temp[l] = 0;
              l = k+1;
            }
          } // if else

        } // for
        
      } // for

      _pos.forEach(function (pos, index) {

        var stepCount = Math.abs(pos.beforePos - pos.afterPos);
        if(dir === 'down') {
          nodes[pan.length-pos.beforePos-1][i].style.animation = 'move' + stepCount + 'step_' + dir + ' .2s forwards';
        } else {
          nodes[pos.beforePos][i].style.animation = 'move' + stepCount + 'step_' + dir + ' .2s forwards';  
        }
        
      });

      // 计算结果后更改pan
      for(var k=0; k<pan.length; k++) { pan[k][i] = 0 }
      temp.forEach(function (x, j) {
        if(dir === 'down') {
          pan[pan[0].length-j-1][i] = x;
        } else {
          pan[j][i] = x;
        }
      });

    } // for

  }
  if(dir === 'left' || dir === 'right') {
    for(var i=0; i<pan.length; i++) {

      var temp = pan[i].slice();
      var _pos = [];

      // 相加逻辑
      if(dir === 'right') temp.reverse();
      for(var k=0; k<temp.length-1; k++) {

        for(var l=k+1; l<temp.length; l++) {
          
          if(temp[k] > 0) {
            if(temp[l] === temp[k]) {
              _pos.push({ beforePos: l, afterPos: k });
              temp[k] += temp[k];
              temp[l] = 0;
              score += temp[k];
              break;
            } else if(temp[l] > 0) break;
          } else {
            if(temp[l] > 0) {
              _pos.push({ beforePos: l, afterPos: k });
              temp[k] += temp[l];
              temp[l] = 0;
              l = k+1;
            }
          } // if else

        } // for
        
      } // for

      // 计算结果后更改pan
      _pos.forEach(function (pos, index) {

        var stepCount = Math.abs(pos.beforePos - pos.afterPos);
        if(dir === 'right') {
          nodes[i][pan[0].length-pos.beforePos-1].style.animation = 'move' + stepCount + 'step_' + dir + ' .2s forwards';
        } else {
          nodes[i][pos.beforePos].style.animation = 'move' + stepCount + 'step_' + dir + ' .2s forwards';  
        }
        
      });
      pan[i].forEach(function (x, j) { pan[i][j] = 0 });
      temp.forEach(function (x, j) {
        if(dir === 'right') {
          pan[i][pan.length-j-1] = x;
        } else {
          pan[i][j] = x;
        }
      });

    } // for
  }

  return callback.forEach(function (fn) { fn() });
}