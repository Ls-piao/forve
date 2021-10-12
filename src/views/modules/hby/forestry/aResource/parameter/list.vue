<template>
  <div class="container">
    <div v-for="(v, k) in options.list" :key="k">
      <div v-for="(s, j) in v.tabs" :key="j" style="margin:8px 0">
        <div style="margin:8px 0">{{ s.label }}</div>
        <template v-if="j === 2">
          <div class="inline">

          <div :key="index" v-for="(item, index) in s.list" >
            <el-checkbox>{{ item.name }}</el-checkbox>
          </div>
          </div>
        </template>
        <template v-else>
          <div v-for="(item, index) in s.list" style="display:flex;justify-content:center;flex-wrap:wrap" :key="index">
            <div v-for="(it, ind) in item.columns" style="display:flex;justify-content:center;flex-wrap:wrap" :key="ind">
              <div v-for="(v1, k1) in it.list" :key="k1" class="inline">
                <el-checkbox>{{ v1.name }}</el-checkbox>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
        <el-button size="small" type="primary"
          >修改</el-button >
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      formId: 'cd86660ef6ac4145a69e98097bb81efa',
      dataBindMap: '',
      options: {}
    }
  },
  computed: {},
  watch: {},
  created () {},
  activated () {
    this.createForm()
  },
  methods: {
    createForm () {
      this.$http({
        url: `/form/make/queryById?id=${this.formId}`,
        method: 'get'
      }).then(({ data }) => {
        if (data.form.source) {
          this.options = JSON.parse(data.form.source)
          console.log(this.options)
        } else {
          this.options = {
            list: [],
            config: {
              labelWidth: 100,
              labelPosition: 'right',
              size: 'small',
              customClass: ''
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 24px;
  text-align: center;
}
.inline{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 4px;
  >div  {
  margin: 4px;

  }
}
.footer{
  position:static;
  >button  {
  margin:0 auto;

  }
  width:100%;
margin-top: 30px;
}
</style>
