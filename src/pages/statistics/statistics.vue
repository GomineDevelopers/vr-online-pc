<template>
  <div>
    <page-title ref="title" :title="titleText"></page-title>
    <div class="mainContent">
      <div class="filter">
        <Select v-model="selectedPro" style="width:200px">
          <Option v-for="item in projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="contentCard registerCard">
        <div class="subtitleCard">注册医生</div>
        <Row>
          <Col span="12">
            <div class="registerCard_left">
              <div class="font1">
                累计注册&emsp;<span class="font2" v-text="registerDoctor.count"></span>
                {{registerDoctor.today_add}}&nbsp;({{registerDoctor.today_percentage}}%)
                <div class="rotatetop" v-if="registerDoctor.today_status == '1'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div class="rotatedown" v-else-if="registerDoctor.today_status == '0'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div v-else="registerDoctor.today_status == ''">-</div>
              </div>
              <div>[好友医生：<span class="font3">？</span>]</div>
            </div>
          </Col>
          <Col span="12">
            <div class="registerCard_right">
              <div class="font1">
                本月新增&emsp;<span class="font2" v-text="registerDoctor.month_add"></span>
                {{registerDoctor.last_add}}&nbsp;({{registerDoctor.month_percentage}}%)
                <div class="rotatetop" v-if="registerDoctor.month_status == '1'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div class="rotatedown" v-else-if="registerDoctor.month_status == '0'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div v-else="registerDoctor.month_status == ''">-</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div class="contentCard chartHeight">
        <div class="subtitleCard">医生分布</div>
        <div class="searchCard">
          <DatePicker type="month" v-model="doctorDate" placeholder="请选择时间" style="width: 200px" @on-change="changeDate"></DatePicker>
        </div>
        <!--<bar-chart :barType='"doctor_city"'></bar-chart>-->
        <ve-histogram :data="chartData1" :extend="chartExtend1" :legend-visible="false" v-if="chartData1.columns.length > 0"></ve-histogram>
      </div>
      <div class="contentCard chartHeight">
        <Tabs value="1" @on-click="tabChange" :animated="false">
          <TabPane label="新增医生" name="1">
            <bar-chart :tabType="type" v-if="type == 1"></bar-chart>
          </TabPane>
          <TabPane label="流失医生" name="2">待开发</TabPane>
          <TabPane label="新增拜访" name="3">
            <bar-chart :tabType="type" v-if="type == 3"></bar-chart>
          </TabPane>
          <TabPane label="新增微课" name="4">
            <bar-chart :tabType="type" v-if="type == 4"></bar-chart>
          </TabPane>
        </Tabs>
      </div>
      <div class="bottom">
        <div class="contentCard pieChart">
          <div class="subtitleCard">登录频次</div>
          <div class="searchCard">
            <DatePicker type="date" v-model="loginDate" placeholder="请选择时间" style="width: 200px"></DatePicker>
          </div>
          <ve-pie :data="chartData"></ve-pie>
        </div>
        <div class="contentCard barChart">
          <div class="subtitleCard">互动人均</div>
          <!--<bar-chart :barType='"interaction"'></bar-chart>-->
          <ve-histogram :data="chartData2" :extend="chartExtend2" :legend-visible="false" v-if="chartData2.columns.length > 0"></ve-histogram>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/pageTitle'
  import barChart from '@/components/barChart'
    export default {
      name: "statistics",
      data(){
        this.chartExtend1 = {
          series: {
            label: { show: true, position: "top",color:'#000'},
            itemStyle:{color:'#3fab23'}
          }
        },
          this.chartExtend2 = {
            series: {
              label: { show: true, position: "top",color:'#000'},
              itemStyle:{color:'#f37d38'}
            }
          }
          return{
            titleText:'统计分析',
            chartData: {
              columns: [],
              rows: []
            },
            chartData1:{
              columns: [],
              rows: []
            },
            chartData2:{
              columns: [],
              rows: []
            },
            selectedPro:'银杏',
            projects:[{value: '银杏',label: '银杏'}],
            registerDoctor:'',
            doctorDate:'',
            loginDate:'',
            type:1
          }
      },
      components:{
        'bar-chart':barChart,
        'page-title':PageTitle
      },
      mounted(){
        this.getRegisterData();
        this.getPieData();
        this.getBarData1();
        this.getBarData2();
      },
      methods:{
        getRegisterData(){
          let vm = this;
          let postData = {};
          postData.project_name = vm.selectedPro;
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/statistics/userinfo',
            data:vm.$qs.stringify(postData)
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.registerDoctor = response.data.data;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        getPieData(){
          let vm = this;
          let postData = {};
          /*postData.time = vm.selectedPro;*/
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/statistics/getlogin',
            /*data:vm.$qs.stringify(postData)*/
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.chartData.rows = response.data.list.rows;
                vm.chartData.columns = response.data.list.columns;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        getBarData1(){
          let vm = this;
          let postData = {};
          /*postData.time = vm.selectedPro;*/
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/statistics/getcitys',
            /*data:vm.$qs.stringify(postData)*/
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.chartData1.rows = response.data.list.rows;
                vm.chartData1.columns = response.data.list.columns;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        getBarData2(){
          let vm = this;
          let postData = {};
          /*postData.time = vm.selectedPro;*/
          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+'admin/statistics/getinteractive',
            /*data:vm.$qs.stringify(postData)*/
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.chartData2.rows = response.data.list.rows;
                vm.chartData2.columns = response.data.list.columns;
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changeDate(e){
          console.info(e)
        },
        tabChange(name){
          let vm = this;
          vm.type = name;
        },
      }
    }
</script>

<style scoped>
  .mainContent{
    background-color: #ffffff;
    padding:20px;
  }

  .contentCard{
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    margin-top: 20px;
  }

  .chartHeight{
    height: 430px;
  }

  .registerCard{
    height: 150px;
  }

  .subtitleCard{
    background-color: #f8f8f9;
    padding: 8px 10px;
    color: #515151;
    font-size: 14px;
    border-bottom: 1px solid #e3e3e3;
  }

  .registerCard_left{
    height: 112px;
    border-right: 1px solid #e3e3e3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .registerCard_right{
    height: 112px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .font1{
    font-size: 14px;
    color: #515151;
  }

  .font2{
    font-size: 36px;
    color:#f99a34;
  }

  .font3{
    color:#f99a34;
  }

  .searchCard{
    text-align: right;
    padding-top: 5px;
  }

  .rotatetop{
    color: #51b213;
    display: inline-block;
  }

  .rotatedown{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* Internet Explorer */
    -moz-transform:rotate(180deg); /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg); /* Opera */
    color:#d75e42;
    display: inline-block;
  }

  .bottom{
    display: flex;
    justify-content: space-between;
  }

  .bottom .pieChart{
    width: 30%;
  }

  .bottom .barChart{
    width: 69%;
  }
</style>
