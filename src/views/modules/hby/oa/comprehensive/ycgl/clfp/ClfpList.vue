<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="clsq.cl" label="申请车辆">
        <el-select v-model="searchForm.clsq.cl" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in clflList"
            :key="item.id"
            :label="item.cph"
            :value="item.id"
            :clearable="true"
            :accordion="true">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="clsq.ycrbm" label="用车人部门">
        <SelectTree
          ref="office"
          :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
          url="/sys/office/treeData?type=2"
          :value="searchForm.clsq.ycrbm"
          :clearable="true"
          :accordion="true"
          @getValue="(value) => {searchForm.clsq.ycrbm=value}"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
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
          width="200"
          label="申请车辆">
          <template slot-scope="scope">
            <el-link  type="primary" :underline="false" v-if="hasPermission('ycgl:clsq:edit')" @click="edit(scope.row.id)">{{scope.row.clxx.cph}}</el-link>
            <el-link  type="primary" :underline="false" v-else-if="hasPermission('ycgl:clsq:view')"  @click="view(scope.row.id)">{{scope.row.clxx.cph}}</el-link>
            <span v-else>{{scope.row.clxx.cph}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="user.name"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="用车人姓名">
        </el-table-column>
        <el-table-column
          prop="office.name"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="用车人部门">
        </el-table-column>
        <el-table-column
          prop="clsq.ccrs"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="乘车人数">
        </el-table-column>
        <el-table-column
          prop="clsq.ycsy"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="用车事由">
        </el-table-column>
        <el-table-column
          prop="clsq.kssj"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="clsq.jssj"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="结束时间">
        </el-table-column>
        <el-table-column
          prop="clsq.cfd"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="出发地">
        </el-table-column>
        <el-table-column
          prop="clsq.mdd"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="目的地">
        </el-table-column>
        <el-table-column
          prop="clsq.sqzt"
          show-overflow-tooltip
          sortable="custom"
          width="200"
          label="申请状态">
          <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("SQZT", scope.row.clsq.sqzt, '-') }}
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
            <el-button type="text" icon="el-icon-again" size="small" @click="view(scope.row.clsq.id)">查看</el-button>
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
    <ClsqForm ref="clsqForm" @refreshDataList="refreshList"></ClsqForm>
  </div>
</template>

<script>
import ClsqForm from '../clsq/ClsqForm'
import UserSelect from '@/components/userSelect'
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import GridSelect from '@/components/gridSelect'
export default {
  data () {
    return {
      searchForm: {
        id: '',
        clxx: {
          cph: ''
        },
        office: {
          name: ''
        },
        user: {
          name: ''
        },
        clsq: {
          sqzt: '3',
          mdd: '',
          cfd: '',
          jssj: '',
          kssj: '',
          ycsy: '',
          ycxz: '',
          ccrs: '',
          jsydh: '',
          jsy: '',
          cl: '',
          ycrdh: '',
          ycrbm: '',
          ycr: ''
        }
      },
      spzt: '',
      glyspzt: '',
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
      // 获取车辆分类
      this.$http({
        url: `/ycgl/clxx/list`,
        method: 'get'
      }).then(({data}) => {
        console.log(data.page.list)
        this.clflList = data.page.list
      })
      this.loading = true
      this.$http({
        url: '/ycgl/clfp/list',
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
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
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
    // 查看
    view (id) {
      this.$refs.clsqForm.init('view', id)
    }
  }
}
</script>
