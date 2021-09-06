<template>
  <div>
    <el-row>
      <el-col :span="15">
        <div style='width:100%;border:#ccc solid 1px;' :style="{height: Height + 'px'}" id='dituContent'></div>
      </el-col>
      <el-col :span="9">
        <el-card>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="建设资源">
            </el-table-column>
            <el-table-column
              prop="name"
              label="面积（万亩）">
            </el-table-column>
            <el-table-column
              prop="address"
              label="占比（%）">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div style="position: absolute;top: 80px;right: 30px;">
      <el-checkbox-group v-model="checkboxGroup1" size="small">
        <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
  </div>
</template>

<script>
  import {MP} from '../../js/map.js'
  const cityOptions = ['农田', '林地', '建设用地', '草地']
  export default {
    data () {
      return {
        ak: 'I7ioGmQbypWKuWMNv5fLPKU4mt3gzhrz', // 正式线上项目，务必替换成自己的key
        dialogTableVisible: false,
        BMap: null,
        map: null,
        title: '',
        imgUrl: '',
        index: 1,
        markerArr1: [{title: '紫金山', content: '~@/assets/img/zjs.png', point: '118.853196|32.08811', isOpen: 0, icon: {w: 23, h: 25, l: 46, t: 21, x: 9, lb: 12}},
        {title: '玄武湖', content: '~@/assets/img/xwh.png', point: '118.804616|32.080278', isOpen: 0, icon: {w: 23, h: 25, l: 46, t: 21, x: 9, lb: 12}}
        ],
        Height: 400,
        checkboxGroup1: ['农田'],
        cities: cityOptions,
        tableData: [{
          date: '农田',
          name: '40',
          address: '23.81'
        }, {
          date: '林地',
          name: '38',
          address: '22.62'
        }, {
          date: '建设用地',
          name: '32',
          address: '19.05'
        }, {
          date: '草地',
          name: '30',
          address: '17.86'
        }, {
          date: '其它',
          name: '28',
          address: '16.66'
        }]
      }
    },
    methods: {
      initMap () {
            // 百度地图API功能
        this.createMap()// 创建地图
      },
      createMap () {
        var map = new this.BMap.Map('dituContent')// 在百度地图容器中创建一个地图
        var point = new this.BMap.Point(118.853196, 32.08811)// 定义一个中心点坐标
        map.centerAndZoom(point, 14)// 设定地图的中心点和坐标并将地图显示在地图容器中
        // map.setMapStyleV2({
        //   styleId: '44ce7d9e957f49e0f17ccee298d7bdd4'
        // })
        this.map = map// 将map变量存储在全局
      }
    },
    mounted () {
      let height = window.innerHeight
      this.Height = height - 60
      let _this = this
      MP(this.ak).then(BMap => {
            // 百度地图API功能
        _this.BMap = BMap
        _this.initMap()
      })
    }
  }
</script>

<style scoped>

</style>