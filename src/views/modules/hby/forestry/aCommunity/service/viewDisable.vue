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
              <span class="item-title">姓名：</span>
              <span class="item-content">{{ data.name }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">年龄：</span>
              <span class="item-content">{{ data.age }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">所属社区：</span>
              <span class="item-content">{{ data.community }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">楼栋：</span>
              <span class="item-content">{{ data.building }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">单位：</span>
              <span class="item-content">{{ data.unit }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">门牌号：</span>
              <span class="item-content">{{ data.number }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">状态：</span>
              <span class="item-content">{{data.status}}</span>
            </el-col>
            <el-col :span="24">
              <span class="item-title">描述：</span>
              <span class="item-content">{{data.desc}}</span>
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
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
