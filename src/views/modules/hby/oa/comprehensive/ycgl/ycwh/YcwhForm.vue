<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    append-to-body
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="开始时间" prop="whkssj"
                :rules="[
                   {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.whkssj"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="editStartOptions"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="结束时间" prop="whjssj"
                :rules="[
                   {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.whjssj"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="editStopOptions"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="维护类型" prop="whlx"
                :rules="[
                  {required: true, message:'维护类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.whlx" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('WHLX')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="维护费用" prop="whfy"
                :rules="[
                  {validator: validator.isFloatGteZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.whfy" placeholder="请填写维护费用"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="维护项目" prop="whxm"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.whxm" placeholder="请填写维护项目"     ></el-input>
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
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          whkssj: '',
          whjssj: '',
          whlx: '',
          whfy: '',
          whxm: '',
          createDept: '',
          updateDept: '',
          remarks: '',
          clid: ''
        },
        editStartOptions: {
          disabledDate: time => {
            if (!this.inputForm.whjssj) {
              return time.getTime() < new Date(1970 - 1 - 1).getTime()
            } else {
              return time.getTime() > new Date(this.inputForm.whjssj)
            }
          }
        },
        editStopOptions: {
          disabledDate: time => {
            return (
              time.getTime() < new Date(this.inputForm.whkssj) ||
              time.getTime() < new Date(1970 - 1 - 1).getTime()    // 禁止选择1970年以前的日期
            )
          }
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id, clid) {
        this.method = method
        this.inputForm.id = id
        this.inputForm.clid = clid
        if (method === 'add') {
          this.title = `新建维护信息`
        } else if (method === 'edit') {
          this.title = '修改维护信息'
        } else if (method === 'view') {
          this.title = '查看维护信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/ycgl/ycwh/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.ycwh)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/ycgl/ycwh/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList', this.inputForm.clid)
              }
            })
          }
        })
      }
    }
  }
</script>
