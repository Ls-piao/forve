<template>
  <div class="header">
    <el-container>
      <el-header>
        <div class="header-title">
          <img src="../images/logo.png" width="50">
          <span>土地利用子系统</span>
        </div>
        <ul class="header-ul">
          <li :class="{active: componentId == 'homeIndex'}" @click="handClidk('homeIndex')">首页</li>
          <li :class="{active: componentId == 'stateIndex'}" @click="handClidk('stateIndex')">土地资源状态</li>
          <li :class="{active: componentId == 'classifyIndex'}" @click="handClidk('classifyIndex')">土地资源分类</li>
          <li :class="{active: componentId == 'trendIndex'}" @click="handClidk('trendIndex')">土地资源变化趋势</li>
          <li>合同管理</li>
        </ul>
      </el-header>
      <el-main :style="{padding: 0, height: Height + 'px'}">
        <component :is="componentId"></component>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import '../css/index.css'
import homeIndex from './home/homeIndex.vue'
import classifyIndex from './classify/classifyIndex.vue'
import trendIndex from './trend/trendIndex.vue'
import stateIndex from './state/stateIndex.vue'
export default {
  data () {
    return {
      Height: 300,
      componentId: 'homeIndex'
    }
  },
  components: {
    homeIndex,
    classifyIndex,
    trendIndex,
    stateIndex
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