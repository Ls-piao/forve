<template>
  <div>
    <el-container>
        <el-aside
          width="200px"
          :style="{ background: '#2A3B55', height: Height + 'px' }"
        >
          <el-menu
            default-active="Glanceover"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#2A3B55"
            text-color="#cecece"
            active-text-color="#fff"
          >
            <el-menu-item index="Glanceover">
              <template>
                <i class="el-icon-s-order"></i>
                <span>珍惜植物名录查询</span>
              </template>
            </el-menu-item>
            <el-menu-item index="Query">
              <i class="el-icon-s-order"></i>
              <span slot="title">图查属性</span>
            </el-menu-item>
            <el-menu-item index="Query2">
              <i class="el-icon-s-order"></i>
              <span slot="title">属性查图</span>
            </el-menu-item>
            <el-menu-item index="Query3">
              <i class="el-icon-s-order"></i>
              <span slot="title">空间查询</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main :style="{height: Height + 'px', overflowY: 'auto'}">
          <!-- <component :is="componentIs"></component> -->
        </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'homeIndex',
  data () {
    return {
      Height: 300,
      componentIs: 'Glanceover'
    }
  },
  components: {
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