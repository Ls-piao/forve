<template>
  <div class="container" :id="id"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "",
  components: {},
  props: {
    id: {
      type: String,
      default: "pie",
    },

    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "标题",
    },
    color: {
      type: Array,
      default: () => ["#ffe000", "#ffa800", "#ff5b00", "#ff3000"],
    },
    tip: {
      type: Object,
      default: () => {
        return {
          tip1: "程度",
          tip2: "占比",
        };
      },
    },
    select: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      theEcharts: null,
    };
  },
  watch:{
      select(v){
          this.theEcharts.clear()
          this.drawChart(this.BaseOptions)
      }
  },
  computed: {
    BaseOptions() {
      let that = this;
      let options = {
        backgroundColor: "#323a5e",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "14%",
          top: "16%",
          containLabel: true,
        },
        legend: {
          data: ["1", "2", "3"],
          right: 10,
          top: 12,
          textStyle: {
            color: "#fff",
          },
          itemWidth: 12,
          itemHeight: 10,
          // itemGap: 35
        },
        xAxis: {
          show: false,
          boundaryGap:['5%','5%'],
        },

        yAxis: {
          splitLine: {
            show: false,
          },
          axisLine: {
            //y轴
            show: false,
          },
          type: "category",
          axisTick: {
            show: false,
          },
          inverse: true,
          data: this.data.map((v) => v.title),
          boundaryGap:['5%','5%'],
          axisLabel: {
            color: "#A7D6F4",
            fontSize: 14,
          },
        },
        series: [
          {
            type: "bar",
            name:
              this.select == 0
                ? "门"
                : this.select == 1
                ? "科"
                : this.select == 2
                ? "属"
                : "种",
            barWidth: "15%",
            label: {
              show: true,
              position: "right", // 位置
              color: "#A7D6F4",
              fontSize: 14,
              distance: 15, // 距离
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#fccb05",
                  },
                  {
                    offset: 1,
                    color: "#f5804d",
                  },
                ]),
                barBorderRadius: 12,
              },
            },
            data: this.data.map((v) => {
              if (this.select == 0) {
                return v.value1;
              } else if (this.select == 1) {
                return v.value2;
              } else {
                return v.value3;
              }
            }),
          },
        ],
      };
      this.drawChart(options);
      return options;
    },
  },
  created() {},
  mounted() {
    this.theEcharts = echarts.init(document.getElementById(this.id));
    this.theEcharts.clear(); //适用于大数据量的切换时图表绘制错误,先清空在重绘
    this.drawChart(this.BaseOptions);
  },
  methods: {
    drawChart(options) {
      // 装载数据
      this.theEcharts.setOption(options, true); //设置为true可以使图表切换数据时重新渲染
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
}
</style>
