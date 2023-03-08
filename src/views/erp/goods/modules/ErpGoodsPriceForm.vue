<template>
  <j-form-container :disabled="disabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="采购价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="purchase">
              <a-input-number v-model="model.purchase" placeholder="请输入采购价" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="销售价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sale">
              <a-input-number v-model="model.sale" placeholder="请输入销售价" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="零售价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="retail">
              <a-input-number v-model="model.retail" placeholder="请输入零售价" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
  </j-form-container>
</template>
<script>
  import { getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import { VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'

  export default {
    name: 'ErpGoodsPriceForm',
    components: {
      JFormContainer
    },
    props:{
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model: {
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        validatorRules: {
           purchase: [
              { required: true, message: '请输入采购价!'},
           ],
           sale: [
              { required: true, message: '请输入销售价!'},
           ],
           retail: [
              { required: true, message: '请输入零售价!'},
           ],
        },
        confirmLoading: false,
      }
    },
    created () {
     //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods:{
      initFormData(url,id){
        this.clearFormData()
        if(!id){
         this.edit(this.modelDefault);
        }else{
          getAction(url,{id:id}).then(res=>{
            if(res.success){
              let records = res.result
              if(records && records.length>0){
                this.edit(records[0])
              }
            }
          })
        }
      },
      edit(record){
        this.model = Object.assign({}, record)
        console.log("ErpGoodsPriceForm-edit",this.model);
      },
      getFormData(){
        let formdata_arr = []
        this.$refs.form.validate(valid => {
          if (valid) {
            let isNullObj = true
            Object.keys(this.model).forEach(key=>{
              if( this.model[key]){
                isNullObj = false
              }
            })
            if(!isNullObj){
              formdata_arr.push(this.model)
            }
          }else{
            this.$emit("validateError","商品价格信息表单校验未通过");
            return false
          }
        })
        return formdata_arr;
      },
      validate(index){
        return new Promise((resolve, reject) => {
          // 验证主表表单
         this.$refs.form.validate(valid => {
            !valid ? reject({ error: VALIDATE_NO_PASSED ,index}) : resolve()
          })
        }).then(values => {
          return Promise.resolve()
        }).catch(error => {
          return Promise.reject(error)
        })
      },
      clearFormData(){
        this.$refs.form.clearValidate()
      },
    }
  }
</script>
