<template>
  <div class="databaseAdd">
    <Row>
      <Col span="12">
      <Form :model="formItem" :label-width="80">

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
          <div id="app">
            <VueUEditor @ready="editorReady" style="height: 400px"></VueUEditor>
          </div>
        </FormItem>
        <FormItem>
          <Button type="primary" class="submit-button" @click="addData()">提交</Button>
          <Button class="cancel-button">取消</Button>
        </FormItem>
      </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
  import VueUEditor from '@/components/UEditor';
  export default {
    name: "databaseAdd",
    components: { VueUEditor },
    data(){
      return{
        formItem: {
          title: '',
          author: '',
          keyWords: '',
          description: '',
        },

        postImgUrl:"",
        serverImgUrl:'http://icampaign.com.cn/customers/noob_system/admin/images/add_images',
        visible: false,
      //  富文本编辑器
        postContent:''
      }

    },
    mounted(){

    },

    methods:{
      gotoDetail(routerName){
        this.$router.push({ name: routerName})
      },
      //图片上传插件
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove () {
        this.postImgUrl='';
      },
      handleSuccess (res, file) {
        file.url = res.path;
        file.name = res.filename;
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

      },
      //图片上传插件
      addData(){
       let vm=this;
        vm.$http.post(vm.$commonTools.g_restUrl+'admin/database/database_edit',{
          params:{
           title:vm.formItem.title,
           auth:vm.formItem.author,
           keywords:vm.formItem.keyWord,
           description:vm.formItem.description,
           cover:vm.imgName,

         }
       }) .then(function(response) {

       })
         .catch(function(error) {
           console.log(error);
         });
      },
      //富文本编辑
      editorReady (editorInstance) {
        let vm=this;
        editorInstance.setContent('Hello world!<br>你可以在这里初始化编辑器的初始内容。');
        vm.postContent= editorInstance.getContent()
        editorInstance.addListener('contentChange', () => {
          console.log('编辑器内容发生了变化：', editorInstance.getContent());
        });
      }
    }
  }
</script>

<style scoped>
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
</style>
