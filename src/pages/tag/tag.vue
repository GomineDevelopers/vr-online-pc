<template>
  <div>
    <Row>
      <Col span="12" class="tag_title">标签管理</Col>
      <Col span="12" class="tag_button">
        <Button type="success" icon="icon iconfont icon-tianjia" @click="addLabel('add')" v-if="btnLimit.add">新增标签</Button>
      </Col>
    </Row>
    <div class="tag_cardTitle">
      <Row>
        <Col span="3">标签列表</Col>
        <Col span="2" offset="10">操作</Col>
      </Row>
    </div>
    <div v-for="(item,index) in listData" :key="index">
      <div class="tag_first_panel">
        <Row type="flex" align="middle">
          <Col span="10" class="tag_title_fir"><span v-text="item.name"></span></Col>
          <Col span="2" offset="3">
            <Icon custom="icon iconfont icon-bianji" color="#4fb115" @click="addLabel('edit',item.id)" v-if="btnLimit.update"/>&emsp;
            <Icon custom="icon iconfont icon-shanchu" color="#4fb115" @click="del(item.id,item.pid)" v-if="btnLimit.del"/>
          </Col>
          <Col span="9" class="tag_icon">
            <Icon type="ios-arrow-down" size="26" color="#a1a99b" v-show="item.isShow" @click="changeClass(index,item)"/>
            <Icon type="ios-arrow-up" size="26" color="#a1a99b" v-show="!item.isShow" @click="changeClass(index,item)"/>
          </Col>
        </Row>
      </div>
      <div class="tag_second_panel" v-for="(citem,cindex) in item.children" :key="cindex" v-if="item.isShow">
        <Row>
          <Col span="10" class="tag_title_se">{{cindex+1}}、<span v-text="citem.name"></span></Col>
          <Col span="3" offset="1">
            <Icon custom="icon iconfont icon-shanchu" color="#4fb115" @click="del(citem.id,citem.pid)" v-if="btnLimit.del"/>
          </Col>
        </Row>
      </div>
    </div>
    <div class="tag_page">
      <Page :total="totalPage" :page-size="6" show-elevator show-total :current="curPage" @on-change="changePage"/>
    </div>

    <Modal v-model="labelModel" draggable scrollable :title="modalTitle" @on-ok="saveLabel">
      <Row class="tag_modelRow">
        <Col span="8" class="tag_inputName"><span class="necessary">*</span>一级标签：</Col>
        <Col span="16"><Input v-model.trim="firstLabelName" clearable class="tag_input"/></Col>
      </Row>
      <Row class="tag_modelRow">
        <Col span="8" class="tag_inputName">二级标签：</Col>
        <Col span="16">
          <Input v-model.trim="secondLabelName" class="tag_input" icon="md-add" @on-click="addSeLabel"/>
        </Col>
      </Row>
      <Row class="input_top" v-for="(item,index) in secondList" :key="index">
        <Col span="16" offset="8">
          <Input v-model.trim="item.name" class="tag_input" icon="md-remove" @on-click="delSeLabel(index)"/>
        </Col>
      </Row>
    </Modal>

  </div>
</template>

<script>
    export default {
      name: "tag",
      data(){
          return{
            listData:[],
            labelModel:false,
            modalTitle:'新增标签',
            firstLabelName:'',
            secondLabelName:'',
            secondList:[],
            postSecondList:[],
            curPage:1,
            totalPage:0,
            editId:'',
            btnLimit:{
              add:false,
              del:false,
              update:false
            }
          }
      },
      mounted(){
        this.getLabelList();
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
            }
          });
        },
        getLabelList(){
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl+'admin/label/label_list', {
            params: {
              page:vm.curPage
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.totalPage = response.data.list.total;
                response.data.list.data.forEach(function (value, index, array) {
                  value.isShow = false;
                });
                vm.listData = response.data.list.data;
                vm.$Loading.finish();
              }
            })
            .catch(function(error) {
              vm.$Loading.error();
              console.log(error);
            });
        },
        addLabel(temp,id){
          let vm = this;
          vm.editId = id ;
          vm.labelModel = true;
          if(temp == 'add'){
            vm.modalTitle = '新增标签';
            vm.clearModal();
          }else if(temp == 'edit'){
            vm.secondList = [];
            vm.modalTitle = '编辑标签';
            this.$http.get(vm.$commonTools.g_restUrl+"admin/label/label_detail",{
              params: {
                id : id
              }
            })
              .then(function(response) {
                if(response.data.code == 200){
                  vm.firstLabelName = response.data.data.label;
                  vm.secondLabelName = response.data.data.children[0].label;
                  if(response.data.data.children.length > 1){
                    response.data.data.children.forEach(function (value,index,arr) {
                      if(index != 0){
                        let cope = {};
                        cope.name = value.label;
                        vm.secondList.push(cope);
                      }
                    });
                  }
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        },
        saveLabel(){
          let vm = this;
          if(vm.firstLabelName){
            let postData = {};
            postData.label_name = vm.firstLabelName;
            vm.postSecondList = [];
            vm.postSecondList.push(vm.secondLabelName);
            if(vm.secondList.length > 0){
              vm.secondList.forEach(function (ele,index,arr) {
                vm.postSecondList.push(ele.name);
              });
            }
            postData.label_two = vm.postSecondList;
            postData.id = vm.editId;
            this.$http({
              method:"post",
              url:vm.$commonTools.g_restUrl+'admin/label/label_edit',
              data:vm.$qs.stringify(postData)
            })
              .then(function(response) {
                if(response.data.code == 200){
                  vm.$Notice.success({
                    title: '标签添加成功！'
                  });
                  vm.getLabelList();
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }else{
            vm.$Message.warning({
              content:'请填写一级标签！',
              duration: 3
            });
          }
        },
        clearModal(){
          let vm = this;
          vm.firstLabelName = "";
          vm.secondLabelName = "";
          vm.secondList = [];
          vm.postSecondList = [];
          vm.editId = "";
        },
        changeClass(index_temp,item_temp){
            let vm = this;
            vm.listData.forEach(function (value, index, array) {
              if(index_temp == index){
                value.isShow = !item_temp.isShow;
              }
            })
        },
        changePage(curPage){
          this.curPage = curPage;
          this.getLabelList();
        },
        del(id,pid){
          let vm = this;
          let texts = "";
          if(pid == 0){
            texts = "删除一级标签的同时二级标签也将删除，确定要删除吗？";
          }else{
            texts = "确定要删除二级标签吗？"
          }
          this.$Modal.confirm({
            title: '提示',
            content: texts,
            onOk: () => {
              this.$http.get(vm.$commonTools.g_restUrl+"admin/label/label_del",{
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
                    vm.getLabelList();
                  }

                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          });
        },
        addSeLabel(){
          let vm = this;
          if(vm.secondLabelName == ""){
            vm.$Notice.error({
              title: '请先填写第一项！'
            });
          }else{
            let cope = {name:""};
            vm.secondList.push(cope);
          }
        },
        delSeLabel(index){
          this.secondList.splice(index,1);
        },
      }
    }
</script>

<style scoped>
  .tag_title{
    font-size: 1.25rem;
    margin-bottom: 2vh;
    color: #adb3a8;
  }

  .tag_title_fir{
    font-size: 1rem;
    color: #515a6e;
    text-align: left;
    padding-left: 15px;
  }

  .tag_button{
    text-align: right;
  }

  .tag_cardTitle{
    background-color: #fff;
    height:5vh;
    line-height: 5vh;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
   }

  .tag_first_panel{
    margin-top: 2vh;
    background-color: #fff;
    text-align: center;
    border-left: 4px solid #51b213;
    padding: 10px 0;
  }

  .tag_second_panel{
    margin: 1vh 0 1vh 6vw;
    background-color: #fff;
    text-align: center;
    border-left: 4px solid #b3df97;
    padding: 10px 0;
  }

  .tag_first_panel .tag_title{
    font-size: 16px;
  }

  .tag_second_panel .tag_title_se{
    font-size: 15px;
    margin: 0 1vw;
    text-align: left;
  }

  .tag_icon{
    text-align: right;
    padding-right: 10px;
  }

  .tag_inputName{
    text-align: right;
    color: #414c37;
    font-size: 14px;
    font-weight: 600;
  }

  .tag_input{
    width: 230px;
  }

  .tag_modelRow{
    margin-bottom: 10px;
  }

  .tag_page{
    text-align: right;
    margin:2vh 0;
  }

  .input_top{
    margin-top: 10px;
  }

</style>
