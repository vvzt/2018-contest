
// 布局、状态 设置
// 对游戏容器的初始化、修改等
var panel = (function watcher () {
  var fn = null;

  // 全部置0
  function setZero (src) {
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        src[i][j] = 0;
      });
    });
    score = 0;
  }

  // 更新位置
  function setPosition (src, dom) {
    var max = 0;
    var zeroCount = 0;
    var fragment = document.createDocumentFragment();
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        max = x > max ? x : max; // 同时获得最大值
        zeroCount = x === 0 ? zeroCount + 1 : zeroCount;

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
  function init (src) {
    var count = config.initCount;
    src.forEach(function (arr, i) {
      arr.forEach(function (x, j) {
        if(count > 0 && Math.random() > (0.8 - count*0.2*(i+0.1)/2)) { // 控制2的生成概率
          src[i][j] = 2;
          count--;
        } else {
          if(count === config.initCount) src[i][j] = i+j===2*(src.length-1) ? 2 : x; // 最少生成一个2
        }
      });
    });
  }

  // 生成数字
  function generateNum (src) {
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
  function isEnding (src, dom, max, count) {
    if(max === MAX_NUM || count === 0) {

      if(!isDead(src)) return;

      // 游戏结束 解绑事件
      controlEvents.unBindEvents();

      // 游戏结束后的提示
      var wrapper = document.createElement('div');
      var ins_el = document.createElement('p');
      var score_el = document.createElement('p');
      var confirm = document.createElement('input');

      wrapper.setAttribute('class', 'endingWrapper fadeIn');
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
        winner.style.display = 'none';
        controlEvents.bindEvents();
      });

      winner.innerHTML = '';
      ins_el.appendChild(score_el);
      wrapper.appendChild(ins_el);
      wrapper.appendChild(confirm);
      setTimeout(function () {
        winner.appendChild(wrapper);
        winner.style.display = 'block';
      }, 1000);

    }

  }

  // 判断是否死局
  function isDead (src) {
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
    // console.log(deadCount);
    return deadCount === src.length*src[0].length;
  }

  return {
    init: function (src) { return init(src) },
    setPosition: function (src, dom) { return fn = setTimeout(setPosition, 150, src, dom) },
    generateNum: function (src) { return generateNum(src) },
    restart: function (src, dom) {
      setZero(src);
      init(src);
      return setPosition(src, dom);
    }
  }
})();
