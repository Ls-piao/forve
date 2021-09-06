<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item prop="hyzt">
          <el-input size="small" v-model="searchForm.hyzt" placeholder="会议主题" clearable></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('hygl:hygl:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="refreshList">刷新</el-button>
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
        prop="hyzt"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="会议主题">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('hygl:hygl:edit')" @click="edit(scope.row.id)">{{scope.row.hyzt}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('hygl:hygl:view')"  @click="view(scope.row.id)">{{scope.row.hyzt}}</el-link>
              <span v-else>{{scope.row.hyzt}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="chfs"
        show-overflow-tooltip
        sortable="custom"
        width="120px"
        label="参会方式">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("CHFS", scope.row.chfs, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="hysgl.hysmc"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="会议室">
      </el-table-column>
    <el-table-column
        prop="xcBgzxLjfl.name"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="会议类型">
      </el-table-column>
    <el-table-column
        prop="kssj"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="开始时间">
      </el-table-column>
    <el-table-column
        prop="jssj"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="结束时间">
      </el-table-column>
    <el-table-column
        prop="sfqyhyqd"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="会议签到">
      <template slot-scope="scope">
        {{ $dictUtils.getDictLabel("SFQYHYQD", scope.row.sfqyhyqd, '-') }}
      </template>
      </el-table-column>
    <el-table-column
        prop="user.name"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="参见人员">
      </el-table-column>
    <el-table-column
        prop="chkhz.name"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="参加客户">
      </el-table-column>
      <el-table-column
        prop="sqzt"
        show-overflow-tooltip
        sortable="custom"
        width="150px"
        label="申请状态">
        <template slot-scope="scope">
          {{ $dictUtils.getDictLabel("SQZT", scope.row.sqzt, '-') }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('hygl:hygl:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('hygl:hygl:edit') && scope.row.sqzt === '1'" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('hygl:hygl:del') && scope.row.sqzt === '1'" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
          <el-button v-if="hasPermission('hygl:hygl:edit') && (scope.row.sqzt === '5' || scope.row.sqzt === '4')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">再次申请</el-button>
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
    <HyglForm  ref="hyglForm" @refreshDataList="refreshList"></HyglForm>
  </div>
</template>

<script>
  import HyglForm from './HyglForm'
  export default {
    data () {
      return {
        searchForm: {
          hyzt: ''
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
      HyglForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/hygl/hygl/list',
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
        this.$refs.hyglForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.hyglForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.hyglForm.init('view', id)
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
            url: '/hygl/hygl/delete',
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
        this.$utils.download('/hygl/hygl/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/hygl/hygl/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
