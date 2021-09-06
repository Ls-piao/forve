<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <div class="page">
        <div class="bg-white top">
          <el-table
            :data="dataList"
            size="small"
            height="500px"
            v-loading="loading"
            class="table">
            <el-table-column
              prop="articlesName"
              show-overflow-tooltip
              sortable="custom"
              label="领用物品">
            </el-table-column>
            <el-table-column
              prop="userName"
              show-overflow-tooltip
              sortable="custom"
              label="领用人">
            </el-table-column>
            <el-table-column
              prop="collectionDate"
              show-overflow-tooltip
              sortable="custom"
              label="领用时间">
            </el-table-column>
            <el-table-column
              prop="num"
              show-overflow-tooltip
              sortable="custom"
              label="领用数量">
            </el-table-column>
            <el-table-column
              prop="jbrName"
              show-overflow-tooltip
              sortable="custom"
              label="经办人">
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        collectionPerson: '',
        articlesName: '',
        collectionDate: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      loading: false,
      visible: false,
      title: ''
    }
  },
  components: {},
  activated () {
    // this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList (title, id) {
      this.visible = true
      this.title = title
      this.loading = true
      this.$http({
        url: '/ypgl/yply/articlesCollection/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          collectionArticles: id
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
    }
  }
}
</script>
