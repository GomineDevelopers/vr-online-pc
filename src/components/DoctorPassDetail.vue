<template>
  <div class="doctor_detail">
    <div class="doctor_detail_title" ref="title">医生管理</div>
    <div class="doctor_detail_card" ref="card">
      <Row>
        <Col span="18">
          <Row class="doctor_detail_rowBottom">
            <Col span="8">姓名：<span class="spanFont" v-text="detailPassData.realname"></span></Col>
            <Col span="8">编号：<span class="spanFont" v-text="detailPassData.numbers"></span></Col>
            <Col span="8">性别：
              <span class="spanFont" v-if="detailPassData.gender == 2">女</span>
              <span class="spanFont" v-if="detailPassData.gender == 1">男</span>
              <span class="spanFont" v-if="detailPassData.gender == 0">未知</span>
            </Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">医院：<span class="spanFont" v-text="detailPassData.hospital"></span></Col>
            <Col span="8">科室：<span class="spanFont" v-text="detailPassData.department"></span></Col>
            <Col span="8">职称：<span class="spanFont" v-text="detailPassData.job"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">手机号：<span class="spanFont" v-text="detailPassData.mobile"></span></Col>
            <Col span="8">邮箱：<span class="spanFont" v-text="detailPassData.email"></span></Col>
            <Col span="8">负责VR：<span class="spanFont" v-text="detailPassData.sales"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">拜访记录：<span class="spanFont" v-text="detailPassData.visit_total"></span></Col>
            <Col span="8">微课记录：<span class="spanFont" v-text="detailPassData.lesson_total"></span></Col>
            <Col span="8">累计积分：<span class="spanFont" v-text="detailPassData.score"></span></Col>
          </Row>
          <Row>
            <Col span="22">标签：
              <Tag v-for="item in detailPassData.label_name" :key="item.id" :name="item.name"
                   closable @on-close="delLabel(item.id)" color="primary">{{item.name}}</Tag>
              <Button icon="ios-add" type="dashed" size="small" @click="showLabel" v-if="btnLimit_F.addTag">添加标签</Button>
            </Col>
          </Row>
        </Col>
        <Col span="6"><img :src="detailPassData.avatar" style="height: 140px;"></Col>
      </Row>
    </div>
    <div class="doctor_detail_tab">
      <Tabs v-model="selectedTab" @on-click="tabChange" :animated="false">
        <TabPane label="拜访记录" name="1">
          <div class="buttonDiv" ref="buttonDiv">
            <Button icon="md-albums" @click="addRecord('visit')" v-if="btnLimit_F.add">新增拜访记录</Button>
          </div>
          <visit-record ref="c2" :postCommonH="commonHeight" :tabType="type" :doctorId_F="doctorId"
                        @getRecordDetailC="getRecordDetail" v-if="commonHeight" :btnLimit_FF="btnLimit_F"></visit-record>
        </TabPane>
        <TabPane label="微课记录" name="2">
          <visit-record ref="c2" :postCommonH="commonHeight" :tabType="type" :doctorId_F="doctorId"
                        @getRecordDetailC="getRecordDetail" v-if="commonHeight && type == 2"></visit-record>
        </TabPane>
        <TabPane label="积分记录" name="3">
          <visit-record :postCommonH="commonHeight" :tabType="type" :doctorId_F="doctorId"
                        v-if="commonHeight && type == 3"></visit-record>
        </TabPane>
      </Tabs>
    </div>

    <!--拜访记录的对话框start-->
    <Modal v-model="visit.addVisitModal" title="添加拜访记录" @on-ok="saveVisitRecord">
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3"><span class="necessary">*</span>拜访方式</Col>
        <Col span="9">
          <Select v-model="visit.visitType" clearable ref="type">
            <Option v-for="item in visit.visitTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
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
          <div class="upload-list" v-for="item in uploadList" ref="a">
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
          <Upload ref="upload" :show-upload-list="false" :default-file-list="existImg"
                  :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048"
                  :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload" multiple type="drag"
                  :action = serverImgUrl
                  style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="visit.viewVisitModal" title="拜访记录详情" :footer-hide="true">
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访方式：</Col>
        <Col span="9"><span v-text="visit.visitType"></span></Col>
        <Col span="3" offset="1">拜访时间：</Col>
        <Col span="8"><span v-text="visitDate_C"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访目的：</Col>
        <Col span="9"><span v-text="visit.visitPurpose"></span></Col>
        <Col span="3" offset="1">上传时间：</Col>
        <Col span="8"><span v-text="visitUpdateDate_C"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访内容：</Col>
        <Col span="21"><span v-text="visit.visitContent"></span></Col>
      </Row>
      <Row>
        <Col span="21" offset="3">
          <div class="upload-list" v-for="item in existImg">
            <template v-if="existImg.length > 0">
              <img :src="item.url">
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              </div>
            </template>
          </div>
        </Col>
      </Row>
    </Modal>
    <!--拜访记录的对话框end-->

    <!--微课记录的对话框start-->
    <Modal v-model="wk.viewWKModal" title="微课记录" width="850" :footer-hide="true">
      <Row type="flex" align="middle" class="modalRow">
        <Col span="2">微课标题</Col>
        <Col span="5"><span v-text="wk.title"></span></Col>
        <Col span="2">微课编号</Col>
        <Col span="5"><span v-text="wk.num"></span></Col>
        <Col span="2">微课时间</Col>
        <Col span="5"><span v-text="wkUpdateDate_C"></span></Col>
        <Col >创建者&emsp;<span v-text="wk.creater"></span></Col>
      </Row>
      <Row class="modalRow">
        <Col span="2">主讲医生</Col>
        <Col span="22">
          <Table :columns="wk.columns1" :data="wk.data1"></Table>
        </Col>
      </Row>
      <Row class="modalRow">
        <Col span="2">微课简介</Col>
        <Col span="22"><div class="introDiv" v-text="wk.intro"></div></Col>
      </Row>
      <Row class="modalRow">
        <Col span="21" offset="2">
          <div class="upload-list" v-for="item in wk.existImg">
            <template v-if="wk.existImg.length > 0">
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
          <Table :columns="wk.columns2" :data="wk.data2" height="200"></Table>
        </Col>
      </Row>
    </Modal>
    <!--微课记录的对话框end-->

    <!--给医生新增标签-->
    <Modal v-model="labelModel" title="请选择您需要添加的标签" :mask-closable="false" @on-ok="addLabel"  width="350px">
      <Cascader :data="tagData" v-model="tagValue"></Cascader>
    </Modal>

  </div>
</template>

<script>
  import VisitRecord from '@/components/visitrecord.vue'
    export default {
      name: "DoctorPassDetail",
      data(){
        return {
          selectedTab:'1',
          doctorId:'',
          recordId:'',
          commonHeight:'',
          detailPassData:'',
          type:1,
          labelModel:false,
          tagData:[],
          tagValue:[],
          /*图片上传相关start*/
          serverImgUrl:'http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/images/add_images',
          imgNameList:[],
          uploadList: [],
          existImg:[],
          /*图片上传相关end*/
          visit:{
            visitType:'',
            visitTypeList:[{value: '微信',label: '微信'},{value: '电话',label: '电话'},{value: '短信',label: '短信'},{value: '邮件',label: '邮件'},{value: '群发',label: '群发'},{value: '其他',label: '其他'}],
            visitPurposeList:[{value: '破冰',label: '破冰'},{value: '转化',label: '转化'},{value: '提升',label: '提升'},{value: '调研',label: '调研'},{value: '活动',label: '活动'},{value: '兑奖',label: '兑奖'},{value: '其他',label: '其他'}],
            visitDate:'',
            visitDate1:'',
            updateDate:'',
            optionsDate: {
              disabledDate (date) {
                return date && date.valueOf() > Date.now();
              }
            },
            addVisitModal:false,
            visitPurpose:'',
            visitContent:'',
            viewVisitModal:false,
            isEdit:false,//区别是新增还是编辑
          },
          wk:{
            addWKModal:false,
            viewWKModal:false,
            title:'',
            num:'',
            date:'',
            salesman:'',
            creater:'',
            intro:'',
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
                  if(params.row.realname == "" || params.row.uid == 0){
                    texts = params.row.nickname;
                  }else{
                    texts = params.row.realname;
                  }
                  return h('span',{
                    props:{},
                  },texts)
                }
              },
              {title:'所属医院',key:'hospital'},
              {title:'科室',key:'department'},
              {title:'昵称',key:'nickname'},
              {title:'城市',key:'citys'},
              {title:'成绩',key:'mark'}
            ],
            data1:[],
            data2:[],
            existImg:[],
            updateDate:''
          },
        }
      },
      components: {
        'visit-record': VisitRecord
      },
      props:{
        btnLimit_F:''
      },
      computed:{
        visitDate_C:function() {
          return this.$commonTools.formatDate(this.visit.visitDate1);
        },
        visitUpdateDate_C:function() {
          return this.$commonTools.formatDate(this.visit.updateDate);
        },
        wkUpdateDate_C:function() {
          return this.$commonTools.formatDate(this.wk.updateDate);
        }
      },
      mounted(){
        this.wk.creater = window.sessionStorage.getItem("UserData_name");
        this.uploadList = this.$refs.upload.fileList;
      },
      methods:{
        getCommonHeight(){
          let vm = this;
          vm.commonHeight = (vm.$refs.title.offsetHeight+10)+ (vm.$refs.card.offsetHeight+30+10);
        },
        tabChange(name){
          let vm = this;
          vm.type = name;
        },
        getPassDetailData(id){//医生详情card
          let vm =  this;
          vm.doctorId = id;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/doctors/dectors_detail',{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.detailPassData = response.data.data;
                vm.getCommonHeight();

                //每次打开modal都从tab1开始
                vm.selectedTab = '1';
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        showLabel(){
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
          vm.labelModel = true;
        },
        addLabel(){
          let vm = this;
          let postData = {};
          let postId = [];
          postId.push(vm.doctorId);
          postData.member = postId;
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
                vm.getPassDetailData(vm.doctorId);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        delLabel(id){
          let vm = this;
          let postData = {};
          postData.doctors_id  = vm.doctorId;
          postData.label = id;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              this.$http({
                method:"post",
                url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_dellabel',
                data:vm.$qs.stringify(postData)
              })
                .then(function(response) {
                  if(response.data.code == 200){
                    vm.$Notice.success({
                      title: '删除成功！'
                    });
                    vm.getPassDetailData(vm.doctorId);
                  }

                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          });
        },
        addRecord(temp){
          let vm = this;
          if(temp == 'visit'){
            vm.visit.isEdit = false;
            vm.visit.addVisitModal = true;
            vm.clear();
          }else if(temp == 'wk'){
            vm.wk.addWKModal = true;
            vm.clearwk();
          }
        },
        getRecordDetail(id,temp1,temp2){//记录详情
          let vm = this;
          let url = '';
          vm.recordId = id;
          if(temp1 == 'visit'){
            if(temp2 == 'view'){
              vm.visit.viewVisitModal = true;
            }else if(temp2 == 'edit'){
              vm.visit.addVisitModal = true;
              vm.visit.isEdit = true;
              vm.imgNameList = [];
            }
            url = 'admin/visit/visit_detail';
          }else if(temp1 == 'wk'){
            if(temp2 == 'view'){
              vm.wk.viewWKModal = true;
            }
            url = 'admin/lesson/lesson_detail';
          }

          this.$http.get(vm.$commonTools.g_restUrl+ url,{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                if(temp1 == 'visit'){
                  vm.visit.visitDate = vm.$commonTools.formatDate(response.data.data.visit_time);
                  vm.visit.visitDate1 = response.data.data.visit_time;
                  vm.visit.updateDate = response.data.data.update_time;
                  vm.visit.visitType = response.data.data.visiting;
                  vm.visit.visitPurpose = response.data.data.purpose;
                  vm.visit.visitContent = response.data.data.content;
                  vm.existImg = response.data.data.img_list;
                  vm.$nextTick(()=> { //赋值后马上更新
                    vm.uploadList = vm.$refs.upload.fileList;
                  });
                }else if(temp1 == 'wk'){
                  vm.wk.date = response.data.data.lesson_time;
                  vm.wk.title = response.data.data.lesson_title;
                  vm.wk.num = response.data.data.lesson_number;
                  vm.wk.intro = response.data.data.content;
                  vm.wk.existImg = response.data.data.img_list;
                  vm.wk.data1 = [];
                  vm.wk.data1.push(response.data.data);
                  vm.wk.updateDate = response.data.data.update_time;
                  vm.wk.data2 = response.data.data.doctors_list;
                }

              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        validator(){
          let vm = this;
          let texts = "";
          if(!vm.visit.visitType){
            texts = '请选择拜访方式！';
          }else if(!vm.visit.visitDate){
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
            postData.visiting = vm.visit.visitType;
            postData.visit_time = vm.visit.visitDate;
            postData.purpose = vm.visit.visitPurpose;
            postData.content = vm.visit.visitContent;
            if(vm.visit.isEdit){
              postData.id = vm.recordId;
            }else{
              postData.doctors_id = vm.doctorId;
            }
            vm.$refs.upload.fileList.forEach(function (ele,index,arr) {
              if(ele.response == undefined){//已上传的图片
                vm.imgNameList.push(ele.filename);
              }else{//新上传的图片
                vm.imgNameList.push(ele.name);
              }
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
                  vm.$refs.c2.getRecordList();
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
          const check = this.uploadList.length < 5;
          if (!check) {
            this.$Notice.warning({
              title: '最多只能上传5个附件'
            });
          }
          return check;
        },
        /*上传end*/
        clear(){
          let vm = this;
          vm.$refs.type.clearSingleSelect();
          vm.$refs.date.handleClear();
          vm.$refs.purpose.clearSingleSelect();
          vm.$refs.upload.fileList.forEach(function (ele,index,arr) {
            vm.$refs.upload.fileList.splice(0,arr.length);
          });
          vm.imgNameList = [];
          vm.visit.visitContent = "";
        }
      }
    }
</script>

<style scoped>
  .doctor_detail_title{
    color: #adb3a8;
    font-size: 1.25rem;
    margin-bottom: 10px;
  }

  .doctor_detail_card{
    background-color: #fff;
    padding: 30px 30px 10px 30px;
    font-size: 0.88rem;
    color:#a7a7a7;
  }

  .doctor_detail_rowBottom{
    margin-bottom: 7px;
  }

  .spanFont{
    color:#333;
    font-weight: 600;
  }

  .doctor_detail_tab{
    margin-top:10px;
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
