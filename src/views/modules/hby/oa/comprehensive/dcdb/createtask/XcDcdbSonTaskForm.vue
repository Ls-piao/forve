<template>
  <div>
    <el-dialog
      class="dialogStyle"
      :title="title"
      append-to-body
      width="80%"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
      v-dialogDrag
      :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               label-width="120px">
        <el-row style="left: 3.8%;font-size: 15.3px">
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4">任务名称:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">

                <p><i v-if="inputForm.importance === 1" :style="{color:'red'}"
                      class="el-icon-warning"></i>{{ inputForm.taskName }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4">开始时间:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.startDate }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%">
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4">结束时间:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.endDate }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4">负责人:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.principalName }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%">
          <el-col :span="12">
            <el-row>
              <el-col :span="4">关键字:</el-col>
              <el-col :span="30" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.keyWord }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="4">进度:</el-col>
              <el-col :span="10">
                <el-progress :percentage="percentage" :color="customColor"></el-progress>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%">
          <el-col :span="24">
            <el-row>
              <el-col :span="2">任务目标:</el-col>
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.object }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%">
          <el-col :span="24">
            <el-row>
              <el-col :span="2">参与人:</el-col>
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.participants }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%">
          <el-col :span="24">
            <el-row>
              <el-col :span="2">备注:</el-col>
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.remarks }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--里程碑table-->
        <el-row :gutter="15" v-if="inputForm.milestoneList.length !==0">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="里程碑">
                  <el-table
                    class="table"
                    size="small"
                    :data="inputForm.milestoneList.filter(function(item){ return item.delFlag !== '1'})"
                    style="width: 100%">
                    <el-table-column
                      prop="milestoneName"
                      show-overflow-tooltip
                      sortable="custom"
                      label="里程碑名称">
                    </el-table-column>
                    <el-table-column
                      prop="startDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="开始时间">
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="结束时间">
                    </el-table-column>
                    <el-table-column
                      prop="workingHours"
                      show-overflow-tooltip
                      sortable="custom"
                      label="工时">
                    </el-table-column>
                    <el-table-column
                      prop="schedule"
                      show-overflow-tooltip
                      sortable="custom"
                      label="进度">
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-col>
        </el-row>
        <!--任务简报table-->
        <el-row :gutter="15" v-if="inputForm.workReportList.length !==0">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="任务简报">
                  <el-table
                    class="table"
                    size="small"
                    :data="inputForm.workReportList.filter(function(item){ return item.delFlag !== '1'})"
                    style="width: 100%">
                    <el-table-column
                      prop="overview"
                      show-overflow-tooltip
                      sortable="custom"
                      label="完成概述">
                    </el-table-column>
                    <el-table-column
                      prop="startDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="开始时间">
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="结束时间">
                    </el-table-column>
                    <el-table-column
                      prop="manHour"
                      show-overflow-tooltip
                      sortable="custom"
                      label="工时">
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="this.roleType === 'principal' && this.taskStatus === '1' "
                   style="float:left"
                   @click="milestoneAllowed()">里程碑提报</el-button>
        <el-button size="small" type="primary" v-if="this.roleType === 'principal' && this.taskStatus === '1' "
                   style="float:left"
                   @click="workReportAllowed()">任务简报提报</el-button>
        <el-button size="small" type="danger" v-if="this.roleType === 'principal' && this.taskStatus === '1'"
                   style="float:left"
                   @click="doSubmit('3')">结束任务
        </el-button>
        <!-- <el-button size="small" type="success" v-if="this.roleType === 'principal' " style="float:left"
                    @click="share()">任务共享
       </el-button>-->
        <!-- <el-button size="small" style="float:left" type="warning" @click="delayapplyDialog=true">
             延期申请
        </el-button>
        <el-button size="small" style="float:left" type="warning" @click="delayApprovalDialog=true">
             延期审批
        </el-button>-->
        <el-button size="small" @click="close()">关闭</el-button>
    </span>
    </el-dialog>
    <el-dialog
      title="延期申请"
      :visible.sync="delayapplyDialog"
      width="55%"
      :close-on-click-modal="false"
    >
      <div>
        <el-row>
          <el-col :span="4">
            <p style="margin-top: 6%">延期进度</p>
          </el-col>
          <el-col :span="11" style="margin-top: 1%">
            <el-progress :percentage="percentage" :color="customColor"></el-progress>
          </el-col>
          <el-col :span="5" style="margin-left: 4%">
            <el-button-group>
              <el-button icon="el-icon-minus" @click="decrease"></el-button>
              <el-button icon="el-icon-plus" @click="increase"></el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <p style="margin-top: 7%">延期时间至</p>
          </el-col>
          <el-col :span="10">
            <div class="block">
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delayapplyDialog = false" size="small">保存</el-button>
          <el-button @click="delayapplyDialog = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="延期审批"
      :visible.sync="delayApprovalDialog"
      width="55%"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="4">
          <p style="margin-top: 6%">延期进度</p>
        </el-col>
        <el-col :span="11" style="margin-top: 1%">
          <el-progress :percentage="percentage" :color="customColor"></el-progress>
        </el-col>
        <el-col :span="5" style="margin-left: 4%">
          <el-button-group>
            <el-button icon="el-icon-minus" @click="decrease"></el-button>
            <el-button icon="el-icon-plus" @click="increase"></el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <p style="margin-top: 7%">延期时间至</p>
        </el-col>
        <el-col :span="10">
          <div class="block">
            <el-date-picker
              v-model="value1"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delayApprovalDialog = false" size="small" type="success">同意</el-button>
          <el-button @click="delayApprovalDialog = false" size="small" type="danger">驳回</el-button>
      </span>
    </el-dialog>
    <MilestoneForm ref="milestoneForm" @refreshDataList="refreshList"></MilestoneForm>
    <WorkReportForm ref="workReportForm" @refreshDataList="refreshList"></WorkReportForm>
    <OpinionForm ref="opinionForm" @refreshDataList="refreshList"></OpinionForm>
    <ShareForm ref="shareForm" @refreshDataList="refreshList"></ShareForm>
  </div>
</template>

<script>
  import MilestoneForm from '../milestone/MilestoneForm'
  import WorkReportForm from '../workreport/WorkReportForm'
  import OpinionForm from '../opinion/OpinionForm'
  import ShareForm from './ShareForm'

  export default {
    data () {
      return {
        delayapplyDialog: false,
        delayApprovalDialog: false,
        percentage: 0,
        customColor: '#409eff',
        value1: '',
        taskStatus: '',
        roleType: '',
        fileUrlArra: [],
        title: '',
        method: '',
        visible: false,
        loading: false,
        xcDcdbMainTaskTab: '0',
        inputForm: {
          mainTaskName: '',
          keyWord: '',
          importance: '',
          schedule: '',
          id: '',
          taskName: '',
          principal: '',
          principalName: '',
          participants: '',
          oversee: '',
          overseeName: '',
          manager: '',
          managerName: '',
          object: '',
          startDate: '',
          endDate: '',
          fileUrl: '',
          taskStatus: '',
          remarks: '',
          sonTaskList: [],
          mainTaskPersonList: [],
          manHourList: [],
          manageOpinionList: [],
          milestoneList: [],
          overseeOpinionList: [],
          workReportList: [],
          participantNames: ''
        }
      }
    },
    components: {
      MilestoneForm,
      WorkReportForm,
      OpinionForm,
      ShareForm
    },
    mounted () {
      this.getUserInfo()
    },
    methods: {
      // 进度条增加和减少
      increase () {
        this.percentage += 10
        if (this.percentage > 100) {
          this.percentage = 100
        }
      },
      decrease () {
        this.percentage -= 10
        if (this.percentage < 0) {
          this.percentage = 0
        }
      },
      // 延期申请
      // delayapply () {
      //
      // },
      // // 延期审批
      // delayApproval () {
      //
      // },
      // 获取当前登陆人信息
      getUserInfo () {
        this.$http({
          url: '/sys/user/info',
          method: 'get'
        }).then(({data}) => {
          if (data.success) {
          }
        })
      },
      refreshList () {
        this.init(this.method, this.inputForm.id, this.roleType, this.roleType)
      },
      // 任务共享
      share () {
        this.$refs.shareForm.init('add', '', this.roleType, this.inputForm.id)
      },
      // 任务简报提报
      workReportAllowed () {
        this.$refs.workReportForm.init('add', '', this.roleType, this.inputForm.id, 'son', this.inputForm.endDate)
      },
      // 里程碑提报
      milestoneAllowed () {
        this.$refs.milestoneForm.init('add', '', this.roleType, this.inputForm.id, 'son', this.percentage, this.inputForm.endDate)
      },
      // 催办/督办
      urge () {
        this.$refs.opinionForm.init('add', '', this.roleType, this.inputForm.id)
      },
      init (method, id, role) {
        this.method = method
        this.roleType = role
        if (method === 'add') {
          this.title = this.inputForm.mainTaskName
        } else if (method === 'edit') {
          this.title = this.inputForm.mainTaskName
        } else if (method === 'view') {
          this.title = this.inputForm.mainTaskName
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = id
          this.xcDcdbMainTaskTab = '0'
          this.inputForm.sonTaskList = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/sontask/sonTask/details?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.sonTask)
              this.percentage = data.sonTask.schedule
              this.taskStatus = this.inputForm.taskStatus
              this.loading = false
            })
          }
        })
      },
      saveXcDcdbSonTaskRow (child) {
        if (child[0] === '') {
          this.inputForm.sonTaskList.push(child[1])
        } else {
          this.inputForm.sonTaskList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.sonTaskList.splice(index, 1, child[1])
            }
          })
        }
      },
      // 关闭事件
      close () {
        this.visible = false
        this.$emit('refreshDataList')
      },
      // 右上角X关闭事件
      handleDialogClose () {
        this.visible = false
        this.$emit('refreshDataList')
      },
      // 表单提交
      doSubmit (taskStatus) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/sontask/sonTask/accept`,
              method: 'post',
              data: {
                id: this.inputForm.id,
                taskStatus: taskStatus
              }
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success('操作成功')
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .dialogStyle {

  .el-dialog .el-dialog__body {
    overflow-x: hidden
  }

  }
</style>
