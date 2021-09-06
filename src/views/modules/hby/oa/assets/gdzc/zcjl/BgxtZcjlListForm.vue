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
          <el-form-item label="资产名称" prop="zc.id"
                        :rules="[
                  {required: true, message:'资产不能为空', trigger:'blur'}
                 ]">
            <zc-select :limit='1' :value="inputForm.zc.id" @getValue='(value) => {inputForm.zc.id=value}'></zc-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申请人" prop="sqr.id"
                :rules="[
                  {required: true, message:'申请人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.sqr.id" @getValue='(value) => {inputForm.sqr.id=value}' :readonly="true"></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申请类型" prop="type"
                :rules="[
                 ]">
                <el-select v-model="inputForm.type" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('jlzt')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="预计归还时间" prop="yjghDate"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.yjghDate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.sjghDate!=''">
            <el-form-item label="实际归还日期" prop="sjghDate"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.sjghDate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="部门" prop="dept.id"
                :rules="[
                 ]">
          <SelectTree
                      ref="dept"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"

                      url="/sys/office/treeData?type=2"
                      :value="inputForm.dept.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.dept.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借领单号" prop="jcNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jcNo" placeholder="请填写借领单号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经手人" prop="jsr.id"
                :rules="[
                 ]">
                <user-select :limit='1' :value="inputForm.jsr.id" @getValue='(value) => {inputForm.jsr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="制单人" prop="zdr.id"
                :rules="[
                 ]">
                <user-select :limit='1' :value="inputForm.zdr.id" @getValue='(value) => {inputForm.zdr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借领说明" prop="jysm"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.jysm" placeholder="请填写借领说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="attach"
                :rules="[
                 ]">
              <el-upload ref="attach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcjl/bgxtZcjl`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                    :on-success="(response, file, fileList) => {
                       inputForm.attach = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.attach = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="attachArra">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">添加相关附件</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="12">
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
  import UserSelect from '@/components/userSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import ZcSelect from '@/views/modules/hby/oa/assets/gdzc/zcjl/BgxtZcIndex'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        attachArra: [],
        inputForm: {
          id: '',
          zc: {
            id: ''
          },
          sqr: {
            id: ''
          },
          type: '',
          yjghDate: '',
          sjghDate: '',
          dept: {
            id: ''
          },
          jcNo: '',
          jsr: {
            id: ''
          },
          zdr: {
            id: ''
          },
          jysm: '',
          attach: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect,
      SelectTree,
      ZcSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建资产借领`
        } else if (method === 'edit') {
          this.title = '修改资产借领'
        } else if (method === 'view') {
          this.title = '查看资产借领'
        }
        this.attachArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/zcjl/bgxtZcjl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtZcjl)
              this.inputForm.attach.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.attachArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
              url: `/zcjl/bgxtZcjl/save`,
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
