import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import buryPlugin from 'janus-bury'
import buryPlugin from '../utils/dist'
import router from './router'
const beforeMount = async () => {
  const app = createApp(App)
  app.use(router)
  app.use(buryPlugin, {
    appName: 'janus-bury',
    appCode: 'jauns-bury',
    appVersion: '1.0.0',
    server_url: 'http://172.22.73.55:3000/event/report'
  })
  app.mount('#app')
}
  beforeMount()
  