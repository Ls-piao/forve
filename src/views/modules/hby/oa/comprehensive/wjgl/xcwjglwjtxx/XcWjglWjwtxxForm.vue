<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    v-dialogDrag
    append-to-body
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="问题序号" prop="wtxh"
                :rules="[
                    {required: true, message:'问题序号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.wtxh" placeholder="请填写问题序号"     ></el-input>
           </el-form-item>
        </el-col>
        <!--<el-col :span="12">
            <el-form-item label="问题类型" prop="wtlx"
                :rules="[
                 ]">
                <el-select v-model="inputForm.wtlx" placeholder="请选择"  style="width: 100%;" disabled>
                          <el-option
                            v-for="item in $dictUtils.getDictList('WTLX')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="问题标题" prop="wtbt"
                :rules="[
                  {required: true, message:'问题标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.wtbt" placeholder="请填写问题标题"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="问题总分" prop="wtzf"
                :rules="[
                  {required: true, message:'问题总分不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.wtzf" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请填写问题总分"     ></el-input>
           </el-form-item>
        </el-col>
        <!--<div v-show="inputForm.wtlx === '3' ">
       <el-col :span="24">
            <el-form-item label="问题描述" prop="wtms"
                :rules="[
                 ]">
              <el-input   type="textarea" :rows="2"v-model="inputForm.wtms" placeholder="请填写问题描述"     ></el-input>
           </el-form-item>
        </el-col>
          </div>-->
        <div v-show="inputForm.wtlx === '1' || inputForm.wtlx === '2'">
        <el-col :span="24">
            <el-form-item label="答案数量" prop="dasl"
                :rules="[
                  {required: true, message:'答案数量不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.dasl" placeholder="请选择"  style="width: 100%;" >
                <el-option
                  v-for="item in $dictUtils.getDictList('DASL')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <div v-show="inputForm.dasl === '3'">
        <el-col :span="12">
          <el-form-item label="A" prop="daa"
                        :rules="[
                          {required: true, message:'答案描述不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.daa" placeholder="请填写答案描述"     ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分数" prop="daafs"
                        :rules="[
                           {required: true, message:'分数不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.daafs" placeholder="请填写答案分数"     ></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="B" prop="dab"
                          :rules="[
                             {required: true, message:'答案描述不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dab" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dabfs"
                          :rules="[
                             {required: true, message:'分数不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dabfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="C" prop="dac"
                          :rules="[
                             {required: true, message:'答案描述不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dac" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dacfs"
                          :rules="[
                             {required: true, message:'分数不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dacfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

        </div>
        <div v-show="inputForm.dasl === '4'">
          <el-col :span="12">
            <el-form-item label="A" prop="daa"
                          :rules="[
                            {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.daa" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="daafs"
                          :rules="[
                             {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.daafs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="B" prop="dab"
                          :rules="[
                             {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dab" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dabfs"
                          :rules="[

                 ]">
              <el-input v-model="inputForm.dabfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="C" prop="dac"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dac" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dacfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dacfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="D" prop="dad"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dad" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dadfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dadfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
        </div>
        <div v-show="inputForm.dasl === '5'">
          <el-col :span="12">
            <el-form-item label="A" prop="daa"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daa" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="daafs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daafs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="B" prop="dab"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dab" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dabfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dabfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="C" prop="dac"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dac" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dacfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dacfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="D" prop="dad"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dad" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dadfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dadfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="E" prop="dae"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dae" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="daefs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daefs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

        </div>
        <div v-show="inputForm.dasl === '6'">
          <el-col :span="12">
            <el-form-item label="A" prop="daa"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daa" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="daafs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daafs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="B" prop="dab"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dab" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dabfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dabfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="C" prop="dac"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dac" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dacfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dacfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="D" prop="dad"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dad" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="dadfs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dadfs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="E" prop="dae"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dae" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="daefs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daefs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="F" prop="daf"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daf" placeholder="请填写答案描述"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="daffs"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.daffs" placeholder="请填写答案分数"     ></el-input>
            </el-form-item>
          </el-col>

        </div>
        </div>
        </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          wjid: '',
          wtxh: '',
          wtlx: '',
          wtbt: '',
          wtzf: '',
          wtms: '',
          dasl: '',
          daa: '',
          daafs: 0,
          dab: '',
          dabfs: 0,
          dac: '',
          dacfs: 0,
          dad: '',
          dadfs: 0,
          dae: '',
          daefs: 0,
          daf: '',
          daffs: 0
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.method = method
        this.inputForm.id = obj.id
        this.inputForm.wjid = obj.wjidId
        this.inputForm.wtlx = obj.wtlx
        this.visible = true
        if (method === 'add') {
          this.title = `新建问卷问题`
        } else if (method === 'edit') {
          this.title = '修改问卷问题'
        } else if (method === 'view') {
          this.title = '查看问卷问题'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xcwjglwjtxx/xcWjglWjwtxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xcWjglWjwtxx)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/xcwjglwjtxx/xcWjglWjwtxx/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
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
