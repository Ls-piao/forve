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
            <el-form-item label="申请人" prop="sqr.name"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sqr.name" placeholder="请填写申请人"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="部门" prop="dept"
                :rules="[
                 ]">
              <el-input v-model="inputForm.dept" placeholder="请填写部门"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单位" prop="office"
                :rules="[
                 ]">
              <el-input v-model="inputForm.office" placeholder="请填写单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="维修编号" prop="wxNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wxNo" placeholder="请填写维修编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="原价合计" prop="yjhj"
                :rules="[
                 ]">
              <el-input v-model="inputForm.yjhj" placeholder="请填写原价合计"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="atttach"
                :rules="[
                 ]">
              <el-upload ref="atttach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcwx/bgxtGdzcZcwx`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                    :on-success="(response, file, fileList) => {
                       inputForm.atttach = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.atttach = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="atttachArra">
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
            <el-tabs v-model="bgxtGdzcZcwxTab">
            <el-tab-pane label="固定资产维修明细表">
                  <el-button size="small" @click="addBgxtGdzcZcwxInfoRow" type="primary">新增</el-button>
                  <el-table
                  class="table"
                  size="small"
                  :data="inputForm.bgxtGdzcZcwxInfoList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                  <el-table-column
                    prop="zc.name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产ID">
                  </el-table-column>
                <el-table-column
                    prop="wxjg"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="维修价格">
                  </el-table-column>
                <el-table-column
                    prop="wxfy"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="维修费用">
                  </el-table-column>
                <el-table-column
                    prop="wxwcDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="维修完成时间">
                  </el-table-column>
                <el-table-column
                    prop="fyfdqk"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="费用分担情况">
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
                      <el-button @click="viewBgxtGdzcZcwxInfoRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtGdzcZcwxInfoRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtGdzcZcwxInfoRow(scope.row)" type="text" size="small">删除</el-button>
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
  <BgxtGdzcZcwxInfoForm ref="bgxtGdzcZcwxInfoForm" @addRow="saveBgxtGdzcZcwxInfoRow(arguments)"></BgxtGdzcZcwxInfoForm>
</div>
</template>

<script>
  import BgxtGdzcZcwxInfoForm from './BgxtGdzcZcwxInfoForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        bgxtGdzcZcwxTab: '0',
        atttachArra: [],
        inputForm: {
          id: '',
          bgxtGdzcZcwxInfoList: [],
          sqr: {
            id: ''
          },
          dept: '',
          office: '',
          wxNo: '',
          yjhj: '',
          atttach: '',
          remarks: ''
        }
      }
    },
    components: {
      BgxtGdzcZcwxInfoForm
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.title = `新建资产维修`
        } else if (method === 'edit') {
          this.title = '修改资产维修'
        } else if (method === 'view') {
          this.title = '查看资产维修'
        }
        this.atttachArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.bgxtGdzcZcwxTab = '0'
          this.inputForm.bgxtGdzcZcwxInfoList = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/zcwx/bgxtGdzcZcwx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcZcwx)
              this.inputForm.atttach.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.atttachArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.loading = false
            })
          }
        })
      },
      saveBgxtGdzcZcwxInfoRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtGdzcZcwxInfoList.push(child[1])
        } else {
          this.inputForm.bgxtGdzcZcwxInfoList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtGdzcZcwxInfoList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtGdzcZcwxInfoRow (child) {
        this.$refs.bgxtGdzcZcwxInfoForm.init('add')
      },
      viewBgxtGdzcZcwxInfoRow (child) {
        this.$refs.bgxtGdzcZcwxInfoForm.init('view', child)
      },
      editBgxtGdzcZcwxInfoRow (child) {
        this.$refs.bgxtGdzcZcwxInfoForm.init('edit', child)
      },
      delBgxtGdzcZcwxInfoRow (child) {
        this.inputForm.bgxtGdzcZcwxInfoList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtGdzcZcwxInfoList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtGdzcZcwxInfoList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/zcwx/bgxtGdzcZcwx/save`,
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
