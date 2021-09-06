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
            <el-form-item label="记录状态" prop="jlzt"
                :rules="[
                 ]">
                <el-select v-model="inputForm.jlzt" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('SGZT')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申购单号" prop="sgdh"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sgdh" placeholder="请填写申购单号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="设备来源" prop="sbly"
                :rules="[
                 ]">
                <el-select v-model="inputForm.sbly" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('SBLY')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产总价" prop="zczj"
                :rules="[
                 ]">
              <el-input v-model="inputForm.zczj" placeholder="请填写资产总价"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申购日期" prop="sgrq"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.sgrq"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申购人" prop="sgr"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sgr" placeholder="请填写申购人"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申购部门" prop="sbbm"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sbbm" placeholder="请填写申购部门"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申购原因" prop="sgyy"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sgyy" placeholder="请填写申购原因"     ></el-input>
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
            <el-tabs v-model="bgxtGdzcSgTab">
            <el-tab-pane label="申购计划明细表">
                  <el-button size="small" @click="addBgxtGdzcSgInfoRow" type="primary">新增</el-button>
                  <el-table
                  class="table"
                  size="small"
                  :data="inputForm.bgxtGdzcSgInfoList.filter(function(item){ return item.delFlag !== '1'})"
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
                    prop="sqsl"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="申请数量">
                  </el-table-column>
                <el-table-column
                    prop="money"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="金额(元)">
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
                      <el-button @click="viewBgxtGdzcSgInfoRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtGdzcSgInfoRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtGdzcSgInfoRow(scope.row)" type="text" size="small">删除</el-button>
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
  <BgxtGdzcSgInfoForm ref="bgxtGdzcSgInfoForm" @addRow="saveBgxtGdzcSgInfoRow(arguments)"></BgxtGdzcSgInfoForm>
</div>
</template>

<script>
  import BgxtGdzcSgInfoForm from './BgxtGdzcSgInfoForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        bgxtGdzcSgTab: '0',
        inputForm: {
          id: '',
          bgxtGdzcSgInfoList: [],
          jlzt: '',
          sgdh: '',
          sbly: '',
          zczj: '',
          sgrq: '',
          sgr: '',
          sbbm: '',
          sgyy: '',
          remarks: ''
        }
      }
    },
    components: {
      BgxtGdzcSgInfoForm
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.title = `新建申购计划`
        } else if (method === 'edit') {
          this.title = '修改申购计划'
        } else if (method === 'view') {
          this.title = '查看申购计划'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.bgxtGdzcSgTab = '0'
          this.inputForm.bgxtGdzcSgInfoList = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/zcsg/bgxtGdzcSg/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcSg)
              this.loading = false
            })
          }
        })
      },
      saveBgxtGdzcSgInfoRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtGdzcSgInfoList.push(child[1])
        } else {
          this.inputForm.bgxtGdzcSgInfoList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtGdzcSgInfoList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtGdzcSgInfoRow (child) {
        this.$refs.bgxtGdzcSgInfoForm.init('add')
      },
      viewBgxtGdzcSgInfoRow (child) {
        this.$refs.bgxtGdzcSgInfoForm.init('view', child)
      },
      editBgxtGdzcSgInfoRow (child) {
        this.$refs.bgxtGdzcSgInfoForm.init('edit', child)
      },
      delBgxtGdzcSgInfoRow (child) {
        this.inputForm.bgxtGdzcSgInfoList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtGdzcSgInfoList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtGdzcSgInfoList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/zcsg/bgxtGdzcSg/save`,
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
