<template>
  <div class="header">
    <el-container>
      <el-header>
        <div class="header-title">
          <img src="../images/logo.png" width="50">
          <span>矿场资源监测系统</span>
        </div>
        <ul class="header-ul">
          <li :class="{active: componentId == 'homeIndex'}" @click="handClidk('homeIndex')">首页</li>
          <li :class="{active: componentId == 'kczyIndex'}" @click="handClidk('kczyIndex')">矿产资源</li>
          <li :class="{active: componentId == 'kfglIndex'}" @click="handClidk('kfglIndex')">矿产资源开发管理</li>
          <li :class="{active: componentId == 'kcjcIndex'}" @click="handClidk('kcjcIndex')">矿产监测</li>
        </ul>
      </el-header>
      <el-main :style="{padding: 0, height: Height + 'px'}">
        <component :is="componentId"></component>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import homeIndex from './home/homeIndex.vue'
import kfglIndex from './kfgl/kfglIndex.vue'
import kcjcIndex from './kcjc/kcjcIndex.vue'
import kczyIndex from './kczy/kczyIndex.vue'
export default {
  data () {
    return {
      Height: 300,
      componentId: 'homeIndex'
    }
  },
  components: {
    homeIndex,
    kfglIndex,
    kcjcIndex,
    kczyIndex
  },
  methods: {
    handClidk (code) {
      this.componentId = code
    }
  },
  mounted () {
    let height = window.innerHeight
    this.Height = height - 60
  }
}
</script>

<style scoped>
.active {
  color: #000;
}
</style>