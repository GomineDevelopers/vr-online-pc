<template>
    <div class="miniClass">
      <div class="title" ref="title">微课管理</div>
      <div class="tableDiv" :style="{height:tableBgH+'px'}">
        <div class="buttonDiv" ref="buttonDiv">
          <Button icon="md-add" @click="addWk" v-if="btnLimit.add">添加微课记录</Button>
        </div>
        <Table ref="selection" :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
        <div class="pageDiv" ref="pageDiv">
          <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
        </div>
      </div>

      <Modal v-model="wk.addWKModal" title="添加微课记录" width="850" @on-ok="saveWkRecord">
        <Row type="flex" align="middle" class="modalRow">
          <Col span="2"><span class="necessary">*</span>微课标题</Col>
          <Col span="4"><Input v-model="wk.title"/></Col>
          <Col span="2" offset="1"><span class="necessary">*</span>微课编号</Col>
          <Col span="4"><Input v-model="wk.num"/></Col>
          <Col span="2" offset="1"><span class="necessary">*</span>微课时间</Col>
          <Col span="4">
            <DatePicker ref="datewk" type="datetime" v-model="wk.date" :value="wk.date" format="yyyy-MM-dd HH:mm"></DatePicker>
          </Col>
          <Col offset="1">创建者&emsp;<span v-text="wk.creater"></span></Col>
        </Row>
        <Row class="modalRow">
          <Col span="2">主讲医生</Col>
          <Col span="22">
            <Row class="modalRow" type="flex" align="middle">
              <Col span="1"><span class="necessary">*</span>姓名</Col>
              <Col span="5"><Input v-model="wk.doctor.name"/></Col>
              <Col span="2" offset="1"><span class="necessary">*</span>所属医院</Col>
              <Col span="6"><Input v-model="wk.doctor.hospital"/></Col>
              <Col span="1" offset="1"><span class="necessary">*</span>科室</Col>
              <Col span="5"><Input v-model="wk.doctor.department"/></Col>
            </Row>
            <Row class="modalRow" type="flex" align="middle">
              <Col span="1"><span class="necessary">*</span>职称</Col>
              <Col span="5"><Input v-model="wk.doctor.title"/></Col>
              <Col span="2" offset="1"><span class="necessary">*</span>身份证号</Col>
              <Col span="6"><Input v-model="wk.doctor.IDcard"/></Col>
            </Row>
          </Col>
        </Row>
        <Row class="modalRow">
          <Col span="2"><span class="necessary">*</span>微课简介</Col>
          <Col span="22">
            <Input v-model="wk.intro" type="textarea" :rows="4"/>
          </Col>
        </Row>
        <Row class="modalRow">
          <Col span="21" offset="2">
            <div class="upload-list" v-for="item in wk.uploadList">
              <template v-if="item.status === 'finished' && item.response">
                <img :src="item.url" v-if="item.response.file_type == 1">
                <a :href="item.url" v-if="item.response.file_type == 0"><Icon type="ios-document" size="32"/></a>
                <div class="upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item,'wk')"></Icon>
                </div>
              </template>
              <template v-if="item.status === 'finished'">
                <img :src="item.url" v-if="item.file_type == 1">
                <a :href="item.url" v-if="item.file_type == 0"><Icon type="ios-document" size="32"/></a>
                <div class="upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload ref="uploadwk" :show-upload-list="false" :default-file-list="wk.existImg"
                    :on-success="handleSuccesswk" multiple type="drag"
                    :action = serverImgUrl
                    style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-cloud-upload-outline" size="20"></Icon>
              </div>
            </Upload>
          </Col>
        </Row>
        <Row class="modalRow">
          <Col span="2">参会人员</Col>
          <Col span="22">
            <Table :columns="wk.columns" :data="wk.data2" :height="200"></Table>
          </Col>
        </Row>
        <Row>
          <Col span="24" offset="2"><Button type="dashed" @click="addAttend">+添加</Button></Col>
        </Row>
      </Modal>
      <Modal v-model="wk.viewWKModal" title="微课记录" width="850" :footer-hide="true">
        <Row type="flex" align="middle" class="modalRow">
          <Col span="2">微课标题</Col>
          <Col span="5"><span v-text="wk.title"></span></Col>
          <Col span="2">微课编号</Col>
          <Col span="5"><span v-text="wk.num"></span></Col>
          <Col span="2">微课时间</Col>
          <Col span="5"><span v-text="date_C"></span></Col>
          <Col >创建者&emsp;<span v-text="wk.creater"></span></Col>
        </Row>
        <Row class="modalRow">
          <Col span="2">主讲医生</Col>
          <Col span="22">
            <Table :columns="wk.doctor.columns" :data="wk.doctor.data"></Table>
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
            <Table :columns="wk.columns" :data="wk.data2" height="200"></Table>
          </Col>
        </Row>
        <Row class="modalRow">
          <Col span="2">上传时间</Col>
          <Col span="22"><span v-text="$commonTools.formatDate(wk.updateDate)"></span></Col>
        </Row>
      </Modal>
      <Modal v-model="wk.docList.doctorListModal" title="人员列表" @on-ok="saveAttend">
        <div v-for="(item,index) in wk.docList.groupList">
          <div class="groupCard">
            <Row>
              <Col span="22" class="tag_title"><span v-text="item.NickName"></span></Col>
              <Col span="2" class="tag_icon">
                <Icon type="ios-arrow-down" size="26" color="#a1a99b" v-show="item.isShow" @click="showTable(index,item)"/>
                <Icon type="ios-arrow-up" size="26" color="#a1a99b" v-show="!item.isShow" @click="showTable(index,item)"/>
              </Col>
            </Row>
            <Table v-if="item.isShow" border ref="selection" :columns="wk.docList.columns" :data="wk.docList.data"
                   height="300" :loading="wk.docList.loading"
                   @on-select="onSelect" @on-select-cancel="onSelectRemove" @on-select-all="selectAll" @on-select-all-cancel="cancelAll"></Table>
          </div>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
      name: "miniClass",
      data(){
          return{
            tableBgH:'',
            tableH:'',
            columns: [
              {title:'序号',type: 'index',width: 60,align: 'center'},
              {title: '微课标题',key: 'lesson_title',align: 'center'},
              {title: '时间',key: 'lesson_time',
                render:(h,params)=>{
                  let texts = '';
                  texts = this.$commonTools.formatDate(params.row.lesson_time);
                  return h('span',{
                    props:{},
                  },texts)
                }
              },
              {title: '参与人数',key: 'people_number',align: 'center'},
              {title: 'VR',key: 'vr',align: 'center'},
              {title: '操作',key: 'action',width: 150,align: 'center',
                render: (h, params) => {
                  return h('div', [
                    h("Tooltip",{props:{trigger:"hover",content:"资料",placement:"top"}},
                      [h("Icon", {
                        props: {
                          type: "icon iconfont icon-ziliao",
                        },
                        style: {
                          marginLeft: "5px",
                          color: "#4fb115",
                          display:this.btnLimit.detail?'inline':'none'
                        },
                        on: {
                          click: () => {
                            this.getWkDetail(params.row.id,'view');
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
                          display:this.btnLimit.update?'inline':'none'
                        },
                        on: {
                          click: () => {
                            this.getWkDetail(params.row.id,'edit');
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
                          display:this.btnLimit.del?'inline':'none'
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
            loading:true,
            isAdd : true,
            isScan:false,
            wkID:'',
            serverImgUrl:'http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/images/add_images',
            wk:{
              addWKModal:false,
              viewWKModal:false,
              title:'',
              num:'',
              creater:'',
              date:'',
              date1:'',
              salesman:'',
              intro:'',
              columns:[
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
              data2:[],
              members:[],
              matcherror:[],
              imgNameList:[],
              uploadList: [],
              existImg:[],
              doctor:{
                name:'',
                hospital:'',
                department:'',
                title:'',
                IDcard:'',
                columns:[
                  {title:'姓名',key:'speaker_name'},
                  {title:'所属医院',key:'speaker_hospital'},
                  {title:'科室',key:'speaker_section'},
                  {title:'职称',key:'speaker_position'},
                  {title:'身份证号',key:'speaker_idcard'}
                ],
                data:[],
              },
              updateDate:'',
              docList:{
                doctorListModal:false,
                columns: [
                  {type: 'selection',width: 60,align: 'center'},
                  {title: '微信备注',key: 'NickName'}
                ],
                data: [],
                selectedList:[],
                postList:[],
                groupList:[],
                loading:true,
              }
            },
            btnLimit:{
              add:false,
              del:false,
              update:false,
              detail:false
            }
          }
      },
      mounted() {
        this.wk.creater = window.sessionStorage.getItem("UserData_name");
        this.getBgHeight();
        this.getData();
        this.wk.uploadList = this.$refs.uploadwk.fileList;
        this.getLimitData();
      },
      computed:{
        date_C:function() {
          return this.$commonTools.formatDate(this.wk.date1);
        }
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
        },
        getBgHeight() {
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10) -18;
          vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10 * 2) - (vm.$refs.pageDiv.offsetHeight + 10 * 2) -30;
        },
        getData(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl + 'admin/lesson/lesson_Login',{
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
              vm.$Loading.error();
              console.log(error);
            });
        },
        getWkDetail(id,temp){//记录详情
          let vm = this;
          vm.wkID = id;
          if(temp == 'view'){
            vm.wk.viewWKModal = true;
            vm.wk.data2 = [];
          }else if(temp == 'edit'){
            vm.wk.addWKModal = true;
            vm.wk.imgNameList = [];
            vm.wk.data2 = [];
            vm.isAdd = false;
          }

          this.$http.get(vm.$commonTools.g_restUrl+ 'admin/lesson/lesson_detail',{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.wk.date = vm.$commonTools.formatDate(response.data.data.lesson_time);
                vm.wk.date1 = response.data.data.lesson_time;
                vm.wk.title = response.data.data.lesson_title;
                vm.wk.num = response.data.data.lesson_number;
                vm.wk.intro = response.data.data.content;
                if(temp == 'view'){
                  vm.wk.doctor.data = [];
                  vm.wk.doctor.data.push(response.data.data);
                  vm.wk.updateDate = response.data.data.update_time;
                }else{
                  vm.wk.doctor.name = response.data.data.speaker_name;
                  vm.wk.doctor.hospital = response.data.data.speaker_hospital;
                  vm.wk.doctor.department = response.data.data.speaker_section;
                  vm.wk.doctor.title = response.data.data.speaker_position;
                  vm.wk.doctor.IDcard = response.data.data.speaker_idcard;
                }

                vm.wk.existImg = response.data.data.img_list;
                vm.$nextTick(()=> { //赋值后马上更新
                  vm.wk.uploadList = vm.$refs.uploadwk.fileList;
                });
                if(response.data.data.doctors_list != undefined){
                  response.data.data.doctors_list.forEach(function (value,index,arr) {
                    value.group = response.data.data.group;
                  });
                }
                if(response.data.data.doctors_list == undefined){
                  vm.wk.data2 = [];
                }else{
                  vm.wk.data2 = response.data.data.doctors_list;
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changePage(curPage){
          this.curPage = curPage;
          this.getData();
        },
        addWk(){
          let vm = this;
          vm.wk.addWKModal = true;
          vm.clearwk();
          vm.isAdd = true;
        },
        validator(){
          let vm = this;
          let texts = "";
          let regID = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
          if(!vm.wk.title){
            texts = '请填写微课标题！';
          }else if(!vm.wk.num){
            texts = '请填写微课编号！';
          }else if(!vm.wk.date){
            texts = '请选择微课时间！';
          }else if(!(vm.wk.doctor.name && vm.wk.doctor.hospital &&
                   vm.wk.doctor.department&&vm.wk.doctor.title && vm.wk.doctor.IDcard)){
            texts = '请完善主讲医生内容！';
          }else if(vm.wk.doctor.IDcard && !regID.test(vm.wk.doctor.IDcard)){
            texts = '身份证号码格式不正确！';
          }else if(!vm.wk.intro){
            texts = '请填写微课简介！';
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
        saveWkRecord(){
          let vm = this;
          if(vm.validator()){
            let postData = {};
            vm.wk.members = [];
            vm.wk.matcherror = [];
            if(vm.isAdd){
              postData.id = "";
            }else{
              postData.id = vm.wkID;
            }

            postData.lesson_title = vm.wk.title;
            postData.lesson_time = vm.wk.date;
            postData.lesson_number = vm.wk.num;
            postData.content = vm.wk.intro;
            postData.speaker_name = vm.wk.doctor.name;
            postData.speaker_hospital = vm.wk.doctor.hospital;
            postData.speaker_section = vm.wk.doctor.department;
            postData.speaker_position = vm.wk.doctor.title;
            postData.speaker_idcard = vm.wk.doctor.IDcard;
            if(vm.$refs.uploadwk.fileList.length>0){
              vm.$refs.uploadwk.fileList.forEach(function (ele,index,arr) {
                if(ele.response == undefined){//已上传的图片
                  vm.wk.imgNameList.push(ele.filename);
                }else{//新上传的图片
                  vm.wk.imgNameList.push(ele.name);
                }
              });
            }
            postData.img = vm.wk.imgNameList;

            vm.wk.data2.forEach(function (value, index, array) {
              if(value.uid == 0){
                vm.wk.matcherror.push(value.nickname);
              }else{
                vm.wk.members.push(value.uid);
              }
            });

            postData.participate = vm.wk.members;
            postData.matcherror = vm.wk.matcherror;
            if(vm.wk.data2.length>0){
              postData.group = vm.wk.data2[0].group;
            }else {
              postData.group = "";
            }

            this.$http({
              method:"post",
              url:vm.$commonTools.g_restUrl+'admin/lesson/lesson_edit',
              data:vm.$qs.stringify(postData)
            })
              .then(function(response) {
                if(response.data.code == 200){
                  vm.$Notice.success({
                    title: '记录提交成功!'
                  });
                  vm.getData();
                }else{
                  vm.$Notice.error({
                    title: '记录提交出错，请重试!'
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }

        },
        handleSuccesswk(res, file){
          file.url = res.path;
          file.name = res.filename;
        },
        handleView (item) {
          window.open(item.url);
        },
        handleRemove (file) {
          const fileList = this.$refs.uploadwk.fileList;
          this.$refs.uploadwk.fileList.splice(fileList.indexOf(file), 1);
        },
        clearwk(){
          let vm = this;
          vm.wk.title = "";
          vm.wk.num = "";
          vm.wk.intro = "";
          vm.wk.title = "";
          vm.wk.doctor.name = "",
          vm.wk.doctor.hospital = "";
          vm.wk.doctor.department = "";
          vm.wk.doctor.title = "";
          vm.wk.doctor.IDcard = "";
          vm.$refs.datewk.handleClear();
          vm.wk.imgNameList = [];
          vm.$refs.uploadwk.fileList.forEach(function (ele,index,arr) {
            vm.$refs.uploadwk.fileList.splice(0,arr.length);
          });
          vm.wk.data2 = [];
          vm.wk.docList.selectedList = [];
        },
        del(id){
          let vm = this;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              this.$http.get(vm.$commonTools.g_restUrl+"admin/lesson/lesson_del",{
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
        addAttend(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl +'admin/wxbot/scanState',{
            params: {
              bot_id:window.sessionStorage.getItem("QR_id")
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.$http.get('http://icampaign.com.cn:9080/api/get_group_list/',{
                  params: {
                    bot_id:window.sessionStorage.getItem("QR_id")
                  }
                })
                  .then(function(response) {
                    if(response.data.code == 200){//请求成功200
                      if(response.data.data.group_list.length > 0){//请求成功，但是第一次有可能无数据
                        vm.wk.docList.doctorListModal = true;//打开Modal
                        response.data.data.group_list.forEach(function (ele,index,arr) {
                          if(vm.wk.data2.length != 0){
                            if(vm.wk.data2[0].group == ele.NickName){//编辑的时候默认展开已选择的群
                              ele.isShow = true;
                              vm.$http.get('http://icampaign.com.cn:9080/api/get_group_members/',{
                                params: {
                                  bot_id:window.sessionStorage.getItem("QR_id")
                                }
                              })
                                .then(function(response) {
                                  if(response.data.code == 200){
                                    vm.wk.docList.loading = false;
                                    for(var key in response.data.data.group_members){
                                      if(key == ele.UserName){
                                        vm.wk.docList.data = response.data.data.group_members[key];
                                      }
                                    }
                                  }
                                  vm.wk.docList.data.forEach(function (value, index, array) {//将群名放入群成员中,默认选中已存在的
                                    value.groupName = ele.NickName;
                                    vm.wk.data2.forEach(function (ele,index,array) {
                                      if(ele.nickname == value.NickName){
                                        value._checked = true;
                                      }
                                    });
                                  });
                                })
                                .catch(function(error) {
                                  console.log(error);
                                });
                            }else{
                              ele.isShow = false;
                            }
                          }
                          else{//第一次加载群列表默认不展开
                            ele.isShow = false;
                          }
                        });
                        vm.wk.docList.groupList = response.data.data.group_list;
                      }else{
                        vm.$Notice.info({
                          title: '无数据，请再次点击添加!'
                        });
                      }
                    }
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              }else{
                vm.$Notice.info({
                  title: '请到微信管理页面先扫码登录!'
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });


        },
        onSelect(selection,row){
          this.wk.docList.selectedList = selection;
        },
        onSelectRemove(selection,row){
          this.wk.docList.selectedList = selection;
        },
        selectAll(selection){
          this.wk.docList.selectedList = selection;
        },
        cancelAll(selection){
          this.wk.docList.selectedList = selection;
        },
        saveAttend(){
          let vm = this;
          vm.wk.docList.postList = [];
          vm.wk.docList.selectedList.forEach(function (ele,index,array) {
            vm.wk.docList.postList.push(ele.NickName+'￥'+ele.DisplayName);
          });
          let postData = {};
          postData.member = vm.wk.docList.postList;
          postData.group = vm.wk.docList.selectedList[0].groupName;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/doctors/doctors_match',
            data:vm.$qs.stringify(postData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.wk.data2 = response.data.list;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        showTable(index_g,item_g){//点击展开获取群成员列表
          let vm = this;
          vm.wk.docList.groupList.forEach(function (value, index, array) {
            value.isShow = false;
            if(index_g == index){
              value.isShow = !item_g.isShow;
            }
          });
          this.$http.get('http://icampaign.com.cn:9080/api/get_group_members/',{
            params: {
              bot_id:window.sessionStorage.getItem("QR_id")
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.wk.docList.loading = false;
                for(var key in response.data.data.group_members){
                  if(key == item_g.UserName){
                    vm.wk.docList.data = response.data.data.group_members[key];
                  }
                }
              }
              vm.wk.docList.data.forEach(function (value, index, array) {//将群名放入群成员中
                value.groupName = item_g.NickName;
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        },
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
    padding: 2vh;
  }

  .buttonDiv {
    text-align: right;
    margin-bottom: 10px;
  }

  .pageDiv {
    margin: 10px;
    text-align: right;
  }

  .modalRow{
    margin-bottom: 10px;
  }

  .groupCard{
    padding: 5px 0;
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
