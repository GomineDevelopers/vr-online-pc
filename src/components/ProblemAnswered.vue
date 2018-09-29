<template>
  <div class="problem_answered">
    <Table :columns="columns" :data="data" :height="tableH"></Table>
    <div class="pageDiv" ref="pageDiv">
      <Page :total="100" show-elevator @on-change="changePage"/>
    </div>
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
            {title: '咨询人',key: 'realname',width: 100,align: 'center'},
            {title: '疑难详情',key: 'problem',align: 'center'},
            {title: '状态', key: 'status',width: 100, align: 'center',
              render: (h, params) => {
                let texts = "";
                if(params.row.status == 1){
                  texts = "已回答";
                }
                return h('div', [
                  h('Tag', {
                    props: {
                      color: "green",
                    },

                    on: {
                      click: () => {
                        this.show(params.index)
                      }
                    }
                  },texts)
                ]);
              }
            },
            {title: '咨询时间',key: 'askTime',align: 'center',
              render:(h,params)=>{
                let texts = this.$commonTools.formatDate(params.row.create_time);
                return h('span',{
                  props:{},
                },texts)
              }
            },
            {title: '回答人',key: 'reply_username',width: 100,align: 'center'},
            {title: '回答时间',key: 'replyTime',width: 150,align: 'center',
              render:(h,params)=>{
                let texts = this.$commonTools.formatDate(params.row.reply_time);
                return h('span',{
                  props:{},
                },texts)
              }

            },
            {title: '操作',key: 'action',width: 200,align: 'center',
              render: (h, params) => {
                let texts = "";
                if(params.row.status == 1){
                  texts = "已回答";
                }
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
          type:"1"
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
          vm.tableH = document.documentElement.clientHeight - 60-24*2 - vm.postCommonH - (vm.$refs.pageDiv.offsetHeight + 10);
        },
        changePage(curPage){
          console.info(curPage)
        },
        goDetail(id){
          this.getDetailData(id);
          this.detailModel = true;
        },
        handleExistedData(type){
          let vm=this;
            vm.$http({
              method: "get",
              url:vm.$commonTools.g_restUrl+"admin/advisory/advisory_list",
              params:{
              type: vm.type
              },
            }).then(function (response) {
              if (response.data.code=="200"){
                vm.data=response.data.list.data;
                vm.totalPage = response.data.list.total;
              }
            }).catch(function (error) {
              console.log(error)

            })
        },
        getDetailData(id){

        },
        del(id){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+'',{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.$Notice.success({
                  title: '删除成功！'
                });
                vm.handleExistedData(1);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },

      }
    }
</script>

<style scoped>
  .pageDiv{
    margin: 10px 10px 0 10px;
    text-align: right;
  }

</style>
