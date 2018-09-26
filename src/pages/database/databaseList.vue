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
      <Page :total="100" show-elevator @on-change="changePage"/>
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
  .page-wrapper{
    position: absolute;
    right: 5vh;
    bottom: 1vw;
  }
</style>
