<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('bs_data_set_param')">导出</a-button>
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

    <bs-data-set-param-modal ref="modalForm" @ok="modalFormOk"></bs-data-set-param-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BsDataSetParamModal from './modules/BsDataSetParamModal'

  export default {
    name: 'BsDataSetParamList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BsDataSetParamModal
    },
    data () {
      return {
        description: 'bs_data_set_param管理页面',
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
            title:'数据集编码',
            align:"center",
            dataIndex: 'setCode'
          },
          {
            title:'参数名',
            align:"center",
            dataIndex: 'paramName'
          },
          {
            title:'参数描述',
            align:"center",
            dataIndex: 'paramDesc'
          },
          {
            title:'参数类型，字典=',
            align:"center",
            dataIndex: 'paramType'
          },
          {
            title:'参数示例项',
            align:"center",
            dataIndex: 'sampleItem'
          },
          {
            title:'0--非必填 1--必填 DIC_NAME=REQUIRED_FLAG',
            align:"center",
            dataIndex: 'requiredFlag'
          },
          {
            title:'js校验字段值规则，满足校验返回 true',
            align:"center",
            dataIndex: 'validationRules'
          },
          {
            title:'排序',
            align:"center",
            dataIndex: 'orderNum'
          },
          {
            title:'0--已禁用 1--已启用  DIC_NAME=ENABLE_FLAG',
            align:"center",
            dataIndex: 'enableFlag'
          },
          {
            title:'0--未删除 1--已删除 DIC_NAME=DELETE_FLAG',
            align:"center",
            dataIndex: 'deleteFlag'
          },
          {
            title:'version',
            align:"center",
            dataIndex: 'version'
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
          list: "/bs/bsDataSetParam/list",
          delete: "/bs/bsDataSetParam/delete",
          deleteBatch: "/bs/bsDataSetParam/deleteBatch",
          exportXlsUrl: "/bs/bsDataSetParam/exportXls",
          importExcelUrl: "bs/bsDataSetParam/importExcel",
          
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
        fieldList.push({type:'string',value:'setCode',text:'数据集编码'})
        fieldList.push({type:'string',value:'paramName',text:'参数名'})
        fieldList.push({type:'string',value:'paramDesc',text:'参数描述'})
        fieldList.push({type:'string',value:'paramType',text:'参数类型，字典='})
        fieldList.push({type:'string',value:'sampleItem',text:'参数示例项'})
        fieldList.push({type:'int',value:'requiredFlag',text:'0--非必填 1--必填 DIC_NAME=REQUIRED_FLAG'})
        fieldList.push({type:'string',value:'validationRules',text:'js校验字段值规则，满足校验返回 true'})
        fieldList.push({type:'int',value:'orderNum',text:'排序'})
        fieldList.push({type:'int',value:'enableFlag',text:'0--已禁用 1--已启用  DIC_NAME=ENABLE_FLAG'})
        fieldList.push({type:'int',value:'deleteFlag',text:'0--未删除 1--已删除 DIC_NAME=DELETE_FLAG'})
        fieldList.push({type:'int',value:'version',text:'version'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>