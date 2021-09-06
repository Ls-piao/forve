<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'" label-width="120px">
        <el-row  :gutter="15">
          <el-col :span="12">
            <el-form-item label="用车人姓名" >
              <el-input v-model="showForm.user.name" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用车人部门">
              <el-input v-model="showForm.office.name" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用车人电话">
              <el-input v-model="showForm.clsq.ycrdh" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请车辆">
              <el-input v-model="showForm.clxx.cph" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员姓名">
              <el-input v-model="showForm.clsq.jsyName" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员电话">
              <el-input v-model="showForm.clsq.jsydh" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乘车人数">
              <el-input v-model="showForm.clsq.ccrs" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用车性质">
              <el-select v-model="showForm.clsq.ycxz" style="width: 100%;" disabled="disabled">
                <el-option v-for="item in $dictUtils.getDictList('YCXZ')" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用车事由">
              <el-input type="textarea" v-model="showForm.clsq.ycsy" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" disabled="disabled">
              <el-date-picker disabled="disabled"
                style="width: 100%;"
                v-model="showForm.clsq.kssj"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="结束时间">
              <el-date-picker disabled="disabled"
                style="width: 100%;"
                v-model="showForm.clsq.jssj"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发地">
              <el-input v-model="showForm.clsq.cfd" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地">
              <el-input v-model="showForm.clsq.mdd" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-show="spyj_el_col">
            <el-form-item label="上级审批意见" prop="spyj">
              <el-input type="textarea" v-model="inputForm.spyj" placeholder="请填写上级审批意见" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="glyspyj_el_col">
            <el-form-item label="管理员审批意见" prop="glyspyj">
              <el-input type="textarea" v-model="inputForm.glyspyj" placeholder="请填写管理员审批意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" v-if="method==='edit'" @click="doSubmit('1')" v-noMoreClick>审批通过</el-button>
      <el-button size="small" v-if="method==='edit'" @click="doSubmit('2')" v-noMoreClick>审批驳回</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import GridSelect from '@/components/gridSelect'
import UserSelect from '@/components/userSelect'
export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      spyj_el_col: false,
      glyspyj_el_col: false,
      dqsprjs: '',
      showForm: {
        user: {
          name: ''
        },
        office: {
          name: ''
        },
        clxx: {
          cph: ''
        },
        clsq: {
          ycrdh: '',
          jsy: '',
          jsyName: '',
          jsydh: '',
          ccrs: '',
          ycxz: '',
          ycsy: '',
          kssj: '',
          jssj: '',
          cfd: '',
          mdd: ''
        }
      },
      inputForm: {
        id: '',
        spyj: '',
        glyspyj: '',
        type: '',
        dqsprjs: '',
        dqspzt: ''
      }
    }
  },
  components: {
    GridSelect,
    UserSelect
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = `新建用车信息`
      } else if (method === 'edit') {
        this.title = '用车审批'
      } else if (method === 'view') {
        this.title = '查看用车审批信息'
      }
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.loading = true
          this.$http({
            url: `/ycgl/spyj/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            // 上级审批意见（如果是审核中，显示管理员审批意见）
            if (data.spyj.spzt === '' || data.spyj.spzt === undefined || data.spyj.spzt === '3') {
              this.dqsprjs = 'sjld'
              this.spyj_el_col = true
            }
            // 管理员审批意见（如果上级审批状态为空，或者管理员审批意见为已通过，才会显示管理员审批意见）
            if (data.spyj.glyspzt === '3' && data.spyj.spzt === '1') {
              this.dqsprjs = 'gly'
              this.glyspyj_el_col = true
            }
            this.inputForm = this.recover(this.inputForm, data.spyj)
            this.showForm = this.recover(this.showForm, data.spyj)
            this.loading = false
          })
        }
      })
    },
    // 表单提交
    doSubmit (status) {
      this.$refs['inputForm'].validate((valid) => {
        this.inputForm.dqsprjs = this.dqsprjs
        this.inputForm.dqspzt = status
        if (valid) {
          this.loading = true
          this.$http({
            url: `/ycgl/spyj/save`,
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
