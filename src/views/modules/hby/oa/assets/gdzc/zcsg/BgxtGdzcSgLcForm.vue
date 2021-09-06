<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="8">
          <el-form-item label="申购单号" prop="sgdh"
                        :rules="[
                  {required: true, message:'申购单号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.sgdh" placeholder="请填写申购单号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备来源" prop="sbly"
                        :rules="[
                  {required: true, message:'设备来源不能为空', trigger:'blur'}
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
        <el-col :span="8">
            <el-form-item label="申购人" prop="sgr"
                :rules="[
                  {required: true, message:'申购人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.sgr.id" @getValue='(value) => {inputForm.sgr=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所属部门" prop="sbbm"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sbbm" readonly placeholder="请填写所属部门"     ></el-input>
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
          <el-form-item label="申购原因" prop="sgyy"
                        :rules="[
                  {required: true, message:'申购原因不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.sgyy" placeholder="请填写申购原因"     ></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">
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
        </el-col>-->
       <el-col :span="24">
          <el-divider content-position="center">添加申购计划</el-divider>
          <el-form-item label-width="0">
                <el-button size="small" v-if="!formReadOnly" @click="addBfApplyDetailsRow">新增</el-button>
                <el-table
                  class="table"
                  size="small"
                  :data="tableData.bgxtGdzcSgInfoList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
<!--                  <el-table-column
                    prop="zc.id"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产">
                    <template slot-scope="scope">
                      <zc-select :limit='1' :value="scope.row.zc.id" :excludedData="tableData.bgxtGdzcSgInfoList"  @getValue='(value) =>{setbgxtGdzcSgInfoList(value)}'></zc-select>
                    </template>
                </el-table-column>-->
                  <el-table-column
                    prop="zcmc"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.zcmc"></el-input>
                    </template>
                  </el-table-column>

<!--                  <el-table-column
                    prop="wxwcDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="预计完成日期">
                    <template slot-scope="scope">
                      <el-date-picker
                        style="width: 100%;"
                        v-model="scope.row.wxwcDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                      </el-date-picker>
                    </template>
                  </el-table-column>-->
                  <el-table-column
                    prop="zcxh"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产型号">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.zcxh"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="zcgg"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产规格">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.zcgg"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sqsl"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="申请数量">
                    <template slot="header">
                      <p>
                        <span style="color:red;font-size:16px;">*</span>数量
                      </p>
                    </template>
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.sqsl" type="number" :min="1"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="money"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="资产金额(元)">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.money" :precision="2"></el-input-number>
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
    /*    attachArray: [], */
        inputForm: {
          id: '',
          sgdh: '',
          sbly: '',
          sgr: '',
          sbbm: '',
          sgyy: '',
          remarks: '',
  /*        attach: '', */
          bgxtGdzcSgInfoList: []
        },
        tableData: {
          bgxtGdzcSgInfoList: []
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
      'inputForm.sgr': {
        handler (newVal) {
          if (this.inputForm.sgr) {
            this.$nextTick(() => {
              this.$http({
                url: '/sys/user/queryById',
                method: 'get',
                params: {id: newVal}
              }).then(({data}) => {
                if (data.success) {
                  this.inputForm.sbbm = data.user.office.name
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
/*          this.attachArray = [] */
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/zcsg/bgxtGdzcSg/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              let detailsList = data.bgxtGdzcSg.bgxtGdzcSgInfoList
              detailsList.forEach((item) => {
                this.tableData.bgxtGdzcSgInfoList.push({
                  id: item.id,
                  zcmc: item.zcmc,
                  zcxh: item.zcxh,
                  zcgg: item.zcgg,
                  sqsl: item.sqsl,
                  money: item.money

                })
              })
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcSg)
/*              this.inputForm.attach.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.enclosureArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              }) */
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
            if (this.tableData.bgxtGdzcSgInfoList.length === 0) {
              this.$message.error('请选择资产')
              return
            }
            // 发起申请时没有id  给id 赋值
            if (this.inputForm.bgxtGdzcSgInfoList.length === 0) {
              let realDateList = []
              this.tableData.bgxtGdzcSgInfoList.forEach((item) => {
                let details = {
                  id: '',
                  zcmc: item.zcmc,
                  zcxh: item.zcxh,
                  zcgg: item.zcgg,
                  sqsl: item.sqsl,
                  money: item.money
                }
                realDateList.push(details)
              })
              this.inputForm.bgxtGdzcSgInfoList = realDateList
            }
            this.loading = true
            this.$http({
              url: `/zcsg/bgxtGdzcSg/save`,
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
          zcmc: '',
          zcxh: '',
          zcgg: '',
          sqsl: '',
          money: ''
        }
        this.tableData.bgxtGdzcSgInfoList.unshift(list)
      },
      // 删除行
      delBfApplyDetailsRow (row) {
        this.tableData.bgxtGdzcSgInfoList.splice(row.$index, 1)
      },
      setbgxtGdzcSgInfoList (val) {
        let list = {
          zc: {
            id: val
          }
        }
        this.tableData.bgxtGdzcSgInfoList.push(list)
        // 去除表单因为点击新增出现的空白行
        this.tableData.bgxtGdzcSgInfoList = this.tableData.bgxtGdzcSgInfoList.filter(function (s) {
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
