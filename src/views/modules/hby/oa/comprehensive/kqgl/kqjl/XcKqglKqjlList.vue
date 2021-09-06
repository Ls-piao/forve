<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="checkWork">
                <el-input size="small" v-model="searchForm.checkWork" placeholder="考勤情况" clearable></el-input>
         </el-form-item>
         <el-form-item prop="flbh.id">
            <SelectTree
                  ref="flbh.id"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                  placeholder="请选择分类编号"
                  size="small"
                  url="/xckqglkqfl/xcKqglKqfl/treeData"
                  :value="searchForm.flbh.id"
                  :clearable="true"
                  :accordion="true"
                  @getValue="(value) => {searchForm.flbh.id=value}"/>
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
                  :action="`${this.$http.BASE_URL}/kqgl/kqjl/xcKqglKqjl/import`"
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
        <el-button v-if="hasPermission('kqgl:kqjl:xcKqglKqjl:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()">导出</el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('kqgl:kqjl:xcKqglKqjl:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('kqgl:kqjl:xcKqglKqjl:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
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
        prop="checkUser.name"
        show-overflow-tooltip
        label="考勤人员">
      </el-table-column>
      <el-table-column
        prop="dataStart"
        show-overflow-tooltip
        sortable="custom"
        label="开始时间">
      </el-table-column>
    <el-table-column
        prop="dateEnd"
        show-overflow-tooltip
        sortable="custom"
        label="结束时间">
      </el-table-column>
    <el-table-column
        prop="checkWork"
        show-overflow-tooltip
        label="考勤情况">
        <template slot-scope="scope">
          <span v-if="scope.row.checkWork === '0'" style="color: #68d391">{{scope.row.kqState}}</span>
          <span v-else-if="scope.row.checkWork === '5'" style="color: #ff0000">{{scope.row.kqState}}</span>
          <span v-else style="color: #daaa2c">{{scope.row.kqState}}</span>
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
          <el-button v-if="hasPermission('kqgl:kqjl:xcKqglKqjl:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('kqgl:kqjl:xcKqglKqjl:view')" :disabled="scope.row.kqState === '正常'" type="text" icon="el-icon-edit-outline" size="small" @click="bl(scope.row.id)">补录</el-button>
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
    <XcKqglKqjlForm  ref="xcKqglKqjlForm" @refreshDataList="refreshList"></XcKqglKqjlForm>
    <el-dialog
      title="补录申请"
      :close-on-click-modal="false"
      v-dialogDrag
      width="1200px"
      :visible.sync="visible">
      <bl ref="bl" @refreshDataList="visible = false"></bl>
    </el-dialog>
  </div>
</template>

<script>
  import XcKqglKqjlForm from './XcKqglKqjlForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import bl from '../blcz/bl'
  export default {
    data () {
      return {
        searchForm: {
          checkWork: '',
          flbh: {
            id: ''
          }
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        visible: false
      }
    },
    components: {
      SelectTree,
      XcKqglKqjlForm,
      bl
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/kqgl/kqjl/xcKqglKqjl/list',
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
        this.$refs.xcKqglKqjlForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xcKqglKqjlForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xcKqglKqjlForm.init('view', id)
      },
      // 查看
      bl (id) {
        // this.$refs.xcKqglKqjlForm.init('view', id)
        this.visible = true
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
            url: '/kqgl/kqjl/xcKqglKqjl/delete',
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
        this.$utils.download('/kqgl/kqjl/xcKqglKqjl/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/kqgl/kqjl/xcKqglKqjl/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
