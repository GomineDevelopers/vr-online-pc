<template>
  <div class="problem">
    <div class="problem_title" ref="title">疑难求助</div>
    <div class="problem_search" ref="search">
      <Row type="flex" justify="center">
        <Col span="12" >
          <Input class="search" size="large" search enter-button="搜索" placeholder="请输入您要搜索的关键字"
                 v-model.trim="key" @on-search="searchFather"/>
        </Col>
      </Row>
    </div>
    <div class="problem_tab">
      <Tabs value="1" @on-click="tabChange" :animated="false">
        <TabPane label="已回答" name="1">
          <problem-answered :postCommonH="commonHeight" :tabType="type" :btnLimit_F="btnLimit_F" v-if="type == 1 && commonHeight != ''&& btnLimit_F " ref="tab1"></problem-answered>
        </TabPane>
        <TabPane label="未回答" name="0">
          <problem-no-answer :postCommonH="commonHeight" :tabType="type" :btnLimit_F="btnLimit_F" v-if="type == 0 && commonHeight != ''&& btnLimit_F" ref="tab0"></problem-no-answer>
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
          key:'',
          btnLimit:{
            detail:false,
            del:false,
            reply:false,
          },
          btnLimit_F:''
        }
      },
      components: {
        'problem-answered': ProblemAnswered,
        'problem-no-answer':ProblemNoAnswer
      },
      mounted(){
        this.getCommonHeight();
        this.getLimitData();
      },
      methods:{
        getLimitData(){
          let vm = this;
          this.$commonTools.setBtnLimit(this.$route.name).forEach(function (ele) {
            if(ele.icon == 'detail'){
              vm.btnLimit.detail = ele.checked;
            }else if(ele.icon == 'reply'){
              vm.btnLimit.reply = ele.checked;
            }else if(ele.icon == 'delete'){
              vm.btnLimit.del = ele.checked;
            }
          });
          vm.btnLimit_F = vm.btnLimit;
        },
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
