/**
 * 页面路由监听 和白屏
 */
import { Router } from 'vue-router'
import { v4 as uuidv4 } from 'uuid';
import { DataSenderMethodMap } from './types'
// 页面埋点
export const pageReport = (router: Router, callback: (params: { funcName: keyof DataSenderMethodMap, params: any, monitorAttr?: string }) => void) => {
  let startTime = 0
      if (router) { // vue3路由判断
        router.beforeEach((to, from, next) => {
          callback({
            funcName: 'setPageId',
            params: uuidv4()
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