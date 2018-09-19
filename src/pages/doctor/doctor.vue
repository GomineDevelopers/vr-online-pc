<template>
      <div>
      <div class="title" ref="title">医生管理</div>
      <div class="searchCard" ref="searchCard">
        所属医院：<Input v-model="name" clearable class="inputStyle"/>
        医生姓名：<Input v-model="name" clearable class="inputStyle"/>
        负责销售：<Input v-model="name" clearable class="inputStyle"/>
        医生编号：<Input v-model="name" clearable class="inputStyle"/>
        医生手机：<Input v-model="name" clearable class="inputStyle"/>
        <Button type="success">搜索</Button>
        <Button type="warning">重置</Button>
      </div>
      <div class="tableDiv" :style="{height:tableBgH+'px'}">
        <div class="buttonDiv" ref="buttonDiv">
          <Button icon="md-add" @click="showLabel">添加标签</Button>
          <Button icon="md-albums">新增互动记录</Button>
        </div>
        <Table ref="selection" :columns="columns2" :data="data2"  @on-select="selected" @on-select-cancel="unSelected" :height="tableH"></Table>
        <div class="pageDiv" ref="pageDiv">
          <Page :total="100" show-elevator @on-change="changePage"/>
        </div>
      </div>

      <Modal v-model="labelModel" draggable scrollable title="请输入您需要添加的标签" @on-ok="addLabel" >
        <div class="labelDiv">
          <Row type="flex" justify="center">
         <i-col span="15" class="tag-row">
            <label >请选择一级标签：</label>
            <Select v-model="tag" clearable style="width:200px">
                  <Option v-for="(item,index) in tagData" :value="item.name" :key="index">{{ item.name }}</Option>
            </Select>
         </i-col>
        <i-col span="15" class="tag-row">
          <label >请选择二级标签：</label>
          <Select v-model="subtag" clearable style="width:200px">
                <Option v-for="(item,index) in tagData" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
          </i-col>
          </Row>
         </div>
      </Modal>
    </div>
</template>

<script>
export default {
  name: "doctor",
  data() {
    return {
      name: "",
      tableBgH: "",
      tableH: "",
      labelModel: false,
      selections: [],
      tag: "",
      subtag: "",
      tagData: [
        { name: "老中医" },
        { name: "省医" },
        { name: "县医" },
        { name: "全国十佳" },
        { name: "老中医" },
        { name: "省医" },
        { name: "县医" },
        { name: "全国十佳" },
        { name: "老中医" }
      ],
      subTagData: [
        { name: "老中医" },
        { name: "省医" },
        { name: "县医" },
        { name: "全国十佳" },
        { name: "老中医" },
        { name: "省医" },
        { name: "县医" },
        { name: "全国十佳" },
        { name: "老中医" }
      ],
      data2: [],
      curPage: 1,
      columns2: [
        { type: "selection", width: 60, align: "center" },
        { title: "编号", key: "title" },
        {
          title: "微信号",
          key: "id",
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.id >= 10;
            } else if (value === 2) {
              return row.id < 10;
            }
          }
        },
        { title: "姓名", key: "contents" },
        { title: "浏览次数", key: "total" },
        {
          title: "妇科专家",
          key: "action",
          filters: [
            {
              label: "大量门诊",
              value: 1
            },
            {
              label: "中医",
              value: 2
            },
            {
              label: "外科专家",
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.age > 25;
            } else if (value === 2) {
              return row.age < 25;
            }
          }
        },
        {
          title: "医院",
          key: "hospitalName"
        },
        {
          title: "科室",
          key: "unit"
        },
        {
          title: "职称",
          key: "title"
        },
        {
          title: "手机号",
          key: "phoneNumber"
        },
        {
          title: "邮箱",
          key: "Email"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "ios-information-circle",
                  size: "20"
                },
                style: {
                  marginLeft: "5px",
                  color: "#4fb115"
                }
              }),
              h("Icon", {
                props: {
                  type: " icon iconfont icon-ziliao"
                },
                style: {
                  marginLeft: "5px",
                  color: "#4fb115"
                },
                click: () => {
                  this.show(params.index);
                }
              }),
              h(
                "Icon",
                {
                  props: {
                    custom: "icon iconfont icon-shanchu"
                  },
                  style: {
                    marginLeft: "5px",
                    color: "#4fb115"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.getBgHeight();
    this.getData2();
  },
  methods: {
    getBgHeight() {
      let vm = this;
      vm.tableBgH =
        document.documentElement.clientHeight -
        64 -
        24 * 2 -
        (vm.$refs.title.offsetHeight + 10) -
        (vm.$refs.searchCard.offsetHeight + 26) -
        2;
      vm.tableH =
        vm.tableBgH -
        (vm.$refs.buttonDiv.offsetHeight + 10 * 2) -
        (vm.$refs.pageDiv.offsetHeight + 10 * 2) -
        10;
    },
    getData2() {
      let vm = this;
      this.$http
        .get(vm.$commonTools.g_restUrl, {
          params: {
            i: "8",
            c: "entry",
            p: "article",
            do: "shop",
            m: "ewei_shop",
            ccate: 35, //分类
            page: vm.curPage
          }
        })
        .then(function(response) {
          vm.data2 = response.data.result.list;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selected(selection, row) {
      this.selections = selection;
    },
    unSelected(selection, row) {
      this.selections = selection;
    },
    changePage(curPage) {
      this.curPage = curPage;
      this.getData2();
    },
    showLabel() {
      let vm = this;
      vm.labelModel = true;
    },
    tagValidate() {
      let vm = this;
      let msg = "";
      if (vm.selections.length == 0) {
        msg = "未选择医生";
        this.$Message.warning(msg);
        return false;
      } else if (!vm.tag) {
        msg = "未选择一级标签";
        this.$Message.warning(msg);
        return false;
      } else if (!vm.subtag) {
        msg = "未选择二级标签";
        this.$Message.warning(msg);
        return false;
      } else {
        return true;
      }
    },
    addLabel() {
      let vm = this;
      if (vm.tagValidate()) {
        this.$Message.success("添加标签成功");
        // ajax请求发送
      }
    },
    remove(index) {
      this.data2.splice(index, 1);
    }
  }
};
</script>


<style scoped>
.title {
  font-size: 1rem;
  color: #908e8e;
  margin-bottom: 10px;
}

.searchCard {
  background-color: #fff;
  height: 8vh;
  line-height: 8vh;
  padding: 0 3vh;
  white-space: nowrap;
}

.tableDiv {
  background-color: #fff;
  margin-top: 26px;
  padding: 2vh;
}

.pageDiv {
  margin: 10px;
  text-align: right;
}

.inputStyle {
  width: 10vw;
}

.buttonDiv {
  text-align: right;
  margin-bottom: 10px;
}

.activeitem::before {
  font-style: normal;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  content: "\2713";
  position: absolute;
  top: 0px;
  right: 2px;
  color: #ffffff;
  z-index: 1;
  font-size: 12px;
}

.activeitem::after {
  content: "";
  position: absolute;
  top: 1px;
  right: 0;
  width: 0;
  height: 0;
  border-top: 20px solid #65b81b;
  border-left: 24px solid transparent;
}

.tagDiv {
  position: relative;
  display: inline-block;
  margin: 5px;
}
.tag-row {
  margin: 0.5vh 0;
}
</style>

