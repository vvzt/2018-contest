

// var pan = [
//   [128, 2, 4, 8],
//   [16, 32, 64, 128],
//   [256, 0, 512, 1024],
//   [32, 16, 8, 4]
// ];

var pan = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

// 存储各个节点
var nodes = [
  [],
  [],
  [],
  []
];

// mirror 为底
var pan_mirror = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

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





window.onload = function () {

  // 绑定事件
  controlEvents.bindEvents();

  // 生成初始数字
  panel.init(pan);

  // mirror当作底部
  panel.setPosition(pan_mirror, mirror);

  // 更新位置
  panel.setPosition(pan, body);

}
