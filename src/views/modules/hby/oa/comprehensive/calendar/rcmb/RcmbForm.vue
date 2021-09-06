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
            <el-form-item label="日程标题" prop="rcbt"
                :rules="[
                  {required: true, message:'日程标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.rcbt" placeholder="请填写日程标题"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="日程内容" prop="rcnr"
                :rules="[
                  {required: true, message:'日程内容不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.rcnr" placeholder="请填写日程内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="紧急程度" prop="jjcd"
                :rules="[
                  {required: true, message:'紧急程度不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.jjcd" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('RCGL_JJCD')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="日程类型" prop="rclx.id"
                :rules="[
                  {required: true, message:'日程类型不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择日程类型"
            labelName = 'name'
            labelValue = 'id'
            :value = "inputForm.rclx.id"
            :limit="1"
            @getValue='(value) => {inputForm.rclx.id=value}'
            :columns="[
            {
              prop: 'name',
              label: '名称'
            }
            ]"
            :searchs="[
            {
              prop: 'name',
              label: '名称'
            }
            ]"
            dataListUrl="/rclx/rclx/list"
            entityBeanName="rclx"
            queryEntityUrl="/rclx/rclx/queryById">
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
          rcbt: '',
          rcnr: '',
          jjcd: '',
          rclx: {
            id: ''
          }
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
          this.title = `新建日程模板`
        } else if (method === 'edit') {
          this.title = '修改日程模板'
        } else if (method === 'view') {
          this.title = '查看日程模板'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/rcmb/rcmb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.rcmb)
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
              url: `/rcmb/rcmb/save`,
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
