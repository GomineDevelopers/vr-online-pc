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
          <Menu :active-name="activeMenu" theme="light" width="auto" @on-select="changeRouter" v-if="activeMenu">
            <MenuItem :name="item.url" v-if="item.url && item.checked" v-for="item in menuList" :key="item.id">
              <div class="menuDiv">
                <Icon :custom=" 'icon iconfont '+ item.icon"></Icon>
                <span>{{item.title}}</span>
              </div>
            </MenuItem>
            <MenuItem name="WeChatScan">
              <div class="menuDiv">
                <Icon custom="icon iconfont icon-weixin"></Icon>
                <span>微信管理</span>
              </div>
            </MenuItem>
            <Submenu name="1" v-if="!item.url && item.checked" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <Icon :custom=" 'icon iconfont '+ item.icon"></Icon>
                {{item.title}}
              </template>
              <MenuItem :name="itemSub.url" v-for="itemSub in item.children" :key="itemSub.id" v-if="itemSub.checked">
                <div class="menuDiv" @click="changeRouter(itemSub.url)">{{itemSub.title}}</div>
              </MenuItem>
            </Submenu>
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
        username: '',
        menuList:[],
        activeMenu:''
      }
    },
    mounted() {
      this.getMeunData();
      this.getMainHeight();
      this.getUserName();
    },
    methods: {
      getMeunData(){
        let vm = this;
        vm.menuList = JSON.parse(window.sessionStorage.getItem("limits"));
        vm.activeMenu = vm.menuList[0].url;//默认选中第一个菜单
      },
      getMainHeight() {
        let headerHeight = this.$refs.header.offsetHeight;
        this.mainHeight = this.fullHeight - headerHeight - 6;
      },
      changeRouter(routerName) {
        this.$router.push({name: routerName});
      },
      loginOut() {
        let vm = this;
        vm.$http.get(vm.$commonTools.g_restUrl + 'admin/login/login_out', {
          params: {}
        })
          .then(function (response) {
            if (response.data.code == 200) {
              window.sessionStorage.removeItem("token");
              window.sessionStorage.removeItem("UserData_name");
              vm.$router.replace({name: "Login"});
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getUserName() {
        this.username = window.sessionStorage.getItem("userName");
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
