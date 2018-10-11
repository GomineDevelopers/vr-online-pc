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
            <Col span="8">微信号：<span class="spanFont" v-text="detailPassData.wechat"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">拜访记录：<span class="spanFont" v-text="detailPassData.visit_total"></span></Col>
            <Col span="8">微课记录：<span class="spanFont" v-text="detailPassData.lesson_total"></span></Col>
            <Col span="8">累计积分：<span class="spanFont" v-text="detailPassData.score"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">互动记录：<span class="spanFont" v-text="detailPassData.interactive_total"></span></Col>
            <Col span="8">负责销售：<span class="spanFont" v-text="detailPassData.sales"></span></Col>
          </Row>
          <Row>
            <Col span="8">标签：<span class="spanFont">老中医 全国十佳 省医院</span></Col>
          </Row>
        </Col>
        <Col span="6"><img src="../../static/images/1.png" style="height: 170px;"></Col>
      </Row>
    </div>
    <div class="doctor_detail_tab">
      <Tabs value="1" @on-click="tabChange" :animated="false">
        <div class="buttonDiv" ref="buttonDiv">
          <Button icon="md-albums" @click="addRecord">新增拜访记录</Button>
        </div>
        <TabPane label="拜访记录" name="1">
          <visit-record ref="c2" :postCommonH="commonHeight" :tabType="type" :doctorId="doctorId"
                        @getRecordDetailC="getRecordDetail" v-if="commonHeight && type == 1"></visit-record>
        </TabPane>
        <TabPane label="微课记录" name="2">
          <visit-record :postCommonH="commonHeight" :tabType="type" v-if="commonHeight && type == 2"></visit-record>
        </TabPane>
        <TabPane label="互动记录" name="3">互动记录</TabPane>
        <TabPane label="积分记录" name="4">积分记录</TabPane>
      </Tabs>
    </div>

    <Modal v-model="addVisitModal" title="添加拜访记录" draggable @on-ok="saveVisitRecord">
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访方式</Col>
        <Col span="9">
          <Select v-model="visitType" clearable ref="type">
            <Option v-for="item in visitTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">拜访时间</Col>
        <Col span="8">
          <DatePicker ref="date" type="datetime" v-model="visitDate" :value="visitDate" format="yyyy-MM-dd HH:mm" :options="optionsDate" placeholder="请选择"></DatePicker>
        </Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访目的</Col>
        <Col span="9">
          <Select v-model="visitPurpose" clearable ref="purpose">
            <Option v-for="item in visitTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访内容</Col>
        <Col span="21">
          <Input v-model="visitContent" type="textarea" :rows="4"/>
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

    <Modal v-model="viewVisitModal" title="拜访记录详情" :footer-hide="true">
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访方式：</Col>
        <Col span="9"><span v-text="visitType"></span></Col>
        <Col span="3" offset="1">拜访时间：</Col>
        <Col span="8"><span v-text="visitDate"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访目的：</Col>
        <Col span="9"><span v-text="visitPurpose"></span></Col>
      </Row>
      <Row class="modalRow" type="flex" align="middle">
        <Col span="3">拜访内容：</Col>
        <Col span="21"><span v-text="visitContent"></span></Col>
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

  </div>
</template>

<script>
  import VisitRecord from '@/components/visitrecord.vue'
    export default {
      name: "DoctorPassDetail",
      data(){
        return {
          doctorId:'',
          recordId:'',
          isEdit:false,//区别是新增还是编辑
          commonHeight:'',
          detailPassData:'',
          type:1,
          addVisitModal:false,
          /*图片上传相关start*/
          serverImgUrl:'http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/images/add_images',
          imgNameList:[],
          uploadList: [],
          existImg:[],
          /*图片上传相关end*/
          visitType:'',
          visitTypeList:[{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
          visitDate:'',
          optionsDate: {
            disabledDate (date) {
              return date && date.valueOf() > Date.now();
            }
          },
          visitPurpose:'',
          visitContent:'',
          viewVisitModal:false,

        }
      },
      components: {
        'visit-record': VisitRecord
      },
      props:{},
      mounted(){
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
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        addRecord(){
          let vm = this;
          vm.isEdit = false;
          vm.addVisitModal = true;
          vm.clear();
        },
        getRecordDetail(id,temp){//记录详情
          let vm = this;
          vm.recordId = id;
          if(temp == 'view'){
            vm.viewVisitModal = true;
          }else if(temp == 'edit'){
            vm.addVisitModal = true;
            vm.isEdit = true;
            vm.imgNameList = [];
          }
          this.$http.get(vm.$commonTools.g_restUrl+'admin/visit/visit_detail',{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.visitDate = vm.$commonTools.formatDate(response.data.data.visit_time);
                vm.visitType = response.data.data.visiting;
                vm.visitPurpose = response.data.data.purpose;
                vm.visitContent = response.data.data.content;
                vm.existImg = response.data.data.img_list;
                vm.$nextTick(()=> { //赋值后马上更新
                  vm.uploadList = vm.$refs.upload.fileList;
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        saveVisitRecord(){
          let vm = this;
          let postData = {};
          postData.visiting = vm.visitType;
          postData.visit_time = vm.visitDate;
          postData.purpose = vm.visitPurpose;
          postData.content = vm.visitContent;
          if(vm.isEdit){
            postData.id = vm.recordId;
          }else{
            postData.doctors_id = vm.doctorId;
          }
          vm.$refs.upload.fileList.forEach(function (ele,index,arr) {
            vm.imgNameList.push(ele.filename);
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
        },
        /*图片上传start*/
        handleSuccess (res, file) {//图片上传成功
          file.url = res.path;
          file.name = res.filename;
          this.imgNameList.push(res.filename);
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
              title: '最多只能上传5张图片'
            });
          }
          return check;
        },
        /*图片上传end*/
        clear(){
          let vm = this;
          vm.$refs.type.clearSingleSelect();
          vm.$refs.date.handleClear();
          vm.$refs.purpose.clearSingleSelect();
          vm.$refs.upload.fileList.forEach(function (ele,index,arr) {
            vm.$refs.upload.fileList.splice(0,arr.length);
          });
          vm.imgNameList = [];
          vm.visitContent = "";
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

  .modalRow{
    margin-bottom: 10px;
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
