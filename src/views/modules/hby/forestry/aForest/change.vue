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
    <div :class="$style.center">
      <div :class="$style.tipTitle">
        面积堆积图
      </div>
      <div :class="$style.chart">
        <chart1 id="chart1" />
      </div>
    </div>
    <div :class="$style.bottom">
      <div :class="$style.tipTitle">
        林地对比
      </div>
      <div :class="$style.content">
        <div :class="$style.left">
          <div :class="$style.tipTitle">
            <el-select size="mini" v-model="leftData">
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
                width="100"
                prop="year"
                fixed="left"
                label="年份"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="type"
                label="类型"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="area"
                label="面积"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="pro"
                label="百分比"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="num"
                label="斑块数"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="bi"
                label="斑块比"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="place"
                label="区域"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div :class="$style.center">
          <chart2 id="chart2" />
        </div>
        <div :class="$style.right">
          <div :class="$style.tipTitle">
            <el-select size="mini" v-model="rightData">
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
                width="100"
                prop="year"
                fixed="left"
                label="年份"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="type"
                label="类型"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="area"
                label="面积"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="pro"
                label="百分比"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="num"
                label="斑块数"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="bi"
                label="斑块比"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="place"
                label="区域"
              ></el-table-column>
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
      selectData: [
        { label: '乔木林地', value: 1 },
        { label: '灌木林地', value: 2 },
        { label: '沼泽林地', value: 3 },
        { label: '其他林地', value: 4 }
      ],
      leftData: '',
      rightData: '',
      leftTableData: [
        {
          year: '2010',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2011',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2012',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2013',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2014',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2015',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2016',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2017',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2018',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2019',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2020',
          type: '乔地',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        }
      ],
      rightTableData: [
        {
          year: '2010',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2011',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2012',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2013',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2014',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2015',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2016',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2017',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2018',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2019',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        },
        {
          year: '2020',
          type: '灌木',
          area: '123',
          pro: '23%',
          bi: '11%',
          num: '5',
          place: '大庆'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
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
      background: linear-gradient(
        to right,
        #f6d365 0%,
        #fda085 100%
      );

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
      background-image: linear-gradient(
        to right,
        #60b9b9 0%,
        #330867 100%
      );

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
  height: 260px;
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
