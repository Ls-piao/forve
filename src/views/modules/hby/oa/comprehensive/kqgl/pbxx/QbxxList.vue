<template>
    <div class="page">
      <div class="bg-white top">
      <el-row v-show="show">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
                   :disabled="dataListSelections.length !== 1" plain>修改</el-button>
        <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('kqgl:pbxx:qbxx:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
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
        prop="personName"
        show-overflow-tooltip
        width="100"
        label="人员">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" @click="view(scope.row.id)">{{scope.row.personName}}</el-link>
            </template>
      </el-table-column>
      <el-table-column
        prop="startDate"
        show-overflow-tooltip
        width="150"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endDate"
        show-overflow-tooltip
        width="150"
        label="结束时间">
      </el-table-column>
    <el-table-column
        prop="remarks"
        show-overflow-tooltip
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
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <QbxxForm  ref="qbxxForm" @refreshDataList="refreshList"></QbxxForm>
  </div>
</template>

<script>
  import QbxxForm from './QbxxForm'
  export default {
    data () {
      return {
        searchForm: {
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dateParam: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        show: false,
        clickDate: ''
      }
    },
    components: {
      QbxxForm
    },
    // activated () {
    //   this.refreshList()
    // },
    methods: {
      // 获取数据列表
      refreshList (date) {
        if (date !== undefined) { // 过滤不是点击日期块进入
          this.dateParam = date
        }
        // 判断操作栏是否显示
        this.clickDate = date
        this.show = new Date(parseInt(this.clickDate.slice(0, 4)), parseInt(this.clickDate.slice(5, 7)) - 1, parseInt(this.clickDate.slice(8, 10))) >= new Date()
        this.$nextTick(() => {
          this.loading = true
          this.$http({
            url: `/kqgl/pbxx/qbxx/queryByDay`,
            methods: 'get',
            params: {
              startDate: this.dateParam
            }
          }).then(({data}) => {
            if (data && data.success) {
              this.dataList = data.page.list
              this.total = data.page.count
              this.loading = false
            }
          })
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
        this.$refs.qbxxForm.init('add', '', this.dateParam)
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.qbxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.qbxxForm.init('view', id)
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
            url: '/kqgl/pbxx/qbxx/delete',
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
        this.$utils.download('/kqgl/pbxx/qbxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/kqgl/pbxx/qbxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
