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
              <span class="item-title">商铺编号：</span>
              <span class="item-content">{{ data.id }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">店名：</span>
              <span class="item-content">{{ data.shname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">所属社区：</span>
              <span class="item-content">{{ data.sqname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">门牌号：</span>
              <span class="item-content">{{ data.mph }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">商户位置：</span>
              <span class="item-content">{{ data.wz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">营业执照：</span>
              <span class="item-content">{{ data.yyzz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">法人姓名：</span>
              <span class="item-content">{{ data.frname }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">法人身份：</span>
              <span class="item-content">{{ data.frsf }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">法人户籍：</span>
              <span class="item-content">{{ data.frhj }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">房间性质：</span>
              <span class="item-content">{{ data.fwxz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">从事行业：</span>
              <span class="item-content">{{ $dictUtils.getDictLabel('ZRZY_SQFW_HYFL',data.cszy) }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">面积：</span>
              <span class="item-content">{{ data.mj }}</span>
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
#print{
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
    width:220px
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
