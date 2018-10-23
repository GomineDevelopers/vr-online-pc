<template>
  <div class="wordsLib">
    <div class="title" ref="title">话术资料库</div>
    <div class="searchCard" ref="searchCard">
      <Row>
        <Col span="2" class="searchFont">话术标题</Col>
        <Col span="6"><Input v-model="wordsTitle" clearable/></Col>
        <Col span="2" class="searchFont">创建人</Col>
        <Col span="4"><Input v-model="wordsCreater" clearable/></Col>
        <Col span="2" class="searchFont">类别1</Col>
        <Col span="4">
          <Select v-model="selectedType1">
            <Option v-for="item in type1" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="4" class="searchFont">
          <Button type="success" @click="search">搜索</Button>
          <Button type="warning" @click="clear">重置</Button>
        </Col>
      </Row>
    </div>
    <div class="tableDiv" :style="{height:tableBgH+'px'}">
      <div class="buttonDiv" ref="buttonDiv">
        <Button icon="md-add" @click="showLabelModal('add')">新增话术</Button>
      </div>
      <Table ref="table" :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
      </div>
    </div>

    <Modal v-model="libModal" :title="modalTitle" @on-ok="save(modalData)">
      <Row class="rowBottom">
        <Col span="4">话术标题</Col>
        <Col span="20"><Input v-model="modalData.speechcraft"/></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4">话术辅助信息</Col>
        <Col span="20"><Input type="textarea" :rows="4" v-model="modalData.auxiliary"/></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4">话术类别1</Col>
        <Col span="20"><Input v-model="modalData.type1"/></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4">话术类别2</Col>
        <Col span="20"><Input v-model="modalData.type2"/></Col>
      </Row>
    </Modal>

    <Modal v-model="libModalView" title="话术详情" :footer-hide="true">
      <Row class="rowBottom">
        <Col span="4" class="titleFont">话术标题</Col>
        <Col span="20"><span v-text="modalData.speechcraft"></span></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4" class="titleFont">话术辅助信息</Col>
        <Col span="20"><p v-text="modalData.auxiliary"></p></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4" class="titleFont">话术类别1</Col>
        <Col span="20"><span v-text="modalData.type1"></span></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4" class="titleFont">话术类别2</Col>
        <Col span="20"><span v-text="(modalData.type2 == ''||modalData.type2 == null) ? '无' :modalData.type2"></span></Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
    export default {
      name: "wordsLibrary",
      data(){
          return{
            wordsTitle:'',
            wordsCreater:'',
            selectedType1:[],
            type1:[],
            tableBgH:'',
            tableH:'',
            loading:true,
            libModal:false,
            libModalView:false,
            modalTitle:'新增话术',
            columns: [
              { title:"序号",type: "index", width: 60, align: "center" },
              {title: "话术标题", key: "speechcraft"},
              {title: "话术类别1", key: "type1",width:150},
              {title: "创建人", key: "username",width:100,align:"center"},
              {title: "创建时间", key: "create_time",width:140,
                render:(h,params)=>{
                  let texts = '';
                  if(params.row.create_time == null){
                    texts = '-';
                  }else{
                    texts = this.$commonTools.formatDate(params.row.create_time);
                  }
                  return h('span',{
                    props:{},
                  },texts)
                }
              },
              {title: "被引用次数", key: "frequency", align: "center",width:100},
              {title: "操作", key: "action",width: 150,align: "center",
                render: (h, params) => {
                  return h("div", [
                    h("Tooltip",{props:{trigger:"hover",content:"详情",placement:"top"}},
                      [h("Icon", {
                        props: {
                          type: "icon iconfont icon-ziliao",
                        },
                        style: {
                          marginLeft: "5px",
                          color: "#4fb115"
                        },
                        on: {
                          click: () => {
                            this.goDetail(params.row.id);
                          }
                        }
                      })
                      ]),
                    h("Tooltip",
                      {props:{trigger:"hover",content:"编辑",placement:"top"}},
                      [h("Icon", {
                        props: {
                          type: "icon iconfont icon-bianji"
                        },
                        style: {
                          marginLeft: "5px",
                          color: "#4fb115",
                          display:(params.row.is_registered == 0)?"none":"inline"
                        },
                        on: {
                          click: () => {
                            this.showLabelModal('edit',params.row.id);
                          }
                        }
                      })
                      ]),
                    h("Tooltip",{props:{trigger:"hover",content:"删除",placement:"top"}},
                      [h("Icon",{
                        props: {
                          custom: "icon iconfont icon-shanchu"
                        },
                        style: {
                          marginLeft: "5px",
                          color: "#4fb115"
                        },
                        on: {
                          click: () => {
                            this.del(params.row.id);
                          }
                        }
                      })
                      ])
                  ]);
                }
              }
            ],
            data:[],
            totalPage:0,
            curPage:1,
            modalData:{
              speechcraft:'',
              auxiliary:"",
              type1:"",
              type2:""
            }
          }
      },
      mounted(){
        this.getBgHeight();
        this.getData();
        this.getType1();
      },
      methods:{
        getBgHeight() {
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10) -(vm.$refs.searchCard.offsetHeight + 20) - 5;
          vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - (vm.$refs.pageDiv.offsetHeight + 10 * 2) -10;
        },
        getData(){
          let vm = this;
          let postData = {};
          postData.page = vm.curPage ;
          postData.speechcraft = vm.wordsTitle;
          postData.username = vm.wordsCreater;
          postData.type = vm.selectedType1;

          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/speech/speech_list',
            data:vm.$qs.stringify(postData)
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
              vm.$Loading.error();
              console.log(error);
            });
        },
        getType1(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+"admin/speech/speech_type",{
            params: {}
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.type1 = response.data.data;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changePage(curPage) {
          this.curPage = curPage;
          this.getData();
        },
        del(id){
          let vm = this;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              this.$http.get(vm.$commonTools.g_restUrl+"admin/speech/speech_del",{
                params: {
                  id : id
                }
              })
                .then(function(response) {
                  if(response.data.code == 200){
                    vm.$Notice.success({
                      title: '删除成功！'
                    });
                    vm.curPage = 1;
                    vm.getData();
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          });
        },
        showLabelModal(temp,id){
          let vm = this;
          if(temp == 'add'){
            vm.modalData = {};
            vm.modalTitle = "新增话术";
          }else if(temp == 'edit'){
            vm.modalTitle = "编辑话术";
            this.getWordDetail(id);
          }
          vm.libModal = true;
        },
        search(){
          this.curPage = 1;
          this.getData();
        },
        clear(){
          this.wordsTitle = "";
          this.wordsCreater = "";
          this.selectedType1 = [];
        },
        save(modalData){
          let vm = this;

          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/speech/speech_edit',
            data:vm.$qs.stringify(modalData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.$Notice.success({
                  title: '保存成功！'
                });
                vm.curPage = 1;
                vm.getData();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        goDetail(id){
          let vm = this;
          vm.getWordDetail(id);
          vm.libModalView = true;
        },
        getWordDetail(id){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+"admin/speech/speech_detail",{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.modalData = response.data.data;
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

  .searchCard {
    background-color: #fff;
    height: 54px;
    line-height: 54px;
  }

  .searchCard .searchFont{
    text-align: center
  }

  .buttonDiv {
    text-align: right;
    margin: 10px;
  }

  .pageDiv {
    margin: 10px;
    text-align: right;
  }

  .rowBottom{
    margin-bottom: 10px;
  }

  .titleFont{
    font-weight: 600;
  }
</style>
