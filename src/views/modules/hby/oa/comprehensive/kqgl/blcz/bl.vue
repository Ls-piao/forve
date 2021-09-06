<template>
  <div class="page bg-white">
  <div class="form-center">
    <h2 style="text-align:center">补录考勤申请单</h2>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <table border="1px" class="staffLeaveTable">
          <tr>
            <td class="tdbackgr">申请人</td>
            <td class="tdbackgr-white">
              <el-input v-model="sqr"  class="noborder" readonly ></el-input>
              <input type="hidden" v-model="inputForm.sqr"  class="noborder" readonly ></input>
            </td>
            <td class="tdbackgr">部门</td>
            <td class="tdbackgr-white">
              <el-input v-model="bm" class="noborder" readonly  ></el-input>
              <input type="hidden" v-model="inputForm.bm" class="noborder" readonly  ></input>
            </td>
            <td class="tdbackgr">岗位</td>
            <td class="tdbackgr-white">
              <el-input v-model="gw" class="noborder"   ></el-input>
              <input type="hidden" v-model="inputForm.gw" class="noborder"   ></input>
            </td>
          </tr>
          <tr>
            <td class="tdbackgr"><span style="color: red;">* </span>补录日期</td>
            <td colspan="5" class="tdbackgr-white" style="text-align: left;">
              <el-date-picker
                v-model="inputForm.qjsj"
                type="date"
                value-format="yyyy-MM-dd"
                class="cls">
              </el-date-picker>
              <!--              合计{{timeDifference}}-->
              <div style="margin-left: 10px; display: inline">上班时间</div>
              <el-time-picker
                v-model="inputForm.sbsj"
                class="cls"
                format="HH:mm">
              </el-time-picker>
              <div style="margin-left: 10px; display: inline">下班时间</div>
              <el-time-picker
                v-model="inputForm.xbsj"
                minTime="inputForm.sbsj"
                class="cls"
                format="HH:mm">
              </el-time-picker>
            </td>
          </tr>
          <tr style="height: 300px">
            <td class="tdbackgr"><span style="color: red;">* </span>补录原因</td>
            <td class="tdbackgr-white" colspan="5">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写补录原因" class="noborder" style="height: 100px" ></el-input>
            </td>
          </tr>
          <tr style="height: 200px">
            <td class="tdbackgr"><span style="color: red;">* </span>审批意见</td>
            <td class="tdbackgr-white" colspan="5">
              <el-input type="textarea" v-model="inputForm.message" class="noborder" readonly  ></el-input>
            </td>
          </tr>
        </table>
      </el-row>
    </el-form>
  </div>
    <div style="margin-top: 30px;text-align: center;">
      <el-button type="primary" @click="saveForm"  plain>提交</el-button>
      <el-button type="primary" @click="saveForm"  plain>保存</el-button>
      <el-button type="primary" @click="saveForm"  plain>打印</el-button>
      <el-button type="primary" @click="saveForm"  plain>申请流程</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      method: '',
      loading: false,
      fjArra: [],
      sjArray: [],  // 时间Array
      inputForm: {
        id: '',
        sqr: '',
        bm: '',
        gw: '',
        qjsj: '',
        remarks: '',
        sbsj: '',
        xbsj: '',
        message: ''
      },
      sqr: '',
      bm: '',
      gw: '',
      user: {
        id: '',
        name: '',
        loginName: '',
        no: '',
        office: {
          name: ''
        },
        company: {
          name: ''
        },
        photo: '',
        post: {
          name: ''
        }
      }
    }
  },
  props: {
    businessId: {
      type: String,
      default: ''
    },
    formReadOnly: {
      type: Boolean,
      default: false
    }
  },
  components: {
  },
  computed: {
  },
  watch: {
    'businessId': {
      handler (newVal) {
        if (this.businessId) {
          this.init(this.businessId)
        } else {
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            // 获取当前用户
            this.$http({
              url: '/sys/user/info',
              method: 'get'
            }).then(({data}) => {
              if (data.success) {
                this.user = data.user
                this.sqr = this.user.name
                this.inputForm.sqr = this.user.id
                this.bm = this.user.office.name
                this.inputForm.bm = this.user.office.id
                this.gw = this.user.post.name
                this.inputForm.gw = this.user.post.id
              } else {
                this.$message.error('页面加载失败')
              }
            })
          })
        }
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    init (method, id) {
      this.method = method
      if (method === 'add') {
        this.title = `新建请假记录`
      } else if (method === 'edit') {
        this.title = '修改请假记录'
      } else if (method === 'view') {
        this.title = '查看请假记录'
      }
      this.fjArra = []
      if (id) {
        this.loading = true
        this.inputForm.id = id
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$http({
            url: `/xcgzlcqj/xcGzlcQj/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.xcGzlcQj)
            this.$http({
              url: '/sys/user/queryById?id=' + data.xcGzlcQj.sqr,
              method: 'get'
            }).then(({data}) => {
              this.sqr = data.user.name
              this.bm = data.user.office.name
              this.gw = data.user.post.name
              console.log(this.sqr)
            })
            this.sjArray[0] = data.xcGzlcQj.qjkssj
            this.sjArray[1] = data.xcGzlcQj.qjjssj
            this.inputForm.qjsj = this.sjArray
            this.inputForm.fj.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.fjArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
              }
            })
            this.loading = false
          })
        })
      }
    },
    // 表单提交
    saveForm (callback) {
      console.log(this.inputForm)
      this.$confirm('确定要提交申请嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已提交申请!'
        })
        this.$emit('refreshDataList')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消申请!'
        })
      })
      // this.$refs['inputForm'].validate((valid) => {
      //   if (valid) {
      //     this.loading = true
      //     this.$http({
      //       url: `/xcgzlcqj/xcGzlcQj/save`,
      //       method: 'post',
      //       data: this.inputForm
      //     }).then(({data}) => {
      //       if (data && data.success) {
      //         callback(data.businessTable, data.businessId)
      //       }
      //     })
      //   }
      // })
    }
  }
}
</script>

<style type="text/css" scoped="scoped">
.staffLeaveTable {
  width: 100%;
  font-size: 12px;
  text-align: center;
  background-color: rgb(246, 246, 246);
  border-collapse: collapse;
}
.tdbackgr{
  height: 80px;
  text-align: center;
  font-size: 16px;
  font-family: Microsoft YaHei,serif;
}

.tdbackgr-white{
  height: 40px;
  text-align: center;
  background-color: #ffffff;
  font-size: 16px;
  font-family: Microsoft YaHei,serif;
}

.noborder {
  border: none;
}

.form-center {
  width: 90%;
  margin: 0 auto;
}
.noborder>>>.el-input__inner {
  border: none;
}

.noborder>>>.el-textarea__inner {
  border: none;
  min-height: 200px;
}
.cls {
  margin-left: 10px;
}
</style>

