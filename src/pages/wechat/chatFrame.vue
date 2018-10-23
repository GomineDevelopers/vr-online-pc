<template>
  <div>
    <div class="title" ref="title">微信登录</div>
    <div class="chat_bg" :style="{height: bgH + 'px' }">
      <div class="chat_text" ref="chatText">您好，<span class="nameFont" v-text="name"></span>。目前您正在使用网页版微信。</div>
      <div class="chat_main" :style="{height: mainH + 'px' }">
        <div class="chat_main_user" ref="user">刘菲菲（北京大学第一附属医院）</div>
        <Row>
          <Col span="18">
            <div class="chat_main_left" :style="{height: conH + 'px' }">
              <div class="chat_main_left_top" :style="{height: leftTopH + 'px' }">
                <div class="message">
                  <Avatar style="color: #f56a00;background-color: #fde3cf">U</Avatar>
                  <div class="content">
                    <div class="content">
                      <div class="bubble bubble-default left">
                        <div class="bubble_cont">
                          <div class="plain">
                            <pre>现在超也得</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="message me">
                  <div class="content">
                    <div class="content">
                      <div class="bubble bubble_primary right">
                        <div class="bubble_cont">
                          <div class="plain">
                            <pre>回复消息</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Avatar style="color: #f56a00;background-color: #fde3cf">U</Avatar>
                </div>
              </div>
              <div class="chat_main_left_bottom">
                <div class="send_file">
                  <Icon type="ios-folder-outline" size="26"/>
                </div>
                <div class="send_con">
                  <Input v-model="sendCon" type="textarea" :rows="4" />
                </div>
                <div class="send_btn">
                  <Button type="success" size="large" @click="sendMessage">&emsp;发送&emsp;</Button>
                </div>
              </div>
            </div>
          </Col>
          <Col span="6">
            <div class="chat_main_right" :style="{height: conH + 'px' }">
              <div class="speech_title">话术资料库</div>
              <div class="speech_con">
                <Input search enter-button/>
                <div class="speech_list">
                  *常见医药销售话术
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
      name: "chatFrame",
      data(){
          return{
            name:'',
            bgH:'',
            mainH:'',
            conH:'',
            leftTopH:'',
            sendCon:''
          }
      },
      mounted(){
        this.name = window.localStorage.getItem("UserData_name");
        this.getBgHeight();
      },
      methods:{
        getBgHeight(){
          let vm = this;
          vm.bgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10) - 2 - 40;
          vm.mainH = vm.bgH -(vm.$refs.chatText.offsetHeight + 20);
          vm.conH = vm.mainH -(vm.$refs.user.offsetHeight);
          vm.leftTopH = vm.mainH -(vm.$refs.user.offsetHeight)-180;
        },
        sendMessage(){
          let vm = this;
          this.$http.get('http://icampaign.com.cn:9080/api/send_msg_by_uid/',{
            params: {
              bot_id:window.localStorage.getItem("QR_id"),
              word:vm.sendCon,
              uid:vm.$route.params.id
            }
          })
            .then(function(response) {
              if(response.data.code == 200 && response.data.data == true){
                vm.$Notice.success({
                  title: '信息发生成功!'
                });
              }else{
                vm.$Notice.error({
                  title: '信息发生失败!'
                });
              }
            })
            .catch(function(error) {
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

  .chat_bg{
    background-color: #ffffff;
  }

  .chat_text{
    font-weight: 600;
    font-size: 14px;
    padding: 20px 0 0 20px;
  }

  .chat_text .nameFont{
    color:#58b50c;
  }

  .chat_main{
    position: relative;
    max-width: 1000px;
    min-width: 800px;
    margin: 0 auto;
  }

  .chat_main_user{
    background-color: #79a34f;
    color: white;
    font-size: 16px;
    text-align: center;
    padding: 10px;
  }

  .chat_main_left{
    position: relative;
    background: #fdfffc;
    border-bottom: 1px solid #e3e3e3;
    border-left: 1px solid #e3e3e3;
  }

  .chat_main_right{
    background: #f1f7ed;
    border-left: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
    border-right: 1px solid #e3e3e3;
  }

  .chat_main_right .speech_title{
    font-size: 15px;
    padding: 10px 20px;
  }

  .chat_main_right .speech_con{
    padding: 0px 20px 10px 20px;
  }

  .chat_main_right .speech_list{
    padding-top: 10px;
  }

  .chat_main_left .chat_main_left_top{
    bottom: 180px;
    width: 100%;
    padding: 10px;
  }

  .chat_main_left .chat_main_left_bottom{
    position: absolute;
    border-top:1px solid #e3e3e3;
    height: 180px;
    width: 100%;
  }

  .chat_main_left_bottom .send_file{
    padding: 5px 10px;
  }

  .chat_main_left_bottom .send_btn{
    text-align: right;
    padding: 5px 10px;
  }

  /*对话起泡start*/
  .message{
    display: flex;
    margin-bottom: 16px;
    width: 100%;
  }

  .message.me {
    display: flex;
    justify-content: flex-end;
  }

  .message .content{
    overflow: hidden;
  }

  .bubble {
    max-width: 500px;
    min-height: 1em;
    display: inline-block;
    vertical-align: top;
    position: relative;
    text-align: left;
    font-size: 14px;
    border-radius: 3px;
    margin: 0 10px;
  }

  .bubble.left::before {
    border-right-color: #ccc;
    border-right-width: 4px;
    right: 100%;
  }

  .bubble.right::after, .bubble.right::before {
    left: 100%;
  }

  .bubble.bubble_primary.right::after {
    border-left-color: #b2e281;
    border-left-width: 4px;
  }

  .bubble::before,.bubble::after {
    position: absolute;
    top: 14px;
    border: 6px solid transparent;
    content: " ";
  }

  .bubble.bubble-default{
    background-color: #cccccc;
  }

  .bubble.bubble_primary{
    background-color: #b2e281;
  }

  .bubble_cont {
    word-wrap: break-word;
    word-break: break-all;
    min-height: 25px;
  }

  .bubble_cont .plain {
    padding: 9px 13px;
  }

  pre {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-break: normal;
  }
  /*对话起泡end*/
</style>
