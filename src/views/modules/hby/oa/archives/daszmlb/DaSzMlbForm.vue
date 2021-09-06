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
          <el-form-item label="全宗" prop="qz.id"
                        :rules="[
                  {required: true, message:'全宗不能为空', trigger:'blur'}
                 ]">
            <GridSelect
              title="选择全宗"
              labelName = 'qzh'
              labelValue = 'id'
              :value = "inputForm.qz.id"
              :limit="1"
              @getValue='(value) => {inputForm.qz.id=value}'
              :columns="[
            {
              prop: 'qzh',
              label: '全宗号'
            },
            {
              prop: 'qzmc',
              label: '全宗名称'
            }
            ]"
              :searchs="[
            {
              prop: 'qzh',
              label: '全宗号'
            },
            {
              prop: 'qzmc',
              label: '全宗名称'
            }
            ]"
              dataListUrl="/dagl/daszqzb/list"
              entityBeanName="daSzQzb"
              queryEntityUrl="/dagl/daszqzb/queryById">
            </GridSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="门类编码" prop="mlbm"
                :rules="[
                  {required: true, message:'门类编码不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.mlbm" placeholder="请填写门类编码"  maxlength="15"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="门类名称" prop="mlmc"
                :rules="[
                  {required: true, message:'门类名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.mlmc" placeholder="请填写门类名称"  maxlength="100"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="daSzMlbTab">
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
        daSzMlbTab: '0',
        inputForm: {
          id: '',
          qz: {
            id: ''
          },
          mlbm: '',
          mlmc: '',
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
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建门类`
        } else if (method === 'edit') {
          this.title = '修改门类'
        } else if (method === 'view') {
          this.title = '查看门类'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.daSzMlbTab = '0'
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/dagl/daszmlb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.daSzMlb)
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
              url: `/dagl/daszmlb/save`,
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
