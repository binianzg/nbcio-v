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
    <erp-goods-property-item-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></erp-goods-property-item-form>
  </j-modal>
</template>

<script>

  import ErpGoodsPropertyItemForm from './ErpGoodsPropertyItemForm'
  export default {
    name: 'ErpGoodsPropertyItemModal',
    components: {
      ErpGoodsPropertyItemForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add (propertyId) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add(propertyId);
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