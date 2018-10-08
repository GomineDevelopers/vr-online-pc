<template>
  <div class="doctor_detail">
    <div class="doctor_detail_title" ref="title">医生管理</div>
    <div class="doctor_detail_card" ref="card">
      <Row>
        <Col span="18">
          <Row class="doctor_detail_rowBottom">
            <Col span="8">姓名：<span class="spanFont" v-text="detailPassData.realname"></span></Col>
            <Col span="8">编号：<span class="spanFont" v-text="detailPassData.numbers"></span></Col>
            <Col span="8">性别：
              <span class="spanFont" v-if="detailPassData.gender == 2">女</span>
              <span class="spanFont" v-if="detailPassData.gender == 1">男</span>
              <span class="spanFont" v-if="detailPassData.gender == 0">未知</span>
            </Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">医院：<span class="spanFont" v-text="detailPassData.hospital"></span></Col>
            <Col span="8">科室：<span class="spanFont" v-text="detailPassData.department"></span></Col>
            <Col span="8">职称：<span class="spanFont" v-text="detailPassData.job"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">手机号：<span class="spanFont" v-text="detailPassData.mobile"></span></Col>
            <Col span="8">邮箱：<span class="spanFont" v-text="detailPassData.email"></span></Col>
            <Col span="8">微信号：<span class="spanFont" v-text="detailPassData.wechat"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">拜访记录：<span class="spanFont" v-text="detailPassData.visit_total"></span></Col>
            <Col span="8">微课记录：<span class="spanFont" v-text="detailPassData.lesson_total"></span></Col>
            <Col span="8">累计积分：<span class="spanFont" v-text="detailPassData.score"></span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">互动记录：<span class="spanFont" v-text="detailPassData.interactive_total"></span></Col>
            <Col span="8">负责销售：<span class="spanFont" v-text="detailPassData.sales"></span></Col>
          </Row>
          <Row>
            <Col span="8">标签：<span class="spanFont">老中医 全国十佳 省医院</span></Col>
          </Row>
        </Col>
        <Col span="6"><img src="../../static/images/1.png" style="height: 170px;"></Col>
      </Row>
    </div>
    <div class="doctor_detail_tab">
      <Tabs value="1" @on-click="tabChange" :animated="false">
        <TabPane label="拜访记录" name="1">
          <visit-record :postCommonH="commonHeight" :tabType="type" v-if="commonHeight && type == 1"></visit-record>
        </TabPane>
        <TabPane label="微课记录" name="2">
          <visit-record :postCommonH="commonHeight" :tabType="type" v-if="commonHeight && type == 2"></visit-record>
        </TabPane>
        <TabPane label="互动记录" name="3">互动记录</TabPane>
        <TabPane label="积分记录" name="4">积分记录</TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import VisitRecord from '@/components/visitrecord.vue'
    export default {
      name: "DoctorPassDetail",
      data(){
        return {
          commonHeight:'',
          detailPassData:'',
          type:1
        }
      },
      components: {
        'visit-record': VisitRecord
      },
      props:{},
      mounted(){},
      methods:{
        getCommonHeight(){
          let vm = this;
          vm.commonHeight = (vm.$refs.title.offsetHeight+10)+ (vm.$refs.card.offsetHeight+30+10);
        },
        tabChange(name){
          let vm = this;
          vm.type = name;
        },
        getPassDetailData(id){
          let vm =  this;
          this.$http.get(vm.$commonTools.g_restUrl+'admin/doctors/dectors_detail',{
            params: {
              id : id
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.detailPassData = response.data.data;
                vm.getCommonHeight();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>
  .doctor_detail_title{
    color: #adb3a8;
    font-size: 1.25rem;
    margin-bottom: 10px;
  }

  .doctor_detail_card{
    background-color: #fff;
    padding: 30px 30px 10px 30px;
    font-size: 0.88rem;
    color:#a7a7a7;
  }

  .doctor_detail_rowBottom{
    margin-bottom: 7px;
  }

  .spanFont{
    color:#333;
    font-weight: 600;
  }

  .doctor_detail_tab{
    margin-top:10px;
  }
</style>
