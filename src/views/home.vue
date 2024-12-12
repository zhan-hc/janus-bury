<template>
  home
  <div @click="onclick">button => about</div>
  <img src="https://file.iviewui.com/view-design-logo.png" alt="">
  <div class="md">
    <div class="md-left">
      <div class="md-amount">20000000</div>
      <div class="md-desc">
        <span>第三方第三方</span>
        <svg width="12.5" height="16">
          <line x1="6" y1="2" x2="6" y2="14" stroke="#AAA" stroke-width="0.5"></line>
        </svg>
        <span>发的刚发的好久</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {useRouter} from 'vue-router'
// import { useBury } from '../../utils/dist'
const router = useRouter();
// const { dataSender } = useBury()
// console.log(dataSender.value, 'yyyyyyyyyyyyyyyyyyy')
const onclick = () => {
  dataSender.value.track('按钮点击')
  dataSender.value.track('页面浏览', 'view')
  router.push('/about')
}
</script>

<style scoped>
  .md{
        display: flex;
        align-items: center;
        margin-top: 12px;
  }
    .md-left {
      flex: 1;
    }
    .md-amount {
      font-size: 24px;
      font-weight: 700;
      font-family: 'Sui-Number-Bold';
      color: #222226;
    }
    .md-desc {
      z-index: 1;
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 8px;
      height: 22px;
      color: #808080;
      font-size: 11px;
      font-weight: 400;
      line-height: 16px;
    }
    .md-btn {
      display: inline-flex;
      height: 32px;
      margin-right: 12px;
      padding: 6px 12px;
      justify-content: center;
      align-items: center;
      color: #FFF;
      border-radius: 30px;
      background: linear-gradient(95deg, #FF8A00 -4.31%, #FF3D00 98.72%);
      font-size: 12px;
      font-weight: 500;
      line-height: 17px;
      box-sizing: border-box;
    }
      
</style>