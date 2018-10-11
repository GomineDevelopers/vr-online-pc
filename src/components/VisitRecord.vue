<template>
    <div class="visit_record">
      <Table :columns="columns" :data="data" :height="tableH"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total = totalPages :current="curPage" show-elevator @on-change="changePage"/>
      </div>
    </div>
</template>

<script>
    export default {
      name: "VisitRecord",
      data(){
          return{
            tableH:'',
            data:[],
            totalPages:0,
            curPage:1,
            columns: [
              {title:'序号',type: 'index',width: 60,align: 'center'},
              {title: '拜访方式',key: 'visiting',align: 'center'},
              {title: '时间',key: 'visit_time',
                render:(h,params)=>{
                  let texts = '';
                  texts = this.$commonTools.formatDate(params.row.visit_time);
                  return h('span',{
                    props:{},
                  },texts)
                }
              },
              {title: '目的',key: 'purpose',align: 'center'},
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
                          color: "#4fb115"
                        },
                        on: {
                          click: () => {
                            this.goDetail(params.row.id,'view');
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
                          color: "#4fb115"
                        },
                        on: {
                          click: () => {
                            this.editDetail(params.row.id,'edit');
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
          }
      },
      props:{
        postCommonH:'',
        tabType:'',
        doctorId:''
      },
      mounted(){
        this.getTableH();
        this.getRecordList();
      },
      methods:{
        getTableH(){
          let vm = this;
          vm.tableH = document.documentElement.clientHeight - 60-24*2 - vm.postCommonH - (vm.$refs.pageDiv.offsetHeight + 10);
        },
        changePage(curPage){
          this.curPage = curPage;
          this.getRecordList();
        },
        getRecordList(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/visit/visit_list',{
            params: {
              doctors_id : vm.doctorId,
              current_page:vm.curPage
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
        },
        goDetail(id,temp){
          this.$emit('getRecordDetailC', id,temp);
        },
        editDetail(id,temp){
          this.$emit('getRecordDetailC', id,temp);
        },
        del(id){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/visit/visit_del',{
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
                vm.getRecordList();
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
