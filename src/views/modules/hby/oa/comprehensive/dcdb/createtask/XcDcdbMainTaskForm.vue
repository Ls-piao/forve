<template>
  <div>
    <el-dialog
      class="dialogStyle"
      :title="title"
      width="80%"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
      v-dialogDrag
      :visible.sync="visible">
      <!--:disabled="method==='view'"-->
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''"
               label-width="120px">
        <el-row style="left: 3.8%;font-size: 15.3px">
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4">任务名称:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">
                <p>
                  <i v-if="inputForm.importance ===  1" :style="{color:'red'}" class="el-icon-warning" title="重要的"></i>
                  <!--            当任务状态为待确认时显示小图标-->
                  <i v-if="roleType === 'manager' && inputForm.taskStatus === '3'" :style="{color:'#ff9e0d'}"
                     class="el-icon-info" title="待确认"></i>
                  <!--            当任务没有负责人时显示小图标-->
                  <i v-if="roleType === 'manager' && inputForm.principal === ''" :style="{color:'#ff9e0d'}"
                     class="el-icon-question" title="待分配"></i>
                  <!--            当提交延期申请但还没被处理时显示小图标-->
                  <i v-if="roleType === 'manager' && inputForm.turnover !== undefined && inputForm.turnover !== ''" :style="{color:'#ff9e0d'}"
                     class="el-icon-success" title="延期申请未处理"></i>
                  {{ inputForm.taskName }}
                </p>
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
            <el-row :gutter="5">
              <el-col :span="4">督办人:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.overseeName }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4">分管人:</el-col>
              <el-col :span="7" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.managerName }}</p>
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
                <p>{{ inputForm.participantNames }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%">
          <el-col :span="24" >
            <el-row>
              <el-col :span="2">备注:</el-col>
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p>{{ inputForm.remarks }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 1%" v-if="inputForm.taskStatus === '2'">
          <el-col :span="12">
            <el-row :gutter="5">
              <el-col :span="4" style="color: red">拒绝原因:</el-col>
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p>
                  {{inputForm.reason}}
                </p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <!--子任务table-->
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="子任务">
                  <el-button v-if="this.roleType === 'principal' && this.taskStatus === '1'" size="small"
                             @click="addXcDcdbSonTaskRow()" type="primary">新增
                  </el-button>
                  <el-table
                    class="table"
                    size="small"
                    :data="inputForm.sonTaskList.filter(function(item){ return item.delFlag !== '1'})"
                    style="width: 100%">
                    <el-table-column
                      prop="taskName"
                      show-overflow-tooltip
                      sortable="custom"
                      label="子任务名称">
                      <template slot-scope="scope">
                        <i v-if="scope.row.importance === 1" :style="{color:'red'}" class="el-icon-warning"></i>
                        <el-link type="primary" :underline="false"
                                 @click="sonTaskView(scope.row.id)"
                                 :disabled="inputForm.principal !== userId || scope.row.isPrincipal=== 0">{{ scope.row.taskName }}
                        </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="principalName"
                      show-overflow-tooltip
                      sortable="custom"
                      label="负责人">
                    </el-table-column>
                    <el-table-column
                      prop="object"
                      show-overflow-tooltip
                      sortable="custom"
                      label="任务目标">
                    </el-table-column>
                    <el-table-column
                      prop="startDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="任务状态">
                      <template slot-scope="scope">
                        {{ $dictUtils.getDictLabel('RWZT', scope.row.taskStatus, '-') }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="schedule"
                      show-overflow-tooltip
                      sortable="custom"
                      label="进度">
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="150">
                      <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-view" size="small"
                                    :disabled="inputForm.principal !== userId || scope.row.isPrincipal=== 0"
                                    @click="sonTaskView(scope.row.id)">详情
                        </el-button>
                        <el-button :disabled="inputForm.principal !== userId || scope.row.isPrincipal=== 0"type="text" icon="el-icon-download" size="small"
                                   @click="sonAccessory(scope.row.fileUrl)">附件下载
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-col>
        </el-row>
        <!--里程碑table-->
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="里程碑">
                  <el-button v-if="this.roleType === 'principal' && this.taskStatus === '1'" size="small"
                             @click="addMilestoneRow()" type="primary">新增
                  </el-button>
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
                    <el-table-column
                      prop="isEnd"
                      show-overflow-tooltip
                      sortable="custom"
                      label="完成状态">
                      <template slot-scope="scope">
                        <el-tag effect="dark" size="small" :type="isEndStyle[scope.row.isEnd]">{{isEndDescribe[scope.row.isEnd]}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-view" size="small"
                                    @click="milestoneView(scope.row.id)">详情
                        </el-button>
                        <el-button  type="text" icon="el-icon-download" size="small"
                                    @click="sonAccessory(scope.row.fileUrl)">附件下载
                        </el-button>
                        <el-button v-if="roleType === 'principal' " type="text" icon="el-icon-edit" size="small"
                                   @click="milestoneEdit(scope.row.id)" :disabled="scope.row.isEnd === 1">完成
                        </el-button>
                      </template>
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
        <!--督办信息table-->
        <el-row :gutter="15" v-if="inputForm.overseeOpinionList.length !==0">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="督办信息">
                  <el-table
                    class="table"
                    size="small"
                    :data="inputForm.overseeOpinionList.filter(function(item){ return item.delFlag !== '1'})"
                    style="width: 100%">
                    <el-table-column
                      prop="opinion"
                      show-overflow-tooltip
                      sortable="custom"
                      label="督办信息">
                    </el-table-column>
                    <el-table-column
                      prop="createName"
                      show-overflow-tooltip
                      sortable="custom"
                      label="督办人">
                    </el-table-column>
                    <el-table-column
                      prop="createDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="时间">
                    </el-table-column>
                    <el-table-column
                      prop="isReply"
                      show-overflow-tooltip
                      sortable="custom"
                      label="回复状态">
                      <template slot-scope="scope">
                        <el-tag effect="dark" size="small" :type="statusStyle[scope.row.isReply]">{{statusDescribe[scope.row.isReply]}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-view" size="small"
                                    @click="overseeOpinionView(scope.row.id)">详情
                        </el-button>
                        <el-button  type="text" icon="el-icon-download" size="small"
                                    @click="sonAccessory(scope.row.fileUrl)">附件下载
                        </el-button>
                        <el-button v-if="roleType === 'principal' && scope.row.isReply === 0" type="text" icon="el-icon-edit" size="small"
                                   @click="overseeOpinionEdit(scope.row.id)"
                        >反馈
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-col>
        </el-row>
        <!--催办信息table-->
        <el-row :gutter="15" v-if="inputForm.manageOpinionList.length !==0">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="催办信息">
                  <el-table
                    class="table"
                    size="small"
                    :data="inputForm.manageOpinionList.filter(function(item){ return item.delFlag !== '1'})"
                    style="width: 100%">
                    <el-table-column
                      prop="opinion"
                      show-overflow-tooltip
                      sortable="custom"
                      label="催办信息">
                    </el-table-column>
                    <el-table-column
                      prop="createName"
                      show-overflow-tooltip
                      sortable="custom"
                      label="催办人">
                    </el-table-column>
                    <el-table-column
                      prop="createDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="时间">
                    </el-table-column>
                    <el-table-column
                      prop="isReply"
                      show-overflow-tooltip
                      sortable="custom"
                      label="回复状态">
                      <template slot-scope="scope">
                        <el-tag effect="dark" size="small" :type="statusStyle[scope.row.isReply]">{{statusDescribe[scope.row.isReply]}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-view" size="small"
                                    @click="overseeOpinionView(scope.row.id)">详情
                        </el-button>
                        <el-button  type="text" icon="el-icon-download" size="small"
                                    @click="sonAccessory(scope.row.fileUrl)">附件下载
                        </el-button>
                        <el-button  type="text" icon="el-icon-edit" size="small"
                                   @click="overseeOpinionEdit(scope.row.id)"
                        >反馈
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 任务动态 -->
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-tabs v-model="xcDcdbMainTaskTab">
                <el-tab-pane label="任务动态">
                  <el-table
                    class="table"
                    size="small"
                    :data="inputForm.taskDynamicList.filter(function(item){ return item.delFlag !== '1'})"
                    style="width: 100%">
                    <el-table-column
                      prop="operation"
                      show-overflow-tooltip
                      sortable="custom"
                      label="操作类型">
                      <template slot-scope="scope">
                        <el-tag effect="dark" size="small" type='warning' v-if="scope.row.operation === 'ggztTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
                        <el-tag effect="dark" size="small" type='success' v-else-if="scope.row.operation === 'addTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
                        <el-tag effect="dark" size="small" type='' v-else-if="scope.row.operation === 'updateTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
                        <el-tag effect="dark" size="small" type='success' v-else-if="scope.row.operation === 'addSonTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
                        <el-tag effect="dark" size="small" type='warning' v-else-if="scope.row.operation === 'ggztSonTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="mainTaskName"
                      show-overflow-tooltip
                      sortable="custom"
                      label="主任务">
                    </el-table-column>
                    <el-table-column
                      prop="user.name"
                      show-overflow-tooltip
                      sortable="custom"
                      label="操作人">
                    </el-table-column>
                    <el-table-column
                      prop="createDate"
                      show-overflow-tooltip
                      sortable="custom"
                      label="操作时间">
                    </el-table-column>
                    <el-table-column
                      header-align="center"
                      align="center"
                      fixed="right"
                      :key="Math.random()"
                      width="200"
                      label="操作">
                      <template slot-scope="scope"  >
                        <el-button v-if="hasPermission('sontask:sonTask:view')" type="text" icon="el-icon-view" size="small"
                                   @click="dynamicView(scope.row.id, scope.row.operation)">变更详情
                        </el-button>
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

        <el-button size="small" type="primary" v-if="this.roleType === 'manager' && this.taskStatus === '1'" style="float:left"
                   @click="urge()">催办</el-button>
        <el-button size="small" type="danger" v-if="this.roleType === 'manager' && this.taskStatus === '3'"
                   style="float:left"
                   @click="confirmation('4')">确认完成</el-button>
        <el-button size="small" type="primary" v-if="this.roleType === 'oversee' && this.taskStatus !== '2'" style="float:left"
                   @click="urge()">督办</el-button>

          <el-button size="small" type="success" v-if="(this.roleType === 'principal') && this.taskStatus === '0'"
                     style="float:left"
                     @click="submit('1')">领取任务</el-button>
          <el-button size="small" type="danger" v-if="(this.roleType === 'principal') && this.taskStatus === '0'"
                     style="float:left"
                     @click="juJueReason('2')">拒绝任务</el-button>
        <!--<el-button size="small" type="primary" v-if="(this.roleType === 'principal' || this.roleType === 'participant') && this.taskStatus === '1'"
                   style="float:left"
                   @click="milestoneAllowed()">里程碑提报</el-button>-->
        <el-button size="small" type="primary" v-if="(this.roleType === 'principal' || this.roleType === 'participant') && this.taskStatus === '1' "
                   style="float:left"
                   @click="workReportAllowed()">任务简报提报</el-button>
        <el-button size="small" type="danger" v-if="this.roleType === 'principal' && this.taskStatus === '1'"
                   style="float:left"
                   @click="endTask()">结束任务
        </el-button>
        <el-button size="small" type="danger" v-if="this.roleType === 'principal' && this.taskStatus === '1'"
                   style="float:left"
                   @click="scheduleClick()">更新进度
        </el-button>
          <el-button size="small" type="success" v-if="(this.roleType === 'principal') && this.taskStatus !== '2'"
                     style="float:left"
                     @click="share()">任务共享
        </el-button>
        <el-button size="small" style="float:left" type="warning" @click="delayapplyDialog=true"
                   v-if=" (this.roleType === 'principal' || this.roleType === 'participant' ) && this.taskStatus === '1'  && this.turnoverForm.turnover === ''">
             延期申请
        </el-button>
        <el-button size="small" style="float:left" type="warning" @click="delayApproval()"
                   v-if="this.roleType === 'manager'  && turnoverForm.turnover !== '' && this.taskStatus === '1'">
             延期审批
        </el-button>
        <el-button size="small" style="float:left" type="warning" @click=" ChongXin()"
                   v-if="this.inputForm.principal === ''&& this.roleType === 'manager'">
             重新分配
        </el-button>
          <el-button size="small" style="float:left" type="primary" @click="accessory()"
          >附件
        </el-button>
        <el-button size="small" @click="close()">关闭</el-button>
    </span>
    </el-dialog>
    <!--延期申请-->
    <el-dialog
      :title="turnoverTitle"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="delayapplyDialog">
      <el-form :model="turnoverForm" size="small" ref="turnoverForm" v-loading="loading"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="结束时间" prop="percentage"
            >
              <p>{{ inputForm.endDate }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="延期时间" prop="turnover"
                          :rules="[
                 ]">
              <p v-if="roleType !== 'manager'">
                <el-date-picker
                  style="width: 100%;"
                  v-model="turnoverForm.turnover"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  :picker-options="pickerBeginDateStart">
                </el-date-picker>
              </p>
              <p v-else>{{ turnoverForm.turnover }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="delayapplyDialog = false"
                 v-if="roleType==='principal' || roleType==='participant' ">关闭</el-button>
      <el-button size="small" type="primary" @click="turnoverSubmit() " v-noMoreClick
                 v-if="roleType==='principal' || roleType==='participant'">确定</el-button>
        <el-button @click="turnoverApprove('true')" size="small" type="success"
                   v-if="roleType==='manager'">同意</el-button>
        <el-button @click="turnoverApprove('false')" size="small" type="danger"
                   v-if="roleType==='manager'">驳回</el-button>
    </span>
    </el-dialog>
    <!-- 提交进度-->
    <el-dialog
      :title="accessoryTitle"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="scheduleDialog">
      <el-form :model="scheduleForm" size="small" ref="scheduleForm" v-loading="loading"
               label-width="120px">
        <el-row :gutter="24">
          <el-col :span="14">
            <el-form-item label="任务进度" prop="">
              <el-progress   :percentage="percentage1" :color="customColor" style="margin-top: 2%"></el-progress>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button-group>
              <el-button icon="el-icon-minus" @click="decrease" size="small" :disabled="this.percentage1 <= this.scheduleForm.schedule ? true : false"></el-button>
              <el-button icon="el-icon-plus" @click="increase" size="small"></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="scheduleDialog = false"
      >关闭</el-button>
      <el-button size="small" type="primary" @click="scheduleSubmit() "
      >确定</el-button>
    </span>
    </el-dialog>
    <!-- 附件下载-->
    <el-dialog
      :title="accessoryTitle"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="accessoryDialog">
      <el-form :model="scheduleForm" size="small" ref="scheduleForm" v-loading="loading"
               label-width="120px">
        <el-row :gutter="24">
          <el-upload ref="fileUrl"
                     v-if="visible"
                     :disabled="true"
                     :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/sontask/sonTask`"
                     :headers="{token: $cookie.get('token')}"
                     :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                     :file-list="fileUrlArra">
          </el-upload>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="accessoryDialog = false"
      >关闭</el-button>
    </span>
    </el-dialog>
    <XcDcdbSonTaskForm ref="xcDcdbSonTaskForm" @refreshDataList="refreshList"></XcDcdbSonTaskForm>
    <MilestoneForm ref="milestoneForm" @refreshDataList="refreshList"></MilestoneForm>
    <WorkReportForm ref="workReportForm" @refreshDataList="refreshList"></WorkReportForm>
    <OpinionForm ref="opinionForm" @refreshDataList="refreshList"></OpinionForm>
    <ShareForm ref="shareForm" @refreshDataList="refreshList"></ShareForm>
    <SonTaskForm ref="sonTaskForm" @refreshDataList="refreshList"></SonTaskForm>
    <ChongXinFenPeiForm ref="ChongXinFenPeiForm" @refreshDataList="refreshList"></ChongXinFenPeiForm>
    <TaskDynamicForm ref="taskDynamicForm" @refreshDataList="refreshList"></TaskDynamicForm>
    <SonTaskDynamicForm ref="sonTaskDynamicForm"  @refreshDataList="refreshList"></SonTaskDynamicForm>
  </div>
</template>

<script>
  import XcDcdbSonTaskForm from './XcDcdbSonTaskForm'
  import MilestoneForm from '../milestone/MilestoneForm'
  import WorkReportForm from '../workreport/WorkReportForm'
  import OpinionForm from '../opinion/OpinionForm'
  import ShareForm from './ShareForm'
  import SonTaskForm from './SonTaskForm'
  import ChongXinFenPeiForm from './ChongXinFenPeiForm'
  import TaskDynamicForm from '../dynamic/TaskDynamicForm'
  import SonTaskDynamicForm from '../dynamic/SonTaskDynamicForm'
  export default {
    data () {
      return {
        accessoryDialog: false,
        accessoryTitle: '附件下载',
        scheduleTitle: '更新进度',
        scheduleDialog: false,
        isEndStyle: ['danger', 'success'],
        isEndDescribe: ['未完成', '已完成'],
        statusStyle: ['danger', 'success'],
        statusDescribe: ['未回复', '已回复'],
        pickerBeginDateStart: {
          disabledDate: time => {
            return time.getTime() <= new Date(this.inputForm.endDate).getTime()
          }
        },
        turnoverTitle: '延期申请',
        percentage: 0,
        percentage1: 0,
        userId: '',
        taskStatus: '',
        roleType: '',
        fileUrlArra: [],
        title: '',
        method: '',
        visible: false,
        delayapplyDialog: false,
        delayApprovalDialog: false,
        customColor: '#409eff',
        value1: '',
        loading: false,
        xcDcdbMainTaskTab: '0',
        inputForm: {
          keyWord: '',
          importance: '',
          schedule: 0,
          id: '',
          taskName: '',
          reason: '',
          principal: '',
          principalName: '',
          participants: '',
          oversee: '',
          overseeName: '',
          manager: '',
          managerName: '',
          object: '',
          startDate: '',
          workingHours: '',
          turnover: '',
          endDate: '',
          fileUrl: '',
          taskStatus: '',
          remarks: '',
          sonTaskList: [],
          mainTaskPersonList: [],
          manHourList: [],
          manageOpinionList: [],
          taskDynamicList: [],
          milestoneList: [],
          overseeOpinionList: [],
          workReportList: [],
          participantNames: ''
        },
        turnoverForm: {
          id: '',
          turnover: ''
        },
        scheduleForm: {
          id: '',
          schedule: '',
          otherSchedule: ''
        }
      }
    },
    components: {
      XcDcdbSonTaskForm,
      MilestoneForm,
      WorkReportForm,
      OpinionForm,
      ShareForm,
      SonTaskForm,
      ChongXinFenPeiForm,
      TaskDynamicForm,
      SonTaskDynamicForm
    },
    mounted () {
      this.getUserInfo()
    },
    methods: {
      sonAccessory (url) {
        this.accessoryDialog = true
        this.fileUrlArra = []
        url.split('|').forEach((item) => {
          if (item.trim().length > 0) {
            this.fileUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
          }
        })
      },
      // 主任务附件下载
      accessory () {
        this.accessoryDialog = true
        // 获取附件url
        this.fileUrlArra = []
        this.inputForm.fileUrl.split('|').forEach((item) => {
          if (item.trim().length > 0) {
            this.fileUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
          }
        })
      },
      increase () {
        this.percentage1 += 10
        if (this.percentage1 > 100) {
          this.percentage1 = 100
        }
      },
      decrease () {
        this.percentage1 -= 10
        if (this.percentage1 < 0) {
          this.percentage1 = 0
        }
      },
      scheduleClick () {
        this.scheduleDialog = true
        this.scheduleForm.id = this.inputForm.id
        this.scheduleForm.schedule = this.inputForm.schedule
        this.percentage1 = this.inputForm.schedule
      },
      delayApproval () {
        this.delayapplyDialog = true
        this.turnoverTitle = '延期审批'
      },
      // 新增子任务
      addXcDcdbSonTaskRow () {
        if (Date.now() > new Date(this.inputForm.endDate).getTime()) {
          this.$alert(`当前主任务已超时，请先延期申请`, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        } else {
          this.$refs.sonTaskForm.init('add', this.inputForm.id, this.inputForm.endDate)
        }
      },
      // 新增里程碑
      addMilestoneRow () {
        if (Date.now() > new Date(this.inputForm.endDate).getTime()) {
          this.$alert(`当前主任务已超时，请先延期申请`, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        } else {
          this.milestoneAllowed()
        }
      },
      // 延期审核
      turnoverApprove (judge) {
        this.$refs['turnoverForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/maintask/mainTask/deferredAudit`,
              method: 'post',
              data: {
                id: this.turnoverForm.id,
                turnover: this.turnoverForm.turnover,
                judge: judge
              }
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
                this.delayapplyDialog = false
              }
            })
          }
        })
      },
      // 更新进度
      scheduleSubmit () {
        this.$refs['scheduleForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/maintask/mainTask/upSchedule`,
              method: 'post',
              data: {
                id: this.scheduleForm.id,
                schedule: this.percentage1
              }
            }).then(({data}) => {
              if (data && data.success) {
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
                this.scheduleDialog = false
                this.refreshList()
              }
            })
          }
        })
      },
      // 延期申请提交
      turnoverSubmit () {
        this.$refs['turnoverForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/maintask/mainTask/accept`,
              method: 'post',
              data: {
                id: this.turnoverForm.id,
                turnover: this.turnoverForm.turnover
              }
            }).then(({data}) => {
              if (data && data.success) {
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
                this.delayapplyDialog = false
              }
            })
          }
        })
      },
      // 进度条增加和减少
      sonTaskView (sonTaskId) {
        this.$refs.xcDcdbSonTaskForm.init('view', sonTaskId, this.roleType)
      },
      // 任务动态变更详情
      dynamicView (id, operation) {
        if (operation === 'addTask' || operation === 'updateTask' || operation === 'ggztTask') {
          this.$refs.taskDynamicForm.init('view', id)
        } else if (operation === 'addSonTask' || operation === 'updateSonTask' || operation === 'ggztSonTask') {
          this.$refs.sonTaskDynamicForm.init('view', id)
        }
      },
      // 获取当前登陆人信息
      getUserInfo () {
        this.$http({
          url: '/sys/user/info',
          method: 'get'
        }).then(({data}) => {
          if (data.success) {
            this.userId = data.user.id
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
      // 重新分配
      ChongXin () {
        this.$refs.ChongXinFenPeiForm.init('add', '', this.roleType, this.inputForm.id)
      },
      // 任务简报提报
      workReportAllowed () {
        this.$refs.workReportForm.init('add', '', this.roleType, this.inputForm.id, 'main', this.inputForm.endDate)
      },
      // 里程碑详情
      milestoneView (milestoneId) {
        this.$refs.milestoneForm.init('view', milestoneId, this.roleType, this.inputForm.id, 'main', this.percentage)
      },
      // 里程碑完成
      milestoneEdit (milestoneId) {
        this.$refs.milestoneForm.init('edit', milestoneId, this.roleType, this.inputForm.id, 'main', this.percentage)
      },
      // 里程碑新建
      milestoneAllowed () {
        this.$refs.milestoneForm.init('add', '', this.roleType, this.inputForm.id, 'main', this.percentage, this.inputForm.endDate)
      },
      // 催办/督办
      urge () {
        this.$refs.opinionForm.init('add', '', this.roleType, this.inputForm.id)
      },
      init (method, id, role, roleType) {
        this.method = method
        this.roleType = role
        if (method === 'add') {
          this.title = `新建主任务`
        } else if (method === 'edit') {
          this.title = '修改主任务'
        } else if (method === 'view') {
          this.title = '查看主任务'
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
              url: `/maintask/mainTask/details?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              console.log(data)
              let arrs = data.mainTask.milestoneList
              for (let i = 0; i < arrs.length; i++) {
                arrs[i].schedule += '%'
              }
              data.mainTask.milestoneList = arrs
              let arr = data.mainTask.sonTaskList
              for (let i = 0; i < arr.length; i++) {
                arr[i].schedule += '%'
              }
              data.mainTask.sonTaskList = arr
              this.inputForm = this.recover(this.inputForm, data.mainTask)
              this.percentage = data.mainTask.schedule
              this.turnoverForm = this.recover(this.inputForm, data.mainTask)
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
      // 结束任务
      endTask () {
        this.$http({
          url: `/maintask/mainTask/endTask`,
          method: 'post',
          data: {
            id: this.inputForm.id
          }
        }).then(({data}) => {
          this.loading = false
          if (data && data.success) {
            this.visible = false
            this.$message.success(data.msg)
            this.$emit('refreshDataList')
            this.delayapplyDialog = false
          }
        })
      },
      // 关闭事件
      close () {
        this.visible = false
        /* if (this.roleType !== 'participant') {
          this.$emit('refreshDataList')
        } else {
          this.$emit('ByParticipant')
        } */
        this.$emit('refreshDataList')
      },
      // 右上角X关闭事件
      handleDialogClose () {
        this.visible = false
        this.$emit('refreshDataList')
      },
      submit (taskStatus) {
        this.$confirm(`确定领取该任务吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSubmit(taskStatus, '1')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消领取任务'
          })
        })
      },
      // 表单提交
      doSubmit (taskStatus) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/maintask/mainTask/accept`,
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
      },
      juJueReason (taskStatus) {
        this.$prompt('请输入拒绝原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (val) => {
            if (val === null || val.trim().length < 1) {
              return '拒绝原因不能为空'
            }
          }
        }).then(({value}) => {
          this.inputForm.reason = value
          this.juJue(taskStatus)
        }).catch(() => {
        })
      },
      // 拒绝任务
      juJue (taskStatus) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/maintask/mainTask/jujue`,
              method: 'post',
              data: {
                id: this.inputForm.id,
                reason: this.inputForm.reason
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
      },
      overseeOpinionView (optionId) {
        let mainTaskId = this.inputForm.id
        this.$refs.opinionForm.init('view', optionId, this.roleType, mainTaskId)
      },
      overseeOpinionEdit (optionId) {
        this.$refs.opinionForm.init('edit', optionId, this.roleType, this.inputForm.id)
      },
      // 确认完成
      confirmation (taskStatus) {
        this.$confirm(`确认完成该任务吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSubmit(taskStatus)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.dialogStyle {

  .el-dialog .el-dialog__body {
    overflow-x: hidden
  }
p{
  margin: 0;
  padding: 0;
}
}
</style>
