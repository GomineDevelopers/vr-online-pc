<template>
      <div class="doctor">
        <div class="title" ref="title">医生管理</div>
        <div class="searchCard" ref="searchCard">
          <Row type="flex" align="middle" class="search_row">
            <Col span="2" class="searchFont">所属医院</Col>
            <Col span="4"><Input v-model.trim="hospitalName" clearable/></Col>
            <Col span="2" class="searchFont">医生姓名</Col>
            <Col span="4"><Input v-model.trim="doctorName" clearable/></Col>
            <Col span="2" class="searchFont">微信昵称</Col>
            <Col span="4"><Input v-model.trim="nickName" clearable/></Col>
            <Col span="2" class="searchFont">状态</Col>
            <Col span="4">
              <Select v-model="status">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
          </Row>
          <Row type="flex" align="middle" class="search_row">
            <Col span="2" class="searchFont">标签</Col>
            <Col span="4">
              <Cascader :data="tagData" v-model="tagValue_search" change-on-select></Cascader>
            </Col>
            <Col span="2" class="searchFont">城市</Col>
            <Col span="4"><Cascader :data="cities" v-model="city" change-on-select></Cascader></Col>
            <Col span="2" class="searchFont">VR</Col>
            <Col span="4"><Input v-model.trim="vr" clearable/></Col>
            <Col span="5" style="text-align: center">
              <Button type="success" @click="search">搜索</Button>
              <Button type="warning" @click="clear">重置</Button>
            </Col>
          </Row>
        </div>
        <div class="tableDiv">
          <div class="buttonDiv" ref="buttonDiv">
            <download-excel style="display: inline-block;" :data = "excelData" :fields="excelFileds" :name=" '医生管理'+ excelTime+'.xls'" v-if="btnLimit.export">
              <Button icon="icon iconfont icon-excel" @click="exportRecord" v-if="btnLimit.export">导出Excel</Button>
            </download-excel>
            <Button icon="md-add" @click="showLabelModal" v-if="btnLimit.addTag">添加标签</Button>
            <Button icon="md-add" @click="showVisitModal" v-if="btnLimit.addGroupSend">添加群发拜访</Button>
          </div>
          <Table ref="selection" :columns="columns2" :data="data2" :loading="loading"
                 @on-select="selected" @on-select-cancel="unSelected" @on-select-all="selectedAll" @on-select-all-cancel="unSelectedAll"></Table>
          <div class="pageDiv" ref="pageDiv">
            <Page :total="totalPage" show-elevator show-total :current="curPage" :page-size="perPage" @on-change="changePage"/>
          </div>
        </div>

        <Modal v-model="labelModel" title="请选择您需要添加的标签" @on-ok="addLabel" width="350px">
          <Cascader :data="tagData" v-model="tagValue"></Cascader>
        </Modal>
        <Modal v-model="detailEditModel" @on-ok="save(detailData)">
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">编号：</span>
              <span class="detail_text" v-text="detailData.numbers"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">姓名：</span>
              <Input v-model.trim="detailData.realname" class="inputStyle"/>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">医院：</span>
              <Input v-model.trim="detailData.hospital" class="inputStyle"/>
            </Col>
            <Col span="12">
              <span class="detail_title">科室：</span>
              <Input v-model.trim="detailData.department" class="inputStyle"/>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">职称：</span>
              <Input v-model.trim="detailData.job" class="inputStyle"/>
            </Col>
            <Col span="12">
              <span class="detail_title">注册时间：</span>
              <span class="detail_text" v-text="$commonTools.formatDate(detailData.reg_time)"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">手机：</span>
              <Input v-model.trim="detailData.mobile"class="inputStyle"/>
            </Col>
            <Col span="12">
              <span class="detail_title">邮箱：</span>
              <Input v-model.trim="detailData.email" class="inputStyle"/>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">昵称：</span>
              <span class="detail_text" v-text="detailData.nickname"></span>
            </Col>
            <Col span="12">
              <span class="detail_title">状态：</span>
              <span class="detail_text" v-text="detailData.is_registered"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="12">
              <span class="detail_title">V R：</span>
              <Select v-model="detailData.vr" filterable class="inputStyle">
                <Option v-for="item in detailData.vrarr" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
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
              <span class="detail_title">标签：</span>
              <Tag v-for="item in detailData.label_name" :key="item.id" :name="item.name" color="primary">{{item.name}}</Tag>
            </Col>
          </Row>
        </Modal>
        <Modal v-model="detailModel" :footer-hide="true">
          <Row class="detail_row">
            <Col span="8" class="detail_img"><img :src="detailData.avatar"></Col>
            <Col span="16">
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
              <span class="detail_title">手机号：</span>
              <span class="detail_text" v-text="detailData.mobile"></span>
            </Col>
          </Row>
          <Row class="detail_row">
            <Col span="24">
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
          <doctor-pass-detail ref="c1" :btnLimit_F="btnLimit_F"></doctor-pass-detail>
        </Modal>
        <Modal v-model="visit.addVisitModal" title="添加群发拜访记录" @on-ok="saveVisitRecord">
          <Row class="modalRow" type="flex" align="middle">
            <Col span="3"><span class="necessary">*</span>拜访方式</Col>
            <Col span="9">
              <Input v-model.trim="visit.type" readonly="readonly"/>
            </Col>
            <Col span="3" offset="1"><span class="necessary">*</span>拜访时间</Col>
            <Col span="8">
              <DatePicker ref="date" type="datetime" v-model="visit.visitDate" :value="visit.visitDate" format="yyyy-MM-dd HH:mm" :options="visit.optionsDate"></DatePicker>
            </Col>
          </Row>
          <Row class="modalRow" type="flex" align="middle">
            <Col span="3"><span class="necessary">*</span>拜访目的</Col>
            <Col span="9">
              <Select v-model="visit.visitPurpose" clearable ref="purpose">
                <Option v-for="item in visit.visitPurposeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
          </Row>
          <Row class="modalRow" type="flex" align="middle">
            <Col span="3"><span class="necessary">*</span>拜访内容</Col>
            <Col span="21">
              <Input v-model.trim="visit.visitContent" type="textarea" :rows="4"/>
            </Col>
          </Row>
          <Row>
            <Col span="21" offset="3">
              <div class="upload-list" v-for="item in visit.uploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload ref="upload" :show-upload-list="false"
                      :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048"
                      :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                      :before-upload="handleBeforeUpload" multiple type="drag"
                      :action = visit.serverImgUrl
                      style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </Col>
          </Row>
        </Modal>
    </div>
</template>

<script>
  import DoctorPassDetail from '@/components/DoctorPassDetail.vue'
  import areaList from "../../../static/js/area2.js"
export default {
  name: "doctor",
  data() {
    return {
      tabValue:1,
      excelData:[],
      excelFileds:{},
      excelTime:this.$commonTools.formatDate3(new Date()),
      hospitalName:'',
      doctorName:'',
      nickName:'',
      city:[],
      vr:'',
      status:'',
      statusList: [],
      curPage:1,
      perPage:10,
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
        {title: "VR",key: "vr"},
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
        {title: "状态",key: "is_registered",width:94,align:"center",
          render:(h,params)=>{
            let texts = "";
            let type = "";
            if(params.row.is_registered == 1){
              texts = "待审核";
              type = 'blue';
            }else if(params.row.is_registered == 2){
              texts = "通过";
              type = 'green';
            }else if(params.row.is_registered == 3){
              texts = "未通过";
              type = 'red';
            }else if(params.row.is_registered == 0){
              texts = "未注册";
              type = 'default';
            }
            return h('Tag',{
              props:{
                color:type
              },
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
                    display:((params.row.is_registered == 1)&&this.btnLimit.review)?"inline":"none"
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
                    color: "red",//0是未注册 1 审核中 2 通过 3 拒绝
                    display:((params.row.is_registered == 1)&&this.btnLimit.review)?"inline":"none"
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
                    color: "#4fb115",
                    display:this.btnLimit.detail ? 'inline':'none'
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
                    display:((params.row.is_registered == 0)?"none":"inline") && (this.btnLimit.update ? 'inline':'none')
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
                    color: "#4fb115",
                    display:this.btnLimit.del ? 'inline':'none'
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
      tagValue_search:[],
      selections: [],
      cities: areaList,
      btnLimit:{
        add:false,
        del:false,
        update:false,
        detail:false,
        export:false,
        addTag:false,
        review:false,
        addGroupSend:false
      },
      btnLimit_F:'',
      visit:{
        addVisitModal:false,
        type:'群发',
        visitDate:'',
        visitPurpose:'',
        visitPurposeList:[{value: '破冰',label: '破冰'},{value: '转化',label: '转化'},{value: '提升',label: '提升'},{value: '调研',label: '调研'},{value: '活动',label: '活动'},{value: '兑奖',label: '兑奖'},{value: '其他',label: '其他'}],
        visitContent:'',
        /*图片上传相关start*/
        serverImgUrl:'http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/images/add_images',
        imgNameList:[],
        uploadList: [],
        /*图片上传相关end*/
      }
    };
  },
  components: {
    'doctor-pass-detail': DoctorPassDetail
  },
  mounted() {
    this.getData2();
    this.getLabels();
    this.getLimitData();
    this.visit.uploadList = this.$refs.upload.fileList;
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
        }else if(ele.icon == 'detail'){
          vm.btnLimit.detail = ele.checked;
        }else if(ele.icon == 'export'){
          vm.btnLimit.export = ele.checked;
        }else if(ele.icon == 'addTag'){
          vm.btnLimit.addTag = ele.checked;
        }else if(ele.icon == 'review'){
          vm.btnLimit.review = ele.checked;
        }else if(ele.icon == 'addGroupSend'){
          vm.btnLimit.addGroupSend = ele.checked;
        }
      });
      vm.btnLimit_F = vm.btnLimit;
    },
    getData2() {
      let vm = this;
      let postData = {};
      postData.page = vm.curPage ;
      postData.hospital = vm.hospitalName;
      postData.nickname = vm.nickName;
      postData.realname = vm.doctorName;
      postData.label = vm.tagValue_search;
      postData.citys = vm.city;
      postData.vr = vm.vr;
      postData.is_registered = vm.status;
      this.$http({
        method:"post",
        url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_list',
        data:vm.$qs.stringify(postData)
      })
        .then(function(response) {
          if(response.data.code == 200){
            vm.data2 = response.data.list.data;
            vm.totalPage = response.data.list.total;
            vm.perPage = response.data.list.per_page;
            vm.loading = false;
            vm.$Loading.finish();
          }else if(response.data.code == 202){
            vm.$Notice.info({
              title: '请先去微信管理页面扫码登录微信！'
            });
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
      vm.tagValue_search = [];
      vm.city = [];
      vm.vr = "";
      vm.status = "";
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
      this.$refs.c1.getPassDetailData(id);//子组件中的详情方法
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
          vm.getData2();
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
            vm.statusList = response.data.is_registered;
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
      if(vm.tagValue != ''){
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
      }else{
        vm.$Message.warning({
          content: '请先选择标签后再保存！',
          duration: 3
        });
      }
    },
    /*群发拜访相关start*/
    showVisitModal(){
      let vm = this;
      vm.clearVisit();
      if(vm.selections.length == 0){
        vm.$Notice.info({
          title: '请先选择需要群发拜访的医生！'
        });
      }else{
        vm.visit.addVisitModal = true;
      }
    },
    validator(){
      let vm = this;
      let texts = "";
      if(!vm.visit.visitDate){
        texts = '请选择拜访时间！';
      }else if(!vm.visit.visitPurpose){
        texts = '请选择拜访目的！';
      }else if(!vm.visit.visitContent){
        texts = '请填写拜访内容！';
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
    saveVisitRecord(){
      let vm = this;
      if(vm.validator()){
        let postData = {};
        let doctorIds = [];
        vm.selections.forEach(function (value, index, array) {
          doctorIds.push(value.id);
        });
        postData.visiting = vm.visit.type;
        postData.visit_time = vm.visit.visitDate;
        postData.purpose = vm.visit.visitPurpose;
        postData.content = vm.visit.visitContent;
        postData.doctors_id = doctorIds;
        vm.$refs.upload.fileList.forEach(function (ele,index,arr) {
          vm.imgNameList.push(ele.name);
        });
        postData.img = vm.imgNameList;
        this.$http({
          method:"post",
          url:vm.$commonTools.g_restUrl+'admin/visit/visit_edit',
          data:vm.$qs.stringify(postData)
        })
          .then(function(response) {
            if(response.data.code == 200){
              vm.$Notice.success({
                title: '记录提交成功！'
              });
            }else{
              vm.$Notice.error({
                title: '记录提交出错，请重试！'
              });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    clearVisit(){
      let vm = this;
      vm.$refs.date.handleClear();
      vm.$refs.purpose.clearSingleSelect();
      vm.$refs.upload.fileList.forEach(function (ele,index,arr) {
        vm.$refs.upload.fileList.splice(0,arr.length);
      });
      vm.imgNameList = [];
      vm.visit.visitContent = "";
    },
    /*上传start*/
    handleSuccess (res, file) {//图片上传成功
      file.url = res.path;
      file.name = res.filename;
    },
    handleView (item) {
      window.open(item.url);
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc:  file.name + ' 不是jpg或者png'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小超出限制',
        desc: file.name + '不能大于2M'
      });
    },
    handleBeforeUpload () {
      const check = this.visit.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传5个附件'
        });
      }
      return check;
    },
    /*上传end*/
    /*群发拜访相关end*/
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
    //导出excel
    exportRecord(){
      let vm= this;
      let postData = {};
      let excelData = [];
      postData.hospital = vm.hospitalName;
      postData.nickname = vm.nickName;
      postData.realname = vm.doctorName;
      postData.label = vm.tagValue_search;
      postData.citys = vm.city;
      postData.vr = vm.vr;
      postData.is_registered = vm.status;

      vm.excelFileds = {
        '编号':'numbers',
        '微信昵称':'nickname',
        '真实姓名':'realname',
        '手机号':'mobile',
        '邮箱':'email',
        '省':'province',
        '市':'city',
        '区':'county',
        '医院':'hospital',
        '医院科室':'department',
        '职称':'job',
        'VR':'vr',
        '拜访记录':'visit_total',
        '微课记录':'lesson_total',
        '标签':'label_name',
        '积分':'score',
        '注册时间':'reg_time'
      };
      this.$http({
        method:"post",
        url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_export',
        data:vm.$qs.stringify(postData)
      })
        .then(function(response) {
          if(response.data.code == 200){
            response.data.list.forEach(function (ele) {
              ele.reg_time = vm.$commonTools.formatDate(ele.reg_time);
            });
            vm.excelData = response.data.list;
          }else if(response.data.code == 202){
            vm.$Notice.warning({
              title: '下载无数据！'
            });
          }
        })
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
<style>
  .iconfont.icon-excel{
    font-size: 12px;
  }
</style>
