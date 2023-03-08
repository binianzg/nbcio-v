<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input placeholder="请输入编号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="类别编号">
                <j-popup placeholder="请选择类别编号" v-model="queryParam.categoryId" code="SelectorGoodsCategory" org-fields="id,name" dest-fields="category_id,category_name" :field="getPopupField('category_id,category_name')" :multi="true"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="品牌编号">
                <j-popup placeholder="请选择品牌编号" v-model="queryParam.brandId" code="SelectorBrand" org-fields="id,name" dest-fields="brand_id,brand_name" :field="getPopupField('brand_id,brand_name')" :multi="true"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="状态">
                <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.status" dictCode="erp_status"/>
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
      <a-button type="primary" icon="download" @click="handleExportXls('商品基础信息')">导出</a-button>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <erpGoods-modal ref="modalForm" @ok="modalFormOk"></erpGoods-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ErpGoodsModal from './modules/ErpGoodsModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "ErpGoodsList",
    mixins:[JeecgListMixin],
    components: {
      ErpGoodsModal
    },
    data () {
      return {
        description: '商品基础信息管理页面',
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
            title:'编号',
            align:"center",
            dataIndex: 'code'
          },
          {
            title:'名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'简称',
            align:"center",
            dataIndex: 'shortName'
          },
          /*{
            title:'类别编号',
            align:"center",
            dataIndex: 'categoryId'
          },
          {
            title:'品牌编号',
            align:"center",
            dataIndex: 'brandId'
          },*/
          {
            title:'类别',
            align:"center",
            dataIndex: 'categoryName'
          },
          {
            title:'品牌',
            align:"center",
            dataIndex: 'brandName'
          },
          {
            title:'进项税率（%）',
            align:"center",
            dataIndex: 'taxRate'
          },
          {
            title:'销项税率（%）',
            align:"center",
            dataIndex: 'saleTaxRate'
          },
          {
            title:'规格',
            align:"center",
            dataIndex: 'spec'
          },
          {
            title:'单位',
            align:"center",
            dataIndex: 'unit'
          },
          {
            title:'采购价格',
            align:"center",
            dataIndex: 'purchasePrice'
          },
          {
            title:'销售价格',
            align:"center",
            dataIndex: 'salePrice'
          },
          {
            title:'零售价格',
            align:"center",
            dataIndex: 'retailPrice'
          },
	        {
	          title:'状态',
            align:"center",
            dataIndex: 'status_dictText'
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
          list: "/goods/erpGoodsDto/list",
          delete: "/goods/erpGoods/delete",
          deleteBatch: "/goods/erpGoods/deleteBatch",
          exportXlsUrl: "/goods/erpGoods/exportXls",
          importExcelUrl: "goods/erpGoods/importExcel",
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
        fieldList.push({type:'string',value:'code',text:'编号',dictCode:''})
        fieldList.push({type:'string',value:'name',text:'名称',dictCode:''})
        fieldList.push({type:'string',value:'shortName',text:'简称',dictCode:''})
        fieldList.push({type:'popup',value:'categoryId',text:'类别编号', popup:{code:'SelectorGoodsCategory',field:'id',orgFields:'id',destFields:'category_id'}})
        fieldList.push({type:'popup',value:'brandId',text:'品牌编号', popup:{code:'SelectorBrand',field:'id',orgFields:'id',destFields:'brand_id'}})
        fieldList.push({type:'BigDecimal',value:'taxRate',text:'进项税率（%）',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'saleTaxRate',text:'销项税率（%）',dictCode:''})
        fieldList.push({type:'string',value:'spec',text:'规格',dictCode:''})
        fieldList.push({type:'string',value:'unit',text:'单位',dictCode:''})
        fieldList.push({type:'int',value:'status',text:'状态',dictCode:'erp_status'})
        this.superFieldList = fieldList
      }

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>