<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="会议室名称" prop="hysmc"
                :rules="[
                 ]">
              <el-input v-model="inputForm.hysmc" placeholder="请填写会议室名称"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="电话" prop="dh"
                :rules="[
                  {validator: validator.isMobile, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dh" placeholder="请填写电话"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="可容纳人数" prop="rs"
                :rules="[
                  {validator: validator.isDigits, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.rs" placeholder="请填写可容纳人数"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="设备" prop="sbid" :rules="[]">
              <GridSelect
                title="选择设备"
                labelName = 'sbmc'
                labelValue = 'id'
                :value = "inputForm.sbid"
                @getValue='(value) => {inputForm.sbid=value}'
                :columns="[
                    {
                      prop: 'sbmc',
                      label: '设备名称'
                    },
                    {
                      prop: 'xh',
                      label: '型号'
                    },
                    {
                      prop: 'yt',
                      label: '用途'
                    }
                ]"
                :searchs="[
                    {
                      prop: 'sbmc',
                      label: '设备名称'
                    },
                    {
                      prop: 'xh',
                      label: '型号'
                    },
                    {
                      prop: 'yt',
                      label: '用途'
                    }
                ]"
                dataListUrl="/hygl/sbgl/sbgl/list"
                entityBeanName="sbgl"
                queryEntityUrl="/hygl/sbgl/sbgl/queryById">
              </GridSelect>
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
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          hysmc: '',
          dh: '',
          rs: '',
          sbid: ''
        }
      }
    },
    components: {
      GridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建会议室信息`
        } else if (method === 'edit') {
          this.title = '修改会议室信息'
        } else if (method === 'view') {
          this.title = '查看会议室信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/hygl/hysgl/hysgl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.hysgl)
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
              url: `/hygl/hysgl/hysgl/save`,
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
