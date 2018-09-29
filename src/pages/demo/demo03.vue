<template>
    <div>
      <div class="title" ref="title">医生管理</div>
      <div class="cardDetail">
        <Row>
          <Col span="18">
            <Row class="rowBottom">
              <Col span="8">姓名：<span class="spanFont">张三</span></Col>
              <Col span="8">编号：<span class="spanFont">67889</span></Col>
              <Col span="8">性别：<span class="spanFont">女</span></Col>
            </Row>
            <Row class="rowBottom">
              <Col span="8">医院：<span class="spanFont">北京大学第一附属医院</span></Col>
              <Col span="8">科室：<span class="spanFont">胸外科</span></Col>
              <Col span="8">职称：<span class="spanFont">副主任医师</span></Col>
            </Row>
            <Row class="rowBottom">
              <Col span="8">手机号：<span class="spanFont">18900987654</span></Col>
              <Col span="8">邮箱：<span class="spanFont">18900987654@163.com</span></Col>
              <Col span="8">微信号：<span class="spanFont">18900987654</span></Col>
            </Row>
            <Row class="rowBottom">
              <Col span="8">拜访记录：<span class="spanFont">57</span></Col>
              <Col span="8">微课记录：<span class="spanFont">15</span></Col>
              <Col span="8">累计积分：<span class="spanFont">204</span></Col>
            </Row>
            <Row class="rowBottom">
              <Col span="8">互动记录：<span class="spanFont">57</span></Col>
              <Col span="8">负责销售：<span class="spanFont">郑萌萌</span></Col>
            </Row>
            <Row>
              <Col span="8">标签：<span class="spanFont">老中医 全国十佳 省医院</span></Col>
            </Row>
          </Col>
          <Col span="6"><img src="../../../static/images/1.png" style="height: 20vh;"></Col>
        </Row>
      </div>
      <div class="tabDiv">
        <Tabs value="name1">
          <TabPane label="标签一" name="name1">标签一的内容</TabPane>
          <TabPane label="标签二" name="name2">标签二的内容</TabPane>
          <TabPane label="标签三" name="name3">标签三的内容</TabPane>
        </Tabs>
      </div>
    </div>
</template>

<script>
    export default {
        name: "demo03"
    }
</script>

<style scoped>
  .title{
    font-size: 1rem;
    color: #908e8e;
    margin-bottom: 10px;
  }

  .cardDetail{
    background-color: #fff;
    padding: 3vh 5vh;
    font-size: 0.88rem;

  }

  .rowBottom{
    margin-bottom: 5px;
  }

  .spanFont{
    font-weight: 600;
  }

  .tabDiv{
    margin-top: 14px;
  }
</style>
