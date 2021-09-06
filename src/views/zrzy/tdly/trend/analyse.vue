<template>
  <div>
    <div style="padding: 5px 15px;background: #e8e8e8;margin-bottom: 20px;">
      <span>选择年份：</span>
      <el-date-picker
        v-model="value3"
        type="year"
        placeholder="选择年"
        size="small"
        style="width: 100px;">
      </el-date-picker>
       ~ 
      <el-date-picker
        v-model="value4"
        type="year"
        placeholder="选择年"
        size="small"
        style="width: 100px;">
      </el-date-picker>
    </div>
    <el-row :gutter="5">
      <el-col :span="12">
        <div style='width:100%;height: 300px;' id='dituContent1'></div>
      </el-col>
      <el-col :span="12">
        <div style='width:100%;height: 300px;' id='dituContent2'></div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="面积（万亩）"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="占比（%）">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {MP} from '../../js/map.js'
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
        }],
        value3: new Date('2015'),
        value4: new Date('2016')
      }
    },
    methods: {
      initMap () {
            // 百度地图API功能
        this.createMap()// 创建地图
      },
      createMap () {
        var map = new this.BMap.Map('dituContent1')// 在百度地图容器中创建一个地图
        var point = new this.BMap.Point(118.853196, 32.08811)// 定义一个中心点坐标
        map.centerAndZoom(point, 14)// 设定地图的中心点和坐标并将地图显示在地图容器中
        // map.setMapStyleV2({
        //   styleId: '44ce7d9e957f49e0f17ccee298d7bdd4'
        // })
        var map2 = new this.BMap.Map('dituContent2')// 在百度地图容器中创建一个地图
        var point2 = new this.BMap.Point(118.853196, 32.08811)// 定义一个中心点坐标
        map2.centerAndZoom(point2, 14)// 设定地图的中心点和坐标并将地图显示在地图容器中
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