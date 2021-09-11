<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="cancelForm"
    class="dia"
    title="审核"
  >
    <div class="dia-content">
      <el-form label-position="left" label-width="120px" size="mini" >
        <!-- <el-form-item label="待审核申请表">
          <div v-for="v in data" :key="v.ID">
            {{v.ID}}
          </div>
        </el-form-item> -->
        <el-form-item label="审核结果">
          <el-radio v-model="radio" :label="1">通过</el-radio>
          <el-radio v-model="radio" :label="0">不通过</el-radio>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="approveOpinion"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button
          @click="cancelForm"
          >取消</el-button
        >
        <el-button type="primary" @click="batchCheckCommit">确认审核</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      data: "",
      radio: 1,
      approveOpinion: "",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    init(v) {
      this.data = v;
      this.visible = true;
    },
    cancelForm() {
      this.visible = false;
      this.approveOpinion = ''
      this.radio = 1
    },
    batchCheckCommit() {
      this.cancelForm()
    },
  },
};
</script>
<style lang="less">
.dia {
  .el-dialog__header {
    color: #fff;
    background: linear-gradient(
      to right,
      rgb(74, 108, 219),
      #3f8ef7,
      #2d9dc9,
      #3f8ef7
    ) !important;
    span {
      color: #fff;
    }
    i {
      color: #fff;
    }
  }
  .el-dialog__body {
    background-color: #fff !important;
  }
}
.dia-content {
  .el-form {
    .el-form-item {
      .el-form-item__label {
        line-height: 32px !important;
      }
      .el-form-item__content {
        .el-textarea {
          textarea {
            min-height: 200px !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.footer {
  justify-content: flex-end;
  text-align: right;
}

</style>
