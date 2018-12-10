<template>
  <div>
    <Row>
      <Col span="4" offset="1">
        <DatePicker type="month" v-model="NewDate" placeholder="请选择月份" @on-change="changeNewDate" :clearable="false"></DatePicker>
      </Col>
    </Row>
    <ve-histogram :data="chartData" :extend="chartExtend" :legend-visible="false" v-if="chartData.rows.length > 0"></ve-histogram>
    <div class="dataEmpty" v-if="chartData.rows.length == 0">暂无数据</div>
  </div>
</template>

<script>
    export default {
      name: "barChart",
      data(){
        this.chartExtend = {
          series: {
            label: { show: true, position: "top",color:'#000'},
            itemStyle:{color:'#49c0c7'}
          },
          xAxis:{
          axisLabel:{
            interval:0
          }
        }
        };
        return{
          chartData: {
            columns: [],
            rows: []
          },
          NewDate:this.$commonTools.formatDate5(new Date()),
          postDate:''
        }
      },
      props:{
        tabType:''
      },
      mounted(){
        this.getBarData();
      },
      methods:{
        getBarData(newDate){
          let vm = this;
          vm.postDate = "";
          if(newDate == undefined){
            vm.postDate = vm.$commonTools.formatDate5(new Date());
          }else{
            vm.postDate = newDate;
          }
          let url = "";
          if(vm.tabType == '1'){
            url = 'admin/statistics/getcitys';
          }else if(vm.tabType == '3'){
            url = 'admin/visit/get_visits';
          }else if(vm.tabType == '4'){
            url = 'admin/lesson/get_lessons';
          }else if(vm.tabType == '5'){
            url = 'admin/cases/get_cases';
          }
          vm.$http.get(vm.$commonTools.g_restUrl+ url, {
            params: {
              time:vm.postDate
            }
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
        changeNewDate(e){
          this.getBarData(e);
        },
      }
    }
</script>

<style scoped>
  .dataEmpty{
    height: 350px;
    display: flex;
    font-size: 18px;
    font-weight: 600;
    justify-content: center;
    align-items: center;
  }
</style>
