<template>
  <div>
    <el-drawer
      title="操作记录列表"
      size="50%"
      :append-to-body="true"
      :direction="direction"
      :visible.sync="visible">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item prop="createDate">
          <el-date-picker
            v-model="searchForm.createDate"
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
          <el-button type="primary" @click="refreshList('')" size="small" icon="el-icon-search">查询</el-button>
          <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="bg-white top">
        <el-row>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add()" :disabled="dataListSelections.length !== 2" plain>数据比较</el-button>
          <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList('')">
            </el-button>
          </el-button-group>
        </el-row>
        <el-table
          :data="dataList"
          size="small"
          height="700"
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
            prop="createDate"
            show-overflow-tooltip
            sortable="custom"
            label="创建日期">
          </el-table-column>
          <el-table-column
            prop="dataVersion"
            show-overflow-tooltip
            sortable="custom"
            label="版本">
          </el-table-column>
          <el-table-column
            prop="dataContent"
            show-overflow-tooltip
            sortable="custom"
            label="数据内容">
          </el-table-column>
          <el-table-column
            prop="createBy.name"
            show-overflow-tooltip
            sortable="custom"
            label="创建人">
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
    </el-drawer>
    <data-log-form ref="dataLogForm"></data-log-form>
  </div>
</template>

<script>
import DataLogForm from '@/views/modules/hby/oa/assets/ypgl/ypwh/DataLogForm'
export default {
  data () {
    return {
      direction: 'rtl',
      visible: false,
      searchForm: {
        method: '',
        createDate: ''
      },
      dataList: [],
      loading: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      dataListSelections: [],
      dataId: ''
    }
  },
  components: {
    DataLogForm
  },
  // activated () {
  //   this.refreshList()
  // },
  methods: {
    // 获取数据列表
    refreshList (dataId) {
      this.visible = true
      this.loading = true
      if (dataId !== '') {
        this.dataId = dataId
      }
      this.$http({
        url: '/datalog/zcglDataLog/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          dataId: this.dataId,
          beginCreateDate: this.searchForm.createDate[0],
          endCreateDate: this.searchForm.createDate[1],
          ...this.lodash.omit(this.searchForm, 'createDate')
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
      this.refreshList('')
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshList('')
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
      this.refreshList('')
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList('')
    },
    add () {
      if (!this.dataListSelections || this.dataListSelections.length !== 2) {
        this.$message.warning('请选择两条数据')
        return false
      } else {
        let dataId = this.dataListSelections[0].dataId
        let dataTable = this.dataListSelections[0].dataTable
        let id1 = this.dataListSelections[0].id
        let id2 = this.dataListSelections[1].id
        this.$refs.dataLogForm.init(dataId, dataTable, id1, id2)
      }
    }
  }
}
</script>

<style scoped>

</style>
