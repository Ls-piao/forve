<template>
  <div>
    <el-container>
        <el-aside
          width="200px"
          :style="{ background: '#2a3b55', height: Height + 'px' }"
        >
          <el-menu
            default-active="Exploit"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#2A3B55"
            text-color="#cecece"
            active-text-color="#fff"
          >
            <el-menu-item index="Exploit">
              <template>
                <i class="el-icon-s-order"></i>
                <span>开发利用</span>
              </template>
            </el-menu-item>
            <el-menu-item index="Deal">
              <i class="el-icon-s-order"></i>
              <span slot="title">市场交易</span>
            </el-menu-item>
            <el-menu-item index="Reserve">
              <i class="el-icon-s-order"></i>
              <span slot="title">收购储备</span>
            </el-menu-item>
            <el-menu-item index="Construction">
              <i class="el-icon-s-order"></i>
              <span slot="title">集体建设</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main :style="{height: Height + 'px', overflowY: 'auto', padding: 0}">
          <component :is="componentIs"></component>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import Exploit from './exploit.vue'
import Reserve from './reserve.vue'
import Deal from './deal.vue'
import Construction from './construction.vue'
export default {
  name: 'homeIndex',
  data () {
    return {
      Height: 300,
      componentIs: 'Exploit'
    }
  },
  components: {
    Exploit,
    Reserve,
    Deal,
    Construction
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