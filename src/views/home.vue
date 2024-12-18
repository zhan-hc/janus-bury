<template>
<div class="wrap">
    <h2>home 页面</h2>
    <button @click="onclick">页面跳转 button => about</button>
    <button @click="sendBury">埋点插件埋点上报</button>
    <button @click="handleReq">xhr接口请求</button>
    <button @click="handleFetch">fetch接口请求</button>
    <button @click="handlePromiseReject">promise reject</button>
  </div>
  
</template>

<script lang='ts' setup>
import {useRouter} from 'vue-router'
import { useBury } from 'janus-bury'
// import { useBury } from '../../utils/dist'
import axios from 'axios'
const router = useRouter();
const { dataSender } = useBury()
const onclick = () => {
  router.push('/about')
}
const sendBury = () => {
  dataSender.value.track('按钮点击')
  dataSender.value.track('页面浏览', 'view')
}

const handleReq = () => {
  axios.post('https://www.baidu.com', { name: 'janus-bury' }).then(res => {
    console.log(res)
  })

  axios.get('https://api.github.com/repos').then(res => {
    console.log(res)
  })
}

const handleFetch = () => {
  // fetch('https://www.baidu.com').then((res) => res.text())
  fetch('https://api.github.com/repos').then((res) => res.text())
}

const handlePromiseReject = () => {
  Promise.reject('我抛出异常了')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('promise reject')
    }, 1000)
  })
}


</script>

<style scoped>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
      
</style>