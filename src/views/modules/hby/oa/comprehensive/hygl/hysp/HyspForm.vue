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
          <el-col :span="24">
            <el-form-item label="会议主题" prop="hyzt"
                          :rules="[{required: true, message:'请填写会议主题', trigger:'blur'}]">
              <el-input v-model="inputForm.hyzt" placeholder="请填写会议主题" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参会方式" prop="chfs"
                          :rules="[{required: true, message:'请选择参会方式', trigger:'blur'}]">
              <el-radio-group v-model="inputForm.chfs" disabled="disabled">
                <el-radio v-for="item in this.$dictUtils.getDictList('CHFS')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议室" prop="hysid"
                          :rules="[{required: true, message:'请选择会议室', trigger:'blur'}]">
              <el-select v-model="inputForm.hysid" placeholder="请选择" style="width: 100%" disabled="disabled">
                <el-option
                  v-for="item in hysList"
                  :key="item.id"
                  :label="item.hysmc"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议类型" prop="hylxid"
                          :rules="[{required: true, message:'请选择会议类型', trigger:'blur'}]">
              <el-select v-model="inputForm.hylxid" placeholder="请选择" disabled="disabled" style="width: 100%;">
                <el-option
                  v-for="item in hylxList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="kssj"
                          :rules="[{required: true, message:'请选择会议开始时间', trigger:'blur'}]">
              <el-date-picker disabled="disabled"
                style="width: 100%;"
                v-model="inputForm.kssj"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="jssj"
                          :rules="[{required: true, message:'请选择会议结束时间', trigger:'blur'}]">
              <el-date-picker disabled="disabled"
                style="width: 100%;"
                v-model="inputForm.jssj"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议签到" prop="sfqyhyqd"
                          :rules="[{required: true, message:'请选择是否启用会议签到', trigger:'blur'}]">
              <el-radio-group v-model="inputForm.sfqyhyqd" disabled="disabled">
                <el-radio v-for="item in this.$dictUtils.getDictList('SFQYHYQD')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item label="提醒时间（分）" prop="hytxsj"-->
<!--                          :rules="[{required: true, message:'请填写会议提醒时间', trigger:'blur'}]">-->
<!--              <el-input v-model="inputForm.hytxsj" placeholder="请填写会议提醒时间" disabled="disabled"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="参加人员" prop="cjry"
                          :rules="[{required: true, message:'请选择参加会议人员', trigger:'blur'}]">
              <user-select size="small" placeholder="请选择参加会议人员" disabled="disabled" :value="inputForm.cjry" @getValue='(value) => {inputForm.cjry=value}'></user-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参加客户" prop="cjkh" :rules="[]">
              <GridSelect
                title="选择参加客户"
                labelName = 'name'
                labelValue = 'id'
                :value = "inputForm.cjkh"
                @getValue='(value) => {inputForm.cjkh=value}'
                :columns="[
                  {
                    prop: 'name',
                    label: '客户姓名'
                  },
                  {
                    prop: 'dwmc',
                    label: '单位名称'
                  },
                  {
                    prop: 'sjhm',
                    label: '手机号码'
                  },
                  {
                    prop: 'dzyx',
                    label: '电子邮箱'
                  },
                  {
                    prop: 'xcBgzxLjfl.name',
                    label: '类型'
                  }
                ]"
                :searchs="[
                  {
                    prop: 'name',
                    label: '客户姓名'
                  }
                ]"
                dataListUrl="/hygl/chkhz/chkhz/list"
                entityBeanName="chkhz"
                queryEntityUrl="/hygl/chkhz/chkhz/queryById">
              </GridSelect>
            </el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item label="参会客户提醒" prop="cjkhtxfs"-->
<!--                          :rules="[{required: true, message:'请选择参会客户提醒方式', trigger:'blur'}]">-->
<!--              <el-radio-group v-model="inputForm.cjkhtxfs" disabled="disabled">-->
<!--                <el-radio v-for="item in this.$dictUtils.getDictList('CJKHTXFS')"  :label="item.value" :key="item.id">{{item.label}}</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="其他参加" prop="qtcj"
                          :rules="[]">
              <el-input type="textarea" v-model="inputForm.qtcj" disabled="disabled" placeholder="请填写其他参加"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks" :rules="[]">
              <el-input type="textarea" v-model="inputForm.remarks" disabled="disabled" placeholder="请填写备注信息"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="fj" :rules="[]">
              <el-upload ref="fj" disabled="disabled"
                         v-if="visible"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/hygl/hygl`"
                         :headers="{token: $cookie.get('token')}"
                         :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                         :on-success="(response, file, fileList) => {
                       inputForm.fj = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                         :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.fj = fileList.map(item => item.url).join('|')
                    }"
                         :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                         multiple
                         :limit="5"
                         :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                         :file-list="fjArra">
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--                <div slot="tip" class="el-upload__tip">添加相关附件</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审批意见" prop="spyj" :rules="[]">
              <el-input type="textarea" v-model="inputForm.spyj" placeholder="请填写审批意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit('3')" v-noMoreClick>审批通过</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit('4')" v-noMoreClick>审批驳回</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import GridSelect from '@/components/gridSelect'
import UserSelect from '@/components/userSelect'
export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      fjArra: [],
      hysList: [],
      hylxList: [],
      inputForm: {
        id: '',
        hyzt: '',
        chfs: '1',
        hysid: '',
        hylxid: '',
        kssj: '',
        jssj: '',
        sfqyhyqd: '1',
        hytxsj: '',
        cjry: '',
        cjkh: '',
        cjkhtxfs: '1',
        qtcj: '',
        fj: '',
        sqzt: '',
        remarks: '',
        spyj: ''
      }
    }
  },
  components: {
    SelectTree,
    GridSelect,
    UserSelect
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = `新建会议信息`
      } else if (method === 'edit') {
        this.title = '修改会议信息'
      } else if (method === 'view') {
        this.title = '查看会议信息'
      }
      this.fjArra = []
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        // 获取会议室
        this.$http({
          url: `/hygl/hysgl/hysgl/list`,
          method: 'get'
        }).then(({data}) => {
          this.hysList = data.page.list
        })
        // 获取会议类型
        this.$http({
          url: `/hygl/hyfl/treeData?flag=4`,
          method: 'get'
        }).then(({data}) => {
          this.hylxList = data.treeData
        })
        this.$refs.inputForm.resetFields()
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.loading = true
          this.$http({
            url: `/hygl/hygl/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.hygl)
            this.inputForm.fj.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.fjArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
              }
            })
            this.loading = false
          })
        }
      })
    },
    // 表单提交
    doSubmit (sqzt) {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.inputForm.sqzt = sqzt
          this.$http({
            url: `/hygl/hygl/save`,
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
