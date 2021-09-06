<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="jlzt">
                  <el-select size="small" v-model="searchForm.jlzt" placeholder="请选择记录状态"  style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('CGZT')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
         <el-form-item prop="cgdh">
                <el-input size="small" v-model="searchForm.cgdh" placeholder="采购单号" clearable></el-input>
         </el-form-item>
        <el-form-item prop="cgPeople">
          <el-input size="small" v-model="searchForm.cgPeople.id" placeholder="采购人名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="sg">
          <el-input size="small" v-model="searchForm.sg.id" placeholder="申购编号" clearable></el-input>
        </el-form-item>
<!--        <el-form-item prop="sg">
          <el-input size="small" v-model="searchForm.sg.id" placeholder="申购单号" clearable></el-input>
        </el-form-item>-->
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
                  :action="`${this.$http.BASE_URL}/zccg/bgxtGdzcCg/import`"
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
        <el-button v-if="hasPermission('zccg:bgxtGdzcCg:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('zccg:bgxtGdzcCg:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('zccg:bgxtGdzcCg:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('zccg:bgxtGdzcCg:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('zccg:bgxtGdzcCg:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
            <el-tab-pane label="采购明细">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtGdzcCgInfoList"
                  style="width: 100%">
                <el-table-column
                    prop="zcmc"
                    show-overflow-tooltip
                    label="资产名称">
                  </el-table-column>
                <el-table-column
                    prop="zcxh"
                    show-overflow-tooltip
                    label="资产型号">
                  </el-table-column>
                <el-table-column
                    prop="zcgg"
                    show-overflow-tooltip
                    label="资产规格">
                  </el-table-column>
                <el-table-column
                    prop="sgNum"
                    show-overflow-tooltip
                    label="申购数量">
                  </el-table-column>
                <el-table-column
                    prop="cgNum"
                    show-overflow-tooltip
                    label="采购数量">
                  </el-table-column>
                <el-table-column
                    prop="dj"
                    show-overflow-tooltip
                    label="单价(元)">
                  </el-table-column>
                <el-table-column
                    prop="money"
                    show-overflow-tooltip
                    label="金额(元)">
                  </el-table-column>
                  <el-table-column
                    prop="gys.name"
                    label="供应商ID">
                  </el-table-column>
                <el-table-column
                    prop="ghDate"
                    show-overflow-tooltip
                    label="供货日期">
                  </el-table-column>
                <el-table-column
                    prop="remarks"
                    show-overflow-tooltip
                    label="备注信息">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
      </template>
      </el-table-column>
    <el-table-column
        prop="jlzt"
        show-overflow-tooltip
        sortable="custom"
        label="记录状态">
        <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('zccg:bgxtGdzcCg:edit')" @click="edit(scope.row.id)"> {{ $dictUtils.getDictLabel("CGZT", scope.row.jlzt, '-') }}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('zccg:bgxtGdzcCg:view')"  @click="view(scope.row.id)"> {{ $dictUtils.getDictLabel("CGZT", scope.row.jlzt, '-') }}</el-link>
              <span v-else>{{ $dictUtils.getDictLabel("CGZT", scope.row.jlzt, '-') }}</span>
        </template>
      </el-table-column>
    <el-table-column
        prop="cgdh"
        show-overflow-tooltip
        sortable="custom"
        label="采购单号">
      </el-table-column>
    <el-table-column
        prop="cgDate"
        show-overflow-tooltip
        sortable="custom"
        label="采购日期">
      </el-table-column>
      <el-table-column
        prop="cgPeople.name"
        show-overflow-tooltip
        sortable="custom"
        label="采购人">
      </el-table-column>
      <el-table-column
        prop="sg.sgdh"
        show-overflow-tooltip
        sortable="custom"
        label="申购编号">
      </el-table-column>
    <el-table-column
        prop="zczj"
        show-overflow-tooltip
        sortable="custom"
        label="资产总价">
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
          <el-button v-if="hasPermission('zccg:bgxtGdzcCg:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('zccg:bgxtGdzcCg:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('zccg:bgxtGdzcCg:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <BgxtGdzcCgForm  ref="bgxtGdzcCgForm" @refreshDataList="refreshList"></BgxtGdzcCgForm>
  </div>
</template>

<script>
  import BgxtGdzcCgForm from './BgxtGdzcCgForm'
  export default {
    data () {
      return {
        searchForm: {
          jlzt: '',
          cgdh: '',
          cgPeople: {
            id: ''
          },
          sg: {
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
        loading: false
      }
    },
    components: {
      BgxtGdzcCgForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/zccg/bgxtGdzcCg/list',
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
        this.$refs.bgxtGdzcCgForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtGdzcCgForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bgxtGdzcCgForm.init('view', id)
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
            url: '/zccg/bgxtGdzcCg/delete',
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
        this.$http.get(`/zccg/bgxtGdzcCg/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.bgxtGdzcCgInfoList = data.bgxtGdzcCg.bgxtGdzcCgInfoList
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
        this.$utils.download('/zccg/bgxtGdzcCg/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/zccg/bgxtGdzcCg/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
