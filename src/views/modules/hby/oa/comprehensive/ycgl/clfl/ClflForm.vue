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
        <el-col :span="24">
          <el-form-item label="分类名称" prop="flmc" :rules="[{required: true, message:'分类名称不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.flmc" placeholder="请填写分类名称"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色" prop="roleIdList">
            <el-select v-model="inputForm.roleIdList" style="width:100%" multiple placeholder="请选择">
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.name"
                :value="role.id">
              </el-option>
            </el-select>
            <!-- <el-checkbox-group
              v-model="inputForm.roleIdList">
              <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
            </el-checkbox-group> -->
          </el-form-item>

        </el-col>
        <el-col :span=24>
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        roleList: [],
        inputForm: {
          id: '',
          syjs: [],
          flmc: '',
          remarks: '',
          roleIdList: []
        }
      }
    },
    components: {
      SelectTree
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建分类`
        } else if (method === 'edit') {
          this.title = '修改分类'
        } else if (method === 'view') {
          this.title = '查看分类'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$http({
            url: `/sys/role/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            console.log(data.page.list)
            this.roleList = data.page.list
          })
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/ycgl/clfl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.clfl)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$http({
          url: `/ycgl/clfl/flmcIsUse?flmc=${this.inputForm.flmc}&id=${this.inputForm.id}`,
          method: 'get'
        }).then(({data}) => {
          if (data.success === true) {
            this.$refs['inputForm'].validate((valid) => {
              if (valid) {
                this.loading = true
                this.inputForm.syjs = this.inputForm.roleIdList.join(',')
                this.$http({
                  url: `/ycgl/clfl/save`,
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
        })
      }
    }
  }
</script>
