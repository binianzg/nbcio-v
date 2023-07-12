<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="数据源编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入数据源编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据源名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入数据源名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据源类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="bs_source_type,name,code" @change="onchange" placeholder="请选择数据源类型" />
            </a-form-model-item>
          </a-col>  
        </a-row>
        <a-row>
          <a-col
            v-for="(data, index) in dataLink"
            :key="index"
            :span="24"
          >
            <a-form-model-item :label="data.labelValue" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model.trim="data.value" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <center><a-button type="primary" @click="dataSourceTest">测试</a-button></center>
          </a-col>
          <a-col :span="24">
            <!--<a-col :span="24">
              <a-form-model-item label="数据源配置" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="config">
                <a-input v-model="model.config" placeholder="请输入数据源配置"  ></a-input>
              </a-form-model-item>
            </a-col> -->
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入描述"  ></a-input>
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
  import {
    testConnection
  } from "@/api/bigscreen/bigscreen";

  export default {
    name: 'BsDataSourceForm',
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
          code: [
             { required: true, message: '请输入数据源编码!'},
          ],
          name: [
             { required: true, message: '请输入数据源名称!'},
          ],
          type: [
             { required: true, message: '请选择数据源类型!'},
          ],
        },
        sourceForm: {
          sourceName: "",
          sourceCode: "",
          sourceType: "",
          sourceDesc: "",
          sourceConfig: ""
        },
        dataLink: [],
        testReplyCode: null,
        url: {
          add: "/bs/bsDataSource/add",
          edit: "/bs/bsDataSource/edit",
          queryById: "/bs/bsDataSource/queryById",
          queryByCode: "/bs/bsSourceType/queryByCode"
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
        if (record.id) {////根据record.id判断新增还是编辑
          this.editInit(this.model.type);
        }  
        this.visible = true;
      },
      editInit(type) {
        const that = this;
        let url = this.url.queryByCode, method = 'get';
        let params = {code: type};
        getAction(url,params).then((res)=>{
          if(res.success){
            //that.$message.success(res.message);
            console.log("onchange res=",res);
            that.dataLink = JSON.parse(res.result.jsonValue);
            console.log("onchange that.dataLink=",that.dataLink);
            this.sourceForm.sourceType = type;
            let newDataLink = [];
            newDataLink = that.dataLink;
            let sourceConfigJson = JSON.parse(that.model.config);
            for (let i = 0; i < newDataLink.length; i++) {
              newDataLink[i].value = sourceConfigJson[newDataLink[i].label];
            }
            this.dataLink = newDataLink;
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })
      },
      onchange(val) {
        const that = this;
        console.log("onchange val=",val);
        this.sourceForm.sourceType = val;
        this.model.type = val;
        let url = this.url.queryByCode, method = 'get';
        let params = {code: val};
        getAction(url,params).then((res)=>{
          if(res.success){
            //that.$message.success(res.message);
            console.log("onchange res=",res);
            that.dataLink = JSON.parse(res.result.jsonValue);
            console.log("onchange that.dataLink=",that.dataLink);
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })
      },
      // 测试
      dataSourceTest() {
        const newList = {};
        this.dataLink.forEach(item => {
          newList[item.label] = item.value;
        });
        this.model.config = JSON.stringify(newList);
        this.sourceForm.sourceConfig = JSON.stringify(newList);
        testConnection(this.sourceForm).then(res => {
          console.log("testConnection res=",res);
          if (res.code == "200") {
            this.testReplyCode = res.code;
            this.$message.success(res.result);
          } else {
            this.$message.error(res.result);
            this.testReplyCode = null;
          }
        });
      },
      submitForm () {
        const that = this;
        const newList = {};
        this.dataLink.forEach(item => {
          newList[item.label] = item.value;
        });
        this.model.config = JSON.stringify(newList);
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.testReplyCode != "200") {
              this.$message.error("测试结果为成功后方可保存！");
              return;
            }
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