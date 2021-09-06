<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="applyUser">
            <user-select :limit='1' size="small" placeholder="请选择申请人" :value="searchForm.applyUser" @getValue='(value) => {searchForm.applyUser=value}'></user-select>
         </el-form-item>
         <el-form-item prop="applyOffice">
                <el-input size="small" v-model="searchForm.applyOffice" placeholder="所属单位" clearable></el-input>
         </el-form-item>
         <el-form-item prop="applyDept">
                <el-input size="small" v-model="searchForm.applyDept" placeholder="所属部门" clearable></el-input>
         </el-form-item>
         <el-form-item prop="applyDate">
               <el-date-picker
                    v-model="searchForm.applyDate"
                    type="daterange"
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
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
        <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/ypgl/ypsq/articlesApply/import`"
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
        <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      height="calc(100% - 80px)"
      @expand-change="detail"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column type="expand">
      <template slot-scope="scope">
        <el-tabs>
          <el-tab-pane label="申领物品">
            <el-table
            size="small"
            :data="scope.row.articlesApplyDetailsList"
            style="width: 100%">
              <el-table-column
                prop="articlesId.code"
                label="用品编号">
              </el-table-column>
              <el-table-column
                prop="articlesId.name"
                label="用品名称">
              </el-table-column>
              <el-table-column
                prop="articlesId.unit"
                label="计量单位">
              </el-table-column>
              <el-table-column
                prop="articlesId.articles.name"
                label="类型">
              </el-table-column>
              <el-table-column
                prop="articlesId.enclosure"
                label="用品图片">
                <template slot-scope="scope">
                  <img :src="scope.row.articlesId.enclosure === ''?'/static/img/avatar.png':scope.row.articlesId.enclosure" style="height:35px"/>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>
      </template>
      </el-table-column>
      <el-table-column
        prop="applyUser"
        show-overflow-tooltip
        sortable="custom"
        label="申请人">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('ypgl:ypsq:articlesApply:edit')" @click="edit(scope.row.id)">{{scope.row.applyUser}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('ypgl:ypsq:articlesApply:view')"  @click="view(scope.row.id)">{{scope.row.applyUser}}</el-link>
              <span v-else>{{scope.row.applyUser}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="applyOffice"
        show-overflow-tooltip
        sortable="custom"
        label="所属单位">
      </el-table-column>
    <el-table-column
        prop="applyDept"
        show-overflow-tooltip
        sortable="custom"
        label="所属部门">
      </el-table-column>
    <el-table-column
        prop="applyDate"
        show-overflow-tooltip
        sortable="custom"
        label="申请日期">
      </el-table-column>
    <el-table-column
        prop="applyContent"
        show-overflow-tooltip
        sortable="custom"
        label="申请说明">
      </el-table-column>
    <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <ArticlesApplyForm  ref="articlesApplyForm" @refreshDataList="refreshList"></ArticlesApplyForm>
  </div>
</template>

<script>
  import ArticlesApplyForm from './ArticlesApplyForm'
  import UserSelect from '@/components/userSelect'
  export default {
    data () {
      return {
        searchForm: {
          applyUser: '',
          applyOffice: '',
          applyDept: '',
          applyDate: ''
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
      UserSelect,
      ArticlesApplyForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/ypgl/ypsq/articlesApply/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginApplyDate: this.searchForm.applyDate[0],
            endApplyDate: this.searchForm.applyDate[1],
            ...this.lodash.omit(this.searchForm, 'applyDate')
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
        this.$refs.articlesApplyForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.articlesApplyForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.articlesApplyForm.init('view', id)
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
            url: '/ypgl/ypsq/articlesApply/delete',
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
        this.$http.get(`/ypgl/ypsq/articlesApply/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.articlesApplyDetailsList = data.articlesApply.articlesApplyDetailsList
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
        this.$utils.download('/ypgl/ypsq/articlesApply/import/template')
      },
      exportExcel () {
        let params = {
          beginApplyDate: this.searchForm.applyDate[0],
          endApplyDate: this.searchForm.applyDate[1],
          ...this.lodash.omit(this.searchForm, 'applyDate')
        }
        this.$utils.download('/ypgl/ypsq/articlesApply/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
