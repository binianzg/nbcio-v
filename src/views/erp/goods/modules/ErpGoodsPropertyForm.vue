<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否必填" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isRequired">
              <j-dict-select-tag type="list" v-model="model.isRequired" dictCode="yn" placeholder="请选择是否必填" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="录入类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="columnType">
              <j-dict-select-tag type="list" v-model="model.columnType" dictCode="erp_goods_column_type" placeholder="请选择录入类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据类型 " :labelCol="labelCol" :wrapperCol="wrapperCol" prop="columnDataType">
              <j-dict-select-tag type="list" v-model="model.columnDataType" dictCode="erp_goods_column_data_type" placeholder="请选择数据类型 " />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="属性类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="propertyType">
              <j-dict-select-tag type="list" v-model="model.propertyType" dictCode="erp_goods_property_type" placeholder="请选择属性类别" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" dictCode="erp_status" placeholder="请选择状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'ErpGoodsPropertyForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
            status:1,
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           code: [
              { required: true, message: '请输入编号!'},
           ],
           name: [
              { required: true, message: '请输入名称!'},
           ],
           isRequired: [
              { required: true, message: '请输入是否必填!'},
           ],
           columnType: [
              { required: true, message: '请输入录入类型!'},
           ],
           propertyType: [
              { required: true, message: '请输入属性类别!'},
           ],
           status: [
              { required: true, message: '请输入状态!'},
           ],
        },
        url: {
          add: "/goods/erpGoodsProperty/add",
          edit: "/goods/erpGoodsProperty/edit",
          queryById: "/goods/erpGoodsProperty/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>