<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="仓库ID">
              <j-popup placeholder="请选择仓库ID" v-model="queryParam.scId" code="SelectorWarehouse" org-fields="id" dest-fields="sc_id" :field="getPopupField('sc_id')" :multi="true"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商ID">
              <j-popup placeholder="请选择供应商ID" v-model="queryParam.supplierId" code="SelectorSupplier" org-fields="id" dest-fields="supplier_id" :field="getPopupField('supplier_id')" :multi="true"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="采购员ID">
                <j-popup placeholder="请选择采购员ID" v-model="queryParam.purchaserId" code="SelectorUser" org-fields="username" dest-fields="purchaser_id" :field="getPopupField('purchaser_id')" :multi="true"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="采购单ID">
                <j-popup placeholder="请选择采购单ID" v-model="queryParam.purchaseOrderId" code="SelectorPurchaseOrder" org-fields="id" dest-fields="purchase_order_id" :field="getPopupField('purchase_order_id')" :multi="true"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="创建人">
                <a-input placeholder="请输入创建人" v-model="queryParam.createBy"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="审核人">
                <a-input placeholder="请输入审核人" v-model="queryParam.approveBy"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="审核时间">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.approveTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.approveTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="状态">
                <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.status" dictCode="erp_sheet_status"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="结算状态">
                <j-dict-select-tag placeholder="请选择结算状态" v-model="queryParam.settleStatus" dictCode="erp_settle_status"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('erp_in_sheet')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <a-divider v-if="record.status != 2" type="vertical" />
          <a v-if="record.status != 2" @click="handleEdit(record)">编辑</a>
          <a-divider v-if="record.status != 2" type="vertical" />
          <a v-if="record.status != 2" @click="handleApprove(record)">审核</a>
          <a-divider v-if="record.status != 2" type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a v-if="record.status != 2">删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <erp-in-sheet-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { NbcioListMixin } from '@/mixins/NbcioListMixin'
  import ErpInSheetModal from './modules/ErpInSheetModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "ErpInSheetList",
    mixins:[NbcioListMixin],
    components: {
      ErpInSheetModal
    },
    data () {
      return {
        description: 'erp_in_sheet管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'单号',
            align:"center",
            dataIndex: 'code'
          },
          /*{
            title:'仓库ID',
            align:"center",
            dataIndex: 'scId'
          },
          {
            title:'供应商ID',
            align:"center",
            dataIndex: 'supplierId'
          },
          {
            title:'采购员ID',
            align:"center",
            dataIndex: 'purchaserId'
          },*/
          {
            title:'仓库编码',
            align:"center",
            dataIndex: 'wsCode'
          },
          {
            title:'仓库名称',
            align:"center",
            dataIndex: 'wsName'
          },
          {
            title:'供应商编码',
            align:"center",
            dataIndex: 'slCode'
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'slName'
          },
          {
            title:'采购员',
            align:"center",
            dataIndex: 'purchaserName'
          },
          {
            title:'付款日期',
            align:"center",
            dataIndex: 'paymentDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'入库日期',
            align:"center",
            dataIndex: 'inDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'采购单ID',
            align:"center",
            dataIndex: 'purchaseOrderId'
          },
          {
            title:'商品数量',
            align:"center",
            dataIndex: 'totalNum'
          },
          {
            title:'赠品数量',
            align:"center",
            dataIndex: 'totalGiftNum'
          },
          {
            title:'入库金额',
            align:"center",
            dataIndex: 'totalAmount'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status',
            customRender:function (text) {
              if(text==1){
                return "未审核";
              }else if(text==2){
                return "审核通过";
              }else{
                return text;
              }
            }  
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'description'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/purchase/erpInSheetDto/list",
          delete: "/purchase/erpInSheet/delete",
          deleteBatch: "/purchase/erpInSheet/deleteBatch",
          exportXlsUrl: "/purchase/erpInSheet/exportXls",
          importExcelUrl: "purchase/erpInSheet/importExcel",
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'code',text:'单号',dictCode:''})
         fieldList.push({type:'popup',value:'scId',text:'仓库ID', popup:{code:'SelectorWarehouse',field:'id',orgFields:'id',destFields:'sc_id'}})
         fieldList.push({type:'popup',value:'supplierId',text:'供应商ID', popup:{code:'SelectorSupplier',field:'id',orgFields:'id',destFields:'supplier_id'}})
         fieldList.push({type:'popup',value:'purchaserId',text:'采购员ID', popup:{code:'SelectorUser',field:'username',orgFields:'username',destFields:'purchaser_id'}})
         fieldList.push({type:'date',value:'paymentDate',text:'付款日期'})
         fieldList.push({type:'date',value:'inDate',text:'入库日期'})
         fieldList.push({type:'popup',value:'purchaseOrderId',text:'采购单ID', popup:{code:'SelectorPurchaseOrder',field:'id',orgFields:'id',destFields:'purchase_order_id'}})
         fieldList.push({type:'int',value:'totalNum',text:'商品数量',dictCode:''})
         fieldList.push({type:'int',value:'totalGiftNum',text:'赠品数量',dictCode:''})
         fieldList.push({type:'BigDecimal',value:'totalAmount',text:'入库金额',dictCode:''})
         fieldList.push({type:'string',value:'description',text:'备注',dictCode:''})
         fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
         fieldList.push({type:'string',value:'approveBy',text:'审核人',dictCode:''})
         fieldList.push({type:'date',value:'approveTime',text:'审核时间'})
         fieldList.push({type:'int',value:'status',text:'状态',dictCode:'erp_sheet_status'})
         fieldList.push({type:'int',value:'settleStatus',text:'结算状态',dictCode:'erp_settle_status'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>