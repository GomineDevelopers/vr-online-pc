<template>
  <div>
    <Row>
      <Col span="12" class="tag_title">标签管理</Col>
      <Col span="12" class="tag_button">
        <Button type="success" icon="icon iconfont icon-tianjia" @click="addFirstLabel">新增一级标签</Button>
      </Col>
    </Row>
    <div class="tag_cardTitle">
      <Row>
        <Col span="3">标签列表</Col>
        <Col span="2" offset="10">操作</Col>
      </Row>
    </div>
    <div v-for="(item,index) in listData" :key="index">
      <div class="tag_first_panel">
        <Row>
          <Col span="3" class="tag_title"><span v-text="item.name"></span></Col>
          <Col span="10" class="tag_summary"><p v-text="item.summary"></p></Col>
          <Col span="2">
            <Icon custom="icon iconfont icon-xinzeng" color="#4fb115" @click="addSecondLabel"/>&emsp;
            <Icon custom="icon iconfont icon-bianji" color="#4fb115"/>&emsp;
            <Icon custom="icon iconfont icon-shanchu" color="#4fb115"/>
          </Col>
          <Col span="9" class="tag_icon">
            <Icon type="ios-arrow-down" size="26" color="#a1a99b" v-show="item.isShow" @click="changeClass(index,item)"/>
            <Icon type="ios-arrow-up" size="26" color="#a1a99b" v-show="!item.isShow" @click="changeClass(index,item)"/>
          </Col>
        </Row>
      </div>
      <div class="tag_second_panel" v-for="(citem,cindex) in item.children" :key="cindex" v-show="item.isShow">
        <Row>
          <Col span="2" class="tag_title_se">{{cindex+1}}、<span v-text="citem.name"></span></Col>
          <Col span="8" class="tag_summary"><p v-text="citem.summary"></p></Col>
          <Col span="4">
            &emsp;&nbsp;
            <Icon custom="icon iconfont icon-bianji" color="#4fb115"/>&emsp;
            <Icon custom="icon iconfont icon-shanchu" color="#4fb115"/>
          </Col>
        </Row>
      </div>
    </div>
    <div class="tag_page">
      <Page :total="100" show-elevator />
    </div>

    <Modal v-model="labelModel" draggable scrollable :title="labelTitle">
      <Row class="tag_modelRow">
        <Col span="8" class="tag_inputName"><span class="necessary">*</span>标签名称：</Col>
        <Col span="16"><Input v-model="labelName" clearable class="tag_input"/></Col>
      </Row>
      <Row class="tag_modelRow">
        <Col span="8" class="tag_inputName">标签描述：</Col>
        <Col span="16"><Input type="textarea" v-model="labelSummary" :rows="4" class="tag_input"/></Col>
      </Row>
    </Modal>

  </div>
</template>

<script>
    export default {
      name: "tag",
      data(){
          return{
            listData:[{"name":"妇科专家","summary":"该主任为该地区有名的妇科专家，常年从事妇科疾病的治疗，非常有经。如果在治疗这方面有任何问题的话请咨询该主任。能够保证在你" +
              "该主任为该地区有名的妇科专家，常年从事妇科疾病的治疗，非常有经。如果在治疗这方面有任何问题的话请咨询该主任。","isShow":false,
              "children":[{"name":"不孕不育专家","summary":"该主任为该地区有名的妇科专家，常年从事妇科疾病的治疗，非常有经验。"}]},
              {"name":"大量门诊","summary":"大量门诊大量门诊","isShow":false,
                "children":[{"name":"大量门诊1","summary":"大量门诊11111。"},{"name":"大量门诊2","summary":"大量门诊22222。"}]}],
            labelModel:false,
            labelName:'',
            labelSummary:'',
            labelOrder:'',
            labelTitle:'新增一级'
          }
      },
      mounted(){},
      methods:{
        addFirstLabel(){
          let vm = this;
          vm.labelModel = true;
          vm.labelTitle = "新增一级标签";
        },
        changeClass(cindex,item){
            let vm = this;
            vm.listData.forEach(function (value, index, array) {
              if(cindex == index){
                value.isShow = !item.isShow;
              }
            })
        },
        addSecondLabel(){
          let vm = this;
          vm.labelModel = true;
          vm.labelTitle = "新增二级标签";
        }
      }
    }
</script>

<style scoped>
  .tag_title{
    font-size: 1.25rem;
    margin-bottom: 2vh;
    color: #adb3a8;
  }

  .tag_button{
    text-align: right;
  }

  .tag_cardTitle{
    background-color: #fff;
    height:5vh;
    line-height: 5vh;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
   }

  .tag_first_panel{
    margin-top: 2vh;
    background-color: #fff;
    text-align: center;
    border-left: 4px solid #51b213;
    padding: 10px 0;
  }

  .tag_second_panel{
    margin: 1vh 0 1vh 11vw;
    background-color: #fff;
    text-align: center;
    border-left: 4px solid #b3df97;
    padding: 10px 0;
  }

  .tag_first_panel .tag_title{
    font-size: 16px;
  }

  .tag_summary{
    font-size: 14px;
    text-align: left;
    color: #b2b2b2;
  }

  .tag_second_panel .tag_title_se{
    font-size: 15px;
    margin: 0 1vw;
  }

  .tag_icon{
    text-align: right;
    padding-right: 10px;
  }

  .tag_inputName{
    text-align: right;
    color: #414c37;
    font-size: 14px;
    font-weight: 600;
  }

  .tag_input{
    width: 230px;
  }

  .tag_modelRow{
    margin-bottom: 10px;
  }

  .tag_page{
    text-align: right;
    margin:2vh 0;
  }
</style>
