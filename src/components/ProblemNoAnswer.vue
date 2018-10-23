<template>
  <div class="problem_no_answered">
    <Table :columns="columns" :data="data" :height="tableH"></Table>
    <div class="pageDiv" ref="pageDiv">
      <Page :total="totalPages" :current="curPage" show-elevator show-total
            :loading="loading" @on-change="changePage"/>
    </div>

    <Modal v-model="detailModel" :footer-hide="true">
      <Row class="row_font">
        <Col span="8">
          <span class="title_text">咨询人：</span>
          <span v-text="detailData.realname"></span>
        </Col>
        <Col span="8">
          <span class="title_text">时间：</span>
          <span v-text="$commonTools.formatDate(detailData.create_time) "></span>
        </Col>
        <Col span="8">
          <span class="title_text">状态：</span>
          <Tag color="red" v-if="detailData.status == 0">未回答</Tag>
          <Tag color="red" v-if="detailData.status == 1">已回答</Tag>
        </Col>
      </Row>
      <div class="bottom_border1">
        <Tag color="primary">疑&nbsp;难</Tag>
      </div>
      <div class="bottom_border2" v-text="detailData.problem"></div>
    </Modal>

    <Modal v-model="addModel" ok-text="确定回复" @on-ok="save(detailData.id)">
      <Row class="row_font">
        <Col span="8">
          <span class="title_text">咨询人：</span>
          <span v-text="detailData.realname"></span>
        </Col>
        <Col span="8">
          <span class="title_text">时间：</span>
          <span v-text="$commonTools.formatDate(detailData.create_time) "></span>
        </Col>
        <Col span="8">
          <span class="title_text">状态：</span>
          <Tag color="red" v-if="detailData.status == 0">未回答</Tag>
          <Tag color="red" v-if="detailData.status == 1">已回答</Tag>
        </Col>
      </Row>
      <div class="bottom_border1">
        <Tag color="primary">疑&nbsp;难</Tag>
      </div>
      <div class="bottom_border3" v-text="detailData.problem"></div>
      <div class="bottom_border1">
        <Tag color="success">回&nbsp;答</Tag>
      </div>
      <div class="bottom_border3">
        <Input type="textarea" v-model="answer" placeholder="请输入您的解答~"/>
      </div>
    </Modal>
  </div>
</template>

<script>
    export default {
      name: "ProblemNoAnswer",
      data(){
        return{
          curPage:1,
          totalPages:0,
          tableH:'',
          detailModel:false,
          addModel:false,
          detailData:{},
          answer:'',
          keyword:'',
          data: [],
          columns: [
            {title:'序号',type: 'index',width: 60,align: 'center'},
            {title: '咨询人',key: 'realname',width:120,align: 'center'},
            {title: '疑难详情 ',key:'problem',
              render:(h,params) => {
                let texts = params.row.problem;
                return h('div',{
                  style:{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },texts)
              }},
            {title: '状态',key: 'status',align: 'center',width: 120,
              render:(h,params) => {
                return h('div',[
                  h("Tag",{
                    props:{
                      color:'red'
                    }
                  },'未回答')
                ])
              }
            },
            {title: '咨询时间',key: 'create_time',width: 150,
              render:(h,params)=>{
                let texts = '';
                if(params.row.create_time == null){
                  texts = '-';
                }else{
                  texts = this.$commonTools.formatDate(params.row.create_time);
                }
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {title: '操作',key: 'action',width: 200,align: 'center',
              render: (h, params) => {
                return h('div', [
                  h("Tooltip",{props:{trigger:"hover",content:"详情", placement:"top"}},
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
                        this.goDetail(params.row.id);
                      }
                    }
                  })]),
                  h("Tooltip",{props:{trigger:"hover",content:"删除", placement:"top"}},
                    [h('Icon', {
                    props: {
                      type: "icon iconfont icon-shanchu",
                    },
                    style: {
                      color: "#4fb115",
                      marginLeft: "5px",
                    },
                    on: {
                      click: () => {
                        this.del(params.row.id);
                      }
                    }
                  })]),
                  h('Button',{
                    props:{
                      type:'info',
                      size:'small'
                    },
                    style:{
                      marginLeft:'10px',
                      backgroundColor: "#ff9e0d",
                      borderColor:"#ff9e0d"
                    },
                    on:{
                      click:() =>{
                        this.goAnswer(params.row.id);
                      }
                    }
                  },'去回答')
                ]);
              }
            }
          ],
          loading:true
        }
      },
      props:{
        postCommonH:'',
        tabType:''
      },
      mounted(){
        this.getTableH();
        this.getNoAnData();
      },
      methods:{
        getTableH(){
          let vm = this;
          vm.tableH = document.documentElement.clientHeight - 60-24*2 - vm.postCommonH - (vm.$refs.pageDiv.offsetHeight + 10);
        },
        changePage(curPage){
          this.curPage = curPage;
          this.getNoAnData();
        },
        getNoAnData(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/advisory/advisory_list',{
            params: {
              type : vm.tabType,
              page:vm.curPage,
              keyword:vm.keyword
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.data = response.data.list.data;
                vm.totalPages = response.data.list.total;
                vm.loading = false;
                vm.$Loading.finish();
              }
            })
            .catch(function(error) {
              vm.$Loading.error();
              console.log(error);
            });
        },
        getDetailData(id){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/advisory/advisory_detail',{
            params: {
              id:id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.detailData = response.data.data;
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
        goAnswer(id){
          this.getDetailData(id);
          this.addModel = true;
        },
        save(id){
          let vm = this;
          let postData = {};
          postData.reply = vm.answer;
          postData.id = id;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/advisory/advisory_edit',
            data:vm.$qs.stringify(postData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.$Notice.success({
                  title: '回复成功！'
                });
                vm.getNoAnData();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        del(id){
          let vm = this;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              this.$http.get(vm.$commonTools.g_restUrl+"admin/advisory/advisory_del",{
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
                    vm.getNoAnData();
                  }

                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          });
        },
        searchChild(key){
          this.keyword = key;
          this.getNoAnData();
        }
      }
    }
</script>

<style scoped>
  .pageDiv{
    margin: 10px 10px 0 10px;
    text-align: right;
  }

  .row_font{
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin: 0 0 10px 0;
  }

  .title_text{
    color:#8d8d8d;
    font-weight: 500;
  }

  .bottom_border1{
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 0;
    font-size: 16px;
    color:#8d8d8d;;
  }

  .bottom_border2{
    padding: 15px 0;
    font-size: 14px;
  }

  .bottom_border3{
    border-bottom: 1px solid #e0e0e0;
    padding: 15px 0;
    font-size: 14px;
  }
</style>
