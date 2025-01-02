// 白屏检测
export function getWhitescreen (callback: (data: any) => void,  { skeletonProject, whiteBoxElements} = { skeletonProject: false, whiteBoxElements: ['html', 'body', '#app', '#root'] }) {
  let _whiteLoopNum = 0;
  let _skeletonInitList: any[] = []; // 存储初次采样点
  let _skeletonNowList: any[]= []; // 存储当前采样点

  function resetWhiteScreenState() {
    if (window._loopTimer) {
      clearTimeout(window._loopTimer);
      window._loopTimer = null;
    }
  }
  // 选中dom点的名称
function getSelector(element: Element) {
  if (element.id) {
    return '#' + element.id;
  } else if (element.className) {
    // div home => div.home
    return ('.' + element.className.split(' ').filter(item => !!item).join('.'));
  } else {
    return element.nodeName.toLowerCase();
  }
}
// 判断采样点是否为容器节点
function isContainer(element: Element) {
  let selector = getSelector(element);
  if (skeletonProject) {
    _whiteLoopNum ? _skeletonNowList.push(selector) : _skeletonInitList.push(selector);
  }
  return whiteBoxElements.indexOf(selector) != -1;
}
// 开启白屏轮训
function openWhiteLoop() {
  if (window._loopTimer) return;
  window._loopTimer = setInterval(() => {
    if (skeletonProject) {
      _whiteLoopNum++;
      _skeletonNowList = [];
    }
    sampling();
  }, 1000);
}
function sampling() {
  let emptyPoints = 0;
  for (let i = 1; i <= 9; i++) {
    let xElements = document.elementsFromPoint(
      (window.innerWidth * i) / 10,
      window.innerHeight / 2
    );
    let yElements = document.elementsFromPoint(
      window.innerWidth / 2,
      (window.innerHeight * i) / 10
    );
    if (isContainer(xElements[0])) emptyPoints++;
    // 中心点只计算一次
    if (i != 5) {
      if (isContainer(yElements[0])) emptyPoints++;
    }
  }
  // 页面正常渲染，停止轮训
  if (emptyPoints !== 17) {
    if (skeletonProject) {
      // 第一次不比较
      if (!_whiteLoopNum) return openWhiteLoop();
      // 比较前后dom是否一致
      if (_skeletonNowList.join() == _skeletonInitList.join()) {
        return callback({
          event_type: 'whiteScreen'
        });
      }
    }
    resetWhiteScreenState();
  } else {
    callback({
      event_type: 'whiteScreen'
    });
  }
}

  if (document.readyState === 'complete') {
    sampling()
  } else {
    window.addEventListener('load', sampling)
  }
}