<template>
  <div class="databaseAdd">
    <Row>
      <Col span="12">
      <Form :model="formItem" :label-width="80">

        <FormItem class="form-label" label="标题：">
          <Row>
            <Col span="12">
          <Input v-model="formItem.input" placeholder="请输入标题"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="作者：">
          <Row>
            <Col span="12">
              <Input v-model="formItem.input" placeholder="请输入作者"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="关键词：">
          <Row>
            <Col span="12">
              <Input v-model="formItem.input" placeholder="请输入关键词"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请输入描述"></Input>
        </FormItem>
        <FormItem label="封面：">
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="md-image">上传图片</Button>
          </Upload>
        </FormItem>
        <FormItem label="内容：">
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" class="submit-button">提交</Button>
          <Button class="cancel-button">取消</Button>
        </FormItem>
      </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    name: "databaseAdd",
    data(){
      return{
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: ''
        }

      }

    },
    mounted(){

    },
    methods:{
      gotoDetail(routerName){
        this.$router.push({ name: routerName})
      }
    }
  }
</script>

<style scoped>

.submit-button{
  width: 100px;

}
.cancel-button{
  width: 100px;
  margin-left: 8px
}

</style>
