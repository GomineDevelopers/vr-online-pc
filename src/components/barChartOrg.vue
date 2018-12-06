<template>
  <div>
    <Row>
      <Col span="4" offset="1">
        <DatePicker type="year" v-model="NewYear" placeholder="请选择年份" @on-change="changeNewYear"></DatePicker>
      </Col>
    </Row>
    <ve-histogram :data="chartData" :extend="chartExtend" :legend-visible="false" v-if="chartData.rows.length > 0"></ve-histogram>
    <div class="dataEmpty" v-if="chartData.rows.length == 0">暂无数据</div>
  </div>
</template>

<script>
    export default {
      name: "barChartOrg",
      data(){
        this.chartExtend = {
          series: {
            label: { show: true, position: "top",color:'#000'},
            itemStyle:{color:'#f37d38'}
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
          NewYear:''
        }
      },
      mounted(){
        this.getBarData();
      },
      props:{
        tabType:''
      },
      methods:{
        getBarData(newYear){
          let vm = this;
          let url = '';
          if(vm.tabType == '1'){
            url = 'admin/statistics/getinteractive';
          }else if(vm.tabType == '2'){
            url = 'admin/statistics/getinteractiveavg?type=avg';
          }else if(vm.tabType == '3'){
            url = 'admin/statistics/getinteractiveavg?type=totalavg';
          }

          vm.$http.get(vm.$commonTools.g_restUrl+ url, {
            params: {
              time:newYear == ''?undefined:newYear
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
        changeNewYear(e){
          this.getBarData(e);
        }
      }
    }
</script>

<style scoped>
  .dataEmpty{
    height: 400px;
    display: flex;
    font-size: 18px;
    font-weight: 600;
    justify-content: center;
    align-items: center;
  }
</style>
