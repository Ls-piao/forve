<template>
  <div class="container addobject">
    <div class="title">林业灾害录入</div>
    <el-form
      ref="addobjformref"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="林业局" prop="house">
        <el-select v-model="form.house" placeholder="请选择林业局">
          <el-option
            v-for="v in houseConfig"
            :key="v.value"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图斑编号" prop="picId">
        <el-input v-model="form.picId" placeholder="请输入图斑编号"></el-input>
      </el-form-item>
      <el-form-item label="灾害类型" prop="dangerType">
        <el-select v-model="form.dangerType" placeholder="请选择灾害类型">
          <el-option
            v-for="v in dangerConfig"
            :key="v.value"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-date-picker
          v-model="form.year"
          type="year"
          placeholder="请选择年度"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="月份" prop="month">
        <el-date-picker
          v-model="form.month"
          type="month"
          placeholder="请选择月份"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="监测面积" prop="MonitorArea">
        <el-input
          type="number"
          v-model="form.MonitorArea"
          placeholder="请输入监测面积"
        ></el-input>
      </el-form-item>
      <el-form-item label="受灾面积" prop="DisasterArea">
        <el-input
          type="number"
          v-model="form.DisasterArea"
          placeholder="请输入受灾面积"
        ></el-input>
      </el-form-item>
      <el-form-item label="发生轻度灾害" prop="light">
        <el-input
          type="number"
          v-model="form.light"
          placeholder="请输入发生轻度灾害"
        ></el-input>
      </el-form-item>
      <el-form-item label="发生中度灾害" prop="middle">
        <el-input
          type="number"
          v-model="form.middle"
          placeholder="请输入发生中度灾害"
        ></el-input>
      </el-form-item>
      <el-form-item label="发生重度灾害" prop="height">
        <el-input
          type="number"
          v-model="form.height"
          placeholder="请输入发生重度灾害"
        ></el-input>
      </el-form-item>
      <el-form-item label="四至坐标" prop="location">
        <el-input disabled v-model="form.associated"></el-input>
      </el-form-item>
      <el-form-item label="受灾远景样片">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="upload1"
        >
          <img v-if="form.huoben" :src="form.huoben" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="受灾近景样片">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="upload2"
        >
          <img v-if="form.biaoben" :src="form.biaoben" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span class="footer" slot="footer">
      <div>
        <el-button size="medium" @click="cancelForm">取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submitForm('addobjformref')"
          :loading="loading"
          >确 定</el-button
        >
      </div>
    </span>
  </div>
</template>
<script>
import tableData from './data.json'
export default {
  name: 'addObject',
  data () {
    return {
      defaultForm: {
        house: '',
        picId: '',
        dangerType: '',
        year: '',
        month: '',
        MonitorArea: '',
        DisasterArea: '',
        light: '',
        middle: '',
        height: '',
        location: '',
        prospect: '',
        close: ''
      },
      form: {
        house: '',
        picId: '',
        dangerType: '',
        year: '',
        month: '',
        MonitorArea: '',
        DisasterArea: '',
        light: '',
        middle: '',
        height: '',
        location: '',
        prospect: '',
        close: ''
      },
      rules: {
        house: [
          { required: true, message: '林业局不能为空', trigger: 'blur' }
        ],
        picId: [
          { required: true, message: '图斑编号不能为空', trigger: 'blur' }
        ],
        dangerType: [
          { required: true, message: '灾害类型不能为空', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '年度不能为空', trigger: 'blur' }
        ],
        month: [
          { required: true, message: '月份不能为空', trigger: 'blur' }
        ],
        MonitorArea: [
          { required: true, message: '监测面积不能为空', trigger: 'blur' }
        ],
        DisasterArea: [
          { required: true, message: '受灾面积不能为空', trigger: 'blur' }
        ],
        light: [
          { required: true, message: '发生轻度灾害不能为空', trigger: 'blur' }
        ],
        middle: [
          { required: true, message: '发生中度灾害不能为空', trigger: 'blur' }
        ],
        height: [
          { required: true, message: '发生重度灾害不能为空', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '四至坐标不能为空', trigger: 'blur' }
        ]

      },
      houseConfig: [
        { label: '林业局', value: 0 },
        { label: '大兴院业局', value: 1 },
        { label: '绥化院', value: 2 }
      ],
      protectConfig: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
        { label: '四级', value: 4 }
      ],
      dangerConfig: [
        { label: '森林火灾', value: 1 },
        { label: '病虫害', value: 2 },
        { label: '野生动物疫源疾病', value: 3 },
        { label: '有害植物入侵', value: 4 }
      ],
      priceConfig: [
        { label: '应用价值', value: 1 },
        { label: '观赏价值', value: 2 },
        { label: '学术价值', value: 3 },
        { label: '文化价值', value: 4 },
        { label: '绥阳局', value: 5 },
        { label: '药用价值', value: 6 },
        { label: '生态价值', value: 7 }
      ],
      type: '',
      loading: false
    }
  },
  computed: {
    edit () {
      if (this.$route.query.id) {
        return true
      }
      return false
    }
  },
  watch: {},
  async activated () {
    if (this.$route.query.id) {
      this.type = 'edit'
      let data =
        tableData[tableData.findIndex((v) => v.ID === this.$route.query.id)]
      this.handleEdit(data)
    } else {
      this.type = 'add'
      this.handleAdd()
    }
  },

  methods: {
    imagePreview (file) {
      var that = this
      // 定义一个文件阅读器
      var reader = new FileReader()
      // 文件装载后将其显示在图片预览里
      reader.onload = function (e) {
        // 将bade64位图片保存至数组里供上面图片显示
        that.form.huoben = e.target.result
      }
      reader.readAsDataURL(file)
    },
    imagePreview2 (file) {
      var that = this
      // 定义一个文件阅读器
      var reader = new FileReader()
      // 文件装载后将其显示在图片预览里
      reader.onload = function (e) {
        // 将bade64位图片保存至数组里供上面图片显示
        that.form.biaoben = e.target.result
      }
      reader.readAsDataURL(file)
    },
    upload1 (file) {
      this.imagePreview(file)
    },
    upload2 (file) {
      this.imagePreview2(file)
    },
    // 新增
    // 新增
    handleAdd () {
      this.form = Object.assign({}, this.defaultForm)
    },
    // 编辑
    handleEdit (e) {
      this.form = e
    },
    cancelForm () {
      this.$router.go(-1)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          this.type === 'add' && this.postSaveAddObj(params)
          this.type === 'edit' && this.submitFormEdit(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 网络请求保存新增
    async postSaveAddObj (params) {
      this.loading = true
      this.loading = false
      this.$router.go(-1)
      this.$message.success('操作成功')
      this.$parent.$refs.table.initData() // 刷新表格
    },
    // 网络请求编辑保存
    async submitFormEdit (params) {
      this.loading = true
      this.loading = false
      this.$router.go(-1)
      this.$message.success('操作成功')
      this.$parent.$refs.table.initData() // 刷新表格
    }
  }
}
</script>
<style lang="less">
.addobject {
  .el-form {
    .el-form-item__content {
      .el-select {
        display: block !important;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.container {
  background: #fff;
  margin: -10px;
  min-height: 100vh;
  padding: 16px;
  padding-bottom: 100px;
  .title {
    margin: 16px 0;
    font-size: 26px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  padding: 15px;
}

.el-form-item {
  width: 30%;
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
  position: fixed;
  left: 0;
  bottom: 0;
  height: 80px;
  background: #fff;
  width: 100%;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
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
