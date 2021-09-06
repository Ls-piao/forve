<template>
<div class="form-center">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
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
            <td class="tdbackgr"><span style="color: red;">* </span>请假类型</td>
            <td colspan="5" class="tdbackgr-white">
              <el-radio-group v-model="inputForm.qjlx">
                <el-radio v-for="item in $dictUtils.getDictList('QJLX')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="tdbackgr"><span style="color: red;">* </span>请假时间</td>
            <td colspan="5" class="tdbackgr-white" style="text-align: left">
                <el-date-picker
                  v-model="inputForm.qjsj"
                  type="datetimerange"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  unlink-panels
                  range-separator=" 至 "
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
<!--              合计{{timeDifference}}-->
            </td>
          </tr>
          <tr style="height: 200px">
            <td class="tdbackgr"><span style="color: red;">* </span>事由</td>
            <td class="tdbackgr-white" colspan="5">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写事由" class="noborder"  ></el-input>
            </td>
          </tr>
          <tr>
            <td class="tdbackgr">附件</td>
            <td class="tdbackgr-white" colspan="5">
              <el-upload ref="fj"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/xcgzlcqj/xcGzlcQj`"
                         :headers="{token: $cookie.get('token')}"
                         :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                         :on-success="(response, file, fileList) => {
                       inputForm.fj = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                         :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.fj = fileList.map(item => item.url).join('|')
                    }"
                         :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                         multiple
                         :limit="5"
                         :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                         :file-list="fjArra">
                <el-button size="small" type="primary">添加相关附件</el-button>
<!--                <div slot="tip" class="el-upload__tip">添加相关附件</div>-->
              </el-upload>
            </td>
          </tr>
        </table>
        </el-row>
    </el-form>
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
          sqr: '',  // 申请人
          bm: '',   // 部门
          gw: '',   // 岗位
          qjlx: '', // 请假类型
          qjsj: '', // 请假时间
          remarks: '', // 备注
          fj: ''  // 附件
        },
        sqr: '',  // 承接页面自动获取申请人姓名数据
        bm: '',   // 承接页面自动获取申请人部门数据
        gw: '',   // 承接页面自动获取申请人岗位数据
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
      // 计算工时时间差
      // timeDifference: {
      //   get: function () {
      //     if (this.inputForm.qjsj[0] === undefined || this.inputForm.qjsj[1] === undefined) {
      //       return '0天'
      //     }
      //     // let startTime = new Date(this.inputForm.qjsj[0])
      //     // let endTime = new Date(this.inputForm.qjsj[1])
      //     // let difftime = (endTime - startTime) / 1000
      //     // let days = parseInt(difftime / 86400)
      //     // let hours = parseInt(difftime / 3600) - 24 * days
      //     // console.log(difftime)
      //     // console.log(days)
      //     // console.log(hours)
      //     // let str = ''
      //     // if (days > 0) {
      //     //   str = str + days + '天'
      //     // }
      //     // if (hours > 0) {
      //     //   str = str + hours + '小时'
      //     // }
      //     // return str
      //     let str1 = this.inputForm.qjsj[0]
      //     let str2 = this.inputForm.qjsj[1]
      //     console.log(str1)
      //     console.log(str2)
      //     let datetime1 = new Date()
      //     let datetime2 = new Date()
      //
      //     datetime1.setFullYear(str1.substr(0, 4), str1.substr(5, 2) - 1, str1.substr(8, 2))
      //     datetime2.setFullYear(str2.substr(0, 4), str2.substr(5, 2) - 1, str2.substr(8, 2))
      //
      //     datetime1.setMilliseconds(0)
      //     datetime2.setMilliseconds(0)
      //
      //     datetime1.setHours(str1.substr(11, 2), 0, 0)
      //     datetime2.setHours(str2.substr(11, 2), 0, 0)
      //
      //     if (datetime1.getDay() === 0 || datetime1.getDay() === 6) {
      //       datetime1.setDate(datetime1.getDate() - 1)
      //       datetime1.setHours(23, 0, 0)
      //     }
      //     if (datetime1.getDay() === 0 || datetime1.getDay() === 6) {
      //       datetime1.setDate(datetime1.getDate() - 1)
      //       datetime1.setHours(23, 0, 0)
      //     }
      //     if (datetime2.getDay() === 0 || datetime2.getDay() === 6) {
      //       datetime2.setDate(datetime2.getDate() + 1)
      //       datetime2.setHours(0, 0, 0)
      //     }
      //     if (datetime2.getDay() === 0 || datetime2.getDay() === 6) {
      //       datetime2.setDate(datetime2.getDate() + 1)
      //       datetime2.setHours(0, 0, 0)
      //     }
      //     let travelHours = 0
      //
      //     let datetime3 = datetime1
      //     for (let i = 0; i < 60; i++) {
      //       let sd = datetime1.getDate()
      //       let ed = datetime2.getDate()
      //       if (sd === ed - 1) {
      //         break
      //       }
      //       datetime1.setDate(datetime1.getDate() + 1)
      //       if (datetime1.getDay() > 0 && datetime1.getDay() < 6) {
      //         travelHours += 8
      //       }
      //     }
      //
      //     if (parseInt(datetime3.getHours()) <= 9) {
      //       travelHours += 8
      //     } else {
      //       if (parseInt(datetime3.getHours()) <= 12) {
      //         travelHours += 12 - parseInt(datetime3.getHours()) + 5
      //       } else {
      //         if (parseInt(datetime3.getHours()) <= 18) {
      //           travelHours += 18 - parseInt(datetime3.getHours())
      //         }
      //       }
      //     }
      //     if (parseInt(datetime2.getHours()) >= 18) {
      //       travelHours += 8
      //     } else {
      //       if (parseInt(datetime2.getHours()) >= 13) {
      //         travelHours += 3 + parseInt(datetime2.getHours()) - 13
      //       } else {
      //         if (parseInt(datetime2.getHours()) >= 9) {
      //           travelHours += parseInt(datetime2.getHours()) - 9
      //         }
      //       }
      //     }
      //     return travelHours + '工时'
      //   }
      //
      // }
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
                // console.log(this.sqr)
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
        // 页面校验 -- 请假类型
        if (this.inputForm.qjlx === null || this.inputForm.qjsj.length === 0) {
          this.$message.error('请填写请假类型')
          return false
        }
      // 页面校验 -- 请假时间
        if (this.inputForm.qjsj.length === 0) {
          this.$message.error('请填写请假时间')
          return false
        }
       // 页面校验 -- 请假事由
        if (this.inputForm.remarks.length === 0) {
          this.$message.error('请填写请假事由')
          return false
        }
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/xcgzlcqj/xcGzlcQj/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
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
  height: 40px;
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

</style>
