<template>
  <div>
    <el-container>
        <el-aside
          width="200px"
          :style="{ background: '#2a3b55', height: Height + 'px' }"
        >
          <el-menu
            default-active="History"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#2A3B55"
            text-color="#cecece"
            active-text-color="#fff"
          >
            <el-menu-item index="History">
              <template>
                <i class="el-icon-s-order"></i>
                <span>历史变化</span>
              </template>
            </el-menu-item>
            <el-menu-item index="Analyse">
              <i class="el-icon-s-order"></i>
              <span slot="title">年际变化分析</span>
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
import Analyse from './analyse.vue'
import History from './history.vue'
export default {
  name: 'homeIndex',
  data () {
    return {
      Height: 300,
      componentIs: 'History'
    }
  },
  components: {
    Analyse,
    History
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