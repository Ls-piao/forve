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
              <span class="item-title">权属：</span>
              <span class="item-content">{{ data.qs }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">填表日期：</span>
              <span class="item-content">{{ data.creatTime }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">单位个人：</span>
              <span class="item-content">{{ data.dwgr }}</span>
            </el-col>
            <!-- <el-col :span="8">
              <span class="item-title">登记权力：</span>
              <span class="item-content">{{ data.djql }}</span>
            </el-col> -->
            <el-col :span="8">
              <span class="item-title">法人代表：</span>
              <span class="item-content">{{ data.frdb }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">通讯地址：</span>
              <span class="item-content">{{ data.txdz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">身份证号：</span>
              <span class="item-content">{{ data.sfzh }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">林地所有权权利人：</span>
              <span class="item-content">{{ data.ldsyqqlr }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">林地使用权权利人：</span>
              <span class="item-content">{{ data.ldsyqqlr2 }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">森林或林木所有权权利人：</span>
              <span class="item-content">{{ data.slhlmsyqqlr }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">森林或林木使用权权利人：</span>
              <span class="item-content">{{ data.dwgr }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">单位个人：</span>
              <span class="item-content">{{ data.slhlmsyqqlr2 }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="itemview">
        <div class="div-title">林地信息</div>
        <div class="formitem">
          <el-row>
            <el-col :span="8">
              <span class="item-title">坐落：</span>
              <span class="item-content">{{ data.zl }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">小地名：</span>
              <span class="item-content">{{ data.xdm }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">林班：</span>
              <span class="item-content">{{ data.lb }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">面积：</span>
              <span class="item-content">{{ data.mj }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">林种：</span>
              <span class="item-content">{{ data.lz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">造林年度：</span>
              <span class="item-content">{{ data.zlnd }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">株数：</span>
              <span class="item-content">{{ data.zs }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">主要树种：</span>
              <span class="item-content">{{ data.qtsz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">林地使用期：</span>
              <span class="item-content">{{ data.ldsyq }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">终止日期：</span>
              <span class="item-content">{{ data.zzrq }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">东至：</span>
              <span class="item-content">{{ data.dz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">南至：</span>
              <span class="item-content">{{ data.nz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">西至：</span>
              <span class="item-content">{{ data.xz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">北至：</span>
              <span class="item-content">{{ data.bz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">树种构成：</span>
              <span class="item-content">{{ data.szgc }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">起源：</span>
              <span class="item-content">{{ data.qy }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">是否工程造林：</span>
              <span class="item-content">{{ data.gczl }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">公益林：</span>
              <span class="item-content">{{ data.gyl }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">地类：</span>
              <span class="item-content">{{ data.dl }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="itemview">
        <div class="div-title">证明信息</div>
        <div class="formitem">
              <el-col :span="12">
              <span class="item-title more">主要权力依据：</span>
              <span class="item-content">{{ data.zyqlyj }}</span>
            </el-col>
              <el-col :span="12">
              <span class="item-title more">林权共有权利人说明（注记）：</span>
              <span class="item-content">{{ data.lqgyqlrsm }}</span>
            </el-col>
              <el-col :span="12">
              <span class="item-title more">乡（政）府意见：</span>
              <span class="item-content">{{ data.xzfyj }}</span>
            </el-col>
              <el-col :span="12">
              <span class="item-title more">集体林地所有权权利人意见：</span>
              <span class="item-content">{{ data.jtldsyqqlryj }}</span>
            </el-col>
              <el-col :span="12">
              <span class="item-title more">林业主管部门意见：</span>
              <span class="item-content">{{ data.lyzgbmyj }}</span>
            </el-col>
              <el-col :span="12">
              <span class="item-title more">发证机关意见：</span>
              <span class="item-content">{{ data.fzjgyj }}</span>
            </el-col>
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
  width: 200px;
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
