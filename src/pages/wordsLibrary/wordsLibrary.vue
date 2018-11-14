<template>
  <div class="wordsLib">
    <page-title ref="title" :title="titleText"></page-title>
    <div class="searchCard" ref="searchCard">
      <Row type="flex" align="middle" class="search_row search_row_bottom">
        <Col span="2" class="searchFont">产品名称</Col>
        <Col span="4">
          <Select v-model="selectdProduct" filterable @on-change="changePro">
            <Option v-for="item in products" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" align="middle" class="search_row">
        <Col span="2" class="searchFont">话术标题</Col>
        <Col span="4"><Input v-model="wordsTitle" clearable/></Col>
        <Col span="2" class="searchFont">创建人</Col>
        <Col span="4"><Input v-model="wordsCreater" clearable/></Col>
        <Col span="2" class="searchFont">类别1</Col>
        <Col span="4">
          <Select v-model="selectedType1">
            <Option v-for="item in type1" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="5" class="searchFont" offset="1">
          <Button type="success" @click="search">搜索</Button>
          <Button type="warning" @click="clear">重置</Button>
        </Col>
      </Row>
    </div>
    <div class="tableDiv" :style="{height:tableBgH+'px'}">
      <div class="buttonDiv" ref="buttonDiv">
        <Button icon="md-add" @click="showLabelModal('add')" v-if="btnLimit.add">新增话术</Button>
      </div>
      <table-list :htmlType="'wordsLib'" :fatherH = "fatherH" :btnLimit_F = "btnLimit_F" :product="selectdProduct" v-if="fatherH && btnLimit_F &&selectdProduct"
        @goDetail_C = "goDetail" @goEdit_C = "showLabelModal" ref="list"></table-list>
    </div>

    <Modal v-model="libModal" :title="modalTitle" @on-ok="save(modalData)">
      <Row class="rowBottom">
        <Col span="4"><span class="necessary">*</span>话术标题</Col>
        <Col span="20"><Input v-model="modalData.speechcraft"/></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4"><span class="necessary">*</span>话术辅助信息</Col>
        <Col span="20"><Input type="textarea" :rows="4" v-model="modalData.auxiliary"/></Col>
      </Row>
      <Row class="rowBottom">
        <Col span="4"><span class="necessary">*</span>话术类别1</Col>
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
  import PageTitle from '../../components/pageTitle'
  import TableList from '../../components/tableList'
    export default {
      name: "wordsLibrary",
      data(){
          return{
            titleText:'话术资料库',
            wordsTitle:'',
            wordsCreater:'',
            selectedType1:[],
            products:[],
            selectdProduct:'',
            type1:[],
            tableBgH:'',
            fatherH:'',
            loading:true,
            libModal:false,
            libModalView:false,
            modalTitle:'新增话术',
            data:[],
            totalPage:0,
            curPage:1,
            modalData:{
              speechcraft:'',
              auxiliary:"",
              type1:"",
              type2:""
            },
            btnLimit:{
              add:false,
              del:false,
              update:false,
              detail:false
            },
            btnLimit_F:''
          }
      },
      components:{
        'page-title':PageTitle,
        'table-list':TableList
      },
      mounted(){
        this.getBgHeight();
        this.getTypeProduct();
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
            }else if(ele.icon == 'detail'){
              vm.btnLimit.detail = ele.checked;
            }
          });
          vm.btnLimit_F = vm.btnLimit;
        },
        getBgHeight() {
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.$el.offsetHeight + 10) -(vm.$refs.searchCard.offsetHeight + 20) - 10;
          vm.fatherH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2)-40;
        },
        getTypeProduct(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+"admin/speech/speech_type",{
            params: {}
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.type1 = response.data.data;
                vm.products = response.data.product;
                if(vm.products.length>0){//默认选中第一项
                  vm.selectdProduct = vm.products[0].value;
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changePro(){
          this.search();
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
          let postData = {};
          let vm = this;
          postData.speechcraft = vm.wordsTitle;1
          postData.username = vm.wordsCreater;
          postData.type = vm.selectedType1;
          postData.product = vm.selectdProduct;
          vm.$refs.list.getData(postData,'first');
        },
        clear(){
          this.wordsTitle = "";
          this.wordsCreater = "";
          this.selectedType1 = [];
        },
        validator(){
          let vm = this;
          let texts = "";
          if(!vm.modalData.speechcraft){
            texts = '请填写话术标题！';
          }else if(!vm.modalData.auxiliary){
            texts = '请填写话术辅助信息！';
          }else if(!vm.modalData.type1){
            texts = '请填写话术类别1！';
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
        save(modalData){
          let vm = this;
          if(vm.validator()){
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
                  vm.$refs.list.getData();
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
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
  .searchCard {
    background-color: #fff;
  }

  .searchCard .searchFont{
    text-align: center
  }

  .buttonDiv {
    text-align: right;
    margin: 10px;
  }

  .tableDiv {
    background-color: #fff;
    margin-top: 26px;
    padding: 2vh;
  }

  .rowBottom{
    margin-bottom: 10px;
  }

  .titleFont{
    font-weight: 600;
  }

  .search_row{
    padding:10px 0;
  }

  .search_row_bottom{
    border-bottom: 1px dashed #dcdee2;
  }
</style>
