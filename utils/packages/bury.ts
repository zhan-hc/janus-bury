import { sendBeacon, sendImage, ajax  } from "./utils/sendType"
import { addQuery } from './utils/common'
import { OptionType, ReportInterceptor } from './utils/types'
let dataSenderInstance: DataSender | undefined;

export const defaultOption: OptionType = {
  send_type: 'beacon',
  server_url: '',
  method: 'post',
  appName: '',
  appCode: '',
  appVersion: '',
  userId: '',
  ext: {},
  monitorRouter: true,
  monitorWhiteScreen: true,
  monitorError: true
}

export class DataSender {
  public sendType: 'beacon' | 'ajax' | 'img' = 'beacon'
  private serverUrl: string = ''
  private pageId: string = ''
  private userId: string = ''
  private deviceId: string = ''
  private baseInfo: any
  private eventQueue: object[] = []
  private method: 'post' | 'get' = 'post'
  private reportInterceptor?: ReportInterceptor
  constructor() {
  }

  init (options: OptionType) {
    const {
      send_type = 'beacon',
      server_url,
      method = 'post',
      userId = '',
      appName = '',
      appCode = '',
      appVersion = '',
      ext = {},
      reportInterceptor
    } = options
    if (!server_url || !appName) {
      throw(new Error('The appName and server_url parameters are required'))
    }
    if (send_type === 'beacon' && method === 'get') {
      throw(new Error('The g method does not support beacon data reporting. Please switch to other reporting methods.'))
    }
      
    this.sendType = send_type
    this.serverUrl = server_url
    this.method = method
    this.userId = userId
    this.reportInterceptor = reportInterceptor
    this.baseInfo = {
      appName,
      appCode,
      appVersion,
      ...ext
    }
  }

  private getBaseInfo () {
    const { clientHeight, clientWidth } = document.documentElement || document.body;
    return {
      ...this.baseInfo,
      clientHeight,
      clientWidth,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      vendor: navigator.vendor || '',
      platform: navigator.platform || '',
      usergent: navigator.userAgent
    }
  }
  private getBaseEventInfo () {
    return {
      userId: this.userId,
      pageId: this.pageId,
      deviceId: this.deviceId,
      url: location.href,
      timestramp: Date.now(),
    }
  }

  setServerUrl (serverUrl: string) {
    this.serverUrl = serverUrl
  }
  setDeviceId (deviceId: string) {
    this.deviceId = deviceId
  }
  setUserId (userId: string) {
    this.userId = userId
  }
  setPageId (pageId: string) {
    this.pageId = pageId
  }
  setMethod (method: 'post' | 'get') {
    this.method = method
  }
  track(data: object | string, event_type: string = 'click') {
    const eventData =
      typeof data === "string"
        ? { event_name: data, event_type }
        : data;
    let sendData = {
      baseInfo: this.getBaseInfo(),
      eventInfo: { ...this.getBaseEventInfo(), ...eventData }
     }
    // 若是指纹id还生成则加入队中等待生成之后在上报
    if (!sendData.eventInfo.deviceId && !this.deviceId) {
      this.eventQueue.push(eventData)
      return
    }
    if (this.reportInterceptor) {
      sendData = this.reportInterceptor(sendData) || sendData
    }
    import.meta.env.MODE !== 'production' && console.log('track data => ', sendData)
    this.send(sendData)
  }

  send(data: object | string) {
    const url = this.serverUrl
    switch(this.sendType) {
      case 'beacon':
        sendBeacon(url, data)
        break
      case 'img':
        this.method === 'get' ? sendImage(addQuery(url, data)) : sendImage(url, data)
        break
      case 'ajax':
        this.method === 'get' ? ajax(addQuery(url, data)) : ajax(url, data)
        break
      default:
        this.method === 'get' ? ajax(addQuery(url, data)) : ajax(url, data)
    }
  }

  sendQueueData() {
    while(this.eventQueue.length) {
      const data = this.eventQueue.shift()
      data && this.track(data)
    }
  }


}

export const initDataSender = (options: OptionType) => {
  if (!dataSenderInstance) {
    dataSenderInstance  = new DataSender()
    dataSenderInstance.init(options)
  }
  return dataSenderInstance
}


export const getDataSenderInstance = () => {
  if (!dataSenderInstance) {
    console.error('The janus-bury plugin was not initialized')
    return void 0
  }
  return dataSenderInstance;
}
