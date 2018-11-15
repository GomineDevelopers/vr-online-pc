<template>
    <div>
      <page-title ref="title" :title="titleText"></page-title>
      <div class="searchCard" ref="searchCard">
        <Row type="flex" align="middle" class="modalRow">
          <Col span="2" class="searchFont">医生姓名</Col>
          <Col span="4"><Input v-model="doctorName" clearable/></Col>
          <Col span="2" class="searchFont">所属城市</Col>
          <Col span="4"><Cascader :data="cities" v-model="citys" change-on-select></Cascader></Col>
          <Col span="2" class="searchFont">就诊日期</Col>
          <Col span="4">
            <DatePicker type="daterange" placement="bottom-end" v-model="dateRange" format="yyyy-MM-dd"></DatePicker>
          </Col>
          <Col span="2" class="searchFont">上传日期</Col>
          <Col span="4">
            <DatePicker type="daterange" placement="bottom-end" v-model="dateRange2" format="yyyy-MM-dd"></DatePicker>
          </Col>
        </Row>
        <Row>
          <Col span="4" class="searchFont" offset="20">
            <Button type="success" @click="search">搜索</Button>
            <Button type="warning" @click="clear">重置</Button>
          </Col>
        </Row>
      </div>
      <div class="tableDiv" :style="{height:tableBgH+'px'}">
        <div class="buttonDiv" ref="buttonDiv" >
          <Button icon="icon iconfont icon-excel" @click="exportRecord" v-if="btnLimit.export">导出Excel</Button>
        </div>
        <table-list :htmlType="'case'" :fatherH = "fatherH" :btnLimit_F="btnLimit_F" v-if="fatherH && btnLimit_F" @goDetail_C="goDetail"
                    ref="list"></table-list>
      </div>

      <Modal v-model="caseModal" title="病例详情" :footer-hide="true">
        <Row type="flex" align="middle" class="modalRow">
          <Col span="3" class="titleFont">医生姓名</Col>
          <Col span="5"><span v-text="caseDetail.realname"></span></Col>
          <Col span="3" class="titleFont" offset="1">所属医院</Col>
          <Col span="12"><span v-text="caseDetail.hospital"></span></Col>
        </Row>
        <Row type="flex" align="middle" class="modalRow">
          <Col span="3" class="titleFont">上传日期</Col>
          <Col span="5"><span v-text="$commonTools.formatDate(caseDetail.create_time)"></span></Col>
          <Col span="3" class="titleFont" offset="1">所在城市</Col>
          <Col span="12"><span v-text="caseDetail.citys"></span></Col>
        </Row>
        <Row type="flex" align="middle" class="modalRow">
          <Col span="3" class="titleFont">就诊日期</Col>
          <Col span="5"><span v-text="$commonTools.formatDate(caseDetail.visit_time)"></span></Col>
          <Col span="2" offset="1" class="titleFont">年龄</Col>
          <Col span="3"><span v-text="caseDetail.age"></span></Col>
          <Col span="2" class="titleFont">性别</Col>
          <Col span="2"><span v-text="caseDetail.gender"></span></Col>
          <Col span="2" class="titleFont">分组</Col>
          <Col span="3"><span v-text="caseDetail.group"></span></Col>
        </Row>
        <Row class="modalRow">
          <Col span="5" class="titleFont">主述与病史</Col>
        </Row>
        <Row class="modalRow">
          <Col span="24" ><div class="introDiv" v-text="caseDetail.illness"></div></Col>
        </Row>
        <Row class="modalRow">
          <Col span="5" class="titleFont">检查检验及诊断</Col>
        </Row>
        <Row class="modalRow">
          <Col span="24" ><div class="introDiv" v-text="caseDetail.diagnosis"></div></Col>
        </Row>
        <Row class="modalRow">
          <Col span="5" class="titleFont">治疗方案</Col>
        </Row>
        <Row class="modalRow">
          <Col span="24" ><div class="introDiv" v-text="caseDetail.programs"></div></Col>
        </Row>
        <Row class="modalRow" v-if="caseDetail.img">
          <Col span="4" class="titleFont">上传的资料</Col>
          <Col span="20">
            <div class="upload-list">
              <template>
                <img :src="caseDetail.img">
                <div class="upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(caseDetail.img)"></Icon>
                </div>
              </template>
            </div>
          </Col>
        </Row>
        <Row class="modalRow">
          <Col span="5" class="titleFont">其他信息</Col>
        </Row>
        <Row class="modalRow">
          <Col span="24" >
            <div class="introDiv" v-text="caseDetail.information" v-if="caseDetail.information"></div>
            <div v-else>无</div>
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
      name: "caseList",
      data(){
        return{
          titleText:'病例论坛',
          doctorName:'',
          cities:areaList,
          citys:[],
          tableBgH:'',
          fatherH:'',
          caseModal:false,
          caseDetail:'',
          dateRange:'',
          dateRange2:'',
          btnLimit:{
            detail:false,
            export:false
          },
          btnLimit_F : ''
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
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.$el.offsetHeight + 10) -(vm.$refs.searchCard.offsetHeight + 20) -20;
          vm.fatherH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2);
        },
        goDetail(id){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+ 'admin/cases/cases_detail',{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.caseDetail = response.data.data;
                vm.caseModal = true;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        search(){
          let postData = {};
          let vm = this;
          postData.realname = vm.doctorName;
          postData.citys = vm.citys;
          postData.start_time = vm.dateRange[0];
          postData.end_time = vm.dateRange[1];
          postData.startcreate_time = vm.dateRange2[0];
          postData.endcreate_time = vm.dateRange2[1];
          vm.$refs.list.getData(postData,'first');
        },
        clear(){
          this.doctorName = "";
          this.citys = [];
          this.dateRange = "";
          this.dateRange2 = "";
        },
        exportRecord(){
          let s_time = '';
          let e_time = '';
          let s_time2 = '';
          let e_time2 = '';
          let city_d = '';
          let vm = this;
          if(vm.citys.length >0){
            city_d = vm.citys[0] + ',' + vm.citys[1];
          }
          if(this.dateRange[0] != ""){
            s_time = vm.$commonTools.formatDate4(vm.dateRange[0]);
            e_time = vm.$commonTools.formatDate4(vm.dateRange[1]);
          }

          if(this.dateRange2[0] != ""){
            s_time2 = vm.$commonTools.formatDate4(vm.dateRange2[0]);
            e_time2 = vm.$commonTools.formatDate4(vm.dateRange2[1]);
          }
          window.open( this.$commonTools.g_restUrl+"admin/cases/cases_export?realname=" +vm.doctorName
                       +"&citys="+city_d+"&start_time="+ s_time+"&end_time="+ e_time
                       +"&startcreate_time="+ s_time2+"&endcreate_time="+ e_time2, "_blank");
        },
        handleView (url) {
          window.open(url);
        },
      }
    }
</script>

<style scoped>
  .searchCard {
    background-color: #fff;
    padding: 10px 0;
  }

  .searchCard .searchFont{
    text-align: center
  }

  .tableDiv {
    background-color: #fff;
    margin-top: 26px;
    padding: 10px;
  }

  .buttonDiv {
    text-align: right;
    margin-bottom: 10px;
  }

  .titleFont{
    font-weight:600;
  }

  .introDiv{
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    padding: 10px;
    max-height: 80px;
    overflow-y: auto;
  }

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
</style>
