<template>
  <div class="QRdiv-wrapper">
    <div class="QRdiv">
      <img :src="QRcode">
      <div class="img-footer">
      <div class="first-row">使用手机微信扫码登录</div>
      <div class="second-row">网页版微信需要配合手机使用</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "QRcode",
      data(){
        return {
          QRcode:'',
          isloading:false,
          timer:''
        }
      },
      beforeCreate(){
        window.intervalObj="";
      },
      mounted(){
        let vm = this;
        let img = window.localStorage.getItem("QR_img");
        vm.QRcode = 'http://icampaign.com.cn:9080'+ img;
        this.watchStatus();
      },
      beforeDestroy() {
        if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
          clearInterval(this.timer); //关闭
        }
      },
      methods:{
        watchStatus(){
           this.timer = setInterval(this.getStatus, 5000);
        },
        getStatus(){
          let vm = this;
          vm.$Loading.start();
          if(!vm.isloading){
            vm.isloading=true;
          this.$http.get(vm.$commonTools.g_restUrl + 'admin/wxbot/scanState',{
            params: {
              bot_id:window.localStorage.getItem("QR_id")
            }
          })
            .then(function(response) {
              /*if(response.data.code == 200){
                vm.$Notice.success({
                  title: '扫码登录成功!'
                });
                vm.isloading=true;
              }else if(response.data.code == 201){
                // vm.$Notice.info({
                //   title: '正在登录，请稍等!'
                // });
                vm.isloading=false;
              }else if(response.data.code == 408){
                // vm.$Notice.info({
                //   title: '等待扫码!'
                // });
                vm.isloading=false;
              }*/
              if(response.data.code != ""){
                if(response.data.code == 200){
                  vm.$Notice.success({
                    title: '扫码登录成功!'
                  });
                  vm.isloading=true;
                  clearInterval(vm.timer);
                  vm.$Loading.finish();
                  vm.$router.replace({name:'FriendsList'});
                }else{
                  vm.$Loading.finish();
                  vm.isloading=false;
                }
              }

            })
            .catch(function(error) {
              vm.isloading=false;
              vm.$Loading.error();
              console.log(error);
            })
        }
        }

      }
    }
</script>

<style scoped>
  .QRdiv-wrapper{
    margin: 0 auto;
  }
  .QRdiv{
    width: fit-content;
    text-align: center;
    margin:8% auto;
    padding: 2% 2% 5% 2%;
    background-color: white;
  }
  .img-footer .first-row{
    font-size: 18px;
    color: #333333;
    margin: 1vh 0;
  }
  .img-footer .second-row{
    color: #9ea7b4;
    font-size: 14px;
  }
</style>
