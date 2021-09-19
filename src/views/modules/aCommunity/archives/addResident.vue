<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="居民"
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
                <el-form-item label="所属小区" prop="xiaoqu">
                  <el-select
                    v-model="form.xiaoqu"
                    size="small"
                    placeholder="请选择所属小区"
                  >
                    <el-option
                      v-for="v in xiaoquConfig"
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
                <el-form-item label="单元" prop="unit">
                  <el-select
                    v-model="form.unit"
                    size="small"
                    placeholder="请选择单元"
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
                <el-form-item label="房间" prop="number">
                  <el-select
                    v-model="form.number"
                    size="small"
                    placeholder="请选择房间"
                  >
                    <el-option
                      v-for="v in numberConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
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
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="form.sex" size="mini">
                    <el-radio-button size="mini" :label="0">女</el-radio-button>
                    <el-radio-button size="mini" :label="1">男</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号码" prop="idCard">
                  <el-input
                    size="small"
                    v-model="form.name"
                    placeholder="请输入身份证号码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="照片" prop="avatar">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :before-upload="upload"
                  >
                    <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="成员关系" prop="relation">
                  <el-input
                    placeholder="请输入成员关系"
                    v-model="form.relation"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电话" prop="phone">
                  <el-input
                    placeholder="请输入电话"
                    type="number"
                    v-model="form.phone"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工作单位" prop="work">
                  <el-input
                    placeholder="请输入工作单位"
                    type="number"
                    v-model="form.work"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="是否信教" prop="isReligious">
                  <el-radio-group v-model="form.isReligious" size="mini">
                    <el-radio-button size="mini" :label="0">是</el-radio-button>
                    <el-radio-button size="mini" :label="1">否</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否低保户" prop="isLow">
                  <el-radio-group v-model="form.isLow" size="mini">
                    <el-radio-button size="mini" :label="0">是</el-radio-button>
                    <el-radio-button size="mini" :label="1">否</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出生日期" prop="born">
                  <el-date-picker
                    v-model="form.born"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="民族" prop="mz">
                  <el-input
                    v-model="form.mz"
                    size="small"
                    placeholder="请输入民族"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="就业情况" prop="jyqk">
                  <el-select
                    v-model="form.jyqk"
                    size="small"
                    placeholder="请选择就业情况"
                  >
                    <el-option
                      v-for="v in jyqkrConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="文化程度" prop="whcd">
                  <el-select
                    v-model="form.whcd"
                    size="small"
                    placeholder="请选择文化程度"
                  >
                    <el-option
                      v-for="v in whcdrConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="健康状况" prop="health">
                  <el-radio-group v-model="form.health" size="mini">
                    <el-radio-button size="mini" :label="0">是</el-radio-button>
                    <el-radio-button size="mini" :label="1">否</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否流动人员" prop="isFloat">
                  <el-radio-group v-model="form.isFloat" size="mini">
                    <el-radio-button size="mini" :label="0">是</el-radio-button>
                    <el-radio-button size="mini" :label="1">否</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="节孕措施" prop="jycs">
                  <el-radio-group v-model="form.jycs" size="mini">
                    <el-radio-button size="mini" :label="0"
                      >结婚</el-radio-button
                    >
                    <el-radio-button size="mini" :label="1"
                      >结扎</el-radio-button
                    >
                    <el-radio-button size="mini" :label="2"
                      >上环</el-radio-button
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="户籍地址" prop="hj">
                  <el-input
                    v-model="form.hj"
                    size="small"
                    placeholder="请输入户籍地址"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政治面貌" prop="zzmm">
                  <el-select
                    v-model="form.zzmm"
                    size="small"
                    placeholder="请选择政治面貌"
                  >
                    <el-option
                      v-for="v in zzmmConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="婚姻状况" prop="hyzk">
                  <el-radio-group v-model="form.hyzk" size="mini">
                    <el-radio-button size="mini" :label="0"
                      >未婚</el-radio-button
                    >
                    <el-radio-button size="mini" :label="1"
                      >已婚</el-radio-button
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残疾类别" prop="cjlb">
                  <el-select
                    v-model="form.cjlb"
                    size="small"
                    placeholder="请选择残疾类别"
                  >
                    <el-option
                      v-for="v in cjlbConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="desc">
                  <el-input
                    v-model="form.desc"
                    size="small"
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
        id: '',
        community: '',
        xiaoqu: '',
        building: '',
        unit: '',
        number: '',
        name: '',
        sex: '',
        isHost: '',
        relation: '',
        phone: '',
        work: '',
        isReligious: '',
        isLow: '',
        idCard: '',
        born: '',
        mz: '',
        isFloat: '',
        jyqk: '',
        whcd: '',
        health: '',
        jycs: '',
        avatar: '',
        hj: '',
        zzmm: '',
        hyzk: '',
        cjlb: '',
        desc: ''
      },
      form: {
        id: '',
        community: '',
        xiaoqu: '',
        building: '',
        unit: '',
        number: '',
        name: '',
        sex: '',
        isHost: '',
        relation: '',
        phone: '',
        work: '',
        isReligious: '',
        isLow: '',
        idCard: '',
        born: '',
        mz: '',
        isFloat: '',
        jyqk: '',
        whcd: '',
        health: '',
        jycs: '',
        avatar: '',
        hj: '',
        zzmm: '',
        hyzk: '',
        cjlb: '',
        desc: ''
      },
      commnuityConfig: [
        { label: '社区1', value: 1 },
        { label: '社区2', value: 2 },
        { label: '社区3', value: 3 }
      ],
      xiaoquConfig: [
        { label: '小区1', value: 1 },
        { label: '小区2', value: 2 },
        { label: '小区3', value: 3 }
      ],
      buildingConfig: [
        { label: '一栋', value: 1 },
        { label: '二栋', value: 2 },
        { label: '三栋', value: 3 }
      ],
      numberConfig: [
        { label: '1-1', value: 1 },
        { label: '1-2', value: 2 },
        { label: '2-1', value: 3 },
        { label: '2-2', value: 4 }
      ],
      unitConfig: [
        { label: '一单元', value: 1 },
        { label: '二单元', value: 2 },
        { label: '三单元', value: 3 }
      ],
      houseTypeConfig: [
        { label: '自有房屋', value: 1 },
        { label: '出租房屋', value: 2 },
        { label: '公租房屋', value: 3 },
        { label: '廉租房屋', value: 4 },
        { label: '其他房屋', value: 5 }
      ],
      pointConfig: [
        { label: '无分类', value: 1 },
        { label: '刑满释放人员', value: 2 },
        { label: '吸毒人员', value: 3 },
        { label: '社区矫正人员', value: 4 },
        { label: '精神病患者', value: 5 },
        { label: '其他人员', value: 6 }
      ],
      jyqkrConfig: [
        { label: '白领', value: 1 },
        { label: '蓝领', value: 2 },
        { label: '公务人员', value: 3 },
        { label: '其他', value: 4 }
      ],
      whcdrConfig: [
        { label: '小学', value: 1 },
        { label: '初中', value: 2 },
        { label: '高中', value: 3 },
        { label: '本科', value: 4 },
        { label: '专科', value: 5 },
        { label: '研究生', value: 6 },
        { label: '博士生', value: 7 },
        { label: '其他', value: 8 }
      ],
      zzmmConfig: [
        { label: '群众', value: 1 },
        { label: '团员', value: 2 },
        { label: '党员', value: 3 },
        { label: '其他党派成员', value: 4 },
        { label: '其他', value: 5 }
      ],
      cjlbConfig: [
        { label: '一般残疾', value: 1 },
        { label: '严重残疾', value: 2 },
        { label: '超级残疾', value: 3 }
      ],

      rules: {
        commnuity: [
          { required: true, message: '所属社区不能为空', trigger: 'blur' }
        ],
        xiaoqu: [
          { required: true, message: '所属小区不能为空', trigger: 'blur' }
        ],
        building: [
          { required: true, message: '楼栋不能为空', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '单元号不能为空', trigger: 'blur' }],
        isReligious: [{ required: true, message: '是否信教不能为空', trigger: 'blur' }],
        isLow: [{ required: true, message: '是否低保户不能为空', trigger: 'blur' }],
        idCard: [{ pattern:
              /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          required: true,
          message: '身份证号不能为空',
          trigger: 'blur' }],
        born: [{ required: true, message: '出生日期不能为空', trigger: 'blur' }],
        mz: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
        whcd: [{ required: true, message: '文化程度不能为空', trigger: 'blur' }],
        health: [{ required: true, message: '健康情况不能为空', trigger: 'blur' }],
        jycs: [{ required: true, message: '节孕措施不能为空', trigger: 'blur' }],
        hj: [{ required: true, message: '户籍地址不能为空', trigger: 'blur' }],
        zzmm: [{ required: true, message: '政治面貌不能为空', trigger: 'blur' }],
        cjlb: [{ required: true, message: '残疾类别不能为空', trigger: 'blur' }],
        // desc: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        // avatar: [{ required: true, message: "照片不能为空", trigger: "blur" }],
        number: [{ required: true, message: '房屋号不能为空', trigger: 'blur' }],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        isHost: [
          { required: true, message: '是否户主不能为空', trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '成员关系不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' }
        ],
        work: [
          { required: true, message: '工作单位不能为空', trigger: 'blur' }
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
