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
          <el-form-item label="用车人姓名" prop="ycr" :rules="[{trigger:'blur'}]">
            <el-input v-model="ycrName" placeholder="请填写用车人姓名" disabled="disabled"></el-input>
            <input type="hidden" v-model="inputForm.ycr"></input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用车人部门" prop="ycrbm" :rules="[{trigger:'blur'}]">
            <el-input v-model="ycrbmName" placeholder="请填写用车人部门" disabled="disabled"></el-input>
            <input type="hidden" v-model="inputForm.ycrbm"></input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用车人电话" prop="ycrdh" :rules="[{trigger:'blur'}]">
            <el-input v-model="inputForm.ycrdh" placeholder="请填写用车人电话" disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请车辆" prop="cl"
                        :rules="[{required: true, message:'车辆不能为空', trigger:'blur'}]">
            <el-select v-model="inputForm.cl" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in clflList"
                :key="item.id"
                :label="item.cph"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="驾驶员姓名" prop="jsy" :rules="[]">
            <user-select :limit='1' size="small" :readonly="true" placeholder="请选择驾驶员" :value="inputForm.jsy" @getValue='(value) => {inputForm.jsy=value}'></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驾驶员电话" prop="jsydh" :rules="[]">
            <el-input v-model="inputForm.jsydh" placeholder="请填写驾驶员电话"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乘车人数" prop="ccrs"
                :rules="[{required: true, message:'乘车人数不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.ccrs" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请填写乘车人数"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="kssj"
                        :rules="[{required: true, message:'开始时间不能为空', trigger:'blur'}]">
            <el-date-picker
              style="width: 100%;"
              v-model="inputForm.kssj"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :picker-options="editStartOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="jssj"
                        :rules="[{required: true, message:'结束时间不能为空', trigger:'blur'}]">
            <el-date-picker
              style="width: 100%;"
              v-model="inputForm.jssj"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :picker-options="editStopOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用车性质" prop="ycxz"
                :rules="[{required: true, message:'用车性质不能为空', trigger:'blur'}]">
            <el-select v-model="inputForm.ycxz" style="width: 100%;">
              <el-option v-for="item in $dictUtils.getDictList('YCXZ')" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用车事由" prop="ycsy"
                :rules="[{required: true, message:'用车事由不能为空', trigger:'blur'}]">
            <el-input type="textarea" v-model="inputForm.ycsy" placeholder="请填写用车事由"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出发地" prop="cfd"
                :rules="[{required: true, message:'出发地不能为空', trigger:'blur'}]">
            <el-input type="textarea" v-model="inputForm.cfd" placeholder="请填写出发地"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="目的地" prop="mdd"
                :rules="[{required: true, message:'目的地不能为空', trigger:'blur'}]">
            <el-input type="textarea" v-model="inputForm.mdd" placeholder="请填写目的地"     ></el-input>
          </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit('1')" v-noMoreClick>暂存</el-button>
      <el-button size="small" v-if="method != 'view'" @click="doSubmit('2')" v-noMoreClick>提交</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  import UserSelect from '@/components/userSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        ycrbmName: '',
        ycrName: '',
        clflList: [],
        inputForm: {
          id: '',
          updateDept: '',
          createDept: '',
          sqzt: '',
          mdd: '',
          cfd: '',
          jssj: '',
          kssj: '',
          ycsy: '',
          ycxz: '',
          ccrs: '',
          jsydh: '',
          jsy: '',
          cl: '',
          ycrdh: '',
          ycrbm: '',
          ycr: '',
          remarks: ''
        },
        editStartOptions: {
          disabledDate: time => {
            if (!this.inputForm.jssj) {
              return time.getTime() < new Date(1970 - 1 - 1).getTime()
            } else {
              return time.getTime() > new Date(this.inputForm.jssj)
            }
          }
        },
        editStopOptions: {
          disabledDate: time => {
            return (
              time.getTime() < new Date(this.inputForm.kssj) ||
              time.getTime() < new Date(1970 - 1 - 1).getTime()    // 禁止选择1970年以前的日期
            )
          }
        }
      }
    },
    components: {
      GridSelect,
      UserSelect,
      SelectTree
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建用车信息`
        } else if (method === 'edit') {
          this.title = '修改用车信息'
        } else if (method === 'view') {
          this.title = '查看用车信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          // 获取车辆分类
          this.$http({
            url: `/ycgl/clxx/list?clzt=1`,
            method: 'get'
          }).then(({data}) => {
            this.clflList = data.page.list
          })

          this.$refs.inputForm.resetFields()
          this.inputForm.ycr = this.$store.state.user.id
          this.ycrName = this.$store.state.user.name
          this.inputForm.ycrbm = this.$store.state.user.office.id
          this.ycrbmName = this.$store.state.user.office.name
          this.inputForm.ycrdh = this.$store.state.user.mobile

          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/ycgl/clsq/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.clsq)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit (status) {
        this.$refs['inputForm'].validate((valid) => {
          this.inputForm.sqzt = status
          if (valid) {
            this.loading = true
            this.$http({
              url: `/ycgl/clsq/save`,
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
    }
  }
</script>
<style>
  /*.el-form-item__label{*/
  /*  text-align: justify;*/
  /*  text-align-last: justify;*/
  /*  padding: 0 20px 0 0;*/
  /*}*/
  /*.el-form-item__label::after{*/
  /*  content: ': ';*/
  /*  position: absolute;*/
  /*  width: 100px;*/
  /*}*/
  /*.el-form-item.is-required .el-form-item__label:before {*/
  /*  content: none !important;*/
  /*}*/
</style>
