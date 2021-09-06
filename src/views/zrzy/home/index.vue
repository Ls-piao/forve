<template>
  <div class="bj">
    <div class="list">
      <div style="background: #8EC21F;" @click="handClick('tdly')">土地利用</div>
      <div style="background: #1FADFF;" @click="handClick('kcjc')">矿场监测</div>
      <div style="background: #3BB86E;" @click="handClick('zxzbjc')">珍惜植被监测</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      handClick (name) {
        this.$router.push({name: name})
      }
    }
  }
</script>

<style scoped>
.bj {
  height: 100%;
  background: url(../../../assets/images/bg.jpg) no-repeat center center/100% 100%;
  padding-top: 40vh
}
.list {
  display: flex;
  margin: 0 auto;
  text-align: center;
  width: 450px;
}
.list > div {
  width: 140px;
  height: 60px;
  margin-right: 10px;
  line-height: 60px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
</style>