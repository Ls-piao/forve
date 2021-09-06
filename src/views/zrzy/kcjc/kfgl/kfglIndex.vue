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
            <el-menu-item index="Guanli">
              <template>
                <i class="el-icon-s-order"></i>
                <span>矿产资源管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="Jiance">
              <i class="el-icon-s-order"></i>
              <span slot="title">矿产资源动态监测</span>
            </el-menu-item>
            <el-menu-item index="Shenhe">
              <i class="el-icon-s-order"></i>
              <span slot="title">矿权审核</span>
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
      componentIs: 'Guanli'
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