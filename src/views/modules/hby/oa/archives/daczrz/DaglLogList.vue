<template>
  <div>
    <el-dialog
      title="操作日志"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <div class="bg-white top">
        <el-table
          :data="dataList"
          size="small"
          width="900px"
          height="400px"
          @selection-change="selectionChangeHandle"
          @sort-change="sortChangeHandle"
          v-loading="loading"
          class="table">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="operType"
            show-overflow-tooltip
            label="操作类型">
          </el-table-column>
          <el-table-column
            prop="createBy.name"
            show-overflow-tooltip
            label="操作人">
          </el-table-column>
          <el-table-column
            prop="createDate"
            show-overflow-tooltip
            sortable="custom"
            label="操作时间">
          </el-table-column>
          <el-table-column
            prop="operIp"
            show-overflow-tooltip
            sortable="custom"
            label="操作ip">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import DaCzrzForm from './DaCzrzForm'
  export default {
    data () {
      return {
        searchForm: {
          operModule: '',
          operBusiId: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        visible: false,
        loading: false
      }
    },
    components: {
      DaCzrzForm
    },
    // activated () {
    //   this.refreshList()
    // },
    methods: {
      init (id) {
        this.visible = true
        this.searchForm.operBusiId = id
        this.refreshList()
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/dagl/daczrz/list',
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
        this.$refs.daCzrzForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.daCzrzForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.daCzrzForm.init('view', id)
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
            url: '/dagl/daczrz/delete',
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
        this.$utils.download('/dagl/daczrz/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/dagl/daczrz/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
