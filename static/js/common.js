const commonTools = {};

/*commonTools.g_restUrl = 'http://icampaign.com.cn/customers/minge/ming/app/index.php';*/

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
export {
  commonTools
}
