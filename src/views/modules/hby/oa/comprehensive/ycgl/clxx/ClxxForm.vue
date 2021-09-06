<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    width="55%"
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
          <el-form-item label="车牌号" prop="cph"
                :rules="[
                  {required: true, message:'车牌号不能为空', trigger:'blur'},
                  {pattern:/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/, message: '常规格式：晋B12345'}
                ]">
            <el-input v-model="inputForm.cph" placeholder="请填写车牌号" @change="checkCph($event)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆分类" prop="clfl"
                        :rules="[
                  {required: true, message:'车辆分类不能为空', trigger:'blur'}
                 ]">
            <el-select v-model="inputForm.clfl" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in clflList"
                :key="item.id"
                :label="item.flmc"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="cllx" :rules="[{required: true, message:'车辆类型不能为空', trigger:'blur'} ]">
            <el-select v-model="inputForm.cllx" style="width: 100%;">
              <el-option v-for="item in $dictUtils.getDictList('CLLX')" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="pp" :rules="[{required: true, message:'品牌不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.pp" placeholder="请填写品牌"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="xh"
                        :rules="[
                  {required: true, message:'型号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.xh" placeholder="请填写型号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="座位数" prop="zws"
                        :rules="[
                  {required: true, message:'座位数不能为空'},
                 ]">
            <el-input v-model.number="inputForm.zws" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请填写座位数" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="燃油标号" prop="rybh"
                        :rules="[
                  {required: true, message:'燃油标号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.rybh" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请填写燃油标号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发动机号" prop="fdjh"
                        :rules="[
                  {required: true, message:'发动机号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.fdjh" placeholder="请填写发动机号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购车日期" prop="gcrq"
                        :rules="[
                  {required: true, message:'购车日期不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              style="width: 100%;"
              v-model="inputForm.gcrq"
              type="datetime"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆状态" prop="clzt" :rules="[ {required: true, message:'车辆状态不能为空', trigger:'blur'} ]">
            <el-select v-model="inputForm.clzt" style="width: 100%;">
              <el-option v-for="item in $dictUtils.getDictList('CLZT')" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购车价格（元）" prop="gcjg"
                        :rules="[
                  {required: true, message:'购车价格不能为空', trigger:'blur'},
                 ]">
            <el-input v-model="inputForm.gcjg"  placeholder="请输入购车价格（元）"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平均油费" prop="pjyf"
                        :rules="[
                    { required: true, type: 'string', trigger: 'blur', message:'平均油费不能为空'},
                   { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
                 ]">
            <el-input v-model="inputForm.pjyf" placeholder="请输入平均油费（元/百公里）"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平均油耗" prop="pjyh"
                        :rules="[
                   { required: true, type: 'string', trigger: 'blur', message:'平均油耗不能为空'},
                   { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
                 ]">
            <el-input v-model="inputForm.pjyh" placeholder="（升/百公里）"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员" prop="gly"
                        :rules="[
                  {required: true, message:'管理员不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' size="small" :readonly="true" placeholder="请选择管理员" :value="inputForm.gly" @getValue='(value) => {inputForm.gly=value}'></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="驾驶员姓名" prop="jsy"
                :rules="[
                  {required: true, message:'驾驶员不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' size="small" :readonly="true" placeholder="请选择驾驶员" :value="inputForm.jsy" @getValue='(value) => {inputForm.jsy=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        clflList: [],
        inputForm: {
          id: '',
          jsy: '',
          gly: '',
          pjyh: '',
          pjyf: '',
          gcjg: '',
          clzt: '',
          gcrq: '',
          fdjh: '',
          rybh: '',
          zws: '',
          xh: '',
          pp: '',
          cllx: '',
          clfl: '',
          cph: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect,
      GridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建车辆信息`
        } else if (method === 'edit') {
          this.title = '修改车辆信息'
        } else if (method === 'view') {
          this.title = '查看车辆信息'
        }
        // 获取车辆分类
        this.$http({
          url: `/ycgl/clfl/list`,
          method: 'get'
        }).then(({data}) => {
          this.clflList = data.page.list
        })
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/ycgl/clxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.clxx)
              this.loading = false
            })
          }
        })
      },
      // 检查车牌号
      checkCph (val) {
        this.$http({
          url: `/ycgl/clxx/cphIsUse?cph=` + val + `&id=${this.inputForm.id}`,
          method: 'get'
        }).then(({data}) => {
          if (!data.success) {
            this.$message.error(data.msg)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$http({
          url: `/ycgl/clxx/cphIsUse?cph=${this.inputForm.cph}&id=${this.inputForm.id}`,
          method: 'get'
        }).then(({data}) => {
          if (data.success === true) {
            this.$refs['inputForm'].validate((valid) => {
              if (valid) {
                this.loading = true
                this.$http({
                  url: `/ycgl/clxx/save`,
                  method: 'post',
                  data: this.inputForm
                }).then(({data}) => {
                  this.loading = false
                  if (data && data.success) {
                    this.visible = false
                    this.$message.success(data.msg)
                    this.$emit('refreshDataList')
                  }
                })
              }
            })
          }
        })
      }
    }
  }
</script>
