<template>
  <div class="container">
    <div class="jp-common-layout-left left">
      <div class="jp-common-title">
        <el-input
          placeholder="组织机构:请输入关键字过滤"
          size="small"
          clearable
          v-model="filterText"
        ></el-input>
      </div>
      <div class="jp-common-el-tree-scrollbar el-scrollbar">
        <div class="el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <el-tree
              icon-class="el-icon-circle-plus-outline"
              :indent="0"
              class="filter-tree jp-common-el-tree tree-line"
              :data="treeData"
              :props="{
                value: 'id', // ID字段名
                label: 'name', // 显示名称
                children: 'children', // 子级字段名
              }"
              node-key="id"
              default-expand-all
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              highlight-current
              @node-click="handleNodeClick"
              ref="officeTree"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i
                  v-if="!data.children || data.children.length == 0"
                  :class="
                    data.type == 1
                      ? 'el-icon-place'
                      : data.type == 2
                      ? 'el-icon-office-building'
                      : 'el-icon-school'
                  "
                ></i>
                <span style="flex: 1">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="page-header">
        <el-form class="searchbox" :inline="true">
          <el-form-item>
            <template #label> 姓名： </template>
            <el-input v-model="outParams.id" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <template #label> 户主： </template>
            <el-input v-model="outParams.user" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <template #label> 门牌号： </template>
            <el-input v-model="outParams.number" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div style="line-height: 2.2">
          <el-button
            @click="doSearch"
            size="mini"
            icon="el-icon-search"
            type="primary"
            >查询</el-button
          >
          <el-button @click="reset" size="mini" icon="el-icon-refresh"
            >重置</el-button
          >
        </div>
      </div>
      <div class="tableBox">
        <div class="listbar">
          <el-radio-group v-model="showType" size="mini" class="chose">
            <el-radio-button size="mini" label="all">全部</el-radio-button>
            <el-radio-button size="mini" label="selected"
              >选中({{ selectedData.length }})</el-radio-button
            >
          </el-radio-group>
          <el-button
            class="checkbtn-add"
            type="default"
            size="mini"
            icon="el-icon-plus"
            @click="add(selectedData)"
            >新增</el-button
          >
          <el-button
            class="checkbtn"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(selectedData)"
            >批量删除</el-button
          >
          <el-button
            class="checkbtn"
            type="info"
            size="mini"
            icon="el-icon-download"
            @click="downTemplate(selectedData)"
            >下载模板</el-button
          >
          <el-button
            class="checkbtn"
            type="warning"
            size="mini"
            icon="el-icon-upload2"
            @click="importData(selectedData)"
            >导入</el-button
          >
          <el-button
            class="checkbtn"
            type="primary"
            size="mini"
            icon="el-icon-download"
            @click="exportData(selectedData)"
            >导出</el-button
          >
        </div>

        <MyTable
          class="tables"
          ref="table"
          :outerData="tableData"
          :columnNames="tableColumnNames"
          :outParams="outParams"
          :selections="true"
          :showType="showType"
          :isSort="false"
          :limit="15"
          @selectedDataChange="selectedDataChange"
          rowKey="id"
        ></MyTable>
      </div>
      <addDialog ref="addDialog" />
      <viewDialog ref="viewDialog" />
      <previewDialog ref="previewDialog" />
    </div>
  </div>
</template>

<script>
import personData from "./person.json";
import treeData from "./treeData2.json";
import addDialog from "./addResident";
import viewDialog from "./viewResident";
import previewDialog from './preview'
export default {
  name: "",
  components: {
    addDialog,
    viewDialog,
    previewDialog
  },
  props: {},
  data() {
    return {
      treeData,
      filterText: "",
      filterNode: "name",

      searchParams: {
        id: "",
        user: "",
        number: "",
      },
      tableData: personData,
      tableColumnNames: [
        "resident_id",
        "resident_community",
        "resident_xiaoqu",
        "resident_building",
        "resident_unit",
        "resident_number",
        "resident_avatar",
        "resident_name",
        "resident_sex",
        "resident_relation",
        "resident_phone",
        "resident_work",
        "resident_isReligious",
        "resident_isLow",
        "resident_idCard",
        "resident_born",
        "resident_mz",
        "resident_isFloat",
        "resident_jyqk",
        "resident_whcd",
        "resident_health",
        "resident_jycs",
        "resident_hj",
        "resident_zzmm",
        "resident_hyzk",
        "resident_cjlb",
        "resident_desc",
        "shop_control",
      ],
      outParams: {
        id: "",
        user: "",
        number: "",
      },
      showType: "all", // 表格显示数据类型
      selectedData: [], // 选中表格数据
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleNodeClick() {},
    selectedDataChange(val) {
      this.selectedData = val;
    },
    doSearch() {},
    reset() {},
    dels(items) {},
    handleDelete(scope) {
      if (scope instanceof Array) {
      } else {
        scope = [scope];
      }
      if (scope.length == 0) {
        this.$alert("请选择需要删除的数据", "错误提示", { type: "error" });
        return;
      }
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dels(scope);
        })
        .catch(() => {});
    },
    add() {
      this.$refs.addDialog.init("add");
    },
    edit(v) {
      this.$refs.addDialog.init("edit", v);
    },
    view(v) {
      this.$refs.viewDialog.init(v);
    },
    preview(v,prop){
        this.$refs.previewDialog.init(v,prop)
    }
  },
};
</script>
<style lang="less">
.tree-line {
  .el-tree-node {
    position: relative;
    padding-left: 16px; // 缩进量
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #52627c;
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: "";
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #52627c;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 16px;
    // 叶子节点（无子节点）
    &.is-leaf {
      color: transparent;
      // display: none; // 也可以去掉
    }
  }
}
</style>
<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  .left {
    width: 20%;
    margin-right: 10px;
  }
  .content {
    width: 80%;
    display: flex;
    flex-direction: column;
    .tableBox {
      flex: 1;
    }
  }
}
.icon {
  font-size: 14px;
}
.chose {
  margin-right: 8px;
}
.checkbtn {
  border: 0;
  margin-bottom: 8px;
  cursor: pointer;
}
.checkbtn-add {
  color: #fff;
  background: rgba(0, 212, 192, 1);
  border: 0;
  margin-bottom: 8px;
  cursor: pointer;
}
.checkbtn-add:hover {
  color: #fff;
  background: rgba(0, 212, 192, 0.8);
}
.searchbox {
  display: flex;
  align-items: center;
}
.page-header {
  position: relative;
  margin-bottom: 12px;
  background-color: #fff;
  min-height: 42px;
  box-sizing: border-box;
  padding: 8px;
  border-left: #127efc 4px solid;
  display: flex;
  .el-input,
  .el-cascader,
  .el-date-editor,
  .el-select {
    margin-right: 12px;
    width: 100%;
  }
}
.tableBox {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  flex: 1;
}
.tables {
  height: 84%;
}
.tableBox tbody tr {
  height: 40px;
  line-height: 40px;
}

/deep/.opt-edit {
  display: inline-block;
  padding: 0 6px;
  background: #e6f2ff;
  color: #007cff;
  border-radius: 2px;
  cursor: pointer;
}

/deep/.opt-edit:hover {
  background: #cce5ff;
}

/deep/.opt-del {
  display: inline-block;
  padding: 0 6px;
  background: #fce9e9;
  color: #f04864;
  border-radius: 2px;
  margin-left: 10px;
  cursor: pointer;
}

/deep/.opt-del:hover {
  background: #f3cfd2;
}
/deep/.opt-view {
  margin-right: 10px;
  display: inline-block;
  padding: 0 6px;
  background: rgba(0, 212, 192, 0.5);
  color: #fff;
  border-radius: 2px;
  margin-left: 10px;
  cursor: pointer;
}

/deep/.opt-view:hover {
  background: rgba(0, 212, 192, 0.8);
}
/deep/ .img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>
