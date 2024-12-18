/**
 * 页面路由监听 和白屏
 */
import { Router } from 'vue-router'
import { DataSenderMethodMap } from './types'
// 页面埋点
export const pageReport = (router: Router, callback: (params: { funcName: keyof DataSenderMethodMap, params: any, monitorAttr?: string }) => void) => {
  let startTime = 0
      if (router) { // vue3路由判断
        router.beforeEach((to, from, next) => {
          callback({
            funcName: 'setPageId',
            params: crypto.randomUUID()
          })
          const curTime = +new Date()
          if (from.name) {
            callback({
              funcName: 'track',
              params: {
                event_name: `${String(from.name)}页面离开`,
                event_type: 'leave',
                tp: curTime - startTime,
                page_path: from.fullPath,
                page_name: from.name
              },
              monitorAttr: 'monitorRouter'
            })
            startTime = curTime
          }
          callback({
            funcName: 'track',
            params: {
              event_name: `${String(to.name)}页面浏览`,
              event_type: 'view',
              page_path: to.fullPath,
              page_from: from.fullPath,
              page_name: to.name
            },
            monitorAttr: 'monitorRouter'
          })
          next()
        })
      }
}

// 白屏检测
export function getWhitescreen (callback: (data: any) => void,  { skeletonProject, whiteBoxElements} = { skeletonProject: false, whiteBoxElements: ['html', 'body', '#app', '#root'] }) {
  let _whiteLoopNum = 0;
  let _skeletonInitList: any[] = []; // 存储初次采样点
  let _skeletonNowList: any[]= []; // 存储当前采样点
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
  if (emptyPoints != 17) {
    if (skeletonProject) {
      // 第一次不比较
      if (!_whiteLoopNum) return openWhiteLoop();
      // 比较前后dom是否一致
      if (_skeletonNowList.join() == _skeletonInitList.join())
        return callback({
          event_type: 'whiteScreen'
        });
        
    }
    if (window._loopTimer) {
      clearTimeout(window._loopTimer);
      window._loopTimer = null;
    }
  } else {
    // 开启轮训
    if (!window._loopTimer) {
      openWhiteLoop();
    }
  }
  // 17个点都是容器节点算作白屏
  if (emptyPoints === 17) {
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