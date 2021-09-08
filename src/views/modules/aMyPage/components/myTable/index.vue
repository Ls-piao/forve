<template>
  <div>
    <el-row style="height:100%">
      <el-table
        ref="table"
        :height="tableHeight"
        :data="showType == 'all' ? items : selectedItems"
        border
        stripe
        class="w tc"
        :row-key="getRowKeys"
        @selection-change="selectionChange"
        :header-cell-style="{ 'text-align': 'center' }"
        :size="size"
        :max-height="maxHeight"
        v-loading="loading"
        :element-loading-text="loadingOption.text"
        :element-loading-spinner="loadingOption.spinner"
        :element-loading-background="loadingOption.background"
        :show-summary="showSummary"
        :summary-method="getSummaries"
        @row-click="rowClick"
      >
        <!--选择列-->
        <el-table-column
          v-if="selections"
          type="selection"
          width="55"
          :selectable="selectable"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <template slot="empty">
          <div>
            <img src="../../images/nodata.png" alt />
            <p>暂无数据</p>
          </div>
        </template>
        <!--序号列-->

        <el-table-column label="序号" width="65" type="index" align="center" v-if="isSort"></el-table-column>
        <!-- <el-table-column label="序号" width="65" align="center" v-if="isSort">
                        <template slot-scope="scope">
                            <span>{{ getIndex(scope.$index+1) }}</span>
                        </template>
        </el-table-column>-->
        <!--自定义列-->
        <template v-for="column in columns">
          <!--多级表头-->
          <table-column
            v-if="column.children && column.children.length"
            :key="column.columnName"
            :coloumn-header="column"
          ></table-column>
          <!--普通表头-->
          <el-table-column
            v-else
            :prop="column.prop"
            :key="column.columnName"
            :width="column.width"
            :label="column.label"
            :min-width="column.minWidth"
            :align="column.align"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <my-render v-if="column.render" :row="scope.row" :render="column.render"></my-render>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        v-if="pagination && showType == 'all'"
        class="mt10 tr"
        :current-page="page"
        :page-size="limit"
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"
        background
        layout="prev, pager, next, jumper, slot"
      >
        <span class="fl">共{{ total }}条记录,{{ page }}/{{ totalPage }}页</span>
      </el-pagination>
      <span v-else class="fl mt10 el-pagination" style="line-height: 28px">共{{ total }}条记录</span>
    </el-row>
  </div>
</template>

<script>
import MyRender from "./MyRender";
import TableColumn from "./TableColumn";
import columnsAll from "./columnsAll.js";
function getIndex(idx) {
    let orign = String(idx);
    if (orign.length <= 1) {
        orign = "0" + orign;
    }
    return orign;
}
export default {
  name: "MyTable",
  components: {
    MyRender,
    TableColumn
  },
  props: {
    // 静态数据
    outerData: { type: Array, default: () => [] },
    // 当由外部传入数据时是否展示所有数据
    showAllOuterData: { type: Boolean, default: false },
    // 获取数据方法
    fetchFun: Function,
    outParams: { type: Object, default: () => {} },
    // 父元素对象,默认值为this.$parent，解决嵌套在其他组件中使用的bug
    parent: Object,
    // 表格列名
    columnNames: { type: Array, default: () => [] },
    // 直接传入列配置
    customColumns: { type: Array, default: () => [] },
    disableItems: { type: Array, default: () => [] },
    // 是否支持选择
    selections: { type: Boolean, default: false },
    showType: { type: String, default: "all" },
    // 是否支持分页
    pagination: { type: Boolean, default: true },
    // 是否展示合计行
    showSummary: { type: Boolean, default: false },
    getSummaries: Function,
    //加载配置选项
    loadingOption: {
      type: Object,
      default: function() {
        return {
          text: "",
          spinner: "",
          background: ""
        };
      }
    },
    rowKey: { type: String, default: "" },
    maxHeight: Number,
    isSort: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: "mini"
    },
    limit:{
      type:Number,
      default:10
    },
    tableHeight:{
      type:String,
      default:'100%'
    }
  },
  data() {
    return {
      loading: false,
      page: 1,
      items: [],
      selectedItems: [],
      total: 0
    };
  },
  computed: {
    totalPage: function() {
      return Math.ceil(this.total / this.limit || 1);
    },
    columns() {
      if (this.customColumns && this.customColumns.length) {
        for (let x of this.customColumns) {
        }
        return this.customColumns;
      }
      return this.getColumns(this.columnNames);
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    /* 获取列
     * colsName： 表格使用列
     */
    getColumns(columnNames = []) {
      // 所有表格列
      let colsAll = columnsAll(this.parent || this.$parent);
      let cols = [];
      for (let i = 0, leni = columnNames.length; i < leni; i++) {
        for (let j = 0, lenj = colsAll.length; j < lenj; j++) {
          if (columnNames[i] === colsAll[j].columnName) {
            cols.push(colsAll[j]);
            break;
          }
        }
      }
      return cols;
    },
    // 行禁止
    selectable(row) {
      let flag = true;
      this.disableItems.map(item => {
        if (item.wareId === row.wareId || item.wareId === 0) {
          flag = false;
        }
        return;
      });
      return flag;
    },
    // 初始化表格数据
    initData() {
      // 静态
      if (this.outerData.length) {
        this.total = this.outerData.length;
        if (this.showAllOuterData) {
          this.items = this.outerData;
          return;
        }
        let start = (this.page - 1) * this.limit;
        let end = this.page * this.limit;
        this.items = this.outerData.slice(start, end);
      } else {
        // 动态
        this.handleFetch();
      }
    },
    // 表格数据请求
    async handleFetch() {
      this.loading = true;
      const params = this.pagination
        ? Object.assign(
            {},
            {
              page: this.page,
              limit: this.limit
            },
            this.outParams
          )
        : this.outParams;
      // 调整页码大小
      params && (this.limit = params.limit);
      const res = await this.fetchFun(params);
      this.loading = false;
      if (!res) return; // res为undefined，出错中止
      const {
        data: { data }
      } = res;

      // const { data } = res
      // 异常处理
      if (!data) {
        this.total = 0;
        this.items = [];
        return;
      }
      // 分页与不分页区分
      if (this.pagination) {
        this.total = data.total;
        this.items = data.list;
      } else {
        this.total = data.length;
        this.items = data;
      }
    },
    // 选项选择
    selectionChange(val) {
      this.selectedItems = val;
      this.$emit("selectedDataChange", val);
    },
    // 页码跳转
    currentChange(val) {
      if (this.loading) {
        return;
      }
      this.page = val;
      this.initData();
    },
    // 上一页
    handlePreviousPage(noPreviousPage) {
      if (this.loading) {
        return;
      }
      if (this.page === 1) {
        return noPreviousPage();
      }
      this.page--;
      this.initData();
    },
    // 下一页
    handleNextPage(noNextPage) {
      if (this.loading) {
        return;
      }
      if (this.total <= this.page * this.limit) {
        noNextPage();
        return;
      }
      this.page++;
      this.initData();
    },
    // 每页数据条数改变
    sizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.initData();
    },
    getIndex(idx) {
      return getIndex(idx);
    },
    getRowKeys(row) {
      return row[this.rowKey];
    },
    rowClick(row){
       this.$refs.table.toggleRowSelection(row);
    }
  }
};
</script>

<style lang="scss" scoped></style>
