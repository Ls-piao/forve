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
          <el-form-item label="考勤人员" prop="checkUser.id"
                        :rules="[
                  {required: true, message:'考勤人员不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' :value="inputForm.checkUser.id" @getValue='(value) => {inputForm.checkUser.id=value}'></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考勤类别" prop="flbh.id"
                        :rules="[
                  {required: true, message:'考勤类别不能为空', trigger:'blur'}
                 ]">
            <SelectTree
              ref="flbh"
              :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"

              url="/xckqglkqfl/xcKqglKqfl/treeData"
              :value="inputForm.flbh.id"
              :clearable="true"
              :accordion="true"
              @getValue="(value) => {inputForm.flbh.id=value}"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="dataStart"
                        :rules="[
                  {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              style="width: 100%;"
              v-model="inputForm.dataStart"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="dateEnd"
                        :rules="[
                  {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              style="width: 100%;"
              v-model="inputForm.dateEnd"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="考勤情况" prop="checkWork"
                :rules="[
                  {required: true, message:'考勤情况不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.kqState" placeholder="请填写考勤情况"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原因说明" prop="content"
                        :rules="[
                 ]">
            <el-input v-model="inputForm.content" placeholder="请填写原因说明"     ></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="状态" prop="state"-->
<!--                        :rules="[-->
<!--                 ]">-->
<!--            <el-input v-model="inputForm.state" placeholder="请填写状态"     ></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
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
  import UserSelect from '@/components/userSelect'
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
          state: '',
          content: '',
          dateEnd: '',
          dataStart: '',
          kqState: '',
          checkUser: {
            id: ''
          },
          checkWork: '',
          flbh: {
            id: ''
          },
          remarks: ''
        }
      }
    },
    components: {
      UserSelect,
      SelectTree
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建考勤记录`
        } else if (method === 'edit') {
          this.title = '修改考勤记录'
        } else if (method === 'view') {
          this.title = '查看考勤记录'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/kqgl/kqjl/xcKqglKqjl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xcKqglKqjl)
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
              url: `/kqgl/kqjl/xcKqglKqjl/save`,
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
