<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    width="75%"
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
<!--        <el-col :span="8">
          <el-form-item label="资产名称" prop="name"
                        :rules="[
                  {required: true, message:'资产名称不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.name" placeholder="请填写资产名称"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计量单位" prop="unit"
                        :rules="[
                  {required: true, message:'计量单位不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.unit" placeholder="请填写计量单位"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="this.method!='add'">
          <el-form-item label="资产状态" prop="state"
                        :rules="[
                  {required: true, message:'资产状态不能为空', trigger:'blur'}
                 ]">
            <el-select v-model="inputForm.state" placeholder="请选择"  style="width: 100%;">
              <el-option
                v-for="item in $dictUtils.getDictList('zczt')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库日期" prop="warehousingDate"
                        :rules="[
                  {required: true, message:'入库日期不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              v-model="inputForm.warehousingDate"
              type="datetime"
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买日期" prop="buyDate"
                        :rules="[
                  {required: true, message:'购买日期不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              v-model="inputForm.buyDate"
              type="datetime"
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规则型号" prop="specificationModel"
                        :rules="[
                  {required: true, message:'规则型号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.specificationModel" placeholder="请填写规则型号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保修到期日" prop="bxDate"
                        :rules="[
                  {required: true, message:'保修到期日不能为空', trigger:'blur'}
                 ]">
            <el-date-picker
              v-model="inputForm.bxDate"
              type="datetime"
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保修联系人" prop="bxPerple.id"
                        :rules="[
                  {required: true, message:'保修联系人不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' :value="inputForm.bxPerple.id" @getValue='(value) => {inputForm.bxPerple.id=value}'></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任人" prop="responsibilityPeople.id"
                        :rules="[
                  {required: true, message:'责任人不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' :value="inputForm.responsibilityPeople.id" @getValue='(value) => {inputForm.responsibilityPeople.id=value}'></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="序列号" prop="serialNumber"
                        :rules="[
                  {required: true, message:'序列号不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.serialNumber" placeholder="请填写序列号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌" prop="brand"
                        :rules="[
                  {required: true, message:'品牌不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.brand" placeholder="请填写品牌"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片" prop="images"
                        :rules="[
                 ]">
            <el-upload ref="images"
                       v-if="visible"
                       list-type="picture-card"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcfl/bgxtGdzcInfo`"
                       :headers="{token: $cookie.get('token')}"
                       :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                       :on-success="(response, file, fileList) => {
                       inputForm.images = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                       :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.images = fileList.map(item => item.url).join('|')
                    }"
                       :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                       multiple
                       :limit="5"
                       :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                       :file-list="imagesArra">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="条形码" prop="txm"
                        :rules="[
                 ]">
            <el-upload ref="txm"
                       v-if="visible"
                       list-type="picture-card"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcfl/bgxtGdzcInfo`"
                       :headers="{token: $cookie.get('token')}"
                       :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                       :on-success="(response, file, fileList) => {
                       inputForm.txm = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                       :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.txm = fileList.map(item => item.url).join('|')
                    }"
                       :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                       multiple
                       :limit="5"
                       :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                       :file-list="txmArra">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="出厂日期" prop="ccDate"
                        :rules="[
                 ]">
            <el-date-picker
              v-model="inputForm.ccDate"
              type="datetime"
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放地址" prop="cfAddress"
                        :rules="[
                 ]">
            <el-input v-model="inputForm.cfAddress" placeholder="请填写存放地址"     ></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">
          <el-form-item label="供应商" prop="supplier.id"
                        :rules="[
                 ]">
            <GridSelect
              title="选择供应商"
              labelName = 'name'
              labelValue = 'id'
              :value = "inputForm.supplier.id"
              :limit="1"
              @getValue='(value) => {inputForm.supplier.id=value}'
              :columns="[
            {
              prop: 'id',
              label: '主键'
            },
            {
              prop: 'name',
              label: '供应商全称'
            }
            ]"
              :searchs="[
            {
              prop: 'id',
              label: '主键'
            },
            {
              prop: 'name',
              label: '供应商全称'
            }
            ]"
              dataListUrl="/gysgl/supplier/list"
              entityBeanName="supplier"
              queryEntityUrl="/gysgl/supplier/queryById">
            </GridSelect>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="合同号" prop="htNum"
                        :rules="[
                 ]">
            <el-input v-model="inputForm.htNum" placeholder="请填写合同号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票号" prop="fpNum"
                        :rules="[
                 ]">
            <el-input v-model="inputForm.fpNum" placeholder="请填写发票号"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产原值(元)" prop="zczyz"
                        :rules="[
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.zczyz" placeholder="请填写资产原值"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产净值(元)" prop="zczjz"
                        :rules="[
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.zczjz" placeholder="请填写资产净值"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="attach"
                :rules="[
                 ]">
              <el-upload ref="attach"
                    v-if="visible"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/zcfl/bgxtGdzcInfo`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
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
                    :file-list="attachArra">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">添加相关附件</div>
                  </el-upload>
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
      <el-button size="small" v-if="method === 'view'" style="float: left" type="success" @click="openCollectionRecord">资产记录</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
  <BgxtGdzcRecord ref="bgxtGdzcRecord"></BgxtGdzcRecord>
</div>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  import UserSelect from '@/components/userSelect'
  import BgxtGdzcRecord from './BgxtGdzcRecord'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        attachArra: [],
        txmArra: [],
        imagesArra: [],
        inputForm: {
          id: '',
          ccDate: '',
          cfAddress: '',
          htNum: '',
          fpNum: '',
          warehousingDate: '',
          brand: '',
          buyDate: '',
          bxDate: '',
          bxPerple: {
            id: ''
          },
          specificationModel: '',
          responsibilityPeople: {
            id: ''
          },
          serialNumber: '',
          attach: '',
          zczyz: '',
          zczjz: '',
          remarks: ''
        }
      }
    },
    components: {
      GridSelect,
      UserSelect,
      BgxtGdzcRecord
    },
    methods: {
      init (method, id) {
        this.method = method
        if (method === 'add') {
          this.inputForm.id = ''
          this.inputForm.typeNo = id
          this.title = `新建固定资产信息`
        } else if (method === 'edit') {
          this.inputForm.id = id
          this.title = '修改固定资产信息'
        } else if (method === 'view') {
          this.inputForm.id = id
          this.title = '查看固定资产信息'
        }

        this.imagesArra = []
        this.txmArra = []
        this.attachArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/zcfl/bgxtGdzcInfo/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtGdzcInfo)
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
              url: `/zcfl/bgxtGdzcInfo/save`,
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
      },
      openCollectionRecord () {
        this.$refs.bgxtGdzcRecord.refreshList(this.inputForm.name + '记录', this.inputForm.id)
      }
    }
  }
</script>
