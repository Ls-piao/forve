<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="类别" prop="articles.id"
                          :rules="[
                 ]">
              <SelectTree
                ref="articles"
                :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"

                url="/ypwh/articles/treeData"
                :value="inputForm.articles.id"
                :clearable="true"
                :accordion="true"
                :disabled="true"
                @getValue="(value) => {inputForm.articles.id=value}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="code"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.code" placeholder="请填写编号" disabled ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写名称" disabled ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位" prop="unit"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.unit" placeholder="请填写计量单位" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="quanttity"
                          :rules="[
                  {validator: validator.isIntGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.quanttity" placeholder="请填写数量" disabled ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件" prop="enclosure"
                          :rules="[
                 ]">
              <el-image
                style="height: 50px;width:50px;margin-right:10px;"
                :src="src" v-for="(src, index) in inputForm.enclosure.split('|')" :key="index"
                :preview-src-list="inputForm.enclosure.split('|')">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-form-item>
          </el-col>
          <el-col>
            <el-divider content-position="center">用品领用</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用数量" prop="num"
                          :rules="[
                            {required: true, message:'领用数量不能为空', trigger:'blur'}
                          ]">
              <el-input-number v-model="inputForm.num" controls-position="right" :min="1" :max="num"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人" prop="jbr"
                          :rules="[
                            {required: true, message:'经办人不能为空', trigger:'blur'}
                          ]">
              <user-select :limit='1' size="small" placeholder="请选择经办人" :value="inputForm.jbr"
                           @getValue='(value) => {inputForm.jbr=value}'></user-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import UserSelect from '@/components/userSelect'
export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      inputForm: {
        id: '',
        articles: {
          id: ''
        },
        code: '',
        name: '',
        company: '',
        quanttity: '',
        type: '',
        enclosure: '',
        remarks: '',
        num: '',  // 领用数量
        jbr: ''   // 经办人
      },
      num: 0,     // 最大领取数量
      parentId: ''  // 申请表单ID
    }
  },
  components: {
    SelectTree,
    UserSelect
  },
  methods: {
    init (method, id, num, parentId) {
      this.num = num
      this.parentId = parentId
      this.method = method
      this.inputForm.id = id
      if (method === 'edit') {
        this.title = '领用用品'
      }
      this.loading = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.loading = true
        this.$http({
          url: `/ypwh/artilcesSub/queryById?id=${this.inputForm.id}`,
          method: 'get'
        }).then(({data}) => {
          this.inputForm = this.recover(this.inputForm, data.artilcesSub)
          this.loading = false
        })
      })
    },
    // 表单提交
    doSubmit () {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          if (parseInt(this.inputForm.num) > parseInt(this.inputForm.quanttity)) {
            this.$message.error('库存不足, 请补充库存')
            return false
          }
          this.loading = true
          this.$http({
            url: `/ypgl/yply/articlesCollection/saveLY`,
            method: 'post',
            data: {
              articles: this.inputForm.id,
              num: this.inputForm.num,
              jbr: this.inputForm.jbr,
              parentId: this.parentId
            }
          }).then(({data}) => {
            this.loading = false
            if (data && data.success) {
              console.log(data)
              this.visible = false
              this.$message.success(data.msg)
              this.$emit('refreshDataList')
            }
          })
        }
      })
    }
  }
}
</script>


