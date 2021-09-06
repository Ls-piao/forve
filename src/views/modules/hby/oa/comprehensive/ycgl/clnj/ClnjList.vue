<template>
    <div class="page">
      <el-form size="small" :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="njkssj" label="年检时间">
               <el-date-picker
                    v-model="searchForm.njkssj"
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
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
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
        prop="njkssj"
        show-overflow-tooltip
        sortable="custom"
        label="年检开始时间">
      </el-table-column>
    <el-table-column
        prop="njjssj"
        show-overflow-tooltip
        sortable="custom"
        label="年检结束时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
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
    <ClnjForm  ref="clnjForm" @refreshDataList="refreshList"></ClnjForm>
  </div>
</template>

<script>
  import ClnjForm from './ClnjForm'
  export default {
    data () {
      return {
        searchForm: {
          clid: '',
          njkssj: '',
          njjssj: ''
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
      ClnjForm
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
        this.loading = true
        this.$http({
          url: '/ycgl/clnj/list',
          method: 'get',
          params: {
            'clid': this.searchForm.clid,
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginNjkssj: this.searchForm.njkssj[0],
            endNjkssj: this.searchForm.njkssj[1],
            ...this.lodash.omit(this.searchForm, 'njkssj')
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
        this.$refs.clnjForm.init('add', '', this.searchForm.clid)
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.clnjForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.clnjForm.init('view', id)
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
            url: '/ycgl/clnj/delete',
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
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
