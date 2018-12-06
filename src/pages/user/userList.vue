<template>
  <div>
    <page-title ref="title" :title="titleText"></page-title>
    <div class="tableDiv" :style="{height:tableBgH+'px'}">
      <div class="buttonDiv" ref="buttonDiv">
        <Button icon="md-add" @click="addUser('add')" v-if="btnLimit.add">添加用户</Button>
      </div>
      <Table ref="selection" :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
      </div>
    </div>

    <Modal v-model="user.userModal" :title = modalTitle @on-ok="saveUser" width="300">
      <Row class="modalRow" type="flex" justify="center" v-if="!user.isEdit">
        <Col span="6"><span class="necessary">*</span>用户名</Col>
        <Col span="16"><Input v-model="user.name"/></Col>
      </Row>
      <Row class="modalRow" type="flex" justify="center" v-if="user.isEdit">
        <Col span="6"><span class="necessary">*</span>用户名</Col>
        <Col span="16"><span v-text="user.name"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" justify="center">
        <Col span="6"><span class="necessary">*</span>密码</Col>
        <Col span="16"><Input v-model="user.password"/></Col>
      </Row>
      <Row class="modalRow" type="flex" justify="center" v-if="user.isEdit">
        <Col span="6"><span class="necessary">*</span>确认密码</Col>
        <Col span="16"><Input v-model="user.password_confirm"/></Col>
      </Row>
    </Modal>

    <Modal v-model="accredition.modal" title ='用户分组' @on-ok="saveAccredit" >
        <Row>
          <Col span="24"><span class="textFont">请选择用户分组：</span></Col>
        </Row>
        <Row class="modalRow2">
          <Col span="24">
            <RadioGroup v-model="accredition.selected" v-for="item in accredit.list" :key="item.id">
              <Radio :label="item.id">{{item.title}}</Radio>
            </RadioGroup>
          </Col>
        </Row>
    </Modal>
  </div>
</template>

<script>
  import PageTitle from '../../components/pageTitle'
    export default {
      name: "userList",
      data(){
        return{
          titleText:'用户列表',
          columns:[
            {title:"序号",type:"index", width: 60, align: "center"},
            {title:"用户名",key:"username",width:150},
            {title:"密码",key:"password",width:150},
            {title:"分组",key:"group_name",width:100},
            {title:"操作",key: "action",align:"center",
              render:(h, params) =>{
                return h("div", [
                    [h("Button", {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        display:this.btnLimit.authorize?'inline':'none'
                      },
                      on: {
                        click: () => {
                          this.accredit(params.row.id);
                        }
                      }
                    },'授权')],
                    [h("Button", {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        display:this.btnLimit.update?'inline':'none'
                      },
                      on: {
                        click: () => {
                          this.addUser('edit',params.row.id);
                        }
                      }
                    },'修改密码')],
                    /*[h("Button", {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        display:this.btnLimit.assignDoc?'inline':'none'
                      },
                      on: {
                        click: () => {
                          this.allot(params.row.id);
                        }
                      }
                    },'分配医生')],*/
                    [h("Button", {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        display:this.btnLimit.del?'inline':'none'
                      },
                      on: {
                        click: () => {
                          this.delUser(params.row.id);
                        }
                      }
                    },'删除')]
                ]);
              }
            }
          ],
          data:[],
          totalPage:0,
          curPage:1,
          loading:false,
          tableBgH:'',
          tableH:'',
          modalTitle:'新增用户',
          recordId:'',
          user:{
            userModal:false,
            name:'',
            password:'xb123456',
            password_confirm:'',
            isEdit:false
          },
          accredition:{
            modal:false,
            list:[],
            selected:''
          },
          btnLimit:{
            add:false,
            del:false,
            update:false,
            authorize:false,
            assignDoc:false
          }
        }
      },
      components:{
        'page-title':PageTitle
      },
      mounted(){
        this.getBgHeight();
        this.getUserData();
        this.getLimitData();
      },
      methods:{
        getLimitData(){
          let vm = this;
          this.$commonTools.setBtnLimit(this.$route.name).forEach(function (ele) {
            if(ele.icon == 'add'){
              vm.btnLimit.add = ele.checked;
            }else if(ele.icon == 'update'){
              vm.btnLimit.update = ele.checked;
            }else if(ele.icon == 'delete'){
              vm.btnLimit.del = ele.checked;
            }else if(ele.icon == 'assignDoc'){
              vm.btnLimit.assignDoc = ele.checked;
            }else if(ele.icon == 'authorize'){
              vm.btnLimit.authorize = ele.checked;
            }
          });
        },
        getBgHeight(){
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.$el.offsetHeight + 10)-2;
          vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - (vm.$refs.pageDiv.offsetHeight + 10 * 2) - 40;
        },
        getUserData(){
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl+'admin/user/user_list', {
            params: {
              page: vm.curPage
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.data = response.data.list.data;
                vm.totalPage = response.data.list.total;
                vm.loading = false;
                vm.$Loading.finish();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changePage(curPage){
          this.curPage  = curPage;
          this.getUserData();
        },
        delUser(id){
          let vm = this;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              vm.$http.get(vm.$commonTools.g_restUrl + 'admin/user/user_del', {
                params: {
                  id: id
                }
              })
                .then(function (response) {
                  if (response.data.code == 200) {
                    vm.$Notice.success({
                      title: '删除成功！'
                    });
                    vm.curPage = 1;
                    vm.getUserData();
                  }else if(response.data.code == 403){
                    vm.$Notice.info({
                      title: '该账号不能删除！'
                    });
                  }else{
                    vm.$Notice.error({
                      title: '删除出错！'
                    });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          });
        },
        allot(){},
        accredit(id){
          let vm = this;
          vm.recordId = id;
          vm.accredition.selected = '';
          vm.$http.get(vm.$commonTools.g_restUrl+'admin/user/user_auth', {
            params: {
              user_id:id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.accredit.list = response.data.list;
                response.data.list.forEach(function (ele,index,arr) {
                  if(ele.checked == true){
                    vm.accredition.selected = ele.id;
                  }
                });
                vm.accredition.modal = true;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        saveAccredit(){
          let vm = this;
          let postData = {};
          postData.group_id = vm.accredition.selected;
          postData.user_id = vm.recordId;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/user/user_rule',
            data:vm.$qs.stringify(postData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.$Notice.success({
                  title: '保存成功！'
                });
                vm.curPage = 1;
                vm.getUserData();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        addUser(temp,id){
          let vm = this;
          if(temp == 'add'){
            vm.recordId = "";
            vm.user.isEdit = false;
            vm.user.name = '';
            vm.user.password = 'xb123456';

          }else if(temp == 'edit'){
            vm.user.isEdit = true;
            vm.user.password = '';
            vm.recordId = id;
            vm.getUserDetail(id);
            vm.modalTitle = '修改密码';
          }
          vm.user.userModal = true;
        },
        getUserDetail(id){
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl+'admin/user/user_detail', {
            params: {
              id:id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                  vm.user.name = response.data.data.username;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        validator(){
          let vm = this;
          let texts = "";
          if(!vm.user.name){
            texts = '请填写用户名！';
          }else if(!vm.user.password){
            texts = '请填写密码！';
          }else if(!vm.user.password_confirm && vm.user.isEdit){
            texts = '请填写确认密码！';
          }else if(!(vm.user.password_confirm === vm.user.password) && vm.user.isEdit){
            texts = '两次密码不一致，请重新输入！';
          }

          if (texts) {
            vm.$Message.warning({
              content: texts,
              duration: 3
            });
            return false;
          } else {
            return true;
          }
        },
        saveUser(){
          let vm = this;
          if(vm.validator()){
            let postData = {};
            postData.id = vm.recordId;
            postData.username = vm.user.name;
            postData.password = vm.user.password;
            this.$http({
              method:"post",
              url:vm.$commonTools.g_restUrl+'admin/user/user_edit',
              data:vm.$qs.stringify(postData)
            })
              .then(function(response) {
                if(response.data.code == 200){
                  vm.$Notice.success({
                    title: '保存成功！'
                  });
                  vm.curPage = 1;
                  vm.getUserData();
                }else{
                  vm.$Notice.info({
                    title: response.data.info
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }
      }
    }
</script>

<style scoped>
  .pageDiv {
    margin: 10px;
    text-align: right;
  }

  .tableDiv {
    background-color: #fff;
    padding: 2vh;
  }

  .buttonDiv {
    text-align: right;
    margin-bottom: 10px;
  }

  .modalRow2{
    margin-top: 10px;
  }

  .textFont{
    font-size: 14px;
  }
</style>
