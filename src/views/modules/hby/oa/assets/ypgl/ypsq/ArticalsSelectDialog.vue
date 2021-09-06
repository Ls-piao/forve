<template>
  <div>
    <el-dialog
      :title="title"
      width="70%"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-dialogDrag
      class="userDialog"
      :visible.sync="visible">
      <el-container style="height: 500px">
        <el-aside width="200px">

          <el-card class="org">
            <div slot="header" class="clearfix">
              <el-input
                placeholder="请输入用品类别过滤"
                size="small"
                v-model="filterText">
              </el-input>
            </div>
            <el-tree
              :data="articlesTreeData"
              :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
              default-expand-all
              highlight-current
              node-key="id"
              :render-content="renderContent"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="articlesTree">
            </el-tree>
          </el-card>
        </el-aside>

        <el-container>
          <el-header style="text-align: left; font-size: 12px;height:30px">
            <el-form size="small" :inline="true" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
              <el-form-item prop="code">
                <el-input size="small" v-model="searchForm.code" placeholder="用品编码" clearable></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input size="small" v-model="searchForm.name" placeholder="用品名称" clearable></el-input>
              </el-form-item>

              <el-form-item>
                <el-button  type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
                <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
              </el-form-item>
            </el-form>
          </el-header>

          <el-main>
            <el-table
              :data="dataList"
              v-loading="loading"
              size="small"
              ref="articlesSubTable"
              @selection-change="selectionChangeHandle"
              @sort-change="sortChangeHandle"
              height="calc(100% - 40px)"
              style="width: 100%;">
              <el-table-column
                header-align="center"
                align="center"
                v-if="limit <= 1"
                :selectable="selectable"
                width="50">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id" :value="dataListAllSelections[0]&&dataListAllSelections[0].id" @change.native="getTemplateRow(scope.$index,scope.row)"><span></span></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                type="selection"
                header-align="center"
                v-if="limit > 1"
                :selectable="selectable"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                prop="code"
                header-align="center"
                align="center"
                sortable="custom"
                min-width="90"
                label="用品编码">
              </el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="用品名称"
                sortable="custom"
                min-width="90"
                label="用品名称">
              </el-table-column>
              <el-table-column
                prop="unit"
                header-align="center"
                align="center"
                sortable="custom"
                min-width="90"
                label="计量单位">
              </el-table-column>
              <el-table-column
                prop="articles.name"
                header-align="center"
                align="center"
                sortable="custom"
                min-width="90"
                label="用品类型">
              </el-table-column>
              <el-table-column
                prop="enclosure"
                header-align="center"
                align="center"
                label="图片">
                <template slot-scope="scope">
                  <el-image
                    style="height: 50px;width:50px;margin-right:10px;"
                    :src="src" v-for="(src, index) in scope.row.enclosure.split('|')" :key="index"
                    :preview-src-list="scope.row.enclosure.split('|')">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageNo"
              :page-sizes="[5, 10, 50, 100]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-main>
        </el-container>

        <el-aside width="200px">
          <el-tag
            :key="tag.id"
            v-for="tag in dataListAllSelections"
            closable
            :disable-transitions="false"
            @close="del(tag)">
            {{tag.name}}
          </el-tag>
        </el-aside>
      </el-container>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" @click="doSubmit()">确定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        code: '',
        name: '',
        articles: {
          id: ''
        }
      },
      filterText: '',
      dataListAllSelections: [],   // 所有选中的数据包含跨页数据
      dataListSelections: [],
      idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      dataList: [],
      dynamicTags: [],
      articlesTreeData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      loading: false,
      visible: false
    }
  },
  props: {
    selectData: {
      type: Array,
      default: () => { return [] }
    },
    title: {
      type: String,
      default: () => { return '用品选择' }
    },
    limit: {
      type: Number,
      default: 999999
    },
    excludedData: {
      type: [],
      default: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.articlesTree.filter(val)
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.dataListAllSelections = JSON.parse(JSON.stringify(this.selectData))
        this.refreshTree()
        this.resetSearch()
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
                {
                  data.type === '1' ? <i class="fa fa-sitemap"></i> : <i class="fa fa-users"></i>
                }
          <span class="text">{node.label}</span>
              </span>
      )
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.dataListSelections = [row]
      this.$nextTick(() => {
        this.changePageCoreRecordData()
      })
    },
    // 设置选中的方法
    setSelectRow () {
      if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
        this.$refs.articlesSubTable.clearSelection()
        return
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey
      let selectAllIds = []
      this.dataListAllSelections.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs.articlesSubTable.clearSelection()
      for (var i = 0; i < this.dataList.length; i++) {
        if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.articlesSubTable.toggleRowSelection(this.dataList[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData () {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey
      let that = this
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.dataListAllSelections.length <= 0) {
        this.dataListSelections.forEach(row => {
          that.dataListAllSelections.push(row)
        })
        return
      }
      // 总选择里面的key集合
      let selectAllIds = []
      this.dataListAllSelections.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      let selectIds = []
      // 获取当前页选中的id
      this.dataListSelections.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.dataListAllSelections.push(row)
        }
      })
      let noSelectIds = []
      // 得到当前页没有选中的id
      this.dataList.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.dataListAllSelections.length; i++) {
            if (that.dataListAllSelections[i][idKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.dataListAllSelections.splice(i, 1)
              break
            }
          }
        }
      })
    },
    // 得到选中的所有数据
    getAllSelectionData () {
      // 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
      this.changePageCoreRecordData()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    del (tag) {
      this.dataListAllSelections.splice(this.dataListAllSelections.indexOf(tag), 1)
      this.$nextTick(() => {
        this.setSelectRow()
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/ypwh/artilcesSub/list',
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
        this.$nextTick(() => {
          this.setSelectRow()
        })
      })
    },
    refreshTree () {
      this.$http({
        url: `/ypwh/articles/treeData`,
        method: 'get'
      }).then(({data}) => {
        this.articlesTreeData = data.treeData
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.refreshList()
      this.$nextTick(() => {
        this.changePageCoreRecordData()
      })
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshList()
      this.$nextTick(() => {
        this.changePageCoreRecordData()
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      this.$nextTick(() => {
        this.changePageCoreRecordData()
      })
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
    handleNodeClick (data) {
      this.searchForm.articles.id = data.id
      this.refreshList()
    },
    resetSearch () {
      // this.searchForm.company.id = ''
      // this.searchForm.office.id = ''
      this.$refs.articlesTree.setCurrentKey(null)
      this.$refs.searchForm.resetFields()
      this.refreshList()
    },
    doSubmit () {
      if (this.limit < this.dataListAllSelections.length) {
        this.$message.error(`你最多只能选择${this.limit}个用品`)
        return
      }
      this.visible = false
      this.$emit('doSubmit', this.dataListAllSelections)
    },
    // 控制不可选择
    selectable (row, index) {
      let ids = this.excludedData.map(item => { return item.id }).join(',')
      let idArray = ids.split(',')
      for (let i = 0; i < idArray.length; i++) {
        if (row.id === idArray[i]) {
          return false
        }
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.org {
  height: 100%;
  .el-card__header {
    padding: 10px;
  }
  .el-card__body {
    padding: 10px;
    max-height: 520px;
    overflow: auto;
  }
}
.userDialog{
  .el-dialog__body {
    padding: 10px 0px 0px 10px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-main {
    padding: 20px 20px 5px 20px;
    .el-pagination{
      margin-top: 5px;
    }
  }
}
</style>
