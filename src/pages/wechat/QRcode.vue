<template>
  <div>
    <div class="QRdiv">
      <img :src="QRcode">
    </div>
  </div>
</template>

<script>
    export default {
      name: "QRcode",
      data(){
        return {
          QRcode:''
        }
      },
      mounted(){
        let vm = this;
        let img = window.localStorage.getItem("QR_img");
        vm.QRcode = 'http://icampaign.com.cn:9080'+ img;
      }
    }
</script>

<style scoped>
  .QRdiv{
    text-align: center;
    margin-top: 10%;
  }
</style>
