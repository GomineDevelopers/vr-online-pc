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
                <!--{{registerDoctor.today_add}}&nbsp;({{registerDoctor.today_percentage}}%)
                <div class="rotatetop" v-if="registerDoctor.today_status == '1'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div class="rotatedown" v-else-if="registerDoctor.today_status == '0'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div v-else="registerDoctor.today_status == ''">-</div>-->
              </div>
              <!--<div>[好友医生：<span class="font3">？</span>]</div>-->
            </div>
          </Col>
          <Col span="12">
            <div class="registerCard_right">
              <div class="font1">
                本月新增&emsp;<span class="font2" v-text="registerDoctor.month_add"></span>
                <!--{{registerDoctor.last_add}}&nbsp;({{registerDoctor.month_percentage}}%)
                <div class="rotatetop" v-if="registerDoctor.month_status == '1'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div class="rotatedown" v-else-if="registerDoctor.month_status == '0'"><i class="icon iconfont icon-jiantou-top"></i></div>
                <div v-else="registerDoctor.month_status == ''">-</div>-->
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div class="contentCard chartHeight">
        <div class="subtitleCard">医生分布</div>
        <div class="searchCard">
          <Row>
            <Col span="4" offset="1">
              <DatePicker type="month" v-model="doctorDate" placeholder="请选择月份" @on-change="changeDate"></DatePicker>
            </Col>
            <Col span="3">
              <Select clearable v-model="province" @on-change="changeProvince">
                <Option v-for="item in provinces" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
          </Row>
        </div>
        <bar-chart-green ref="c1"></bar-chart-green>
      </div>
      <div class="contentCard chartHeight">
        <Tabs value="1" @on-click="tabChange" :animated="false">
          <TabPane label="新增医生" name="1">
            <bar-chart :tabType="type" v-if="type == 1"></bar-chart>
          </TabPane>
          <!--<TabPane label="流失医生" name="2">待开发</TabPane>-->
          <TabPane label="新增拜访" name="3">
            <bar-chart :tabType="type" v-if="type == 3"></bar-chart>
          </TabPane>
          <TabPane label="新增微课" name="4">
            <bar-chart :tabType="type" v-if="type == 4"></bar-chart>
          </TabPane>
          <TabPane label="新增病例" name="5">
            <bar-chart :tabType="type" v-if="type == 5"></bar-chart>
          </TabPane>
        </Tabs>
      </div>
      <div class="bottom">
        <div class="contentCard pieChart">
          <div class="subtitleCard">登录频次</div>
          <div class="searchCard">
            <Row>
              <Col span="9" offset="2">
                <DatePicker type="month" v-model="loginDate" placeholder="请选择月份" @on-change="changeDateLogin"></DatePicker>
              </Col>
            </Row>
          </div>
          <ve-pie :data="chartData" :extend="chartExtend" v-if="chartData.rows.length > 0"></ve-pie>
          <div class="dataEmpty" v-if="chartData.rows.length == 0">暂无数据</div>
        </div>
        <div class="contentCard barChart">
          <Tabs value="1" @on-click="tabChangeOrg" :animated="false">
            <TabPane label="总互动" name="1">
              <bar-chart-org :tabType="typeOrg" v-if="typeOrg == 1"></bar-chart-org>
            </TabPane>
            <TabPane label="人均互动" name="2">
              <bar-chart-org :tabType="typeOrg" v-if="typeOrg == 2"></bar-chart-org>
            </TabPane>
            <TabPane label="总人均" name="3">
              <bar-chart-org :tabType="typeOrg" v-if="typeOrg == 3"></bar-chart-org>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/pageTitle'
  import barChart from '@/components/barChart'
  import barChartGreen from '@/components/barChartGreen'
  import barChartOrg from '@/components/barChartOrg'
  import areaList from "../../../static/js/area3.js"
    export default {
      name: "statistics",
      data(){
        this.chartExtend = {
          legend: {
            show:false
          }
        };
          return{
            titleText:'统计分析',
            selectedPro:'银杏',
            projects:[{value: '银杏',label: '银杏'}],
            province:'',
            provinces:areaList,
            doctorDate:'',
            chartData: {
              columns: [],
              rows: []
            },
            registerDoctor:'',
            loginDate:'',
            postDatePie:'',
            type:1,
            typeOrg:1,
          }
      },
      components:{
        'bar-chart':barChart,
        'page-title':PageTitle,
        'bar-chart-green':barChartGreen,
        'bar-chart-org':barChartOrg
      },
      mounted(){
        this.getRegisterData();
        this.getPieData();
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
        getPieData(pieDate){
          let vm = this;
          vm.$http.get(vm.$commonTools.g_restUrl+ 'admin/statistics/getlogin', {
            params: {
              time:pieDate == ''?undefined:pieDate
            }
          })
            .then(function(response) {
              if(response.data.code == 200){
                vm.chartData.rows = response.data.list.rows;
                vm.chartData.columns = response.data.list.columns;
                vm.$Loading.finish();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        changeDate(e){
          this.doctorDate = e;
          this.$refs.c1.getBarData(this.doctorDate,this.province);
        },
        changeProvince(e){
          this.province = e;
          this.$refs.c1.getBarData(this.doctorDate,this.province);
        },
        changeDateLogin(e){
          this.getPieData(e);
        },
        tabChange(name){
          let vm = this;
          vm.type = name;
        },
        tabChangeOrg(name){
          let vm = this;
          vm.typeOrg = name;
        }
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

  /*.font3{
    color:#f99a34;
  }*/

  .searchCard{
    /*text-align: right;*/
    padding-top: 5px;
  }

  /*.rotatetop{
    color: #51b213;
    display: inline-block;
  }*/

  /*.rotatedown{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); !* Internet Explorer *!
    -moz-transform:rotate(180deg); !* Firefox *!
    -webkit-transform:rotate(180deg); !* Safari 和 Chrome *!
    -o-transform:rotate(180deg); !* Opera *!
    color:#d75e42;
    display: inline-block;
  }*/

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

  .dataEmpty{
    height: 400px;
    display: flex;
    font-size: 18px;
    font-weight: 600;
    justify-content: center;
    align-items: center;
  }
</style>
