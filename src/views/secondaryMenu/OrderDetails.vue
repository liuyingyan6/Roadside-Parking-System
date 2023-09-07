<template>


  <div>
    1111111111111
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseId: '',//课程id
    };
  },
  methods: {

  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      // 获取路由参数
      this.courseId = this.$route.params.id
      console.log('chapter.vue-->this.courseId:', this.courseId)
    }
  },

}
</script>

<style scoped>


</style>