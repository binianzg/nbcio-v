<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportName">
              <a-input v-model="model.reportName" placeholder="请输入名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportCode">
              <a-input v-model="model.reportCode" placeholder="请输入编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportType">
              <j-dict-select-tag type="list" v-model="model.reportType" dictCode="bs_report_type" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="作者" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportAuthor">
              <a-input v-model="model.reportAuthor" placeholder="请输入作者"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" dictCode="erp_status" placeholder="请选择状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportDesc">
              <a-input v-model="model.reportDesc" placeholder="请输入描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="缩略图" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportImage">
              <a-input v-model="model.reportImage" placeholder="请输入缩略图"  ></a-input>
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
    name: 'BsReportForm',
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
            reportType:"1",
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
           reportName: [
              { required: true, message: '请输入名称!'},
           ],
           reportCode: [
              { required: true, message: '请输入编码!'},
           ],
           reportType: [
              { required: true, message: '请输入类型!'},
           ],
           status: [
              { required: true, message: '请输入状态!'},
           ],
        },
        url: {
          add: "/bs/bsReport/add",
          edit: "/bs/bsReport/edit",
          queryById: "/bs/bsReport/queryById"
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