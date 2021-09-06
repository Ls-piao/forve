<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <!-- 搜索框-->
      <el-form-item prop="applyUser">
        <user-select :limit='1' size="small" placeholder="请选择申请人" :value="searchForm.applyUser" @getValue='(value) => {searchForm.applyUser=value}'></user-select>
      </el-form-item>
      <el-form-item prop="applyOffice">
        <el-input size="small" v-model="searchForm.applyOffice" placeholder="所属单位" clearable></el-input>
      </el-form-item>
      <el-form-item prop="applyDept">
        <el-input size="small" v-model="searchForm.applyDept" placeholder="所属部门" clearable></el-input>
      </el-form-item>
      <el-form-item prop="applyDate">
        <el-date-picker
          v-model="searchForm.applyDate"
          type="daterange"
          size="small"
          align="right"
          value-format="yyyy-MM-dd hh:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <el-table
        :data="dataList"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        size="small"
        height="calc(100% - 80px)"
        @expand-change="detail"
        class="table">
        <el-table-column
          type=""
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userName"
          show-overflow-tooltip
          sortable="custom"
          label="申请人">
        </el-table-column>
        <el-table-column
          prop="applyDept"
          show-overflow-tooltip
          sortable="custom"
          label="部门">
        </el-table-column>
        <el-table-column
          prop="applyOffice"
          show-overflow-tooltip
          sortable="custom"
          label="单位">
        </el-table-column>
        <el-table-column
          prop="applyDate"
          show-overflow-tooltip
          sortable="custom"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="applyContent"
          show-overflow-tooltip
          sortable="custom"
          label="领用说明">
        </el-table-column>
        <el-table-column
          prop="remarks"
          show-overflow-tooltip
          sortable="custom"
          label="备注信息">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          :key="Math.random()"
          width="200"
          label="操作">
          <template  slot-scope="scope">
            <el-button type="text" icon="el-icon-s-marketing" size="small" @click="todo(scope.row)">办理</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <!--    <XmjbxxForm  ref="xmjbxxForm" @refreshDataList="refreshList"></XmjbxxForm>-->
  </div>
</template>

<script>
import GridSelect from '@/components/gridSelect'
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import UserSelect from '@/components/userSelect'
import pick from 'lodash.pick'
export default {
  data () {
    return {
      searchForm: {
        applyUser: '',
        applyOffice: '',
        applyDept: '',
        applyDate: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false
    }
  },
  components: {
    GridSelect,
    SelectTree,
    UserSelect
  },
  activated () {
    this.refreshList()
  },
  methods: {
    detail (row) {
    },
    todo (row) {
      var title1 = '用品申请审批'
      this.$http.get('/flowable/task/getTaskDef', {params: {
        taskId: row.taskId,
        taskName: title1,
        taskDefKey: row.key,
        procInsId: row.procInsId,
        procDefId: row.def,
        procDefKey: row.df,
        status: 'todo'
      }}).then(({data}) => {
        if (data.success) {
          this.$router.push({
            path: '/flowable/task/TaskForm',
            query: {formTitle: title1, title: title1, redirectUrl: '/hby/oa/assets/ypgl/ypsq/ArticlesSp', ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
          })
        }
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/ypgl/ypsq/articlesApply/findSpList',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          beginApplyDate: this.searchForm.applyDate[0],
          endApplyDate: this.searchForm.applyDate[1],
          ...this.lodash.omit(this.searchForm, 'applyDate')
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

    // 排序
    sortChangeHandle (obj) {
      if (obj.order === 'ascending') {
        this.orderBy = obj.prop + ' asc'
      } else if (obj.order === 'descending') {
        this.orderBy = obj.prop + ' desc'
      } else {
        this.orderBy = ''
      }
      this.refreshList()
    },
    // 新增
    add () {
      this.$refs.xmjbxxForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.xmjbxxForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.xmjbxxForm.init('view', id)
    },
    // 删除
    del (id) {
      let ids = id || this.dataListSelections.map(item => {
        return item.id
      }).join(',')
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/xmgl/xmxx/xmjbxx/delete',
          method: 'delete',
          params: {'ids': ids}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
          this.loading = false
        })
      })
    },

    // 导入成功
    uploadSuccess (res, file) {
      if (res.success) {
        this.$message.success({dangerouslyUseHTMLString: true,
          message: res.msg})
      } else {
        this.$message.error(res.msg)
      }
    },
    // 下载模板
    downloadTpl () {
      this.$utils.download('/xmgl/xmxx/xmjbxx/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/xmgl/xmxx/xmjbxx/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.LxrqRange = []
      this.searchForm.beginLxrq = ''
      this.searchForm.endLxrq = ''
      this.refreshList()
    }
  }
}
</script>
