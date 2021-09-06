<template>

  <div style="background-color: white;width: 100%;height: 100%">
    <div style="padding-top: 1%;" class="formItem">
      <el-form ref="form" :model="form">
        <el-row :gutter="0">
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="form.region" placeholder="请选择任务类型" @change="changeOption">
                <el-option
                  v-for="item in $dictUtils.getDictList('TASK_TYPE')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="form.regionId" placeholder="请选择任务">
                <el-option
                  v-for="item in dataList"
                  :key="item.id"
                  :label="item.taskName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" size="small">查询</el-button>
              <el-button size="small">重置</el-button>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <div class="rwdt">
      <el-steps :active="1" align-center align-center>
        <el-step v-for="(item,index) in stepData" :title="item.title" :key="index" :icon="item.icon"
                 :description="item.description">
        </el-step>
      </el-steps>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          name: '',
          region: '',
          regionId: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        dataList: [],
        stepData: [{
          title: '创建任务',
          icon: 'el-icon-edit',
          description: '2020-20-20 18:18:18'
        }, {
          title: '领取任务',
          icon: 'el-icon-upload',
          description: '2020-20-20 18:18:18'
        }, {
          title: '共享任务',
          icon: 'el-icon-picture',
          description: '2020-20-20 18:18:18'
        }, {
          title: '任务简报',
          icon: 'el-icon-s-help',
          description: '2020-20-20 18:18:18'
        }, {
          title: '分管任务',
          icon: 'el-icon-menu',
          description: '2020-20-20 18:18:18'
        }, {
          title: '分管任务',
          icon: 'el-icon-menu',
          description: '2020-20-20 18:18:18'
        }, {
          title: '分管任务',
          icon: 'el-icon-menu',
          description: '2020-20-20 18:18:18'
        }, {
          title: '分管任务',
          icon: 'el-icon-menu',
          description: '2020-20-20 18:18:18'
        }, {
          title: '分管任务',
          icon: 'el-icon-menu',
          description: '2020-20-20 18:18:18'
        }, {
          title: '分管任务',
          icon: 'el-icon-menu',
          description: '2020-20-20 18:18:18'
        }]
      }
    },
    methods: {
      changeOption (taskType) {
        this.$http({
          url: '/maintask/mainTask/findByType',
          method: 'post',
          params: {
            'taskType': taskType
          }
        }).then(({data}) => {
          this.dataList = data
        }
        )
      },
      ghjksj () {
        this.$http({
          url: `/maintask/mainTask/details?id=${this.inputForm.id}`,
          method: 'get'
        }).then(({data}) => {
          this.inputForm = this.recover(this.inputForm, data.mainTask)
          this.taskStatus = this.inputForm.taskStatus
          this.loading = false
        })
      }
    }
  }
</script>


<style lang="less">
  .rwdt {
    width: 100%;
    height: 40%;
    margin-top: 6%;
    padding-top: 10%;
    padding-bottom: 10%;
    background-color: #f2f2f2;
  }

 /* .formItem {
  .el-form-item__content
    margin-left: 10px;
  }*/

</style>
