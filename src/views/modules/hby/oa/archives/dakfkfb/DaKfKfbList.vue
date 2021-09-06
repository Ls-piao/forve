<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="kfbh">
                <el-input size="small" v-model="searchForm.kfbh" placeholder="库房编号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="kfmc">
                <el-input size="small" v-model="searchForm.kfmc" placeholder="库房名称" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
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
                  :action="`${this.$http.BASE_URL}/dagl/dakfkfb/import`"
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
        <el-button v-if="hasPermission('dagl:dakfkfb:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('dagl:dakfkfb:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('dagl:dakfkfb:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
<!--            <el-button v-if="hasPermission('dagl:dakfkfb:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>-->
<!--            <el-button v-if="hasPermission('dagl:dakfkfb:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>-->
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
        prop="kfbh"
        show-overflow-tooltip
        sortable="custom"
        label="库房编号">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('dagl:dakfkfb:edit')" @click="edit(scope.row.id)">{{scope.row.kfbh}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('dagl:dakfkfb:view')"  @click="view(scope.row.id)">{{scope.row.kfbh}}</el-link>
              <span v-else>{{scope.row.kfbh}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="kfmc"
        show-overflow-tooltip
        sortable="custom"
        label="库房名称">
      </el-table-column>
    <el-table-column
        prop="mj"
        show-overflow-tooltip
        sortable="custom"
        label="面积">
      </el-table-column>
    <el-table-column
        prop="gly"
        show-overflow-tooltip
        sortable="custom"
        label="管理员">
      </el-table-column>
    <el-table-column
        prop="lxdh"
        show-overflow-tooltip
        sortable="custom"
        label="联系电话">
      </el-table-column>
    <el-table-column
        prop="updateDate"
        show-overflow-tooltip
        sortable="custom"
        label="修改时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="300"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('dagl:dakfkfb:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('dagl:dakfkfb:view')" type="text" icon="el-icon-tickets" size="small" @click="viewLog(scope.row.id)">日志</el-button>
          <el-button v-if="hasPermission('dagl:dakfkfb:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('dagl:dakfkfb:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <DaKfKfbForm  ref="daKfKfbForm" @refreshDataList="refreshList"></DaKfKfbForm>
      <DaglLogList  ref="daglLogList" ></DaglLogList>
  </div>
</template>

<script>
  import DaKfKfbForm from './DaKfKfbForm'
  import DaglLogList from '../daczrz/DaglLogList'

  export default {
    data () {
      return {
        searchForm: {
          kfbh: '',
          kfmc: ''
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
      DaKfKfbForm,
      DaglLogList
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/dagl/dakfkfb/list',
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
        this.$refs.daKfKfbForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.daKfKfbForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.daKfKfbForm.init('view', id)
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
            url: '/dagl/dakfkfb/delete',
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
        this.$utils.download('/dagl/dakfkfb/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/dagl/dakfkfb/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      // 查看日志
      viewLog (id) {
        this.$refs.daglLogList.init(id)
      }
    }
  }
</script>
