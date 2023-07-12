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
      <a-button type="primary" icon="download" @click="handleExportXls('OA日程表')">导出</a-button>
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

    <oa-schedule-modal ref="modalForm" @ok="modalFormOk"></oa-schedule-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import OaScheduleModal from './modules/OaScheduleModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'OaScheduleList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      OaScheduleModal
    },
    data () {
      return {
        description: 'OA日程表管理页面',
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
            title:'标题',
            align:"center",
            dataIndex: 'title'
          },
          {
            title:'内容',
            align:"center",
            dataIndex: 'content'
          },
          {
            title:'日历类型',
            align:"center",
            dataIndex: 'calId'
          },
          {
            title:'开始时间',
            align:"center",
            dataIndex: 'startTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'结束时间',
            align:"center",
            dataIndex: 'endTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
	  {
            title:'是否全天',
            align:"center",
            dataIndex: 'allday_dictText'
          },
          {
            title:'所属人',
            align:"center",
            dataIndex: 'owner_dictText'
          },
          {
            title:'参与人',
            align:"center",
            dataIndex: 'taker_dictText'
          },
          {
            title:'优先级',
            align:"center",
            dataIndex: 'level_dictText'
          },
          {
            title:'提前提醒时间',
            align:"center",
            dataIndex: 'remind_dictText'
          },
          {
            title:'提醒方式',
            align:"center",
            dataIndex: 'remindType_dictText'
          },
          {
            title:'地点',
            align:"center",
            dataIndex: 'address'
          },
          {
            title:'颜色',
            align:"center",
            dataIndex: 'color'
          },
          {
            title:'来源',
            align:"center",
            dataIndex: 'source'
          },
          {
            title:'链接',
            align:"center",
            dataIndex: 'url'
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
          list: "/oa/oaSchedule/list",
          delete: "/oa/oaSchedule/delete",
          deleteBatch: "/oa/oaSchedule/deleteBatch",
          exportXlsUrl: "/oa/oaSchedule/exportXls",
          importExcelUrl: "oa/oaSchedule/importExcel",
          
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
        fieldList.push({type:'string',value:'title',text:'标题',dictCode:''})
        fieldList.push({type:'Text',value:'content',text:'内容',dictCode:''})
        fieldList.push({type:'popup',value:'calId',text:'日历类型', popup:{code:'SelectCalendar',field:'id',orgFields:'id',destFields:'cal_id'}})
        fieldList.push({type:'datetime',value:'startTime',text:'开始时间'})
        fieldList.push({type:'datetime',value:'endTime',text:'结束时间'})
        fieldList.push({type:'int',value:'allday',text:'是否全天',dictCode:'yn'})
        fieldList.push({type:'sel_user',value:'owner',text:'所属人'})
        fieldList.push({type:'sel_user',value:'taker',text:'参与人'})
        fieldList.push({type:'int',value:'level',text:'优先级',dictCode:'oa_reminder_level'})
        fieldList.push({type:'int',value:'remind',text:'提前提醒时间',dictCode:'oa_reminder_time'})
        fieldList.push({type:'string',value:'remindType',text:'提醒方式',dictCode:'oa_reminder_type'})
        fieldList.push({type:'string',value:'address',text:'地点',dictCode:''})
        fieldList.push({type:'string',value:'color',text:'颜色',dictCode:''})
        fieldList.push({type:'string',value:'source',text:'来源',dictCode:''})
        fieldList.push({type:'string',value:'url',text:'链接',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>