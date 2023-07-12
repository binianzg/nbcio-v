<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称" v-model="queryParam.reportName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="编码">
              <a-input placeholder="请输入编码" v-model="queryParam.reportCode"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="类型">
                <j-dict-select-tag placeholder="请选择类型" v-model="queryParam.reportType" dictCode="bs_report_type"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="作者">
                <a-input placeholder="请输入作者" v-model="queryParam.reportAuthor"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('大屏报表')">导出</a-button>
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
                <a @click="handlePreview(record)">预览</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleDesign(record)">设计</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleShare(record)">分享</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCopy(record)">复制</a>
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

    <bs-report-modal ref="modalForm" @ok="modalFormOk"></bs-report-modal>
    <Share
      :visib="visibleForShareDialog"
      :reportCode="reportCodeForShareDialog"
      :reportName="reportNameForShareDialog"
      :reportType="reportTypeForShareDialog"
      @handleClose="visibleForShareDialog = false"
    />
    <copyDialog :visib.sync="copyVisible" :rowData="rowData" @close="close" />
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BsReportModal from './modules/BsReportModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {
    reportList,
    reportAdd,
    reportDeleteBatch,
    reportUpdate,
    reportDetail,
    reportCopy
  } from "@/api/bigscreen/reportmanage";
  import Share from "./components/share";
  import copyDialog from "./components/copyDialog.vue";

  export default {
    name: 'BsReportList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BsReportModal,
      Share,
      copyDialog
    },
    data () {
      return {
        description: '大屏报表管理页面',
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
            title:'名称',
            align:"center",
            dataIndex: 'reportName'
          },
          {
            title:'编码',
            align:"center",
            dataIndex: 'reportCode'
          },
          {
            title:'类型',
            align:"center",
            dataIndex: 'reportType_dictText'
          },
          {
            title:'作者',
            align:"center",
            dataIndex: 'reportAuthor'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status_dictText'
          },
          {
            title:'描述',
            align:"center",
            dataIndex: 'reportDesc'
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
          list: "/bs/bsReport/list",
          delete: "/bs/bsReport/delete",
          deleteBatch: "/bs/bsReport/deleteBatch",
          exportXlsUrl: "/bs/bsReport/exportXls",
          importExcelUrl: "bs/bsReport/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        // 复制
        copyVisible: false,
        rowData: {},
        // 分享
        visibleForShareDialog: false,
        reportCodeForShareDialog: "",
        reportNameForShareDialog: "",
        reportTypeForShareDialog: "",
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
      handleDesign(record) {
        let routePath = "";
        if (record.reportType === "1") {
          routePath = "/bigscreen/designer";    
        } else {
          routePath = "/excelreport/designer";
        }
        let routeUrl = this.$router.resolve({
          path: routePath,
          query: {
            reportCode: record.reportCode
          }
        });
        window.open(routeUrl.href, "_blank");
        /*this.$router.push({ 
          path: routePath,
          query: {
            reportCode: record.reportCode
          }
        });*/
      },
      // 预览
      handlePreview(record) {
        let routePath = "";
        if (record.reportType === "1") {
          routePath = "/bigscreen/viewer";
        } else {
          routePath = "/excelreport/viewer";
        }
        let routeUrl = this.$router.resolve({
          path: routePath,
          query: { reportCode: record.reportCode }
        });
        window.open(routeUrl.href, "_blank");
      },
      //复制
      async handleCopy(val) {
        this.copyVisible = true;
        this.rowData = val;
      },
      //分享
      handleShare(val) {
        this.reportCodeForShareDialog = val.reportCode;
        this.reportNameForShareDialog = val.reportName;
        this.reportTypeForShareDialog = val.reportType;
        this.visibleForShareDialog = true;
      },
      close() {
        this.copyVisible = false;
        this.searchQuery();
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'reportName',text:'名称',dictCode:''})
        fieldList.push({type:'string',value:'reportCode',text:'编码',dictCode:''})
        fieldList.push({type:'string',value:'reportType',text:'类型',dictCode:'bs_report_type'})
        fieldList.push({type:'string',value:'reportAuthor',text:'作者',dictCode:''})
        fieldList.push({type:'string',value:'status',text:'状态',dictCode:'erp_status'})
        fieldList.push({type:'string',value:'reportDesc',text:'描述',dictCode:''})
        fieldList.push({type:'string',value:'reportImage',text:'缩略图',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>