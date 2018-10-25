<template>
    <div>
      <div class="title" v-text="title"></div>
    </div>
</template>

<script>
    export default {
      name: "pageTitle",
      data(){
          return{}
      },
      props: {
        title: String
      }

    }
</script>

<style scoped>
  .title{
    font-size: 1.25rem;
    color: #adb3a8;
    margin-bottom: 10px;
  }
</style>
