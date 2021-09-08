<template>
  <div class="container">
    <div class="page-header">
      <el-date-picker
        v-model="searchDates"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-button @click="doSearch" icon="el-icon-search" type="primary"
        >查询</el-button
      >
      <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
    </div>
    <div class="top">
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data1.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="95" /></div>
            <div class="label">林业灾害发生次数</div>
          </div>
        </div>
        <div class="tip">
          <span class="label">今日新增</span>
          <span class="tip-num"><animateInteger value="10" /></span>
          <img :src="upgreen" alt />
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data2.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="10" /></div>
            <div class="label">森林火灾次数</div>
          </div>
        </div>
        <div class="tip">
          <span class="label">今日新增</span>
          <span class="tip-num"><animateInteger value="0" /></span>
          <!-- <img :src="upgreen" alt /> -->
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data3.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="5" /></div>
            <div class="label">病虫害次数</div>
          </div>
        </div>
        <div class="tip">
          <span class="label">今日新增</span>
          <span class="tip-num"><animateInteger value="1" /></span>
          <img :src="upgreen" alt />
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data4.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="10" /></div>
            <div class="label">野生动物疫源疾病</div>
          </div>
        </div>
        <div class="tip">
          <span class="label">今日新增</span>
          <span class="tip-num"><animateInteger value="2" /></span>
          <img :src="upgreen" alt />
        </div>
      </div>
    </div>
    <div class="content">
      <div class="top">
        <div class="top-left banner">
          <el-carousel trigger="click" style="height: 100%">
            <el-carousel-item
              v-for="item in banners"
              :key="item"
              style="height: 100%"
            >
              <img :src="item" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="top-right">
          <div class="title">
            <div>总计受灾面积:</div>
            <div class="num"><animateInteger value="12546" />㎡</div>
          </div>
          <Pie2 id="pie2" :data="PieData" />
        </div>
      </div>
      <div class="bottom">
        <div class="bottom-left">
          <div class="title">每个月发生的灾害的比例</div>
          <div class="chart">
            <Line1 id="line1" />
          </div>
        </div>
        <div class="bottom-right">
          <div class="title">每年发生的灾害次数</div>
          <div class="chart">
            <Bar id="bar1" :data="BarData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import animateInteger from "../components/animate-integer/index.vue";
import Pie2 from "../components/pie2";
import Line1 from "../components/line";
import Bar from "../components/bar4";
export default {
  components: {
    Pie2,
    animateInteger,
    Line1,
    Bar,
  },
  data() {
    return {
      up: require("../images/up.png"),
      upgreen: require("../images/up-green.png"),
      searchParams: "",
      searchDates: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      PieData: [
        { title: "林火", value: 33 },
        { title: "病虫害", value: 37 },
        { title: "有害植物入侵受灾", value: 30 },
      ],
      BarData: [
        { title: "2010", value1: "150", value2: "120", value3: "110" },
        { title: "2011", value1: "34", value2: "71", value3: "123" },
        { title: "2012", value1: "85", value2: "37", value3: "335" },
        { title: "2013", value1: "77", value2: "212", value3: "322" },
        { title: "2014", value1: "35", value2: "271", value3: "145" },
        { title: "2015", value1: "44", value2: "255", value3: "141" },
        { title: "2016", value1: "112", value2: "216", value3: "361" },
        { title: "2017", value1: "78", value2: "186", value3: "252" },
        { title: "2018", value1: "88", value2: "154", value3: "253" },
        { title: "2019", value1: "16", value2: "165", value3: "221" },
        { title: "2020", value1: "64", value2: "146", value3: "121" },
        { title: "2021", value1: "99", value2: "193", value3: "224" },
      ],
      banners: [
        require("../images/banner1.jpg"),
        require("../images/banner2.jpg"),
        require("../images/banner3.jpg"),
        require("../images/banner4.jpg"),
        require("../images/banner5.jpg"),
        require("../images/banner6.jpg"),
      ],
    };
  },
  methods: {
    reset() {
      this.searchDates = "";
      this.searchParams = "";
    },
    doSearch() {},
  },
  watch: {
    searchDates(v) {
      if (v) {
        this.searchParams.beginDate = v[0] + " 00:00:00";
        this.searchParams.endDate = v[1] + " 23:59:59";
      } else {
        this.searchParams.beginDate = "";
        this.searchParams.endDate = "";
      }
    },
  },
  computed: {},
  mounted() {},
  created() {},
};
</script>

<style lang="less">
.banner {
  .el-carousel {
    height: 100% !important;
    .el-carousel__container {
      height: 100% !important;
      .el-carousel__item {
        height: 100% !important;
      }
    }
  }
}
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
      background-image: url("../images/data1.png");
      background-repeat: no-repeat;
      // background-position;
      background-size: 120px 120px;
      background-position: right 40px;
    }
  &:nth-child(1) {
      color: #fff;
      background-image: linear-gradient(45deg, #39b54a, #8dc63f);
      &::after {
        background-image: url("../images/data1.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
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
      color: #fff;background-image: linear-gradient(45deg, #0081ff, #1cbbb4);


      &::after {
        background-image: url("../images/data2.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
        }
      }
    }
    &:nth-child(3) {
      color: #fff;
      background-image: linear-gradient(45deg, #0081ff, #1cbbb4);

      &::after {
        background-image: url("../images/data4.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
        }
      }
    }
    &:nth-child(4) {
        color: #fff;background-image: linear-gradient(45deg, #ff9700, #ed1c24);

      &::after {
        background-image: url("../images/data4.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
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
        width: 48%;
        margin-right: 16px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
  .top {
    height: 48%;
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
        flex: 1;
      }
    }
  }
}
</style>