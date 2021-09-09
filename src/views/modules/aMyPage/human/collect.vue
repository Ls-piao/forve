<template>
  <div class="container">
    <div class="page-header">
      <el-form class="searchbox" :inline="true">
        <el-form-item>
          <template #label>
            <i class="el-icon-camera-solid icon"></i> 拍摄相机编号：
          </template>
          <el-input v-model="outParams.cameraId" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <template #label>
            <i class="el-icon-camera-solid icon"></i> 视频编号：
          </template>
          <el-input v-model="outParams.videoId" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <template #label>
            <i class="el-icon-camera-solid icon"></i> 判读结果：
          </template>
          <el-input v-model="outParams.result" size="mini"></el-input>
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
          class="checkbtn"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(selectedData)"
          >批量删除</el-button
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
        :limit="15"
        @selectedDataChange="selectedDataChange"
        rowKey="id"
      ></MyTable>
    </div>
    <playVideo class="videoBox" ref="video" />
  </div>
</template>

<script>
import tableData from "./data.json";
import playVideo from "./video";
export default {
  name: "",
  components: {
    playVideo,
  },
  props: {},
  data() {
    return {
      searchParams: {
        cameraId: "",
        videoId: "",
        result: "",
      },
      tableData: tableData.filter((v) => v.isCollect == 1),
      tableColumnNames: [
        "human_cameraId",
        "human_videoId",
        "human_result",
        "human_time",
        "human_creatTime",
        "human_type",
        "human_place",
        "human_des",
        "human_del",
        "human_control",
      ],
      outParams: {
        cameraId: "",
        videoId: "",
        result: "",
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
    play(v) {
      this.$refs.video.init(v);
    },
    collect(v) {
      if (
        this.tableData[this.tableData.findIndex((s) => v.videoId == s.videoId)]
          .isCollect === true
      ) {
        this.tableData[
          this.tableData.findIndex((s) => v.videoId == s.videoId)
        ].isCollect = false;
      } else {
        this.tableData[
          this.tableData.findIndex((s) => v.videoId == s.videoId)
        ].isCollect = true;
      }

      this.$refs.table.initData();
    },
  },
};
</script>
<style lang="less">
.searchbox {
  .el-form-item {
    display: flex;
    margin-right: 8px;
    margin-bottom: 0;
  }
}
.videoBox {
  .el-dialog__header {
    border-bottom: 0;
    background: #f5f5f7;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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
/deep/ .operation {
  &:hover {
    cursor: pointer;
  }
  font-size: 18px;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
  &.delete {
    color: red;
  }
  &.play {
    color: #3f8ef7;
  }
  &.collected {
    color: #f5ca0b;
  }
}
</style>
