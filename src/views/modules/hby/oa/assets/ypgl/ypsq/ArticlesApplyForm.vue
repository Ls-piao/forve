<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="8">
            <el-form-item label="申请人" prop="applyUser"
                :rules="[
                  {required: true, message:'申请人不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.applyUser" @getValue='(value) => {inputForm.applyUser=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所属单位" prop="applyOffice"
                :rules="[
                 ]">
              <el-input v-model="inputForm.applyOffice" readonly placeholder="请填写所属单位"  class="paperview-input-text"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所属部门" prop="applyDept"
                :rules="[
                 ]">
              <el-input v-model="inputForm.applyDept" readonly placeholder="请填写所属部门"  class="paperview-input-text"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="8">
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
        </el-col>
        <el-col :span="8">
          <el-form-item label="附件" prop="enclosure"
                        :rules="[
                 ]">
            <el-upload ref="enclosure"
                       v-if="visible"
                       class="upload-demo"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/ypsp/artilcesApply`"
                       :headers="{token: $cookie.get('token')}"
                       :on-success="(response, file, fileList) => {
                          inputForm.enclosure = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                       }"
                       :on-remove="(file, fileList) => {
                          $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                            $message.success(data.msg)
                          })
                          inputForm.enclosure = fileList.map(item => item.url).join('|')
                        }"
                       :before-remove="(file, fileList) => {
                          return $confirm(`确定移除 ${file.name}？`)
                        }"
                       multiple
                       :limit="5"
                       :on-exceed="(files, fileList) =>{
                          $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                        }"
                       :file-list="enclosureArray">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="申请说明" prop="applyContent"
                :rules="[
                  {required: true, message:'申请说明不能为空', trigger:'blur'}
                 ]">
          <el-input type="textarea" v-model="inputForm.applyContent" placeholder="请填写申请说明" :rows="6"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider content-position="center">申领用品</el-divider>
          <el-form-item label-width="0">
                <el-button size="small" v-if="!formReadOnly" @click="addArticlesApplyDetailsRow">新增</el-button>
                <el-table
                  class="table"
                  size="small"
                  :data="tableData.articlesApplyDetailsList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                  <el-table-column
                    prop="code"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="用品编码">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.code" readonly class="paperview-input-text"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="用品名称">
                    <template slot-scope="scope">
                      <articles-select :value="scope.row.id" :excludedData="tableData.articlesApplyDetailsList" @getValue='(value) =>{setArticlesApplyDetailsList(value)}'></articles-select>
                    </template>
                </el-table-column>
                  <el-table-column
                    prop="unit"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="计量单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.unit" readonly class="paperview-input-text">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="articles.name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="类型">
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="数量">
                    <template slot="header">
                      <p>
                        <span style="color:red;font-size:16px;">*</span>数量
                      </p>
                    </template>
                    <template slot-scope="scope">
                        <el-input-number v-model.number="scope.row.num" type="number" :min="1"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="enclosure"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="图片">
                    <template slot-scope="scope">
                      <img :src="scope.row.enclosure === ''?'/static/img/default.png':scope.row.enclosure" style="height:35px"/>
                    </template>
                  </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  v-if="!formReadOnly"
                  :key="Math.random()"
                  width="150">
                  <template slot-scope="scope">
                    <el-button  @click="delArticlesApplyDetailsRow(scope)" type="text" size="small">删除</el-button>
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
  import ArticlesSelect from '@/views/modules/hby/oa/assets/ypgl/ypsq/ArticlesSelectIndex'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        visible: false,
        enclosureArray: [],
        inputForm: {
          id: '',
          applyUser: '',
          applyOffice: '',
          applyDept: '',
          applyDate: '',
          applyContent: '',
          remarks: '',
          enclosure: '',
          articlesApplyDetailsList: []
        },
        tableData: {
          articlesApplyDetailsList: []
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
      ArticlesSelect
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
      'inputForm.applyUser': {
        handler (newVal) {
          if (this.inputForm.applyUser) {
            this.$nextTick(() => {
              this.$http({
                url: '/sys/user/queryById',
                method: 'get',
                params: {id: newVal}
              }).then(({data}) => {
                if (data.success) {
                  this.inputForm.applyOffice = data.user.company.name
                  this.inputForm.applyDept = data.user.office.name
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
          this.enclosureArray = []
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/ypgl/ypsq/articlesApply/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              let detailsList = data.articlesApply.articlesApplyDetailsList
              detailsList.forEach((item) => {
                this.tableData.articlesApplyDetailsList.push({
                  id: item.articlesId.id,
                  code: item.articlesId.code,
                  unit: item.articlesId.unit,
                  articles: {
                    name: item.articlesId.articles.name
                  },
                  enclosure: item.articlesId.enclosure,
                  num: item.num
                })
              })
              this.inputForm = this.recover(this.inputForm, data.articlesApply)
              this.inputForm.enclosure.split('|').forEach((item) => {
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
            if (this.tableData.articlesApplyDetailsList.length === 0) {
              this.$message.error('请选择物品')
              return
            }
            // 物品数量为空校验
            this.tableData.articlesApplyDetailsList.forEach((item) => {
              if (item.num === 0) {
                this.$message.error('请输入物品')
              }
            })
            // 发起申请时没有id  给id 赋值
            if (this.inputForm.articlesApplyDetailsList.length === 0) {
              let realDateList = []
              this.tableData.articlesApplyDetailsList.forEach((item) => {
                let details = {
                  id: '',
                  articlesId: {
                    id: item.id
                  },
                  num: item.num
                }
                realDateList.push(details)
              })
              this.inputForm.articlesApplyDetailsList = realDateList
            }
            this.loading = true
            this.$http({
              url: `/ypgl/ypsq/articlesApply/save`,
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
      addArticlesApplyDetailsRow () {
        let list = {
          id: '',
          code: '',
          name: '',
          unit: '',
          articles: {
            name: ''
          },
          num: 1,
          enclosure: ''
        }
        this.tableData.articlesApplyDetailsList.unshift(list)
      },
      // 删除行
      delArticlesApplyDetailsRow (row) {
        this.tableData.articlesApplyDetailsList.splice(row.$index, 1)
      },
      setArticlesApplyDetailsList (val) {
        val.forEach((item) => {
          let list = {
            id: item.id,
            code: item.code,
            name: item.name,
            unit: item.unit,
            articles: {
              name: item.articles.name
            },
            num: 1,
            enclosure: item.enclosure
          }
          this.tableData.articlesApplyDetailsList.push(list)
        })
        // 去除表单因为点击新增出现的空白行
        this.tableData.articlesApplyDetailsList = this.tableData.articlesApplyDetailsList.filter(function (s) {
          if (s.id) {
            return s
          }
        })
      },
      handlePreview () {

      }
    }
  }
</script>

<style scoped>
.paperview-input-text >>> .el-input__inner {
  -webkit-appearance: none;
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 0;
  width: 100%;
}
</style>
