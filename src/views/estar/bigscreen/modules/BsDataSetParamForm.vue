<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="数据集编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="setCode">
              <a-input v-model="model.setCode" placeholder="请输入数据集编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参数名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramName">
              <a-input v-model="model.paramName" placeholder="请输入参数名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参数描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramDesc">
              <a-input v-model="model.paramDesc" placeholder="请输入参数描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参数类型，字典=" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramType">
              <a-input v-model="model.paramType" placeholder="请输入参数类型，字典="  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参数示例项" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleItem">
              <a-input v-model="model.sampleItem" placeholder="请输入参数示例项"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="0--非必填 1--必填 DIC_NAME=REQUIRED_FLAG" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="requiredFlag">
              <a-input-number v-model="model.requiredFlag" placeholder="请输入0--非必填 1--必填 DIC_NAME=REQUIRED_FLAG" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="js校验字段值规则，满足校验返回 true" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="validationRules">
              <a-input v-model="model.validationRules" placeholder="请输入js校验字段值规则，满足校验返回 true"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderNum">
              <a-input-number v-model="model.orderNum" placeholder="请输入排序" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="0--已禁用 1--已启用  DIC_NAME=ENABLE_FLAG" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="enableFlag">
              <a-input-number v-model="model.enableFlag" placeholder="请输入0--已禁用 1--已启用  DIC_NAME=ENABLE_FLAG" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="0--未删除 1--已删除 DIC_NAME=DELETE_FLAG" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="deleteFlag">
              <a-input-number v-model="model.deleteFlag" placeholder="请输入0--未删除 1--已删除 DIC_NAME=DELETE_FLAG" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="version" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="version">
              <a-input-number v-model="model.version" placeholder="请输入version" style="width: 100%" />
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
    name: 'BsDataSetParamForm',
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
        },
        url: {
          add: "/bs/bsDataSetParam/add",
          edit: "/bs/bsDataSetParam/edit",
          queryById: "/bs/bsDataSetParam/queryById"
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