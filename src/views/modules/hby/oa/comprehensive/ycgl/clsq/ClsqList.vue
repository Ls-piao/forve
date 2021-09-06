<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item prop="cl" label="申请车辆">
          <el-select v-model="searchForm.cl" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in clflList"
              :key="item.id"
              :label="item.cph"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ycrbm" label="用车人部门">
          <SelectTree
            ref="office"
            :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
            url="/sys/office/treeData?type=2"
            :value="searchForm.ycrbm"
            :clearable="true"
            :accordion="true"
            @getValue="(value) => {searchForm.ycrbm=value}"/>
        </el-form-item>
        <el-form-item prop="sqzt" label="申请状态">
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
      <el-row>
        <el-button v-if="hasPermission('ycgl:clsq:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('ycgl:clsq:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('ycgl:clsq:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
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
        width="100">
      </el-table-column>
      <el-table-column
        prop="clxx.cph"
        show-overflow-tooltip
        sortable="custom"
        width="100"
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
        width="120"
        label="用车人姓名">
      </el-table-column>
      <el-table-column
        prop="office.name"
        show-overflow-tooltip
        sortable="custom"
        width="120"
        label="用车人部门">
      </el-table-column>
      <el-table-column
        prop="ccrs"
        show-overflow-tooltip
        sortable="custom"
        width="120"
        label="乘车人数">
      </el-table-column>
      <el-table-column
        prop="ycsy"
        show-overflow-tooltip
        sortable="custom"
        width="120"
        label="用车事由">
      </el-table-column>
      <el-table-column
        prop="kssj"
        show-overflow-tooltip
        sortable="custom"
        width="200"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="jssj"
        show-overflow-tooltip
        sortable="custom"
        width="200"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="cfd"
        show-overflow-tooltip
        sortable="custom"
        width="120"
        label="出发地">
      </el-table-column>
      <el-table-column
        prop="mdd"
        show-overflow-tooltip
        sortable="custom"
        width="120"
        label="目的地">
      </el-table-column>
      <el-table-column
        prop="sqzt"
        show-overflow-tooltip
        sortable="custom"
        width="120"
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
          <el-button v-if="hasPermission('ycgl:clsq:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('ycgl:clsq:edit') && scope.row.sqzt == '1'" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('ycgl:clsq:del') && scope.row.sqzt == '1'" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <ClsqForm  ref="clsqForm" @refreshDataList="refreshList"></ClsqForm>
  </div>
</template>

<script>
  import ClsqForm from './ClsqForm'
  import UserSelect from '@/components/userSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        searchForm: {
          sqzt: '',
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
          ycr: '',
          clxx: {
            cph: ''
          },
          office: {
            name: ''
          },
          user: {
            name: ''
          }
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
          this.clflList = data.page.list
        })
        this.loading = true
        this.$http({
          url: '/ycgl/clsq/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginJssj: this.searchForm.jssj[0],
            endJssj: this.searchForm.jssj[1],
            beginKssj: this.searchForm.kssj[0],
            endKssj: this.searchForm.kssj[1],
            ...this.lodash.omit(this.searchForm, 'jssj', 'kssj')
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
        this.$refs.clsqForm.init('add', '')
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
            url: '/ycgl/clsq/delete',
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
        this.$utils.download('/ycgl/clsq/import/template')
      },
      exportExcel () {
        let params = {
          beginJssj: this.searchForm.jssj[0],
          endJssj: this.searchForm.jssj[1],
          beginKssj: this.searchForm.kssj[0],
          endKssj: this.searchForm.kssj[1],
          ...this.lodash.omit(this.searchForm, 'jssj', 'kssj')
        }
        this.$utils.download('/ycgl/clsq/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
