<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="cl" label="申请车辆">
        <el-select v-model="searchForm.cl" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in clflList"
            :key="item.id"
            :label="item.cph"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="ycrbm" label="用车人部门">
        <SelectTree
          ref="office"
          :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
          url="/sys/office/treeData?type=2"
          :value="searchForm.ycrbm"
          :clearable="true"
          :accordion="true"
          @getValue="(value) => {searchForm.ycrbm=value}"/>
      </el-form-item>
      <el-form-item prop="sqzt" label="申请状态">
        <el-select v-model="searchForm.sqzt" style="width: 100%;">
          <el-option v-for="item in $dictUtils.getDictList('SQZT')" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select>
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
            :action="`${this.$http.BASE_URL}/ycgl/clsq/import`"
            :on-success="uploadSuccess"
            :show-file-list="true">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="bg-white top">
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
          prop="clxx.cph"
          show-overflow-tooltip
          sortable="custom"
          width="100"
          label="申请车辆">
          <template slot-scope="scope">
            <el-link  type="primary" :underline="false" v-if="hasPermission('ycgl:clsq:edit')" @click="edit(scope.row.id)">{{scope.row.clxx.cph}}</el-link>
            <el-link  type="primary" :underline="false" v-else-if="hasPermission('ycgl:clsq:view')"  @click="view(scope.row.id)">{{scope.row.clxx.cph}}</el-link>
            <span v-else>{{scope.row.clxx.cph}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="user.name"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="用车人姓名">
        </el-table-column>
        <el-table-column
          prop="office.name"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="用车人部门">
        </el-table-column>
        <el-table-column
          prop="clsq.ccrs"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="乘车人数">
        </el-table-column>
        <el-table-column
          prop="clsq.ycsy"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="用车事由">
        </el-table-column>
        <el-table-column
          prop="clsq.kssj"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="clsq.jssj"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="结束时间">
        </el-table-column>
        <el-table-column
          prop="clsq.mdd"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="目的地">
        </el-table-column>
        <el-table-column
          prop="clsq.sqzt"
          show-overflow-tooltip
          sortable="custom"
          width="150"
          label="申请状态">
          <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("SQZT", scope.row.clsq.sqzt, '-') }}
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
            <el-button v-if="hasPermission('ycgl:spyj:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
            <el-button v-if="hasPermission('ycgl:spyj:edit') && (scope.row.spzt == '3' || scope.row.glyspzt == '3')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">审核</el-button>
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
    <YcspForm  ref="ycspForm" @refreshDataList="refreshList"></YcspForm>
  </div>
</template>

<script>
import YcspForm from './YcspForm'
import UserSelect from '@/components/userSelect'
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import GridSelect from '@/components/gridSelect'
export default {
  data () {
    return {
      spzt: '',
      glyspzt: '',
      searchForm: {
        id: '',
        clxx: {
          cph: ''
        },
        office: {
          name: ''
        },
        user: {
          name: ''
        },
        clsq: {
          sqzt: '',
          mdd: '',
          cfd: '',
          jssj: '',
          kssj: '',
          ycsy: '',
          ycxz: '',
          ccrs: '',
          jsydh: '',
          jsy: '',
          cl: '',
          ycrdh: '',
          ycrbm: '',
          ycr: ''
        }
      },
      dataList: [],
      clflList: [],
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
    YcspForm,
    UserSelect,
    SelectTree,
    GridSelect
  },
  activated () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      // 获取车辆分类
      this.$http({
        url: `/ycgl/clxx/list`,
        method: 'get'
      }).then(({data}) => {
        this.clflList = data.page.list
      })
      this.loading = true
      this.$http({
        url: '/ycgl/spyj/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          ...this.searchForm
        }
      }).then(({data}) => {
        if (data && data.success) {
          console.log(data.page.list)
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
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.ycspForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.ycspForm.init('view', id)
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
      this.$utils.download('/ycgl/spyj/import/template')
    },
    exportExcel () {
      let params = {
        beginJssj: this.searchForm.jssj[0],
        endJssj: this.searchForm.jssj[1],
        beginKssj: this.searchForm.kssj[0],
        endKssj: this.searchForm.kssj[1],
        ...this.lodash.omit(this.searchForm, 'jssj', 'kssj')
      }
      this.$utils.download('/ycgl/spyj/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
