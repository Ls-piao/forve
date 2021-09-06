<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible"
    width="75%"
    height="100%">
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <!-- <el-form-item prop="xmId.id">
            <el-select v-model="searchForm.xmId.id" style="width:100%" filterable placeholder="所属项目">
              <el-option
                v-for="xm in xmList"
                :key="xm.id"
                :label="xm.xmmc"
                :value="xm.id">
              </el-option>
            </el-select>
         </el-form-item> -->
         <el-form-item prop="wdsm">
                <el-input size="small" v-model="searchForm.wdMc" placeholder="文档名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="wdbxr">
                <el-input size="small" v-model="searchForm.wdbxr" placeholder="文档编写人" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
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
        prop="wdMc"
        show-overflow-tooltip
        sortable="custom"
        label="文档名称">
      </el-table-column>
    <el-table-column
        prop="wdbxr"
        show-overflow-tooltip
        sortable="custom"
        label="文档编写人">
      </el-table-column>
    <el-table-column
        prop="scr.name"
        show-overflow-tooltip
        sortable="custom"
        label="上传人">
      </el-table-column>
    <el-table-column
        prop="scsj"
        show-overflow-tooltip
        sortable="custom"
        label="上传时间">
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
    <WdxxForm  ref="wdxxForm" @refreshDataList="refreshList"></WdxxForm>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="visible = false">关闭</el-button>
  </span>
</el-dialog>
</template>

<script>
  import WdxxForm from './WdxxForm'
  export default {
    data () {
      return {
        title: '项目文档',
        method: '',
        visible: false,
        loading: false,
        xmid: '',
        xmList: [],
        searchForm: {
          xmId: {
            id: '',
            xmmc: ''
          },
          wdsm: '',
          wdbxr: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false
      }
    },
    components: {
      WdxxForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.searchForm.xmId.id = this.xmid
        this.$http({
          url: `/xmgl/xmxx/xmjbxx/list?xmzt=4&pageNo=1&pageSize=-1`,
          method: 'get'
        }).then(({data}) => {
          this.xmList = data.page.list
        })
        this.$http({
          url: '/xmgl/xmwdxx/wdxx/list',
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
        this.$refs.wdxxForm.inputForm.xmId.id = this.xmid
        this.$refs.wdxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.wdxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.wdxxForm.init('view', id)
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
            url: '/xmgl/xmwdxx/wdxx/delete',
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
        this.$utils.download('/xmgl/xmwdxx/wdxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xmgl/xmwdxx/wdxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.searchForm.xmId.id = this.xmid
        this.refreshList()
      }
    }
  }
</script>