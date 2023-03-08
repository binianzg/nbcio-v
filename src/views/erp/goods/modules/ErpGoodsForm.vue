<template>
<a-spin :spinning="confirmLoading">

   <a-tabs v-model="activeKey" @change="handleChangeTabs">
   <!--主表区域 -->
    <a-tab-pane tab="商品基础信息" :key="refKeys[0]" :forceRender="true">
         <a-form-model ref="form" :model="model" :rules="validatorRules" :disabled="formDisabled">
           <a-row>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
                      <a-input v-model="model.code" placeholder="请输入编号" ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
                      <a-input v-model="model.name" placeholder="请输入名称" ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="类别编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="categoryId">
                      <j-popup
                        v-model="model.categoryId"
                        field="categoryId"
                        org-fields="id,name"
                        dest-fields="categoryId,categoryName"
                        code="SelectorGoodsCategory"
                        :multi="true"
                        @input="popupCallback"
                        />
                        <a-input v-model="model.categoryName"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="品牌编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="brandId">
                      <j-popup
                        v-model="model.brandId"
                        field="brandId"
                        org-fields="id,name"
                        dest-fields="brandId,brandName"
                        code="SelectorBrand"
                        :multi="true"
                        @input="popupCallback"
                        />
                        <a-input v-model="model.brandName"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="简称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shortName">
                      <a-input v-model="model.shortName" placeholder="请输入简称" ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="进项税率（%）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxRate">
                      <a-input-number v-model="model.taxRate" placeholder="请输入进项税率（%）" style="width: 100%" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="销项税率（%）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="saleTaxRate">
                      <a-input-number v-model="model.saleTaxRate" placeholder="请输入销项税率（%）" style="width: 100%" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="spec">
                      <a-input v-model="model.spec" placeholder="请输入规格" ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unit">
                      <a-input v-model="model.unit" placeholder="请输入单位" ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
                      <j-dict-select-tag type="list" v-model="model.status"  dictCode="erp_status" placeholder="请选择状态" />
                    </a-form-model-item>
                  </a-col>

                </a-row>
              </a-form-model>

     </a-tab-pane>
   <!--子表单区域 -->
     <a-tab-pane tab="商品价格信息" :key="refKeys[1]" :forceRender="true">
       <erp-goods-price-form ref="erpGoodsPriceForm" @validateError="validateError" :disabled="formDisabled"></erp-goods-price-form>
     </a-tab-pane>

   </a-tabs>

 </a-spin>
</j-modal>
</template>

<script>

import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import { validateDuplicateValue } from '@/utils/util'
import { VALIDATE_NO_PASSED, validateFormModelAndTables } from '@/utils/JEditableTableUtil'
import ErpGoodsPriceForm from './ErpGoodsPriceForm.vue'

export default {
 name: 'ErpGoodsForml',
 mixins: [JEditableTableModelMixin],
 components: {
 ErpGoodsPriceForm,
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
     // 新增时子表默认添加几行空数据
     addDefaultRowNum: 1,
     model:{
            status:1,
     },
        validatorRules: {
           code: [
              { required: true, message: '请输入编号!'},
           ],
           name: [
              { required: true, message: '请输入名称!'},
           ],
           categoryId: [
              { required: true, message: '请输入类别编号!'},
           ],
           brandId: [
              { required: true, message: '请输入品牌编号!'},
           ],
           taxRate: [
              { required: true, message: '请输入进项税率（%）!'},
           ],
           saleTaxRate: [
              { required: true, message: '请输入销项税率（%）!'},
           ],
           status: [
              { required: true, message: '请输入状态!'},
           ],
        },
     refKeys: ['erpGoods','erpGoodsPrice', ],
     tableKeys:[],
     activeKey: 'erpGoods',
     // 商品价格信息
     erpGoodsPriceTable: {
       loading: false,
       dataSource: [],
       columns: [
       ]
     },
     url: {
       add: "/goods/erpGoods/add",
       edit: "/goods/erpGoods/edit",
        erpGoods: {
         list: '/goods/erpGoods/queryById'
        },
       erpGoodsPrice: {
         list: '/goods/erpGoods/queryErpGoodsPriceByMainId'
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
   },
 },
 computed: {
   formDisabled(){
     return this.disabled
   },
 },
 methods: {
   getAllTable() {
     return new Promise(resolve => {
       resolve([]);
     })
   },
   /** 调用完edit()方法之后会自动调用此方法 */
   editAfter() {
     this.$nextTick(() => {
       this.$refs.erpGoodsPriceForm.initFormData(this.url.erpGoodsPrice.list,this.model.id)
     })
     // 加载子表数据
     if (this.model.id) {
       let params = { id: this.model.id }
     }
   },
   //校验所有一对一子表表单
   validateSubForm(allValues){
     return new Promise((resolve,reject)=>{
       Promise.all([
           this.$refs.erpGoodsPriceForm.validate(0),
       ]).then(() => {
         resolve(allValues)
       }).catch(e => {
         reject(e)
       })
     })
   },
   /** 整理成formData */
   classifyIntoFormData(allValues) {
     let main = Object.assign(this.model, allValues.formValue)
     return {
       ...main, // 展开
       erpGoodsPriceList: this.$refs.erpGoodsPriceForm.getFormData(),
     }
   },
    /** 确定按钮点击事件 */
     handleOk() {
       /** 触发表单验证 */
       this.getAllTable().then(tables => {
          return validateFormModelAndTables(this.$refs.form,this.model, tables)
       }).then(allValues => {
         /** 一次性验证一对一的所有子表 */
         return this.validateSubForm(allValues)
       }).then(allValues => {
         if (typeof this.classifyIntoFormData !== 'function') {
           throw this.throwNotFunction('classifyIntoFormData')
         }
         console.log("this.classifyIntoFormData",typeof this.classifyIntoFormData)
         let formData = this.classifyIntoFormData(allValues)

         // 发起请求
         return this.request(formData)
       }).catch(e => {
         if (e.error === VALIDATE_NO_PASSED) {
           // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
           this.activeKey = e.index == null ? this.refKeys[0] : this.refKeys[e.index+1]
         } else {
           console.error(e)
         }
       })
     },
   validateError(msg){
     this.$message.error(msg)
   },
 close() {
   this.visible = false
   this.$emit('close')
   this.$refs.form.clearValidate();
 },
  popupCallback(value,row){
    this.model = Object.assign(this.model, row);
  },

 }
}
</script>

<style scoped>
</style>