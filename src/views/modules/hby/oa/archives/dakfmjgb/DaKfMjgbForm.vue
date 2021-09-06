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
          <el-form-item label="所属库房" prop="kf.id"
                        :rules="[
                  {required: true, message:'所属库房不能为空', trigger:'blur'}
                 ]">
            <MyGridSelect
              title="选择所属库房"
              labelName = 'kfbh'
              labelValue = 'id'
              :value = "inputForm.kf.id"
              :limit="1"
              @getValue='(value) => {onSelectKf(value)}'
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
            </MyGridSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="qy.id"
                        :rules="[
                  {required: true, message:'所属区域不能为空', trigger:'blur'}
                 ]">
            <MyGridSelect
              ref="qySelect"
              title="选择所属区域"
              labelName = 'qybm'
              labelValue = 'id'
              :value = "inputForm.qy.id"
              :limit="1"
              @getValue='(value) => {inputForm.qy.id=value}'
              :columns="[
            {
              prop: 'qybm',
              label: '区域编码'
            },
            {
              prop: 'qymc',
              label: '区域名称'
            }
            ]"
              :searchs="[
            {
              prop: 'qybm',
              label: '区域编码'
            },
            {
              prop: 'qymc',
              label: '区域名称'
            }
            ]"
              dataListUrl="/dagl/dakfqyb/list"
              entityBeanName="daKfQyb"
              queryEntityUrl="/dagl/dakfqyb/queryById">
            </MyGridSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="密集柜编码" prop="mjgbm"
                :rules="[
                  {required: true, message:'密集柜编码不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.mjgbm" placeholder="请填写密集柜编码"  maxlength="15"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="层数" prop="cs"
                :rules="[
                 ]">
              <el-input v-model="inputForm.cs" placeholder="请填写层数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="层起始位置" prop="cqswz"
                :rules="[
                 ]">
              <el-input v-model="inputForm.cqswz" placeholder="请填写层起始位置"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="节起始位置" prop="jqswz"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jqswz" placeholder="请填写节起始位置"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="容量" prop="rl"
                :rules="[
                 ]">
              <el-input v-model="inputForm.rl" placeholder="请填写容量"     ></el-input>
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
            <el-tabs v-model="daKfMjgbTab">
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
  import MyGridSelect from '../common/MyGridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        daKfMjgbTab: '0',
        inputForm: {
          id: '',
          kf: {
            id: ''
          },
          qy: {
            id: ''
          },
          mjgbm: '',
          cs: '',
          cqswz: '',
          jqswz: '',
          rl: '',
          remarks: ''
        }
      }
    },
    components: {
      MyGridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.title = `新建密集柜`
        } else if (method === 'edit') {
          this.title = '修改密集柜'
        } else if (method === 'view') {
          this.title = '查看密集柜'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.daKfMjgbTab = '0'
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/dagl/dakfmjgb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.daKfMjgb)
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
              url: `/dagl/dakfmjgb/save`,
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
      },
      onSelectKf (value) {
        this.inputForm.kf.id = value
        this.inputForm.qy.id = ''
        this.$refs.qySelect.urlParams = {
          'kf.id': this.inputForm.kf.id
        }
      }
    }
  }
</script>
