<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <template #footer><!--增加自定义按钮-->
      <a-button  @click="handleCancel">取消</a-button>
      <a-button v-if="disDelete" type="primary" @click="handleDelete">删除</a-button>
      <a-button v-if="disOk" type="primary" @click="handleOk">确定</a-button>
    </template>
    <oa-schedule-form ref="realForm" :inStart="startTime" :inEnd="endTime" @ok="submitCallback" :disabled="disableSubmit"></oa-schedule-form>
  </j-modal>
</template>


<script>

  import OaScheduleForm from './OaScheduleForm'
  export default {
    name: 'OaScheduleModal',
    components: {
      OaScheduleForm
    },
    props: {
      //表单初始时间
      startTime: {
        type: String,
        default: "",
        required: false
      },
      endTime: {
        type: String,
        default: "",
        required: false
      },
    },
    data () {
      return {
        title:'',
        width:896,
        visible: false,
        disableSubmit: false,
        disDelete: false,
        disOk: false
      }
    },
    methods: {
      add () {
        this.disDelete=false
        this.disOk = true
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
          //this.$refs.realForm.initTime(this.startTime,this.endTime);
        })
      },
      edit (record) {
        this.disDelete=true
        this.disOk = true
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      handleDetail() {
        this.disDelete=false
        this.disOk=false
      },  
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleDelete() {
        let id = this.$refs.realForm.getId();
        console.log("handleDelete id=",id);
        this.$emit('deleteSchedule',id);
        this.close();
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>