<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    v-dialogDrag
    width="35%"
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
          <el-form-item label="考勤分类" prop="flbh.id"
                        :rules="[
                  {required: true, message:'考勤分类不能为空', trigger:'blur'}
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
              :disabled="inputForm.id === '1'"
              @getValue="(value) => {inputForm.flbh.id=value}"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--            <el-form-item label="规则使用情况" prop="gzState"-->
<!--                :rules="[-->
<!--                  {required: true, message:'规则使用情况不能为空', trigger:'blur'}-->
<!--                 ]">-->
<!--                <el-select v-model="inputForm.gzState" placeholder="请选择"  style="width: 100%;">-->
<!--                          <el-option-->
<!--                            v-for="item in $dictUtils.getDictList('GZSYZT')"-->
<!--                            :key="item.value"-->
<!--                            :label="item.label"-->
<!--                            :value="item.value">-->
<!--                          </el-option>-->
<!--                      </el-select>-->
<!--           </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="24">
            <el-form-item label="开始时间" prop="dateStart"
                :rules="[
                  {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
              <el-date-picker
                style="width: 100%;"
                v-model="inputForm.dateStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
                :picker-options="editStartOptions">
              </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="结束时间" prop="dateEnd"
                :rules="[
                  {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
                <el-time-picker
                      style="width: 100%;"
                      v-model="inputForm.dateEnd"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm"
                      :picker-options="editStopOptions"
                      placeholder="结束时间">
                    </el-time-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="规则说明" prop="content"
                :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.content" placeholder="请填写规则说明"     ></el-input>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--            <el-form-item label="备注信息" prop="remarks"-->
<!--                :rules="[-->
<!--                 ]">-->
<!--          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"     ></el-input>-->
<!--           </el-form-item>-->
<!--        </el-col>-->
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
      inputForm: {
        id: '',
        flbh: {
          id: ''
        },
        gzState: '',
        dateStart: '',
        dateEnd: '',
        content: '',
        remarks: ''
      },
      editStartOptions: {
        disabledDate: time => {
          if (!this.inputForm.dateEnd) {
            return time.getTime() < new Date(1970 - 1 - 1).getTime()
          } else {
            return time.getTime() > new Date(this.inputForm.dateEnd)
          }
        }
      },
      editStopOptions: {
        disabledDate: time => {
          return (
            time.getTime() < new Date(this.inputForm.dateStart) ||
            time.getTime() < new Date(1970 - 1 - 1).getTime()    // 禁止选择1970年以前的日期
          )
        }
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
        this.title = `新建考勤规则`
      } else if (method === 'edit') {
        this.title = '修改考勤规则'
      } else if (method === 'view') {
        this.title = '查看考勤规则'
      }
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.loading = true
          this.$http({
            url: `/xckqglkqgz/xcKqglKqgz/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.xcKqglKqgz)
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
          this.inputForm.gzState = '2'  // 发生更改即为未发布
          this.$http({
            url: `/xckqglkqgz/xcKqglKqgz/save`,
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
