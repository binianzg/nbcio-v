<template>
  <j-modal v-if = "approve"
    :title="title"
    :width="1200"
    :okText="okText"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleApprove"
    @cancel="handleCancel">
    <erp-in-sheet-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
  </j-modal>
  <j-modal v-else
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel">
    <erp-in-sheet-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
  </j-modal>
</template>

<script>

  import ErpInSheetForm from './ErpInSheetForm'

  export default {
    name: 'ErpInSheetModal',
    components: {
      ErpInSheetForm
    },
    data() {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        okText: "确定",
        approve: false,//审核
      }
    },
    methods:{
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
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
        this.$refs.realForm.handleOk();
      },
      handleApprove () {
        this.$refs.realForm.handleApprove();
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

<style scoped>
</style>