<template>
  <div>
    <div class="title" ref="title">微信管理</div>
    <div class="wordFont">您好，<span v-text="name" class="nameFont"></span>。目前您正在使用网页版微信，请点击下方按钮登录。(请耐心等待几秒)</div>
    <div class="buttonDiv">
      <Button type="success" size="large" @click="loginWx">扫码登录</Button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "wechatScan",
      data(){
        return{
          name:''
        }
      },
      mounted(){
        this.name = window.localStorage.getItem("UserData_name");
        this.$Loading.finish();
      },
      methods:{
        loginWx(){
          let vm = this;
          vm.$Loading.start();
          vm.$http.get('http://icampaign.com.cn:9080/api/wx_login/', {
            params: {}
          })
            .then(function(response) {
              if(response.data.code == 200){
                let QRId = response.data.data.bot_id;
                let QRImg = response.data.data.login_qr;
                window.localStorage.setItem("QR_id",QRId);
                window.localStorage.setItem("QR_img",QRImg);
                vm.$Loading.finish();
                vm.$router.push({name:'QRcode'});
              }
            })
            .catch(function(error) {
              vm.$Loading.error();
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>
  .title {
    font-size: 1.25rem;
    color: #adb3a8;
    margin-bottom: 10px;
  }

  .buttonDiv{
    display: flex;
    justify-content: center;
    margin-top: 20vh
  }

  .wordFont{
    font-weight: 600;
    font-size: 14px;
  }
  .nameFont{
    color:#58b50c;
  }
</style>
