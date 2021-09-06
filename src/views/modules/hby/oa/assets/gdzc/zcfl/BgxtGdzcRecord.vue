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
            :data="dataList.slice((pageNo-1)*pageSize,pageNo*pageSize)"
            size="small"
            height="500px"
            v-loading="loading"
            class="table">
            <el-table-column
              prop="name"
              show-overflow-tooltip
              sortable="custom"
              label="资产名称">
            </el-table-column>
            <el-table-column
              prop="responsibilityPeople"
              show-overflow-tooltip
              sortable="custom"
              label="责任人">
            </el-table-column>
            <el-table-column
              prop="create_date"
              show-overflow-tooltip
              sortable="custom"
              label="修改时间">
            </el-table-column>
            <el-table-column
              prop="state"
              show-overflow-tooltip
              sortable="custom"
              label="修改类型">
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
/*        collectionPerson: '',
        articlesName: '',
        collectionDate: '' */
        id: ''
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
      this.searchForm.id = id
      this.$http({
        url: '/zcfl/bgxtGdzcInfo/JlList',
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
    }
  }
}
</script>
