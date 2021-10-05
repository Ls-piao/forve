<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="查阅"
  >
    <div id="print">
      <div class="itemview">
        <div class="div-title">基本信息</div>
        <div class="formitem">
          <el-row>
            <el-col :span="8">
              <span class="item-title">标识码：</span>
              <span class="item-content">{{ data.biaoshima }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">要素代码：</span>
              <span class="item-content">{{ data.yaosudaima }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">分区编号：</span>
              <span class="item-content">{{ data.fenquhao }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">分区名称：</span>
              <span class="item-content">{{ data.fenquming }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">所在行政区：</span>
              <span class="item-content">{{ data.suozaixingzhengqu }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">分区面积：</span>
              <span class="item-content">{{ data.fenqumj }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">拐点坐标：</span>
              <span class="item-content">{{ data.guaidianzuobiao }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">主要矿产代码：</span>
              <span class="item-content">{{ data.zhuyaokuangchan }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">主要矿产名称：</span>
              <span class="item-content">{{ data.zhuyaokcmingcheng }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">已设探矿权总数：</span>
              <span class="item-content">{{ data.yitoukqzongshu }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">拟设探矿权总数：</span>
              <span class="item-content">{{ data.nitoukuangquanzongshu }}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">规划期：</span>
              <span class="item-content">{{ data.guihuaqi }}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">规划编制级别：</span>
              <span class="item-content">{{ data.guaihualevel }}</span>
            </el-col>
            <el-col :span="24">
              <span class="item-title">备注：</span>
              <span class="item-content">{{ data.remarks }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      data: ''
    }
  },
  computed: {},
  mounted () {},
  methods: {
    init (v) {
      this.data = v
      this.visible = true
    },
    cancelForm () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
#print {
  margin-bottom: 180px;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 80px;
  background: #fff;
  width: 100%; 
  //   text-align: center;
  // line-height: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    > button {
      height: 50px;
      width: 200px;
    }
  }
}
.itemview {
  background: white;
  border-radius: 4px;
  padding-top: 10px;
}

.div-title {
  font-size: 16px;
  font-weight: 600;
  border-left: #127efc 4px solid;
  padding-left: 20px;
}

.formitem {
  margin-top: 10px;
  border-top: #eee 1px solid;
  padding: 0 15px 20px 15px;
}

.el-form-item {
  width: 100%;
}

/deep/.el-form-item__content {
  width: calc(100% - 100px) !important;
}

.martop10 {
  margin-top: 10px;
}

.item-title,
.item-content {
  display: inline-block;
  margin-top: 20px;
}
.more {
  width: 220px;
}
.item-title {
  min-width: 80px;
  text-align: right;
}

.item-content {
  margin-left: 20px;
}

.nodata {
  padding: 30px 0 10px 0;
  text-align: center;
}
</style>
