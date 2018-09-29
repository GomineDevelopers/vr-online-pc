<template>
  <div class="problem_no_answered">
    <Table :columns="columns" :data="data" :height="tableH"></Table>
    <div class="pageDiv" ref="pageDiv">
      <Page :total="totalPages" :current="curPage" show-elevator @on-change="changePage"/>
    </div>
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
          data: [],
          columns: [
            {title:'序号',type: 'index',width: 60,align: 'center'},
            {title: '咨询人',key: 'realname',width:120,align: 'center'},
            {title: '疑难详情 ',key:'problem'},
            {title: '状态',key: 'status',align: 'center',
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
            {title: '咨询时间',key: 'create_time',
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
            {title: '操作',key: 'action',
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
                        this.show(params.index)
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
                        alert(1);
                      }
                    }
                  },'去回答')
                ]);
              }
            }
          ]
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
              page:vm.curPage
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.data = response.data.list.data;
                vm.totalPages = response.data.list.total;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>
  .pageDiv{
    margin: 10px 10px 0 10px;
    text-align: right;
  }
</style>
