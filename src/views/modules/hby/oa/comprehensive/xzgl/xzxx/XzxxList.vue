<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
          <!-- 搜索框-->
          <el-form-item prop="name">
                <el-input size="small" v-model="searchForm.name" placeholder="协作主题" clearable></el-input>
         </el-form-item>
         <el-form-item prop="fl.id">
            <el-select v-model="searchForm.fl.id" style="width:100%" placeholder="协作分类">
              <el-option
                v-for="xzfl in flList"
                :key="xzfl.id"
                :label="xzfl.name"
                :value="xzfl.id">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="type">
            <el-select v-model="searchForm.type" placeholder="协作类型"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('XZ_TYPE')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="state">
            <el-select v-model="searchForm.state" placeholder="协作状态"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('XZ_STATE')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('xzgl:xzxx:xzxx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('xzgl:xzxx:xzxx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('xzgl:xzxx:xzxx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
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
        prop="name"
        show-overflow-tooltip
        sortable="custom"
        label="协作主题">
      </el-table-column>
      <el-table-column
        prop="fl.name"
        show-overflow-tooltip
        sortable="custom"
        label="协作分类">
      </el-table-column>
    <el-table-column
        prop="type"
        show-overflow-tooltip
        sortable="custom"
        label="协作类型">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XZ_TYPE", scope.row.type, "")}}
        </template>
      </el-table-column>
    <el-table-column
        prop="fzr.name"
        show-overflow-tooltip
        sortable="custom"
        label="协作负责人">
      </el-table-column>
    <el-table-column
        prop="start"
        show-overflow-tooltip
        sortable="custom"
        label="开始时间">
      </el-table-column>
    <el-table-column
        prop="end"
        show-overflow-tooltip
        sortable="custom"
        label="结束时间">
      </el-table-column>
    <el-table-column
        prop="state"
        show-overflow-tooltip
        sortable="custom"
        label="协作状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '0'" size="small">未完成</el-tag>
          <el-tag v-else-if="scope.row.state === '1'" size="small" type="success">已归档</el-tag>
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
          <el-button v-if="hasPermission('xzgl:xzxx:xzxx:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('xzgl:xzxx:xzxx:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('xzgl:xzxx:xzxx:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <XzxxForm  ref="xzxxForm" @refreshDataList="refreshList"></XzxxForm>
  </div>
</template>

<script>
  import XzxxForm from './XzxxForm'
  import GridSelect from '@/components/gridSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        flList: [],
        searchForm: {
          fl: {
            id: ''
          },
          name: '',
          type: '',
          deptIds: {
            id: ''
          },
          state: ''
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
      XzxxForm
    },
    activated () {
      this.$http({
        url: `/xzgl/xzfl/xzfl/listForCheck?pageNo=1&pageSize=-1`,
        method: 'get'
      }).then(({data}) => {
        this.flList = data.page.list
      })
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/xzgl/xzxx/xzxx/list',
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
        this.$refs.xzxxForm.activeName = 'first'
        this.$refs.xzxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xzxxForm.activeName = 'first'
        this.$refs.xzxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xzxxForm.activeName = 'first'
        this.$refs.xzxxForm.init('view', id)
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
            url: '/xzgl/xzxx/xzxx/delete',
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
        this.$utils.download('/xzgl/xzxx/xzxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xzgl/xzxx/xzxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>