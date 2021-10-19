//概况
<template>
  <div class="container">
    <div class="top">
      <div class="top-left">
        <div id="map" style="width: 100%; height: 100%;"></div>
      </div>
      <div class="top-center">
        <div class="top-center-top">
          <div class="top-center-top-left">
            <div class="top-center-top-left-title">整个虎豹园区范围图</div>
            <div class="top-center-top-left-item">第一园区：XXXXXXXXX</div>
            <div class="top-center-top-left-item">第二园区：XXXXXXXXX</div>
            <div class="top-center-top-left-item">第三园区：XXXXXXXXX</div>
            <div class="top-center-top-left-item">第四园区：XXXXXXXXX</div>
            <div class="top-center-top-left-item">第五园区：XXXXXXXXX</div>
          </div>
          <div class="top-center-top-right">
            <div id="map1" style="width: 100%; height: 100%;"></div>
          </div>
        </div>
        <div class="top-center-bottom">
          <!-- <div class="header">
            <div class="title">濒危程度</div>
            <div class="title">保护等级</div>
          </div> -->
          <div class="content" v-if="show">
            <div class="top-center-bottom-content-left">
              <Pie id="pie1" title="濒危程度" :data="DangerData" />
            </div>
            <div class="top-center-bottom-content-right">
              <Pie
                :tip="{ tip1: '类型', tip2: '占比' }"
                id="pie2"
                title="保护等级"
                :color="ProtectColor"
                :data="ProtectData"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="top-right">
        <div class="top-right-top">
          <div class="header red">
            <div class="line"></div>
            <div class="text">国家Ⅰ级保护野生植物</div>
          </div>
          <div class="content">
            <DvScrollBoard :config="ProtectConfig1" ref="scrollBoard" @click="getUrl" />
          </div>
        </div>
        <div class="top-right-bottom">
          <div class="header yellow">
            <div class="line"></div>
            <div class="text">国家Ⅱ级保护野生植物</div>
          </div>
          <div class="content">
            <DvScrollBoard :config="ProtectConfig2" ref="scrollBoard" @click="getUrl"/>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-left">
        <div class="header green">
          <div class="line"></div>
          <div class="text">濒危植物信息表</div>
        </div>
        <div class="content">
          <!-- <Bar id="bar1" :data="PlantsData" /> -->
          <DvScrollBoard :config="config" ref="scrollBoard" />
        </div>
      </div>
      <div class="bottom-center">
        <div class="header blue">
          <div class="line"></div>
          <div class="text">濒危植物统计图</div>
        </div>
        <div class="content">
          <Bar id="bar" :data="PlantsData" />
        </div>
      </div>
      <div class="bottom-right">
        <div class="header gray">
          <div class="title" style="text-align: left">
            <div class="line"></div>
            <div class="div">
              <div class="text">门类统计图</div>
              <div class="options">
                <el-select
                  v-model="select"
                  size="mini"
                  style="margin-top: -3px"
                >
                  <el-option
                    v-for="(v, k) in PlantsType"
                    :key="k"
                    :value="k"
                    :label="v"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <Bar3 id="bar3" :data="PlantsData" :select="select" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { loading, scrollBoard } from '@jiaminghi/data-view'

import L from 'leaflet'
import '@supermap/iclient-leaflet/dist/iclient-leaflet.css'
import 'leaflet/dist/leaflet.css'
import '@supermap/iclient-leaflet'

import Pie from '../components/pie'
import Bar from '../components/bar'
import Bar2 from '../components/bar2'
import Bar3 from '../components/bar3'
Vue.use(scrollBoard).use(loading)
export default {
  name: '',
  components: {
    Pie,
    Bar,
    Bar2,
    Bar3
  },
  props: {},
  data () {
    return {
      config: {
        header: ['', '蕨类', '裸子植物', '被子植物', '高等植物'],
        data: [
          ['科', '150', '34', '85', '150'],
          ['属', '120', '71', '37', '206'],
          ['种', '110', '123', '335', '333']
        ],
        headerBGC: '#fff',
        oddRowBGC: '#fff',
        evenRowBGC: '#f6f8fa'
      },
      ProtectConfig1: {
        data: [
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">东北红豆杉</span>', '<i style="display:none">https://baike.baidu.com/item/东北红豆杉</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">长白松</span>', '<i style="display:none">https://baike.baidu.com/item/长白松</i>']
        ],
        columnWidth: ['40', '140'],
        oddRowBGC: '#fff',
        evenRowBGC: '#f6f8fa'
      },
      ProtectConfig2: {
        data: [
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">红松</span>', '<i style="display:none">https://baike.baidu.com/item/红松</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">钻天柳</span>', '<i style="display:none">https://baike.baidu.com/item/钻天柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>'],
          ["<i class='el-icon-grape' />", '<span style="cursor: pointer;">水曲柳</span>', '<i style="display:none">https://baike.baidu.com/item/水曲柳</i>']
        ],
        oddRowBGC: '#fff',
        evenRowBGC: '#f6f8fa',
        columnWidth: ['40', '140']
      },
      select: 0,
      ProtectColor: [
        '#0CD2E6',
        '#3751E6',
        '#FFC722',
        '#886EFF',
        '#008DEC',
        '#114C90',
        '#00BFA5'
      ],
      ProtectData: [

      ],
      DangerData: [

      ],
      PlantsData: [
        { title: '蕨类', value1: '150', value2: '120', value3: '110' },
        { title: '裸子植物', value1: '34', value2: '71', value3: '123' },
        { title: '被子植物', value1: '85', value2: '37', value3: '335' },
        { title: '高等植物', value1: '150', value2: '206', value3: '333' }
      ],
      PlantsType: ['门', '科', '属', '种'],
      show: false,
      url: 'http://39.106.80.45:8091/iserver/services/map-hby/rest/maps'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.createMap()
  },
  activated () {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    initData () {
      this.$http({
        url: '/hby/bwsj/indexData',
        method: 'get'
      }).then(({data}) => {
        this.DangerData = []
        this.ProtectData = []
        for (let i in data.data.bwZh) {
          this.DangerData.push({
            title: i,
            value: data.data.bwZh[i]
          })
        }
        for (let i in data.data.bhZh) {
          this.ProtectData.push({
            title: i,
            value: data.data.bhZh[i]
          })
        }
        this.show = true
      })
    },
    getUrl (v) {
      let reg = /[\u4e00-\u9fa5]/g
      let d = v.ceil.match(reg).join('')
      window.open(`https://baike.baidu.com/item/${d}`, '_blank')
    },
    createMap () {
      let self = this
      // let baseLayer = L.supermap.tiandituTileLayer({layerType: 'img'})
      let baseLayer = L.tileLayer('https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4ced2e6d84f619258ea81002c05182ce')
      let parklayer = L.supermap.tiledMapLayer(self.url + '/park', {cacheEnabled: true, returnAttributes: true, visible: false, attribution: "Tile Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span> with <span>© <a href='https://iclient.supermap.io' target='_blank'>SuperMap iClient</a></span>"})
      let forestrylayer = L.supermap.tiledMapLayer(self.url + '/forestry', {cacheEnabled: true, returnAttributes: true, visible: false, attribution: "Tile Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span> with <span>© <a href='https://iclient.supermap.io' target='_blank'>SuperMap iClient</a></span>"})

      // 图标设定
      // let DefaultIcon = L.icon({
      //   iconUrl: icon,
      //   shadowUrl: iconShadow
      // })
      // L.Marker.prototype.options.icon = DefaultIcon

      let map = L.map('map', {
        crs: L.CRS.EPSG3857,
        center: [43.450, 130.319],
        maxZoom: 18,
        zoom: 8,
        layers: [baseLayer, forestrylayer, parklayer]
      })
      let baseMap = {'基础地图': baseLayer}
      let overMap = {'虎豹园基础图': parklayer, '国有林场点': forestrylayer}
      L.control.layers(baseMap, overMap).addTo(map)

      // map1
      let baseLayer1 = L.tileLayer('https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4ced2e6d84f619258ea81002c05182ce')
      let parklayer1 = L.supermap.tiledMapLayer(self.url + '/park', {cacheEnabled: true, returnAttributes: true, visible: false, attribution: 'hby'})
      let forestrylayer1 = L.supermap.tiledMapLayer(self.url + '/forestry', {cacheEnabled: true, returnAttributes: true, visible: false, attribution: 'hby'})

      // 图标设定
      // let DefaultIcon = L.icon({
      //   iconUrl: icon,
      //   shadowUrl: iconShadow
      // })
      // L.Marker.prototype.options.icon = DefaultIcon

      let map1 = L.map('map1', {
        crs: L.CRS.EPSG3857,
        center: [43.450, 130.319],
        maxZoom: 18,
        zoom: 6,
        layers: [baseLayer1, parklayer1]
      })
      let baseMap1 = {'基础地图': baseLayer1}
      let overMap1 = {'虎豹园基础图': parklayer1, '国有林场点': forestrylayer1}
      L.control.layers(baseMap1, overMap1).addTo(map1)
    }
  }
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  .top {
    height: 59%;
    display: flex;
    > div {
      border-radius: 5px;
    }
    .top-left {
      flex: 5;
    }
    .top-center {
      flex: 3;
      margin: 0 8px;
      display: flex;
      flex-direction: column;
      > div {
        border-radius: 5px;
      }
      .top-center-top {
        padding: 16px;

        border-radius: 5px;
        margin-bottom: 8px;
        height: 49%;
        background: #fff;
        display: flex;
        .top-center-top-left {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 8px;
          .top-center-top-left-title {
            font-weight: 600;
            font-size: 18px;
          }
          .top-center-top-left-item {
            margin: 12px 0;
          }
        }
        .top-center-top-right {
          flex: 1;
          
        }
      }
      .top-center-bottom {
        border-radius: 5px;
        overflow: hidden;
        background: #fff;
        flex: 1;
        display: flex;
        flex-direction: column;
        .content {
          flex: 1;
          display: flex;
          > div {
            flex: 1;
          }
          :first-child {
            border-right: 1px solid rgba(0, 0, 0, 0.09);
          }
        }
      }
    }
    .top-right {
      border-radius: 5px;
      flex: 2;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      > div {
        display: flex;
        flex-direction: column;
        .content {
          flex: 1;
        }

        background: #fff;
      }
      .top-right-top {
        border-right: 5px;
        overflow: hidden;
        height: 49%;
        margin-bottom: 8px;
      }
      .top-right-bottom {
        border-right: 5px;
        overflow: hidden;
        flex: 1;
      }
    }
    margin-bottom: 8px;
  }
  .bottom {
    height: 40%;
    border-radius: 5px;
    display: flex;
    overflow: hidden;
    > div {
      display: flex;
      flex-direction: column;
      border-radius: 5px;
      overflow: hidden;
      flex: 1;
      .content {
        width: 100%;
        flex: 1;
      }
    }
    .bottom-center {
      margin: 0 8px;
      .content {
        width: 101%;
      }
    }
    .bottom-left {
      background: #fff;
    }
  }
}
.header {
  width: 100%;
  background: #3f8ef7;
  height: 40px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  overflow: hidden;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 40px;
  .line {
    display: none;
    height: 10px;
    width: 100%;
    background: rgb(74, 184, 129);
  }
  .text {
    line-height: 34px;
    padding: 0 24px;
  }
  > div {
    flex: 1;
  }
  &.green {
    flex-direction: column;
    .text {
      color: rgb(74, 184, 129);
      flex: 1;

      font-weight: 550;
      text-align: left;
    }
    .line {
      display: block;
      height: 6px;
      background: rgb(74, 184, 129);
    }
    background: #fff;
  }
  &.blue {
    flex-direction: column;
    .text {
      color: #3f8ef7;
      flex: 1;

      font-weight: 550;
      text-align: left;
    }
    .line {
      display: block;
      height: 6px;
      background: #3f8ef7;
    }
    background: #fff;
  }
  &.gray {
    flex-direction: column;
    .div {
      display: flex;
      justify-content: space-between;
      .text {
        color: #3f3e3e;
        flex: 1;
        font-weight: 550;
        text-align: left;
      }
    }
    .line {
      display: block;
      height: 6px;
      background: #3f3e3e;
    }
    background: #fff;
  }
  &.red {
    flex-direction: column;

    .text {
      color: #e65858;
      flex: 1;
      font-weight: 550;
      text-align: left;
    }
    .line {
      display: block;
      height: 6px;
      background: #e65858;
    }
    background: #fff;
  }
  &.yellow {
    flex-direction: column;

    .text {
      color: #e2c649;
      flex: 1;
      font-weight: 550;
      text-align: left;
    }
    .line {
      display: block;
      height: 6px;
      background: #e2c649;
    }
    background: #fff;
  }
}

.dv-scroll-board {
  color: #333;
  /deep/ .header-item {
    font-size: 1em;
    text-align: center;
  }
  /deep/ .ceil {
    font-size: 1em;
    text-align: center;
  }
}
</style>

