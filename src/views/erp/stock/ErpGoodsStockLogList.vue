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
            <a-form-item label="商品ID">
              <j-popup placeholder="请选择商品ID" v-model="queryParam.goodsId" code="SelectorGoods" org-fields="id" dest-fields="goods_id" :field="getPopupField('goods_id')" :multi="true"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="创建时间">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('商品库存变动日志')">导出</a-button>
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
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

          <!--<a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <erp-goods-stock-log-modal ref="modalForm" @ok="modalFormOk"></erp-goods-stock-log-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ErpGoodsStockLogModal from './modules/ErpGoodsStockLogModal'

  export default {
    name: 'ErpGoodsStockLogList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      ErpGoodsStockLogModal
    },
    data () {
      return {
        description: '商品库存变动日志管理页面',
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
            title:'仓库ID',
            align:"center",
            dataIndex: 'scId'
          },
          {
            title:'商品ID',
            align:"center",
            dataIndex: 'goodsId'
          },
          {
            title:'原含税成本价',
            align:"center",
            dataIndex: 'oriTaxPrice'
          },
          {
            title:'现含税成本价',
            align:"center",
            dataIndex: 'curTaxPrice'
          },
          {
            title:'原无税成本价',
            align:"center",
            dataIndex: 'oriUnTaxPrice'
          },
          {
            title:'现无税成本价',
            align:"center",
            dataIndex: 'curUnTaxPrice'
          },
          {
            title:'原库存数量',
            align:"center",
            dataIndex: 'oriStockNum'
          },
          {
            title:'现库存数量',
            align:"center",
            dataIndex: 'curStockNum'
          },
          {
            title:'库存数量',
            align:"center",
            dataIndex: 'stockNum'
          },
          {
            title:'含税金额',
            align:"center",
            dataIndex: 'taxAmount'
          },
          {
            title:'无税金额',
            align:"center",
            dataIndex: 'unTaxAmount'
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'业务单据ID',
            align:"center",
            dataIndex: 'bizId'
          },
          {
            title:'业务单据号',
            align:"center",
            dataIndex: 'bizCode'
          },
          {
            title:'业务单据明细ID',
            align:"center",
            dataIndex: 'bizDetailId'
          },
          {
            title:'业务类型',
            align:"center",
            dataIndex: 'bizType'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/stock/erpGoodsStockLog/list",
          delete: "/stock/erpGoodsStockLog/delete",
          deleteBatch: "/stock/erpGoodsStockLog/deleteBatch",
          exportXlsUrl: "/stock/erpGoodsStockLog/exportXls",
          importExcelUrl: "stock/erpGoodsStockLog/importExcel",
          
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
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'popup',value:'scId',text:'仓库ID', popup:{code:'SelectorWarehouse',field:'id',orgFields:'id',destFields:'sc_id'}})
        fieldList.push({type:'popup',value:'goodsId',text:'商品ID', popup:{code:'SelectorGoods',field:'id',orgFields:'id',destFields:'goods_id'}})
        fieldList.push({type:'BigDecimal',value:'oriTaxPrice',text:'原含税成本价',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'curTaxPrice',text:'现含税成本价',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'oriUnTaxPrice',text:'原无税成本价',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'curUnTaxPrice',text:'现无税成本价',dictCode:''})
        fieldList.push({type:'int',value:'oriStockNum',text:'原库存数量',dictCode:''})
        fieldList.push({type:'int',value:'curStockNum',text:'现库存数量',dictCode:''})
        fieldList.push({type:'int',value:'stockNum',text:'库存数量',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'taxAmount',text:'含税金额',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'unTaxAmount',text:'无税金额',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'date',value:'createTime',text:'创建时间'})
        fieldList.push({type:'string',value:'bizId',text:'业务单据ID',dictCode:''})
        fieldList.push({type:'string',value:'bizCode',text:'业务单据号',dictCode:''})
        fieldList.push({type:'string',value:'bizDetailId',text:'业务单据明细ID',dictCode:''})
        fieldList.push({type:'int',value:'bizType',text:'业务类型',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>