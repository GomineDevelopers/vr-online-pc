<template>
  <ve-histogram :data="chartData" :extend="chartExtend" :legend-visible="false" v-if="chartData.columns.length > 0"></ve-histogram>
</template>

<script>
    export default {
      name: "barChart",
      data(){
        this.chartExtend = {
          series: {
            label: { show: true, position: "top",color:'#000'},
            itemStyle:{color:'#49c0c7'}
          }
        }
        return{
          chartData: {
            columns: [],
            rows: []
          }
        }
      },
      props:{
        tabType:''
      },
      mounted(){
        this.getBarData();
      },
      methods:{
        getBarData(){
          let vm = this;
          let url = "";
          if(vm.tabType == '1'){
            url = 'admin/statistics/getcitys';
          }else if(vm.tabType == '3'){
            url = 'admin/statistics/getcitys';
          }else if(vm.tabType == '4'){
            url = 'admin/statistics/getcitys';
          }

          this.$http({
            method:"post",
            url:vm.$commonTools.g_restUrl+ url,
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

        }
      }
    }
</script>

<style scoped>

</style>
