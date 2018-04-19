
// 游戏逻辑
// 传入 方向、回调数组
// 回调函数将会在最后全部调用
var calc = (function () {

  // 统计已改变的 行/列 数，若为0则不生成数字
  this.changedCount = 0;

  function addNum (dir, callbacks) {

    changedCount = 0;

    for(var i=0; i<pan.length; i++) {

      var temp = [];

      // 获得当前列
      if(dir === 'left' || dir === 'right') {
        temp = pan[i].slice();
      } else {
        for(var j=0; j<pan.length; j++) { temp[j] = pan[j][i]; }
      }

      // 列相加
      if(dir === 'down' || dir === 'right') temp.reverse();
      
      // 获得 存有数字位置变化 的数组
      var _pos = getPosition(temp);

      // 移动动画
      setMoveAction(_pos, dir, i);

      // 重置为0并重新赋值
      if(dir === 'down' || dir === 'up') {
        for(var k=0; k<pan.length; k++) { pan[k][i] = 0 }
      } else {
        pan[i].forEach(function (x, j) { pan[i][j] = 0 });
      }
      setValue(temp, _pos, dir, i);

    } // for

    return changedCount === 0 ? null : callbacks.forEach(function (fn) { fn() });
  }

  // 计算一行或一列中数字位置的变化
  function getPosition (temp) {

     // 通过_pos存储有变化的元素
    var _pos = [];

    for(var k=0; k<temp.length-1; k++) {
      for(var l=k+1; l<temp.length; l++) {
        
        if(temp[k] > 0) {
          if(temp[l] === temp[k]) {
            _pos.push({ beforePos: l, afterPos: k, addition: true });
            temp[k] += temp[k];
            temp[l] = 0;
            score += temp[k];
            break;
          } else if(temp[l] > 0) break;
        } else {
          if(temp[l] > 0) {
            _pos.push({ beforePos: l, afterPos: k, addition: false });
            temp[k] += temp[l];
            temp[l] = 0;
            l = k + 1;
          }
        } // if

      } // for
    } // for

    if(_pos.length !== 0) changedCount ++;

    return _pos;
  }

  // 添加移动效果
  function setMoveAction (_pos, dir, dirIndex) {
    _pos.forEach(function (pos) {

      // 移动步数
      var stepCount = Math.abs(pos.beforePos - pos.afterPos);
      
      // 判断走向
      if(dir === 'up' || dir === 'down') {
        var x1 = pan[0].length - 1 - pos.beforePos,
          x2 = pos.beforePos,
          y1 = dirIndex,
          y2 = dirIndex;
      } else {
        var x1 = dirIndex,
          x2 = dirIndex,
          y1 = pan[0].length - 1 - pos.beforePos,
          y2 = pos.beforePos;
      }

      // 设置对应方向与步数的动画
      if(dir === 'right' || dir === 'down') {
        nodes[x1][y1].style.animation = 'move' + stepCount + 'step_' + dir + ' .2s forwards';
      } else {
        nodes[x2][y2].style.animation = 'move' + stepCount + 'step_' + dir + ' .2s forwards';  
      }
      
    });
  }

  // 赋值
  function setValue (temp, _pos, dir, dirIndex) {

    temp.forEach(function (x, j) {
      
      // 判断走向
      if(dir === 'up' || dir === 'down') {
        var x1 = pan[0].length - 1 - j,
          x2 = j,
          y1 = dirIndex,
          y2 = dirIndex;
      } else {
        var y1 = pan[0].length - 1 - j,
          y2 = j,
          x1 = dirIndex,
          x2 = dirIndex;
      }

      if(dir === 'down' || dir === 'right') {
        pan[x1][y1] = x;
      } else {
        pan[x2][y2] = x;
      }

    });

  }

  return {
    addNum: function (direction, callbacks) { return addNum(direction, callbacks) }
  }
})();