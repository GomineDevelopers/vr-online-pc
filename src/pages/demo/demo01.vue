<template>
  <div>
      <Row>
        <Col span="12" class="title">标签管理</Col>
        <Col span="12" class="button">
          <Button type="success" icon="md-add" @click="addLabel">新增标签</Button>
        </Col>
      </Row>
      <div class="cardTitle">
        <Row>
          <Col span="4">标签列表</Col>
          <Col span="9"  offset="6">操作</Col>
        </Row>
      </div>
      <div class="card" v-for="item in listData">
        <Row>
          <Col span="4" v-text="item"></Col>
          <Col span="9"  offset="6">
            <Icon type="ios-create-outline" size="20" color="#32CD32"/>
            <Icon type="ios-trash-outline" size="20" color="#32CD32"/>
          </Col>
        </Row>
      </div>
    <div class="pageDiv">
      <Page :total="100" show-elevator />
    </div>

    <Modal v-model="labelModel" draggable scrollable title="请输入您需要添加的标签名称">
      <div>
        标签名称：
        <Input v-model="labelName" clearable style="width: 200px" />
      </div>
    </Modal>
  </div>
</template>

<script>
    export default {
        name: "demo01",
      data(){
          return{
            listData:['老中医','全国十佳','省医院','县医院','老中医','全国十佳','省医院','县医院'],
            labelModel:false,
            labelName:''
          }
      },
      methods:{
        addLabel(){
          let vm = this;
          vm.labelModel = true;
        }
      }
    }
</script>

<style scoped>
  .cardTitle{
    background-color: #fff;
    height:8vh;
    line-height: 8vh;
    text-align: center;
    font-size: .88rem;
    font-weight: 600;

  }

  .card{
    margin-top: 2vh;
    background-color: #fff;
    height: 6vh;
    line-height: 6vh;
    text-align: center;
    border-left: 3px solid #32CD32;
  }

  .card:hover{
    box-shadow: 0 2px 7px rgba(0,0,0,.15)
  }

  .pageDiv{
    text-align: right;
    margin:2vh 0;
  }

  .title{
    font-size: 1rem;
    color: #908e8e;
    margin-bottom: 2vh;
  }

  .button{
    text-align: right;
  }
</style>
