<template>
  <div class="container">
    <div class="top">
      <div class="item">
        <div class="left">
          <i class="fa fa-envira icon"></i>
        </div>
        <div class="right">
          <div class="num">{{ topData.kczl }}</div>
          <div class="desc">矿产总量</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-circle-o icon"></i>
        </div>
        <div class="right">
          <div class="num">{{ topData.jskczl }}</div>
          <div class="desc">金属矿产</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-shield icon"></i>
        </div>
        <div class="right">
          <div class="num">{{ topData.fjskczl }}</div>
          <div class="desc">非金属矿产</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-sitemap icon"></i>
        </div>
        <div class="right">
          <div class="num">{{ topData.nykczl }}</div>
          <div class="desc">能源矿产</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-stethoscope icon"></i>
        </div>
        <div class="right">
          <div class="num">{{ topData.sqkczl }}</div>
          <div class="desc">水汽矿产</div>
        </div>
      </div>
    </div>
    <div class="mid">
      <div class="chart">
        <Bar
          v-if="show"
          id="bar1"
          :data="data1"
          :title="total.jskq"
          subTitle="金属矿区"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar2"
          :data="data2"
          :title="total.fjskq"
          subTitle="非金属矿区"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar3"
          :data="data3"
          :title="total.nykq"
          subTitle="能源矿区"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar4"
          :data="data4"
          :title="total.sqkq"
          subTitle="水汽矿区"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar5"
          :data="data5"
          :title="total.jskczl||0"
          axis="吨"
          subTitle="金属矿产"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar6"
          :data="data6"
          :title="total.fjskczl"
          axis="吨"
          subTitle="非金属矿产"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar7"
          :data="data7"
          :title="total.nykczl"
          subTitle="能源矿产"
          axis="吨"
        />
      </div>
      <div class="chart">
        <Bar
          v-if="show"
          id="bar8"
          :data="data8"
          :title="total.sqkczl"
          axis="吨"
          subTitle="水汽矿产"
        />
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-top">
        <div class="bottom-top-left">
          <div class="title">
            <div class="text">
              矿产产量比
            </div>
            <div class="chose">
              <el-dropdown @command="getPieData">
                <span class="el-dropdown-link">
                  {{ barCommand }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">本年</el-dropdown-item>
                  <el-dropdown-item command="2">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Pie id="pie1" :data="pieData" />
          </div>
        </div>
        <div class="bottom-top-right">
          <div class="title">
            <div class="text">
              矿区分布
            </div>
          </div>
          <div class="content">
            <Bar3 id="pie2" v-if="show" :data="areaData" />
          </div>
        </div>
      </div>
      <div class="bottom-bottom">
        <div class="chartItems">
          <div class="title">
            <div class="text">金属资源产量</div>
            <div class="chose">
              <el-dropdown @command="getBar1Data">
                <span class="el-dropdown-link">
                  {{ bar1Command
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">本年</el-dropdown-item>
                  <el-dropdown-item command="2">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar4 id="bottomBar1" v-if="show" :data="bar1Data" />
          </div>
        </div>
        <div class="chartItems">
          <div class="title">
            <div class="text">非金属资源产量</div>
            <div class="chose">
              <el-dropdown @command="getBar2Data">
                <span class="el-dropdown-link">
                  {{ bar2Command
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">本年</el-dropdown-item>
                  <el-dropdown-item command="2">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar4 id="bottomBar2" v-if="show" :data="bar2Data" />
          </div>
        </div>
        <div class="chartItems">
          <div class="title">
            <div class="text">能源资源产量</div>
            <div class="chose">
              <el-dropdown @command="getBar3Data">
                <span class="el-dropdown-link">
                  {{ bar3Command
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">本年</el-dropdown-item>
                  <el-dropdown-item command="2">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar4 id="bottomBar3" v-if="show" :data="bar3Data" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bar from './components/bar2.vue'
import Pie from './components/pie.vue'
import Bar3 from './components/bar3'
import Bar4 from './components/bar'
export default {
  name: '',
  components: {
    Bar,
    Pie,
    Bar3,
    Bar4
  },
  props: {},
  data () {
    return {
      show: false,
      topData: {
        kczl: 0,
        jskczl: 0,
        fjskczl: 0,
        nykczl: 0,
        sqkczl: 0
      },
      total: {
        jskq: 0,
        fjskq: 0,
        nykq: 0,
        sqkq: 0,
        nyjd: 0,
        ghkq: 0,
        zybhq: 0,
        zykcq: 0,
        zykaicaiq: 0,
        kcghq: 0
      },
      data1: [
        { title: '2017', value: '6' },
        { title: '2018', value: '4' },
        { title: '2019', value: '0' },
        { title: '2020', value: '0' },
        { title: '2021', value: '0' }
      ],
      data2: [
        { title: '2017', value: '5' },
        { title: '2018', value: '10' },
        { title: '2019', value: '5' },
        { title: '2020', value: '1' },
        { title: '2021', value: '4' }
      ],
      data3: [
        { title: '2017', value: '3' },
        { title: '2018', value: '1' },
        { title: '2019', value: '2' },
        { title: '2020', value: '1' },
        { title: '2021', value: '0' }
      ],
      data4: [
        { title: '2017', value: '2' },
        { title: '2018', value: '0' },
        { title: '2019', value: '1' },
        { title: '2020', value: '0' },
        { title: '2021', value: '1' }
      ],
      data5: [
        { title: '2017', value: '11' },
        { title: '2018', value: '5' },
        { title: '2019', value: '7' },
        { title: '2020', value: '1' },
        { title: '2021', value: '2' }
      ],
      data6: [
        { title: '2017', value: '10' },
        { title: '2018', value: '15' },
        { title: '2019', value: '5' },
        { title: '2020', value: '7' },
        { title: '2021', value: '3' }
      ],
      data7: [
        { title: '2017', value: '5' },
        { title: '2018', value: '4' },
        { title: '2019', value: '3' },
        { title: '2020', value: '2' },
        { title: '2021', value: '1' }
      ],
      data8: [
        { title: '2017', value: '3' },
        { title: '2018', value: '4' },
        { title: '2019', value: '5' },
        { title: '2020', value: '1' },
        { title: '2021', value: '1' }
      ],
      pieData: [
        { title: '金属', value: '0' },
        { title: '非金属', value: '0' },
        { title: '能源', value: '0' },
        { title: '水汽', value: '0' }
      ],
      areaData: [
        { title: '能源基地', value: '0' },
        { title: '规划矿区', value: '0' },
        { title: '资源保护区', value: '0' },
        { title: '资源堪察区', value: '0' },
        { title: '重点开采区', value: '0' },
        { title: '开采规划区', value: '0' }
      ],
      bar1Data: [
        { title: '铁', value: '15' },
        { title: '钨', value: '23' },
        { title: '钼', value: '13' },
        { title: '锰', value: '8' },
        { title: '铬', value: '7' }
      ],
      bar2Data: [
        { title: '石灰石', value: '15' },
        { title: '黄金', value: '23' },
        { title: '花岗岩', value: '13' },
        { title: '大理石', value: '8' },
        { title: '玄武岩', value: '7' }
      ],
      bar3Data: [
        { title: '煤', value: '15' },
        { title: '油页岩', value: '23' },
        { title: '天然气', value: '13' },
        { title: '页岩气', value: '8' },
        { title: '地热资源', value: '7' }
      ],
      pieCommand: '本年',
      bar1Command: '本年',
      bar2Command: '本年',
      bar3Command: '本年',
      barCommand: '本年'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.initData()
    this.getPieData(1)
    this.getBar1Data(1)
    this.getBar2Data(1)
    this.getBar3Data(1)
  },
  methods: {
    async initData () {
      this.$http({
        url: '/hby/kcindex/indexdata',
        method: 'get'
      }).then(({ data }) => {
        // topData
        this.topData.sqkczl = data.data.sqkczl
        this.topData.nykczl = data.data.nykczl
        this.topData.fjskczl = data.data.fjskczl
        this.topData.jskczl = data.data.jskczl
        this.topData.kczl = data.data.kczl
        // totaldata
        this.total.jskq = data.data.jskq
        this.total.fjskq = data.data.fjskq
        this.total.nykq = data.data.nykq
        this.total.sqkq = data.data.sqkq
        this.total.jskczl = data.data.jskczl
        this.total.fjskczl = data.data.fjskczl
        this.total.nykczl = data.data.nykczl
        this.total.sqkczl = data.data.sqkczl
        // top柱状图
        for (let x of this.data1) {
          x.value = 0
          for (let i in data.data.yearJs) {
            let v = data.data.yearJs[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data2) {
          x.value = 0
          for (let i in data.data.yearFJs) {
            let v = data.data.yearFJs[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data3) {
          x.value = 0
          for (let i in data.data.yearNyl) {
            let v = data.data.yearNyl[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data4) {
          x.value = 0
          for (let i in data.data.yearSq) {
            let v = data.data.yearSq[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data5) {
          x.value = 0
          for (let i in data.data.yearJsl) {
            let v = data.data.yearJsl[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data6) {
          x.value = 0
          for (let i in data.data.yearFJsl) {
            let v = data.data.yearFJsl[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data7) {
          x.value = 0
          for (let i in data.data.yearNyl) {
            let v = data.data.yearNyl[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        for (let x of this.data8) {
          x.value = 0
          for (let i in data.data.yearSql) {
            let v = data.data.yearSql[i]
            if (x.title === i) {
              x.value = v
            }
          }
        }
        // mid柱状图
        this.areaData[0].value = data.data.nyjd
        this.areaData[1].value = data.data.ghkq
        this.areaData[2].value = data.data.zybhq
        this.areaData[3].value = data.data.zykcq
        this.areaData[4].value = data.data.zykaicaiq
        this.areaData[5].value = data.data.kcghq
        this.$nextTick(() => {
          this.show = true
        })
      })
    },
    getPieData (v) {
      // eslint-disable-next-line eqeqeq
      if (v == 1) {
        this.barCommand = '本年'
      } else {
        this.barCommand = '历年'
      }
      this.$http({
        url: '/hby/kcindex/indexdatabingzhuangtu',
        method: 'get',
        params: {
          year: v
        }
      }).then(({data}) => {
        this.pieData[0].value = data.data.jsbingtu
        this.pieData[1].value = data.data.fjsbingtu
        this.pieData[2].value = data.data.nybingtu
        this.pieData[3].value = data.data.sqbingtu
      })
    },
    getBar1Data (year) {
      // eslint-disable-next-line eqeqeq
      this.bar1Command = year == 1 ? '本年' : '历年'
      this.$http({
        url: '/hby/kcindex/indexdatazhuzhuangtu',
        params: {
          year,
          type: 1
        }
      }).then(({data}) => {
        this.bar1Data = data.data.jszhuzhuangtu
      })
    },
    getBar2Data (year) {
         // eslint-disable-next-line eqeqeq
      this.bar2Command = year == 1 ? '本年' : '历年'
      this.$http({
        url: '/hby/kcindex/indexdatazhuzhuangtu',
        params: {
          year,
          type: 2
        }
      }).then(({data}) => {
        this.bar2Data = data.data.jszhuzhuangtu
      })
    },
    getBar3Data (year) {
         // eslint-disable-next-line eqeqeq
      this.bar3Command = year == 1 ? '本年' : '历年'
      this.$http({
        url: '/hby/kcindex/indexdatazhuzhuangtu',
        params: {
          year,
          type: 3
        }
      }).then(({data}) => {
        this.bar3Data = data.data.jszhuzhuangtu
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100%;
  width: 100%;
  background: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.top {
  padding: 8px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #f7f8f9;
  .item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    .left {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin-right: 8px;
      position: relative;
      .icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 20px;
      }
    }
    .right {
      .num {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 4px;
      }
      .desc {
        font-size: 14px;
        color: #939393;
      }
    }
    &:nth-child(1) {
      .left {
        background: #41a1fd;
      }
    }
    &:nth-child(2) {
      .left {
        background: #56e09f;
      }
    }
    &:nth-child(3) {
      .left {
        background: #fd836c;
      }
    }
    &:nth-child(4) {
      .left {
        background: #f2cf42;
      }
    }
    &:nth-child(5) {
      .left {
        background: #6dbffd;
      }
    }
  }
}
.mid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
  .chart {
    margin-bottom: 16px;
    width: 24%;
    border-radius: 5px;
    overflow: hidden;
    height: 130px;
  }
}
.bottom {
  flex: 1;
  .bottom-top {
    display: flex;
    height: 300px;
    > div {
      display: flex;
      background: #fdfbfb;
      border-radius: 5px;
      overflow: hidden;
      flex-direction: column;
      .title {
        display: flex;
        padding: 4px 8px;
        justify-content: space-between;
        border-top: 5px solid #41a1fd;
        border-bottom: 1px solid #ccc;
        .text {
          font-size: 18px;
          font-weight: 550;
        }
      }
      .content {
        flex: 1;
      }
    }
    .bottom-top-left {
      flex: 3;
      margin-right: 16px;
    }
    .bottom-top-right {
      flex: 5;
      .title {
        border-top: 5px solid #fd836c;
      }
    }
  }
  .bottom-bottom {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    height: 200px;
    .chartItems {
      flex: 1;
      display: flex;
      background: #fdfbfb;
      border-radius: 5px;
      overflow: hidden;
      flex-direction: column;
      .title {
        display: flex;
        padding: 4px 8px;
        justify-content: space-between;
        border-top: 5px solid #41a1fd;
        border-bottom: 1px solid #ccc;
        .text {
          font-size: 18px;
          font-weight: 550;
        }
      }
      &:nth-child(1) {
        .title {
          border-top: 5px solid #56e09f;
        }
      }
      &:nth-child(2) {
        .title {
          border-top: 5px solid #f2cf42;
        }
      }
      &:nth-child(3) {
        .title {
          border-top: 5px solid #af79f4;
        }
      }
      .content {
        flex: 1;
      }
      &:nth-child(2) {
        margin: 0 16px;
      }
    }
  }
}
</style>
