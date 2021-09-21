<template>
  <div class="container">
    <div class="top">
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../aMyPage/images/data1.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="95" /></div>
            <div class="label">社区总数</div>
          </div>
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../aMyPage/images/data2.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="1883" /></div>
            <div class="label">房屋总数</div>
          </div>
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../aMyPage/images/data3.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="351" /></div>
            <div class="label">周边商户</div>
          </div>
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../aMyPage/images/data4.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="354361" /></div>
            <div class="label">社区人数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="top">
        <div class="top-left banner">
          <!-- <div class="title">社区商户数</div> -->
          <Line1 id="line1" />
        </div>
        <div class="top-right">
          <Sex :data="SexData" :total="73013" />
        </div>
      </div>
      <div class="bottom">
        <div class="bottom-left">
          <!-- <div class="title">年龄段分布</div> -->
          <div class="chart">
            <Bar id="bar1" :data="BarData" />
          </div>
        </div>
        <div class="bottom-right">
          <!-- <div class="title">每年发生的灾害次数</div> -->
          <div class="chart">
            <Pie2 id="pie2" :data="PieData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import animateInteger from '../aMyPage/components/animate-integer/index.vue'
import Pie2 from './pie2'
import Line1 from './line'
import Bar from './bar3'
import Sex from './sex'
export default {
  components: {
    Sex,
    Pie2,
    animateInteger,
    Line1,
    Bar
  },
  data () {
    let symbols = [
      'path://M18.2629891,11.7131596 L6.8091608,11.7131596 C1.6685112,11.7131596 0,13.032145 0,18.6237673 L0,34.9928467 C0,38.1719847 4.28388932,38.1719847 4.28388932,34.9928467 L4.65591984,20.0216948 L5.74941883,20.0216948 L5.74941883,61.000787 C5.74941883,65.2508314 11.5891201,65.1268798 11.5891201,61.000787 L11.9611506,37.2137775 L13.1110872,37.2137775 L13.4831177,61.000787 C13.4831177,65.1268798 19.3114787,65.2508314 19.3114787,61.000787 L19.3114787,20.0216948 L20.4162301,20.0216948 L20.7882606,34.9928467 C20.7882606,38.1719847 25.0721499,38.1719847 25.0721499,34.9928467 L25.0721499,18.6237673 C25.0721499,13.032145 23.4038145,11.7131596 18.2629891,11.7131596 M12.5361629,1.11022302e-13 C15.4784742,1.11022302e-13 17.8684539,2.38997966 17.8684539,5.33237894 C17.8684539,8.27469031 15.4784742,10.66467 12.5361629,10.66467 C9.59376358,10.66467 7.20378392,8.27469031 7.20378392,5.33237894 C7.20378392,2.38997966 9.59376358,1.11022302e-13 12.5361629,1.11022302e-13',
      'path://M28.9624207,31.5315864 L24.4142575,16.4793596 C23.5227152,13.8063773 20.8817445,11.7111088 17.0107398,11.7111088 L12.112691,11.7111088 C8.24168636,11.7111088 5.60080331,13.8064652 4.70917331,16.4793596 L0.149791395,31.5315864 C-0.786976655,34.7595013 2.9373074,35.9147532 3.9192135,32.890727 L8.72689855,19.1296485 L9.2799493,19.1296485 C9.2799493,19.1296485 2.95992025,43.7750224 2.70031069,44.6924335 C2.56498417,45.1567684 2.74553639,45.4852068 3.24205501,45.4852068 L8.704461,45.4852068 L8.704461,61.6700801 C8.704461,64.9659872 13.625035,64.9659872 13.625035,61.6700801 L13.625035,45.360657 L15.5097899,45.360657 L15.4984835,61.6700801 C15.4984835,64.9659872 20.4191451,64.9659872 20.4191451,61.6700801 L20.4191451,45.4852068 L25.8814635,45.4852068 C26.3667633,45.4852068 26.5586219,45.1567684 26.4345142,44.6924335 C26.1636859,43.7750224 19.8436568,19.1296485 19.8436568,19.1296485 L20.3966199,19.1296485 L25.2043926,32.890727 C26.1862111,35.9147532 29.9105828,34.7595013 28.9625083,31.5315864 L28.9624207,31.5315864 Z M14.5617154,0 C17.4960397,0 19.8773132,2.3898427 19.8773132,5.33453001 C19.8773132,8.27930527 17.4960397,10.66906 14.5617154,10.66906 C11.6274788,10.66906 9.24611767,8.27930527 9.24611767,5.33453001 C9.24611767,2.3898427 11.6274788,0 14.5617154,0 L14.5617154,0 Z',
      'path://M512 292.205897c80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 65.503248 592.855572 0 512 0 431.144428 0 365.641179 65.503248 365.641179 146.358821 365.641179 227.214393 431.144428 292.205897 512 292.205897zM512 731.282359c-80.855572 0-146.358821 65.503248-146.358821 146.358821 0 80.855572 65.503248 146.358821 146.358821 146.358821 80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 796.273863 592.855572 731.282359 512 731.282359z'
    ]
    return {
      searchParams: '',
      searchDates: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      PieData: [
        { title: '服装业', value: 15 },
        { title: 'IT业', value: 20 },
        { title: '工业', value: 21 },
        { title: '金融业', value: 14 },
        { title: '建筑业', value: 10 },
        { title: '其他业', value: 20 }
      ],
      BarData: [
        // eslint-disable-next-line standard/object-curly-even-spacing
        { title: '0~12', value1: '150'},
        { title: '12~18', value1: '34' },
        { title: '18~40', value1: '85' },
        { title: '40以上', value1: '85' }
      ],

      SexData: [
        {
          name: '男',
          symbol: symbols[0],
          value: 63,
          nums: 45451,
          itemStyle: {
            normal: {
              color: 'rgba(105,204,230)' // 单独控制颜色
            }
          }
        },
        {},
        {
          name: '女',
          symbol: symbols[1],
          value: 37,
          nums: 28012,
          itemStyle: {
            normal: {
              color: 'rgba(255,130,130)' // 单独控制颜色
            }
          }
        }
      ]
    }
  },
  methods: {
    reset () {
      this.searchDates = ''
      this.searchParams = ''
    },
    doSearch () {}
  },
  watch: {
    searchDates (v) {
      if (v) {
        this.searchParams.beginDate = v[0] + ' 00:00:00'
        this.searchParams.endDate = v[1] + ' 23:59:59'
      } else {
        this.searchParams.beginDate = ''
        this.searchParams.endDate = ''
      }
    }
  },
  computed: {},
  mounted () {},
  created () {}
}
</script>

<style lang="less">
</style>
<style lang='less' scoped>

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.page-header {
  position: relative;
  margin-bottom: 12px;
  background-color: #fff;
  min-height: 50px;
  box-sizing: border-box;
  padding: 16px;
  border-left: #127efc 4px solid;
  .el-input,
  .el-cascader,
  .el-date-editor,
  .el-select {
    margin-right: 12px;
  }
  .el-cascader {
    width: 400px;
  }
}
.top {
  display: flex;
  margin-bottom: 12px;
  .top-item {
    flex: 1;
    margin-right: 24px;
    height: 154px;
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
      background-image: linear-gradient(45deg, #ff9700, #ed1c24);

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
        line-height: 70px;
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
.content {
  background: #aaddca38;
  flex: 1;
  padding: 16px;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  > div {
    display: flex;
    > div {
      //   border: 1px solid;
      
      background: #fff;
      border-radius: 5px;
      &:first-child {
        width: 70%;
        margin-right: 16px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
  .top {
    height: 60%;
    margin-bottom: 16px;
    .top-left {
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .top-right {
      display: flex;
      .title {
        width: 35%;
        text-align: left;
        transform: translateY(38%);
        font-size: 16px;
        line-height: 1.5em;
        position: relative;
        left: 5%;
        font-weight: 550;
        .num {
          margin-top: 10px;
          font-size: 44px;
        }
      }
      #pie2 {
        flex: 1;
      }
    }
  }
  .bottom {
    flex: 1;

    > div {
      padding: 8px;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 24px;
        font-weight: 550;
        margin-bottom: 8px;
      }
      .chart {
        width: 100%;
        flex: 1;
      }
    }
  }
}
</style>