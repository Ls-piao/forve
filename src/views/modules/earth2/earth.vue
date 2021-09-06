
<template>
  <elFrame :src="pageUrl" />
</template>
<script>
import elFrame from '@/components/el-iframe/index'
export default {
  name: 'Druid',
  components: { elFrame },
  data() {
    return {
      pageUrl: 'http://220.197.198.204:8081/earth/#/'
    }
  }
}
</script>
