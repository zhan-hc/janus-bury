import { isObjectOverSizeLimit } from "./common"
import axios from 'axios'

export const sendImage = (url:string, data: any = {}) => {
  if (!isObjectOverSizeLimit(data, 2)) {
    const img = new Image()
    img.src = `${url}?e=${encodeURIComponent(JSON.stringify(data))}`
  } else {
    ajax(url, data)
  }
  
}

export const sendBeacon = (url:string, data: any = {}) => {
  if (!navigator.sendBeacon) {
    sendImage(url, data)
  } else {
    // sendBeacon有对大小限制，如果超过64kb，则会被截断
    if (!isObjectOverSizeLimit(data, 60)) {
      navigator.sendBeacon(url, JSON.stringify(data))
    } else {
      ajax(url, data)
    }
  }
}

export const ajax = (url:string, data: any = {}) => {
  return axios.request({ url, ...data })
}