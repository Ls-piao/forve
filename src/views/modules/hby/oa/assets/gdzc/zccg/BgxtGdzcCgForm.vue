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
            <el-form-item label="采购单号" prop="cgdh"
                :rules="[
                         {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.cgdh" placeholder="请填写采购单号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="采购日期" prop="cgDate"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.cgDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="采购人" prop="cgPeople.id"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.cgPeople.id" @getValue='(value) => {inputForm.cgPeople.id=value}'></user-select>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
            <el-form-item label="申购ID" prop="sg.id"
                :rules="[
                 ]">
          <GridSelect
            title="选择申购ID"
            labelName = 'id'
            labelValue = 'id'
            :value = "inputForm.sg.id"
            :limit="1"
            @getValue='(value) => {inputForm.sg.id=value}'
            :columns="[
            {
              prop: 'id',
              label: '主键'
            }
            ]"
            :searchs="[
            {
              prop: 'id',
              label: '主键'
            }
            ]"
            dataListUrl="/zcsg/bgxtGdzcSg/list"
            entityBeanName="bgxtGdzcSg"
            queryEntityUrl="/zcsg/bgxtGdzcSg/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="资产总价" prop="zczj"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zczj" placeholder="请填写资产总价"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="attach"
                :rules="[
                 ]">
              <el-upload ref="attach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zccg/bgxtGdzcCg`"
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
            <el-tabs v-model="bgxtGdzcCgTab">
            <el-tab-pane label="采购明细表">
                  <el-button size="small" @click="addBgxtGdzcCgInfoRow" type="primary">新增</el-button>
                  <el-table
                  class="table"
                  size="small"
                  :data="inputForm.bgxtGdzcCgInfoList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="zcmc"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产名称">
                  </el-table-column>
                <el-table-column
                    prop="zcxh"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产型号">
                  </el-table-column>
                <el-table-column
                    prop="zcgg"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产规格">
                  </el-table-column>
                <el-table-column
                    prop="sgNum"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="申购数量">
                  </el-table-column>
                <el-table-column
                    prop="cgNum"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="采购数量">
                  </el-table-column>
                <el-table-column
                    prop="dj"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="单价">
                  </el-table-column>
                <el-table-column
                    prop="money"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="金额(元)">
                  </el-table-column>
                  <el-table-column
                    prop="gys.name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="供应商ID">
                  </el-table-column>
                <el-table-column
                    prop="ghDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="供货日期">
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
                      <el-button v-show="scope.row.sgNum == null " @click="viewBgxtGdzcCgInfoRow(scope.row)"  type="text" size="small">查看</el-button>
                      <el-button v-show="scope.row.sgNum == null "  @click="editBgxtGdzcCgInfoRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtGdzcCgInfoRow(scope.row)" type="text" size="small">删除</el-button>
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
  <BgxtGdzcCgInfoForm ref="bgxtGdzcCgInfoForm" @addRow="saveBgxtGdzcCgInfoRow(arguments)"></BgxtGdzcCgInfoForm>
</div>
</template>

<script>
  import BgxtGdzcCgInfoForm from './BgxtGdzcCgInfoForm'
  import UserSelect from '@/components/userSelect'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        bgxtGdzcCgTab: '0',
        attachArra: [],
        inputForm: {
          id: '',
          bgxtGdzcCgInfoList: [],
          jlzt: '',
          cgdh: '',
          cgDate: '',
          cgPeople: {
            id: ''
          },
/*          sg: {
            id: ''
          }, */
          zczj: '',
          attach: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect,
      GridSelect,
      BgxtGdzcCgInfoForm
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.title = `新建采购`
        } else if (method === 'edit') {
          this.title = '修改采购'
        } else if (method === 'view') {
          this.title = '查看采购'
        }
        this.attachArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.bgxtGdzcCgTab = '0'
          this.inputForm.bgxtGdzcCgInfoList = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/zccg/bgxtGdzcCg/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcCg)
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
      saveBgxtGdzcCgInfoRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtGdzcCgInfoList.push(child[1])
        } else {
          this.inputForm.bgxtGdzcCgInfoList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtGdzcCgInfoList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtGdzcCgInfoRow (child) {
        this.$refs.bgxtGdzcCgInfoForm.init('add')
      },
      viewBgxtGdzcCgInfoRow (child) {
        this.$refs.bgxtGdzcCgInfoForm.init('view', child)
      },
      editBgxtGdzcCgInfoRow (child) {
        this.$refs.bgxtGdzcCgInfoForm.init('edit', child)
      },
      delBgxtGdzcCgInfoRow (child) {
        this.inputForm.bgxtGdzcCgInfoList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtGdzcCgInfoList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtGdzcCgInfoList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/zccg/bgxtGdzcCg/save`,
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
