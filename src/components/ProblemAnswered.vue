<template>
  <div class="problem_answered">
    <Table :columns="columns" :data="data" :height="tableH"></Table>
    <div class="pageDiv" ref="pageDiv">
      <Page :total="totalPage" :current="curPage" show-elevator @on-change="changePage"/>
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
          <Tag color="green" v-if="detailData.status == 1">已回答</Tag>
        </Col>
      </Row>
      <Row class="row_font">
        <Col span="8">
          <span class="title_text">回答人：</span>
          <span v-text="detailData.reply_username"></span>
        </Col>
        <Col span="8">
          <span class="title_text">时间：</span>
          <span v-text="$commonTools.formatDate(detailData.reply_time) "></span>
        </Col>
        <Col span="8"></Col>
      </Row>
      <div class="bottom_border1">
        <Tag color="primary">疑&nbsp;难</Tag>
      </div>
      <div class="bottom_border2" v-text="detailData.problem"></div>
      <div class="bottom_border1">
        <Tag color="success">回&nbsp;答</Tag>
      </div>
      <div class="bottom_border3" v-text="detailData.reply"></div>
    </Modal>
  </div>
</template>

<script>
    export default {
      name: "ProblemAnswered",
      data(){
        return{
          tableH:'',
          columns: [
            {title:'序号',type: 'index',width: 60,align: 'center'},
            {title: '咨询人',key: 'realname',width:120,align: 'center'},
            {title: '疑难详情',key: 'problem',
              render:(h,params) => {
                let texts = params.row.problem;
                return h('div',{
                  style:{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },texts)
              }
            },
            {title: '状态', key: 'status',align: 'center',width:120,
              render: (h, params) => {
                return h('div', [
                  h('Tag', {
                    props: {
                      color: "green",
                    }
                  },'已回答')
                ]);
              }
            },
            {title: '咨询时间',key:'create_time',width: 150,
              render:(h,params)=>{
                let texts = this.$commonTools.formatDate(params.row.create_time);
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {title: '回答人',key: 'reply_username',width: 100},
            {title: '回答时间',key: 'reply_time',width: 150,
              render:(h,params)=>{
                let texts = this.$commonTools.formatDate(params.row.reply_time);
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {title: '操作',key: 'action',width: 200,align: 'center',
              render: (h, params) => {
                return h('div', [
                  h("Tooltip",{props:{trigger:"hover",content:"详情",placement:"top"}},
                    [h("Icon",{
                      props: {
                        custom: "icon iconfont icon-ziliao"
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
          data: [],
          totalPage:0,
          curPage:1,
          type:"1",
          detailModel:false,
          detailData:{},
          keyword:''
        }
      },
      props:{
        postCommonH:'',
        tabType:''
      },
      mounted(){
        this.getTableH();
        this.handleExistedData();
      },
      methods:{
        getTableH(){
          let vm = this;
          if(vm.postCommonH){
            vm.tableH = document.documentElement.clientHeight - 60-24*2 - vm.postCommonH - (vm.$refs.pageDiv.offsetHeight + 10);
          }
        },
        handleExistedData(){
          let vm=this;
          vm.$http.get(vm.$commonTools.g_restUrl+"admin/advisory/advisory_list",{
            params:{
              type: vm.type,
              page:vm.curPage,
              keyword:vm.keyword
            }
          }).then(function (response) {
            if (response.data.code=="200"){
              vm.data=response.data.list.data;
              vm.totalPage = response.data.list.total;
            }
          }).catch(function (error) {
            console.log(error)

          })
        },
        changePage(curPage){
          this.curPage = curPage;
          this.handleExistedData();
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
        del(id){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/advisory/advisory_del',{
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
                vm.handleExistedData();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        searchChild(key){
          this.keyword = key;
          this.handleExistedData();
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
    margin: 0 0 5px 0;
  }

  .title_text{
    color:#8d8d8d;
    font-weight: 500;
  }

  .bottom_border1{
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 0;
    font-size: 16px;
    color:#8d8d8d;
  }

  .bottom_border2{
    border-bottom: 1px solid #e0e0e0;
    padding: 15px 0;
    font-size: 14px;
  }

  .bottom_border3{
    padding: 15px 0;
    font-size: 14px;
  }

</style>
