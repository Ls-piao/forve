<template>
  <div class="el-scrollbar__wrap wrap-white padding-20">
    <el-tabs v-model="activeName" @tab-click="loadTab">
      <!--  列表视图Tab页开始-->
      <el-tab-pane label="列表视图" name="lbst">
        <el-card>
          <el-form size="small" :inline="true" class="searchForm" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
            <el-form-item prop="cl" label="车牌号" style="margin-left: 20px;">
              <GridSelect
                title="选择车牌号"
                labelName = 'cph'
                labelValue = 'id'
                :value = "searchForm.cl"
                :limit="1"
                @getValue='(value) => {searchForm.cl=value}'
                :columns="[
            {
              prop: 'cph',
              label: '车牌号'
            },
            {
              prop: 'pp',
              label: '品牌'
            }
            ]"
                :searchs="[
            {
              prop: 'cph',
              label: '车牌号'
            },
            {
              prop: 'pp',
              label: '品牌'
            }
            ]"
                dataListUrl="/ycgl/clxx/list"
                entityBeanName="clxx"
                queryEntityUrl="/ycgl/clxx/queryById">
              </GridSelect>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
              <el-button @click="resetSearch()" size="small">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="bg-white top" style="height: 450px">
            <el-row>
              <el-button type="primary" v-if="hasPermission('ycgl:clsq:add')" size="small" icon="el-icon-plus" @click="ycsq()">用车申请</el-button>
              <el-button  type="default" v-if="hasPermission('ycgl:clsq:export')" size="small" icon="el-icon-download" title="导出" @click="exportExcel()">导出</el-button>
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
                prop="user.name"
                show-overflow-tooltip
                align="center"
                width="150px"
                sortable="custom"
                label="用车人姓名">
              </el-table-column>
              <el-table-column
                prop="kssj"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="150px"
                label="用车开始时间">
              </el-table-column>
              <el-table-column
                prop="jssj"
                show-overflow-tooltip
                align="center"
                width="150px"
                sortable="custom"
                label="用车结束时间">
              </el-table-column>
              <el-table-column
                prop="createDate"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="150px"
                label="申请时间">
              </el-table-column>
              <el-table-column
                prop="clxx.cph"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="120px"
                label="车牌号">
              </el-table-column>
              <el-table-column
                prop="jsyName"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="150px"
                label="驾驶员姓名">
              </el-table-column>
              <el-table-column
                prop="glyName"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="150px"
                label="派车人">
              </el-table-column>
              <el-table-column
                prop="ycxz"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="120px"
                label="用车性质">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("YCXZ", scope.row.ycxz, '-') }}
                </template>
              </el-table-column>
              <el-table-column
                prop="sqzt"
                show-overflow-tooltip
                align="center"
                sortable="custom"
                width="150px"
                label="状态">
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
        </el-card>
      </el-tab-pane>
      <!--  列表视图Tab页结束-->
      <!--  日历视图Tab页开始-->
      <el-tab-pane label="日历视图" name="rlst">
        <YcrlRlList ref="ycrlRlList" @refreshDataList="refreshList"></YcrlRlList>
      </el-tab-pane>
      <!--  日历视图Tab页结束-->
    </el-tabs>
    <!--车辆申请-->
    <ClsqForm ref="clsqForm" @refreshDataList="refreshList"></ClsqForm>
  </div>
</template>

<script>
import YcrlRlList from './YcrlRlList'
import ClsqForm from '../clsq/ClsqForm'
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import GridSelect from '@/components/gridSelect'
export default {
  data () {
    return {
      activeName: 'lbst',
      searchForm: {
        flbh: {
          id: ''
        },
        sqzt: '3',
        gzState: '',
        dateStart: '',
        dateEnd: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false,
      count: 0
    }
  },
  components: {
    SelectTree,
    ClsqForm,
    YcrlRlList,
    GridSelect
  },
  activated () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/ycgl/clsq/ycrlList',
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
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/ycgl/clsq/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    },
    // 按需加载后端数据[tab]
    loadTab (tab, event) {
      if (tab.name === 'lbst') {  // 排版设置
        this.refreshList()
      } else if (tab.name === 'rlst') {  // 节假日设置
        this.$refs.ycrlRlList.refreshList()
      }
    },
    // 查看
    view (id) {
      this.$refs.clsqForm.init('view', id)
    },
    // 车辆申请
    ycsq () {
      this.$refs.clsqForm.init('add', '')
    }
  }
}
</script>
<style>
.searchForm {
  background-color: #ffffff;
}
.is-selected {
  color: #1989FA;
}
</style>
