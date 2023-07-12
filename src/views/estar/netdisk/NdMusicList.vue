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
      <a-button type="primary" icon="download" @click="handleExportXls('网盘音乐表')">导出</a-button>
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

    <nd-music-modal ref="modalForm" @ok="modalFormOk"></nd-music-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NdMusicModal from './modules/NdMusicModal'

  export default {
    name: 'NdMusicList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      NdMusicModal
    },
    data () {
      return {
        description: '网盘音乐表管理页面',
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
            title:'专辑',
            align:"center",
            dataIndex: 'album'
          },
          {
            title:'专辑艺术家',
            align:"center",
            dataIndex: 'albumartist'
          },
          {
            title:'专辑图片',
            align:"center",
            dataIndex: 'albumimageString'
          },
          {
            title:'艺术家',
            align:"center",
            dataIndex: 'artist'
          },
          {
            title:'评论',
            align:"center",
            dataIndex: 'comment'
          },
          {
            title:'创作者',
            align:"center",
            dataIndex: 'composer'
          },
          {
            title:'版权',
            align:"center",
            dataIndex: 'copyright'
          },
          {
            title:'编码器',
            align:"center",
            dataIndex: 'encoder'
          },
          {
            title:'文件ID',
            align:"center",
            dataIndex: 'fileid'
          },
          {
            title:'类型',
            align:"center",
            dataIndex: 'genre'
          },
          {
            title:'歌词',
            align:"center",
            dataIndex: 'lyrics'
          },
          {
            title:'原创艺术家',
            align:"center",
            dataIndex: 'originalartist'
          },
          {
            title:'公众',
            align:"center",
            dataIndex: 'publicer'
          },
          {
            title:'题目',
            align:"center",
            dataIndex: 'title'
          },
          {
            title:'声道',
            align:"center",
            dataIndex: 'track'
          },
          {
            title:'声道长度',
            align:"center",
            dataIndex: 'tracklength'
          },
          {
            title:'地址',
            align:"center",
            dataIndex: 'url'
          },
          {
            title:'年份',
            align:"center",
            dataIndex: 'year'
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
          list: "/nd/ndMusic/list",
          delete: "/nd/ndMusic/delete",
          deleteBatch: "/nd/ndMusic/deleteBatch",
          exportXlsUrl: "/nd/ndMusic/exportXls",
          importExcelUrl: "nd/ndMusic/importExcel",
          
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
        fieldList.push({type:'string',value:'album',text:'专辑',dictCode:''})
        fieldList.push({type:'string',value:'albumartist',text:'专辑艺术家',dictCode:''})
        fieldList.push({type:'Blob',value:'albumimage',text:'专辑图片',dictCode:''})
        fieldList.push({type:'string',value:'artist',text:'艺术家',dictCode:''})
        fieldList.push({type:'string',value:'comment',text:'评论',dictCode:''})
        fieldList.push({type:'string',value:'composer',text:'创作者',dictCode:''})
        fieldList.push({type:'string',value:'copyright',text:'版权',dictCode:''})
        fieldList.push({type:'string',value:'encoder',text:'编码器',dictCode:''})
        fieldList.push({type:'string',value:'fileid',text:'文件ID',dictCode:''})
        fieldList.push({type:'string',value:'genre',text:'类型',dictCode:''})
        fieldList.push({type:'Text',value:'lyrics',text:'歌词',dictCode:''})
        fieldList.push({type:'string',value:'originalartist',text:'原创艺术家',dictCode:''})
        fieldList.push({type:'string',value:'publicer',text:'公众',dictCode:''})
        fieldList.push({type:'string',value:'title',text:'题目',dictCode:''})
        fieldList.push({type:'string',value:'track',text:'声道',dictCode:''})
        fieldList.push({type:'double',value:'tracklength',text:'声道长度',dictCode:''})
        fieldList.push({type:'string',value:'url',text:'地址',dictCode:''})
        fieldList.push({type:'string',value:'year',text:'年份',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>