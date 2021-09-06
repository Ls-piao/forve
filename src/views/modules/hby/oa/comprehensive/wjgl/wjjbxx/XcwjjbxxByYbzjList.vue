<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="wjbt">
                <el-input size="small" v-model="searchForm.wjbt" placeholder="问卷标题" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
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
                  :action="`${this.$http.BASE_URL}/wjjbxx/xcwjjbxx/import`"
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
        <!--  <el-button v-if="hasPermission('wjjbxx:xcwjjbxx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button v-if="hasPermission('wjjbxx:xcwjjbxx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
           :disabled="dataListSelections.length != 1" plain>修改</el-button>
          <el-button v-if="hasPermission('wjjbxx:xcwjjbxx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                    :disabled="dataListSelections.length <= 0" plain>删除
          </el-button>-->
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
        prop="wjbm"
        show-overflow-tooltip
        sortable="custom"
        label="问卷编码">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('wjjbxx:xcwjjbxx:edit')" @click="edit(scope.row.id)">{{scope.row.wjbm}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('wjjbxx:xcwjjbxx:view')"  @click="view(scope.row.id,scope.row.wjbt)">{{scope.row.wjbm}}</el-link>
              <span v-else>{{scope.row.wjbm}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="wjbt"
        show-overflow-tooltip
        sortable="custom"
        label="问卷标题">
      </el-table-column>
    <el-table-column
        prop="wjzf"
        show-overflow-tooltip
        sortable="custom"
        label="问卷总分">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="300"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('wjjbxx:xcwjjbxx:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id,scope.row.wjbm,scope.row.wjbt,scope.row.wjzf,scope.row.xztdbt,scope.row.zgtdbt)">查看</el-button>
<!--          <el-button v-if="hasPermission('wjjbxx:xcwjjbxx:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('wjjbxx:xcwjjbxx:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
          <el-button  type="text" icon="el-icon-edit" size="small" @click="dt(scope.row.id,scope.row.wjbm,scope.row.wjbt,scope.row.wjzf,scope.row.xztdbt,scope.row.zgtdbt)">样本直录</el-button>
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

    <XcwjjbxxForm  ref="xcwjjbxxForm" @refreshDataList="refreshList"></XcwjjbxxForm>
      <el-drawer
        size = "700px"
        :title="`问卷问题列表，所属问卷: ${this.wjbtname}`"
        :visible.sync="rightVisible"
        direction="rtl">
        <xc-wjgl-wjwtxx-list  :wjbtname="wjbtname" ref="xcWjglWjwtxxList" @closeRight="closeRight"></xc-wjgl-wjwtxx-list>
      </el-drawer>
      <WjckForm ref="wjckForm" @refreshDataList="refreshList"></WjckForm>
      <WjckFormByDt ref="wjckFormByDt" @refreshDataList="refreshList"></WjckFormByDt>
  </div>
</template>

<script>
  import XcwjjbxxForm from './XcwjjbxxForm'
  import WjckForm from './WjckForm'
  import WjckFormByDt from './WjckFormByDt'
  import XcWjglWjwtxxList from '../xcwjglwjtxx/XcWjglWjwtxxList'
  export default {
    data () {
      return {
        searchForm: {
          wjbt: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        wjbtname: '',
        wjbt: '',
        rightVisible: false,
        dataListSelections: [],
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      XcwjjbxxForm,
      WjckForm,
      WjckFormByDt,
      XcWjglWjwtxxList
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/wjjbxx/xcwjjbxx/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            'wjbt': this.wjbt,
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
        this.$refs.xcwjjbxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xcwjjbxxForm.init('edit', id)
      },
      // 查看
      view (id, wjbm, wjbt, wjmf, xztdbt, zgtdbt) {
        this.$refs.wjckForm.init('view', {id: id, wjbm: wjbm, wjbt: wjbt, wjmf: wjmf, xztdbt: xztdbt, zgtdbt: zgtdbt})
      },
      // 查看
      dt (id, wjbm, wjbt, wjmf, xztdbt, zgtdbt) {
        this.$refs.wjckFormByDt.init('edit', {id: id, wjbm: wjbm, wjbt: wjbt, wjmf: wjmf, xztdbt: xztdbt, zgtdbt: zgtdbt})
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
            url: '/wjjbxx/xcwjjbxx/delete',
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
        this.$utils.download('/wjjbxx/xcwjjbxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/wjjbxx/xcwjjbxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      showRight (row) {
        this.rightVisible = true
        this.$nextTick(() => {
          this.$refs.xcWjglWjwtxxList.refreshList(row.id)
          this.wjbtname = row.wjbt
        })
      },
      closeRight () {
        this.rightVisible = false
      }
    }
  }
</script>
