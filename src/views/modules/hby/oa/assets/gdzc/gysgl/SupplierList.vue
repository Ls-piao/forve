<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="name" label="供应商名称">
                <el-input size="small" v-model="searchForm.name" placeholder="供应商全称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="type"  label="企业类型">
                  <el-select v-model="searchForm.type" placeholder="请选择企业类型" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('QYLX')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
        <el-form-item prop="userName"  label="联系人名称">
          <el-input size="small" v-model="searchForm.userName" placeholder="联系人名称" clearable></el-input>
        </el-form-item>
        <template v-if="toggleSearchStatus">
         <el-form-item prop="country"  label="国家地区">
                  <el-select v-model="searchForm.country" placeholder="请选择国家地区名称" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('GJ')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
        <el-form-item prop="range"  label="经营范围">
          <el-input size="small" v-model="searchForm.range" placeholder="经营范围" clearable></el-input>
        </el-form-item>
         <el-form-item prop="phoneNum"  label="联系人电话">
                <el-input size="small" v-model="searchForm.phoneNum" placeholder="联系人电话" clearable></el-input>
         </el-form-item>
          <el-form-item prop="departmentName"  label="部门名称">
            <el-input size="small" v-model="searchForm.departmentName" placeholder="部门名称" clearable></el-input>
          </el-form-item>
        </template>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
            <a @click="handleToggleSearch" style="margin-left: 8px">
              {{ toggleSearchStatus ? '收起' : '展开' }}
              <i :class="toggleSearchStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
            </a>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form size="small" :inline="true" v-show="isImportCollapse"  ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/gysgl/supplier/import`"
                  :on-success="uploadSuccess"
                   :show-file-list="true">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
                </el-upload>
            </el-form-item>
          </el-form>
      </el-dialog>
      <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('gysgl:supplier:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('gysgl:supplier:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('gysgl:supplier:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
<!--            <el-button v-if="hasPermission('gysgl:supplier:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>-->
            <el-button v-if="hasPermission('gysgl:supplier:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="name"
        show-overflow-tooltip
        label="供应商全称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('gysgl:supplier:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('gysgl:supplier:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="departmentName"
        show-overflow-tooltip
        label="部门名称">
      </el-table-column>
    <el-table-column
        prop="type"
        show-overflow-tooltip
        label="企业类型">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("QYLX", scope.row.type, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="address"
        show-overflow-tooltip
        label="公司地址">
      </el-table-column>
    <el-table-column
        prop="userName"
        show-overflow-tooltip
        label="联系人名称">
      </el-table-column>
    <el-table-column
        prop="phoneNum"
        show-overflow-tooltip
        label="联系人电话">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('gysgl:supplier:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('gysgl:supplier:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('gysgl:supplier:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <SupplierForm  ref="supplierForm" @refreshDataList="refreshList"></SupplierForm>
  </div>
</template>

<script>
  import SupplierForm from './SupplierForm'
  export default {
    data () {
      return {
        searchForm: {
          name: '',
          departmentName: '',
          type: '',
          range: '',
          country: '',
          userName: '',
          phoneNum: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        toggleSearchStatus: false
      }
    },
    components: {
      SupplierForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/gysgl/supplier/list',
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
        this.$refs.supplierForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.supplierForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.supplierForm.init('view', id)
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
            url: '/gysgl/supplier/delete',
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
        this.$utils.download('/gysgl/supplier/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/gysgl/supplier/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      handleToggleSearch () {
        this.toggleSearchStatus = !this.toggleSearchStatus
      }
    }
  }
</script>
