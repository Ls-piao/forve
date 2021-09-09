<template>
	<el-dialog
        v-dialogDrag
        :visible.sync="visible"
        :close-on-click-modal="false"
        @closed="cancelForm"
        title="视频播放"
    >
       <div class="videoBox">
           <div class="content">
               <video src="../images/demo.mp4" controls></video>
           </div>
       </div>
    </el-dialog>
</template>

<script>
export default {
	data() {
       return{
           visible:false,
           data:''
       }
    },
    computed: {
       
    },
	mounted() {
        
    },
	methods: {
        init(v){
            this.data = v
            this.visible = true
        },
        cancelForm(){
            this.visible = false  
        }
	},
}
</script>

<style lang="scss" scoped>
.videoBox{
    .content{
        video{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
