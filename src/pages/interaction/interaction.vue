<template>
  <div>
    <page-title ref="title" :title="titleText"></page-title>
    <div class="searchCard" ref="searchCard">
      <Row type="flex" align="middle">
        <Col span="2" class="searchFont">医生姓名</Col>
        <Col span="4"><Input v-model="doctorName" clearable/></Col>
        <Col span="2" class="searchFont">所属城市</Col>
        <Col span="4"><Cascader :data="cities" v-model="citys" change-on-select></Cascader></Col>
        <Col span="4" class="searchFont" offset="8">
          <Button type="success" @click="search">搜索</Button>
          <Button type="warning" @click="clear">重置</Button>
        </Col>
      </Row>
    </div>
    <div class="tableDiv" :style="{height:tableBgH+'px'}">
      <div class="buttonDiv" ref="buttonDiv">
        <Button icon="icon iconfont icon-excel" @click="exportRecord" v-if="btnLimit.export">导出Excel</Button>
      </div>
      <table-list :htmlType="'interaction'" :fatherH = "fatherH" :btnLimit_F="btnLimit_F"  v-if="fatherH && btnLimit_F"
                  @goDetail_C="goDetail" ref="list"></table-list>
    </div>

    <Modal v-model="wk.viewWKModal" title="微课记录" width="850" :footer-hide="true">
      <Row type="flex" align="middle" class="modalRow">
        <Col span="2">微课标题</Col>
        <Col span="5"><span v-text="wk.data.lesson_title"></span></Col>
        <Col span="2">微课编号</Col>
        <Col span="5"><span v-text="wk.data.lesson_number"></span></Col>
        <Col span="2">微课时间</Col>
        <Col span="5"><span v-text="$commonTools.formatDate(wk.data.lesson_time)"></span></Col>
        <Col >创建者&emsp;<span v-text="wk.data.name"></span></Col>
      </Row>
      <Row class="modalRow">
        <Col span="2">主讲医生</Col>
        <Col span="22">
          <Table :columns="wk.columns1" :data="wk.speakerList"></Table>
        </Col>
      </Row>
      <Row class="modalRow">
        <Col span="2">微课简介</Col>
        <Col span="22"><div class="introDiv" v-text="wk.data.content"></div></Col>
      </Row>
      <Row class="modalRow">
        <Col span="21" offset="2">
          <div class="upload-list" v-for="item in wk.data.img">
            <template v-if="wk.data.img.length > 0">
              <img :src="item.url" v-if="item.file_type == 1">
              <a :href="item.url" v-if="item.file_type == 0"><Icon type="ios-document" size="32"/></a>
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              </div>
            </template>
          </div>
        </Col>
      </Row>
      <Row class="modalRow">
        <Col span="2">参会人员</Col>
        <Col span="22">
          <Table :columns="wk.columns2" :data="wk.data.doctors_list" height="200"></Table>
        </Col>
      </Row>
      <Row class="modalRow">
        <Col span="2">上传时间</Col>
        <Col span="22"><span v-text="$commonTools.formatDate(wk.data.update_time)"></span></Col>
      </Row>
    </Modal>
    <Modal v-model="visit.viewVisitModal" title="拜访记录" :footer-hide="true">
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访方式：</Col>
        <Col span="9"><span v-text="visit.data.visiting"></span></Col>
        <Col span="3" offset="1">拜访时间：</Col>
        <Col span="8"><span v-text="$commonTools.formatDate(visit.data.visit_time)"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访目的：</Col>
        <Col span="9"><span v-text="visit.data.purpose"></span></Col>
        <Col span="3" offset="1">上传时间：</Col>
        <Col span="8"><span v-text="$commonTools.formatDate(visit.data.update_time)"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访内容：</Col>
        <Col span="21"><span v-text="visit.data.content"></span></Col>
      </Row>
      <Row>
        <Col span="21" offset="3">
          <div class="upload-list" v-for="item in visit.data.img_list">
            <template v-if="visit.data.img_list.length > 0">
              <img :src="item.url">
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              </div>
            </template>
          </div>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import PageTitle from '../../components/pageTitle'
  import TableList from '../../components/tableList'
  import areaList from "../../../static/js/area2.js"
    export default {
      name: "interaction",
      data(){
        return{
          titleText:'互动记录',
          tableBgH:'',
          fatherH:'',
          wk:{
            viewWKModal:false,
            data:"",
            columns1:[
              {title:'姓名',key:'speaker_name'},
              {title:'所属医院',key:'speaker_hospital'},
              {title:'科室',key:'speaker_section'},
              {title:'职称',key:'speaker_position'},
              {title:'身份证号',key:'speaker_idcard'}
            ],
            columns2:[
              {title:'姓名',key:'realname',
                render:(h,params)=>{
                  let texts = "";
                  if(params.row.uid == 0 || params.row.realname == ""){//uid是0的话是未匹配到，uid不为0但是realname为空是只关注未注册
                    texts = params.row.nickname;
                  }else{
                    texts = params.row.realname;
                  }
                  return h('span',{
                    props:{},
                  },texts)
                }},
              {title:'所属医院',key:'hospital'},
              {title:'科室',key:'department'},
              {title:'职称',key:'job'},
              {title:'城市',key:'citys'}
            ],
            speakerList:[]
          },
          visit:{
            viewVisitModal:false,
            data:""
          },
          btnLimit:{
            detail:false,
            export:false
          },
          btnLimit_F : '',
          doctorName:'',
          citys:[],
          cities:areaList
        }
      },
      components:{
        'page-title':PageTitle,
        'table-list':TableList
      },
      mounted(){
        this.getBgHeight();
        this.getLimitData();
      },
      methods:{
        getLimitData(){
          let vm = this;
          this.$commonTools.setBtnLimit(this.$route.name).forEach(function (ele) {
            if(ele.icon == 'export'){
              vm.btnLimit.export = ele.checked;
            }else if(ele.icon == 'detail'){
              vm.btnLimit.detail = ele.checked;
            }

            vm.btnLimit_F = vm.btnLimit;
          });
        },
        getBgHeight() {
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.$el.offsetHeight + 10) -(vm.$refs.searchCard.offsetHeight + 20)-6;
          vm.fatherH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - 20;
        },
        goDetail(id,type){
          let vm = this;
          let url = '';
          if(type == 1){
            url = "admin/visit/visit_detail";
            vm.visit.viewVisitModal = true;
          }else if(type == 0){
            url = "admin/lesson/lesson_detail";
            vm.wk.viewWKModal = true;
          }
          this.$http.get(vm.$commonTools.g_restUrl+ url,{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(type == 0){
                vm.wk.data = response.data.data;
                vm.wk.speakerList = [];
                vm.wk.speakerList.push(response.data.data);
              }else{
                vm.visit.data = response.data.data;
              }
            })
            .catch(function(error) {
              console.log(error);
            });

        },
        handleView (item) {
          window.open(item.url);
        },
        exportRecord(){
          window.open( this.$commonTools.g_restUrl+"admin/interactive/interactive_export?name="+this.doctorName+"&citys="+this.citys, "_blank");
        },
        search(){
          let postData = {};
          let vm = this;
          postData.name = vm.doctorName;
          postData.citys = vm.citys;
          vm.$refs.list.getData(postData,'first');
        },
        clear(){
          this.citys = [];
          this.doctorName = "";
        }
      }
    }
</script>

<style scoped>
  .tableDiv {
    background-color: #fff;
    margin-top: 26px;
    padding: 10px;
  }

  .buttonDiv {
    text-align: right;
    margin-bottom: 10px;
  }

  .introDiv{
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    padding: 10px;
    max-height: 200px;
    overflow-y: auto;
  }

  .searchCard .searchFont{
    text-align: center
  }

  .searchCard {
    background-color: #fff;
    padding: 10px 0;
  }

  /*图片上传start*/
  .upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .upload-list img{
    width: 100%;
    height: 100%;
  }
  .upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
    display: block;
  }
  .upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  /*图片上传end*/
</style>
