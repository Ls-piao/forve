<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="类别" prop="articles.id"
                :rules="[
                  {required: true, message:'类别不能为空', trigger:'blur'}
                 ]">
          <SelectTree
                      ref="articles"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"

                      url="/ypwh/articles/treeData"
                      :value="inputForm.articles.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.articles.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="编号" prop="code"
                :rules="[
                  {required: true, message:'编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.code" placeholder="请填写编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="名称" prop="name"
                :rules="[
                  {required: true, message:'名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="计量单位" prop="unit"
                :rules="[
                  {required: true, message:'计量单位不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.unit" placeholder="请填写计量单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数量" prop="quanttity"
                :rules="[
                  {validator: validator.isIntGtZero, trigger:'blur'},
                  {required: true, message:'数量不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.quanttity" placeholder="请填写数量"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="enclosure"
                :rules="[
                  {required: true, message:'附件不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="enclosure"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/ypwh/artilcesSub`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                    :on-success="(response, file, fileList) => {
                       inputForm.enclosure = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.enclosure = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="enclosureArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
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
      <el-button size="small" v-if="method === 'view'" style="float: left" type="success" @click="openCollectionRecord">领用记录</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
  <CollectionRecord ref="collectionRecord"></CollectionRecord>
</div>
</template>

<script>
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import CollectionRecord from './CollectionRecord'
export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        enclosureArra: [],
        inputForm: {
          id: '',
          articles: {
            id: ''
          },
          code: '',
          name: '',
          unit: '',
          quanttity: '',
          type: '',
          enclosure: '',
          remarks: ''
        }
      }
    },
    components: {
      SelectTree,
      CollectionRecord
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建用品`
        } else if (method === 'edit') {
          this.title = '修改用品'
        } else if (method === 'view') {
          this.title = '查看用品'
        }
        this.enclosureArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/ypwh/artilcesSub/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.artilcesSub)
              this.inputForm.enclosure.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.enclosureArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
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
              url: `/ypwh/artilcesSub/save`,
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
      openCollectionRecord () {
        this.$refs.collectionRecord.refreshList(this.inputForm.name + '领用记录', this.inputForm.id)
      }
    }
  }
</script>
