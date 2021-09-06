<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    width="75%"
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="8">
            <el-form-item label="供应商编码" prop="code"
                :rules="[
                  {required: true, message:'供应商编码不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.code" placeholder="请填写供应商编码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="供应商全称" prop="name"
                :rules="[
                  {required: true, message:'供应商全称不能为空', trigger:'blur'}
                 ]">
          <el-input v-model="inputForm.name" placeholder="请填写供应商全称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="供应商简称" prop="abbreviation"
                :rules="[
                  {required: true, message:'供应商简称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.abbreviation" placeholder="请填写供应商简称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="企业类型" prop="type"
                :rules="[
                   {required: true, message:'企业类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.type" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('QYLX')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人名称" prop="userName"
                        :rules="[
                  {required: true, message:'联系人名称不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.userName" placeholder="请填写联系人名称"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话" prop="phoneNum"
                        :rules="[
                  {validator: validator.isMobile, trigger:'blur'},
                   {required: true, message:'联系人电话不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.phoneNum" placeholder="请填写联系人电话"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="公司地址" prop="address"
                :rules="[
                  { max: 10, message: '最大长度是50个字符', trigger: 'blur' },
                   {required: true, message:'公司地址不能为空', trigger:'blur'}
                 ]">
          <el-input v-model="inputForm.address" placeholder="请填写公司地址"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="国家地区" prop="country"
                :rules="[
                   {required: true, message:'国家地区不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.country" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('GJ')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门名称" prop="departmentName"
                        :rules="[
                  {required: true, message:'部门名称不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.departmentName" placeholder="请填写部门名称"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经营范围" prop="range"
                        :rules="[
                   {required: true, message:'经营范围不能为空', trigger:'blur'}
                 ]">
            <el-input type="textarea" v-model="inputForm.range" placeholder="请填写经营范围"     ></el-input>
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
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          code: '',
          name: '',
          abbreviation: '',
          departmentName: '',
          type: '',
          range: '',
          address: '',
          country: '',
          userName: '',
          phoneNum: '',
          remarks: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建供应商`
        } else if (method === 'edit') {
          this.title = '修改供应商'
        } else if (method === 'view') {
          this.title = '查看供应商'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/gysgl/supplier/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.supplier)
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
              url: `/gysgl/supplier/save`,
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
