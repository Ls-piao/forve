<template>
	<el-dialog
        v-dialogDrag
        :visible.sync="visible"
        :close-on-click-modal="false"
        @closed="cancelForm"
        title="预览"
    >
       <div class="videoBox">
           <div class="content">
               <img :src="data[prop]" />
           </div>
       </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      data: '',
      prop: ''
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    init (v, prop) {
      this.data = v
      this.prop = prop
      this.visible = true
    },
    cancelForm () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.videoBox{
    .content{
        img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
</style>
