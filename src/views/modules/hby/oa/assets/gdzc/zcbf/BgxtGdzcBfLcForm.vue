<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="8">
          <el-form-item label="报废编号" prop="bfNo"
                        :rules="[
                  {required: true, message:'报废编号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.bfNo" placeholder="请填写报废编号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="申请人" prop="sqr"
                :rules="[
                  {required: true, message:'申请人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.sqr.id" @getValue='(value) => {inputForm.sqr.id=value}' :readonly="true"></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所属单位" prop="office"
                :rules="[
                 ]">
              <el-input v-model="inputForm.office" readonly placeholder="请填写所属单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所属部门" prop="dept"
                :rules="[
                 ]">
              <el-input v-model="inputForm.dept" readonly placeholder="请填写所属部门"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经办人" prop="jbr"
                        :rules="[
                  {required: true, message:'经办人不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' :value="inputForm.jbr.id" @getValue='(value) => {inputForm.jbr.id=value}' :readonly="true"></user-select>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">
            <el-form-item label="申请日期" prop="applyDate"
                :rules="[
                  {required: true, message:'申请日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.applyDate"
                      type="date"
                      style="width: 100%;"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="报废原因" prop="bfContent"
                        :rules="[
                  {required: true, message:'报废原因不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.bfContent" placeholder="请填写报废原因"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="附件" prop="attach"
                        :rules="[
                 ]">
            <el-upload ref="attach"
                       v-if="visible"
                       class="upload-demo"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/ypsp/artilcesApply`"
                       :headers="{token: $cookie.get('token')}"
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
                       :file-list="attachArray">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
       <el-col :span="24">
          <el-divider content-position="center">添加报废资产</el-divider>
          <el-form-item label-width="0">
                <el-button size="small" v-if="!formReadOnly" @click="addBfApplyDetailsRow">新增</el-button>
                <el-table
                  class="table"
                  size="small"
                  :data="tableData.bgxtGdzcBfInfoList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                  <el-table-column
                    prop="zc.id"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产名称"
                    :render-header="addRedStar">
                    <template slot-scope="scope">
                      <zc-select :fzr='fzr' :limit='1' :value="scope.row.zc.id" :excludedData="tableData.bgxtGdzcBfInfoList"  @getValue='(value) =>{setbgxtGdzcBfInfoList(value)}'></zc-select>
                    </template>
                </el-table-column>
                  <el-table-column
                    prop="clfs"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="处理方式">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.clfs" placeholder="请选择"  style="width: 100%;">
                        <el-option
                          v-for="item in $dictUtils.getDictList('ZCBW_CLFS')"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="clDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="处理日期">
                    <template slot-scope="scope">
                      <el-date-picker
                        style="width: 100%;"
                        v-model="scope.row.clDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="czje"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="残值金额(元)">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.czje" :precision="2"></el-input-number>
                    </template>
                  </el-table-column>
<!--                  <el-table-column
                    prop="attach"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="附件">
                    <template slot-scope="scope">
                      <img :src="scope.row.attach === ''?'/static/img/default.png':scope.row.attach" style="height:35px"/>
                    </template>
                  </el-table-column>-->
                <el-table-column
                  fixed="right"
                  label="操作"
                  v-if="!formReadOnly"
                  :key="Math.random()"
                  width="150">
                  <template slot-scope="scope">
                    <el-button  @click="delBfApplyDetailsRow(scope)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
                </el-table>
          </el-form-item>
        </el-col>
        </el-row>
    </el-form>
</div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import ZcSelect from '@/views/modules/hby/oa/assets/gdzc/zcjl/BgxtZcIndex'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        visible: false,
        attachArray: [],
        inputForm: {
          id: '',
          bfNo: '',
          sqr: {
            id: ''
          },
          office: '',
          dept: '',
          jbr: {
            id: ''
          },
          bfContent: '',
          remarks: '',
          attach: '',
          bgxtGdzcBfInfoList: []
        },
        fzr: this.$store.state.user.id,
        tableData: {
          bgxtGdzcBfInfoList: []
        }
      }
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      formReadOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      UserSelect,
      ZcSelect
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.visible = true
              this.$refs.inputForm.resetFields()
            })
          }
        },
        immediate: true,
        deep: false
      },
      // 监听用户选择器
      'inputForm.sqr.id': {
        handler (newVal) {
          if (this.inputForm.sqr.id) {
            this.$nextTick(() => {
              this.$http({
                url: '/sys/user/queryById',
                method: 'get',
                params: {id: newVal}
              }).then(({data}) => {
                if (data.success) {
                  this.inputForm.office = data.user.company.name
                  this.inputForm.dept = data.user.office.name
                }
              })
            })
          }
        }
      }
    },
    methods: {
      init (id) {
        if (id) {
          this.loading = true
          this.visible = true
          this.inputForm.id = id
          this.attachArray = []
          this.bgxtGdzcBfInfoList = []
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/zcbf/bgxtGdzcBf/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              let detailsList = data.bgxtGdzcBf.bgxtGdzcBfInfoList
              detailsList.forEach((item) => {
                this.tableData.bgxtGdzcBfInfoList.push({
                  id: item.bf.id,
                  zc: {
                    id: item.zc.id
                  },
                  clfs: item.clfs,
                  clDate: item.clDate,
                  czje: item.czje

                })
              })
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcBf)
              this.inputForm.attach.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.enclosureArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.loading = false
            })
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            // 未选择物品校验
            if (this.tableData.bgxtGdzcBfInfoList.length === 0) {
              this.$message.error('请选择资产')
              return
            }
            // 发起申请时没有id  给id 赋值
            if (this.inputForm.bgxtGdzcBfInfoList.length === 0) {
              let realDateList = []
              this.tableData.bgxtGdzcBfInfoList.forEach((item) => {
                let details = {
                  id: '',
                  bf: item.id,
                  zc: item.zc,
                  clfs: item.clfs,
                  clDate: item.clDate,
                  czje: item.czje
                }
                realDateList.push(details)
              })
              this.inputForm.bgxtGdzcBfInfoList = realDateList
            }
            this.loading = true
            this.$http({
              url: `/zcbf/bgxtGdzcBf/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      },
      // 添加新的一行表格
      addBfApplyDetailsRow () {
        let list = {
          id: '',
          zc: {
            id: ''
          },
          clfs: '',
          clDate: '',
          czje: ''

        }
        this.tableData.bgxtGdzcBfInfoList.unshift(list)
      },
      // 删除行
      delBfApplyDetailsRow (row) {
        this.tableData.bgxtGdzcBfInfoList.splice(row.$index, 1)
      },
      addRedStar (h, { column }) { // 给表头加必选标识
        return [h('span', { style: 'color: red' }, '*'), h('span', ' ' + column.label)]
      },
      setbgxtGdzcBfInfoList (val) {
        let list = {
          zc: {
            id: val
          }
        }
        this.tableData.bgxtGdzcBfInfoList.push(list)
        // 去除表单因为点击新增出现的空白行
        this.tableData.bgxtGdzcBfInfoList = this.tableData.bgxtGdzcBfInfoList.filter(function (s) {
          if (s.zc.id) {
            return s
          }
        })
      },
      handlePreview () {

      }
    }
  }
</script>
