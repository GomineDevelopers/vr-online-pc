<template>
  <div>
    <Table ref="table" :columns="columns" :data="data" :height="tableH" :loading="loading"></Table>
    <div class="pageDiv" ref="pageDiv">
      <Page :total="totalPage" show-elevator show-total :current="curPage" @on-change="changePage"/>
    </div>
  </div>
</template>

<script>
    export default {
      name: "tableList",
      data(){
        return{
          columns: [
            { title:"序号",type: "index", width: 60, align: "center" },
            {title: "话术标题", key: "speechcraft"},
            {title: "话术类别1", key: "type1",width:150},
            {title: "创建人", key: "username",width:100,align:"center"},
            {title: "创建时间", key: "create_time",width:140,
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
            {title: "被引用次数", key: "frequency", align: "center",width:100},
            {title: "操作", key: "action",width: 150,align: "center",
              render: (h, params) => {
                return h("div", [
                  h("Tooltip",{props:{trigger:"hover",content:"详情",placement:"top"}},
                    [h("Icon", {
                      props: {
                        type: "icon iconfont icon-ziliao",
                      },
                      style: {
                        marginLeft: "5px",
                        color: "#4fb115",
                        display:this.btnLimit_F.detail?'inline':'none'
                      },
                      on: {
                        click: () => {
                          this.goDetail(params.row.id);
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
                        display:(params.row.is_registered == 0)?"none":"inline" && (this.btnLimit_F.update?'inline':'none')
                      },
                      on: {
                        click: () => {
                          this.goEdit('edit',params.row.id);
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
                        display:this.btnLimit_F.del?'inline':'none'
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
          curPage:1,
          totalPage:0,
          loading:true,
          tableH:'',
          searchData:{}
        }
      },
      props:{
        htmlType:String,
        fatherH:'',
        btnLimit_F:''
      },
      mounted(){
        let vm = this;
        vm.tableH = vm.fatherH - (vm.$refs.pageDiv.offsetHeight + 10 * 2) -20;
        if(vm.htmlType == 'wordsLib'){
          vm.getData();
        }
      },
      methods:{
        getData(temp1,temp2){
          let vm = this;
          vm.searchData = temp1;//保存下父组件的搜索条件
          let postData = {};
          if(temp1 != undefined && temp2 == 'first' ) {//点击搜索按钮
            postData = temp1;
            vm.curPage = 1;
            postData.page = vm.curPage;
          }else if(temp1 != undefined && temp2 == undefined){//从分页触发搜索
            postData = temp1;
            postData.page = vm.curPage;
          }else{
            postData.page = vm.curPage;
          }

          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/speech/speech_list',
            data:vm.$qs.stringify(postData)
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
        goDetail(id){
          this.$emit('goDetail_C', id);
        },
        goEdit(temp,id){
          this.$emit('goEdit_C',temp,id);
        },
        del(id){
          let vm = this;
          this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
              this.$http.get(vm.$commonTools.g_restUrl+"admin/speech/speech_del",{
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
        changePage(curPage){
          this.curPage = curPage;
          this.getData(this.searchData);
        },
      }
    }
</script>

<style scoped>
  .pageDiv {
    margin: 10px;
    text-align: right;
  }
</style>
