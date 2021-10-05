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
              <span class="item-content">{{ data.baoshima }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">要素代码：</span>
              <span class="item-content">{{ data.yaosu }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">地区名称：</span>
              <span class="item-content">{{ data.diquname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">区域编码：</span>
              <span class="item-content">{{ data.quyubianma }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">湿地斑块编码：</span>
              <span class="item-content">{{ data.shidibk }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">湿地类：</span>
              <span class="item-content">{{ data.shidilei }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">湿地面积：</span>
              <span class="item-content">{{ data.shidimj }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">平均海拔：</span>
              <span class="item-content">{{ data.pjhaiba }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">所属三级流域：</span>
              <span class="item-content">{{ data.suoshusanji }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">纬度：</span>
              <span class="item-content">{{ data.weidu }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">经度：</span>
              <span class="item-content">{{ data.jingdu }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">调查人：</span>
              <span class="item-content">{{ data.diaocharen }}</span>
            </el-col>
         
            <el-col :span="8">
              <span class="item-title">调查时间：</span>
              <span class="item-content">{{ data.diaochadate }}</span>
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
