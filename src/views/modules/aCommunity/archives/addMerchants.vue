<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="商户"
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
          <div class="div-title">基本信息</div>
          <div class="formitem">
            <el-row>
              <el-col :span="8">
                <el-form-item label="店名" prop="name">
                  <el-input
                    size="small"
                    v-model="form.name"
                    placeholder="请输入店名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属社区" prop="commnuity">
                  <el-select
                    v-model="form.commnuity"
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
                <el-form-item label="门牌号" prop="number">
                  <el-input
                    size="small"
                    v-model="form.number"
                    placeholder="请输入门牌号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商户位置" prop="place">
                  <el-input
                    size="small"
                    v-model="form.place"
                    placeholder="请输入商户位置"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营业执照" prop="license">
                  <el-input
                    size="small"
                    v-model="form.license"
                    placeholder="请输入营业执照"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人姓名" prop="legalPerson">
                  <el-input
                    size="small"
                    v-model="form.legalPerson"
                    placeholder="请输入法人姓名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人身份" prop="legalPersonJob">
                  <el-input
                    size="small"
                    v-model="form.legalPersonJob"
                    placeholder="请输入法人身份"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人户籍" prop="legalPersonForm">
                  <el-input
                    size="small"
                    v-model="form.legalPersonForm"
                    placeholder="请输入法人户籍"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="房间性质" prop="shop_type">
                   <el-select
                    v-model="form.shop_type"
                    size="small"
                    placeholder="请选择房间性质"
                  >
                    <el-option
                      v-for="v in typeConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="8">
                <el-form-item label="从事行业" prop="industry">
                  <el-input
                    size="small"
                    v-model="form.industry"
                    placeholder="请输入从事行业"
                  ></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="8">
                <el-form-item label="面积" prop="area">
                  <el-input
                    size="small"
                    v-model="form.area"
                    placeholder="请输入面积"
                  ></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="24">
                <el-form-item label="备注" prop="desc">
                  <el-input
                    size="small"
                    v-model="form.desc"
                    type="textarea"
                    placeholder="请输入备注"
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
  data () {
    return {
      defaultForm: {
        name: '',
        commnuity: '',
        number: '',
        place: '',
        license: '',
        legalPerson: '',
        legalPersonJob: '',
        legalPersonForm: '',
        type: '',
        industry: '',
        area: '',
        desc: ''
      },
      form: {
        name: '',
        commnuity: '',
        number: '',
        place: '',
        license: '',
        legalPerson: '',
        legalPersonJob: '',
        legalPersonForm: '',
        type: '',
        industry: '',
        area: '',
        desc: ''

      },
      commnuityConfig: [
        { label: '社区1', value: 1 },
        { label: '社区2', value: 2 },
        { label: '社区3', value: 3 }
      ],
      typeConfig: [
        { label: '类型1', value: 1 },
        { label: '类型2', value: 2 },
        { label: '类型3', value: 3 }

      ],

      rules: {
        commnuity: [
          { required: true, message: '所属社区不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '店名不能为空', trigger: 'blur' }],
        place: [{ required: true, message: '商户位置不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '门牌号不能为空', trigger: 'blur' }],
        license: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
        legalPersonJob: [{ required: true, message: '法人身份不能为空', trigger: 'blur' }],
        legalPersonForm: [{ required: true, message: '法人户籍不能为空', trigger: 'blur' }],
        // legalPerson: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '房间性质不能为空', trigger: 'blur' }],
        industry: [{ required: true, message: '从事行业不能为空', trigger: 'blur' }],
        area: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      },
      type: '',
      visible: false,
      loading: false
    }
  },
  computed: {},
  watch: {},

  methods: {
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
    // 删除缓存词典
    remove (k, data) {
      if (data === 'szsw') {
        this.historySzsw.splice(k, 1)
      } else if (data === 'jtcy') {
        this.historyJtcy.splice(k, 1)
      }
      let form = {
        szsw: this.historySzsw,
        jtcy: this.historyJtcy
      }
      localStorage.setItem('form', JSON.stringify(form))
    },
    deepc (obj) {
      return JSON.parse(JSON.stringify(obj))
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
</style>
