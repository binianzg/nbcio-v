<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="当前分片数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chunknumber">
              <a-input-number v-model="model.chunknumber" placeholder="请输入当前分片数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="当前分片大小" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chunksize">
              <a-input-number v-model="model.chunksize" placeholder="请输入当前分片大小" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件路径" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filepath">
              <a-input v-model="model.filepath" placeholder="请输入文件路径"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filename">
              <a-input v-model="model.filename" placeholder="请输入文件名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件md5唯一标识" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="identifier">
              <a-input v-model="model.identifier" placeholder="请输入文件md5唯一标识"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件相对路径" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="relativepath">
              <a-input v-model="model.relativepath" placeholder="请输入文件相对路径"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件总分片数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalchunks">
              <a-input-number v-model="model.totalchunks" placeholder="请输入文件总分片数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件总大小" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalsize">
              <a-input-number v-model="model.totalsize" placeholder="请输入文件总大小" style="width: 100%" />
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
    name: 'NdUploadtaskdetailForm',
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
          add: "/nd/ndUploadtaskdetail/add",
          edit: "/nd/ndUploadtaskdetail/edit",
          queryById: "/nd/ndUploadtaskdetail/queryById"
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