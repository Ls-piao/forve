<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    customClass="customwidth"
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="合同名称" prop="htmc"
                :rules="[
                  {required: true, message:'合同名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.htmc" placeholder="请填写合同名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同编号" prop="htbh"
                :rules="[
                  {required: true, message:'合同编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.htbh" placeholder="请填写合同编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同种类" prop="htzl"
                :rules="[
                  {required: true, message:'合同种类不能为空', trigger:'blur'}
                 ]">
             <el-select v-model="inputForm.htzl" placeholder="合同种类"  style="width: 100%;">
               <el-option
                  v-for="item in this.$dictUtils.getDictList('HTZL')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
               </el-option>
            </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同状态" prop="htzt"
                >
            <el-select v-model="inputForm.xmfl" placeholder="合同状态"  style="width: 100%;">
               <el-option
                  v-for="item in this.$dictUtils.getDictList('HTZT')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
               </el-option>
            </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属项目" prop="ssxm.id"
                >
               <el-select v-model="inputForm.ssxm.id" style="width:100%" placeholder="所属项目">
                  <el-option
                     v-for="xm in xmList"
                     :key="xm.id"
                     :label="xm.xmmc"
                     :value="xm.id">
                  </el-option>
               </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同密级" prop="htmj"
                >
               <el-input type="number" v-model="inputForm.htmj" placeholder="请填写合同密级"  ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经办部门" prop="jbbm"
                :rules="[
               {required: true, message:'经办部门不能为空', trigger:'blur'}
                 ]">
              <SelectTree
              ref="cybm"
              :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
              url="/sys/office/treeData?type=2"
              :value="inputForm.jbbm"
              :clearable="true"
              :accordion="true"
              :show-checkbox="true"
              @getValue="(value) => {inputForm.jbbm=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经办人" prop="jbr"
                :rules="[
                {required: true, message:'经办人不能为空', trigger:'blur'}
                 ]">
              <user-select :readonly="true" :value="inputForm.jbr" @getValue='(value) => {inputForm.jbr=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="签约单位" prop="qydw"
                :rules="[
                {required: true, message:'签约单位不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.qydw" placeholder="请填写签约单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="签约相对方" prop="qyxdf"
                :rules="[
                {required: true, message:'签约相对方不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.qyxdf" placeholder="请填写签约相对方"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同金额(元)" prop="htje"
                :rules="[
                {required: true, message:'合同金额不能为空', trigger:'blur'}
                 ]">
              <el-input type="number" v-model="inputForm.htje" placeholder="请填写合同金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
         <el-form-item label="签订日期" prop="qdrq"
                :rules="[
                  {required: true, message:'签订日期不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
               v-model="inputForm.qdrq"
               type="date"
               value-format="yyyy-MM-dd"
               placeholder="请选择">
            </el-date-picker>
         </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="生效日期" prop="sxrq"
                :rules="[
                 {required: true, message:'生效日期不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              v-model="inputForm.sxrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择">
            </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同期限" prop="htqx"
                :rules="[
                {required: true, message:'合同期限不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.htqx" placeholder="请填写合同期限"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开始日期" prop="ksrq"
                :rules="[
                {required: true, message:'开始日期不能为空', trigger:'blur'}
                 ]">
              <el-date-picker
               v-model="inputForm.ksrq"
               type="date"
               value-format="yyyy-MM-dd"
               placeholder="请选择">
               </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="结束日期" prop="jsrq"
                :rules="[
                {required: true, message:'结束日期不能为空', trigger:'blur'}
                 ]">
              <el-date-picker
               v-model="inputForm.jsrq"
               type="date"
               value-format="yyyy-MM-dd"
               placeholder="请选择">
               </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同份数" prop="htfs"
                :rules="[
                {required: true, message:'合同份数不能为空', trigger:'blur'},{validator: isOneToNinetyNine, trigger: 'blur'}
                 ]">
              <el-input type="number" v-model="inputForm.htfs" placeholder="请填写合同份数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="内容摘要" prop="nrzy"
                :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.nrzy" placeholder="请填写内容摘要"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="fileUrl"
                        :rules="[]">
            <el-upload ref="fileUrl"
                        v-if="visible"
                        :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/htxx`"
                        :headers="{token: $cookie.get('token')}"
                        :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                        :on-success="(response, file, fileList) => {
                           inputForm.fileUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                           inputForm.fileName = fileList.map(item => item.name).join('|')
                        }"
                        :on-remove="(file, fileList) => {
                        $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                           $message.success(data.msg)
                        })
                        inputForm.fileUrl = fileList.map(item => item.url).join('|')
                        inputForm.fileName = fileList.map(item => item.name).join('|')
                  }"
                        :before-remove="(file, fileList) => {
                     return $confirm(`确定移除 ${file.name}？`)
                  }"
                        multiple
                        :file-list="fileUrlArra">
               <el-button size="small" type="primary">点击上传</el-button>
               <div slot="tip" class="el-upload__tip">添加相关附件</div>
            </el-upload>
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import UserSelect from '@/components/userSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        xmList: [],
        fileUrlArra: [],
        inputForm: {
          id: '',
          htmc: '',
          htbh: '',
          htmj: '',
          htzl: '',
          htzt: '',
          ssxm: {
            id: '',
            xmmc: ''
          },
          jbbm: '',
          jbr: '',
          qydw: '',
          qyxdf: '',
          htje: '',
          qdrq: '',
          sxrq: '',
          htqx: '',
          ksrq: '',
          jsrq: '',
          ht: '',
          htfs: '',
          nrzy: '',
          fileUrl: '',
          fileName: ''
        }
      }
    },
    components: {
      SelectTree,
      UserSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.fileUrlArra = []
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建合同信息`
        } else if (method === 'edit') {
          this.title = '修改合同信息'
        } else if (method === 'view') {
          this.title = '查看合同信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$http({
            url: `/xmgl/xmxx/xmjbxx/list?xmzt=4&pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.xmList = data.page.list
          })
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/htxx/xmhtxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xmhtxx)
              var url = this.inputForm.fileUrl.split('|')
              var name = this.inputForm.fileName.split('|')
              if (url[0] !== '') {
                for (var i = 0; i < url.length; i++) {
                  this.fileUrlArra.push({
                    name: name[i],
                    url: url[i]
                  })
                }
              }
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
              url: `/xmgl/htxx/xmhtxx/save`,
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
      isOneToNinetyNine (rule, value, callback) {
        if (!value) {
          return callback(new Error('输入不可以为空'))
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error('请输入正整数'))
          } else {
            const re = /^[1-9][0-9]{0,1}$/
            const rsCheck = re.test(value)
            if (!rsCheck) {
              callback(new Error('请输入正整数，值为【1,99】'))
            } else {
              callback()
            }
          }
        }, 0)
      }
    }
  }
</script>
<style lang='less' >
  .customwidth{
   width : 100%;
  }

</style>
