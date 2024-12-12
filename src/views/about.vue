<template>
  about
  <div @click="onclick">button => home</div>
</template>

<script lang='ts' setup>
import {useRouter} from 'vue-router'
const router = useRouter();

const onclick = () => {
  router.push('/')
}
</script>

<style scoped>
</style>