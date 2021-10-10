<template>
  <div :class="$style.container">
    <div :class="$style.top">
      <div :class="$style['top-item']">
        <div :class="$style.data">
          <div :class="$style.left">
            <img src="./images/ziran1.png" alt />
          </div>
          <div :class="$style.right">
            <div :class="$style.num"><animateInteger value="95" />㎡</div>
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
            <div :class="$style.num"><animateInteger value="10" />㎡</div>
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
            <div :class="$style.num"><animateInteger value="5" />㎡</div>
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
            <div :class="$style.num"><animateInteger value="5" />㎡</div>
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
            <div :class="$style.num"><animateInteger value="5" />㎡</div>
            <div :class="$style.label">其他林地</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.content">
      <div :class="$style.top">
        <div :class="$style.left">
          <div :class="$style.tipTitle">
            森林蓄积量
          </div>
          <div :class="$style.chart">
            <chart1 id="chart1" />
          </div>
        </div>
        <div :class="$style.right">
          <div :class="$style.tipTitle">
            历年森林覆盖率变化
          </div>
          <div :class="$style.chart">
            <chart2 id="chart2" />
          </div>
        </div>
      </div>
      <div :class="$style.center">
        <div :class="$style.left">
           <div :class="$style.tipTitle">
            年内NDVI变化
          </div>
           <div :class="$style.chart">
            <chart3 id="chart3" />
          </div>
        </div>
        <div :class="$style.right">
           <div :class="$style.tipTitle">
            年内EVI变化
          </div>
            <div :class="$style.chart">
            <chart4 id="chart4" />
          </div>
        </div>
      </div>
      <div :class="$style.bottom">
         <div :class="$style.left">
           <div :class="$style.tipTitle">
            历年NDVI变化
          </div>
           <div :class="$style.chart">
            <chart5 id="chart5" />
          </div>
        </div>
        <div :class="$style.right">
           <div :class="$style.tipTitle">
            林种统计
          </div>
           <div :class="$style.chart">
            <chart6 id="chart6" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart1 from './chart/shuiqiu'
import chart2 from './chart/line1'
import chart3 from './chart/line2'
import chart4 from './chart/bar'
import chart5 from './chart/line3'
import chart6 from './chart/line4'
import animateInteger from '../aMyPage/components/animate-integer/index.vue'
export default {
  name: '',
  components: {
    chart1,
    chart2,
    chart3,
    chart4,
    chart5,
    chart6,
    animateInteger
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style module lang="scss">
.container {
  height: 100%;
  width: 100%;
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
      background-image: linear-gradient(to right, #30cfd0 0%, #330867 100%);

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
.content {
  > div {
    > div {
      background-color: #fff;
      border-radius: 5px;
    }
  }
  .top {
    display: flex;
    >div{
       display: flex;
      flex-direction: column;
      .chart{
        flex:1
      }
    }
    .left {
      width: 300px;
      margin-right:16px;
      height: 200px;
    }
    .right {
      flex:1
    }
  }
  .bottom,
  .center{
    margin-bottom:16px;
    display: flex;
    >div  {
      flex:1;
      height: 200px;
      display: flex;
      flex-direction: column;
      .chart{
        flex:1
      }
    }
    .left{
      margin-right: 16px;
    }
  }
}
.tipTitle {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  padding-left: 8px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}
</style>
