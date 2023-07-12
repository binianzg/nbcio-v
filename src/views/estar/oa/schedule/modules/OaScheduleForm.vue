<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入标题"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="日历类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="calId">
              <j-popup
                v-model="model.calId"
                field="calId"
                org-fields="id,color,taker,owner"
                dest-fields="calId,color,taker,owner"
                code="SelectCalendar"
                :multi="false"
                @input="popupCallback"
                />
                <!--<a-input v-model="model.calName"></a-input>-->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="content">
              <a-textarea v-model="model.content" rows="4" placeholder="请输入内容" />
            </a-form-model-item>
          </a-col>
          
          <a-col :span="12">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startTime">
              <a-date-picker placeholder="请选择开始时间" showTime valueFormat="YYYY-MM-DD HH:mm:ss" v-model="model.startTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <a-date-picker placeholder="请选择结束时间" showTime valueFormat="YYYY-MM-DD HH:mm:ss" v-model="model.endTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
	        <a-col :span="12">
            <a-form-model-item label="是否全天" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="allday">
              <j-dict-select-tag type="radio" @change="handleInput" v-model="model.allday" dictCode="yn" placeholder="请选择是否全天" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="所属人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="owner">
              <j-select-user-by-dep v-model="model.owner" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="参与人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taker">
              <j-select-user-by-dep v-model="model.taker" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="优先级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="level">
              <j-dict-select-tag type="list" v-model="model.level" dictCode="oa_reminder_level" placeholder="请选择优先级" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="提前提醒时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remind">
              <j-dict-select-tag type="list" v-model="model.remind" dictCode="oa_reminder_time" placeholder="请选择提前提醒时间" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="提醒方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remindType">
              <j-multi-select-tag type="checkbox" v-model="model.remindType" dictCode="oa_reminder_type" placeholder="请选择提醒方式" @change="onchange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入地点"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="颜色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="color">
              <el-color-picker v-model="model.color"
                  :predefine="['#188ae2', '#35b8e0', '#26bf8c','#f9c851','#ff5b5b', '#5b69bc', '#ff8acc', '#3b3e47','#282828' ]" />
              </el-form-item>

            </a-form-model-item>
          </a-col>
          <!--<a-col :span="12">
            <a-form-model-item label="来源" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="source">
              <a-input v-model="model.source" placeholder="请输入来源"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="链接" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="url">
              <a-input v-model="model.url" placeholder="请输入链接"  ></a-input>
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
  import estar from '../../util/estar';

  export default {
    name: 'OaScheduleForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      //表单初始时间
      inStart: {
        type: String,
        default: "",
        required: false
      },
      inEnd: {
        type: String,
        default: "",
        required: false
      },
    },
    data () {
      return {
        model:{
          color: "#188ae2",
	        allday:0,
	        level: 1,
          remind: 0,
          remindType: "4",
          startTime: this.inStart,
          endTime: this.inEnd,
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
           title: [
              { required: true, message: '请输入标题!'},
           ],
           calId: [
              { required: true, message: '请输入日历类型!'},
           ],
           startTime: [
              { required: true, message: '请输入开始时间!'},
           ],
           endTime: [
              { required: true, message: '请输入结束时间!'},
           ],
           allday: [
              { required: true, message: '请输入是否全天!'},
           ],
        },
        url: {
          add: "/oa/oaSchedule/add",
          edit: "/oa/oaSchedule/edit",
          queryById: "/oa/oaSchedule/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
      console.log("created inStart,inEnd",this.inStart,this.inEnd);
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      initTime(start,end) {//新建记录是初始化时间
        //console.log("initTime startTime,endTime",this.startTime,this.endTime);
        //this.model.startTime = start;
        //this.model.endTime = end;
      },
      handleInput() {
        if(this.model.allday === '1') {
          this.model.startTime = estar.toDate(this.inStart, "yyyy-MM-dd 00:00:00");
          this.model.endTime = estar.toDate(this.inStart, "yyyy-MM-dd 23:59:59");
        }
      },
      onchange(selectedValue) {
       if (selectedValue != '4')  {
         this.$message.warning("目前只支持消息提醒!");
         this.model.remindType = '4';
       }
      },
      getId() {
        return this.model.id;
      },
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
      popupCallback(value,row){
         this.model = Object.assign(this.model, row);
      },
    }
  }
</script>