<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="专辑" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="album">
              <a-input v-model="model.album" placeholder="请输入专辑"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="专辑艺术家" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="albumartist">
              <a-input v-model="model.albumartist" placeholder="请输入专辑艺术家"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="专辑图片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="albumimageString">
              <a-input v-model="model.albumimageString" placeholder="请输入专辑图片" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="艺术家" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="artist">
              <a-input v-model="model.artist" placeholder="请输入艺术家"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="评论" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="comment">
              <a-input v-model="model.comment" placeholder="请输入评论"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创作者" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="composer">
              <a-input v-model="model.composer" placeholder="请输入创作者"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="版权" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="copyright">
              <a-input v-model="model.copyright" placeholder="请输入版权"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="编码器" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="encoder">
              <a-input v-model="model.encoder" placeholder="请输入编码器"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileid">
              <a-input v-model="model.fileid" placeholder="请输入文件ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="genre">
              <a-input v-model="model.genre" placeholder="请输入类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="歌词" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lyrics">
              <a-input v-model="model.lyrics" placeholder="请输入歌词"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="原创艺术家" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="originalartist">
              <a-input v-model="model.originalartist" placeholder="请输入原创艺术家"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公众" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publicer">
              <a-input v-model="model.publicer" placeholder="请输入公众"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="题目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入题目"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="声道" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="track">
              <a-input v-model="model.track" placeholder="请输入声道"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="声道长度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tracklength">
              <a-input-number v-model="model.tracklength" placeholder="请输入声道长度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="url">
              <a-input v-model="model.url" placeholder="请输入地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="年份" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="year">
              <a-input v-model="model.year" placeholder="请输入年份"  ></a-input>
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
    name: 'NdMusicForm',
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
          add: "/nd/ndMusic/add",
          edit: "/nd/ndMusic/edit",
          queryById: "/nd/ndMusic/queryById"
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