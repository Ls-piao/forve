<template>
  <div class="jp-common-layout page">
    <div class="jp-common-layout-left" style="width: 290px;">
      <div class="jp-common-title">
        <el-row :gutter="5">
          <el-col :span="20">
            <el-input
              placeholder="输入关键字进行过滤"
              size="small"
              v-model="filterText">
            </el-input>
          </el-col>
<!--          <el-col :span="4">-->
<!--            <el-button type="primary" @click="addTreeNode" size="small" icon="el-icon-plus" style="margin-top: 5px;padding: 5px;margin-left: 4px;" circle></el-button>-->
<!--          </el-col>-->
        </el-row>
      </div>
      <div class="jp-common-el-tree-scrollbar el-scrollbar">
        <div class="el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <el-tree
              class="filter-tree"
              :data="khzflTreeData"
              :props="{
                value: 'id',              // ID字段名
                label: 'name',            // 显示名称
                children: 'children'      // 子级字段名
              }"
              default-expand-all
              highlight-current
              node-key="id"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="chkhzFlTree">
                   <span class="custom-tree-node" slot-scope="{ node, data}">
                    <span>{{ node.label }}</span>
                    <span>
                       <el-button type="text" class="tree-item-button" icon="el-icon-plus" @click="() => addChildTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline" @click="() => editTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-delete" @click="() => delTreeNode(data)">
                       </el-button>
                    </span>
                  </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="jp-common-layout-center jp-flex-main">
      <el-form :inline="true" size="small" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item prop="name">
          <el-input size="small" v-model="searchForm.name" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="bg-white top">
        <el-row>
          <el-button v-if="hasPermission('shxg:flfl:xcShxgFlwk:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button v-if="hasPermission('shxg:flfl:xcShxgFlwk:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
                     :disabled="dataListSelections.length != 1" plain>修改</el-button>
          <el-button v-if="hasPermission('shxg:flfl:xcShxgFlwk:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                     :disabled="dataListSelections.length <= 0" plain>删除
          </el-button>
          <el-button-group class="pull-right">
            <el-button v-if="hasPermission('shxg:flfl:xcShxgFlwk:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('shxg:flfl:xcShxgFlwk:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
            size="medium"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            sortable="custom"
            label="姓名">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('hygl:chkhz:chkhz:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('hygl:chkhz:chkhz:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dwmc"
            show-overflow-tooltip
            sortable="custom"
            label="单位名称">
          </el-table-column>
          <el-table-column
            prop="sjhm"
            show-overflow-tooltip
            sortable="custom"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="dzyx"
            show-overflow-tooltip
            sortable="custom"
            label="电子邮箱">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            fixed="right"
            :key="Math.random()"
            width="200"
            label="操作">
            <template  slot-scope="scope">
              <el-button v-if="hasPermission('hygl:chkhz:chkhz:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
              <el-button v-if="hasPermission('hygl:chkhz:chkhz:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
              <el-button v-if="hasPermission('hygl:chkhz:chkhz:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    </div>
  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
export default {
  data () {
    return {
      searchForm: {
        name: '',
        flid: ''
      },
      filterText: '',
      khzflTreeData: [],
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
    SelectTree
  },
  activated () {
    this.refreshTree()
    this.refreshList()
  },
  computed: {
  },
  watch: {
    filterText (val) {
      this.$refs.chkhzFlTree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    refreshTree () {
      this.$http({
        url: `/zxsq/flb/xcBgzxLjfl/treeData?flag=9`,  // 9:参会客户组分类
        method: 'get'
      }).then(({data}) => {
        this.khzflTreeData = data.treeData
      })
    },
    handleNodeClick (data) {
      this.searchForm.flid = data.id
      this.refreshList()
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/hygl/chkhz/chkhz/list',
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
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.filterText = ''
      this.$refs.chkhzFlTree.setCurrentKey(null)
      this.refreshList()
    }
  }
}
</script>
