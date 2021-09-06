<template>
  <div class="page">
    <div class="bg-white top">
      <el-row>
        <el-button-group class="pull-right">
          <el-button v-if="hasPermission('kqgl:kqjl:xcKqglKqjl:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
          <el-button
            type="default"
            size="small"
            icon="el-icon-refresh"
            @click="refreshList">
          </el-button>
        </el-button-group>
      </el-row>
      <el-table
        :data="dataList"
        size="small"
        height="calc(100% - 80px)"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        class="table">
        <el-table-column
          prop="checkUser.name"
          show-overflow-tooltip
          sortable="custom"
          label="考勤人员">
        </el-table-column>
        <el-table-column
          prop="dataStart"
          show-overflow-tooltip
          sortable="custom"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="dateEnd"
          show-overflow-tooltip
          sortable="custom"
          label="结束时间">
        </el-table-column>
        <el-table-column
          prop="checkWork"
          show-overflow-tooltip
          sortable="custom"
          label="考勤情况">
          <template slot-scope="scope">
            <span v-if="scope.row.checkWork == '正常'" style="color: #68d391">{{scope.row.checkWork}}</span>
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

  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
export default {
  data () {
    return {
      searchForm: {
        checkWork: '',
        flbh: {
          id: ''
        }
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
    SelectTree
  },
  activated () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/kqgl/kqjl/xcKqglKqjl/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
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
      this.$refs.xcKqglKqjlForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.xcKqglKqjlForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.xcKqglKqjlForm.init('view', id)
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
          url: '/kqgl/kqjl/xcKqglKqjl/delete',
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
      this.$utils.download('/kqgl/kqjl/xcKqglKqjl/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/kqgl/kqjl/xcKqglKqjl/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
