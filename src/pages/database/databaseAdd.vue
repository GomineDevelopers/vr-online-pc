<template>
  <div>
    <Row>
      <div class="title" ref="title">添加资料</div>
    </Row>
    <div class="databaseAdd" >
    <Row>
      <Col span="12">
      <Form :model="formItem" class="form-style" :label-width="80">

        <FormItem class="form-label" label="标题：">
          <Row>
            <Col span="12">
          <Input v-model="formItem.title" placeholder="请输入标题"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="作者：">
          <Row>
            <Col span="12">
              <Input v-model="formItem.author" placeholder="请输入作者"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="关键词：">
          <Row>
            <Col span="12">
              <Input v-model="formItem.keyWords" placeholder="请输入关键词"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请输入描述"></Input>
        </FormItem>
        <FormItem label="封面：">
          <Upload
            :action=serverImgUrl
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
          >
            <Button icon="md-image">上传图片</Button> <Button v-if="postImgUrl" icon="md-trash" type="text" @click.stop="handleRemove">删除图片</Button>
          </Upload>
        </FormItem>
        <FormItem v-if="postImgUrl" >
          <img :src="postImgUrl" class="thumb" />
        </FormItem>
        <FormItem label="内容：">
          <vue-ueditor-wrap v-model="postContent" :config="myConfig"></vue-ueditor-wrap>
        </FormItem>
        <FormItem>
          <Button type="primary" class="submit-button" @click="addData()">提交</Button>
          <!--<Button class="cancel-button">取消</Button>-->
        </FormItem>
      </Form>
      </Col>
    </Row>
    </div>
  </div>
</template>
<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  export default {
    name: "databaseAdd",
    components: { VueUeditorWrap},
    data(){
      return{
        formItem: {
          title: '',
          author: '',
          keyWords: '',
          description: '',

        },

        postImgUrl:"",
        serverImgUrl:'http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/images/add_images',
        visible: false,
      //  富文本编辑器
        imgName:'',
        existedUrl:'',
        postContent:'',
        myConfig: {
          // 如果需要上传功能,找后端小伙伴要服务器接口地址
           serverUrl: 'http://icampaign.com.cn/customers/vrOnlinePc/backend/ueditor/php/controller.php',
          // 你的UEditor资源存放的路径,相对于打包后的index.html
          UEDITOR_HOME_URL: './static/UEditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: true,
          // 初始容器高度
          initialFrameHeight: 340,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 关闭自动保存
          enableAutoSave: false
        }
      }

    },
    mounted(){
      this.handleExistedData()
    },

    methods:{
      handleRemove () {
        this.postImgUrl='';
      },
      handleSuccess (res, file) {
        file.url = res.path;
        file.name = res.filename;
        this.imgName= res.filename;
        this.postImgUrl=res.path;
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: 'File format of ' + file.name + ' 文件类型错误，请选择 JPG PNG格式图片'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件大小超过限制',
          desc: 'File  ' + file.name + ' 图片过大，请选择图片小于2M的图片.'
        });
      },
      handleBeforeUpload () {

      },//图片上传插件
      validator: function () {
        let vm = this;
        let msg = "";
        if (!vm.formItem.title) {
          msg = "未填写标题";
        } else if (!vm.formItem.keyWords) {
          msg = "未填写关键字";
        } else if (!vm.postImgUrl) {
          msg = "未上传图片";
        } else if (!vm.postContent) {
          msg = "未填写富文本内容";
        }
        if (msg) {
          vm.$Message.warning(msg);
          return false;
        } else {
          return true;
        }
      },
      addData(){
          let vm=this;
          let postData = {};
          postData.title=vm.formItem.title,
          postData.auth=vm.formItem.author,
          postData.keywords=vm.formItem.keyWords,
          postData.description=vm.formItem.description,
          postData.cover=vm.imgName
          postData.content=vm.postContent

       if(vm.validator()) {
         vm.$http({
           method: "post",
           url:vm.$commonTools.g_restUrl+"admin/database/database_edit",
           data:vm.$qs.stringify(postData),
         }).then(function (response) {
           if (response.data.code=="200"){
             vm.$router.push({name: "DataBaseList"})
             vm.$Message.success("添加成功");
           }
         }).catch(function (error) {
           console.log(error)
         })
       }else {

       }
      },
      //富文本编辑


      handleExistedData(){
        var vm=this;
        if(vm.$route.params.editId){
        vm.$http({
          method: "get",
          url:vm.$commonTools.g_restUrl+"admin/database/database_detail",
          params:{
           id: vm.$route.params.editId
          },

        }).then(function (response) {
          if (response.data.code=="200"){
            let temp=response.data.data
            vm.formItem.title=temp.title,
            vm.formItem.author=temp.auth,
            vm.formItem.keyWords=temp.keywords,
            vm.formItem.description=temp.description,
            vm.postImgUrl=temp.path_cover,
            vm.imgName=temp.cover
            vm.postContent=temp.content
          }
        }).catch(function (error) {
          console.log(error)

        })
    }
      }
    }
  }
</script>

<style scoped>
  .title {
    font-size: 1.25rem;
    color: #adb3a8;
    margin-bottom: 10px;
    background-color: #f5fbfa;
  }
  .databaseAdd{
    height: fit-content;
    background-color: #FFFFFF;
    padding: 2vh 2vw;

  }
.thumb{
  max-width: 100%;
  max-height: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1%;
}

.submit-button{
  width: 100px;

}
.ivu-form-item {
  margin-bottom: 14px;
}
.cancel-button{
  width: 100px;
  margin-left: 8px
}
.ivu-upload button{
  color: #3fab23;
}
.smeditor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
  .form-style{
    min-width: 700px;
  }
</style>
