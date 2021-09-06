<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-table
        :data="dataList"
        size="small"
        height="550px"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        class="table">
        <el-table-column
          prop="code"
          show-overflow-tooltip
          label="字段名">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          align="center"
          :prop="item.prop"
          :label="item.name">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '数据比较',
      visible: false,
      version1: '',
      version2: '',
      dataList: [],
      tableColumn: [],
      loading: false
    }
  },
  methods: {
    init (id1, id2) {
      this.dataList = []
      this.tableColumn = []
      this.visible = true
      if (parseInt(this.version2) > parseInt(this.version1)) {
        this.tableColumn.push({
          name: '版本' + this.version1,
          prop: 'version1'
        }, {
          name: '版本' + this.version2,
          prop: 'version2'
        })
      } else {
        this.tableColumn.push({
          name: '版本' + this.version2,
          prop: 'version1'
        }, {
          name: '版本' + this.version1,
          prop: 'version2'
        })
      }
      this.$nextTick(() => {
        this.loading = true
        this.$http({
          url: `/datalog/zcglDataLog/listByIds`,
          method: 'get',
          params: {
            dataId1: id1,
            dataId2: id2
          }
        }).then(({data}) => {
          let json1 = JSON.parse(data.list[0].dataContent)
          let json2 = JSON.parse(data.list[1].dataContent)
          for (let item1 in json1) {
            for (let item2 in json2) {
              if (item1 === item2) {
                this.dataList.push({
                  code: item1,
                  version1: json1[item1],
                  version2: json2[item2]
                })
              }
            }
          }

          this.loading = false
        })
      })
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.version1 !== row.version2) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style lang="less">
.el-table .warning-row {
  background: #dad010;
}
</style>
