<template>
  <div :class="$style.container">
    <div :class="$style.top">
      <div :class="$style['top-item']">
        <div :class="$style.data">
          <div :class="$style.left">
            <img src="./images/ziran1.png" alt />
          </div>
          <div :class="$style.right">
            <div :class="$style.num">{{ zmj }}㎡</div>
            <div :class="$style.label">林地面积</div>
          </div>
        </div>
      </div>
      <div :class="$style['top-item']">
        <div :class="$style.data">
          <div :class="$style.left">
            <img src="./images/ziran2.png" alt />
          </div>
          <div :class="$style.right">
            <div :class="$style.num">{{ qm }}㎡</div>
            <div :class="$style.label">乔木林地</div>
          </div>
        </div>
      </div>
      <div :class="$style['top-item']">
        <div :class="$style.data">
          <div :class="$style.left">
            <img src="./images/ziran3.png" alt />
          </div>
          <div :class="$style.right">
            <div :class="$style.num">{{ gm }}㎡</div>
            <div :class="$style.label">灌木林地</div>
          </div>
        </div>
      </div>
      <div :class="$style['top-item']">
        <div :class="$style.data">
          <div :class="$style.left">
            <img src="./images/ziran4.png" alt />
          </div>
          <div :class="$style.right">
            <div :class="$style.num">{{ zz }}㎡</div>
            <div :class="$style.label">沼泽林地</div>
          </div>
        </div>
      </div>
      <div :class="$style['top-item']">
        <div :class="$style.data">
          <div :class="$style.left">
            <img src="./images/ziran5.png" alt />
          </div>
          <div :class="$style.right">
            <div :class="$style.num">{{ 5 }}㎡</div>
            <div :class="$style.label">其他林地</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.center">
      <div :class="$style.tipTitle">
        面积堆积图
      </div>
      <div :class="$style.chart">
        <chart1 id="chart1" v-if="showLine" :data="lineData2" />
      </div>
    </div>
    <div :class="$style.bottom">
      <div :class="$style.tipTitle">
        林地对比
      </div>
      <div :class="$style.content">
        <div :class="$style.left">
          <div :class="$style.tipTitle">
            <el-select size="mini" v-model="leftData" @change="selectLeft">
              <el-option
                v-for="v in selectData"
                :key="v.label"
                :value="v.value"
                :label="v.label"
              ></el-option>
            </el-select>
          </div>
          <div :class="$style.table">
            <el-table style="width:100%" :data="leftTableData" stripe>
              <el-table-column
                prop="nd"
                fixed="left"
                label="年份"
              ></el-table-column>
              <el-table-column width="100" prop="type" label="类型">
                <template slot-scope="s">
                  {{ $dictUtils.getDictLabel(s.row.lz) }}
                </template>
              </el-table-column>
              <el-table-column prop="total" label="面积"></el-table-column>

              <el-table-column prop="bh" label="斑块数"></el-table-column>
            </el-table>
          </div>
        </div>
        <div :class="$style.center">
          <chart2
            id="chart2"
            v-if="show"
            :name1="name1"
            :name2="name2"
            :data="barData"
          />
        </div>
        <div :class="$style.right">
          <div :class="$style.tipTitle">
            <el-select size="mini" v-model="rightData" @change="selectRight">
              <el-option
                v-for="v in selectData"
                :key="v.label"
                :value="v.value"
                :label="v.label"
              ></el-option>
            </el-select>
          </div>
          <div :class="$style.table">
            <el-table style="width:100%" :data="rightTableData" stripe>
              <el-table-column
                prop="nd"
                fixed="left"
                label="年份"
              ></el-table-column>
              <el-table-column width="100" prop="type" label="类型">
                <template slot-scope="s">
                  {{ $dictUtils.getDictLabel(s.row.lz) }}
                </template>
              </el-table-column>
              <el-table-column prop="total" label="面积"></el-table-column>

              <el-table-column prop="bh" label="斑块数"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart1 from './chart/area'
import chart2 from './chart/contrastBar'
import animateInteger from '../aMyPage/components/animate-integer/index.vue'
import * as _ from 'lodash'
// eslint-disable-next-line camelcase
function array_key_set (arr, column, more = false) {
  let a = {}
  _.forOwn(arr, (v) => {
    if (more) {
      if (!a[v[column]]) {
        a[v[column]] = []
      }
      a[v[column]].push(v)
    } else {
      a[v[column]] = v
    }
  })
  return a
}
export default {
  name: '',
  components: {
    chart1,
    chart2,
    animateInteger
  },
  props: {},
  data () {
    return {
      selectData: [],
      leftData: '',
      rightData: '',
      show: false,
      showLine: false,
      leftTableData: [],
      rightTableData: [],
      zmj: 0,
      otherData: '',
      qm: 0,
      gm: 0,
      zz: 0,
      lineData: [],
      lineData2: [],
      name1: '',
      name2: '',
      timer: null,
      barData: [],
      test: 2020
    }
  },
  // computed: {
  //   barData () {

  //     return a
  //   }
  // },
  // watch: {
  //   barData () {
  //     this.show = false
  //     this.timer && clearTimeout(this.timer)
  //     this.timer = setTimeout(() => {
  //       this.show = true
  //     }, 500)
  //   }
  // },
  created () {},
  async activated () {
    this.init()
    this.selectData = await this.$dictUtils.getDictList('ZRZY_SLZY_SLLX')
    await this.selectLeft('1')
    await this.selectRight('2')
  },
  methods: {
    init () {
      this.$http({
        url: '/hby/slindex/indexdata',
        method: 'get'
      }).then(({ data }) => {
        this.zmj = data.data.zmj.toFixed(0)
        this.qm = data.data.ldvo[1].total.toFixed(0)
        this.gm = data.data.ldvo[2].total.toFixed(0)
        this.zz = data.data.ldvo[3].total.toFixed(0)
        this.lineData = []
        for (let x of data.data.detail) {
          this.lineData.push({
            title: x.year,
            value: x.tbmj
          })
        }
      })
      this.$http({
        url: '/hby/slindex/indexdataBylzDjTu'
      }).then(({data}) => {
        let d = array_key_set(data.data, 'year', true)
        let xArr = Object.keys(d)
        let res = []
        for (let i in d) {
          let x = d[i]

          for (let a of x) {
            for (let b of xArr) {
              let obj = {
                title: i,
                value1: 0,
                value2: 0,
                value3: 0,
                value4: 0
              }
              if (a.year === b) {
                switch (a.lz) {
                  case '1':
                    obj.value1 = a.total
                    break
                  case '2':
                    obj.value2 = a.total
                    break
                  case '3':
                    obj.value3 = a.total
                    break
                  case '4':
                    obj.value4 = a.total
                    break
                  default:
                    break
                }
                res.push(obj)
              }
            }
          }
        }
        this.lineData2 = res
        this.showLine = true
      })
    },
    async selectLeft (v) {
      this.show = false
      this.$http({
        url: '/hby/slindex/indexdataBylz',
        method: 'get',
        params: {
          lz: v
        }
      }).then(({ data }) => {
        this.leftData = v
        this.leftTableData = data.data

        this.getBarData()
      })
    },
    selectRight (v) {
      this.show = false
      this.$http({
        url: '/hby/slindex/indexdataBylz',
        method: 'get',
        params: {
          lz: v
        }
      }).then(({ data }) => {
        this.rightData = v
        this.rightTableData = data.data
        this.getBarData()
      })
    },
    getBarData () {
      // this.barData.push({title: ++this.test, value1: 1, value2: 2})
      let arr1 = []
      let arr2 = []
      let name1 = this.$dictUtils.getDictLabel('ZRZY_SLZY_SLLX', this.leftData)
      let name2 = this.$dictUtils.getDictLabel('ZRZY_SLZY_SLLX', this.rightData)

      for (let x of this.leftTableData) {
        arr1.push({ title: x.nd, name1, name2, value1: x.total, value2: 0 })
      }
      for (let x of this.rightTableData) {
        arr2.push({ title: x.nd, name1, name2, value2: x.total, value1: 0 })
      }
      if (arr1.length >= arr2.length) {
        for (let x of arr1) {
          for (let a of arr2) {
            if (x.title === a.title) {
              x.value2 = a.value2
            }
          }
        }
        this.barData = arr1
      } else if (arr2.length > arr1.length) {
        for (let x of arr2) {
          for (let a of arr1) {
            if (x.title === a.title) {
              x.value1 = a.value1
            }
          }
        }
        this.barData = arr2
      } else {
        this.barData = []
      }
      this.show = true
      // let a = this.leftTableData.map(v => {
      //   return {
      //     title: v.nd,
      //     value1: v.total,
      //     value2: 0
      //   }
      // })
      // let b = this.rightTableData.map(v => {
      //   return {
      //     title: v.nd,
      //     value1: 0,
      //     value2: v.total
      //   }
      // })
      // for (let x of a) {
      //   for (let c of b) {
      //     if (x.title === c.title) {
      //       x.value2 = c.value2
      //     } else {
      //       a.push(c)
      //     }
      //   }
      // }
      // a.sort((s, j) => {
      //   return s.title - j.title
      // })
      // this.barData = a
    }
  }
}
</script>
<style lang="scss"></style>
<style module lang="scss">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  margin-bottom: 12px;
  .top-item {
    flex: 1;
    margin-right: 24px;
    padding: 0 20px;
    border-radius: 4px;
    position: relative;
    color: rgb(82, 83, 107);
    background: #fff;
    &:last-child {
      margin-right: 0;
    }
    &::after {
      content: "";
      opacity: 0.1;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.5);
      background-image: url("../aMyPage/images/data1.png");
      background-repeat: no-repeat;
      // background-position;
      background-size: 120px 120px;
      background-position: right 40px;
    }
    &:nth-child(1) {
      color: #fff;
      background-image: linear-gradient(45deg, #39b54a, #8dc63f);

      &::after {
        background-image: url("../aMyPage/images/data1.png");
      }
      .data {
        .left {
          background: url("../aMyPage/images/circle-blue.svg") no-repeat;
        }
      }
      .tip {
        color: rgb(0, 124, 255);
        .tip-num {
          color: rgb(0, 124, 255);
        }
      }
    }
    &:nth-child(2) {
      color: #fff;
      background-image: linear-gradient(45deg, #0081ff, #1cbbb4);

      &::after {
        background-image: url("../aMyPage/images/data2.png");
      }
      .data {
        .left {
          background: url("../aMyPage/images/circle-blue.svg") no-repeat;
        }
      }
    }
    &:nth-child(3) {
      color: #fff;
      background-image: linear-gradient(45deg, #0081ff, #1cbbb4);

      &::after {
        background-image: url("../aMyPage/images/data4.png");
      }
      .data {
        .left {
          background: url("../aMyPage/images/circle-blue.svg") no-repeat;
        }
      }
    }
    &:nth-child(4) {
      color: #fff;
      background: linear-gradient(to right, #f6d365 0%, #fda085 100%);

      &::after {
        background-image: url("../aMyPage/images/data4.png");
      }
      .data {
        .left {
          background: url("../aMyPage/images/circle-blue.svg") no-repeat;
        }
      }
    }
    &:nth-child(5) {
      color: #fff;
      background-image: linear-gradient(to right, #60b9b9 0%, #330867 100%);

      &::after {
        background-image: url("../aMyPage/images/data4.png");
      }
      .data {
        .left {
          background: url("../aMyPage/images/circle-blue.svg") no-repeat;
        }
      }
    }

    .data {
      display: flex;
      margin: 20px 0;
      align-items: center;
      .left {
        border-radius: 50%;
        margin-right: 14px;
        width: 70px;
        height: 70px;
        text-align: center;
        line-height: 64px;
        img {
          width: 30px;
          height: 30px;
        }
      }
      .right {
        .num {
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 32px;
        }
        .label {
          font-size: 18px;
        }
      }
    }
    .tip {
      color: rgb(123, 122, 149);
      .label {
        margin-right: 12px;
      }
      img {
        margin-left: 6px;
        width: 15px;
        height: 15px;
      }
      .tip-num {
        color: rgb(82, 83, 107);
      }
    }
  }
}
.center {
  display: flex;
  flex-direction: column;
  height: 360px;
  background: #fff;
  border-radius: 5px;
  .chart {
    flex: 1;
  }
}
.bottom {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  border-radius: 5px;
  flex: 1;
  .content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    > div {
      background: #fff;
      border-radius: 5px;
      width: 33%;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .center {
    }
    .right,
    .left {
      .table {
        height: 320px;
        width: 100%;
        overflow-y: scroll;
        overflow-x: scroll;
      }
    }
  }
}
.tipTitle {
  height: 30px;
  font-size: 14px;
  line-height: 30px;

  background: #fff;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  padding-left: 8px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}
</style>
<style lang="scss">
::-webkit-scrollbar {
  width: 8px;
}
//滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}
</style>
