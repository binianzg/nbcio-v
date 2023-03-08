<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="仓库ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="scId">
              <j-popup
                v-model="model.scId"
                field="scId"
                org-fields="id"
                dest-fields="scId"
                code="SelectorWarehouse"
                :multi="true"
                @input="popupCallback"
                />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="商品ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="goodsId">
              <j-popup
                v-model="model.goodsId"
                field="goodsId"
                org-fields="id"
                dest-fields="goodsId"
                code="SelectorGoods"
                :multi="true"
                @input="popupCallback"
                />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="原含税成本价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="oriTaxPrice">
              <a-input-number v-model="model.oriTaxPrice" placeholder="请输入原含税成本价" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="现含税成本价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="curTaxPrice">
              <a-input-number v-model="model.curTaxPrice" placeholder="请输入现含税成本价" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="原无税成本价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="oriUnTaxPrice">
              <a-input-number v-model="model.oriUnTaxPrice" placeholder="请输入原无税成本价" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="现无税成本价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="curUnTaxPrice">
              <a-input-number v-model="model.curUnTaxPrice" placeholder="请输入现无税成本价" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="原库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="oriStockNum">
              <a-input-number v-model="model.oriStockNum" placeholder="请输入原库存数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="现库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="curStockNum">
              <a-input-number v-model="model.curStockNum" placeholder="请输入现库存数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="stockNum">
              <a-input-number v-model="model.stockNum" placeholder="请输入库存数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="含税金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxAmount">
              <a-input-number v-model="model.taxAmount" placeholder="请输入含税金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="无税金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unTaxAmount">
              <a-input-number v-model="model.unTaxAmount" placeholder="请输入无税金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="业务单据ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bizId">
              <a-input v-model="model.bizId" placeholder="请输入业务单据ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="业务单据号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bizCode">
              <a-input v-model="model.bizCode" placeholder="请输入业务单据号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="业务单据明细ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bizDetailId">
              <a-input v-model="model.bizDetailId" placeholder="请输入业务单据明细ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="业务类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bizType">
              <a-input-number v-model="model.bizType" placeholder="请输入业务类型" style="width: 100%" />
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
    name: 'ErpGoodsStockLogForm',
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
           scId: [
              { required: true, message: '请输入仓库ID!'},
           ],
           goodsId: [
              { required: true, message: '请输入商品ID!'},
           ],
           oriTaxPrice: [
              { required: true, message: '请输入原含税成本价!'},
           ],
           curTaxPrice: [
              { required: true, message: '请输入现含税成本价!'},
           ],
           oriUnTaxPrice: [
              { required: true, message: '请输入原无税成本价!'},
           ],
           curUnTaxPrice: [
              { required: true, message: '请输入现无税成本价!'},
           ],
           oriStockNum: [
              { required: true, message: '请输入原库存数量!'},
           ],
           curStockNum: [
              { required: true, message: '请输入现库存数量!'},
           ],
           stockNum: [
              { required: true, message: '请输入库存数量!'},
           ],
           taxAmount: [
              { required: true, message: '请输入含税金额!'},
           ],
           unTaxAmount: [
              { required: true, message: '请输入无税金额!'},
           ],
           bizType: [
              { required: true, message: '请输入业务类型!'},
           ],
        },
        url: {
          add: "/stock/erpGoodsStockLog/add",
          edit: "/stock/erpGoodsStockLog/edit",
          queryById: "/stock/erpGoodsStockLog/queryById"
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
      popupCallback(value,row){
         this.model = Object.assign(this.model, row);
      },
    }
  }
</script>