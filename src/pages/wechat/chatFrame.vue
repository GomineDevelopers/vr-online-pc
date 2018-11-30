<template>
  <div>
    <div class="title" ref="title">微信登录</div>
    <div class="chat_bg" :style="{height: bgH + 'px' }">
      <div class="chat_text" ref="chatText">您好，<span class="nameFont" v-text="name"></span>。目前您正在使用网页版微信。</div>
      <div class="chat_main" :style="{height: mainH + 'px' }">
        <div class="chat_main_user" ref="user">
          <Row>
            <Col span="2"><div @click="backTo"><Icon type="md-arrow-round-back" /></div></Col>
            <Col span="22" style="text-align: center">
              <span v-text="($route.params.remarkName == ''||$route.params.remarkName == undefined)?$route.params.nickName:$route.params.remarkName"></span>
            </Col>
          </Row>
        </div>
        <Row>
          <Col span="18">
            <div class="chat_main_left" :style="{height: conH + 'px' }">
              <div id="dialog_box" class="chat_main_left_top" :style="{height: leftTopH + 'px' }">
                <div :class="['message',item.flowType == 'left' ? '':'me']" v-for="(item,index) in dialogueFlow"  :key="index">
                  <Avatar style="color: #f56a00;background-color: #fde3cf" v-if="item.flowType == 'left'">U</Avatar>
                  <div class="content">
                    <div :class="['bubble',item.flowType == 'left'?'bubble-default left':'bubble_primary right']">
                      <div class="bubble_cont">
                        <div class="plain">
                          <pre v-text="item.data"></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Avatar style="color: #f56a00;background-color: #fde3cf" v-if="item.flowType == 'right'">U</Avatar>
                </div>
              </div>

              <div class="chat_main_left_bottom">
                <div class="send_file">
                  <Icon type="ios-folder-outline" size="26"/>
                </div>
                <div class="send_con">
                  <Input v-model="sendCon" type="textarea" :rows="4" @keyup.enter.native="sendMessage"/>
                </div>
                <div class="send_btn">
                  <Button type="success" size="large" @click="sendMessage">&emsp;发送&emsp;</Button>
                </div>
              </div>
            </div>
          </Col>
          <Col span="6">
            <div class="chat_main_right" :style="{height: conH + 'px' }">
              <div class="speech_title" ref="speech_title">话术资料库</div>
              <div class="speech_con">
                <div ref="speech_input"><Input v-model="keyWord" search enter-button @on-search="search"/></div>
                <div class="speech_list_div" :style="{height: wordH + 'px' }">
                  <div class="speech_list" v-for="item in wordData" :key="item.id">
                    <Poptip confirm title="复制该话术内容" @on-ok="copyCon(item.auxiliary)">
                      *<span v-text="item.speechcraft"></span>
                    </Poptip>
                  </div>
                </div>
              </div>
              <div class="pageDiv" ref="pageDiv">
                <Page :total="total" :current="curPage" size="small" show-total simple @on-change="changePage"/>
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
            sendCon:'',
            wordH:'',
            loading:true,
            wordData:[],
            total:0,
            curPage:1,
            keyWord:'',
            startTime:'',
            dialogueFlow:[],
            dialogueFlowLeft:[],
            dialogueFlowRight:[],
            enterTime:''//进入聊天框的时间
          }
      },
      mounted(){
        this.name = window.sessionStorage.getItem("UserData_name");
        this.getBgHeight();
        this.getWordLibrary();
        this.watchStatus();
        this.enterTime = Date.parse(new Date())/1000;
        if(window.sessionStorage.getItem("dialogueFlowRight") != null){
          window.sessionStorage.removeItem("dialogueFlowRight");
        }
      },
      beforeDestroy() {
        if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
          clearInterval(this.timer); //关闭
        }
      },
      methods:{
        getBgHeight(){
          let vm = this;
          vm.bgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10) - 2 - 40;
          vm.mainH = vm.bgH -(vm.$refs.chatText.offsetHeight + 20);
          vm.conH = vm.mainH -(vm.$refs.user.offsetHeight);
          vm.leftTopH = vm.mainH -(vm.$refs.user.offsetHeight)-180;
          vm.wordH = vm.conH -(vm.$refs.speech_title.offsetHeight)-(vm.$refs.speech_input.offsetHeight)-(vm.$refs.pageDiv.offsetHeight) -20;
        },
        watchStatus(){
          this.timer = setInterval(this.getDialogueFlow, 10000);
        },
        sendMessage(){
          let vm = this;
          this.$http.get('http://icampaign.com.cn:9080/api/send_msg_by_uid/',{
            params: {
              bot_id:window.sessionStorage.getItem("QR_id"),
              word:vm.sendCon,
              uid:vm.$route.params.id
            }
          })
            .then(function(response) {
              if(response.data.code == 200 && response.data.data == true){
                vm.$Notice.success({
                  title: '信息发生成功!'
                });
                let str = {};
                str.data = vm.sendCon;
                str.flowType = 'right';
                str.timestamp = Date.parse(new Date())/1000;
                vm.dialogueFlowRight.push(str);
                window.sessionStorage.setItem("dialogueFlowRight",JSON.stringify(vm.dialogueFlowRight));
                vm.sendCon = "";//发送成功之后消息框清空
                vm.getDialogueFlow();
              }else{
                vm.$Notice.error({
                  title: '信息发生失败!'
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        getDialogueFlow(){
          let vm = this;
          this.$http.get('http://icampaign.com.cn:9080/api/get_messages/',{
            params: {
              bot_id:window.sessionStorage.getItem("QR_id"),
              time:vm.enterTime,
              username:vm.$route.params.id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                if(response.data.list.length > 0){
                  response.data.list.forEach(function (ele,index,arr) {
                    ele.flowType = 'left';
                  });
                }
                vm.dialogueFlowLeft = response.data.list;
                if(window.sessionStorage.getItem("dialogueFlowRight") != null){
                  vm.dialogueFlowRight = JSON.parse(window.sessionStorage.getItem("dialogueFlowRight"));
                  vm.dialogueFlow = vm.dialogueFlowLeft.concat(vm.dialogueFlowRight);
                  vm.dialogueFlow.sort(function(a, b){ return a.timestamp - b.timestamp; });
                }else{
                  vm.dialogueFlow = vm.dialogueFlowLeft.concat(vm.dialogueFlowRight);
                }
                vm.scrollToBottom();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        getWordLibrary(){
          let vm = this;
          let postData = {};
          postData.page = vm.curPage;
          postData.speechcraft = vm.keyWord;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+ 'admin/speech/speech_list',
            data:vm.$qs.stringify(postData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.wordData = response.data.list.data;
                vm.total = response.data.list.total;
                vm.loading = false;
                vm.$Loading.finish();
              }
            })
            .catch(function(error) {
              vm.$Loading.error();
              console.log(error);
            });
        },
        changePage(curpage){
          this.curPage = curpage;
          this.getWordLibrary();
        },
        search(){
          this.curPage = 1;
          this.getWordLibrary();
        },
        copyCon(message){
          let vm = this;
          vm.$copyText(message).then(function (e) {
            vm.$Notice.success({
              title: '复制成功，右键粘贴!'
            });
          }, function (e) {
            vm.$Notice.error({
              title: '复制失败!'
            });
          })
        },
        backTo(){
          this.$router.go(-1);
        },
        scrollToBottom(){
          let vm = this;
          vm.$nextTick(function(){
            let div = document.getElementById('dialog_box');
            div.scrollTop = div.scrollHeight;
          })
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
    padding: 20px 0 5px 20px;
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
    /*text-align: center;*/
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
    position: relative;
  }

  .chat_main_right .speech_title{
    font-size: 15px;
    padding: 10px 20px;
  }

  .chat_main_right .speech_con{
    padding: 0px 20px 10px 20px;
  }

  .chat_main_right .speech_list_div{
    padding-top: 10px;
    overflow-y: auto;
  }

  .chat_main_right .speech_list{
    padding-top: 10px;
  }

  .chat_main_left .chat_main_left_top{
    bottom: 180px;
    width: 100%;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
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
  .pageDiv{
    padding: 0 20px;
    position: absolute;
    bottom: 16px;
    right: 0;
  }
</style>
