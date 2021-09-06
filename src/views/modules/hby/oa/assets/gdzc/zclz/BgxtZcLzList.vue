<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
<!--        <el-form-item prop="zc.name">
          <el-input size="small" v-model="searchForm.zc.name" placeholder="资产名称" clearable></el-input>
        </el-form-item>-->
        <el-form-item prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择申请类型" size="small" style="width: 100%;">
            <el-option
              v-for="item in $dictUtils.getDictList('jlzt')"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="jcNo">
          <el-input size="small" v-model="searchForm.jcNo" placeholder="借领单号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="jysm">
          <el-input size="small" v-model="searchForm.jysm" placeholder="借领说明" clearable></el-input>
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
<!--        <el-button v-if="hasPermission('zcjl:bgxtZcjl:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('zcjl:bgxtZcjl:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('zcjl:bgxtZcjl:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>-->
        <el-button-group class="pull-right">
<!--            <el-button v-if="hasPermission('zcjl:bgxtZcjl:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>-->
            <el-button v-if="hasPermission('zcjl:bgxtZcjl:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="zc.name"
        show-overflow-tooltip
        sortable="custom"
        label="资产名称">
      </el-table-column>
      <el-table-column
        prop="sqr.name"
        show-overflow-tooltip
        sortable="custom"
        label="申请人">
      </el-table-column>
    <el-table-column
        prop="type"
        show-overflow-tooltip
        sortable="custom"
        label="申请类型">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("jlzt", scope.row.type, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="yjghDate"
        show-overflow-tooltip
        label="预计归还时间">
      </el-table-column>
    <el-table-column
        prop="sjghDate"
        show-overflow-tooltip
        label="实际归还日期">
      </el-table-column>
      <el-table-column
        prop="dept.name"
        show-overflow-tooltip
        sortable="custom"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="office.name"
        show-overflow-tooltip
        sortable="custom"
        label="单位">
      </el-table-column>
    <el-table-column
        prop="jcNo"
        show-overflow-tooltip
        sortable="custom"
        label="借领单号">
      </el-table-column>
      <el-table-column
        prop="jsr.name"
        show-overflow-tooltip
        sortable="custom"
        label="经手人">
      </el-table-column>
      <el-table-column
        prop="zdr.name"
        show-overflow-tooltip
        sortable="custom"
        label="制单人">
      </el-table-column>
    <el-table-column
        prop="jysm"
        show-overflow-tooltip
        sortable="custom"
        label="借领说明">
      </el-table-column>
    <el-table-column
        prop="attach"
        show-overflow-tooltip
        sortable="custom"
        label="附件">
        <template slot-scope="scope" v-if="scope.row.attach">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.attach.split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
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
          <el-button v-if="hasPermission('zcjl:bgxtZcjl:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
<!--          <el-button v-if="hasPermission('zcjl:bgxtZcjl:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('zcjl:bgxtZcjl:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
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
   <BgxtZcLzForm  ref="bgxtZcLzForm" @refreshDataList="refreshList"></BgxtZcLzForm>
  </div>
</template>

<script>
  import BgxtZcLzForm from './BgxtZcLzForm'
  export default {
    data () {
      return {
        searchForm: {
          zc: {
            id: ''
          },
          type: '',
          jcNo: '',
          jysm: '',
          delFlag: '1'
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
      BgxtZcLzForm
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
          url: '/zcjl/bgxtZcjl/list',
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
      // 查看
      view (id) {
        this.$refs.bgxtZcLzForm.init('view', id)
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
            url: '/zcjl/bgxtZcjl/delete',
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
