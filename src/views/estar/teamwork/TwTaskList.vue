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
      <a-button type="primary" icon="download" @click="handleExportXls('项目任务表')">导出</a-button>
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

    <tw-task-modal ref="modalForm" @ok="modalFormOk"></tw-task-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TwTaskModal from './modules/TwTaskModal'

  export default {
    name: 'TwTaskList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      TwTaskModal
    },
    data () {
      return {
        description: '项目任务表管理页面',
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
            title:'项目编号',
            align:"center",
            dataIndex: 'projectId'
          },
          {
            title:'name',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'紧急程度',
            align:"center",
            dataIndex: 'pri'
          },
          {
            title:'执行状态',
            align:"center",
            dataIndex: 'executeStatus'
          },
          {
            title:'详情',
            align:"center",
            dataIndex: 'description'
          },
          {
            title:'指派给谁',
            align:"center",
            dataIndex: 'assignTo'
          },
          {
            title:'回收站',
            align:"center",
            dataIndex: 'deleted'
          },
          {
            title:'任务列表',
            align:"center",
            dataIndex: 'stageId'
          },
          {
            title:'任务标签',
            align:"center",
            dataIndex: 'taskTag'
          },
          {
            title:'是否完成',
            align:"center",
            dataIndex: 'done'
          },
          {
            title:'开始时间',
            align:"center",
            dataIndex: 'beginTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'截止时间',
            align:"center",
            dataIndex: 'endTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'提醒时间',
            align:"center",
            dataIndex: 'remindTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'父任务id',
            align:"center",
            dataIndex: 'pid'
          },
          {
            title:'排序',
            align:"center",
            dataIndex: 'sort'
          },
          {
            title:'点赞数',
            align:"center",
            dataIndex: 'likes'
          },
          {
            title:'收藏数',
            align:"center",
            dataIndex: 'star'
          },
          {
            title:'删除时间',
            align:"center",
            dataIndex: 'deletedTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'是否隐私模式',
            align:"center",
            dataIndex: 'privated'
          },
          {
            title:'任务id编号',
            align:"center",
            dataIndex: 'idNum'
          },
          {
            title:'上级任务路径',
            align:"center",
            dataIndex: 'path'
          },
          {
            title:'进度百分比',
            align:"center",
            dataIndex: 'schedule'
          },
          {
            title:'版本id',
            align:"center",
            dataIndex: 'versionId'
          },
          {
            title:'版本库id',
            align:"center",
            dataIndex: 'featuresId'
          },
          {
            title:'预估工时',
            align:"center",
            dataIndex: 'workTime'
          },
          {
            title:'执行状态.0:未开始,1:已完成,2:进行中,3:挂起,4:测试中',
            align:"center",
            dataIndex: 'status'
          },
          {
            title:'liked',
            align:"center",
            dataIndex: 'liked'
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
          list: "/tw/twTask/list",
          delete: "/tw/twTask/delete",
          deleteBatch: "/tw/twTask/deleteBatch",
          exportXlsUrl: "/tw/twTask/exportXls",
          importExcelUrl: "tw/twTask/importExcel",
          
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
        fieldList.push({type:'string',value:'projectId',text:'项目编号',dictCode:''})
        fieldList.push({type:'string',value:'name',text:'name',dictCode:''})
        fieldList.push({type:'int',value:'pri',text:'紧急程度',dictCode:''})
        fieldList.push({type:'string',value:'executeStatus',text:'执行状态',dictCode:''})
        fieldList.push({type:'Text',value:'description',text:'详情',dictCode:''})
        fieldList.push({type:'string',value:'assignTo',text:'指派给谁',dictCode:''})
        fieldList.push({type:'int',value:'deleted',text:'回收站',dictCode:''})
        fieldList.push({type:'string',value:'stageId',text:'任务列表',dictCode:''})
        fieldList.push({type:'string',value:'taskTag',text:'任务标签',dictCode:''})
        fieldList.push({type:'int',value:'done',text:'是否完成',dictCode:''})
        fieldList.push({type:'date',value:'beginTime',text:'开始时间'})
        fieldList.push({type:'date',value:'endTime',text:'截止时间'})
        fieldList.push({type:'date',value:'remindTime',text:'提醒时间'})
        fieldList.push({type:'string',value:'pid',text:'父任务id',dictCode:''})
        fieldList.push({type:'int',value:'sort',text:'排序',dictCode:''})
        fieldList.push({type:'int',value:'likes',text:'点赞数',dictCode:''})
        fieldList.push({type:'int',value:'star',text:'收藏数',dictCode:''})
        fieldList.push({type:'date',value:'deletedTime',text:'删除时间'})
        fieldList.push({type:'int',value:'privated',text:'是否隐私模式',dictCode:''})
        fieldList.push({type:'int',value:'idNum',text:'任务id编号',dictCode:''})
        fieldList.push({type:'Text',value:'path',text:'上级任务路径',dictCode:''})
        fieldList.push({type:'int',value:'schedule',text:'进度百分比',dictCode:''})
        fieldList.push({type:'string',value:'versionId',text:'版本id',dictCode:''})
        fieldList.push({type:'string',value:'featuresId',text:'版本库id',dictCode:''})
        fieldList.push({type:'int',value:'workTime',text:'预估工时',dictCode:''})
        fieldList.push({type:'int',value:'status',text:'执行状态.0:未开始,1:已完成,2:进行中,3:挂起,4:测试中',dictCode:''})
        fieldList.push({type:'int',value:'liked',text:'liked',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>