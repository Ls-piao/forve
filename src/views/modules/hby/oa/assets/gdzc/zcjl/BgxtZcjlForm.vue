<template>
<div>
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
               label-width="120px">
      <el-row  :gutter="15">
<!--        <el-col :span="12">
            <el-form-item label="资产ID" prop="typeNo.id"
                :rules="[
                  {required: true, message:'资产ID不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zc.id" placeholder="请填写资产ID"     ></el-input>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="选择资产" prop="zc.id"
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
                <user-select :limit='1' :value="inputForm.sqr.id" @getValue='(value) => {inputForm.sqr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属单位" prop="office"
                        :rules="[
                 ]">
            <el-input v-model="inputForm.office" readonly placeholder="请填写所属单位"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="dept"
                        :rules="[
                 ]">
            <el-input v-model="inputForm.dept" readonly placeholder="请填写所属部门"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申请类型" prop="type"
                :rules="[
                   {required: true, message:'申请类型不能为空', trigger:'blur'}
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
                   {required: true, message:'预计归还时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.yjghDate"
                      type="datetime"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
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
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="借领单号" prop="jcNo"
                :rules="[
                  {required: true, message:'借领单号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.jcNo" placeholder="请填写借领单号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经手人" prop="jsr.id"
                :rules="[
                  {required: true, message:'经手人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.jsr.id" @getValue='(value) => {inputForm.jsr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="制单人" prop="zdr.id"
                :rules="[
                  {required: true, message:'制单人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.zdr.id" @getValue='(value) => {inputForm.zdr.id=value}'></user-select>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
            <el-form-item label="资产总原值" prop="zczyz"
                :rules="[
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zczyz" placeholder="请填写资产总原值"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产总净值" prop="zczjz"
                :rules="[
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zczjz" placeholder="请填写资产总净值"     ></el-input>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="借领说明" prop="jysm"
                :rules="[
                  {required: true, message:'借领说明不能为空', trigger:'blur'}
                 ]">
          <el-input type="textarea" v-model="inputForm.jysm" placeholder="请填写借领说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="attach"
                        :rules="[]">
            <el-upload ref="attach"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
                       :headers="{token: $cookie.get('token')}"
                       :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                       :on-success="(response, file, fileList) => {
                            inputForm.attach = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                            inputForm.fileName = fileList.map(item => item.name).join('|')
                          }"
                       :on-remove="(file, fileList) => {
                          $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                            $message.success(data.msg)
                          })
                          inputForm.attach = fileList.map(item => item.url).join('|')
                          inputForm.fileName = fileList.map(item => item.name).join('|')
                    }"
                       :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                       multiple
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
</div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import ZcSelect from '@/views/modules/hby/oa/assets/gdzc/zcjl/BgxtZcIndex'
export default {
    data () {
      return {
        visible: true,
        title: '',
        method: '',
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
          office: '',
          dept: '',
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
    props: {
      businessId: {
        type: String,
        default: ''
      },
      formReadOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      UserSelect,
      SelectTree,
      ZcSelect
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
            })
          }
        },
        immediate: true,
        deep: false
      },
      // 监听用户选择器
      'inputForm.sqr.id': {
        handler (newVal) {
          if (this.inputForm.sqr.id) {
            this.$nextTick(() => {
              this.$http({
                url: '/sys/user/queryById',
                method: 'get',
                params: {id: newVal}
              }).then(({data}) => {
                if (data.success) {
                  this.inputForm.office = data.user.company.name
                  this.inputForm.dept = data.user.office.name
                }
              })
            })
          }
        }
      }
    },
    methods: {
      init (id) {
        if (id) {
          this.attachArra = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
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
          })
        }
      },
      // 表单提交
      saveForm (callback) {
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
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      }
    }
  }
</script>
