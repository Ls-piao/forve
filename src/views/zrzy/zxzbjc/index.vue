<template>
  <div class="header">
    <el-container>
      <el-header>
        <div class="header-title">
          <img src="../images/logo.png" width="50">
          <span>珍惜植物资源监测系统</span>
        </div>
        <ul class="header-ul">
          <li :class="{active: componentId == 'homeIndex'}" @click="handClidk('homeIndex')">首页</li>
          <li :class="{active: componentId == 'zwmlIndex'}" @click="handClidk('zwmlIndex')">珍惜植物名录</li>
          <li :class="{active: componentId == 'cxzsIndex'}" @click="handClidk('cxzsIndex')">查询展示</li>
          <li :class="{active: componentId == 'tjhzIndex'}" @click="handClidk('tjhzIndex')">统计汇总</li>
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
import cxzsIndex from './cxzs/cxzsIndex.vue'
import tjhzIndex from './tjhz/tjhzIndex.vue'
import zwmlIndex from './zwml/zwmlIndex.vue'
export default {
  data () {
    return {
      Height: 300,
      componentId: 'homeIndex'
    }
  },
  components: {
    homeIndex,
    cxzsIndex,
    tjhzIndex,
    zwmlIndex
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