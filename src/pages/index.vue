<template>
  <div class="layout" :style="{height:fullHeight+'px'}">
    <Layout>
      <Header>
        <div ref="header">
          <Menu mode="horizontal" theme="light" active-name="1">
            <div class="layout-logo">
              <img src="../../static/images/indexLogo.png"/>
            </div>
            <div class="layout-nav">
              <MenuItem name="1" class="menuA">
                <Dropdown>
                  <a href="javascript:void(0)">
                    <Avatar src="../../static/images/1.png"/>
                    <span v-text="username"></span>
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem>个人中心</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </MenuItem>
              <MenuItem name="2">
                <div @click="loginOut">
                  <Icon type="ios-log-out" size="16"/>
                  退出
                </div>
              </MenuItem>
            </div>
          </Menu>
        </div>
      </Header>
      <Layout :style="{height:mainHeight+'px'}">
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="doctor" theme="light" width="auto" :open-names="['1']">
            <MenuItem name="doctor">
              <div @click="changeRouter('Doctor')" class="menuDiv">
                <Icon custom="icon iconfont icon-yisheng"></Icon>
                <span>医生管理</span>
              </div>
            </MenuItem>
            <MenuItem name="miniclass">
              <div @click="changeRouter('MiniClass')" class="menuDiv">
                <Icon custom="icon iconfont icon-kecheng"></Icon>
                <span>微课管理</span>
              </div>
            </MenuItem>
            <!--<Submenu name="1">
              <template slot="title">
                <Icon custom="icon iconfont icon-yisheng"></Icon>
                医生管理
              </template>
              <MenuItem name="1-1">
                <div @click="changeRouter('demo02')">医生N</div>
              </MenuItem>
              <MenuItem name="1-2">
                <div @click="changeRouter('demo03')">单个医生</div>
              </MenuItem>
            </Submenu>-->
            <MenuItem name="problemlist">
              <div @click="changeRouter('ProblemList')" class="menuDiv">
                <Icon custom="icon iconfont icon-bangzhu"></Icon>
                <span>疑难求助</span>
              </div>
            </MenuItem>
            <MenuItem name="tag">
              <div @click="changeRouter('Tag')" class="menuDiv">
                <Icon custom="icon iconfont icon-common-xiangmubiaoqian-copy"></Icon>
                <span>标签管理</span>
              </div>
            </MenuItem>
            <MenuItem name="databaselist">
              <div @click="changeRouter('DataBaseList')"  class="menuDiv">
                <Icon custom="icon iconfont icon-ziliao"></Icon>
                <span>资料库</span>
              </div>
            </MenuItem>
            <MenuItem name="wechatscan">
              <div @click="changeRouter('WeChatScan')" class="menuDiv">
                <Icon custom="icon iconfont icon-weixin"></Icon>
                <span>微信管理</span>
              </div>
            </MenuItem>
            <MenuItem name="wordslibrary">
              <div @click="changeRouter('WordsLibrary')" class="menuDiv">
                <Icon custom="icon iconfont icon-shu"></Icon>
                <span>话术资料库</span>
              </div>
            </MenuItem>
            <MenuItem name="interaction">
              <div @click="changeRouter('Interaction')" class="menuDiv">
                <Icon custom="icon iconfont icon-hudong1"></Icon>
                <span>互动记录</span>
              </div>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout>
          <Content class="contentBg">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        fullHeight: document.documentElement.clientHeight,
        mainHeight: '',
        username: ''
      }
    },
    mounted() {
      this.getMainHeight();
      this.getUserName();
    },
    methods: {
      getMainHeight() {
        let headerHeight = this.$refs.header.offsetHeight;
        this.mainHeight = this.fullHeight - headerHeight - 6;
      },
      changeRouter(routerName) {
        this.$router.push({name: routerName});
      },
      loginOut() {
        this.$router.replace({name: "Login"});
      },
      getUserName() {
        this.username = window.localStorage.getItem("userName");
      }
    }
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-logo {
    float: left;
    position: relative;
    left: 20px;
  }

  .layout-logo img {
    height: 54px;
    padding: 5px 25px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 0px;
  }

  .contentBg {
    padding: 24px;
    background-color: #f5fbfa;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }
</style>
