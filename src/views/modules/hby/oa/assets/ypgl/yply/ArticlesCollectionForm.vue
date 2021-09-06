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
            <el-form-item label="领用人" prop="collectionPerson"
                :rules="[
                  {required: true, message:'领用人不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' size="small" placeholder="请选择领用人" :value="inputForm.collectionPerson" @getValue='(value) => {inputForm.collectionPerson=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="领用物品" prop="collectionArticles"
                :rules="[
                  {required: true, message:'领用物品不能为空', trigger:'blur'}
                 ]">
              <articles-select :limit='1' :value="inputForm.collectionArticles" @getValue='(value) =>{inputForm.collectionArticles=value}'></articles-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="领用时间" prop="collectionDate"
                :rules="[
                  {required: true, message:'领用时间不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.collectionDate" placeholder="请填写领用时间"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="领用数量" prop="num"
                :rules="[
                  {required: true, message:'领用数量不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.num" placeholder="请填写领用数量"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人" prop="jbr"
                        :rules="[
                  {required: true, message:'经办人不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' size="small" placeholder="请选择领用人" :value="inputForm.jbr" @getValue='(value) => {inputForm.jbr=value}'></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder=""     ></el-input>
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
  import ArticlesSelect from '@/views/modules/hby/oa/assets/ypgl/ypsq/ArticlesSelectIndex'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          collectionPerson: '',
          collectionArticles: '',
          collectionDate: '',
          num: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect,
      ArticlesSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建用品领用`
        } else if (method === 'edit') {
          this.title = '修改用品领用'
        } else if (method === 'view') {
          this.title = '查看用品领用'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/ypgl/yply/articlesCollection/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.articlesCollection)
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
              url: `/ypgl/yply/articlesCollection/save`,
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
