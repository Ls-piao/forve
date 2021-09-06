<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
          <el-form-item prop="cph" label="车牌号">
            <el-input size="small" v-model="searchForm.cph" placeholder="请输入车牌号" clearable></el-input>
          </el-form-item>
          <el-form-item prop="clfl" label="车辆分类">
              <el-select v-model="searchForm.clfl" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in clflList"
                  :key="item.id"
                  :label="item.flmc"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="cllx" label="车辆类型">
            <el-select v-model="searchForm.cllx" style="width: 100%;" placeholder="请输入车辆类型">
              <el-option v-for="item in $dictUtils.getDictList('CLLX')" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="clzt" label="车辆状态">
            <el-select v-model="searchForm.clzt" style="width: 100%;" placeholder="请输入车辆状态">
              <el-option v-for="item in $dictUtils.getDictList('CLZT')" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('ycgl:clxx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
        <el-button v-if="hasPermission('ycgl:ycwh:list')" type="success" size="small" @click="ycwhList()" :disabled="dataListSelections.length != 1" plain>用车维护</el-button>
        <el-button v-if="hasPermission('ycgl:clbx:list')" type="info" size="small" @click="clbxList()" :disabled="dataListSelections.length != 1" plain>车辆保险</el-button>
        <el-button v-if="hasPermission('ycgl:clnj:list')" type="warning" size="small" @click="clnjList()" :disabled="dataListSelections.length != 1" plain>车辆年检</el-button>
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
        prop="cph"
        show-overflow-tooltip
        sortable="custom"
        label="车牌号">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('ycgl:clxx:edit')" @click="edit(scope.row.id)">{{scope.row.cph}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('ycgl:clxx:view')"  @click="view(scope.row.id)">{{scope.row.cph}}</el-link>
              <span v-else>{{scope.row.cph}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="flmc"
        show-overflow-tooltip
        sortable="custom"
        label="车辆分类">
      </el-table-column>
    <el-table-column
        prop="cllx"
        show-overflow-tooltip
        sortable="custom"
        label="车辆类型">
        <template slot-scope="scope">
          {{ $dictUtils.getDictLabel("CLLX", scope.row.cllx, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="pp"
        show-overflow-tooltip
        sortable="custom"
        label="品牌">
      </el-table-column>
    <el-table-column
        prop="xh"
        show-overflow-tooltip
        sortable="custom"
        label="型号">
      </el-table-column>
    <el-table-column
        prop="zws"
        show-overflow-tooltip
        sortable="custom"
        label="座位数">
      </el-table-column>
    <el-table-column
        prop="gcrq"
        show-overflow-tooltip
        sortable="custom"
        label="购车日期">
      </el-table-column>
    <el-table-column
        prop="clzt"
        show-overflow-tooltip
        sortable="custom"
        label="车辆状态">
        <template slot-scope="scope">
          {{ $dictUtils.getDictLabel("CLZT", scope.row.clzt, '-') }}
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
          <el-button v-if="hasPermission('ycgl:clxx:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('ycgl:clxx:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">编辑</el-button>
          <el-button v-if="hasPermission('ycgl:clxx:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <!--车辆维护-->
    <el-drawer
      :title="`车辆维护列表，所属车辆: ${this.cl1}`"
      size = "700px"
      :visible.sync="rightVisible1"
      direction="rtl">
      <YcwhList ref="ycwhList" @closeRight="closeRight1"></YcwhList>
    </el-drawer>
    <!--车辆保险-->
    <el-drawer
      :title="`车辆保险列表，所属车辆: ${this.cl2}`"
      size = "700px"
      :visible.sync="rightVisible2"
      direction="rtl">
      <ClbxList ref="clbxList" @closeRight="closeRight2"></ClbxList>
    </el-drawer>
    <!--车辆年检-->
    <el-drawer
      :title="`车辆年检列表，所属车辆: ${this.cl3}`"
      size = "700px"
      :visible.sync="rightVisible3"
      direction="rtl">
      <ClnjList ref="clnjList" @closeRight="closeRight3"></ClnjList>
    </el-drawer>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <ClxxForm  ref="clxxForm" @refreshDataList="refreshList"></ClxxForm>
  </div>
</template>

<script>
  import ClxxForm from './ClxxForm'
  import YcwhList from '../ycwh/YcwhList'
  import ClbxList from '../clbx/ClbxList'
  import ClnjList from '../clnj/ClnjList'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        searchForm: {
          cph: '',
          clfl: '',
          cllx: '',
          clzt: ''
        },
        dataList: [],
        clflList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        clid: '',
        rightVisible1: false,
        rightVisible2: false,
        rightVisible3: false,
        cl1: '',
        cl2: '',
        cl3: '',
        dataListSelections: [],
        isImportCollapse: false,
        isSearchCollapse: false,
        loading: false
      }
    },
    components: {
      ClxxForm,
      YcwhList,
      ClbxList,
      ClnjList,
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
          url: `/ycgl/clfl/list`,
          method: 'get'
        }).then(({data}) => {
          this.clflList = data.page.list
        })
        this.loading = true
        this.$http({
          url: '/ycgl/clxx/list',
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
        this.$refs.clxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.clxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.clxxForm.init('view', id)
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
            url: '/ycgl/clxx/delete',
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
        this.$utils.download('/ycgl/clxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/ycgl/clxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      // 用车维护
      ycwhList (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.rightVisible1 = true
        this.$nextTick(() => {
          this.$refs.ycwhList.refreshList(id)
          this.loading = false
          this.$http({
            url: `/ycgl/clxx/queryById?id=` + id,
            method: 'get'
          }).then(({data}) => {
            this.cl1 = data.clxx.cph
          })
        })
      },
      closeRight1 () {
        this.rightVisible1 = false
      },
      // 车辆保险
      clbxList (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.rightVisible2 = true
        this.$nextTick(() => {
          this.$refs.clbxList.refreshList(id)
          this.loading = false
          this.$http({
            url: `/ycgl/clxx/queryById?id=` + id,
            method: 'get'
          }).then(({data}) => {
            this.cl2 = data.clxx.cph
          })
        })
      },
      closeRight2 () {
        this.rightVisible2 = false
      },
      // 车辆年检
      clnjList (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.rightVisible3 = true
        this.$nextTick(() => {
          this.$refs.clnjList.refreshList(id)
          this.loading = false
          this.$http({
            url: `/ycgl/clxx/queryById?id=` + id,
            method: 'get'
          }).then(({data}) => {
            this.cl3 = data.clxx.cph
          })
        })
      },
      closeRight3 () {
        this.rightVisible3 = false
      }
    }
  }
</script>
