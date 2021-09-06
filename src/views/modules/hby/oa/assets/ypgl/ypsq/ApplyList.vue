<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <el-form-item prop="searchDates" label="创建时间">
        <el-date-picker
          v-model="searchDates"
          type="daterange"
          size="small"
          align="right"
          value-format="yyyy-MM-dd hh:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <el-row>
        <el-button-group class="pull-right">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>
      <el-table
        :data="dataList"
        size = "small"
        v-loading="loading"
        height="calc(100% - 80px)"
        @selection-change="selectionChangeHandle"
        class="table">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="applyUser"
          show-overflow-tooltip
          label="申请人">
        </el-table-column>
        <el-table-column
          prop="applyDate"
          show-overflow-tooltip
          label="申请时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.applyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="processVo.taskName"
          show-overflow-tooltip
          label="当前节点">
        </el-table-column>
        <el-table-column
          prop="processVo.status"
          show-overflow-tooltip
          label="流程状态">
          <template slot-scope="scope">
            <el-tag  :type="scope.row.processVo.level"   effect="dark" size="small">{{scope.row.processVo.status}} </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="processVo.startTime"
          show-overflow-tooltip
          min-width="180px"
          label="发起时间 / 结束时间">
          <template slot-scope="scope">
            {{scope.row.processVo.startTime | formatDate}} -
            {{scope.row.processVo.endTime | formatDate}}
          </template>
        </el-table-column>

        <el-table-column
          width="150"
          header-align="center"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button  type="text" size="small" @click="detail(scope.row.processVo)">历史</el-button>
            <el-dropdown  size="small" style=" margin-left: 10px;">
              <el-button type="text" size="small">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item v-if="scope.row.processVo.code === 1" ><el-button type="text"  size="small" @click="urge(scope.row.processVo)">催办</el-button></el-dropdown-item>
                <el-dropdown-item v-if="scope.row.processVo.code === 1"><el-button type="text"  size="small" @click="revoke(scope.row.processVo)">撤销</el-button></el-dropdown-item>
                <el-dropdown-item v-if="scope.row.processVo.code === 3 || scope.row.processVo.code === 4"><el-button  type="text" color="red"  size="small" @click="restart(scope.row.processVo)">编辑</el-button></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog
      title="查看流程历史"
      :close-on-click-modal="true"
      :visible.sync="visible"
      v-dialogDrag
      height="600px">

      <iframe :src="processPhotoUrl" frameborder="0" scrolling="auto" width="100%" height="600px"></iframe>
    </el-dialog>
    <urge-form ref="urgeForm"></urge-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import UrgeForm from './UrgeForm'
export default {
  data () {
    return {
      searchForm: {
        beginDate: '',
        endDate: ''
      },
      searchDates: '',
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      visible: false,
      dataListSelections: [],
      processPhotoUrl: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  components: {
    UrgeForm
  },
  activated () {
    this.refreshList()
  },
  watch: {
    searchDates () {
      if (this.searchDates) {
        this.searchForm.beginDate = this.searchDates[0]
        this.searchForm.endDate = this.searchDates[1]
      } else {
        this.searchForm.beginDate = ''
        this.searchForm.endDate = ''
      }
    }
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/ypgl/ypsq/articlesApply/myApplyed',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          ...this.searchForm
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.refreshList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    trace (row) {
      this.processPhotoUrl = `${this.$http.BASE_URL}/flowable/task/trace/photo/${row.processInstanceId}`
      this.visible = true
    },
    detail (row) {
      this.$http.get('/flowable/task/getTaskDef', {params: {
        procInsId: row.processInstanceId,
        procDefId: row.processDefinitionId
      }}).then(({data}) => {
        if (data.success) {
          this.$router.push({
            path: '/flowable/task/TaskFormDetail',
            query: {readOnly: true, title: row.vars.title, formTitle: row.vars.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
          })
        }
      })
    },
    // 重新填写
    restart (row) {
      // 读取流程表单
      this.$http.get('/flowable/task/getTaskDef', {params: {
        procInsId: row.processInstanceId,
        procDefId: row.processDefinitionId
      }}).then(({data}) => {
        if (data.success) {
          this.$router.push({
            path: '/flowable/task/TaskFormEdit',
            query: {status: 'start', title: row.vars.title, formTitle: row.vars.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
          })
        }
      })
    },
    // 撤销申请
    revoke (row) {
      this.$confirm(`确定要撤销该流程吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/flowable/process/revokeProcIns', {'id': row.processInstanceId}).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
        })
      })
    },
    urge (row) {
      this.$refs.urgeForm.init()
    },
    resetSearch () {
      this.searchDates = ''
      this.$refs.searchForm.resetFields()
      this.$nextTick(() => {
        this.refreshList()
      })
    }
  }
}
</script>
<style>
p {
  margin: 0;
  padding: 0;
}

.text-grey {
  color: #999!important;
}
</style>
