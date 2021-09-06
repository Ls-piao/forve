<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
               label-width="120px">
        <el-row  :gutter="15">
          <el-col :span="12">
            <el-form-item label="数据库表名" prop="dataTable"
                          :rules="[
                  {required: true, message:'数据库表名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dataTable" placeholder="请填写数据库表名"  readonly   ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据ID" prop="dataId"
                          :rules="[
                  {required: true, message:'数据ID', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dataId" placeholder="请填写数据ID"  readonly   ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号1" prop="id1"
                          :rules="[
                  {required: true, message:'版本号1不能为空', trigger:'blur'}
                 ]">
<!--              <el-input v-model="inputForm.version1" placeholder="请填写版本号1"     ></el-input>-->
              <el-select v-model="inputForm.id1" ref="version1">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.dataVersion">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号2" prop="id2"
                          :rules="[
                  {required: true, message:'版本号2不能为空', trigger:'blur'}
                 ]">
<!--              <el-input v-model="inputForm.version2" placeholder="请填写版本号2"     ></el-input>-->
              <el-select v-model="inputForm.id2" ref="version2">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.dataVersion">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
    </el-dialog>
    <show-compare ref="showCompare"></show-compare>
  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import ShowCompare from './ShowCompare'
export default {
  data () {
    return {
      title: '数据对比预览',
      method: '',
      visible: false,
      loading: false,
      inputForm: {
        id1: '',
        id2: '',
        dataTable: '',
        dataId: '',
        version1: '',
        version2: ''
      },
      options: []
    }
  },
  components: {
    SelectTree,
    ShowCompare
  },
  methods: {
    init (dataId, dataTable, id1, id2) {
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.loading = true
        this.$http({
          url: `/datalog/zcglDataLog/list`,
          method: 'get',
          params: {
            dataId: dataId,
            dataTable: dataTable
          }
        }).then(({data}) => {
          this.loading = false
          this.options = data.page.list
          this.inputForm.dataId = dataId
          this.inputForm.dataTable = dataTable
          this.inputForm.id1 = id1
          this.inputForm.id2 = id2
        })
      })
    },
    // 表单提交
    doSubmit () {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.visible = false
          this.$refs.showCompare.version1 = this.$refs.version1.selected.label
          this.$refs.showCompare.version2 = this.$refs.version2.selected.label
          this.$refs.showCompare.init(this.inputForm.id1, this.inputForm.id2)
        }
      })
    }
  }
}
</script>
