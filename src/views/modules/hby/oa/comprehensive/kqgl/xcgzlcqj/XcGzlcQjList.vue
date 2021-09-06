<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form info-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-row>
        <el-form-item prop="qjlx" label="请假类型">
          <el-select v-model="searchForm.qjlx">
            <el-option v-for="item in $dictUtils.getDictList('QJLX')" :label="item.label" :key="item.value" :value="item.value">{{item.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sqr" label="申请人">
          <el-input size="small" v-model="searchForm.sqr" placeholder="申请人" clearable></el-input>
        </el-form-item>
        <el-form-item prop="bm" label="部门">
               <el-input size="small" v-model="searchForm.bm" placeholder="部门" clearable></el-input>
        </el-form-item>
<!--      <el-form-item prop="gw" label="岗位">-->
<!--             <el-input size="small" v-model="searchForm.gw" placeholder="岗位" clearable></el-input>-->
<!--      </el-form-item>-->
      </el-row>
      <el-row>
      <el-form-item prop="qjsj" label="开始时间">
        <el-date-picker
             v-model="searchForm.qjsj"
             type="datetimerange"
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
      </el-row>
    </el-form>
      <div class="bg-white top">
      <el-row>
<!--        <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>-->
<!--        <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"-->
<!--         :disabled="dataListSelections.length != 1" plain>修改</el-button>-->
<!--        <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"-->
<!--                  :disabled="dataListSelections.length <= 0" plain>删除-->
<!--        </el-button>-->
        <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()">导出</el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      size="small"
      height="calc(90% - 80px)"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      @expand-change="detail"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
<!--      <el-table-column type="expand">-->
<!--      <template slot-scope="scope">-->
<!--      <el-tabs>-->
<!--            </el-tabs>-->
<!--      </template>-->
<!--      </el-table-column>-->
    <el-table-column
        prop="sqrName"
        show-overflow-tooltip
        label="申请人">
<!--            <template slot-scope="scope">-->
<!--              <el-link  type="primary" :underline="false" v-if="hasPermission('xcgzlcqj:xcGzlcQj:edit')" @click="edit(scope.row.id)">{{scope.row.sqrName}}</el-link>-->
<!--              <el-link  type="primary" :underline="false" v-else-if="hasPermission('xcgzlcqj:xcGzlcQj:view')"  @click="view(scope.row.id)">{{scope.row.sqrName}}</el-link>-->
<!--              <span v-else>{{scope.row.sqrName}}</span>-->
<!--            </template>-->
      </el-table-column>
    <el-table-column
        prop="bmName"
        show-overflow-tooltip
        label="部门">
      </el-table-column>
    <el-table-column
        prop="gwName"
        show-overflow-tooltip
        label="岗位">
      </el-table-column>
    <el-table-column
        prop="qjlx"
        show-overflow-tooltip
        :filters="dictData"
        :filter-method="filterHandler"
        label="请假类型">
        <template slot-scope="scope">
             {{ $dictUtils.getDictLabel("QJLX", scope.row.qjlx, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="qjsj"
        show-overflow-tooltip
        width="300"
        label="请假时间">
        <template slot-scope="scope">
          {{scope.row.qjkssj}} ~ {{scope.row.qjjssj}}
        </template>
      </el-table-column>
    <el-table-column
        prop="remarks"
        show-overflow-tooltip
        label="事由">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('xcgzlcqj:xcGzlcQj:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
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
    <el-dialog
      :visible.sync="visible"
      v-dialogDrag
      title="请假申请单"
      center>
      <XcGzlcQjForm  ref="xcGzlcQjForm" @refreshDataList="refreshList"></XcGzlcQjForm>
    </el-dialog>
  </div>
</template>

<script>
  import XcGzlcQjForm from './XcGzlcQjForm'
  import dictUtils from '@/utils/dictUtils'
  export default {
    data () {
      return {
        searchForm: {
          sqr: '',
          bm: '',
          gw: '',
          qjlx: '',
          qjsj: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        visible: false,
        dictData: []
      }
    },
    components: {
      XcGzlcQjForm
    },
    activated () {
      this.refreshList()
      this.initDictValue()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/xcgzlcqj/xcGzlcQj/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginQjsj: this.searchForm.qjsj[0],
            endQjsj: this.searchForm.qjsj[1],
            ...this.lodash.omit(this.searchForm, 'qjsj')  // （排除）因为上面已经把开始时间和结束时间定义了，所以要把qjsj排除出去
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
        this.$refs.xcGzlcQjForm.init('add', '')
      },
      // 修改
      edit (id) {
        this.visible = true
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xcGzlcQjForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.visible = true
        this.$nextTick(function () {
          this.$refs.xcGzlcQjForm.init('view', id)
        })
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
            url: '/xcgzlcqj/xcGzlcQj/delete',
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
     // 查看详情
      detail (row) {
        this.$http.get(`/xcgzlcqj/xcGzlcQj/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
            }
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
        this.$utils.download('/xcgzlcqj/xcGzlcQj/import/template')
      },
      exportExcel () {
        let params = {
          beginQjsj: this.searchForm.qjsj[0],
          endQjsj: this.searchForm.qjsj[1],
          ...this.lodash.omit(this.searchForm, 'qjsj')
        }
        this.$utils.download('/xcgzlcqj/xcGzlcQj/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      initDictValue () {
        // 初始化系统字典变量
        const d = []
        dictUtils.getDictList('QJLX').forEach(function (item) {
          d.push({
            'text': item.label,
            'value': item.value
          })
        })
        // console.log('d', d)
        this.dictData = d
      },
      filterHandler (value, row, column) {
        const property = column['property']
        return row[property] === value
      }
    }
  }
</script>


