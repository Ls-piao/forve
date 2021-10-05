<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="水文调查"
  >
    <div style="padding-bottom: 100px">
      <el-form
        ref="addobjformref"
        :inline="true"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <div class="itemview addobject">
          <div class="formitem">
            <el-row>
              <el-col :span="8">
                <el-form-item label="标识码" prop="biaoshima">
                  <el-input
                    v-model="form.biaoshima"
                    size="small"
                    placeholder="请输入标识码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="要素代码" prop="yaosudaima">
                  <el-input
                    v-model="form.yaosudaima"
                    size="small"
                    placeholder="请输入要素代码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地区名称" prop="diqumingcheng">
                  <el-input
                    v-model="form.diqumingcheng"
                    size="small"
                    placeholder="请输入地区名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="区域编码" prop="quyubianma">
                  <el-input
                    v-model="form.quyubianma"
                    size="small"
                    placeholder="请输入区域编码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="湿地斑块编码" prop="shidibankuai">
                  <el-input
                    v-model="form.shidibankuai"
                    size="small"
                    placeholder="请输入湿地斑块编码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="水源补给状况" prop="shuiyuan">
                  <el-input
                    v-model="form.shuiyuan"
                    size="small"
                    placeholder="请输入水源补给状况"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="水源补给方式" prop="shuiyuanbuji">
                  <el-input
                    v-model="form.shuiyuanbuji"
                    size="small"
                    placeholder="请输入水源补给方式"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="平均水深" prop="pjshuishen">
                  <el-input
                    v-model="form.pjshuishen"
                    size="small"
                    placeholder="请输入平均水深"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="入流流量" prop="ruliuliang">
                  <el-input
                    v-model="form.ruliuliang"
                    size="small"
                    placeholder="请输入入流流量"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="样点号" prop="yangdianhao">
                  <el-input
                    v-model="form.yangdianhao"
                    size="small"
                    placeholder="请输入样点号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="氨氮(mg/L)" prop="andanliang">
                  <el-input
                    v-model="form.andanliang"
                    size="small"
                    placeholder="请输入氨氮(mg/L)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="总磷" prop="zonglin">
                  <el-input
                    v-model="form.zonglin"
                    size="small"
                    placeholder="请输入总磷"
                  ></el-input>
                </el-form-item>
              </el-col>
           
              <el-col :span="8">
                <el-form-item label="纬度" prop="weidu">
                  <el-input
                    v-model="form.weidu"
                    size="small"
                    placeholder="请输入纬度"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="经度" prop="jingdu">
                  <el-input
                    v-model="form.jingdu"
                    size="small"
                    placeholder="请输入经度"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="化学需氧量(mg/L)" prop="huaxueliang">
                  <el-input
                    v-model="form.huaxueliang"
                    size="small"
                    placeholder="请输入化学需氧量(mg/L)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="总氮（mg/kg）" prop="zongdan">
                  <el-input
                    v-model="form.zongdan"
                    size="small"
                    placeholder="请输入总氮（mg/kg）"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="PH" prop="phzhi">
                  <el-input
                    v-model="form.phzhi"
                    size="small"
                    placeholder="请输入PH"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="溶解氧(mg/L)" prop="rongjie">
                  <el-input
                    v-model="form.rongjie"
                    size="small"
                    placeholder="请输入溶解氧(mg/L)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="矿化度" prop="kuanghuadu">
                  <el-input
                    v-model="form.kuanghuadu"
                    size="small"
                    placeholder="请输入矿化度"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="五日生化需氧量(mg/L)" prop="wurishenghua">
                  <el-input
                    v-model="form.wurishenghua"
                    size="small"
                    placeholder="请输入五日生化需氧量(mg/L)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="调查人" prop="dcname">
                  <el-input
                    v-model="form.dcname"
                    size="small"
                    placeholder="请输入调查人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="调查时间" prop="dcdate">
                  <el-input
                    v-model="form.dcdate"
                    size="small"
                    placeholder="请输入调查时间"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <span class="footer" slot="footer">
        <div>
          <el-button size="small" @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitForm"
            :loading="loading"
            >确 定</el-button
          >
        </div>
      </span>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'addObject',
  data () {
    return {
      defaultForm: {
        biaoshima: '',
        yaosudaima: '',
        diqumingcheng: '',
        quyubianma: '',
        shidibankuai: '',
        shuiyuan: '',
        shuiyuanbuji: '',
        pjshuishen: '',
        ruliuliang: '',
        yangdianhao: '',
        AD: '',
        ZL: '',
        WD: '',
        JD: '',
        huaxueliang: '',
        ZD: '',
        PH: '',
        rongjie: '',
        KHD: '',
        WRSHXYL: '',
        DCR: '',
        DCSJ: ''
      },
      form: {
        biaoshima: '',
        yaosudaima: '',
        diqumingcheng: '',
        quyubianma: '',
        shidibankuai: '',
        shuiyuan: '',
        shuiyuanbuji: '',
        pjshuishen: '',
        ruliuliang: '',
        yangdianhao: '',
        andanliang: '',
        zonglin: '',
        weidu: '',
        jingdu: '',
        huaxueliang: '',
        zongdan: '',
        phzhi: '',
        rongjie: '',
        kuanghuadu: '',
        wurishenghua: '',
        dcname: '',
        dcdate: ''
      },
      commnuityConfig: [
        { label: '社区1', value: 1 },
        { label: '社区2', value: 2 },
        { label: '社区3', value: 3 }
      ],
      rules: {
        biaoshima: [{ required: true, message: '标识码不能为空', trigger: 'blur' }],
        yaosudaima: [
          { required: true, message: '要素代码不能为空', trigger: 'blur' }
        ],
        diqumingcheng: [
          { required: true, message: '地区名称不能为空', trigger: 'blur' }
        ],
        quyubianma: [
          { required: true, message: '区域编码不能为空', trigger: 'blur' }
        ],
        shidibankuai: [
          { required: true, message: '湿地斑块编码不能为空', trigger: 'blur' }
        ]
      },
      type: '',
      visible: false,
      loading: false
    }
  },
  computed: {},
  watch: {},

  methods: {
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    changeContent (v) {
      this.form.content = v
    },
    imagePreview (file) {
      var that = this
      // 定义一个文件阅读器
      var reader = new FileReader()
      // 文件装载后将其显示在图片预览里
      reader.onload = function (e) {
        // 将bade64位图片保存至数组里供上面图片显示
        that.form.avatar = e.target.result
      }
      reader.readAsDataURL(file)
    },
    upload (file) {
      this.imagePreview(file)
    },

    async init (type, v) {
      this.visible = true
      this.type = type

      if (type === 'add') {
        this.handleAdd()
      } else {
        this.handleEdit(v)
      }
    },
    // 新增
    handleAdd () {
      this.form = Object.assign({}, this.defaultForm)
      this.type = 'add'
    },
    // 编辑
    handleEdit (e) {
      this.form = e
    },
    cancelForm () {
      this.visible = false
    },
    submitForm () {
      // 区分新增与修改
      this.$refs['addobjformref'].validate(valid => {
        if (valid) {
          let params = this.form
          if (this.type === 'add') {
            this.postSaveAddObj(params)
          } else {
            this.submitFormEdit(params)
          }
        } else {
          return false
        }
      })
    },
    // 网络请求保存新增监督对象
    async postSaveAddObj (params) {
      this.loading = true
      this.$http({
        url: '/hby/shuiwendc/shuiwen/save',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false
          this.visible = false
          this.$message.success('操作成功')
          this.$parent.$refs.table.initData() // 刷新表格
        }
      })
    },
    // 网络请求编辑保存
    async submitFormEdit (params) {
      this.loading = true
      this.$http({
        url: '/hby/shuiwendc/shuiwen/save',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false
          this.visible = false
          this.$message.success('操作成功')
          this.$parent.$refs.table.initData() // 刷新表格
        }
      })
    }
  }
}
</script>
<style lang="less">
.itemview {
  .el-form-item {
    display: flex !important;
    align-items: center;
    .el-form-item__label {
      line-height: 1 !important;
    }
    .el-form-item__content,
    .el-form-item__content {
      .el-select,
      .el-date-editor {
        // display: block !important;
        width: 100% !important;
      }
    }
  }
}
</style>
<style lang="less" scoped>
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
  padding: 15px;
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

.addbtn {
  height: 38px;
  line-height: 38px;
  text-align: center;
  border: #007cff 1px dotted;
  color: #007cff;
  cursor: pointer;
  width: calc(100% - 102px);
  margin-left: 80px;
  border-radius: 4px;
}

.del {
  margin-top: 5px;
}

.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;

  /deep/.el-dialog {
    left: 0 !important;
    width: 80% !important;
    margin: 0 auto !important;
    height: 80% !important;
    top: unset !important;
    overflow: hidden;

    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 54px;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
    }

    .el-dialog__footer {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      height: 54px;
      line-height: 54px;
      overflow: hidden;
      overflow-y: auto;
      background: white;
      text-align: center;
    }
  }
}
     .footer {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 80px;
  background: #fff;
  width: 100%; 
  padding-right:40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
