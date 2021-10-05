

<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="资源勘测区"
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
                <el-form-item label="分区编号" prop="fenquhao">
                  <el-input
                    v-model="form.fenquhao"
                    size="small"
                    placeholder="请输入分区编号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分区名称" prop="fenquming">
                  <el-input
                    v-model="form.fenquming"
                    size="small"
                    placeholder="请输入分区名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在行政区" prop="suozaixingzhengqu">
                  <el-input
                    v-model="form.suozaixingzhengqu"
                    size="small"
                    placeholder="请输入所在行政区"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分区面积" prop="fenqumj">
                  <el-input
                    v-model="form.fenqumj"
                    size="small"
                    placeholder="请输入分区面积"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="拐点坐标" prop="guaidianzuobiao">
                  <el-input
                    v-model="form.guaidianzuobiao"
                    size="small"
                    placeholder="请输入拐点坐标"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主要矿产代码" prop="zhuyaokuangchan">
                  <el-input
                    v-model="form.zhuyaokuangchan"
                    size="small"
                    placeholder="请输入主要矿产代码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主要矿产名称" prop="zhuyaokcmingcheng">
                  <el-input
                    v-model="form.zhuyaokcmingcheng"
                    size="small"
                    placeholder="请输入主要矿产名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="已设探矿权总数" prop="yitoukqzongshu">
                  <el-input
                    v-model="form.yitoukqzongshu"
                    size="small"
                    placeholder="请输入已设探矿权总数"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="拟设探矿权总数" prop="nitoukuangquanzongshu">
                  <el-input
                    v-model="form.nitoukuangquanzongshu"
                    size="small"
                    placeholder="请输入拟设探矿权总数"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remarks">
                  <el-input
                    v-model="form.remarks"
                    type="textarea"
                    size="small"
                    placeholder="请输入备注"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规划期" prop="guihuaqi">
                  <el-date-picker
                    v-model="form.guihuaqi"
                    type="date"
                    placeholder="选择规划期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规划编制级别" prop="guaihualevel">
                  <el-input
                    v-model="form.guaihualevel"
                    size="small"
                    placeholder="请输入规划编制级别"
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
        fenquhao: '',
        fenquming: '',
        suozaixingzhengqu: '',
        fenqumj: '',
        guaidianzuobiao: '',
        zhuyaokuangchan: '',
        zhuyaokcmingcheng: '',
        yitoukqzongshu: '',
        nitoukuangquanzongshu: '',
        YSCKQZS: '',
        YSKCGM: '',
        remarks: '',
        guihuaqi: '',
        guaihualevel: ''
      },
      form: {
        biaoshima: '',
        yaosudaima: '',
        fenquhao: '',
        fenquming: '',
        suozaixingzhengqu: '',
        fenqumj: '',
        guaidianzuobiao: '',
        zhuyaokuangchan: '',
        zhuyaokcmingcheng: '',
        yitoukqzongshu: '',
        nitoukuangquanzongshu: '',
        YSCKQZS: '',
        YSKCGM: '',
        remarks: '',
        guihuaqi: '',
        guaihualevel: ''
      },
      commnuityConfig: [
        { label: '社区1', value: 1 },
        { label: '社区2', value: 2 },
        { label: '社区3', value: 3 }
      ],
      rules: {
        biaoshima: [
          { required: true, message: '标识码不能为空', trigger: 'blur' }
        ],
        yaosudaima: [
          { required: true, message: '要素代码不能为空', trigger: 'blur' }
        ],
        fenquhao: [
          { required: true, message: '分区编号不能为空', trigger: 'blur' }
        ],
        fenquming: [{ required: true, message: '分区名称不能为空', trigger: 'blur' }],
        suozaixingzhengqu: [
          { required: true, message: '分区面积不能为空', trigger: 'blur' }
        ],
        guaidianzuobiao: [
          { required: true, message: '拐点坐标不能为空', trigger: 'blur' }
        ],
        zhuyaokuangchan: [
          { required: true, message: '主要矿产代码不能为空', trigger: 'blur' }
        ],
        zhuyaokcmingcheng: [
          { required: true, message: '主要矿产名称不能为空', trigger: 'blur' }
        ],
        yitoukqzongshu: [
          { required: true, message: '已设探矿权总数不能为空', trigger: 'blur' }
        ],
        nitoukuangquanzongshu: [
          { required: true, message: '拟设探矿权总数不能为空', trigger: 'blur' }
        ],

        guihuaqi: [
          { required: true, message: '规划期不能为空', trigger: 'blur' }
        ],
        guaihualevel: [
          { required: true, message: '规划编制级别不能为空', trigger: 'blur' }
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
        url: '/hby/ziyuankanchaqu/zykanchaqu/save',
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
        url: '/hby/ziyuankanchaqu/zykanchaqu/save',
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