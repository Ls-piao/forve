<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">

          <el-form-item label="借领方式" prop="jl_state"
                        :rules="[
                  {required: true, message:'借领方式不能为空', trigger:'blur'}
                 ]">
            <el-radio-group v-model="inputForm.jl_state">
              <el-radio v-for="item in $dictUtils.getDictList('jlzt')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产名称" prop="name"
                :rules="[
                  {required: true, message:'资产名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写资产名称" readonly :disabled="edit"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12" v-if="this.method!='jl'">
          <el-form-item label="资产状态" prop="state"
                        :rules="[
                  {required: true, message:'资产状态不能为空', trigger:'blur'}
                 ]">
            <el-select v-model="inputForm.state" placeholder="请选择"  style="width: 100%;" readonly :disabled="edit">
              <el-option
                v-for="item in $dictUtils.getDictList('zczt')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="计量单位" prop="unit"
                :rules="[
                  {required: true, message:'计量单位不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.unit" placeholder="请填写计量单位"  readonly :disabled="edit"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="入库日期" prop="warehousingDate"
                :rules="[
                  {required: true, message:'入库日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.warehousingDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间" readonly :disabled="edit">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="品牌" prop="brand"
                :rules="[
                  {required: true, message:'品牌不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.brand" placeholder="请填写品牌"  readonly :disabled="edit"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="购买日期" prop="buyDate"
                :rules="[
                  {required: true, message:'购买日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.buyDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      readonly :disabled="edit">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="保修到期日" prop="bxDate"
                :rules="[
                  {required: true, message:'保修到期日不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.bxDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      readonly :disabled="edit">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="保修联系人" prop="bxPerple.id"
                :rules="[
                  {required: true, message:'保修联系人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.bxPerple.id" @getValue='(value) => {inputForm.bxPerple.id=value}' readonly :disabled="edit"></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="规则型号" prop="specificationModel"
                :rules="[
                  {required: true, message:'规则型号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.specificationModel" placeholder="请填写规则型号"   readonly :disabled="edit"  ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="责任人" prop="responsibilityPeople.id"
                :rules="[
                  {required: true, message:'责任人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.responsibilityPeople.id" @getValue='(value) => {inputForm.responsibilityPeople.id=value}' readonly :disabled="edit"></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="序列号" prop="serialNumber"
                :rules="[
                  {required: true, message:'序列号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.serialNumber" placeholder="请填写序列号"  readonly :disabled="edit"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="attach"
                :rules="[
                 ]">
              <el-upload ref="attach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcfl/bgxtGdzcInfo`"
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
                    :file-list="attachArra" readonly :disabled="edit">
                    <el-button size="small" type="primary" readonly :disabled="edit">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">添加相关附件</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"   readonly :disabled="edit"  ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary"  @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
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
          name: '',
          state: '',
          unit: '',
          warehousingDate: '',
          brand: '',
          buyDate: '',
          jl_state: '',
          bxDate: '',
          bxPerple: {
            id: ''
          },
          specificationModel: '',
          responsibilityPeople: {
            id: ''
          },
          serialNumber: '',
          attach: '',
          remarks: ''
        },
        readonly: true,
        edit: true
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'jl') {
          this.inputForm.id = id
          this.title = `借领固定资产信息表`
        }

        this.attachArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'jl') { // 借领
            this.loading = true
            this.$http({
              url: `/zcfl/bgxtGdzcInfo/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcInfo)
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
              url: `/zcfl/bgxtGdzcInfo/save`,
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
