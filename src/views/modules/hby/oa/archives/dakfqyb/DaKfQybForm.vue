<template>
<div>
  <el-dialog
    :title="title"
    size="small"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
          <el-form-item label="库房" prop="kf.id"
                        :rules="[
                  {required: true, message:'库房不能为空', trigger:'blur'}
                 ]">
            <GridSelect
              title="选择库房"
              labelName = 'kfbh'
              labelValue = 'id'
              :value = "inputForm.kf.id"
              :limit="1"
              @getValue='(value) => {inputForm.kf.id=value}'
              :columns="[
            {
              prop: 'kfbh',
              label: '库房编号'
            },
            {
              prop: 'kfmc',
              label: '库房名称'
            }
            ]"
              :searchs="[
            {
              prop: 'kfbh',
              label: '库房编号'
            },
            {
              prop: 'kfmc',
              label: '库房名称'
            }
            ]"
              dataListUrl="/dagl/dakfkfb/list"
              entityBeanName="daKfKfb"
              queryEntityUrl="/dagl/dakfkfb/queryById">
            </GridSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="区域编码" prop="qybm"
                :rules="[
                  {required: true, message:'区域编码不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.qybm" placeholder="请填写区域编码"  maxlength="15"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="区域名称" prop="qymc"
                :rules="[
                  {required: true, message:'区域名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.qymc" placeholder="请填写区域名称"  maxlength="100"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注"  maxlength="200"    ></el-input>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="daKfQybTab">
            </el-tabs>
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
        daKfQybTab: '0',
        inputForm: {
          id: '',
          kf: {
            id: ''
          },
          qybm: '',
          qymc: '',
          remarks: ''
        }
      }
    },
    components: {
      GridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.title = `新建库房区域`
        } else if (method === 'edit') {
          this.title = '修改库房区域'
        } else if (method === 'view') {
          this.title = '查看库房区域'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.daKfQybTab = '0'
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/dagl/dakfqyb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.daKfQyb)
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
              url: `/dagl/dakfqyb/save`,
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
