<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
               label-width="120px">
        <el-row  :gutter="15" id="main">
          <el-col :span="12">
            <el-form-item label="用车人姓名">
              <el-input v-model="inputForm.user.name" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号">
              <el-input v-model="inputForm.clxx.cph" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员姓名">
              <el-input v-model="inputForm.jsyName" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员电话">
              <el-input v-model="inputForm.jsydh" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用车开始时间">
              <el-date-picker disabled="disabled"
                style="width: 100%;"
                v-model="inputForm.kssj"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用车结束时间">
              <el-date-picker disabled="disabled"
              style="width: 100%;"
              v-model="inputForm.jssj"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出发地">
              <el-input type="textarea" v-model="inputForm.cfd" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="目的地">
              <el-input type="textarea" v-model="inputForm.mdd" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用车事由">
              <el-input type="textarea" v-model="inputForm.ycsy" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" v-print="printObj" v-noMoreClick>打印</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import UserSelect from '@/components/userSelect'
import CityPicker from '@/components/cityPicker'
import Print from 'vue-print-nb'
export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      inputForm: {
        id: '',
        area: '',
        beginDate: '',
        endDate: '',
        remarks: '',
        ycrName: '',
        jsyName: '',
        jsydh: '',
        kssj: '',
        jssj: '',
        cfd: '',
        mdd: '',
        ycsy: '',
        clxx: {
          cph: ''
        },
        user: {
          name: ''
        }
      },
      printObj: {
        id: 'main',    // 这里是要打印元素的ID
        popTitle: '打印派车单',
        extraCss: '',
        extraHead: ''
      }
    }
  },
  components: {
    SelectTree,
    UserSelect,
    CityPicker,
    Print
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      this.title = '打印派车单'
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        if (method === 'printer') { // 修改或者查看
          this.loading = true
          this.$http({
            url: `/ycgl/clsq/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.clsq)
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
