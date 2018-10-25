<template>
  <div>
    <div class="title" ref="title">微信登录</div>
    <div class="friends_list_bg" :style="{height: bgH + 'px' }">
      <div class="friends_list_text">您好，<span class="nameFont" v-text="name"></span>。目前您正在使用网页版微信。</div>
      <div class="friends_list_main" :style="{height: listH + 'px' }">
        <Row>
          <Col span="5" class="friends_list_left" :style="{height: listH + 'px' }">
            <div class="friends_list_avator"><img src="../../../static/images/1.png" width="110"></div>
            <div class="friends_list_wxname" v-text="userNickName"></div>
          </Col>
          <Col span="19" class="friends_list_right">
            <Tabs :animated="false" @on-click="changeTab">
              <TabPane label="我的好友" name="1">
                <div class="friends_list_lists_main" :style="{height: listRightH + 'px' }">
                  <div class="friends_list_lists" v-for="item in friends">
                    <Row>
                      <Col span="10">
                        <Avatar :src='"http://icampaign.com.cn/customers/Wxbot_r/temp/" + item.HeadImgUrl'></Avatar>
                        <span v-text="item.RemarkName"></span>
                      </Col>
                      <Col span="4" offset="10" class="friends_list_btn">
                        <Button @click="goChat(item.UserName)">发起会话</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </TabPane>
              <TabPane label="我的群组" name="2">
                <div class="friends_list_lists_main" :style="{height: listRightH + 'px' }">
                  <div class="friends_list_lists" v-for="(item,index) in groups">
                    <Row>
                      <Col span="10">
                        <Avatar style="color: #f56a00;background-color: #fde3cf;"></Avatar>
                        <span>{{item.NickName}}</span>
                      </Col>
                      <Col span="4" offset="10" class="friends_list_btn">
                        <Button @click="">发起会话</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </TabPane>
            </Tabs>

          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "friendsList",
      data(){
        return{
          name:'',
          bgH:'',
          listH:'',
          listRightH:'',
          listLeftH:'',
          friends:[],
          groups:[],
          isloading:false,
          userNickName:''
        }
      },
      mounted(){
        this.name = window.localStorage.getItem("UserData_name");
        this.getBgHeight();
        this.watchStatus();
        this.getUserData();
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
          vm.listH = vm.bgH - 80;
          vm.listRightH = vm.listH - 54;
        },
        getUserData(){
          let vm = this;
          this.$http.get('http://icampaign.com.cn:9080/api/get_my_account/',{
            params: {
              bot_id:window.localStorage.getItem("QR_id")
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.userNickName = response.data.data.my_account.NickName;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changeTab(name){
          if(name == 1){
            this.isloading = false;
            this.getMembers();
          }else if(name == 2){
            this.getGroups();
          }
        },
        watchStatus(){
          this.timer = setInterval(this.getMembers, 5000);
        },
        getMembers(){
          let vm = this;
          if(!vm.isloading){
            this.$http.get(vm.$commonTools.g_restUrl + 'admin/wxbot/get_contact_list',{
              params: {
                bot_id:window.localStorage.getItem("QR_id")
              }
            })
              .then(function(response) {
                if(response.data.code == 200){
                  vm.friends = response.data.info;
                  /*vm.friends.forEach(function (ele) {
                    ele.HeadImgUrl = 'http://icampaign.com.cn/customers/Wxbot_r/temp/'+ele.HeadImgUrl;
                  });*/
                  vm.isloading = true;
                  vm.$Loading.finish();
                }else{
                  vm.isloading = false;
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        },
        getGroups(){
          let vm = this;
          vm.$Loading.start();
          this.$http.get('http://icampaign.com.cn:9080/api/get_group_list/',{
            params: {
              bot_id:window.localStorage.getItem("QR_id")
            }
          })
            .then(function(response) {
              if(response.data.code != ""){
                if(response.data.code == 200){
                  vm.groups = response.data.data.group_list;
                  vm.$Loading.finish();
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        goChat(id){
          this.$router.push({name:'ChatFrame',params:{id:id}});
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

  .friends_list_bg{
    background-color: #ffffff;
  }

  .friends_list_text{
    font-weight: 600;
    font-size: 14px;
    padding: 20px 0 0 20px;
  }
  .friends_list_text .nameFont{
    color:#58b50c;
  }

  .friends_list_main{
    margin: 20px;
    border: 1px solid #e3e3e3;
  }

  .friends_list_left{
    border-right: 1px solid #e3e3e3;
  }
  .friends_list_left .friends_list_avator{
    text-align: center;
    margin-top: 30px;
  }
  .friends_list_left .friends_list_wxname{
    text-align: center;
    font-size: 16px;
  }

  .friends_list_right{
  }

  .friends_list_right .friends_list_lists{
    padding: 16px;
    border-bottom: 1px solid #e3e3e3;
  }

  .friends_list_right .friends_list_btn{
    text-align: center;
  }

  .friends_list_right .friends_list_lists_main{
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
