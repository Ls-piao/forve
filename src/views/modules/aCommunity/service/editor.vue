<template>
  <div class="editor">
    <div id="e"></div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {
      content: "",
      editor: null,
      info_: null
    };
  },
  model: {
    prop: "desc",
    event: "change"
  },
  watch: {
    isClear(val) {
      // console.log(val)
      if (val) {
        this.editor.txt.clear();
        // this.info_=null
      }
    },
    desc(value) {
      //console.log("desc",value)
      if (value != this.editor.txt.html()) {
        this.editor.txt.html(this.desc);
        this.$emit("change", this.desc);
      }
    }
  },
  props: {
    desc: {
      type: String,
      default: ""
    },
    //业务中我们经常会有添加操作和编辑操作，添加操作时，我们需清除上一操作留下的缓存
    isClear: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    async initE() {
      const editor = new E("#e"); // 传入两个元素
      editor.customConfig.zIndex = 100;
      editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 1;
      editor.customConfig.showFullScreen = true;
      editor.customConfig.customUploadImg = async (files, insert) => {
        for (let i = 0; i < files.length; i++) {
          let params = {
            file: files[i]
          };
           var src=window.URL.createObjectURL(files[i]);
          // let { data } = await this.$api.art_upload(params);
          // let url = this.$filePath + data.data.filename;
          insert(src);
        }
      };
      editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      editor.create();
      editor.txt.html(this.desc);
      this.editor = editor;
    }
  },
  mounted() {
    this.initE();
  }
};
</script>

<style scoped>
</style>
