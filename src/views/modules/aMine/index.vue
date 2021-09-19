<template>
  <div class="container">
    <div class="top">
      <div class="item">
        <div class="left">
          <i class="fa fa-envira icon"></i>
        </div>
        <div class="right">
          <div class="num">95</div>
          <div class="desc">矿产总量</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-circle-o icon"></i>
        </div>
        <div class="right">
          <div class="num">25</div>
          <div class="desc">金属矿产</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-shield icon"></i>
        </div>
        <div class="right">
          <div class="num">60</div>
          <div class="desc">非金属矿产</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-sitemap icon"></i>
        </div>
        <div class="right">
          <div class="num">20</div>
          <div class="desc">能源矿产</div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="fa fa-stethoscope icon"></i>
        </div>
        <div class="right">
          <div class="num">10</div>
          <div class="desc">水汽矿产</div>
        </div>
      </div>
    </div>
    <div class="mid">
      <div class="chart">
        <Bar id="bar1" :data="data1" title="10" subTitle="金属矿区" />
      </div>
      <div class="chart">
        <Bar id="bar2" :data="data2" title="25" subTitle="非金属矿区" />
      </div>
      <div class="chart">
        <Bar id="bar3" :data="data3" title="7" subTitle="能源矿区" />
      </div>
      <div class="chart">
        <Bar id="bar4" :data="data4" title="4" subTitle="水汽矿区" />
      </div>
      <div class="chart">
        <Bar id="bar5" :data="data5" title="26" subTitle="金属矿产" axis="吨" />
      </div>
      <div class="chart">
        <Bar
          id="bar6"
          :data="data6"
          title="40"
          subTitle="非金属矿产"
          axis="吨"
        />
      </div>
      <div class="chart">
        <Bar id="bar7" :data="data7" title="15" subTitle="能源矿产" axis="吨" />
      </div>
      <div class="chart">
        <Bar id="bar8" :data="data8" title="14" subTitle="水汽矿产" axis="吨" />
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
              <el-dropdown @command="v => (barCommand = v)">
                <span class="el-dropdown-link">
                  {{ barCommand
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="本年">本年</el-dropdown-item>
                  <el-dropdown-item command="历年">历年</el-dropdown-item>
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
            <div class="chose">
              <el-dropdown @command="v => (pieCommand = v)">
                <span class="el-dropdown-link">
                  {{ pieCommand
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="本年">本年</el-dropdown-item>
                  <el-dropdown-item command="历年">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar3 id="pie2" :data="areaData" />
          </div>
        </div>
      </div>
      <div class="bottom-bottom">
        <div class="chartItems">
          <div class="title">
            <div class="text">金属资源产量</div>
            <div class="chose">
              <el-dropdown @command="v => (bar1Command = v)">
                <span class="el-dropdown-link">
                  {{ bar1Command
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="本年">本年</el-dropdown-item>
                  <el-dropdown-item command="历年">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar4 id="bottomBar1" :data="bar1Data" />
          </div>
        </div>
        <div class="chartItems">
          <div class="title">
            <div class="text">非金属资源产量</div>
            <div class="chose">
              <el-dropdown @command="v => (bar2Command = v)">
                <span class="el-dropdown-link">
                  {{ bar2Command
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="本年">本年</el-dropdown-item>
                  <el-dropdown-item command="历年">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar4 id="bottomBar2" :data="bar2Data" />
          </div>
        </div>
        <div class="chartItems">
          <div class="title">
            <div class="text">能源资源产量</div>
            <div class="chose">
              <el-dropdown @command="v => (bar3Command = v)">
                <span class="el-dropdown-link">
                  {{ bar3Command
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="本年">本年</el-dropdown-item>
                  <el-dropdown-item command="历年">历年</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="content">
            <Bar4 id="bottomBar3" :data="bar3Data" />
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
        { title: '金属', value: '25' },
        { title: '非金属', value: '60' },
        { title: '能源', value: '20' },
        { title: '水汽', value: '10' }
      ],
      areaData: [
        { title: '能源基地', value: '7' },
        { title: '规划矿区', value: '35' },
        { title: '资源保护区', value: '20' },
        { title: '资源堪察区', value: '10' },
        { title: '重点开采区', value: '15' },
        { title: '开采规划区', value: '27' }
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
  mounted () {},
  methods: {}
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
