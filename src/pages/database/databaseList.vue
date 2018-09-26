<template>
<div class="database-list">
  <Row>
  <div class="title" ref="title">资料库</div>
  </Row>

    <Row>
      <Col span="24" class="search-row">
        <Button icon="md-add" class="add-content" @click="gotoDetail('DataBaseAdd')">添加资料</Button>
      </Col>
    </Row>
  <div class="rapper" >
    <Row type="flex" justify="space-between">
      <div  class="card-wrapper">
        <Card>
          <div class="card-img">
            <img src="static/images/ExampleCard.png">
            <p class="img-descriptin" v-text="">img-descriptin</p>
          </div>
          <div class="card-footer">
            <Row>
              <Col span="6">
                <div class="icon-wrapper">
                  <Icon type="ios-redo" size="18" color="#8d8d8d"/>
                  <span class="number">20</span>
                </div>
              </Col>
              <Col span="6">
                <div class="icon-wrapper">
                  <Icon type="md-eye" size="18" color="#8d8d8d"/>
                  <span class="number">22</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span="18" class="update-wrapper">更新于
                <span class="update-time">2018-6-2</span>
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <div class="icon-wrapper">
                  <Icon type="icon iconfont icon-bianji" size="14" color="#3fab23"/>
                  <span class="number">编辑</span>
                </div>
              </Col>
              <Col span="6">
                <div class="icon-wrapper">
                  <Icon type="icon iconfont icon-shanchu" size="14" color="#3fab23"/>
                  <span class="number">删除</span>
                </div>
              </Col>
            </Row>

          </div>

          <div>

          </div>
        </Card>
      </div>
      <div  class="card-wrapper">
        <Card >
          <div style="text-align:center">
            <img src="static/images/indexLogo.png">
          </div>
        </Card>
      </div>
      <div  class="card-wrapper">
        <Card >
          <div style="text-align:center">
            <img src="static/images/indexLogo.png">
            <h3>A high quality UI Toolkit based on Vue.js</h3>
          </div>
        </Card>
      </div>
      <div  class="card-wrapper">
        <Card >
          <div style="text-align:center">
            <img src="static/images/indexLogo.png">
            <h3>A high quality UI Toolkit based on Vue.js</h3>
          </div>
        </Card>
      </div>
      <div  class="card-wrapper">
        <Card >
          <div style="text-align:center">
            <img src="static/images/indexLogo.png">
            <h3>A high quality UI Toolkit based on Vue.js</h3>
          </div>
        </Card>
      </div>
    </Row>
    <div class="page-wrapper" ref="pageDiv">
      <Page :total="100" show-elevator @on-change=""/>
    </div>
  </div>
</div>
</template>

<script>
    export default {
        name: "databaseList",
      data(){
          return{
            contentHeight:''
          }

      },
      mounted(){

      },
      methods:{
        gotoDetail(routerName){
          this.$router.push({ name: routerName})
      }
      }
    }
</script>

<style scoped>
  .database-list{
    background-color: white;
    height: 100%;

    position: relative;
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
    padding: 0 1%;

  }
  .card-wrapper{
    width: 19%;
    float: left;
    margin-left: 1%;
  }
  .card-img{
    text-align: center;
    position: relative;
  }
  .card-img img{
    width: 100%;
    height: 100%;
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
  }
  .icon-wrapper .number{
    margin-left: 2px;
  }
  .update-wrapper{
    margin: 1vh 0;
  }
  .update-time{
    margin-left: 5px;
  }
</style>
