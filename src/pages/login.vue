<template>
  <div class="login_bg">
    <div class="login_card">
      <Row>
        <Col span="12">
          <div class="login_logoBg">
            <img src="../../static/images/loginLogo2.png">
          </div>
        </Col>
        <Col span="12">
          <div class="login_field">
            <div class="title">登录</div>
            <div class="userName">用户名</div>
            <Input prefix="md-person" class="login_input" v-model.trim="userName"/>
            <div class="password">密码</div>
            <Input prefix="md-lock" class="login_input" v-model.trim="password" type="password" @keyup.enter.native="login"/>
            <Row class="login_row">
              <Col span="12"><div class="login_rem"><Checkbox v-model="remUserName" @on-change="changeStatus">记住用户名</Checkbox></div></Col>
              <Col span="12"><div class="login_for" @click="forget">忘记密码？</div></Col>
            </Row>
            <Button shape="circle" type="success" long class="login_btn" @click="login">登录</Button>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
    export default {
      name: "login",
      data(){
          return{
            userName:'',
            password:'',
            remUserName:false
          }
      },
      mounted(){
        this.getCookie();
      },
      methods:{
        login(){
          let vm = this;
          if(vm.remUserName){
            vm.setCookie(vm.userName);
          }
          let postData = {};
          postData.username = vm.userName;
          postData.password  = vm.password;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/login/login',
            params:{},
            data:vm.$qs.stringify(postData)
          })
            .then(function (response) {
              if(response.data.code == 200){
                window.sessionStorage.setItem("token",response.data.data.token);
                window.sessionStorage.setItem("userName",response.data.data.username);
                vm.getMeunData();
              }else{
                vm.$Notice.warning({
                  title: '提示',
                  desc: response.data.info
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        forget(){
          this.$Notice.warning({
            title: '请联系系统管理员！'
          });
        },
        getMeunData(){
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl + 'admin/user/rule', {
            params: {}
          })
            .then(function (response) {
              if (response.data.code == 200) {
                window.sessionStorage.setItem("limits",JSON.stringify(response.data.list));
                vm.$router.push({name:response.data.list[0].url});
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        changeStatus(status){
          let vm = this;
          vm.remUserName = status;
        },
        setCookie(c_name){
          window.sessionStorage.setItem("userName",c_name);
        },
        getCookie(){
          let vm = this;
          if(window.sessionStorage.getItem("userName") != null && window.sessionStorage.getItem("userName") != ""){
            vm.remUserName = true;
            vm.userName = window.sessionStorage.getItem("userName");
          }
        }
      }

    }
</script>

<style scoped>
  .login_bg{
    background-image: url("../../static/images/loginBg.png");
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: auto;
  }

  .login_card{
    background-color: #fff;
    height: 430px;
    width: 700px;
    position: fixed;
    left: 50%;
    top:50%;
    margin: -260px 0 0 -350px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .login_card .login_logoBg{
    background-image: url("../../static/images/loginLogo1.png");
    background-size: 100% 100%;
    width: 100%;
    height:430px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login_field{
    margin: 54px 54px;
    text-align: center;
  }

  .login_field .title{
    color:#3fab23;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 15px ;
  }

  .login_field .userName,.login_field .password{
    font-size: 0.875rem;
    text-align: left;
    margin: 5px 0;
  }

  .login_field .login_input{
    margin-bottom: 10px;
  }

  .login_row{
    margin: 15px 0 30px 0;
  }

  .login_rem{
    text-align: left;
    color:#999999;
  }

  .login_for{
    text-align: right;
    color:#999999;
  }

  .login_btn{
    box-shadow: 0px 0px 10px #65b901;
  }
</style>
