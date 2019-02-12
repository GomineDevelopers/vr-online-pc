<template>
  <div>
    <ve-histogram :data="chartData" :extend="chartExtend" :legend-visible="false" v-if="chartData.rows.length > 0"></ve-histogram>
    <div class="dataEmpty" v-if="chartData.rows.length == 0">暂无数据</div>
  </div>
</template>

<script>
    export default {
      name: "barChartGreen",
      data(){
        this.chartExtend = {
          series: {
            label: { show: true, position: "top",color:'#000'},
            itemStyle:{color:'#3fab23'}
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
          }
        }
      },
      mounted(){
        this.getBarData();
      },
      methods:{
        getBarData(selectedDate,selectedProvince){
          let vm = this;

          vm.$http.get(vm.$commonTools.g_restUrl+ 'admin/statistics/getcitys', {
            params: {
              time:selectedDate,
              province:selectedProvince,
              type:'endmonth'
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
        }
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
