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
              <span class="item-title">户主：</span>
              <span class="item-content">{{ data.hzname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">产权证号：</span>
              <span class="item-content">{{ data.cqzh }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">社区名称：</span>
              <span class="item-content">{{ data.sqname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">小区名称：</span>
              <span class="item-content">{{ data.xqname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">楼栋号：</span>
              <span class="item-content">{{ data.ldId }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">单元号：</span>
              <span class="item-content">{{ data.dy }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">门牌号：</span>
              <span class="item-content">{{ data.mph }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">房屋性质：</span>
              <span class="item-content">{{ data.fwxz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">是否入住：</span>
              <span class="item-content">{{ data.isrz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">流动人口：</span>
              <span class="item-content">{{ data.isld }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">重点人口：</span>
              <span class="item-content">{{ data.zdrk }}</span>
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
  width: 80px;
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
