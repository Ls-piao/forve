<template>
    <div class="page">
      <el-form size="small" :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
          <!-- 搜索框-->
           <el-form-item prop="whlx" label="维护类型">
              <el-select v-model="searchForm.whlx" placeholder="请选择维护类型" size="small" style="width: 100%;">
                <el-option
                  v-for="item in $dictUtils.getDictList('WHLX')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList(this.searchForm.clid)" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()" :disabled="dataListSelections.length <= 0" plain>删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="refreshList('')">刷新</el-button>
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="whkssj"
        show-overflow-tooltip
        sortable="custom"
        :picker-options="editStartOptions">
        label="开始时间">
      </el-table-column>
    <el-table-column
        prop="whjssj"
        show-overflow-tooltip
        sortable="custom"
        :picker-options="editStopOptions"
        label="结束时间">
      </el-table-column>
    <el-table-column
        prop="whlx"
        show-overflow-tooltip
        sortable="custom"
        label="维护类型">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("WHLX", scope.row.whlx, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="whfy"
        show-overflow-tooltip
        sortable="custom"
        label="维护费用">
      </el-table-column>
    <el-table-column
        prop="whxm"
        show-overflow-tooltip
        sortable="custom"
        label="维护项目">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="100"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
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
    <YcwhForm  ref="ycwhForm" @refreshDataList="refreshList"></YcwhForm>
  </div>
</template>

<script>
  import YcwhForm from './YcwhForm'
  export default {
    data () {
      return {
        searchForm: {
          whkssj: '',
          whjssj: '',
          clid: '',
          whlx: ''
        },
        editStartOptions: {
          disabledDate: time => {
            if (!this.inputForm.whjssj) {
              return time.getTime() < new Date(1970 - 1 - 1).getTime()
            } else {
              return time.getTime() > new Date(this.inputForm.whjssj)
            }
          }
        },
        editStopOptions: {
          disabledDate: time => {
            return (
              time.getTime() < new Date(this.inputForm.whkssj) ||
              time.getTime() < new Date(1970 - 1 - 1).getTime()    // 禁止选择1970年以前的日期
            )
          }
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        isSearchCollapse: false,
        loading: false
      }
    },
    components: {
      YcwhForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList (clid) {
        if (clid !== '') {
          this.searchForm.clid = clid
        }
        console.log(this.searchForm.clid + '---------------')
        this.loading = true
        this.$http({
          url: '/ycgl/ycwh/list',
          method: 'get',
          params: {
            'clid': this.searchForm.clid,
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
        this.refreshList(this.searchForm.clid)
      },
      // 新增
      add () {
        this.$refs.ycwhForm.init('add', '', this.searchForm.clid)
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.ycwhForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.ycwhForm.init('view', id)
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
            url: '/ycgl/ycwh/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList(this.searchForm.clid)
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
        this.$utils.download('/ycgl/ycwh/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/ycgl/ycwh/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
