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
              <span class="item-title">房屋编号：</span>
              <span class="item-content">{{ data.id }}</span>
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
              <span class="item-title">姓名：</span>
              <span class="item-content">{{ data.name }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">性别：</span>
              <span class="item-content">{{ data.sax }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">成员关系：</span>
              <span class="item-content">{{ data.cygx }}</span>
            </el-col>
            <el-col :span="24">
              <span class="item-title">照片：</span>
              <span class="item-content">
                <img :src="data.pic" class="avatar" alt="">
              </span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">电话：</span>
              <span class="item-content">{{ data.phone }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">工作单位：</span>
              <span class="item-content">{{ data.gzdw }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">是否信教：</span>
              <span class="item-content">{{ data.isxj }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">是否低保户：</span>
              <span class="item-content">{{ data.isdbh }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">身份证号码：</span>
              <span class="item-content">{{ data.idCard }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">出生日期：</span>
              <span class="item-content">{{ data.cardid }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">民族：</span>
              <span class="item-content">{{ data.datecs }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">是否流动人员：</span>
              <span class="item-content">{{ data.isld }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">就业情况：</span>
              <span class="item-content">{{ data.jyqk }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">文化程度：</span>
              <span class="item-content">{{ data.whcd }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">健康状况：</span>
              <span class="item-content">{{ data.jkzk }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">节孕措施：</span>
              <span class="item-content">{{ data.jycs }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">户籍地址：</span>
              <span class="item-content">{{ data.hjdz }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">政治面貌：</span>
              <span class="item-content">{{ data.zzmm }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">婚姻状况：</span>
              <span class="item-content">{{ data.hyzk }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">残疾类别：</span>
              <span class="item-content">{{ data.cjlb }}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">备注：</span>
              <span class="item-content">{{ data.desc }}</span>
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
.avatar{
  width: 178px;
  height: 178px;
  object-fit: contain;
}
</style>
