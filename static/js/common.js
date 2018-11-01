const commonTools = {};

//线上地址
commonTools.g_restUrl = 'http://icampaign.com.cn/customers/vrOnlinePc/backend/';

commonTools.formatDate = function (date, showDetail) {
  var isShow = showDetail || false;
  var d = new Date(parseInt(date) * 1000)
  var year = d.getFullYear();
  var month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
  var date1 = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
  var hour = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
  var minute = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();
  var second = d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds();
  if (isShow)
    return year + "-" + month + "-" + date1 + " " + hour + ":" + minute + ":" + second;
  else
    return year + "-" + month + "-" + date1 + " " + hour + ":" + minute;
}

commonTools.formatHour = function (date) {
  var d = new Date(parseInt(date) * 1000);
  var month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
  var date1 = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
  var hour = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
  var minute = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();
  var second = d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds();
  return month + "-" + date1 + " " + hour + ":" + minute;
}

commonTools.formatDate2 = function (date) {
  var d = new Date(parseInt(date) * 1000)
  var year = d.getFullYear();
  var month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
  var date1 = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();

  return year + "年" + month + "月" + date1 + "日";
}

commonTools.formatDate3 = function (d) {
  /*var d = new Date(parseInt(date)*1000);*/
  var year = String(d.getFullYear());
  var month = String(d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1));
  var date1 = String(d.getDate() > 9 ? d.getDate() : "0" + d.getDate());
  return year + month + date1 ;
}

commonTools.setBtnLimit = function (name) {
  var btnLimit = [];
  JSON.parse(window.localStorage.getItem("limits")).forEach(function (ele,index,arr) {
    if(ele.url != "" && ele.url == name){//只有一级菜单
      btnLimit = ele.children;
    }else if(ele.url == "" && ele.children.length>0){
      ele.children.forEach(function (eleC) {
        if(eleC.url == name){
          btnLimit = eleC.children;
        }
      });
    }
  });
  return btnLimit;
}
export {
  commonTools
}
