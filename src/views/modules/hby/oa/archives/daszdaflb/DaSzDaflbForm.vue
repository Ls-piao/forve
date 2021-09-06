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
          <el-form-item label="全宗" prop="qz.id"
                        :rules="[
                  {required: true, message:'全宗不能为空', trigger:'blur'}
                 ]">
            <MyGridSelect
              title="选择全宗"
              labelName = 'qzh'
              labelValue = 'id'
              :value = "inputForm.qz.id"
              :limit="1"
              @getValue='(value) => {onSelectQz(value)}'
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
            </MyGridSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门类" prop="ml.id"
                        :rules="[
                  {required: true, message:'门类不能为空', trigger:'blur'}
                 ]">
            <MyGridSelect
              ref="mlSelect"
              title="选择门类"
              labelName = 'mlbm'
              labelValue = 'id'
              :value = "inputForm.ml.id"
              :limit="1"
              @getValue='(value) => {inputForm.ml.id=value}'
              :columns="[
            {
              prop: 'mlbm',
              label: '门类编码'
            },
            {
              prop: 'mlmc',
              label: '门类名称'
            }
            ]"
              :searchs="[
            {
              prop: 'mlbm',
              label: '门类编码'
            },
            {
              prop: 'mlmc',
              label: '门类名称'
            }
            ]"
              dataListUrl="/dagl/daszmlb/list"
              entityBeanName="daSzMlb"
              queryEntityUrl="/dagl/daszmlb/queryById">
            </MyGridSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="类型编码" prop="lxbm"
                :rules="[
                  {required: true, message:'类型编码不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.lxbm" placeholder="请填写类型编码"  maxlength="15"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="类型名称" prop="lxmc"
                :rules="[
                  {required: true, message:'类型名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.lxmc" placeholder="请填写类型名称"  maxlength="100"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="整理方式" prop="zlfs"
                :rules="[
                  {required: true, message:'整理方式不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.zlfs" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('dagl_zlfs')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注"     ></el-input>
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
        inputForm: {
          id: '',
          mlId: '',
          qzId: '',
          lxbm: '',
          lxmc: '',
          zlfs: '',
          remarks: '',
          qz: {
            id: ''
          },
          ml: {
            id: ''
          }
        }
      }
    },
    components: {
      MyGridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建档案分类`
        } else if (method === 'edit') {
          this.title = '修改档案分类'
        } else if (method === 'view') {
          this.title = '查看档案分类'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/dagl/daszdaflb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.daSzDaflb)
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
              url: `/dagl/daszdaflb/save`,
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
      onSelectQz (value) {
        this.inputForm.qz.id = value
        this.inputForm.ml.id = ''
        this.$refs.mlSelect.urlParams = {
          'qz.id': this.inputForm.qz.id
        }
      }
    }
  }
</script>
