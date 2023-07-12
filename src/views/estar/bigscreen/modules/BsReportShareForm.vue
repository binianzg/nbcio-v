<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="分享编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shareCode">
              <a-input v-model="model.shareCode" placeholder="请输入分享编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享有效期类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shareValidType">
              <j-dict-select-tag type="list" v-model="model.shareValidType" dictCode="bs_share_vaild" placeholder="请选择分享有效期类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shareValidTime">
              <j-date placeholder="请选择分享有效期" v-model="model.shareValidTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享token" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shareToken">
              <a-input v-model="model.shareToken" placeholder="请输入分享token"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享url" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shareUrl">
              <a-input v-model="model.shareUrl" placeholder="请输入分享url"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sharePassword">
              <a-input v-model="model.sharePassword" placeholder="请输入分享码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报表编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportCode">
              <a-input v-model="model.reportCode" placeholder="请输入报表编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" dictCode="erp_status" placeholder="请选择状态" />
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
    name: 'BsReportShareForm',
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
            status:"1",
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
          add: "/bs/bsReportShare/add",
          edit: "/bs/bsReportShare/edit",
          queryById: "/bs/bsReportShare/queryById"
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