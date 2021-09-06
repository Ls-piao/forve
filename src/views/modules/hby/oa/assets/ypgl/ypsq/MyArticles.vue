<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
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
    <div class="bg-white top">
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">用品申请</el-button>
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
        :data="dataList.slice((pageNo-1)*pageSize,pageNo*pageSize)"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        size="small"
        height="calc(100% - 80px)"
        class="table">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="articlesId.name"
          show-overflow-tooltip
          sortable="custom"
          label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.articlesId.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="articlesId.code"
          show-overflow-tooltip
          label="编号">
        </el-table-column>
        <el-table-column
          prop="num"
          show-overflow-tooltip
          label="领用数量">
        </el-table-column>
        <el-table-column
          prop="articlesId.articles.name"
          show-overflow-tooltip
          label="类型">
        </el-table-column>
        <el-table-column
          prop="articlesId.enclosure"
          show-overflow-tooltip
          label="附件">
          <template slot-scope="scope">
            <el-image
              style="height: 50px;width:50px;margin-right:10px;"
              :src="src" v-for="(src, index) in scope.row.articlesId.enclosure.split('|')" :key="index"
              :preview-src-list="scope.row.articlesId.enclosure.split('|')">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="sqDate"
          show-overflow-tooltip
          sortable="custom"
          label="申请日期">
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
  </div>
</template>

<script>
import ArticlesApplyForm from './ArticlesApplyForm'
import UserSelect from '@/components/userSelect'
export default {
  data () {
    return {
      searchForm: {
        applyUser: {
          id: ''
        },
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
        url: '/ypgl/ypsq/articlesApply/queryArtByUser',
        method: 'get',
        params: {
          beginApplyDate: this.searchForm.applyDate[0],
          endApplyDate: this.searchForm.applyDate[1],
          ...this.lodash.omit(this.searchForm, 'applyDate')
        }
      }).then(({data}) => {
        if (data && data.success) {
          console.log(data)
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
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
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
      let row = {
        'name': '用品申请',
        'id': 'ypsq:21:1aa10f9e-0af9-11ec-925e-44af284615aa'
      }
      // 读取流程表单
      let tabTitle = `发起流程【${row.name}】`
      let processTitle = `${this.$store.state.user.name} 在 ${this.moment(new Date()).format('YYYY-MM-DD HH:mm')} 发起了 [${row.name}]`
      this.$http.get('/flowable/task/getTaskDef', {params: {
        procDefId: row.id,
        status: 'start'
      }}).then(({data}) => {
        if (data.success) {
          this.$router.push({
            path: '/flowable/task/TaskForm',
            query: {procDefId: row.id, procDefKey: row.id.split(':')[0], status: 'start', title: tabTitle, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: processTitle, redirectUrl: '/hby/oa/assets/ypgl/ypsq/ApplyList'}
          })
        }
      })
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
