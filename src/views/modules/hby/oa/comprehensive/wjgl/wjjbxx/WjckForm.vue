<template xmlns="http://www.w3.org/1999/html">
  <div class="spreadOut">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-row style="background-color: white;margin: 1%;border-radius:15px;margin-top: -1%;">
        <div style="text-align:center">
          <h2>{{this.searchForm.wjbt}}</h2>
        </div>
        <div style="float: right;margin-right: 5%;">
          满分：{{this.searchForm.wjmf}} 分
        </div>
        <div style="float: right;margin-right: 5%;">
          问卷编码：{{this.searchForm.wjbm}}
        </div>
      </el-row>

      <el-row style="background-color: white;margin: 1%;border-radius:15px ">
        <el-row style="margin: 3% 0 0 3%">
          <el-col :span="24">
            <p style="font-size: 15px"><span style="font-weight: bold;">单选题</span><i style="font-size: 14px;margin-left: 1%;">（{{ this.searchForm.xztdbt }}）</i></p>
          </el-col>
        </el-row>
        <el-row style="margin: 2% 0 0 3%" v-if="item.wtlx==='1'" v-for="(item ,index) in this.flList" :key="index">
          <el-col :span="24">
            <p style="font-size: 15px">{{ item.wtxh }}.{{ item.wtbt }} {{ item.wtzf }}分</p>
          </el-col>
          <el-col :span="22" class="topic" style="padding-bottom: 20px;width: 100%">
            <el-row>
              <el-col :span="24" v-for="(it,n) in item.wjdaList" :key="n" >
                <el-radio v-model="checked" :label="n" style="margin: 2% 2% 0 2%;word-break:break-all;">
                  {{ it.dams }}
                </el-radio>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>

      <el-row style="background-color: white;margin: 1%;border-radius:15px ">
        <el-row style="margin: 3% 0 0 3%">
          <el-col :span="24">
            <p style="font-size: 15px"><span style="font-weight: bold;">多选题</span><i style="font-size: 14px;margin-left: 1%;">（{{ this.searchForm.xztdbt }}）</i></p>
          </el-col>
        </el-row>
        <el-row style="margin: 2% 0 0 3%" v-if="item.wtlx==='2'" v-for="(item ,index) in this.flList" :key="index">
          <el-col :span="24">
            <p style="font-size: 15px">{{ item.wtxh }}.{{ item.wtbt }} {{ item.wtzf }}分</p>
          </el-col>
          <el-col :span="22" class="topicJudgment" style="padding-bottom: 20px;width: 100%">
            <el-row v-for="(it,n) in item.wjdaList":key="n">
              <el-col :span="3" >
                  <el-checkbox style="margin: 2% 2% 5% 2%;word-break:break-all;">
                    {{ it.dams }}
                  </el-checkbox>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>

      <!-- 判断-->
      <el-row style="background-color: white;margin: 1%;border-radius:15px ">
        <el-row style="margin: 3% 0 0 3%">
          <el-col :span="24">
            <p style="font-size: 15px"><span style="font-weight: bold;">主观题</span><i style="font-size: 14px;margin-left: 1%;">（{{ this.searchForm.zgtdbt }}）</i></p>
          </el-col>
        </el-row>
        <el-row style="margin: 2% 0 0 3%" v-if="item.wtlx==='3'" v-for="(item ,index) in this.flList" :key="index">
          <el-col :span="24">
            <p style="font-size: 15px">{{ item.wtxh }}.{{ item.wtbt }} {{ item.wtzf }}分</p>
          </el-col>
            <el-row>
              <el-form>
                <el-col :span="5" style="width: 100%;margin-top: 2%;">
                  <el-form-item style="margin-bottom: 0px;">
                    <el-input v-model="zgt[index]"></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
        </el-row>
      </el-row>

      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      checked: '',
      zgt: [],
      flList: [],
      dx: [],
      dxlist: [],
      option: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      inputForm: {
        id: '',
        wjbm: '',
        wjbt: '',
        wjzf: '',
        xztdbt: '',
        zgtdbt: '',
        wjms: ''
      },
      searchForm: {
        wjbt: '',
        wjbm: '',
        wjmf: '',
        xztdbt: '',
        zgtdbt: ''
      }
    }
  },
  components: {
  },
  methods: {
    init (method, obj) {
      this.method = method
      this.inputForm.id = obj.id
      this.searchForm.wjbt = obj.wjbt
      this.searchForm.wjbm = obj.wjbm
      this.searchForm.wjmf = obj.wjmf
      this.searchForm.xztdbt = obj.xztdbt
      this.searchForm.zgtdbt = obj.zgtdbt

      if (method === 'add') {
        this.title = `新建问卷基本信息`
      } else if (method === 'edit') {
        this.title = '修改问卷基本信息'
      } else if (method === 'view') {
        this.title = '查看问卷信息'
      }
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$http({
          url: `/wjjbxx/xcwjjbxx/listByZldt?id=${this.inputForm.id}`,
          method: 'get'
        }).then(({data}) => {
          this.flList = data.list
        })
      })
    }
  }
}
</script>
<style type="text/css">
.printTable, .printTable * {margin: 5px auto; padding: 5px;font-size: 14px;font-family: Arial, 宋体, Helvetica, sans-serif;}
.printTable {display: table; width: 80%; border-collapse: collapse;}
.printTable-tr {display: table-row; height: 30px;}
.printTable-th {display: table-cell;font-weight: bold;height: 100%;border: 1px solid gray;text-align: center;vertical-align: middle;}
.printTable-td {display: table-cell; height: 100%;border: 1px solid gray; text-align: center;vertical-align: middle;}
.printTable-td-noSolid {display: table-cell; height: 100%;border: 0 solid gray; text-align: center;vertical-align: middle;}
</style>

<style type="less" scoped>
.el-dialog {
  left: 55%;
  width: 75%;
  height: 75%;
  background-color: #ebeef5
;
}
.el-dialog__body {
  height: 100%;
}
.spreadOut {
  overflow-y: auto;
  height: 100%;
  overflow-x: hidden;
}
.bg-header {
  background: url("../wjjbxx/static/images/bg0.png");
  width: 100%;
}

.topic {
  border: 1px solid #E5E5E5;
  background-color: #FAFAFA;
  border-radius: 8px;
  margin: 1% 1% 1% 0;
}

.topicJudgment {
  border: 1px solid #E5E5E5;
  background-color: #FAFAFA;
  border-radius: 8px;
  margin: 1% 1% 1% 0;
  padding: 1.5% 1% 1.5% 1.5%;
}

.multiplement {
  border: 1px solid #E5E5E5;
  background-color: #FAFAFB;
  margin: 2.5% 1% 1% 0;
  border-radius: 8px;
  padding: 0.5% 1% 0.5% 1.5%;
}

.textarea {
  margin: 1% 0 1% 0;
  width: 100%;
  background-color: #FAFAFA;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
  padding: 1.5% 2% 2% 2%;
  font-size: 15px;
}

</style>
