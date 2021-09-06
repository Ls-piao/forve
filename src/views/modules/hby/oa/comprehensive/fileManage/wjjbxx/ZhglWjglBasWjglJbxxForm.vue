<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="标题" prop="title"
                :rules="[{required: true, message:'标题不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.title" placeholder="请填写标题"     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="文件类型" prop="fileType"
                :rules="[{required: true, message:'文件类型不能为空', trigger:'blur'}]">
                <el-select v-model="inputForm.fileType" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('file_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col> -->
        <el-col :span="12">
            <el-form-item label="文件类别" prop="lb.id"
                :rules="[{required: true, message:'文件类别不能为空', trigger:'blur'}]">
          <SelectTree
                      ref="lb"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"
                      url="/wjgl/wjgl/wjlb/treeData"
                      :value="inputForm.lb.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.lb.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="文件秘密级别" prop="lev"
                :rules="[{required: true, message:'文件秘密级别不能为空', trigger:'blur'},{validator: isOneToNinetyNine, trigger: 'blur'}]">
              <el-input type="number"  v-model="inputForm.lev" placeholder="请填写文件秘密级别"  ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="关键词" prop="keyWord"
                :rules="[{required: true, message:'关键词不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.keyWord" placeholder="请填写关键词"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="摘要" prop="summary"
                :rules="[]">
              <el-input type="textarea" v-model="inputForm.summary" placeholder="请填写摘要"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="fileUrl"
                          :rules="[{required: true, message:'附件不能为空', trigger:'blur'}]">
              <el-upload ref="fileUrl"
                         v-if="visible"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
                         :headers="{token: $cookie.get('token')}"
                         :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                         :on-success="(response, file, fileList) => {
                            inputForm.fileUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                            inputForm.fileName = fileList.map(item => item.name).join('|')
                          }"
                         :on-remove="(file, fileList) => {
                          $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                            $message.success(data.msg)
                          })
                          inputForm.fileUrl = fileList.map(item => item.url).join('|')
                          inputForm.fileName = fileList.map(item => item.name).join('|')
                    }"
                         :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                         multiple
                         :file-list="fileUrlArra">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">添加相关附件</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
</div>
</template>

<script>
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        visible: true,
        title: '',
        method: '',
        loading: false,
        fileUrlArra: [],
        inputForm: {
          id: '',
          title: '',
          fileType: '',
          lb: {
            id: ''
          },
          lev: '',
          keyWord: '',
          summary: '',
          fileUrl: '',
          fileName: ''
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
      SelectTree
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      init (id) {
        if (id) {
          this.fileUrlArra = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/filemanage/wjjbxx/zhglWjglBasWjglJbxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.zhglWjglBasWjglJbxx)
              var url = this.inputForm.fileUrl.split('|')
              var name = this.inputForm.fileName.split('|')
              if (url[0] !== '') {
                for (var i = 0; i < url.length; i++) {
                  this.fileUrlArra.push({
                    name: name[i],
                    url: url[i]
                  })
                }
              }
              this.loading = false
            })
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/filemanage/wjjbxx/zhglWjglBasWjglJbxx/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      },
      isOneToNinetyNine (rule, value, callback) {
        if (!value) {
          return callback(new Error('输入不可以为空'))
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error('请输入正整数'))
          } else {
            const re = /^[1-9][0-9]{0,1}$/
            const rsCheck = re.test(value)
            if (!rsCheck) {
              callback(new Error('请输入正整数，值为【1,99】'))
            } else {
              callback()
            }
          }
        }, 0)
      }
    }
  }
</script>
