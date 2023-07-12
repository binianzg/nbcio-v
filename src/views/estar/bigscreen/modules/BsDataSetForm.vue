<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="数据源编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sourceCode">
              <j-dict-select-tag type="list" v-model="model.sourceCode" dictCode="bs_data_source,code,code" placeholder="请选择数据源编码" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="数据集编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="setCode">
              <a-input v-model="model.setCode" placeholder="请输入数据集编码"  style="width: 100%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="数据集名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="setName">
              <a-input v-model="model.setName" placeholder="请输入数据集名称"  style="width: 100%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" dictCode="erp_status" placeholder="请选择状态" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据集描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="setDesc">
              <a-input v-model="model.setDesc" placeholder="请输入数据集描述"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="查询sql" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dynSentence">
              <a-textarea v-model="model.dynSentence" rows="4" placeholder="请输入查询sql"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-tabs v-model:activeKey="activeKey" @tabClick="dataSetTest">
                <!--<a-tab-pane key="1" tab="查询参数">
                  Content of Tab Pane 1
                </a-tab-pane>
                <a-tab-pane key="2" tab="数据转换">
                  Content of Tab Pane 2
                </a-tab-pane>-->
                <a-tab-pane key="3" tab="测试预览">
                  <div style="max-height: 400px; overflow: auto">
                    <vue-json-editor
                    v-model="cols"
                    :show-btns="false"
                    :mode="'code'"
                    lang="zh"
                    @json-change="onJsonChange"
                    @json-save="onJsonSave"
                    />
                  </div>
                </a-tab-pane>
            </a-tabs>
          </a-col>
          <!--<a-col :span="24">
            <a-form-model-item label="结果案例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caseResult">
              <a-textarea v-model="model.caseResult" rows="4" placeholder="请输入结果案例"/>
            </a-form-model-item>
          </a-col>-->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import {
    testTransformSet
  } from "@/api/bigscreen/bigscreen";
  import vueJsonEditor from "vue-json-editor";

  export default {
    name: 'BsDataSetForm',
    components: {
      vueJsonEditor,
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
        itemFilterList: [
          {
            transformType: "js",
            transformScript: ``
          }
        ],
        activeKey: '1',
        cols: [],
        tableData: [
          {
            paramName: "",
            paramDesc: "",
            paramType: "",
            sampleItem: "",
            mandatory: true,
            requiredFlag: 1,
            validationRules: `function verification(data){\n\t//自定义脚本内容\n\t//可返回true/false单纯校验键入的data正确性\n\t//可返回文本，实时替换,比如当前时间等\n\t//return "2099-01-01 00:00:00";\n\treturn true;\n}`
          }
        ],
        testMassageCode: null, 
        setType: "", //数据集类型，主要用于区分http   addSql  addHttp  edit
        httpForm: {
          //http数据源相关数据
          apiUrl: "",
          method: "GET",
          header: '{"Content-Type":"application/json;charset=UTF-8"}',
          body: ""
        },
        confirmLoading: false,
        validatorRules: {
           setCode: [
              { required: true, message: '请输入数据集编码!'},
           ],
           setName: [
              { required: true, message: '请输入数据集名称!'},
           ],
           sourceCode: [
              { required: true, message: '请输入数据源编码!'},
           ],
           status: [
              { required: true, message: '请输入状态!'},
           ],
        },
        url: {
          add: "/bs/bsDataSet/add",
          edit: "/bs/bsDataSet/edit",
          queryById: "/bs/bsDataSet/queryById"
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
      add (type) {
        this.modelDefault.setType = type;
        this.edit(this.modelDefault);
        this.model.setType = type;
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      async dataSetTest (tabKey) {//测试预览
        console.log("tab clicked : " + tabKey);
        if (this.model.setType == "http") {
          //针对http数据源
          console.log("http数据集" + this.httpForm);
          this.model.dynSentence = JSON.stringify(this.httpForm);
        }
        if (tabKey == "3") {
          const params = {
            sourceCode: this.model.sourceCode,
            dynSentence: this.model.dynSentence,
            dataSetParamDtoList: this.tableData,
            dataSetTransformDtoList: this.itemFilterList,
            setType: this.model.setType
          };
          const { code, result } = await testTransformSet(params);
          if (code != "200") return;
          this.cols = result.data;
          this.testMassageCode = code;
        }
      },
      onJsonChange(value) {},
      onJsonSave(value) {},
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