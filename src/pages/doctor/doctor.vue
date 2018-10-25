<template>
      <div class="doctor">
        <div class="title" ref="title">医生管理</div>
        <div class="searchCard" ref="searchCard">
          <Row type="flex" align="middle" class="search_row">
            <Col span="3" class="searchFont">所属医院</Col>
            <Col span="4"><Input v-model="hospitalName" clearable/></Col>
            <Col span="3" class="searchFont">医生姓名</Col>
            <Col span="4"><Input v-model="doctorName" clearable/></Col>
            <Col span="3" class="searchFont">微信昵称</Col>
            <Col span="4"><Input v-model="nickName" clearable/></Col>
          </Row>
          <Row type="flex" align="middle" class="search_row">
            <Col span="3" class="searchFont">标签</Col>
            <Col span="4">
              <Cascader :data="tagData" v-model="tagValue" change-on-select></Cascader>
            </Col>
            <Col span="3" class="searchFont">城市</Col>
            <Col span="4"><Cascader :data="cities" v-model="city" change-on-select></Cascader></Col>
            <Col span="10" class="searchFont">
              <Button type="success" @click="search">搜索</Button>
              <Button type="warning" @click="clear">重置</Button>
            </Col>
          </Row>
        </div>
        <div class="tableDiv" :style="{height:tableBgH+'px'}">
          <div class="buttonDiv" ref="buttonDiv">
            <Button icon="icon iconfont icon-excel" @click="exportRecord">导出Excel</Button>
            <Button icon="md-add" @click="showLabelModal">添加标签</Button>
          </div>
          <Table ref="selection" :columns="columns2" :data="data2" :height="tableH" :loading="loading"
                 @on-select="selected" @on-select-cancel="unSelected" @on-select-all="selectedAll" @on-select-all-cancel="unSelectedAll"></Table>
          <div class="pageDiv" ref="pageDiv">
            <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
          </div>
        </div>

        <Modal v-model="labelModel" title="请选择您需要添加的标签" @on-ok="addLabel" >
          <Cascader :data="tagData" v-model="tagValue" style="width: 400px"></Cascader>
        </Modal>
        <Modal v-model="detailEditModel" @on-ok="save(detailData)">
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">编号：</span>
              <span class="detail_text" v-text="detailData.numbers"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">姓名：</span>
              <span class="detail_text" v-text="detailData.realname"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">医院：</span>
              <Input v-model="detailData.hospital" class="inputStyle"/>
            </Col>
            <Col span="12">
              <span class="detail_title">科室：</span>
              <Input v-model="detailData.department" class="inputStyle"/>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">职称：</span>
              <Input v-model="detailData.job" class="inputStyle"/>
            </Col>
            <Col span="12">
              <span class="detail_title">注册时间：</span>
              <span class="detail_text" v-text="$commonTools.formatDate(detailData.reg_time)"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">手机：</span>
              <Input v-model="detailData.mobile"class="inputStyle"/>
            </Col>
            <Col span="12">
              <span class="detail_title">邮箱：</span>
              <Input v-model="detailData.email" class="inputStyle"/>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">微信号：</span>
              <span class="detail_text" v-text="detailData.wechat"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">昵称：</span>
              <span class="detail_text" v-text="detailData.nickname"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="24">
              <span class="detail_title">所在城市：</span>
              <span class="detail_text" v-text="detailData.citys"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="24">
              <span class="detail_title">状态：</span>
              <span class="detail_text" v-text="detailData.is_registered"></span>
            </Col>
          </Row>
          <!--<Row>
            <Col span="24">
              <span class="detail_title">标签：</span>
              <span></span>
            </Col>
          </Row>-->
        </Modal>
        <Modal v-model="detailModel" :footer-hide="true">
          <Row class="detail_row">
            <Col span="8" class="detail_img"><img :src="detailData.avatar"></Col>
            <Col span="12">
              <div class="detail_row">
                <span class="detail_title">姓名：</span>
                <span class="detail_text" v-text="detailData.realname"></span>
              </div>
              <div class="detail_row">
                <span class="detail_title">昵称：</span>
                <span class="detail_text" v-text="detailData.nickname"></span>
              </div>
              <div class="detail_row">
                <span class="detail_title">医院：</span>
                <span class="detail_text" v-text="detailData.hospital"></span>
              </div>
              <div class="detail_row">
                <span class="detail_title">科室：</span>
                <span class="detail_text" v-text="detailData.department"></span>
              </div>
              <div class="detail_row">
                <span class="detail_title">职称：</span>
                <span class="detail_text" v-text="detailData.job"></span>
              </div>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">编号：</span>
              <span class="detail_text" v-text="detailData.numbers"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">注册时间：</span>
              <span class="detail_text" v-text="detailData.reg_time == null ? '-':$commonTools.formatDate(detailData.reg_time)"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">状态：</span>
              <span class="detail_text" v-text="detailData.is_registered"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">微信号：</span>
              <span class="detail_text" v-text="detailData.wechat"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">手机号：</span>
              <span class="detail_text" v-text="detailData.mobile"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">邮箱：</span>
              <span class="detail_text" v-text="detailData.email"></span>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <span class="detail_title">所在城市：</span>
              <span class="detail_text" v-text="detailData.citys"></span>
            </Col>
          </Row>

        </Modal>
        <Modal v-model="detailPassModel" :footer-hide="true" fullscreen class="fullModal" @on-cancel="getData2">
          <doctor-pass-detail ref="c1"></doctor-pass-detail>
        </Modal>
    </div>
</template>

<script>
  import DoctorPassDetail from '@/components/DoctorPassDetail.vue'
  import areaList from "../../../static/js/area.js"
export default {
  name: "doctor",
  data() {
    return {
      hospitalName:'',
      doctorName:'',
      nickName:'',
      city:[],
      tableBgH: "",
      tableH: "",
      curPage:1,
      data2: [],
      totalPage:0,
      loading:true,
      labelModel: false,
      detailModel:false,
      detailEditModel:false,
      detailData:"",
      detailPassModel:false,
      columns2: [
        { title:"序号",type: "selection", width: 50, align: "center" },
        {title: "头像", key: "avatar",width:60,
          render:(h,params)=>{
            return h("img",{
              props:{},
              attrs:{
                src:params.row.avatar
              },
              style:{
                width:"32px",
              }
            })
          }
        },
        { title: "编号", key: "numbers",width:118},
        { title: "姓名", key: "realname"},
        { title: "昵称", key: "nickname"},
        {title: "医院",key: "hospital"},
        {title: "科室",key: "department"},
        {title:"城市",key:"citys"},
        { title: "标签",key: "label_name",
          render:(h,params)=>{
          let texts = "";
          if(params.row.label_name.length>0){
            params.row.label_name.forEach(function (value,index,arr) {
              if(index == 0){
                texts = value.name;
              }else{
                texts = texts + '；' +value.name;
              }
            });
          }
          return h('span',{
            props:{},
          },texts)
          }
        },
        { title: "注册时间", key: "reg_time",width:140,
          render:(h,params)=>{
            let texts = '';
            if(params.row.reg_time == null){
              texts = '-';
            }else{
              texts = this.$commonTools.formatDate(params.row.reg_time);
            }
            return h('span',{
              props:{},
            },texts)
          }
        },
        {title: "状态",key: "is_registered",
          render:(h,params)=>{
            let texts = "";
            if(params.row.is_registered == 1){
              texts = "待审核";
            }else if(params.row.is_registered == 2){
              texts = "通过";
            }else if(params.row.is_registered == 3){
              texts = "未通过";
            }else if(params.row.is_registered == 0){
              texts = "未注册";
            }
            return h('span',{
              props:{},
            },texts)
          }
        },
        {title: "操作",key: "action",width: 150,align: "center",
          render: (h, params) => {
            return h("div", [
              h("Tooltip",{props:{trigger:"hover",content:"同意", placement:"top"}},
                [h("Icon", {
                  props: {
                    type: "md-checkmark-circle",
                    size:"16"
                  },
                  style: {
                    color: "#4fb115",
                    display:(params.row.is_registered == 0 || params.row.is_registered == 2 || params.row.is_registered == 3)?"none":"inline"
                  },
                  on: {
                    click: () => {
                      this.isPass(params.row.id,2);
                    }
                  }
                })]),
              h("Tooltip",{props:{trigger:"hover",content:"拒绝",placement:"top"}},
                [h("Icon", {
                  props: {
                    type: "md-close-circle",
                    size:"16"
                  },
                  style: {
                    color: "red",
                    display:(params.row.is_registered == 0 ||params.row.is_registered == 2 || params.row.is_registered == 3)?"none":"inline"
                  },
                  on: {
                    click: () => {
                      this.isPass(params.row.id,3);
                    }
                  }
                })]),
              h("Tooltip",{props:{trigger:"hover",content:"资料",placement:"top"}},
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
                      if(params.row.is_registered == 2){
                        this.goDetailPass(params.row.id);
                      }else{
                        this.goDetail(params.row.id);
                      }
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
                      this.editDetail(params.row.id);
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
      tagData:[],
      tagValue:[],
      selections: [],
      cities: areaList
    };
  },
  components: {
    'doctor-pass-detail': DoctorPassDetail
  },
  mounted() {
    this.getBgHeight();
    this.getData2();
    this.getLabels();
  },
  methods: {
    getBgHeight() {
      let vm = this;
      vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10) -(vm.$refs.searchCard.offsetHeight + 20) - 5;
      vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - (vm.$refs.pageDiv.offsetHeight + 10 * 2) -10;
    },
    getData2() {
      let vm = this;
      let postData = {};
      postData.page = vm.curPage ;
      postData.hospital = vm.hospitalName;
      postData.nickname = vm.nickName;
      postData.realname = vm.doctorName;
      postData.label = vm.tagValue;
      postData.citys = vm.city;
      this.$http({
        method:"post",
        url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_list',
        data:vm.$qs.stringify(postData)
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.data2 = response.data.list.data;
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
    search(){
      /*搜索从第一页开始*/
      this.curPage = 1;
      this.getData2();
    },
    clear(){
      let vm = this;
      vm.hospitalName = "";
      vm.nickName = "";
      vm.doctorName = "";
      vm.tagValue = [];
      vm.city = [];
    },
    isPass(id,status){//通过or拒绝
      let vm = this;
      vm.$http.get(vm.$commonTools.g_restUrl+'admin/doctors/dectors_check', {
        params: {
          id: id,
          status: status
        }
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.getData2();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getDetailData(id){
      let vm = this;
      this.$http.get(vm.$commonTools.g_restUrl+'admin/doctors/dectors_detail',{
        params: {
          id : id
        }
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.detailData = response.data.data;
            if(response.data.data.is_registered == '0'){
              vm.detailData.is_registered = "未注册";
            }else if(response.data.data.is_registered == '1'){
              vm.detailData.is_registered = "待审核";
            }else if(response.data.data.is_registered == '2'){
              vm.detailData.is_registered = "通过";
            }else if(response.data.data.is_registered == '3'){
              vm.detailData.is_registered = "未通过";
            }

            vm.detailData.id = id;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goDetail(id){
      this.getDetailData(id);
      this.detailModel = true;
    },
    goDetailPass(id){
      this.detailPassModel = true;
      this.$refs.c1.getPassDetailData(id);
    },
    del(id){
      let vm = this;
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: () => {
          this.$http.get(vm.$commonTools.g_restUrl+"admin/doctors/doctors_del",{
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
                vm.getData2();
              }

            })
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },
    changePage(curPage) {
      this.curPage = curPage;
      this.getData2();
    },
    editDetail(id){
      this.getDetailData(id);
      this.detailEditModel =true;
    },
    save(newDetailData){
      if(newDetailData.is_registered == "未注册"){
        newDetailData.is_registered = 0;
      }else if(newDetailData.is_registered == "待审核"){
        newDetailData.is_registered = 1;
      }else if(newDetailData.is_registered == "通过"){
        newDetailData.is_registered = 2;
      }else if(newDetailData.is_registered == "未通过"){
        newDetailData.is_registered = 3;
      }
      let vm = this;
      this.$http({
        method:"post",
        url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_edit',
        data:vm.$qs.stringify(newDetailData)
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.$Notice.success({
              title: '编辑成功！'
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getLabels(){
      let vm = this;
      this.$http.get(vm.$commonTools.g_restUrl+"admin/label/doctors_label",{
        params: {}
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.tagData = response.data.list;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    showLabelModal() {
      let vm = this;
      vm.tagValue = [];
      if(vm.selections.length == 0){
        vm.$Notice.info({
          title: '请先选择需要添加标签的医生！'
        });
      }else{
        vm.labelModel = true;
      }
    },
    addLabel() {
      let vm = this;
      let id_doctor = [];
      let postData = {};
      vm.selections.forEach(function (value, index, array) {
        id_doctor.push(value.id);
      });
      postData.member = id_doctor;
      postData.label = vm.tagValue;
      this.$http({
        method:"post",
        url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_chectlabel',
        data:vm.$qs.stringify(postData)
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.$Notice.success({
              title: '标签添加成功！'
            });
            vm.getData2();
          }
        })
        .catch(function(error) {
          console.log(error);
        });

    },
    selected(selection, row) {
      this.selections = selection;
    },
    unSelected(selection, row) {
      this.selections = selection;
    },
    selectedAll(selection){
      this.selections = selection;
    },
    unSelectedAll(selection){
      this.selections = selection;
    },
    exportRecord(){
      let vm = this;
      let postData = {};
      postData.hospital = vm.hospitalName;
      postData.nickname = vm.nickName;
      postData.realname = vm.doctorName;
      postData.label = vm.tagValue;
      postData.citys = vm.city;

      this.$http({
        method:"post",
        url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_export',
        data:vm.$qs.stringify(postData)
      })
        .then(function(response) {})
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>


<style scoped>
.title {
	font-size: 1.25rem;
	color: #adb3a8;
	margin-bottom: 10px;
}

.searchCard {
	background-color: #fff;
	padding: 20px 10px 0 10px;
}

.searchCard .searchFont{
  text-align: center
}

.search_row{
  padding-bottom: 20px;
}
.tableDiv {
	background-color: #fff;
	margin-top: 26px;
	padding: 2vh;
}

.pageDiv {
	margin: 10px;
	text-align: right;
}

.inputStyle {
	width: 10vw;
}

.buttonDiv {
	text-align: right;
	margin-bottom: 10px;
}

  .detail_row{
    padding: 3px;
    font-size: 14px;
  }

  .detail_title{
    color:#8d8d8d;
  }

  .detail_text{
    font-weight: 600;
  }

</style>
<style>
  .iconfont.icon-excel{
    font-size: 12px;
  }
</style>
