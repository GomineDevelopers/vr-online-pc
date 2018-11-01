<template>
  <div>
    <div class="title" ref="title">互动记录</div>
    <div class="tableDiv" :style="{height:tableBgH+'px'}">
      <div class="buttonDiv" ref="buttonDiv">
        <Button icon="icon iconfont icon-excel" @click="exportRecord" v-if="btnLimit.exportStatus">导出Excel</Button>
      </div>
      <Table ref="selection" :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
      </div>
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
    export default {
      name: "interaction",
      data(){
        return{
          tableBgH:'',
          tableH:'',
          columns:[
            {title:"序号",type:"index", width: 60, align: "center"},
            {title:"负责VR",key:"vr",align: "center"},
            {title:"互动类别",key:"type",align: "center",
              render:(h,params) =>{
                let texts = "";
                if(params.row.type == 0){
                  texts = "微课";
                }else if(params.row.type == 1){
                  texts = "拜访";
                }
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {title:"互动医生",key:"realname"},
            {title:"医生城市",key:"citys"},
            {title:"互动时间",key:"visit_time",
              render:(h,params)=>{
                let texts = '';
                if(params.row.visit_time == null){
                  texts = '-';
                }else{
                  texts = this.$commonTools.formatDate(params.row.visit_time);
                }
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {title:"操作",key: "action",align:"center",
              render:(h, params) =>{
                return h("div", [
                  h("Tooltip",{props:{trigger:"hover",content:"详情", placement:"top"}},
                    [h("Icon", {
                      props: {
                        type: "icon iconfont icon-ziliao"
                      },
                      style: {
                        color: "#4fb115"
                      },
                      on: {
                        click: () => {
                          this.goDetail(params.row.type,params.row.interactive_id);
                        }
                      }
                    })]
                  )
                ]);
              }
            }
          ],
          data:[],
          loading:true,
          curPage:1,
          totalPage:0,
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
            exportStatus:''
          }
        }
      },
      mounted(){
        this.getBgHeight();
        this.getData();
        this.btnLimit.exportStatus = this.$commonTools.setBtnLimit(this.$route.name)[0].checked;
      },
      methods:{
        getBgHeight() {
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10) -20;
          vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - (vm.$refs.pageDiv.offsetHeight + 10 * 2) - 30;
        },
        changePage(curPage){
          this.curPage = curPage;
          this.getData();
        },
        getData(){
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl+'admin/interactive/interactive_list', {
            params: {
              page:vm.curPage
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
        goDetail(type,id){
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
          window.open( this.$commonTools.g_restUrl+"admin/interactive/interactive_export", "_blank");
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

  .tableDiv {
    background-color: #fff;
    margin-top: 26px;
    padding: 10px;
  }

  .pageDiv {
    margin: 10px;
    text-align: right;
  }

  .buttonDiv {
    text-align: right;
    margin-bottom: 10px;
  }

  .modalRow{
    margin-bottom: 10px;
  }

  .introDiv{
    height: 200px;
    overflow-y: auto;
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
