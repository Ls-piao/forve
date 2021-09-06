<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="xmmc">
                <el-input size="small" v-model="searchForm.xmmc" placeholder="项目名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="xmbh">
                <el-input size="small" v-model="searchForm.xmbh" placeholder="项目编号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="lxdw">
                <el-input size="small" v-model="searchForm.lxdw" placeholder="立项单位" clearable></el-input>
         </el-form-item>
         <el-form-item prop="xmfl">
            <el-select v-model="searchForm.xmfl" placeholder="项目分类"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('XMFL')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="xmfx">
            <el-select v-model="searchForm.xmfl" placeholder="项目风险"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('XMFX')"
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
    <el-table
      :data="dataList"
      size="small"
      height="calc(100% - 80px)"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      :summary-method="getSummaries"
      border
      show-summary
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="xmmc"
        show-overflow-tooltip
        sortable="custom"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="xmbh"
        show-overflow-tooltip
        sortable="custom"
        label="项目编号">
      </el-table-column>
      <el-table-column
        prop="lxdw"
        show-overflow-tooltip
        sortable="custom"
        label="立项单位">
      </el-table-column>
      <el-table-column
        prop="xmfl"
        show-overflow-tooltip
        sortable="custom"
        label="项目分类">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XMFL", scope.row.xmfl, "")}}
        </template>
      </el-table-column>
    <el-table-column
        prop="xmfx"
        show-overflow-tooltip
        sortable="custom"
        label="项目风险">
         <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XMFX", scope.row.xmfx, "")}}
        </template>
      </el-table-column>
      <el-table-column label="已签订" align="center">
        <el-table-column
          prop="yqdn"
          show-overflow-tooltip
          sortable="custom"
          label="合同数量">
        </el-table-column>
        <el-table-column
          prop="yqdm"
          show-overflow-tooltip
          sortable="custom"
          label="合同金额">
        </el-table-column>
      </el-table-column>
      <el-table-column label="履行中" align="center">
        <el-table-column
          prop="lxzn"
          show-overflow-tooltip
          sortable="custom"
          label="合同数量">
        </el-table-column>
        <el-table-column
          prop="lxzm"
          show-overflow-tooltip
          sortable="custom"
          label="合同金额">
        </el-table-column>
      </el-table-column>
      <el-table-column label="已完毕" align="center">
        <el-table-column
          prop="ywcn"
          show-overflow-tooltip
          sortable="custom"
          label="合同数量">
        </el-table-column>
        <el-table-column
          prop="ywcm"
          show-overflow-tooltip
          sortable="custom"
          label="合同金额">
        </el-table-column>
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
  </div>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
export default {
    data () {
      return {
        LxrqRange: [],
        searchForm: {
          beginLxrq: '',
          endLxrq: '',
          xmmc: '',
          xmbh: '',
          lxdw: '',
          lxrq: '',
          xmfl: '',
          xmfx: '',
          zgbm: {
            id: '',
            name: ''
          },
          zfzr: {
            id: '',
            name: ''
          },
          xmjl: {
            id: '',
            name: ''
          }
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
      SelectTree
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        if (this.LxrqRange.length > 0) {
          this.searchForm.beginLxrq = this.LxrqRange[0]
          this.searchForm.endLxrq = this.LxrqRange[1]
        }
        this.$http({
          url: '/xmgl/xmxx/xmjbxx/httj',
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
      getSummaries (param) {
        console.log(param)
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5) {
            sums[index] = '--'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = '--'
          }
        })
        this.sums = sums
        return sums
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
        this.$refs.xmjbxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xmjbxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xmjbxxForm.init('view', id)
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
            url: '/xmgl/xmxx/xmjbxx/delete',
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
        this.$utils.download('/xmgl/xmxx/xmjbxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xmgl/xmxx/xmjbxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.LxrqRange = []
        this.searchForm.beginLxrq = ''
        this.searchForm.endLxrq = ''
        this.refreshList()
      }
    }
  }
</script>
