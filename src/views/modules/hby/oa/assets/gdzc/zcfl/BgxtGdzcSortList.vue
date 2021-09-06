<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <!--        <el-form-item prop="zc.name">
                <el-input size="small" v-model="searchForm.zc.name" placeholder="资产名称" clearable></el-input>
              </el-form-item>-->
      <el-form-item prop="name">
        <el-input size="small" v-model="searchForm.name" placeholder="资产分类名称" clearable></el-input>
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
            :action="`${this.$http.BASE_URL}/zcjl/bgxtZcjl/import`"
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
     <el-button v-if="" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
<!--               <el-button v-if="" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
                  :disabled="dataListSelections.length != 1" plain>修改</el-button>
                 <el-button v-if="" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                           :disabled="dataListSelections.length <= 0" plain>删除
                 </el-button>-->
        <el-button-group class="pull-right">
          <!--            <el-button v-if="hasPermission('zcjl:bgxtZcjl:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>-->
          <el-button v-if="" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
          <el-button
            type="default"
            size="small"
            icon="el-icon-refresh"
            @click="refreshList">
          </el-button>
        </el-button-group>
      </el-row>
      <el-table
        :data="dataList.slice((pageNo-1)*pageSize,pageNo*pageSize)"
        size="small"
        height="calc(100% - 80px)"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        class="table">
        <el-table-column
          type="selection"
          size="medium"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="资产名称">
        </el-table-column>
        <el-table-column
          prop="code"
          show-overflow-tooltip
          label="资产编号">
        </el-table-column>
        <el-table-column
          prop="sort"
          show-overflow-tooltip
          label="资产序号">
        </el-table-column>
        <el-table-column
          prop="createDate"
          show-overflow-tooltip
          label="创建时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          :key="Math.random()"
          width="200"
          label="操作">
          <template  slot-scope="scope">
            <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row)">查看</el-button>
            <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:edit')"  type="text" icon="el-icon-edit" size="small" @click="edit(scope.row)">修改</el-button>
<!--            <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row)">删除</el-button>-->
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
   <BgxtGdzcSortForm  ref="bgxtGdzcSortForm" @refreshDataList="refreshList"></BgxtGdzcSortForm>
  </div>
</template>

<script>
 import BgxtGdzcSortForm from './BgxtGdzcSortForm'
export default {
   data () {
     return {
       searchForm: {
         name: ''
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
     BgxtGdzcSortForm
   },
   activated () {
     this.refreshList()
   },
   methods: {
    // 获取数据列表
     refreshList () {
       console.log(this.searchForm)
       this.loading = true
       this.$http({
         url: '/zcfl/bgxtGdzcSort/list',
         method: 'get',
         params: {
           'pageNo': this.pageNo,
           'pageSize': this.pageSize,
           'orderBy': this.orderBy,
           ...this.searchForm
         }
       }).then(({data}) => {
         if (data && data.success) {
           this.dataList = data.list
           this.total = data.list.length
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
    // 查看
     view (id) {
       this.$refs.bgxtGdzcSortForm.init('view', id)
     },
     add (id) {
       this.$refs.bgxtGdzcSortForm.init('add', '')
     },
     // 修改
     edit (id) {
       id = id || this.dataListSelections.map(item => {
         return item.id
       })[0]
       this.$refs.bgxtGdzcSortForm.init('edit', id)
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
           url: '/zcfl/bgxtGdzcSort/delete',
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
       this.$utils.download('/zcjl/bgxtZcjl/import/template')
     },
     exportExcel () {
       let params = {
         ...this.searchForm
       }
       this.$utils.download('/zcjl/bgxtZcjl/export', params)
     },
     resetSearch () {
       this.$refs.searchForm.resetFields()
       this.refreshList()
     }
   }
}
</script>
