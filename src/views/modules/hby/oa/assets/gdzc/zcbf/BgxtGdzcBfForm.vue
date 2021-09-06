<template>
<div>
  <el-dialog
    :title="title"
    size="small"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="报废编号" prop="bfNo"
                :rules="[
                  {required: true, message:'报废编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bfNo" placeholder="请填写报废编号"     ></el-input>
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
            <el-form-item label="经办人" prop="jbr.id"
                :rules="[
                  {required: true, message:'经办人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.jbr.id" @getValue='(value) => {inputForm.jbr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="报废原因" prop="bfContent"
                :rules="[
                  {required: true, message:'报废原因不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bfContent" placeholder="请填写报废原因"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="attach"
                :rules="[
                 ]">
              <el-upload ref="attach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcbf/bgxtGdzcBf`"
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
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtGdzcBfTab">
            <el-tab-pane label="资产报废明细表">
                  <el-button size="small" @click="addBgxtGdzcBfInfoRow" type="primary">新增</el-button>
                  <el-table
                  class="table"
                  size="small"
                  :data="inputForm.bgxtGdzcBfInfoList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                  <el-table-column
                    prop="zc.name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产ID">
                  </el-table-column>
                <el-table-column
                    prop="clfs"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="处理方式">
                    <template slot-scope="scope">
                        {{ $dictUtils.getDictLabel("ZCBW_CLFS", scope.row.clfs, '-') }}
                    </template>
                  </el-table-column>
                <el-table-column
                    prop="clDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="处理日期">
                  </el-table-column>
                <el-table-column
                    prop="czje"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="残值金额(元)">
                  </el-table-column>
                <el-table-column
                    prop="attach"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="附件">
        <template slot-scope="scope" v-if="scope.row.attach">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.attach.split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
      </el-table-column>
                <el-table-column
                    prop="remarks"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="备注信息">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtGdzcBfInfoRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtGdzcBfInfoRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtGdzcBfInfoRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
  <BgxtGdzcBfInfoForm ref="bgxtGdzcBfInfoForm" @addRow="saveBgxtGdzcBfInfoRow(arguments)"></BgxtGdzcBfInfoForm>
</div>
</template>

<script>
  import BgxtGdzcBfInfoForm from './BgxtGdzcBfInfoForm'
  import UserSelect from '@/components/userSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        bgxtGdzcBfTab: '0',
        attachArra: [],
        inputForm: {
          id: '',
          bgxtGdzcBfInfoList: [],
          bfNo: '',
          sqr: {
            id: ''
          },
          jbr: {
            id: ''
          },
          bfContent: '',
          attach: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect,
      BgxtGdzcBfInfoForm
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.title = `新建报废信息`
        } else if (method === 'edit') {
          this.title = '修改报废信息'
        } else if (method === 'view') {
          this.title = '查看报废信息'
        }
        this.attachArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.bgxtGdzcBfTab = '0'
          this.inputForm.bgxtGdzcBfInfoList = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/zcbf/bgxtGdzcBf/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcBf)
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
      saveBgxtGdzcBfInfoRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtGdzcBfInfoList.push(child[1])
        } else {
          this.inputForm.bgxtGdzcBfInfoList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtGdzcBfInfoList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtGdzcBfInfoRow (child) {
        this.$refs.bgxtGdzcBfInfoForm.init('add')
      },
      viewBgxtGdzcBfInfoRow (child) {
        this.$refs.bgxtGdzcBfInfoForm.init('view', child)
      },
      editBgxtGdzcBfInfoRow (child) {
        this.$refs.bgxtGdzcBfInfoForm.init('edit', child)
      },
      delBgxtGdzcBfInfoRow (child) {
        this.inputForm.bgxtGdzcBfInfoList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtGdzcBfInfoList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtGdzcBfInfoList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/zcbf/bgxtGdzcBf/save`,
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
