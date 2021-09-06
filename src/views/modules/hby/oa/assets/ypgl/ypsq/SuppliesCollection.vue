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
                    prop="num"
                    label="申请数量">
                  </el-table-column>
                  <el-table-column
                    prop="collectedNum"
                    label="领用数量">
                    <template slot-scope="scope">
                      <el-tag type="danger" v-if="scope.row.collectedNum === '0'">
                        {{ scope.row.collectedNum }}
                      </el-tag>
                      <el-tag type="warning" v-else>
                        {{ scope.row.collectedNum }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="willCollectNum"
                    label="未领用数量">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.willCollectNum === '0'">
                        {{ scope.row.willCollectNum }}
                      </el-tag>
                      <el-tag type="warning" v-else>
                        {{ scope.row.willCollectNum }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    fixed="right"
                    :key="Math.random()"
                    width="200"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button :disabled="scope.row.willCollectNum === '0'" type="text" icon="fa fa-sign-out" size="small" @click="collection(scope.row.articlesId.id, scope.row.willCollectNum, scope.row.articlesApply.id)">领用</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          show-overflow-tooltip
          sortable="custom"
          label="申请人">
          <template slot-scope="scope">
            <el-link  type="primary" :underline="false" v-if="hasPermission('ypgl:ypsq:articlesApply:edit')" @click="edit(scope.row.id)">{{scope.row.applyUser}}</el-link>
            <el-link  type="primary" :underline="false" v-else-if="hasPermission('ypgl:ypsq:articlesApply:view')"  @click="view(scope.row.id)">{{scope.row.applyUser}}</el-link>
            <span v-else>{{scope.row.userName}}</span>
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
          prop="state"
          show-overflow-tooltip
          sortable="custom"
          label="领用状态">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.state === '0'">
              {{ $dictUtils.getDictLabel("LYZT", scope.row.state, '-') }}
            </el-tag>
            <el-tag type="warning" v-else-if="scope.row.state === '1'">
              {{ $dictUtils.getDictLabel("LYZT", scope.row.state, '-') }}
            </el-tag>
            <el-tag type="success" v-else>
              {{ $dictUtils.getDictLabel("LYZT", scope.row.state, '-') }}
            </el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          header-align="center"-->
<!--          align="center"-->
<!--          fixed="right"-->
<!--          :key="Math.random()"-->
<!--          width="200"-->
<!--          label="操作">-->
<!--          <template  slot-scope="scope">-->
<!--            <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>-->
<!--            <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>-->
<!--            <el-button v-if="hasPermission('ypgl:ypsq:articlesApply:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
    <view-articles ref="view" @refreshDataList="refreshList"></view-articles>
  </div>
</template>

<script>
import UserSelect from '@/components/userSelect'
import ViewArticles from './View_articles'
export default {
  data () {
    return {
      searchForm: {
        applyUser: '',
        applyOffice: '',
        applyDept: '',
        applyDate: '',
        state: '-1'
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
    ViewArticles
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
    // 领用
    collection (id, num, parentId) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.view.init('edit', id, parseInt(num), parentId)
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
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
