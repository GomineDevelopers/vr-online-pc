<template>
  <div class="problem">
    <div class="problem_title" ref="title">疑难求助</div>
    <div class="problem_search" ref="search">
      <Row type="flex" justify="center">
        <Col span="12" >
          <Input class="search" size="large" search enter-button="搜索" placeholder="请输入您要搜索的关键字"
                 v-model="key" @on-search="searchFather"/>
        </Col>
      </Row>
    </div>
    <div class="problem_tab">
      <Tabs value="1" @on-click="tabChange" :animated="false">
        <TabPane label="已回答" name="1">
          <problem-answered :postCommonH="commonHeight" :tabType="type" v-if="type == 1" ref="tab1"></problem-answered>
        </TabPane>
        <TabPane label="未回答" name="0">
          <problem-no-answer :postCommonH="commonHeight" :tabType="type" v-if="type == 0" ref="tab0"></problem-no-answer>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import ProblemAnswered from '@/components/ProblemAnswered.vue'
  import ProblemNoAnswer from '@/components/ProblemNoAnswer.vue'
    export default {
      name: "problemList",
      data(){
        return{
          commonHeight:"",
          type:1,
          key:''
        }
      },
      components: {
        'problem-answered': ProblemAnswered,
        'problem-no-answer':ProblemNoAnswer
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
          vm.commonHeight = (vm.$refs.title.offsetHeight+10) + (vm.$refs.search.offsetHeight)+36+22;
        },
        searchFather(){
          let vm = this;
          if(vm.type == '0'){
            vm.$refs.tab0.searchChild(vm.key);
          }else if(vm.type == '1'){
            vm.$refs.tab1.searchChild(vm.key);
          }

        }
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
