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
            <el-form-item label="资产ID" prop="zc.id"
                :rules="[
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
            <el-form-item label="维修ID" prop="wx.id"
                :rules="[
                 ]">
                <el-select v-model="inputForm.wx.id" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('WXJG')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="维修价格" prop="wxjg"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wxjg" placeholder="请填写维修价格"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="维修费用" prop="wxfy"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wxfy" placeholder="请填写维修费用"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="维修完成时间" prop="wxwcDate"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wxwcDate" placeholder="请填写维修完成时间"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="费用分担情况" prop="fyfdqk"
                :rules="[
                 ]">
              <el-input v-model="inputForm.fyfdqk" placeholder="请填写费用分担情况"     ></el-input>
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
        inputForm: {
          id: '',
          zc: {
            id: ''
          },
          wx: {
            id: ''
          },
          wxjg: '',
          wxfy: '',
          wxwcDate: '',
          fyfdqk: '',
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
          this.title = `新建固定资产维修明细表`
        } else if (method === 'edit') {
          this.title = '修改固定资产维修明细表'
        } else if (method === 'view') {
          this.title = '查看固定资产维修明细表'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = ''
          this.oldInputForm = ''
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.oldInputForm = obj
            this.inputForm = JSON.parse(JSON.stringify(obj))
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