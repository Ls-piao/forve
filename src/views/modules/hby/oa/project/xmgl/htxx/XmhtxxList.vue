<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="htmc">
                <el-input size="small" v-model="searchForm.htmc" placeholder="合同名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="htbh">
                <el-input size="small" v-model="searchForm.htbh" placeholder="合同编号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="htmj">
                <el-input size="small" v-model="searchForm.htmj" placeholder="合同密级" clearable></el-input>
         </el-form-item>
         
         <el-form-item prop="ssxm.id">
            <el-select v-model="searchForm.ssxm.id" style="width:100%" filterable placeholder="所属项目">
              <el-option
                v-for="xm in xmList"
                :key="xm.id"
                :label="xm.xmmc"
                :value="xm.id">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="htzl" v-show="advanced">
            <el-select v-model="searchForm.xmfl" placeholder="合同种类"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('HTZL')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="htzt" v-show="advanced">
            <el-select v-model="searchForm.xmfl" placeholder="合同状态"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('HTZT')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
            <el-button @click="toggleAdvanced" size="small" icon="el-icon-rank">{{ advanced ? '收起' : '展开' }}</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('xmgl:htxx:xmhtxx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('xmgl:htxx:xmhtxx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('xmgl:htxx:xmhtxx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
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
        prop="htmc"
        show-overflow-tooltip
        sortable="custom"
        label="合同名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('xmgl:htxx:xmhtxx:edit')" @click="edit(scope.row.id)">{{scope.row.htmc}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('xmgl:htxx:xmhtxx:view')"  @click="view(scope.row.id)">{{scope.row.htmc}}</el-link>
              <span v-else>{{scope.row.htmc}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="htbh"
        show-overflow-tooltip
        sortable="custom"
        label="合同编号">
      </el-table-column>
    <el-table-column
        prop="ssxm.xmmc"
        show-overflow-tooltip
        sortable="custom"
        label="所属项目">
      </el-table-column>
    <el-table-column
        prop="htzl"
        show-overflow-tooltip
        sortable="custom"
        label="合同种类">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("HTZL", scope.row.htzl, "")}}
        </template>
      </el-table-column>
    <el-table-column
        prop="htzt"
        show-overflow-tooltip
        sortable="custom"
        label="合同状态">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("HTZT", scope.row.htzt, "")}}
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
    <XmhtxxForm  ref="xmhtxxForm" @refreshDataList="refreshList"></XmhtxxForm>
  </div>
</template>

<script>
  import XmhtxxForm from './XmhtxxForm'
  export default {
    data () {
      return {
        advanced: false,
        xmList: [],
        searchForm: {
          htmc: '',
          htbh: '',
          htmj: '',
          htzl: '',
          htzt: '',
          ssxm: {
            id: '',
            xmmc: ''
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
      XmhtxxForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: `/xmgl/xmxx/xmjbxx/list?xmzt=4&pageNo=1&pageSize=-1`,
          method: 'get'
        }).then(({data}) => {
          this.xmList = data.page.list
        })
        this.$http({
          url: '/xmgl/htxx/xmhtxx/list',
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
        this.$refs.xmhtxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xmhtxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xmhtxxForm.init('view', id)
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
            url: '/xmgl/htxx/xmhtxx/delete',
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
        this.$utils.download('/xmgl/htxx/xmhtxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xmgl/htxx/xmhtxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>