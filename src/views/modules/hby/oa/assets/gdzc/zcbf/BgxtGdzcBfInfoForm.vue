<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''"  :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="报废ID" prop="bf.id"
                :rules="[
                  {required: true, message:'报废ID不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择报废ID"
            labelName = 'bfNo'
            labelValue = 'id'
            :value = "inputForm.bf.id"
            :limit="1"
            @getValue='(value) => {inputForm.bf.id=value}'
            :columns="[
            {
              prop: 'id',
              label: '主键'
            },
            {
              prop: 'bfNo',
              label: '报废编号'
            }
            ]"
            :searchs="[
            {
              prop: 'id',
              label: '主键'
            },
            {
              prop: 'bfNo',
              label: '报废编号'
            }
            ]"
            dataListUrl="/zcbf/bgxtGdzcBf/list"
            entityBeanName="bgxtGdzcBf"
            queryEntityUrl="/zcbf/bgxtGdzcBf/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产ID" prop="zc.id"
                :rules="[
                  {required: true, message:'资产ID不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择资产ID"
            labelName = 'name'
            labelValue = 'id'
            :value = "inputForm.zc.id"
            :limit="1"
            @getValue='(value) => {inputForm.zc.id=value}'
            :columns="[
            {
              prop: 'id',
              label: 'id'
            },
            {
              prop: 'name',
              label: '资产名称'
            }
            ]"
            :searchs="[
            {
              prop: 'id',
              label: 'id'
            },
            {
              prop: 'name',
              label: '资产名称'
            }
            ]"
            dataListUrl="/zcfl/bgxtGdzcInfo/list"
            entityBeanName="bgxtGdzcInfo"
            queryEntityUrl="/zcfl/bgxtGdzcInfo/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="处理方式" prop="clfs"
                :rules="[
                  {required: true, message:'处理方式不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.clfs" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('ZCBW_CLFS')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="处理日期" prop="clDate"
                :rules="[
                  {required: true, message:'处理日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.clDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="残值金额(元)" prop="czje"
                :rules="[
                  {required: true, message:'残值金额不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.czje" placeholder="请填写残值金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="attach"
                :rules="[
                 ]">
              <el-upload ref="attach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcbf/bgxtGdzcBfInfo`"
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
      <el-button size="small" v-if="method === 'add'" type="primary" @click="continueDoSubmit()">继续添加</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" v-if="method !== 'view'" type="primary" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        oldInputForm: '',
        attachArra: [],
        inputForm: {
          id: '',
          bf: {
            id: ''
          },
          zc: {
            id: ''
          },
          clfs: '',
          clDate: '',
          czje: '',
          attach: '',
          remarks: ''
        }
      }
    },
    components: {
      GridSelect
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建资产报废明细表`
        } else if (method === 'edit') {
          this.title = '修改资产报废明细表'
        } else if (method === 'view') {
          this.title = '查看资产报废明细表'
        }
        this.attachArra = []
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = ''
          this.oldInputForm = ''
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.oldInputForm = obj
            this.inputForm = JSON.parse(JSON.stringify(obj))
            this.inputForm.attach.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.attachArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
              }
            })
          }
        })
      },
   // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.visible = false
          }
        })
      },
      continueDoSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.$refs['inputForm'].resetFields()
          }
        })
      }
    }
  }
</script>
