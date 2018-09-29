<template>
  <div class="doctor_detail">
    <div class="doctor_detail_title" ref="title">医生管理</div>
    <div class="doctor_detail_card" ref="card">
      <Row>
        <Col span="18">
          <Row class="doctor_detail_rowBottom">
            <Col span="8">姓名：<span class="spanFont">张三</span></Col>
            <Col span="8">编号：<span class="spanFont">67889</span></Col>
            <Col span="8">性别：<span class="spanFont">女</span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">医院：<span class="spanFont">北京大学第一附属医院</span></Col>
            <Col span="8">科室：<span class="spanFont">胸外科</span></Col>
            <Col span="8">职称：<span class="spanFont">副主任医师</span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">手机号：<span class="spanFont">18900987654</span></Col>
            <Col span="8">邮箱：<span class="spanFont">18900987654@163.com</span></Col>
            <Col span="8">微信号：<span class="spanFont">18900987654</span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">拜访记录：<span class="spanFont">57</span></Col>
            <Col span="8">微课记录：<span class="spanFont">15</span></Col>
            <Col span="8">累计积分：<span class="spanFont">204</span></Col>
          </Row>
          <Row class="doctor_detail_rowBottom">
            <Col span="8">互动记录：<span class="spanFont">57</span></Col>
            <Col span="8">负责销售：<span class="spanFont">郑萌萌</span></Col>
          </Row>
          <Row>
            <Col span="8">标签：<span class="spanFont">老中医 全国十佳 省医院</span></Col>
          </Row>
        </Col>
        <Col span="6"><img src="../../../static/images/1.png" style="height: 170px;"></Col>
      </Row>
    </div>
    <div class="doctor_detail_tab">
      <Tabs value="1" @on-click="tabChange">
        <TabPane label="拜访记录" name="1">
          <visit-record :postCommonH="commonHeight" :tabType="type" v-if="commonHeight"></visit-record>
        </TabPane>
        <TabPane label="微课记录" name="2">微课记录</TabPane>
        <TabPane label="互动记录" name="3">互动记录</TabPane>
        <TabPane label="积分记录" name="4">积分记录</TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import VisitRecord from '@/components/visitrecord.vue'
    export default {
      name: "doctorDetail",
      data(){
        return {
          commonHeight:'',
          type:1
        }
      },
      components: {
        'visit-record': VisitRecord
      },
      mounted(){
        this.getCommonHeight();
      },
      methods:{
        getCommonHeight(){
          let vm = this;
          vm.commonHeight = (vm.$refs.title.offsetHeight+10) + (vm.$refs.card.offsetHeight+30+10) + 36;
        },
        tabChange(name){
          let vm = this;
          vm.type = name;
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
