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
            <el-form-item label="项目名称" prop="xm.id"
                :rules="[
                  {required: true, message:'项目名称不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择项目名称"
            labelName = 'xmmc'
            labelValue = 'id'
            :value = "inputForm.xm.id"
            :limit="1"
            @getValue='(value) => {inputForm.xm.id=value}'
            :columns="[
            {
              prop: 'xmmc',
              label: '项目名称'
            },
            {
              prop: 'xmbh',
              label: '项目编号'
            },
            {
              prop: 'lxdw',
              label: '立项单位'
            },
            {
              prop: 'lxrq',
              label: '立项日期'
            },
            {
              prop: 'zfzr.name',
              label: '总负责人'
            },
            {
              prop: 'xmjl.name',
              label: '项目经理'
            }
            ]"
            :searchs="[
            {
              prop: 'xmmc',
              label: '项目名称'
            },
            {
              prop: 'xmbh',
              label: '项目编号'
            },
            {
              prop: 'lxdw',
              label: '立项单位'
            },
            {
              prop: 'lxrq',
              label: '立项日期'
            },
            {
              prop: 'xmfl',
              label: '项目分类'
            }
            ]"
            dataListUrl="/xmgl/xmxx/xmjbxx/list?yszt=2"
            entityBeanName="xmjbxx"
            queryEntityUrl="/xmgl/xmxx/xmjbxx/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="验收日期" prop="ysrq"
                :rules="[
                  {required: true, message:'验收日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.ysrq"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="验收类型" prop="yslx"
                :rules="[
                  {required: true, message:'验收类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.yslx" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('XMGL_YSLX')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验收结果" prop="ysjg"
                        :rules="[
                  {required: true, message:'验收结果不能为空', trigger:'blur'}
                 ]">
            <el-radio-group v-model="inputForm.ysjg">
              <el-radio v-for="item in $dictUtils.getDictList('XMGL_YSJG')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="验收内容" prop="ysnr"
                :rules="[
                  {required: true, message:'验收内容不能为空', trigger:'blur'}
                 ]">
              <el-input type="textarea" autosize v-model="inputForm.ysnr" placeholder="请填写验收内容（描述本次提交验收的项目范围）"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="文档审核" prop="wdsh"
                :rules="[
                  {required: true, message:'文档审核不能为空', trigger:'blur'}
                 ]">
                <el-checkbox-group
                        v-model="wdshList">
                       <el-checkbox v-for="wdsh in $dictUtils.getDictList('XMGL_YSWD')" :label="wdsh.value" :key="wdsh.value">{{wdsh.label}}</el-checkbox>
                    </el-checkbox-group>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="专家组人员" prop="zjz"
                >
              <el-input type="textarea" autosize v-model="inputForm.zjz" placeholder="请填写专家组人员"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="专家组意见" prop="zjyj"
                >
              <el-input  type="textarea" autosize v-model="inputForm.zjyj" placeholder="请填写专家组意见"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="验收结论" prop="ysjl"
                >
              <el-input  type="textarea" autosize v-model="inputForm.ysjl" placeholder="请填写验收结论"     ></el-input>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
            <el-form-item label="验收结果" prop="ysjg"
                :rules="[
                  {required: true, message:'验收结果不能为空', trigger:'blur'}
                 ]">
                    <el-radio-group v-model="inputForm.ysjg">
                        <el-radio v-for="item in $dictUtils.getDictList('XMGL_YSJG')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
           </el-form-item>
        </el-col>-->
        <el-col :span="24">
            <el-form-item label="验收通过日期" prop="ystgdate"
                >
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.ystgdate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      >
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="fileUrl"
                        :rules="[]">
            <el-upload ref="fileUrl"
                       v-if="visible"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/htxx`"
                       :headers="{token: $cookie.get('token')}"
                       :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                       :on-success="(response, file, fileList) => {
                           inputForm.fileUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                           inputForm.fileName = fileList.map(item => item.name).join('|')
                        }"
                       :on-remove="(file, fileList) => {
                        $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                           $message.success(data.msg)
                        })
                        inputForm.fileUrl = fileList.map(item => item.url).join('|')
                        inputForm.fileName = fileList.map(item => item.name).join('|')
                  }"
                       :before-remove="(file, fileList) => {
                     return $confirm(`确定移除 ${file.name}？`)
                  }"
                       multiple
                       :file-list="fileUrlArra">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">添加相关附件</div>
            </el-upload>
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
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        fileUrlArra: [],
        inputForm: {
          id: '',
          xm: {
            id: ''
          },
          ysrq: '',
          yslx: '',
          ysnr: '',
          wdsh: '',
          zjz: '',
          zjyj: '',
          ysjl: '',
          ysjg: '',
          ystgdate: '',
          fileUrl: '',
          fileName: ''
        }
      }
    },
    components: {
      GridSelect
    },
    computed: {
      wdshList: {
        get: function () {
          return this.inputForm.wdsh !== '' ? this.inputForm.wdsh.split(',') : []
        },
        set: function (val) {
          this.inputForm.wdsh = val.join(',')
        }
      }
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建项目验收`
        } else if (method === 'edit') {
          this.title = '修改项目验收'
        } else if (method === 'view') {
          this.title = '查看项目验收'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/xmys/ysxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.ysxx)
              var url = this.inputForm.fileUrl.split('|')
              var name = this.inputForm.fileName.split('|')
              if (url[0] !== '') {
                for (var i = 0; i < url.length; i++) {
                  this.fileUrlArra.push({
                    name: name[i],
                    url: url[i]
                  })
                }
              }
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
              url: `/xmgl/xmys/ysxx/save`,
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
