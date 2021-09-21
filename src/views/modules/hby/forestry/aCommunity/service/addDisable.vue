<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="活动"
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
                <el-form-item label="姓名" prop="name">
                  <el-input
                    size="small"
                    v-model="form.name"
                    placeholder="请输入姓名"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="年龄" prop="age">
                  <el-input
                    size="small"
                    type="number"
                    v-model="form.age"
                    placeholder="请输入年龄"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="所属社区" prop="community">
                  <el-select
                    v-model="form.community"
                    size="small"
                    placeholder="请选择所属社区"
                  >
                    <el-option
                      v-for="v in commnuityConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="楼栋" prop="building">
                  <el-select
                    v-model="form.building"
                    size="small"
                    placeholder="请选择楼栋"
                  >
                    <el-option
                      v-for="v in buildingConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单位" prop="unit">
                  <el-select
                    v-model="form.unit"
                    size="small"
                    placeholder="请选择单位"
                  >
                    <el-option
                      v-for="v in unitConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="门牌号" prop="number">
                  <el-input
                    size="small"
                    v-model="form.number"
                    placeholder="请输入门牌号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status" size="mini">
                    <el-radio-button size="mini" :label="0"
                      >健康</el-radio-button
                    >
                    <el-radio-button size="mini" :label="1"
                      >不健康</el-radio-button
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="描述" prop="desc">
                  <el-input
                    v-model="form.desc"
                    placeholder="请输入描述"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <span class="footer" slot="footer">
        <div>
          <el-button size="medium" @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            size="medium"
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
  components: {},
  data () {
    return {
      defaultForm: {
        name: '',
        age: '',
        community: '',
        building: '',
        unit: '',
        number: '',
        status: '',
        desc: ''
      },
      form: {
        name: '',
        age: '',
        community: '',
        building: '',
        unit: '',
        number: '',
        status: '',
        desc: ''
      },
      typeConfig: [
        { label: '类型1', value: 1 },
        { label: '类型2', value: 2 },
        { label: '类型3', value: 3 }
      ],
      commnuityConfig: [
        { label: '社区1', value: 1 },
        { label: '社区2', value: 2 },
        { label: '社区3', value: 3 }
      ],
      buildingConfig: [
        { label: '1栋', value: 1 },
        { label: '2栋', value: 2 },
        { label: '3栋', value: 3 }
      ],
      unitConfig: [
        { label: '一单元', value: 1 },
        { label: '二单元', value: 2 },
        { label: '三单元', value: 3 }
      ],
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        building: [{ required: true, message: '楼栋不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '门牌号不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        community: [
          { required: true, message: '所属社区不能为空', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单元能为空', trigger: 'blur' }
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
    submitForm (params) {
      // 区分新增与修改
      this.$refs['addobjformref'].validate((valid) => {
        if (valid) {
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
      this.loading = false
      this.visible = false
      this.$message.success('操作成功')
      // this.$parent.$refs.table.handleFetch(); // 刷新表格
    },
    // 网络请求编辑保存
    async submitFormEdit (params) {
      this.loading = true
      this.loading = false
      this.visible = false
      this.$message.success('操作成功')
      // this.$parent.$refs.table.handleFetch(); // 刷新表格
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
