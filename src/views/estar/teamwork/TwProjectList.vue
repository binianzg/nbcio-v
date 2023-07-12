<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="名称">
              <j-input placeholder="请输入名称" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
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
      <a-button type="primary" icon="download" @click="handleExportXls('项目表')">导出</a-button>
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
        <template slot="nameSlot" slot-scope="text,record,index">
          <router-link target="_blank" :to="'/estar/teamwork/space/task/' + record.id">{{record.name}}</router-link>
          <a-tag color="green" class="m-l" v-show="record.privated==0">公开</a-tag>
        </template>
        <template slot="scheduleSlot" slot-scope="text,record">
          <div></div>
          <div><a-progress :percent="record.schedule"></a-progress></div>
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

        <span slot="action" slot-scope="text, record, index">
          <!--<a @click="handleEdit(record)">编辑</a>-->
          <a-tooltip  title="项目设置">
            <a-icon type="setting" @click="handleSet(record,index)"></a-icon>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip  title="添加成员">
            <a-icon type="user" @click="addProjectMember(record)"></a-icon>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip  :title="record.collected ? '取消收藏' : '加入收藏'"
                      @click="handleCollect(record,index)">
            <a-icon type="star" v-show="!record.collected" />
            <a-icon
                type="star"
                theme="filled"
                style="color: #ffaf38;"
                v-show="record.collected"
            />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip  title="移到回收站">
            <a-icon type="delete" @click="handleRecycle(record,index)"></a-icon>
          </a-tooltip>
        </span>

      </a-table>
    </div>
    <tw-project-modal ref="modalForm" @ok="modalFormOk"></tw-project-modal>
    <a-modal
        destroyOnClose
        class="project-config-modal"
        :width="800"
        v-model="projectModal.modalStatus"
        :title="projectModal.modalTitle"
        :footer="null"
    >
      <project-config :id="projectId" @update="updateProject"></project-config>
    </a-modal>
    <add-project-member
        v-model="showAddMember"
        :projectId="projectId"
        :organizationId="organizationId"
        v-if="showAddMember"
    ></add-project-member>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TwProjectModal from './modules/TwProjectModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {recycle,collect} from '@/api/teamwork/project';
  import addProjectMember from './components/addProjectMember'
  import projectConfig from './components/projectConfig'

  export default {
    name: 'TwProjectList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      addProjectMember,
      TwProjectModal,
      projectConfig,
    },
    data () {
      return {
        description: '项目表管理页面',
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
            dataIndex: 'name',
            scopedSlots: {customRender: 'nameSlot'}
          },
          {
            title:'封面',
            align:"center",
            dataIndex: 'cover',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'进度',
            align:"center",
            dataIndex: 'schedule',
            scopedSlots: {customRender: 'scheduleSlot'}
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title:'创建日期',
            align:"center",
            sorter: true,
            dataIndex: 'createTime'
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
          list: "/tw/twProject/list",
          delete: "/tw/twProject/delete",
          deleteBatch: "/tw/twProject/deleteBatch",
          exportXlsUrl: "/tw/twProject/exportXls",
          importExcelUrl: "tw/twProject/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        showAddMember: false,
        project: {},
        projectId: "",
        projectIndex: 0,
        organizationId: "",
        collectpage: false,
        /*项目设置*/
        projectModal: {
            modalStatus: false,
            modalTitle: '项目设置',
        },
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
      addProjectMember(record) {
          this.project = record;
          this.projectId = record.id;
          this.organizationId = record.organizationId;
          this.showAddMember = true;
      },
      handleSet(record,index) {
          let that = this;
          that.project = record;
          that.projectId = record.id;
          that.projectIndex = index;
          that.projectModal.modalStatus = true;
      },  
      updateProject(data) {
        //this.projectModal.modalStatus = false;
        this.dataSource[this.projectIndex] = JSON.parse(JSON.stringify(data));
      },
      handleCollect(record,index) {
        let that = this;
        const type = record.collected ? 'collect' : 'cancel';
        let params = {
          id: record.id,
          type: type,
        }
        collect(params).then(res => {
            if (res.success) {
              that.$message.success(res.message);
              console.log("select index=",index);
              that.$set(that.dataSource[index], 'collected', !record.collected);
              /*if (this.requestData.type == 'collect') {
                  that.dataSource.splice(index, 1);
              }*/
            } 
        });
      },
      handleRecycle(record,index) {
        let that = this;
        this.$confirm({
            title: '确定放入回收站？',
            content: `一旦将项目「${record.name}」放入回收站，所有与项目有关的信息将会被放入回收站`,
            okText: '放入回收站',
            okType: 'danger',
            cancelText: '再想想',
            onOk() {
                recycle({id: record.id}).then(() => {
                    that.dataSource.splice(index, 1);
                    // that.init();
                });
                return Promise.resolve();
            }
        });
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'name',text:'名称',dictCode:''})
        fieldList.push({type:'string',value:'cover',text:'封面',dictCode:''})
        fieldList.push({type:'sel_search',value:'templateId',text:'项目模板',dictTable:'tw_project_template', dictText:'name', dictCode:'id'})
        fieldList.push({type:'double',value:'schedule',text:'进度',dictCode:''})
        fieldList.push({type:'sel_search',value:'organizationId',text:'组织编码',dictTable:'tw_organization', dictText:'name', dictCode:'id'})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建日期'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>