<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="协作信息" name="first">
        <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
                label-width="120px">
          <el-row  :gutter="15">
            <el-col :span="24">
                <el-form-item label="协作主题" prop="name"
                    :rules="[
                      {required: true, message:'协作主题不能为空', trigger:'blur'}
                    ]">
                  <el-input v-model="inputForm.name" placeholder="请填写分类名称"     ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="协作分类" prop="fl.id"
                    :rules="[]">
                  <el-select v-model="inputForm.fl.id" style="width:100%" placeholder="请选择">
                    <el-option
                      v-for="xzfl in flList"
                      :key="xzfl.id"
                      :label="xzfl.name"
                      :value="xzfl.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="协作类型" prop="type"
                :rules="[
                      {required: true, message:'协作类型不能为空', trigger:'blur'}
                    ]">
                <el-select v-model="inputForm.type" placeholder="协作类型"  style="width: 100%;">
                    <el-option
                      v-for="item in this.$dictUtils.getDictList('XZ_TYPE')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>  
            <el-col :span="24">
                <el-form-item label="协作负责人" prop="fzr.id"
                    :rules="[
                      {required: true, message:'协作负责人不能为空', trigger:'blur'}
                    ]">
                    <user-select :limit='1' :readonly="true" :value="inputForm.fzr.id" @getValue='(value) => {inputForm.fzr.id=value}'></user-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="部门成员" prop="deptIds"
                    :rules="[
                    ]">
              <SelectTree
                          ref="deptIds"
                          :props="{
                              value: 'id',             // ID字段名
                              label: 'name',         // 显示名称
                              children: 'children'    // 子级字段名
                            }"
                          url="/sys/office/treeData?type=2"
                          :value="inputForm.deptIds"
                          :clearable="true"
                          :accordion="true"
                          :show-checkbox="true"
                          @getValue="(value) => {inputForm.deptIds=value}"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="角色成员" prop="roleIdList"
                    :rules="[]">
                  <el-select v-model="inputForm.roleIdList" style="width:100%" multiple placeholder="请选择">
                    <el-option
                      v-for="role in roleList"
                      :key="role.id"
                      :label="role.name"
                      :value="role.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="用户成员" prop="userIds"
                    :rules="[
                    ]">
                    <user-select :readonly="true"  :value="inputForm.userIds" @getValue='(value) => {inputForm.userIds=value}'></user-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="开始时间" prop="start"
                    :rules="[
                      {required: true, message:'开始时间不能为空', trigger:'blur'}]">
                    <el-date-picker
                    v-model="inputForm.start"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    @change="handelStart">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="结束时间" prop="end"
                    :rules="[
                      {required: true, message:'结束时间不能为空', trigger:'blur'}]">
                  <el-date-picker
                    v-model="inputForm.end"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    @change="handelEnd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="协作描述" prop="remark"
                    :rules="[
                    ]">
              <el-input type="textarea" v-model="inputForm.remark" placeholder="请填写协作描述"     ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="附件" prop="fileUrl"
                              :rules="[]">
                  <el-upload ref="fileUrl"
                            v-if="visible"
                            :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
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
      </el-tab-pane>
      <el-tab-pane v-if="method === 'edit' || method === 'view'" label="协作发言" name="second">
        <xzfy-list ref="XzfyList"></xzfy-list>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
      <el-button size="small" type="success" v-if="method == 'edit' && this.inputForm.state == '0'" @click="wc()">完成协作</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import XzfyList from '../xzfy/XzfyList'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import UserSelect from '@/components/userSelect'
  import { isNull } from 'xe-utils'
  export default {
    data () {
      return {
        title: '',
        method: '',
        activeName: 'first',
        visible: false,
        loading: false,
        roleList: [],
        flList: [],
        fileUrlArra: [],
        inputForm: {
          id: '',
          name: '',
          type: '',
          fl: {
            id: '',
            name: ''
          },
          fzr: {
            id: '',
            name: ''
          },
          deptIds: '',
          roleIds: '',
          roleIdList: [],
          userIds: '',
          start: null,
          end: null,
          remark: '',
          fileUrl: '',
          fileName: '',
          state: ''
        }
      }
    },
    components: {
      SelectTree,
      UserSelect,
      XzfyList
    },
    methods: {
      init (method, id) {
        this.fileUrlArra = []
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建协作信息`
        } else if (method === 'edit') {
          this.title = '修改协作信息'
        } else if (method === 'view') {
          this.title = '查看协作信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$http({
            url: `/sys/role/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.roleList = data.page.list
          })
          this.$http({
            url: `/xzgl/xzfl/xzfl/listForCheck?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.flList = data.page.list
          })
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xzgl/xzxx/xzxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xzxx)
              this.inputForm.roleIdList = this.inputForm.roleIds.split(',')
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
              this.$refs.XzfyList.xzId = this.inputForm.id
              this.$refs.XzfyList.refreshList()
              this.loading = false
            })
          }
        })
      },
      handelStart (value) {
        if (!isNull(this.inputForm.end) && value > this.inputForm.end) {
          this.inputForm.start = null
          this.$message.error('开始时间不能大于结束时间')
        }
      },
      handelEnd (value) {
        if (!isNull(this.inputForm.start) && value < this.inputForm.start) {
          this.inputForm.end = null
          this.$message.error('结束时间不能小于开始时间')
        }
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          this.inputForm.roleIds = this.inputForm.roleIdList.toString()
          if (valid) {
            this.loading = true
            this.$http({
              url: `/xzgl/xzxx/xzxx/save`,
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
    },
    // 协作完成
    wc () {
      this.$refs['inputForm'].validate((valid) => {
        this.inputForm.roleIds = this.inputForm.roleIdList.toString()
        this.inputForm.state = '1'
        if (valid) {
          this.loading = true
          this.$http({
            url: `/xzgl/xzxx/xzxx/wc`,
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
</script>