<template>
    <div class="visit_record">
      <Table :columns="columns" :data="data" :height="tableH"></Table>
      <div class="pageDiv" ref="pageDiv">
        <Page :total="100" show-elevator @on-change="changePage"/>
      </div>
    </div>
</template>

<script>
    export default {
      name: "VisitRecord",
      data(){
          return{
            tableH:'',
            columns: [
              {title:'序号',type: 'index',width: 60,align: 'center'},
              {title: '拜访方式',key: 'type',align: 'center'},
              {title: '日期',key: 'date',align: 'center'},
              {title: '目的',key: 'purpose',align: 'center'},
              {title: '销售',key: 'name',align: 'center'},
              {title: '操作',key: 'action',width: 150,align: 'center',
                render: (h, params) => {
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: "icon iconfont icon-ziliao",
                      },
                      style: {
                        color: "#4fb115"
                      },
                      on: {
                        click: () => {
                          this.show(params.index)
                        }
                      }
                    })
                  ]);
                }
              }
            ],
            data: [{type: 'John Brown',date: 18,purpose: 'New York No. 1 Lake Park',name:'王五'},
              {type: 'Jim Green',date: 24,purpose: 'London No. 1 Lake Park',name:'王五王五王五王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Joe Black',date: 30,purpose: 'Sydney No. 1 Lake Park',name:'王五'},
              {type: 'Jon Snow',date: 26,purpose: 'Ottawa No. 2 Lake Park',name:'王五'}]
          }
      },
      props:{
        postCommonH:'',
        tabType:''
      },
      mounted(){
        this.getTableH();
        console.info(this.tabType)
      },
      methods:{
        getTableH(){
          let vm = this;
          vm.tableH = document.documentElement.clientHeight - 60-24*2 - vm.postCommonH - (vm.$refs.pageDiv.offsetHeight + 10);
        },
        changePage(curPage){
          console.info(curPage)
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
