import { App } from "vue";
import {  defaultOption, initDataSender } from "./bury";
import { getWhitescreen, pageReport } from './utils/page'
import { errorReport, rejectReport } from './utils/error'
import { OptionType, Plugin } from "./utils/types";
import { getDeviceId } from "./utils/common";
import useBuryHook from './hook'
import { requestReport } from "./utils/request";

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
      getWhitescreen((data) => {
        dataSender.track(data)
      })
    }

    if (options.monitorError !== false) {
      errorReport((data) => {
        dataSender.track(data)
      })
    }

    if (options.monitorRequest !== false) {
      requestReport((data) => {
        dataSender.track(data)
      })
    }
    if (options.monitorReject !== false) {
      rejectReport(() => {
        
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

export const useBury = useBuryHook