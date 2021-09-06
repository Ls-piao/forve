<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="分类名称" prop="name"
                :rules="[
                  {required: true, message:'分类名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写分类名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="部门成员" prop="deptIds.id"
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
                      :value="inputForm.deptIds.id"
                      :clearable="true"
                      :accordion="true"
                      :show-checkbox="true"
                      @getValue="(value) => {inputForm.deptIds.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="角色成员" prop="roleIds"
                :rules="[
                 ]">
<!--              <el-input v-model="inputForm.roleIds" placeholder="请填写角色成员"     ></el-input>-->
              <el-select v-model="inputForm.roleIds" style="width:100%" multiple placeholder="请选择">
                <el-option
                  v-for="role in roleList"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="用户成员" prop="user.id"
                :rules="[
                 ]">
                <user-select  :value="inputForm.user.id" @getValue='(value) => {inputForm.user.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="分类序号" prop="sort"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sort" placeholder="请填写分类序号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="分类说明" prop="remark"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remark" placeholder="请填写分类说明"     ></el-input>
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
  import {isNull} from 'xe-utils'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        roleList: [],
        isNull,
        inputForm: {
          id: '',
          name: '',
          deptIds: {
            id: ''
          },
          roleIds: [],
          user: {
            id: ''
          },
          sort: '',
          remark: ''
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
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建协作分类`
        } else if (method === 'edit') {
          this.title = '修改协作分类'
        } else if (method === 'view') {
          this.title = '查看协作分类'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$http({
            url: `/sys/role/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.roleList = data.page.list
          })
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xzgl/xzfl/xzfl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xzfl)
              this.inputForm.roleIds = this.inputForm.roleIds.split(',')
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
            this.inputForm.roleIds = this.inputForm.roleIds.toString()
            this.$http({
              url: `/xzgl/xzfl/xzfl/save`,
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
