<template>
  <div class="container addobject">
    <div class="title">保护植物录入</div>
    <el-form
      ref="addobjformref"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="中文种名" prop="zwzm">
        <el-input
          v-model="form.zwzm"
          placeholder="请输入中文种名"
        ></el-input>
      </el-form-item>
      <el-form-item label="中文科名" prop="zwkm">
        <el-input
          v-model="form.zwkm"
          placeholder="请输入中文科名"
        ></el-input>
      </el-form-item>
      <el-form-item label="中文属名" prop="zwsm">
        <el-input
          v-model="form.zwsm"
          placeholder="请输入中文属名"
        ></el-input>
      </el-form-item>
      <el-form-item label="拉丁种名" prop="ldzm">
        <el-input
          v-model="form.ldzm"
          placeholder="请输入拉丁种名"
        ></el-input>
      </el-form-item>
      <el-form-item label="拉丁科名" prop="ldkm">
        <el-input
          v-model="form.ldkm"
          placeholder="请输入拉丁科名"
        ></el-input>
      </el-form-item>
      <el-form-item label="拉丁属名" prop="ldsm">
        <el-input
          v-model="form.ldsm"
          placeholder="请输入拉丁属名"
        ></el-input>
      </el-form-item>

      <el-form-item label="濒危程度" prop="bwcd">
        <el-select v-model="form.bwcd" placeholder="请选择濒危程度">
          <el-option
            v-for="v in dangerConfig"
            :key="v.value"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保护等级" prop="bhdj">
        <el-select v-model="form.bhdj" placeholder="请选择保护等级">
          <el-option
            v-for="v in protectConfig"
            :key="v.value"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分布地域" prop='fbdy'>
        <el-select v-model="form.fbdy" placeholder="请选择分布地域">
          <el-option
            v-for="v in fbdyConfig"
            :key="v.value"
            :label="v.label"
            :value="v.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="形态特征">
        <el-input
          type="textfbdy"
          v-model="form.xttz"
          placeholder="请输入形态特征"
        ></el-input>
      </el-form-item>
      <el-form-item label="群落特征">
        <el-input
          type="textfbdy"
          v-model="form.qltz"
          placeholder="请输入群落特征"
        ></el-input>
      </el-form-item>
      <el-form-item label="伴生种">
        <el-input
          v-model="form.bsz"
          placeholder="请输入伴生种"
        ></el-input>
      </el-form-item>
      <el-form-item label="保护价值">
        <el-select v-model="form.bhjz" placeholder="请选择保护价值">
          <el-option
            v-for="v in priceConfig"
            :key="v.value"
            :label="v.label"
            :value="v.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保护措施">
        <el-select v-model="form.bhcs" placeholder="请选择保护措施">
          <el-option
            v-for="v in proConfig"
            :key="v.value"
            :label="v.label"
            :value="v.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活本图" prop="huoben">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="upload1"
        >
          <img v-if="form.huoben" :src="form.huoben" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标本图" prop="biaoben">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="upload2"
        >
          <img v-if="form.biaoben" :src="form.bbt" class="avatar" />
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
export default {
  name: 'addObject',
  data () {
    return {
      defaultForm: {
        zwzm: '',
        zwkm: '',
        zwsm: '',
        ldzm: '',
        ldkm: '',
        ldsm: '',
        bwcd: '',
        bhdj: '',
        fbdy: '',
        xttz: '',
        qltz: '',
        bsz: '',
        bhjz: '',
        hbt: '',
        bbt: ''
      },
      form: {
        zwzm: '',
        zwkm: '',
        zwsm: '',
        ldzm: '',
        ldkm: '',
        ldsm: '',
        bwcd: '',
        bhdj: '',
        fbdy: '',
        xttz: '',
        qltz: '',
        bsz: '',
        bhjz: '',
        hbt: '',
        bbt: ''
      },
      rules: {
        zwzm: [
          { required: true, message: '中文种名不能为空', trigger: 'blur' }
        ],
        zwkm: [
          { required: true, message: '中文科名不能为空', trigger: 'blur' }
        ],
        zwsm: [
          { required: true, message: '中文属名不能为空', trigger: 'blur' }
        ],
        ldzm: [
          { required: true, message: '拉丁种名不能为空', trigger: 'blur' }
        ],
        ldkm: [
          { required: true, message: '拉丁科名不能为空', trigger: 'blur' }
        ],
        ldsm: [
          { required: true, message: '拉丁属名不能为空', trigger: 'blur' }
        ],
        bwcd: [
          { required: true, message: '濒危程度不能为空', trigger: 'blur' }
        ],
        bhdj: [
          { required: true, message: '保护等级不能为空', trigger: 'blur' }
        ],
        fbdy: [
          { required: true, message: '分布地域不能为空', trigger: 'blur' }
        ],
        hbt: [
          { required: true, message: '活本图不能为空', trigger: 'blur' }
        ],
        bbt: [
          { required: true, message: '标本图不能为空', trigger: 'blur' }
        ]

      },
      dangerConfig: [

      ],
      protectConfig: [

      ],
      fbdyConfig: [
        { label: '珲春局', value: 1 },
        { label: '天桥岭局', value: 2 },
        { label: '汪清局', value: 3 },
        { label: '大兴沟局', value: 4 },
        { label: '绥阳局', value: 5 },
        { label: '穆棱局', value: 6 }
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
      proConfig: [
        { label: '保护区', value: 1 },
        { label: '大自然', value: 2 }
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
    this.dangerConfig = this.$dictUtils.getDictList('ZRZY_STZK_BWCD')
    console.log(this.dangerConfig)
    this.protectConfig = this.$dictUtils.getDictList('ZRZY_STZK_BHDJ')
    if (this.$route.query.id) {
      this.type = 'edit'
      this.$http({
        url: '/hby/bwsj/queryById',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }).then(({data}) => {
        this.handleEdit(data.bwsj)
      })
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
        that.form.hbt = e.target.result
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
        that.form.bbt = e.target.result
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
          let params = this.form
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
      this.$http({
        url: '/hby/bwsj/save',
        method: 'post',
        data: params
      }).then(({data}) => {
        if (data.code === 200) {
          this.loading = false

          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    // 网络请求编辑保存
    async submitFormEdit (params) {
      this.loading = true
      this.$http({
        url: '/hby/bwsj/save',
        method: 'post',
        data: params
      }).then(({data}) => {
        if (data.code === 200) {
          this.loading = false
          this.$router.go(-1)
          this.$message.success('操作成功')
        }
      })
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
    border-color: #409EFF;
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
