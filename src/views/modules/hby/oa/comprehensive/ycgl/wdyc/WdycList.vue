<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="cl" label="使用车辆">
        <el-select v-model="searchForm.cl" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in clflList"
            :key="item.id"
            :label="item.cph"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sqzt" label="状态">
        <el-select v-model="searchForm.sqzt" style="width: 100%;">
          <el-option v-for="item in $dictUtils.getDictList('SQZT')" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="bg-white top">
      <el-form size="small" >
        <el-form-item>
          <el-button type="primary" @click="ycsq()" size="small">用车申请</el-button>
          <el-button v-if="hasPermission('ycgl:clsq:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()">导出</el-button>
        </el-form-item>
      </el-form>
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
          prop="clxx.cph"
          show-overflow-tooltip
          sortable="custom"
          label="使用车辆">
          <template slot-scope="scope">
            <el-link  type="primary" :underline="false" v-if="hasPermission('ycgl:clsq:view')"  @click="viewClxx(scope.row.cl)">{{scope.row.clxx.cph}}</el-link>
            <span v-else>{{scope.row.clxx.cph}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="kssj"
          show-overflow-tooltip
          sortable="custom"
          label="用车时间">
        </el-table-column>
        <el-table-column
          prop="jsyName"
          show-overflow-tooltip
          sortable="custom"
          label="	驾驶员姓名">
        </el-table-column>
        <el-table-column
          prop="ycxz"
          show-overflow-tooltip
          sortable="custom"
          label="用车性质">
          <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("YCXZ", scope.row.ycxz, '-') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="sqzt"
          show-overflow-tooltip
          sortable="custom"
          label="状态">
          <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("SQZT", scope.row.sqzt, '-') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          show-overflow-tooltip
          sortable="custom"
          label="申请时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          :key="Math.random()"
          width="300"
          label="操作">
          <template  slot-scope="scope">
            <el-button type="text" icon="el-icon-again" size="small" @click="view(scope.row.id)">查看</el-button>
            <el-button type="text" v-if="scope.row.sqzt == '3'" icon="el-icon-again" size="small" @click="edit(scope.row.id)">再次用车</el-button>
            <el-button type="text" v-if="scope.row.sqzt == '3'" icon="el-icon-printer" size="small" @click="printer(scope.row.id)">打印派车单</el-button>
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
    <!--车辆信息-->
    <ClxxForm ref="clxxForm" @refreshDataList="refreshList"></ClxxForm>
    <!--打印派车单-->
    <PrinterForm ref="printerForm" @refreshDataList="refreshList"></PrinterForm>
    <!--车辆申请-->
    <ClsqForm ref="clsqForm" @refreshDataList="refreshList"></ClsqForm>
  </div>
</template>

<script>
import PrinterForm from './PrinterForm'
import ClxxForm from '../clxx/ClxxForm'
import ClsqForm from '../clsq/ClsqForm'
import UserSelect from '@/components/userSelect'
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import GridSelect from '@/components/gridSelect'
export default {
  data () {
    return {
      searchForm: {
        cl: '',
        sqzt: ''
      },
      dataList: [],
      clflList: [],
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
    PrinterForm,
    ClxxForm,
    ClsqForm,
    UserSelect,
    SelectTree,
    GridSelect
  },
  activated () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      // 获取车辆分类
      this.$http({
        url: `/ycgl/clxx/list`,
        method: 'get'
      }).then(({data}) => {
        this.clflList = data.page.list
      })
      this.$http({
        url: '/ycgl/clsq/list',
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
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.clsqForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.clsqForm.init('view', id)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    },
    // 查看车辆信息
    viewClxx (id) {
      this.$refs.clxxForm.init('view', id)
    },
    // 打印
    printer (id) {
      this.$refs.printerForm.init('printer', id)
    },
    // 车辆申请
    ycsq () {
      this.$refs.clsqForm.init('add', '')
    },
    exportExcel () {
      let params = {
        ...this.lodash.omit(this.searchForm)
      }
      this.$utils.download('/ycgl/wdyc/export', params)
    }
  }
}
</script>
