import { App } from "vue";
import {  defaultOption, initDataSender } from "./bury";
import { getWhitescreen, pageReport } from './page'
import { reportError } from './error'
import { OptionType, Plugin } from "./types";
import { getDeviceId } from "./common";
import useBury from './hook'

const plugin: Plugin<OptionType> = {
  install (app: App, options: OptionType) {
    const dataSender = initDataSender({
      ...defaultOption,
      ...options
    })
    const router =  app.config.globalProperties.$router
    if (router) {
      pageReport(router, ({ funcName, params, monitorAttr }) => {
        !(monitorAttr === 'monitorRouter' &&  options['monitorRouter'] === false) && dataSender[funcName](params)
      })
    }
    if (options.monitorWhiteScreen !== false) {
      getWhitescreen(({ status }) => {
        status === 'error' && dataSender.track({
          type: 'monitorWhiteScreen',
          event_type: 'whiteScreen'
        })
      })
    }

    if (options.monitorError !== false) {
      reportError((errEvent) => {
        dataSender.track({
          event_type: 'error',
          event_msg: JSON.stringify({
            msg: errEvent.message,
            file:  errEvent.filename,
            lineno:  errEvent.lineno,
            colno:  errEvent.colno
          })
        })
      })
    }
    // 生成浏览器指纹
    getDeviceId().then(deviceId => {
      dataSender.setDeviceId(deviceId)
      dataSender.sendQueueData()
    })
  }
}

export default plugin

export {
  useBury
}