<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="项目名称" prop="xmmc"
                :rules="[
                  {required: true, message:'项目名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.xmmc" placeholder="请填写项目名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="项目编号" prop="xmbh"
                :rules="[
                  {required: true, message:'项目编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.xmbh" placeholder="请填写项目编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="立项单位" prop="lxdw"
                :rules="[
                  {required: true, message:'立项单位不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.lxdw" placeholder="请填写立项单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="立项日期" prop="lxrq"
                :rules="[
                  {required: true, message:'立项日期不能为空', trigger:'blur'}
                 ]">
              <el-date-picker
              v-model="inputForm.lxrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择">
            </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="项目分类" prop="xmfl"
                :rules="[
                  {required: true, message:'项目分类不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.xmfl" placeholder="项目分类"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('XMFL')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="项目风险" prop="xmfx"
                :rules="[
                  {required: true, message:'项目风险不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.xmfx" placeholder="请选择"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('XMFX')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="计划开始日期" prop="ksrq"
                :rules="[
                  {required: true, message:'计划开始日期不能为空', trigger:'blur'}
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
            <el-form-item label="计划工期" prop="jhgq"
                :rules="[
                  {required: true, message:'计划工期不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.jhgq" placeholder="请填写计划工期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="项目经理" prop="xmjl.id"
                :rules="[
                  {required: true, message:'项目经理不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' :readonly="true" :value="inputForm.xmjl.id" @getValue='(value) => {inputForm.xmjl.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="主管部门" prop="zgbm.id"
                :rules="[
                  {required: true, message:'主管部门不能为空', trigger:'blur'}
                 ]">
              <SelectTree
                ref="zgbm.id"
                :props="{
                    value: 'id',             // ID字段名
                    label: 'name',         // 显示名称
                    children: 'children'    // 子级字段名
                  }"
                url="/sys/office/treeData?type=2"
                :value="inputForm.zgbm.id"
                :clearable="true"
                :accordion="true"
                :show-checkbox="false"
                @getValue="(value) => {inputForm.zgbm.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="总负责人" prop="zfzr.id"
               :rules="[
                      {required: true, message:'总负责人不能为空', trigger:'blur'}
                    ]">
              <user-select :limit='1' :readonly="true" :value="inputForm.zfzr.id" @getValue='(value) => {inputForm.zfzr.id=value}'></user-select>
           </el-form-item>
        </el-col>

        <el-col :span="24">
            <el-form-item label="参与部门" prop="cybm"
                :rules="[
                  {required: true, message:'参与部门不能为空', trigger:'blur'}
                 ]">
            <SelectTree
              ref="cybm"
              :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
              url="/sys/office/treeData?type=2"
              :value="inputForm.cybm"
              :clearable="true"
              :accordion="true"
              :show-checkbox="true"
              @getValue="(value) => {inputForm.cybm=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="参与人" prop="zrr"
                :rules="[
                  {required: true, message:'参与人不能为空', trigger:'blur'}
                 ]">
            <user-select :readonly="true" :value="inputForm.zrr" @getValue='(value) => {inputForm.zrr=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="项目概要" prop="xmgy"
                :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.xmgy" placeholder="请填写项目概要"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="其他说明" prop="qtsm"
                :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.qtsm" placeholder="请填写其他说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="fileUrl"
                        :rules="[]">
            <el-upload ref="fileUrl"
                      v-if="visible"
                      :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/xmxx`"
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
        visible: true,
        loading: false,
        activeNames: ['1', '2', '3'],
        flList: [],
        fileUrlArra: [],
        inputForm: {
          id: '',
          xmmc: '',
          xmbh: '',
          lxdw: '',
          lxrq: '',
          xmfl: '',
          xmfx: '',
          zgbm: {
            id: '',
            name: ''
          },
          cybm: '',
          zrr: '',
          xmgy: '',
          ksrq: '',
          jsrq: '',
          jhgq: '',
          qtsm: '',
          zfzr: {
            id: '',
            name: ''
          },
          xmjl: {
            id: '',
            name: ''
          },
          fileUrl: '',
          fileName: ''
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
      SelectTree,
      UserSelect
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
      }
    },
    methods: {
      init (id) {
        if (id) {
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/xmgl/xmxx/xmjbxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xmjbxx)
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
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/xmgl/xmxx/xmjbxx/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
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