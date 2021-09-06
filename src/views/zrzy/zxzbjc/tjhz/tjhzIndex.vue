<template>
  <div>
    汇总
  </div>
</template>

<script>
export default {
  name: 'homeIndex',
  data () {
    return {
      Height: 300,
      componentIs: 'Guanli'
    }
  },
  components: {
  },
  mounted () {
    let height = window.innerHeight
    this.Height = height - 60
  }
}
</script>

<style scoped>
</style>