<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <a-input v-model="model.projectId" placeholder="请输入项目编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="name" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入name"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="紧急程度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pri">
              <a-input-number v-model="model.pri" placeholder="请输入紧急程度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="执行状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="executeStatus">
              <a-input v-model="model.executeStatus" placeholder="请输入执行状态"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="详情" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
              <a-textarea v-model="model.description" rows="4" placeholder="请输入详情" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="指派给谁" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assignTo">
              <a-input v-model="model.assignTo" placeholder="请输入指派给谁"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="回收站" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="deleted">
              <a-input-number v-model="model.deleted" placeholder="请输入回收站" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务列表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="stageId">
              <a-input v-model="model.stageId" placeholder="请输入任务列表"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务标签" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskTag">
              <a-input v-model="model.taskTag" placeholder="请输入任务标签"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否完成" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="done">
              <a-input-number v-model="model.done" placeholder="请输入是否完成" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="beginTime">
              <j-date placeholder="请选择开始时间" v-model="model.beginTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="截止时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <j-date placeholder="请选择截止时间" v-model="model.endTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="提醒时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remindTime">
              <j-date placeholder="请选择提醒时间" v-model="model.remindTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="父任务id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pid">
              <a-input v-model="model.pid" placeholder="请输入父任务id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sort">
              <a-input-number v-model="model.sort" placeholder="请输入排序" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="点赞数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="likes">
              <a-input-number v-model="model.likes" placeholder="请输入点赞数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收藏数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="star">
              <a-input-number v-model="model.star" placeholder="请输入收藏数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="删除时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="deletedTime">
              <j-date placeholder="请选择删除时间" v-model="model.deletedTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否隐私模式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="privated">
              <a-input-number v-model="model.privated" placeholder="请输入是否隐私模式" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务id编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="idNum">
              <a-input-number v-model="model.idNum" placeholder="请输入任务id编号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="上级任务路径" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="path">
              <a-textarea v-model="model.path" rows="4" placeholder="请输入上级任务路径" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="进度百分比" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="schedule">
              <a-input-number v-model="model.schedule" placeholder="请输入进度百分比" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="版本id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="versionId">
              <a-input v-model="model.versionId" placeholder="请输入版本id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="版本库id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="featuresId">
              <a-input v-model="model.featuresId" placeholder="请输入版本库id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="预估工时" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workTime">
              <a-input-number v-model="model.workTime" placeholder="请输入预估工时" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="执行状态.0:未开始,1:已完成,2:进行中,3:挂起,4:测试中" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <a-input-number v-model="model.status" placeholder="请输入执行状态.0:未开始,1:已完成,2:进行中,3:挂起,4:测试中" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="liked" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="liked">
              <a-input-number v-model="model.liked" placeholder="请输入liked" style="width: 100%" />
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
    name: 'TwTaskForm',
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
           projectId: [
              { required: true, message: '请输入项目编号!'},
           ],
        },
        url: {
          add: "/tw/twTask/add",
          edit: "/tw/twTask/edit",
          queryById: "/tw/twTask/queryById"
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