<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    width="27.5%"
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px" class="formClass">
      <el-row  :gutter="10">
        <el-col :span="24">
            <el-form-item label="分类名称" prop="name"
                :rules="[
                  {required: true, message:'分类名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写分类名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="使用状态" prop="flState"
                :rules="[
                  {required: true, message:'使用状态不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.flState" style="width: 100%">
                <el-option v-for="item in $dictUtils.getDictList('FLSYZT')" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="上级分类" prop="parent.id"
                :rules="[
                 ]">
                <SelectTree
                      ref="parent"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"
                      v-if="visible"
                      :url="`/xckqglkqfl/xcKqglKqfl/treeData?extId=${inputForm.id}`"
                      :value="inputForm.parent.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.parent.id=value}"/>
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
      <el-button size="small" type="primary" v-if="method !== 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
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
        inputForm: {
          id: '',
          name: '',
          flState: '',
          remarks: '',
          parent: {
            id: '',
            name: ''
          }
        }
      }
    },
    components: {
      SelectTree
    },
    methods: {
      init (method, obj) {
        this.method = method
        this.inputForm.id = obj.id
        if (method === 'add') {
          this.title = '新建考勤分类'
        } else if (method === 'addChild') {
          this.title = '添加下级考勤分类'
        } else if (method === 'edit') {
          this.title = '修改考勤分类'
        } else if (method === 'view') {
          this.title = '查看考勤分类'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.parent.id = obj.parent.id
          this.inputForm.parent.name = obj.parent.name
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xckqglkqfl/xcKqglKqfl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xcKqglKqfl)
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
              url: `/xckqglkqfl/xcKqglKqfl/save`,
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

<style>
.formClass {
  margin-left: -40px;
}
</style>
