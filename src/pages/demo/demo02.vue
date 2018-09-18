<template>
    <div>
      <div class="title" ref="title">医生管理</div>
      <div class="searchCard" ref="searchCard">
        所属医院：<Input v-model="name" clearable class="inputStyle"/>
        医生姓名：<Input v-model="name" clearable class="inputStyle"/>
        负责销售：<Input v-model="name" clearable class="inputStyle"/>
        医生编号：<Input v-model="name" clearable class="inputStyle"/>
        医生手机：<Input v-model="name" clearable class="inputStyle"/>
        <Button type="success">搜索</Button>
        <Button type="success" ghost>重置</Button>
      </div>
      <div class="tableDiv" :style="{height:tableBgH+'px'}">
        <div class="buttonDiv" ref="buttonDiv">
          <Button icon="md-add" @click="addLabel">添加标签</Button>
          <Button icon="md-albums">新增互动记录</Button>
        </div>
        <Table :columns="columns2" :data="data2"  @on-select="selected" @on-select-cancel="unSelected" :height="tableH"></Table>
        <div class="pageDiv" ref="pageDiv">
          <Page :total="100" show-elevator @on-change="changePage"/>
        </div>
      </div>

      <Modal v-model="labelModel" draggable scrollable title="请输入您需要添加的标签">
        <div class="labelDiv">
          <div class="tagDiv" v-for="item in tagData" @click="selectedTag">
            <label :class="{activeitem:item.active}"></label>
            <Button v-text="item.name"></Button>
          </div>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
      name: "demo02",
      data(){
          return{
            name:'',
            tableBgH:'',
            tableH:'',
            labelModel:false,
            tagData:[
              {name:'老中医',active:false},{name:'省医',active:false},{name:'县医',active:false},
              {name:'全国十佳',active:false},{name:'老中医',active:false},{name:'省医',active:false},
              {name:'县医',active:false},{name:'全国十佳',active:false},{name:'老中医',active:false}],
            data2:[],
            curPage:1,
            columns2: [
              {type: 'selection',width: 60,align: 'center'},
              {title: '标题',key: 'title'},
              {title: 'ID',
                key: 'id',
                filters: [
                  {
                    label: '大于10',
                    value: 1
                  },
                  {
                    label: '小于10',
                    value: 2
                  }
                ],
                filterMultiple: false,
                filterMethod (value, row) {
                  if (value === 1) {
                    return row.id >= 10;
                  } else if (value === 2) {
                    return row.id < 10;
                  }
                }
              },
              {title: '内容',key: 'contents'},
              {title: '浏览次数',key: 'total'},
              {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', [
                    h('label', {
                      style: {
                        marginRight: '5px',
                        color:'#19be6b'
                      },
                      on: {
                        click: () => {
                          this.show(params.index)
                        }
                      }
                    }, '编辑'),
                    h('Button', {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.index)
                        }
                      }
                    }, 'Delete')
                  ]);
                }
              }]
          }
      },
      mounted(){
        this.getBgHeight();
        this.getData2();
      },
      methods:{
        getBgHeight(){
          let vm = this;
          vm.tableBgH = document.documentElement.clientHeight - 64-24*2 - (vm.$refs.title.offsetHeight+10) - (vm.$refs.searchCard.offsetHeight + 26)-2;
          vm.tableH = vm.tableBgH - (vm.$refs.buttonDiv.offsetHeight + 10*2) - (vm.$refs.pageDiv.offsetHeight + 10*2) -10;
        },
        getData2(){
          let vm = this;
          this.$http.get(vm.$commonTools.g_restUrl, {
            params: {
              i: '8',
              c: 'entry',
              p: 'article',
              do: 'shop',
              m: 'ewei_shop',
              ccate: 35, //分类
              page: vm.curPage
            }
          })
            .then(function (response) {
              vm.data2 = response.data.result.list;
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        selected(selection,row){
          console.info(selection)
        },
        unSelected(selection,row){
          console.info(selection)
        },
        changePage(curPage){
          this.curPage = curPage;
          this.getData2();
        },
        addLabel(){
          let vm = this;
          vm.labelModel = true;
        },

        selectedTag(e){
          let vm = this;
          if(e.target.textContent){
            vm.tagData.forEach(function (ele,index,arr) {
              if(ele.name == e.target.textContent && !ele.active ){
                ele.active = true;
              }else if(ele.name == e.target.textContent && ele.active){
                ele.active = false;
              }
            })
          }
        }
      }

    }
</script>

<style scoped>
  .title{
    font-size: 1rem;
    color: #908e8e;
    margin-bottom: 10px;
  }

  .searchCard{
    background-color: #fff;
    height: 8vh;
    line-height: 8vh;
    padding: 0 3vh;
    white-space: nowrap;
  }

  .tableDiv{
    background-color: #fff;
    margin-top: 26px;
    padding: 2vh;
  }

  .pageDiv{
    margin: 10px;
    text-align: right;
  }

  .inputStyle{
    width:10vw;
  }

  .buttonDiv{
    text-align: right;
    margin-bottom: 10px;
  }

  .activeitem::before {
    font-style: normal;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    content: '\2713';
    position: absolute;
    top: 0px;
    right: 2px;
    color: #ffffff;
    z-index: 1;
    font-size: 12px;
  }

  .activeitem::after {
    content: '';
    position: absolute;
    top: 1px;
    right: 0;
    width: 0;
    height: 0;
    border-top: 20px solid #65b81b;
    border-left: 24px solid transparent;
  }

  .tagDiv{
    position: relative;
    display: inline-block;
    margin: 5px;
  }
</style>
