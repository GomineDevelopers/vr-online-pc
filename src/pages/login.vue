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
            <Input prefix="md-person" class="login_input"/>
            <div class="password">密码</div>
            <Input prefix="md-lock" class="login_input"/>
            <Row class="login_row">
              <Col span="12"><div class="login_rem"><Checkbox v-model="remUserName">记住用户名</Checkbox></div></Col>
              <Col span="12"><div class="login_for">忘记密码？</div></Col>
            </Row>
            <Button shape="circle" type="success" long class="login_btn">登录</Button>
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
            remUserName:''
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
