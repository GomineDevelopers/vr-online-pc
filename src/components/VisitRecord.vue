<template>
    <div class="visit_record">
      <Table :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total = totalPages :current="curPage" show-elevator show-total @on-change="changePage"/>
      </div>
    </div>
</template>

<script>
    export default {
      name: "VisitRecord",
      data(){
          return{
            tableH:'',
            totalPages:0,
            curPage:1,
            data:[],
            columns:[],
            url:'',
            loading:true,
            columns1: [
              {title:'序号',type: 'index',width: 60,align: 'center'},
              {title: '拜访方式',key: 'visiting',align: 'center'},
              {title: '拜访时间',key: 'visit_time',
                render:(h,params)=>{
                  let texts = '';
                  texts = this.$commonTools.formatDate(params.row.visit_time);
                  return h('span',{
                    props:{},
                  },texts)
                }
              },
              {title: '拜访目的',key: 'purpose',align: 'center'},
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
                            this.goDetail(params.row.id,'visit','view');
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
                            this.goDetail(params.row.id,'visit','edit');
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
                            this.del(params.row.id,'visit');
                          }
                        }
                      })
                    ])
                  ]);
                }
              }
            ],
            columns2: [
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
                          color: "#4fb115"
                        },
                        on: {
                          click: () => {
                            this.goDetail(params.row.id,'wk','view');
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
                            this.del(params.row.id,'wk');
                          }
                        }
                      })
                    ])
                  ]);
                }
              }
            ],
            columns3:[
              {title:'序号',type: 'index',width: 60,align: 'center'},
              {title:'时间',key: 'create_update',
                render:(h,params)=>{
                  let texts = '';
                  texts = this.$commonTools.formatDate(params.row.create_update);
                  return h('span',{
                    props:{},
                  },texts)
                }},
              {title:'积分来源',key: 'source'},
              {title:'单项积分',key: 'score'},
              {title:'经办人',key:'manager'},
            ]
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
      watch:{
        url: function (newQuestion, oldQuestion) {
          this.curPage = 1;
        }
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
          if(vm.tabType == 1){
            vm.columns = vm.columns1;
            vm.url = 'admin/visit/visit_list';
          }else if(vm.tabType == 2){
            vm.columns = vm.columns2;
            vm.url = 'admin/lesson/lesson_list';
          }else if(vm.tabType == 3){
            vm.columns = vm.columns3;
            vm.url = 'admin/doctors/score_list';
          }
          this.$http.get(vm.$commonTools.g_restUrl + vm.url,{
            params: {
              doctors_id : vm.doctorId,
              page:vm.curPage
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.data = response.data.list.data;
                vm.totalPages = response.data.list.total;
                vm.loading = false;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        goDetail(id,temp1,temp2){
          this.$emit('getRecordDetailC', id,temp1,temp2);
        },
        del(id,temp){
          let vm = this;
          let url = "";
          if(temp == 'visit'){
            url = 'admin/visit/visit_del';
          }else if(temp == 'wk'){
            url = 'admin/lesson/lesson_del';
          }
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              this.$http.get(vm.$commonTools.g_restUrl+url,{
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
