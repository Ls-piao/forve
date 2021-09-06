<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
      <el-form size="small" :model="inputForm" :rules="dataRule" ref="inputForm" @keyup.enter.native="doSubmit()"
        label-width="120px" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'"
        @submit.native.prevent>
        <el-row :gutter="15">

          <el-col :span="12">
            <el-form-item label="姓名" prop="userInfo.name" :rules="[{required: true, message: '姓名不能为空', trigger: 'blur'}]">
              <el-input v-model="inputForm.userInfo.name" maxlength="10" placeholder=""></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="性别" prop="userInfo.sex" :rules="[{required: true, message: '性别不能为空', trigger: 'blur'}]">
              <label v-if="method==='view'">
                {{ $dictUtils.getDictLabel("RSGL_sexType", inputForm.userInfo.sex, '-') }}
              </label>
              <el-radio-group v-else v-model="inputForm.userInfo.sex">
                <el-radio v-for="item in $dictUtils.getDictList('RSGL_sexType')" :label="item.value" :key="item.value">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="民族" prop="userInfo.ethnic">
              <el-select v-model="inputForm.userInfo.ethnic" placeholder="请选择">
                <el-option v-for="item in $dictUtils.getDictList('RSGL_ethnic')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="出生日期" prop="userInfo.birthDate">
              <el-date-picker v-model="inputForm.userInfo.birthDate" type="date" style="width: 100%;" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="userInfo.idNum">
              <el-input v-model="inputForm.userInfo.idNum" maxlength="18" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍" prop="userInfo.nation">
              <el-input v-model="inputForm.userInfo.nation" maxlength="10" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" prop="userInfo.hometown">
              <el-input v-model="inputForm.userInfo.hometown" maxlength="10" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚否" prop="userInfo.marriage">
              <el-select v-model="inputForm.userInfo.marriage" placeholder="请选择">
                <el-option v-for="item in $dictUtils.getDictList('RSGL_marriage')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="userInfo.jobNum">
              <el-input v-model="inputForm.userInfo.jobNum" maxlength="10" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="userInfo.jobStatus" :rules="[{required: true, message: '设定状态', trigger: 'blur'}]">
              <el-select v-model="inputForm.userInfo.jobStatus" placeholder="请选择">
                <el-option v-for="item in $dictUtils.getDictList('RSGL_jobStatus')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="userInfo.entryDate">
              <el-date-picker v-model="inputForm.userInfo.entryDate" type="date" style="width: 100%;" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职前工龄" prop="userInfo.preServiceCount">
              <el-input v-model="inputForm.userInfo.preServiceCount" maxlength="6" placeholder="工龄以年为单位,整数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通信地址" prop="userInfo.address">
              <el-input v-model="inputForm.userInfo.address" maxlength="10" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="userInfo.officeId" :rules="[{required: true, message: '请设定部门', trigger: 'blur'}]">
              <SelectTree
                ref="officeTree"
                :props="{
                    value: 'id',             // ID字段名
                    label: 'name',         // 显示名称
                    children: 'children'    // 子级字段名
                  }"
                :url="`/sys/office/treeData?type=2&&extId=${this.inputForm.userInfo.id}`"
                :value="inputForm.userInfo.officeId"
                :clearable="true"
                :accordion="true"
                @getValue="(value) => {inputForm.userInfo.officeId=value}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="userInfo.postId" :rules="[{required: true, message: '请设定岗位', trigger: 'blur'}]">
              <el-select v-model="inputForm.userInfo.postId" style="width:100%" placeholder="请选择">
                <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="userInfo.phone"
              :rules="[{required: true, message: '电话不能为空', trigger: 'blur'}]">
              <el-input v-model="inputForm.userInfo.phone" maxlength="20" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-collapse v-model="userInfoDataMainFormTab">
          <el-collapse-item title="联系方式">
            <el-button size="small" @click="addUserContactRow()" type="primary">新增联系方式</el-button>
            <el-table class="table" size="small" :data="inputForm.userContact.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column prop="contactType" header-align="center" align="center" show-overflow-tooltip
                label="联系方式">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("RSGL_contactType", scope.row.contactType, '-') }}
                </template>
              </el-table-column>
              <el-table-column prop="detail" header-align="center" align="center" show-overflow-tooltip label="内容">
              </el-table-column>
              <el-table-column prop="remark" header-align="center" align="center" show-overflow-tooltip label="备注">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserContactRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserContactRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserContactRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="职业技能">
            <el-button size="small" @click="addUserTechRow()" type="primary">新增职业技能</el-button>
            <el-table class="table" size="small" :data="inputForm.userTech.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column prop="techType" header-align="center" align="center" show-overflow-tooltip label="技能类别">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("RSGL_techType", scope.row.techType, '-') }}
                </template>
              </el-table-column>
              <el-table-column prop="techTitle" header-align="center" align="center" show-overflow-tooltip label="技能名称">
              </el-table-column>
              <el-table-column prop="techDetail" header-align="center" align="center" show-overflow-tooltip
                label="技能描述">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserTechRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserTechRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserTechRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="岗位履历">

          </el-collapse-item>
          <el-collapse-item title="薪资履历">

          </el-collapse-item>
          <el-collapse-item title="劳动合同">

          </el-collapse-item>
          <el-collapse-item title="教育履历">
            <el-button size="small" @click="addUserEduRow()" type="primary">新增教育履历</el-button>
            <el-table class="table" size="small" :data="inputForm.userEdu.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column header-align="center" align="center" show-overflow-tooltip label="起止时间">
                <template slot-scope="scope">{{scope.row.eduFrom}}&nbsp;至&nbsp;{{scope.row.eduTo}}</template>
              </el-table-column>
              <el-table-column prop="eduSchool" header-align="center" align="center" show-overflow-tooltip label="学校">
              </el-table-column>
              <el-table-column prop="eduMajor" header-align="center" align="center" show-overflow-tooltip label="专业">
              </el-table-column>
              <el-table-column prop="eduRecord" header-align="center" align="center" show-overflow-tooltip label="学历">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("RSGL_eduRecord", scope.row.eduRecord, '-') }}
                </template>
              </el-table-column>
              <el-table-column prop="eduLevel" header-align="center" align="center" show-overflow-tooltip label="学位">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("RSGL_eduLevel", scope.row.eduLevel, '-') }}
                </template>
              </el-table-column>
              <el-table-column prop="eduRemark" header-align="center" align="center" show-overflow-tooltip label="备注">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserEduRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserEduRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserEduRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="工作履历">
            <el-button size="small" @click="addUserResumeRow()" type="primary">新增工作履历</el-button>
            <el-table class="table" size="small" :data="inputForm.userResume.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column header-align="center" align="center" show-overflow-tooltip label="起止时间">
                <template
                  slot-scope="scope">{{scope.row.resumeFrom}}&nbsp;至&nbsp;{{scope.row.resumeTo}}</template>
              </el-table-column>
              <el-table-column prop="resumeCompany" header-align="center" align="center" show-overflow-tooltip
                label="企业名称">
              </el-table-column>
              <el-table-column prop="resumeJob" header-align="center" align="center" show-overflow-tooltip label="所任职务">
              </el-table-column>
              <el-table-column prop="leaveReason" header-align="center" align="center" show-overflow-tooltip
                label="离职原因">
              </el-table-column>
              <el-table-column prop="remark" header-align="center" align="center" show-overflow-tooltip label="备注">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserResumeRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserResumeRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserResumeRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="社会关系">
            <el-button size="small" @click="addUserSocialRow()" type="primary">新增社会关系</el-button>
            <el-table class="table" size="small" :data="inputForm.userSocial.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column prop="socialType" header-align="center" align="center" show-overflow-tooltip label="关系">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("RSGL_socialType", scope.row.socialType, '-') }}
                </template>
              </el-table-column>
              <el-table-column prop="emergencyFlag" header-align="center" align="center" show-overflow-tooltip
                label="紧急联络人">
                <template slot-scope="scope">
                  <el-button type="danger" v-if="scope.row.emergencyFlag === 'E'" icon="el-icon-phone-outline" size="small" circle></el-button>
                </template>
              </el-table-column>
              <el-table-column prop="socialName" header-align="center" align="center" show-overflow-tooltip
                label="关系人姓名">
              </el-table-column>
              <el-table-column prop="workAddress" header-align="center" align="center" show-overflow-tooltip
                label="关系人工作地址">
              </el-table-column>
              <el-table-column prop="homeAddress" header-align="center" align="center" show-overflow-tooltip
                label="关系人住址">
              </el-table-column>
              <el-table-column prop="socialPhone" header-align="center" align="center" show-overflow-tooltip
                label="关系人联系电话">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserSocialRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserSocialRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserSocialRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="附件信息">
            <el-button size="small" @click="addUserAttachmentRow()" type="primary">新增附件</el-button>
            <el-table class="table" size="small" :data="inputForm.userAttachment.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column prop="attType" header-align="center" align="center" show-overflow-tooltip label="附件类型">
                <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("RSGL_attType", scope.row.attType, '-') }}
                </template>
              </el-table-column>
              <el-table-column prop="attName" header-align="center" align="center" show-overflow-tooltip label="附件文件名">
              </el-table-column>
              <el-table-column prop="attUrl" header-align="center" align="center" show-overflow-tooltip label="URL">
              </el-table-column>
              <el-table-column prop="remark" header-align="center" align="center" show-overflow-tooltip label="备注">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserAttachmentRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserAttachmentRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserAttachmentRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="奖惩记录">
          </el-collapse-item>
          <el-collapse-item title="备注信息">
            <el-button size="small" @click="addUserRemarkRow()" type="primary">新增备注</el-button>
            <el-table class="table" size="small" :data="inputForm.userRemark.filter(function(item){ return item.delFlag !== '1'})" style="width: 100%">
              <el-table-column prop="remarkType" header-align="center" align="center" show-overflow-tooltip label="类型">
              </el-table-column>
              <el-table-column prop="remarkDetail" header-align="center" align="center" show-overflow-tooltip
                label="备注信息">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="viewUserRemarkRow(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="editUserRemarkRow(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteUserRemarkRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
    <user-contact ref="userContactForm" @addRow="saveUserContactRow(arguments)"></user-contact>
    <user-tech ref="userTechForm" @addRow="saveUserTechRow(arguments)"></user-tech>
    <user-edu ref="userEduForm" @addRow="saveUserEduRow(arguments)"></user-edu>
    <user-resume ref="userResumeForm" @addRow="saveUserResumeRow(arguments)"></user-resume>
    <user-social ref="userSocialForm" @addRow="saveUserSocialRow(arguments)"></user-social>
    <user-attachment ref="userAttachmentForm" @addRow="saveUserAttachmentRow(arguments)"></user-attachment>
    <user-remark ref="userRemarkForm" @addRow="saveUserRemarkRow(arguments)"></user-remark>
  </div>
</template>

<script>
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import UserContact from './template/UserContact.vue'
  import UserTech from './template/UserTech.vue'
  import UserEdu from './template/UserEdu.vue'
  import UserResume from './template/UserResume.vue'
  import UserSocial from './template/UserSocial.vue'
  import UserAttachment from './template/UserAttachment.vue'
  import UserRemark from './template/UserRemark.vue'
  export default {
    data () {
      // 验证身份证是否符合规则
      const validatorIdNum = (rule, value, callback) => {
        if (value != null && value.length < 18) {
          return callback(new Error('身份证号长度有误!'))
        }
        if (!/\d{17}[\d|x|X]/i.test(value)) {
          return callback(new Error('身份证号内容有误!'))
        }
        return callback()
      }
      // 验证是否是正整数
      const validatorPositiveInteger = (rule, value, callback) => {
        if (isNaN(value) || Number(value) % 1 !== 0) {
          return callback(new Error('请输入整数!'))
        }
        if (parseInt(value) < 0) {
          return callback(new Error('请输入正整数!'))
        }
        return callback()
      }
      return {
        visible: false,
        loading: false,
        title: '',
        method: '',
        userInfoDataMainFormTab: '0',
        postList: [],
        inputForm: {
          userInfo: {
            id: null,
            name: null,
            sex: '0',
            ethnic: '0',
            birthDate: null,
            picUrl: null,
            idNum: '',
            nation: null,
            hometown: null,
            marriage: '0',
            jobNum: null,
            jobStatus: '0',
            entryDate: null,
            preServiceCount: null,
            phone: null,
            address: null,
            officeId: null,
            postId: null
          },
          userContact: [],
          userTech: [],
          userEdu: [],
          userResume: [],
          userSocial: [],
          userAttachment: [],
          userRemark: []
        },
        dataRule: {
          'company.id': [{
            required: true,
            message: '公司不能为空',
            trigger: 'blur'
          }],
          'office.id': [{
            required: true,
            message: '部门不能为空',
            trigger: 'blur'
          }],
          'userInfo.idNum': [{validator: validatorIdNum, trigger: 'blur'}],
          'userInfo.preServiceCount': [{validator: validatorPositiveInteger, trigger: 'blur'}]
        }
      }
    },
    components: {
      SelectTree,
      UserContact,
      UserTech,
      UserEdu,
      UserResume,
      UserSocial,
      UserAttachment,
      UserRemark
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.userInfo.id = id
        if (method === 'add') {
          this.title = '新建员工信息'
        } else if (method === 'edit') {
          this.title = '修改员工信息'
        } else if (method === 'view') {
          this.title = '查看用员工信息'
        }
        this.visible = true
        this.$nextTick(() => {
          // 重置表单状态
          this.$refs.inputForm.resetFields()
          /*
          用户角色
          this.$http({
            url: `/sys/role/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.roleList = data.page.list
          })
          */
          // 岗位信息
          this.$http({
            url: `/sys/post/list?pageNo=1&pageSize=-1&status=1`,
            method: 'get'
          }).then(({
            data
          }) => {
            this.postList = data.page.list
          })

          // 修改 或 浏览，获取员工信息（基本信息+其它信息）
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.$http({
              url: `/rsgl/personnel/queryUserInfo?userId=${this.inputForm.userInfo.id}`,
              method: 'get'
            }).then(({
              data
            }) => {
              this.inputForm = this.recover(this.inputForm, data.userInfoModel)
            })
          } else {
            this.inputForm.userContact = []
            this.inputForm.userTech = []
            this.inputForm.userEdu = []
            this.inputForm.userResume = []
            this.inputForm.userSocial = []
            this.inputForm.userAttachment = []
            this.inputForm.userRemark = []
          }
        })
      },

      handleAvatarSuccess (res, file) {
        this.inputForm.photo = res.url
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type.indexOf('image/') >= 0
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像只能是图片格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return false
        }
        return true
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          console.log(this.inputForm)
          if (valid) {
            this.loading = true
            this.$http({
              url: `/rsgl/personnel/saveUserInfo`,
              method: 'post',
              headers: {
                arrayFormat: 'repeat'
              },
              data: {
                'userInfoModels': JSON.stringify(this.inputForm)
              }
            }).then(({
              data
            }) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
            })
          }
        })
      },
      addUserContactRow (child) {
        this.$refs.userContactForm.init('add')
      },
      viewUserContactRow (child) {
        this.$refs.userContactForm.init('view', child)
      },
      editUserContactRow (child) {
        this.$refs.userContactForm.init('edit', child)
      },
      deleteUserContactRow (child) {
        this.inputForm.userContact.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userContact.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userContact.splice(index, 1, item)
          }
        })
      },
      saveUserContactRow (child) {
        if (child[0] === '') {
          this.inputForm.userContact.push(child[1])
        } else {
          this.inputForm.userContact.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userContact.splice(index, 1, child[1])
            }
          })
        }
      },
      addUserTechRow (child) {
        this.$refs.userTechForm.init('add')
      },
      viewUserTechRow (child) {
        this.$refs.userTechForm.init('view', child)
      },
      editUserTechRow (child) {
        this.$refs.userTechForm.init('edit', child)
      },
      deleteUserTechRow (child) {
        this.inputForm.userTech.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userTech.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userTech.splice(index, 1, item)
          }
        })
      },
      saveUserTechRow (child) {
        if (child[0] === '') {
          this.inputForm.userTech.push(child[1])
        } else {
          this.inputForm.userTech.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userTech.splice(index, 1, child[1])
            }
          })
        }
      },
      addUserEduRow (child) {
        this.$refs.userEduForm.init('add')
      },
      viewUserEduRow (child) {
        this.$refs.userEduForm.init('view', child)
      },
      editUserEduRow (child) {
        this.$refs.userEduForm.init('edit', child)
      },
      deleteUserEduRow (child) {
        this.inputForm.userEdu.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userEdu.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userEdu.splice(index, 1, item)
          }
        })
      },
      saveUserEduRow (child) {
        if (child[0] === '') {
          this.inputForm.userEdu.push(child[1])
        } else {
          this.inputForm.userEdu.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userEdu.splice(index, 1, child[1])
            }
          })
        }
      },
      addUserResumeRow (child) {
        this.$refs.userResumeForm.init('add')
      },
      viewUserResumeRow (child) {
        this.$refs.userResumeForm.init('view', child)
      },
      editUserResumeRow (child) {
        this.$refs.userResumeForm.init('edit', child)
      },
      deleteUserResumeRow (child) {
        this.inputForm.userResume.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userResume.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userResume.splice(index, 1, item)
          }
        })
      },
      saveUserResumeRow (child) {
        if (child[0] === '') {
          this.inputForm.userResume.push(child[1])
        } else {
          this.inputForm.userResume.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userResume.splice(index, 1, child[1])
            }
          })
        }
      },
      addUserSocialRow (child) {
        this.$refs.userSocialForm.init('add')
      },
      viewUserSocialRow (child) {
        this.$refs.userSocialForm.init('view', child)
      },
      editUserSocialRow (child) {
        this.$refs.userSocialForm.init('edit', child)
      },
      deleteUserSocialRow (child) {
        this.inputForm.userSocial.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userSocial.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userSocial.splice(index, 1, item)
          }
        })
      },
      saveUserSocialRow (child) {
        if (child[0] === '') {
          this.inputForm.userSocial.push(child[1])
        } else {
          this.inputForm.userSocial.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userSocial.splice(index, 1, child[1])
            }
          })
        }
      },
      addUserAttachmentRow (child) {
        this.$refs.userAttachmentForm.init('add')
      },
      viewUserAttachmentRow (child) {
        this.$refs.userAttachmentForm.init('view', child)
      },
      editUserAttachmentRow (child) {
        this.$refs.userAttachmentForm.init('edit', child)
      },
      deleteUserAttachmentRow (child) {
        this.inputForm.userAttachment.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userAttachment.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userAttachment.splice(index, 1, item)
          }
        })
      },
      saveUserAttachmentRow (child) {
        if (child[0] === '') {
          this.inputForm.userAttachment.push(child[1])
        } else {
          this.inputForm.userAttachment.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userAttachment.splice(index, 1, child[1])
            }
          })
        }
      },
      addUserRemarkRow (child) {
        this.$refs.userRemarkForm.init('add')
      },
      viewUserRemarkRow (child) {
        this.$refs.userRemarkForm.init('view', child)
      },
      editUserRemarkRow (child) {
        this.$refs.userRemarkForm.init('edit', child)
      },
      deleteUserRemarkRow (child) {
        this.inputForm.userRemark.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.userRemark.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.userRemark.splice(index, 1, item)
          }
        })
      },
      saveUserRemarkRow (child) {
        if (child[0] === '') {
          this.inputForm.userRemark.push(child[1])
        } else {
          this.inputForm.userRemark.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.userRemark.splice(index, 1, child[1])
            }
          })
        }
      }
    }
  }
</script>
<style scoped>
  .avatar {
    height: 100px;
  }
</style>
