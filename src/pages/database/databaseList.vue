<template>
  <div>
    <Row>
      <div class="title" ref="title">资料库</div>
    </Row>

    <div class="database-list" :style="{minHeight: conH + 'px' }">
      <Row>
        <Col span="24" class="search-row">
          <Button icon="md-add" class="add-content" @click="goDetail">添加资料</Button>
        </Col>
      </Row>
      <div class="rapper">
        <Row>
          <div class="card-wrapper" v-for="item in listData" :key="item.id">
            <Card>
              <div class="card-img">
                <img :src="item.cover">
                <p class="img-descriptin" v-text="item.title"></p>
              </div>
              <div class="card-footer">
                <Row>
                  <Col span="6">
                    <div class="icon-wrapper">
                      <Icon type="ios-redo" size="18" color="#8d8d8d"/>
                      <span class="number" v-text="item.forward"></span>
                    </div>
                  </Col>
                  <Col span="6">
                    <div class="icon-wrapper">
                      <Icon type="md-eye" size="18" color="#8d8d8d"/>
                      <span class="number" v-text="item.click"></span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span="18" class="update-wrapper">更新于
                    <span class="update-time" v-text="$commonTools.formatDate2(item.update_time)"></span>
                  </Col>
                </Row>
                <Row>
                  <Col span="9">
                    <div class="icon-wrapper" @click="goEdit(item.id)">
                      <Icon type="icon iconfont icon-bianji" size="14" color="#3fab23"/>
                      <span class="number">编辑</span>
                    </div>
                  </Col>
                  <Col span="9">
                    <div class="icon-wrapper" @click="del(item.id)">
                      <Icon type="icon iconfont icon-shanchu" size="14" color="#3fab23"/>
                      <span class="number">删除</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>

        </Row>
        <div class="page-wrapper">
          <Page :total="totalPage" show-elevator @on-change="changePage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "databaseList",
      provide: function () {
        return {
          reload: this.reload
        }
      },
      data(){
          return{
            curPage:1,
            listData:[],
            conH:'',
            totalPage:0,
            isRouterAlive: true
          }
      },
      mounted(){
        this.getBgHeight();
        this.getListData();
      },
      methods:{
        reload: function () {
          this.isRouterAlive = false;
          // 该方法会在dom更新后执行
          this.$nextTick(function () { this.isRouterAlive = true })
        },
        getBgHeight() {
          let vm = this;
          vm.conH = document.documentElement.clientHeight -64 -24 * 2 -(vm.$refs.title.offsetHeight + 10)-2;
        },
        getListData(){
          let vm = this;
          this.$http.get('http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/database/database_list',{
            params: {
              page : vm.curPage
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.listData = response.data.list.data;
                vm.totalPage = response.data.list.total;
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
              this.$http.get(vm.$commonTools.g_restUrl+"admin/database/database_del",{
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
                    vm.getListData();
                  }

                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          });
        },
        changePage(curPage) {
          this.curPage = curPage;
          this.getListData();
        },
        goDetail(){
          this.$router.push({ name: 'DataBaseAdd'});
        },
        goEdit(id){
          this.$router.push({
            name: 'DataBaseAdd',
            params: { editId: id }
          })
        }
      }
    }
</script>

<style scoped>
  .database-list{
    background-color: white;
    position: relative;
    height: 100%;
  }
  .title {
    font-size: 1.25rem;
    color: #adb3a8;
    margin-bottom: 10px;
    background-color: #f5fbfa;
  }
  .search-row{
    text-align: right;
    padding: 2vh 1%;

  }
  .search-row .add-content{
    background-color: #3fab23;
    color: #ffffff;
  }
  .rapper{
    padding: 0 1vh;
    padding-bottom: 13vh;
  }
  .card-wrapper{
    width: 18%;
    float: left;
    margin: 1vh;
  }
  .card-img{
    text-align: center;
    position: relative;
  }
  .card-img img{
    width: 100%;
    height: 170px;
  }
  .img-descriptin{
    font-weight: 400;
    font-size: 1.4rem;
    color: #FFF;
    position: absolute;
    bottom: 5px;
    width: 100%;
    background-color: rgba(0,0,0,.5);
    text-indent: 5px;
    height: 30px;
    line-height: 30px;
    display: block;
    word-wrap: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .page-wrapper{
    position: absolute;
    right: 5vh;
    bottom: 1vw;

  }
  .icon-wrapper{
    display: flex;
    align-content: center;
    align-items: center;
    cursor: pointer;
  }
  .icon-wrapper .number{
    margin-left: 2px;
  }
  .update-wrapper{
    margin: 1vh 0;
    color:#8d8d8d;
  }
  .update-time{
    margin-left: 5px;
  }
</style>
