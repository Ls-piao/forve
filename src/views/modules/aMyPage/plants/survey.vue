//概况
<template>
  <div class="container">
    <div class="top">
      <div class="top-left">
        <img
          src="./static/charts1.png"
          style="width: 100%; height: 100%"
          alt=""
        />
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
            <img
              src="./static/charts1.png"
              style="width: 100%; height: 100%"
              alt=""
            />
          </div>
        </div>
        <div class="top-center-bottom">
          <div class="header">
            <div class="title">濒危程度</div>
            <div class="title">保护等级</div>
          </div>
          <div class="content">
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
          <div class="header">国家Ⅰ级保护野生植物</div>
          <div class="content">
            <DvScrollBoard :config="ProtectConfig1" ref="scrollBoard" />
          </div>
        </div>
        <div class="top-right-bottom">
          <div class="header">国家Ⅱ级保护野生植物</div>
          <div class="content">
            <DvScrollBoard :config="ProtectConfig2" ref="scrollBoard" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-left">
        <div class="header">濒危植物信息表</div>
        <div class="content">
          <!-- <Bar id="bar1" :data="PlantsData" /> -->
          <DvScrollBoard :config="config" ref="scrollBoard" />
        </div>
      </div>
      <div class="bottom-center">
        <div class="header">濒危植物统计图</div>
        <div class="content">
          <Bar id="bar" :data="PlantsData" />
        </div>
      </div>
      <div class="bottom-right">
        <div class="header">
          <div class="title" style="text-align: left">门类统计图</div>
          <div class="options">
            <el-select v-model="select" size="mini">
              <el-option
                v-for="(v, k) in PlantsType"
                :key="k"
                :value="k"
                :label="v"
              ></el-option>
            </el-select>
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
import Vue from "vue";
import { loading, scrollBoard } from "@jiaminghi/data-view";
Vue.use(scrollBoard).use(loading);

import Pie from "../components/pie";
import Bar from "../components/bar";
import Bar2 from "../components/bar2";
import Bar3 from "../components/bar3";
export default {
  name: "",
  components: {
    Pie,
    Bar,
    Bar2,
    Bar3,
  },
  props: {},
  data() {
    return {
      config: {
          header:["",'蕨类','裸子植物','被子植物','高等植物'],
        data: [
          ["科", "150", "34", "85", "150"],
          ["属", "120", "71", "37", "206"],
          ["种", "110", "123", "335", "333"],
        ],
      },
      ProtectConfig1: {
        data: [["<i class='el-icon-grape' />","东北红豆杉"], ["<i class='el-icon-grape' />","长白松"]],
        columnWidth:['40','180']
      },
      ProtectConfig2: {
        data: [
          ["<i class='el-icon-grape' />","红松"],
          ["<i class='el-icon-grape' />","钻天柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
          ["<i class='el-icon-grape' />","水曲柳"],
        ],
        columnWidth:['40','180']
      },
      select: 0,
      ProtectColor: [
        "#0CD2E6",
        "#3751E6",
        "#FFC722",
        "#886EFF",
        "#008DEC",
        "#114C90",
        "#00BFA5",
      ],
      ProtectData: [
        { title: "一级植物", value: 15 },
        { title: "二级植物", value: 40 },
        { title: "三级植物", value: 45 },
      ],
      DangerData: [
        { title: "近危", value: 55 },
        { title: "易危", value: 15 },
        { title: "濒危", value: 30 },
      ],
      PlantsData: [
        { title: "蕨类", value1: "150", value2: "120", value3: "110" },
        { title: "裸子植物", value1: "34", value2: "71", value3: "123" },
        { title: "被子植物", value1: "85", value2: "37", value3: "335" },
        { title: "高等植物", value1: "150", value2: "206", value3: "333" },
      ],
      PlantsType: ["门", "科", "属", "种"],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
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
            border-right: 1px solid rgba($color: #000000, $alpha: 0.09);
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

        background: #0a2732;
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
      background: #0a2732;
    }
  }
}
.header {
  width: 100%;
  background: #3f8ef7;
  height: 30px;
  display: flex;
  padding: 0 24px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  font-size: 14px;
  > div {
    flex: 1;
  }
  //   .title {
  //     height: 100%;
  //     :nth-child(1) {
  //       border-right: 1px solid rgba($color: #000000, $alpha: 0.07);
  //     }
  //   }
}
</style>

