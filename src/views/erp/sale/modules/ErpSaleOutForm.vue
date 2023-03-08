<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentDate">
              <j-date placeholder="请选择付款日期" v-model="model.paymentDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="销售单ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="saleOrderId">
              <a-input v-model="model.saleOrderId" placeholder="请输入销售单ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="仓库ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="scId">
              <j-popup
                v-model="model.scId"
                 field="scId"
                org-fields="id,name"
                dest-fields="scId,wsName"
                code="SelectorWarehouse"
                :multi="false"
                @input="popupCallback"
                />
                <a-input v-model="model.wsName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="客户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customerId">
              <j-popup
                v-model="model.customerId"
                 field="customerId"
                org-fields="id,name"
                dest-fields="customerId,csName"
                code="SelectorCustomer"
                :multi="false"
                @input="popupCallback"
                />
                <a-input v-model="model.csName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="销售员ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salerId">
              <j-popup
                v-model="model.salerId"
                 field="salerId"
                org-fields="username,realname"
                dest-fields="salerId,salerName"
                code="SelectorUser"
                :multi="true"
                @input="popupCallback"
                />
                <a-input v-model="model.salerName"></a-input>
            </a-form-model-item>
          </a-col>
          
          <a-col :span="8" >
            <a-form-model-item label="商品数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalNum">
              <a-input-number v-model="model.totalNum" placeholder="请输入商品数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="赠品数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalGiftNum">
              <a-input-number v-model="model.totalGiftNum" placeholder="请输入赠品数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="出库金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalAmount">
              <a-input-number v-model="model.totalAmount" placeholder="请输入出库金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
              <a-input v-model="model.description" placeholder="请输入备注" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" dictCode="erp_sheet_status" :disabled="true" placeholder="请选择状态" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="销售出库单明细" :key="refKeys[0]" :forceRender="true">
        <nbcio-editable-table
          :ref="refKeys[0]"
          v-on:beforeAdd="beforeAdd"
          :isAdd="isAdd"
          :loading="erpSaleOutDetailTable.loading"
          :columns="erpSaleOutDetailTable.columns"
          :dataSource="erpSaleOutDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          @valueChange="onValueChange"
          :rowSelection="true"
          :actionButton="true"
        >
          <!--<template v-slot:goodsCode="props">
            <a-input :value="props.text" disabled />
          </template>
          
          <template v-slot:goodsName="props">
            <a-input :value="props.text" disabled />
          </template> -->
        </nbcio-editable-table>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction, putAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { NbcioTableModelMixin } from '@/mixins/NbcioTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import { GoodsModalMixin } from '../mixins/GoodsModalMixin.js'
  const ruleBaseURL = '/sys/fillRule/executeRuleByCode/'
  
  export default {
    name: 'ErpSaleOutForm',
    mixins: [NbcioTableModelMixin,GoodsModalMixin],
    components: {
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        model:{
          totalGiftNum: 0,
          status: 1,
        },
        //自定义配置报表参数
        param:{
          sc_id: '',
        },
        //是否容许增加子表单行记录
        isAdd: false,
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
           code: [
              { required: true, message: '请输入单号!'},
           ],
           scId: [
              { required: true, message: '请输入仓库ID!'},
           ],
           customerId: [
              { required: true, message: '请输入客户ID!'},
           ],
           totalNum: [
              { required: true, message: '请输入商品数量!'},
           ],
           totalGiftNum: [
              { required: true, message: '请输入赠品数量!'},
           ],
           totalAmount: [
              { required: true, message: '请输入出库金额!'},
           ],
           status: [
              { required: true, message: '请输入状态!'},
           ],
        },
        refKeys: ['erpSaleOutDetail', ],
        tableKeys:['erpSaleOutDetail', ],
        activeKey: 'erpSaleOutDetail',
        // 销售出库单明细
        erpSaleOutDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '商品ID',
              key: 'goodsId',
              type: FormTypes.popupGoods,
              kind: 'goods', 
              multi: true,
              width:"220px",
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '商品编码',
              key: 'goodsCode',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '商品名称',
              key: 'goodsName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '参考价',
              key: 'oriPrice',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '价格',
              key: 'taxPrice',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '出库数量',
              key: 'orderNum',
              type: FormTypes.inputNumber,
              statistics: true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '折扣率（%）',
              key: 'discountRate',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:100,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '是否赠品',
              key: 'isGift',
              type: FormTypes.select,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'0',
              options: [
                { title: '是', value: '1' },
                { title: '否', value: '0' },
              ],
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '税率（%）',
              key: 'taxRate',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '总价',
              key: 'totalPrice',
              type: FormTypes.inputNumber,
              statistics: true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '备注',
              key: 'description',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },

            {
              title: 'goods_id',
              key: 'goods_id',
              type:"hidden"
            },

          ]
        },
        url: {
          add: "/sale/erpSaleOut/add",
          edit: "/sale/erpSaleOut/edit",
          approvePass:"/sale/erpSaleOut/approvePass",
          queryById: "/sale/erpSaleOut/queryById",
          erpSaleOutDetail: {
            list: '/sale/erpSaleOut/queryErpSaleOutDetailByMainId'
          },
          rule: {
            orderCode: ruleBaseURL + 'sale_out_no'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
      
    },
    methods: {
      getOrderCode() {
        putAction(this.url.rule.orderCode, this.model).then(res => {
         // 执行成功，获取返回的订单编号值，并赋到页面上
        if (res.success) {
        this.model.code = res.result
        }
       })
      },
      addBefore(){
        this.erpSaleOutDetailTable.dataSource=[]
        this.getOrderCode()
        
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.erpSaleOutDetail.list, params, this.erpSaleOutDetailTable)
        }
        if( (this.model.scId != '') && (this.model.scId !=undefined)) {
           this.erpSaleOutDetailTable.columns[0].param = this.param;
           this.isAdd = true;
        }
        console.log("editAfter this.model=",this.model)
      },
      //校验所有一对一子表表单
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
              if (e.error === VALIDATE_NO_PASSED) {
                // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
              } else {
                console.error(e)
              }
            })
          })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          erpSaleOutDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(value,row){
       console.log("popupCallback(value,row)",value,row);
       this.model = Object.assign(this.model, row);
       this.checkSc();
     },
     beforeAdd() {
        if (this.checkSc() === false) {
            this.$message.error('请先选择仓库！')
        }
     },
     //检查是否有仓库信息
     checkSc() {
       this.param.sc_id = this.model.scId;
       console.log("beforeAdd this.param.sc_id=",this.param.sc_id)
       if (this.param.sc_id === '' || this.param.sc_id === undefined) {
         this.isAdd = false
         return false
       }
       else {
         this.erpSaleOutDetailTable.columns[0].param = this.param;
         this.isAdd = true;
         return true
       }
     },
    }
  }
</script>

<style scoped>
</style>