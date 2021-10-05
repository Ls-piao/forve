<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia adddia"
    title="审核"
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
          <div class="div-title">申请基本信息</div>
          <div class="formitem">
            <el-row>
              <el-col :span="8">
                <el-form-item label="权属" prop="qs">
                  <el-select
                    v-model="form.qs"
                    size="small"
                    placeholder="请选择权属"
                  >
                    <el-option
                      v-for="v in qsConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="填表日期" prop="tbrq">
                  <el-date-picker
                    size="small"
                    v-model="form.tbrq"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="单位个人" prop="danwei">
                  <el-input
                    size="small"
                    v-model="form.danwei"
                    placeholder="请输入单位个人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="登记权力" prop="djql">
                  <el-checkbox-group v-model="form.djql" size="small">
                    <el-checkbox
                      v-for="v in djqlConfig"
                      :key="v.value"
                      :label="v.value"
                      >{{ v.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人代表" prop="faren">
                  <el-input
                    size="small"
                    v-model="form.faren"
                    placeholder="请输入法人代表"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="通讯地址" prop="txdz">
                  <el-input
                    size="small"
                    v-model="form.txdz"
                    placeholder="请输入法人代表"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号" prop="idcard">
                  <el-input
                    size="small"
                    v-model="form.idcard"
                    maxlength="18"
                    placeholder="请输入身份证号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林地所有权权利人" prop="ldsyqr">
                  <el-input
                    size="small"
                    v-model="form.ldsyqr"
                    placeholder="请输入林地所有权权利人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林地使用权权利人" prop="shiyongquanren">
                  <el-input
                    size="small"
                    v-model="form.shiyongquanren"
                    placeholder="请输入林地使用权权利人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="森林或林木所有权权利人" prop="sllmsyqr">
                  <el-input
                    size="small"
                    v-model="form.sllmsyqr"
                    placeholder="请输入森林或林木所有权权利人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="森林或林木使用权权利人"
                  prop="slsyqr"
                >
                  <el-input
                    size="small"
                    v-model="form.slsyqr"
                    placeholder="请输入森林或林木使用权权利人"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="itemview addobject">
          <div class="div-title">林地基本信息</div>
          <div class="formitem">
            <el-row>
              <el-col :span="8">
                <el-form-item label="坐落" prop="zl">
                  <el-input
                    v-model="form.zl"
                    size="small"
                    placeholder="请输入坐落"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="小地名" prop="xdiming">
                  <el-input
                    v-model="form.xdiming"
                    size="small"
                    placeholder="请输入小地名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林班" prop="lb">
                  <el-input
                    v-model="form.lb"
                    size="small"
                    placeholder="请输入林班"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="面积" prop="mj">
                  <el-input
                    v-model="form.mj"
                    size="small"
                    placeholder="请输入面积"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="小班" prop="xb">
                  <el-input
                    v-model="form.xb"
                    size="small"
                    placeholder="请输入小班"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林种" prop="lz">
                  <el-select
                    v-model="form.lz"
                    size="small"
                    placeholder="请选择林种"
                  >
                    <el-option
                      v-for="v in lzConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="造林年度" prop="zlnd">
                  <el-date-picker
                    v-model="form.zlnd"
                    type="year"
                    size="small"
                    placeholder="选择年"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="株数" prop="zs">
                  <el-input
                    v-model="form.zs"
                    size="small"
                    placeholder="请输入株数"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主要树种" prop="zysz">
                  <el-select
                    v-model="form.zysz"
                    size="small"
                    placeholder="请选择树种"
                  >
                    <el-option
                      v-for="v in zyszConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="其他树种" prop="qtsz">
                  <el-input
                    v-model="form.qtsz"
                    size="small"
                    placeholder="请输入其他树种"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林地使用期" prop="ldsyq">
                  <el-date-picker
                    v-model="form.ldsyq"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="终止日期" prop="zzrq">
                  <el-date-picker
                    v-model="form.zzrq"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="东至" prop="dz">
                  <el-input
                    placeholder="请输入东至"
                    v-model="form.dz"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="南至" prop="nz">
                  <el-input
                    placeholder="请输入南至"
                    v-model="form.nz"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="西至" prop="dz">
                  <el-input
                    placeholder="请输入西至"
                    v-model="form.xz"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="北至" prop="dz">
                  <el-input
                    placeholder="请输入北至"
                    v-model="form.bz"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="树种构成" prop="szgc">
                  <el-select
                    v-model="form.szgc"
                    size="small"
                    placeholder="请选择树种"
                  >
                    <el-option
                      v-for="v in szgcConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="起源" prop="qy">
                  <el-select
                    v-model="form.qy"
                    size="small"
                    placeholder="请选择起源"
                  >
                    <el-option
                      v-for="v in qyConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否工程造林" prop="gczl">
                  <el-radio-group v-model="form.gczl" size="small">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公益林" prop="gyl">
                  <el-select
                    v-model="form.gyl"
                    size="small"
                    placeholder="请选择公益林"
                  >
                    <el-option
                      v-for="v in gylConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地类" prop="dl">
                  <el-select
                    v-model="form.dl"
                    size="small"
                    placeholder="请选择地类"
                  >
                    <el-option
                      v-for="v in dlConfig"
                      :key="v.value"
                      :label="v.label"
                      :value="v.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="itemview addobject">
          <div class="div-title">证明信息</div>
          <div class="formitem">
            <el-row>
              <el-col :span="8">
                <el-form-item label="主要权力依据" prop="zyqlyj">
                  <el-input
                    type="textarea"
                    placeholder="请输入主要权力依据"
                    v-model="form.zyqlyj"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林权共有权利人说明（注记）" prop="lqgyqlrsm">
                  <el-input
                    type="textarea"
                    placeholder="请输入林权共有权利人说明（注记）"
                    v-model="form.lqgyqlrsm"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="乡（政）府意见" prop="xzfyj">
                  <el-input
                    type="textarea"
                    placeholder="请输入乡（政）府意见"
                    v-model="form.xzfyj"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="集体林地所有权权利人意见" prop="jtldsyqqlryj">
                  <el-input
                    type="textarea"
                    placeholder="请输入集体林地所有权权利人意见"
                    v-model="form.jtldsyqqlryj"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="林业主管部门意见" prop="lyzgbmyj">
                  <el-input
                    type="textarea"
                    placeholder="请输入林业主管部门意见"
                    v-model="form.lyzgbmyj"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发证机关意见" prop="fzjgyj">
                  <el-input
                    type="textarea"
                    placeholder="请输入发证机关意见"
                    v-model="form.fzjgyj"
                    size="small"
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
        qs: '',
        createTime: new Date().getTime(),
        djql: [],
        dwgr: '',
        frdb: '',
        txdz: '',
        ldsyqqlr: '',
        ldsyqqlr2: '',
        idcard: '',
        slhlmsyqqlr: '',
        slhlmsyqqlr2: '',
        zl: '',
        xdm: '',
        lb: '',
        xb: '',
        mj: '',
        lz: '',
        zlnd: '',
        zs: '',
        zysz: '',
        qtsz: '',
        ldsyq: '',
        zzrq: '',
        dz: '',
        xz: '',
        bz: '',
        nz: '',
        szgc: '',
        qy: '',
        gczl: 1,
        gyl: '',
        dl: '',
        zyqlyj: '',
        lqgyqlrsm: '',
        xzfyj: '',
        jtldsyqqlryj: '',
        lyzgbmyj: '',
        fzjgyj: ''
      },
      form: {
        qs: '',
        tbrq: new Date().getTime(),
        djql: [],
        dwgr: '',
        frdb: '',
        txdz: '',
        ldsyqr: '',
        shiyongquanren: '',
        idcard: '',
        sllmsyqr: '',
        slsyqr: '',
        zl: '',
        xdm: '',
        lb: '',
        xb: '',
        mj: '',
        lz: '',
        zlnd: '',
        zs: '',
        zysz: '',
        qtsz: '',
        ldsyq: '',
        zzrq: '',
        dz: '',
        xz: '',
        bz: '',
        nz: '',
        szgc: '',
        qy: '',
        gczl: 1,
        gyl: '',
        dl: '',
        zyqlyj: '',
        lqgyqlrsm: '',
        xzfyj: '',
        jtldsyqqlryj: '',
        lyzgbmyj: '',
        fzjgyj: ''
      },
      qsConfig: [
        { label: '国有', value: 1 },
        { label: '私有', value: 2 },
        { label: '个人', value: 3 }
      ],
      djqlConfig: [
        { label: '林地所有权', value: 1 },
        { label: '森林或林木所有权', value: 2 },
        { label: '林地使用权', value: 3 },
        { label: '森林或林木使用权', value: 4 }
      ],
      lzConfig: [
        { label: '林种1', value: 1 },
        { label: '林种2', value: 2 },
        { label: '林种3', value: 3 }
      ],
      zyszConfig: [
        { label: '树种1', value: 1 },
        { label: '树种2', value: 2 },
        { label: '树种3', value: 3 },
        { label: '树种4', value: 4 }
      ],
      szgcConfig: [
        { label: '树种1', value: 1 },
        { label: '树种2', value: 2 },
        { label: '树种3', value: 3 },
        { label: '树种4', value: 4 }
      ],
      qyConfig: [
        { label: '起源1', value: 1 },
        { label: '起源2', value: 2 },
        { label: '起源3', value: 3 },
        { label: '起源4', value: 4 }
      ],
      gylConfig: [
        { label: '公益林1', value: 1 },
        { label: '公益林2', value: 2 },
        { label: '公益林3', value: 3 },
        { label: '公益林4', value: 4 }
      ],
      dlConfig: [
        { label: '地类1', value: 1 },
        { label: '地类2', value: 2 },
        { label: '地类3', value: 3 },
        { label: '地类4', value: 4 }
      ],
      rules: {
        idcard: [
          {
            pattern:
              /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            required: true,
            message: '身份证号不能为空',
            trigger: 'blur'
          }
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
      this.$refs['addobjformref'].validate((valid) => {
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
      this.$http({
        url: '/hby/lqgl/lqsp/save',
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
        url: '/hby/lqgl/lqsp/save',
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
</style>
