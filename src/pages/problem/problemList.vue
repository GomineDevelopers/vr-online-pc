<template>
  <div class="problem">
    <div class="problem_title" ref="title">疑难求助</div>
    <div class="problem_search" ref="search">
      <Row type="flex" justify="center">
        <Col span="12" >
          <Input class="search" size="large" search enter-button="搜索" placeholder="请输入您要搜索的关键字" />
        </Col>
      </Row>
    </div>
    <div class="problem_tab">
      <Tabs value="1" @on-click="tabChange">
        <TabPane label="已回答" name="1">
          <problem-answered :postCommonH="commonHeight" :tabType="type" v-if="commonHeight"></problem-answered>
        </TabPane>
        <TabPane label="未回答" name="2">未回答</TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import ProblemAnswered from '@/components/ProblemAnswered.vue'
    export default {
      name: "problemList",
      data(){
        return{
          commonHeight:"",
          type:1
        }
      },
      components: {
        'problem-answered': ProblemAnswered
      },
      mounted(){
        this.getCommonHeight();
      },
      methods:{
        tabChange(name){
          let vm = this;
          vm.type = name;
        },
        getCommonHeight(){
          let vm = this;
          vm.commonHeight = (vm.$refs.title.offsetHeight+10) + (vm.$refs.search.offsetHeight)+36+22 ;
        },
      }
    }
</script>

<style scoped>
  .problem_title{
    color: #adb3a8;
    font-size: 1.25rem;
    margin-bottom: 10px;
  }
</style>
