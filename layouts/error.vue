<script>
  export default {
    props: ['error'],
    layout: 'error',
    data() {
        return {
            seconds: 5,
            timer: null
        };
    },
    mounted() {
        this.timer = setInterval(this.Counting, 1000);
    },
    methods: {
        Counting() {
          this.seconds -= 1;
          if (this.seconds == 0) {
              clearInterval(this.timer);
              this.$router.push("/");
          }
        }
    }
  }
</script>

<template>
  <div>
    <h1>錯誤代碼{{error.statusCode}}</h1>
    <h1>倒數{{seconds}}回到首頁</h1>
    <NuxtLink to="/">點此回到首頁</NuxtLink>
  </div>
</template>