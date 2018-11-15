<template>
  <div>
    <page-title ref="title" :title="titleText"></page-title>
    <div class="tableDiv" :style="{height:tableBgH+'px'}">
      <div class="buttonDiv" ref="buttonDiv">
        <Button icon="md-add" @click="addGroup('add')" v-if="btnLimit.add">添加群组</Button>
      </div>
      <Table ref="selection" :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
      </div>
    </div>

    <Modal v-model="group.groupModal" :title = modalTitle @on-ok="saveGroup">
      <Row class="modalRow" type="flex" justify="center">
        <Col span="2"><span class="necessary">*</span>组名</Col>
        <Col span="11"><Input v-model="group.name"/></Col>
      </Row>
      <Row class="modalRow" type="flex" justify="center">
        <Col span="2"><span class="necessary">*</span>描述</Col>
        <Col span="11"><Input v-model="group.intro" type="textarea" :rows="4"/></Col>
      </Row>
      <Row class="modalRow" type="flex" justify="center">
        <Col span="2"><span class="necessary">*</span>状态</Col>
        <Col span="11">
          <RadioGroup v-model="group.radioStatus">
            <Radio label="正常"></Radio>
            <Radio label="禁用"></Radio>
          </RadioGroup>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="accredition.modal" title = "授权" @on-ok="saveAccredit" width="350">
      <div class="treeDiv">
        <Tree ref='menuTree' :data="accredition.data" show-checkbox multiple></Tree>
      </div>
    </Modal>

  </div>
</template>

<script>
  import PageTitle from '../../components/pageTitle'
    export default {
      name: "role",
      data() {
        return {
          titleText: '权限管理',
          columns: [
            {title: "序号", type: "index", width: 60, align: "center"},
            {title: "组名", key: "title", width: 150},
            {title: "简介", key: "description", width: 200},
            {title: "状态", key: "status", width: 80,
              render:(h, params) =>{
                let texts = '';
                if(params.row.status == 1){
                  texts = '正常';
                }else if(params.row.status == 0){
                  texts = '禁用';
                }
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {
              title: "操作", key: "action", align: "center",
              render: (h, params) => {
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
                  }, '授权')],
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
                        this.addGroup('edit', params.row.id);
                      }
                    }
                  }, '编辑')],
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
                        this.delGroup(params.row.id);
                      }
                    }
                  }, '删除')]
                ]);
              }
            }
          ],
          data: [],
          totalPage: 0,
          curPage: 1,
          loading: false,
          tableBgH: '',
          tableH: '',
          modalTitle: '新增群组',
          recordId: '',
          group: {
            groupModal: false,
            name: '',
            intro: '',
            radioStatus: '正常'
          },
          accredition:{
            modal:false,
            data:[],
            postArr:[]
          },
          btnLimit:{
            add:false,
            del:false,
            update:false,
            authorize:false,
          }
        }
      },
      components: {
        'page-title': PageTitle
      },
      mounted() {
        this.getBgHeight();
        this.getGroupData();
        this.getLimitData();
      },
      methods: {
        getLimitData(){
          let vm = this;
          this.$commonTools.setBtnLimit(this.$route.name).forEach(function (ele) {
            if(ele.icon == 'add'){
              vm.btnLimit.add = ele.checked;
            }else if(ele.icon == 'update'){
              vm.btnLimit.update = ele.checked;
            }else if(ele.icon == 'delete'){
              vm.btnLimit.del = ele.checked;
            }else if(ele.icon == 'authorize'){
              vm.btnLimit.authorize = ele.checked;
            }
          });
        },
        getBgHeight() {
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight - 64 - 24 * 2 - (vm.$refs.title.$el.offsetHeight + 10) - 18;
          vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - (vm.$refs.pageDiv.offsetHeight + 10 * 2) - 20;
        },
        getGroupData() {
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl + 'admin/group/group_list', {
            params: {
              page: vm.curPage
            }
          })
            .then(function (response) {
              if (response.data.code == 200) {
                vm.data = response.data.list.data;
                vm.totalPage = response.data.list.total;
                vm.loading = false;
                vm.$Loading.finish();
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        changePage(curPage) {
          this.curPage = curPage;
          this.getGroupData();
        },
        delGroup(id) {
          let vm = this;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              vm.$http.get(vm.$commonTools.g_restUrl + 'admin/group/group_del', {
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
                    vm.getGroupData();
                  } else {
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
        addGroup(temp, id) {
          let vm = this;
          vm.clear();
          if (temp == 'add') {
            vm.recordId = "";
            vm.modalTitle = '新增群组';
          } else if (temp == 'edit') {
            vm.recordId = id;
            vm.modalTitle = '编辑群组';
            vm.getGroupDetail(id);
          }
          vm.group.groupModal = true;
        },
        getGroupDetail(id) {
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl + 'admin/group/group_detail', {
            params: {
              id: id
            }
          })
            .then(function (response) {
              if (response.data.code == 200) {
                vm.group.name = response.data.data.title;
                vm.group.radioStatus = response.data.data.status == '1'?'正常':'禁用';
                vm.group.intro = response.data.data.description;
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        validator() {
          let vm = this;
          let texts = "";
          if (!vm.group.name) {
            texts = '请填写组名！';
          } else if (!vm.group.intro) {
            texts = '请填写描述！';
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
        saveGroup() {
          let vm = this;
          if (vm.validator()) {
            let postData = {};
            postData.id = vm.recordId;
            postData.title = vm.group.name;
            postData.description = vm.group.intro;
            postData.status = vm.group.radioStatus == '正常'?'1':'0';
            this.$http({
              method: "post",
              url: vm.$commonTools.g_restUrl + 'admin/group/group_edit',
              data: vm.$qs.stringify(postData)
            })
              .then(function (response) {
                if (response.data.code == 200) {
                  vm.$Notice.success({
                    title: '保存成功！'
                  });
                  vm.curPage = 1;
                  vm.getGroupData();
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        },
        accredit(id){
          let vm = this;
          vm.recordId = id;
          vm.$http.get(vm.$commonTools.g_restUrl + 'admin/rule/rule_list', {
            params: {
              group_id:id
            }
          })
            .then(function (response) {
              if (response.data.code == 200) {
                vm.accredition.data = response.data.list;
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          vm.accredition.modal = true;
        },
        saveAccredit(){
          let vm = this;
          vm.accredition.postArr = [];
          vm.$refs.menuTree.getCheckedNodes().forEach(function (ele,index,arr) {
            if(ele.children == undefined){
              vm.accredition.postArr.push(ele.id);
            }
          });
          let postData = {};
          postData.group_id = vm.recordId;
          postData.rules = vm.accredition.postArr;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/group/group_auth',
            data:vm.$qs.stringify(postData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.$Notice.success({
                  title: '授权成功！'
                });
                vm.curPage = 1;
                vm.getGroupData();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        clear(){
          this.group.name = '';
          this.group.intro = '';
          this.group.radioStatus = '正常';
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

  .treeDiv{
    max-height: 400px;
    overflow-y: auto;
  }

</style>
