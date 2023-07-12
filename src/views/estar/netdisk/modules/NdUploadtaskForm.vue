<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="扩展名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="extendname">
              <a-input v-model="model.extendname" placeholder="请输入扩展名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filename">
              <a-input v-model="model.filename" placeholder="请输入文件名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件路径" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filepath">
              <a-input v-model="model.filepath" placeholder="请输入文件路径"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="md5唯一标识" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="identifier">
              <a-input v-model="model.identifier" placeholder="请输入md5唯一标识"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="上传状态(1-成功,0-失败或未完成)" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="uploadstatus">
              <a-input-number v-model="model.uploadstatus" placeholder="请输入上传状态(1-成功,0-失败或未完成)" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="上传时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="uploadtime">
              <j-date placeholder="请选择上传时间" v-model="model.uploadtime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="用户id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userid">
              <a-input v-model="model.userid" placeholder="请输入用户id"  ></a-input>
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
    name: 'NdUploadtaskForm',
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
          add: "/nd/ndUploadtask/add",
          edit: "/nd/ndUploadtask/edit",
          queryById: "/nd/ndUploadtask/queryById"
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