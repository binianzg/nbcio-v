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
    <bs-data-set-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></bs-data-set-form>
  </j-modal>
</template>

<script>

  import BsDataSetForm from './BsDataSetForm'
  export default {
    name: 'BsDataSetModal',
    components: {
      BsDataSetForm
    },
    data () {
      return {
        title:'',
        width:896,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add (type) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add(type);
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
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