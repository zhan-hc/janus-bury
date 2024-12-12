
这是一个支持vue的前端监控SDK，可以收集并上报：代码错误，白屏，页面访问时间，用户行为等数据。


## 安装

```
$ npm install janus-bury

$ yarn add janus-bury

$ pnpm install janus-bury
```

## vue3使用

```
import { createApp } from 'vue'
import buryPlugin from 'janus-bury'

const app = createApp(App)
app.use(buryPlugin, options) // 配置可详见下文
app.mount('#app')
  
```

## 配置

Name     | Type| Default| Description
-------- | -----| -----| -----
appName  | string| 必填| 上报的项目数据（区分上报数据来源）
appCode  | string| ''| 项目code
appVersion|  string| ''| 项目版本
server_url|  string| 必填| 数据上报的接口地址
send_type|  beacon/ajax/img| beacon| 接口上报的方式
method|  post/get| post| 接口上报的方法
monitorRouter|  boolean| true| 是否开启页面路由监听
monitorWhiteScreen|  boolean| true| 是否开启白屏监听
monitorError|  boolean| true| 是否开启error监听
userId|  string| ''| 用户id
ext|  object| {}| 额外需要上报的数据
reportInterceptor|  function(reportData)| - | 上报数据前拦截器可以修改上报的数据


### reportInterceptor 上报前拦截器
```
// 可以做一些数据发送前的log
app.use(buryPlugin, {
  appName: 'janus-bury',
  server_url: 'http://127.1.1.1:3000/event/report'
  reportInterceptor: (data: any) => {
    console.log('data', data)
  }
})

// 也可以变更上报前的数据，因为有一些接口的请求数据与当前的上报数据不一样
app.use(buryPlugin, {
  appName: 'janus-bury',
  server_url: 'http://127.1.1.1:3000/event/report'
  reportInterceptor: (data: any) => {
    return {
      ...data.baseInfo,
      ...data.eventInfo
    }
  }
})

```
若拦截器没有 return value 则默认上报插件的请求数据


## 方法

functionName     | params | Description
-------- | ---- | -----
init(option)  | 配置| 初始化数据
setServerUrl(value)  | - |设置接口上报的地址
setUserId(value)  | - | 设置用户id
setMethod(value = 'get'/'post')  | - | 设置接口上报的方法
track(data: object/string, event_type: string = 'click')  | - | 设置上报的数据

### 使用方式
前提是 `main.ts` 进行了初始化即 `app.use`

```
import { useBury } from 'janus-bury'
const { dataSender } = useBury()

// 上报埋点
dataSender.value.track('按钮点击')
dataSender.value.track('页面浏览', 'view')
dataSender.value.track({
produnct_id: '产品id',
})
dataSender.value.setServerUrl('http://127.0.0.1:3000/api/report')
```


## 接口上报的数据
分为 **baseInfo** 和 **eventInfo**，其中 **baseInfo** 是基础信息，**eventInfo** 是上报的数据
```
{
    "baseInfo": {
        "appName": "janus-bury",
        "appCode": "jauns-bury",
        "appVersion": "1.0.0",
        "clientHeight": 919,
        "clientWidth": 616,
        "colorDepth": 24,
        "pixelDepth": 24,
        "screenWidth": 1920,
        "screenHeight": 1080,
        "vendor": "Google Inc.",
        "platform": "Win32",
        "usergent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    },
    "eventInfo": {
        "userId": "",
        "pageId": "8bba8620-51ba-41ca-b3a8-948f5a1f2412", // 页面唯一id
        "deviceId": "e8ce5403de494be4a72d5e5b69b9dc75", // 通过浏览器指纹生成的id
        "url": "http://127.0.0.1:5173/#/about",
        "timestramp": 1733987624598,
        "event_name": "about页面浏览",
        "event_type": "view",
        "page_path": "/about",
        "page_from": "/",
        "page_name": "about"
    }
}
```
