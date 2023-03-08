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
            <a-form-model-item label="入库日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inDate">
              <j-date placeholder="请选择入库日期" v-model="model.inDate" style="width: 100%" />
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
                :multi="true"
                @input="popupCallback"
                />
                <a-input v-model="model.wsName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierId">
              <j-popup
                v-model="model.supplierId"
                 field="supplierId"
                org-fields="id,name"
                dest-fields="supplierId,slName"
                code="SelectorSupplier"
                :multi="true"
                @input="popupCallback"
                />
                <a-input v-model="model.slName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="采购员ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="purchaserId">
              <j-popup
                v-model="model.purchaserId"
                 field="purchaserId"
                org-fields="username,realname"
                dest-fields="purchaserId,purchaserName"
                code="SelectorUser"
                :multi="true"
                @input="popupCallback"
                />
                <a-input v-model="model.purchaserName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="采购单ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="purchaseOrderId">
              <j-popup
                v-model="model.purchaseOrderId"
                 field="purchaseOrderId"
                org-fields="id"
                dest-fields="purchaseOrderId"
                code="SelectorPurchaseOrder"
                :multi="true"
                @input="popupCallback"
                />
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
            <a-form-model-item label="入库金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalAmount">
              <a-input-number v-model="model.totalAmount" placeholder="请输入入库金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
              <a-input v-model="model.description" placeholder="请输入备注" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" :disabled="true" dictCode="erp_sheet_status" placeholder="请选择状态" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="采购入库单明细" :key="refKeys[0]" :forceRender="true">
        <nbcio-editable-table
          :ref="refKeys[0]"
          v-on:beforeAdd="beforeAdd"
          :isAdd="isAdd"
          :loading="erpInSheetDetailTable.loading"
          :columns="erpInSheetDetailTable.columns"
          :dataSource="erpInSheetDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          @valueChange="onValueChange"
          :actionButton="true"/>
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
    name: 'ErpInSheetForm',
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
            status:1,
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
           supplierId: [
              { required: true, message: '请输入供应商ID!'},
           ],
           totalNum: [
              { required: true, message: '请输入商品数量!'},
           ],
           totalGiftNum: [
              { required: true, message: '请输入赠品数量!'},
           ],
           totalAmount: [
              { required: true, message: '请输入入库金额!'},
           ],
           status: [
              { required: true, message: '请输入状态!'},
           ],
        },
        refKeys: ['erpInSheetDetail', ],
        tableKeys:['erpInSheetDetail', ],
        activeKey: 'erpInSheetDetail',
        // erp_in_sheet_detail
        erpInSheetDetailTable: {
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
              defaultValue:'',
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
              title: '采购数量',
              key: 'orderNum',
              type: FormTypes.inputNumber,
              statistics: true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '采购价',
              key: 'taxPrice',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
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
          add: "/purchase/erpInSheet/add",
          edit: "/purchase/erpInSheet/edit",
          approvePass:"/purchase/erpInSheet/approvePass",
          queryById: "/purchase/erpInSheet/queryById",
          erpInSheetDetail: {
            list: '/purchase/erpInSheet/queryErpInSheetDetailByMainId'
          },
          rule: {
            orderCode: ruleBaseURL + 'in_sheet_no'
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
        this.erpInSheetDetailTable.dataSource=[]
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
          this.requestSubTableData(this.url.erpInSheetDetail.list, params, this.erpInSheetDetailTable)
        }
        this.checkSc();
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
          erpInSheetDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
         this.$message.error(msg)
      },
      popupCallback(value,row){
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
          this.erpInSheetDetailTable.columns[0].param = this.param;
          this.isAdd = true;
          return true
        }
      },
    }
  }
</script>

<style scoped>
</style>