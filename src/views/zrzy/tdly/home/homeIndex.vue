<template>
  <div>
    <el-container>
        <el-aside
          width="200px"
          :style="{ background: '#2A3B55', height: Height + 'px' }"
        >
          <el-menu
            default-active="Area"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#2A3B55"
            text-color="#cecece"
            active-text-color="#fff"
          >
            <el-menu-item index="Area">
              <template>
                <i class="el-icon-s-order"></i>
                <span>监测总面积</span>
              </template>
            </el-menu-item>
            <el-menu-item index="State">
              <i class="el-icon-s-order"></i>
              <span slot="title">土地资源状态分类</span>
            </el-menu-item>
            <el-menu-item index="Visit">
              <i class="el-icon-s-order"></i>
              <span slot="title">系统访问统计</span>
            </el-menu-item>
            <el-menu-item index="DataStatistics">
              <i class="el-icon-s-order"></i>
              <span slot="title">土地资源积累数据统计</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main :style="{height: Height + 'px', overflowY: 'auto'}">
          <component :is="componentIs"></component>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import Area from './area.vue'
import Visit from './visit.vue'
import DataStatistics from './dataStatistics.vue'
import State from './state.vue'
export default {
  name: 'homeIndex',
  data () {
    return {
      Height: 300,
      componentIs: 'Area'
    }
  },
  components: {
    Area,
    Visit,
    DataStatistics,
    State
  },
  methods: {
    handleSelect (key) {
      console.log(key)
      this.componentIs = key
    }
  },
  mounted () {
    let height = window.innerHeight
    this.Height = height - 60
  }
}
</script>

<style scoped>
</style>