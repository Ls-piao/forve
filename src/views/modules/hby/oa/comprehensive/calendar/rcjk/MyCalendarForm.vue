<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="日程信息" name="first">
        <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'" @keyup.enter.native="doSubmit()"
                label-width="120px" @submit.native.prevent>
          <el-row  :gutter="15">
            <el-col v-if="'add'==this.method" :span="16">
              <el-form-item label="日程模板" prop="rcmb">
                  <el-select v-model="inputForm.rcmb" style="width:100%" filterable placeholder="请选择"
                  @change="handelRcmb">
                    <el-option
                      v-for="rcmb in rcmbList"
                      :key="rcmb"
                      :label="rcmb.rcbt"
                      :value="rcmb">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="日程标题" prop="title"
                    :rules="[
                      {required: true, message:'日程标题不能为空', trigger:'blur'}]">
                  <el-input v-model="inputForm.title" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="日程内容" prop="title"
                    :rules="[
                      {required: true, message:'日程内容不能为空', trigger:'blur'}]">
                  <el-input type="textarea" v-model="inputForm.content" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="开始时间" prop="start"
                    :rules="[
                      {required: true, message:'开始时间不能为空', trigger:'blur'}]">
                    <el-date-picker
                    v-model="inputForm.start"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    @change="handelStart">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="结束时间" prop="end"
                    :rules="[
                      {required: true, message:'结束时间不能为空', trigger:'blur'}]">
                  <el-date-picker
                    v-model="inputForm.end"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    @change="handelEnd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="办理人" prop="userIdList" :rules="[{required: true, message:'办理人不能为空', trigger:'blur'}]">
                  <el-select v-model="inputForm.userIdList" style="width:100%" multiple filterable placeholder="请选择">
                    <el-option
                      v-for="user in userList"
                      :key="user.id"
                      :label="user.name"
                      :value="user.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="日程类型" prop="rclx.id" :rules="[{required: true, message:'日程类型不能为空', trigger:'blur'}]">
                  <el-select v-model="inputForm.rclx.id" style="width:100%" placeholder="请选择">
                    <el-option
                      v-for="rclx in rclxList"
                      :key="rclx.id"
                      :label="rclx.name"
                      :value="rclx.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="紧急程度" prop="jjcd" :rules="[
                {required: true, message: '紧急程度', trigger: 'blur'}
              ]">
                <el-select v-model="inputForm.jjcd" placeholder="请选择"  style="width: 100%;">
                  <el-option
                    v-for="item in this.$dictUtils.getDictList('RCGL_JJCD')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="是否提醒" prop="sftx" :rules="[
                {required: true, message: '是否提醒', trigger: 'blur'}
              ]">
                <el-select v-model="inputForm.sftx" placeholder="请选择"  style="width: 100%;">
                  <el-option
                    v-for="item in this.$dictUtils.getDictList('yes_no')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="method === 'edit' || method === 'view'" label="日程共享" name="second">
        <rcgx-list ref="RcgxList"></rcgx-list>
      </el-tab-pane>
      <el-tab-pane v-if="method === 'edit' || method === 'view'" label="日程反馈" name="third">
        <rcfk-list ref="RcfkList"></rcfk-list>
      </el-tab-pane>
    </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>保存</el-button>
        <el-button size="small" type="danger" v-if="method === 'edit'"  @click="del">删除</el-button>
        <el-button size="small" type="success" v-if="this.inputForm.state === '0'" @click="wc">完成</el-button>
        <el-button size="small" @click="visible = false">关闭</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import RcgxList from '../rcgx/RcgxList'
  import RcfkList from '../rcfk/RcfkList'
  import { isNull } from 'xe-utils'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        activeName: 'first',
        userList: [],
        rclxList: [],
        rcmbList: [],
        inputForm: {
          id: '',
          title: '',
          content: '',
          start: '',
          end: '',
          jjcd: '',
          sftx: '',
          rclx: {
            id: '',
            name: ''
          },
          rcmb: '',
          state: '',
          createBy: {
            id: '',
            name: ''
          },
          userIdList: [],
          fxrIdList: []
        },
        dataRule: {
          userIdList: [{required: true, message: '办理人不能为空', trigger: 'blur'}]
        }
      }
    },
    components: {
      SelectTree,
      RcgxList,
      RcfkList
    },
    methods: {
      init (method, id, start, end) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建日程`
        } else if (method === 'edit') {
          this.title = '修改日程'
        } else if (method === 'view') {
          this.title = '查看日程'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$http({
            url: `/sys/user/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.userList = data.page.list
          })
          this.$http({
            url: `/rclx/rclx/list?zt=1&pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.rclxList = data.page.list
          })
          this.$http({
            url: `/rcmb/rcmb/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.rcmbList = data.page.list
          })
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/myCalendar/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.myCalendar)
              this.loading = false
            })
          } else {
            this.inputForm.start = start
            this.inputForm.end = end
          }
          this.$refs.RcgxList.searchForm.rcId = this.inputForm.id
          this.$refs.RcgxList.refreshList()
          this.$refs.RcfkList.searchForm.rcId = this.inputForm.id
          this.$refs.RcfkList.refreshList()
        })
      },
      handelRcmb (rcmb) {
        this.inputForm.title = rcmb.rcbt
        this.inputForm.content = rcmb.rcnr
        this.inputForm.jjcd = rcmb.jjcd
        this.inputForm.rclx = rcmb.rclx
      },
      handelStart (value) {
        if (!isNull(this.inputForm.end) && value > this.inputForm.end) {
          this.inputForm.start = null
          this.$message.error('开始时间不能大于结束时间')
        }
      },
      handelEnd (value) {
        if (!isNull(this.inputForm.start) && value < this.inputForm.start) {
          this.inputForm.end = null
          this.$message.error('结束时间不能小于开始时间')
        }
      },
      del () {
        this.loading = true
        this.$http.delete(
          `/myCalendar/del?id=${this.inputForm.id}`
        ).then(({data}) => {
          if (data && data.success) {
            this.visible = false
            this.$message.success(data.msg)
            this.$emit('refreshDataList')
          }
          this.loading = false
        })
      },
      wc () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/myCalendar/wc`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
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
              url: `/myCalendar/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>
