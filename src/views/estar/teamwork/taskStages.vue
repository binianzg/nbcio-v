<template>
  <a-card :bordered="false">
    <div class=" ">
      <div class="action">
        <a-button type="primary" icon="plus" @click="handleAction(null,'new')">添加任务</a-button>
      </div>
      <h3>「{{$route.query.name}}」任务列表</h3>
      <a-list class="default-list" :loading="loading" itemLayout="horizontal" :dataSource="dataSource">
        <div v-if="showLoadingMore" slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-spin v-if="loadingMore" />
          <a-button v-else @click="onLoadMore">查看更多任务</a-button>
        </div>
        <a-list-item slot="renderItem" slot-scope="item,index">
          <span slot="actions" @click="handleAction(item,'edit')">
            <a-tooltip title="编辑">
              <a-icon type="edit" />
            </a-tooltip>
          </span>
          <span slot="actions" @click="handleAction(item,'del',index)">
            <a-tooltip title="删除">
              <a-icon type="delete" />
            </a-tooltip>
          </span>
          <a-list-item-meta :description="'排序：'+item.sort">
            <span slot="title">{{item.name}}</span>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <a-modal :width="360" v-model="actionInfo.modalStatus" :title="actionInfo.modalTitle"
        :bodyStyle="{paddingBottom:'1px'}" :footer="null">
        <a-form @submit.prevent="handleSubmit" :form="form">
          <a-form-item>
            <a-input placeholder='任务名称（必填）' v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入任务名称' }]}
                                            ]" />
          </a-form-item>
          <a-form-item help="排序，值越大越靠前，默认0">
            <a-input-number style="width: 100%" :min="0" placeholder='排序' v-decorator="[
                                            'sort',
                                            ]" />
          </a-form-item>
          <a-form-item>
            <div class="action-btn">
              <a-button type="primary" htmlType='submit' block size="large" :loading="actionInfo.confirmLoading"
                class="middle-btn">保存任务
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </a-card>
</template>
<script>
  import {
    httpAction,
    deleteAction
  } from '@/api/manage';
  import {
    GetStagesList,
  } from '@/api/teamwork/task';
  import pagination from "./mixins/pagination";

  export default {
    components: {},
    mixins: [pagination],
    data() {
      return {
        dataSource: [],
        loading: true,
        showLoadingMore: false,
        loadingMore: false,
        currentTemplate: {},
        newData: {
          id: 0,
        },
        form: this.$form.createForm(this),
        searchForm: {},
        actionInfo: {
          modalStatus: false,
          confirmLoading: false,
          modalTitle: '编辑任务',
        },
        url: {
          add: "/tw/twTaskStagesTemplate/add",
          edit: "/tw/twTaskStagesTemplate/edit",
          delete: "/tw/twTaskStagesTemplate/delete"
        },
      }
    },
    watch: {
      $route() {
        this.init();
      },
      viewType() {
        this.init();
      }
    },
    created() {
      this.init();
    },
    methods: {
      init(reset = true) {
        let that = this;
        if (reset) {
          that.dataSource = [];
          that.pagination.page = 1;
          that.showLoadingMore = false;
        }
        that.loading = true;
        GetStagesList({
          templateId: that.$route.query.id,
          pageNo: that.pagination.page,
        }).then(res => {
          console.log("GetStagesList res=", res);
          that.dataSource = that.dataSource.concat(res.result.records);
          that.pagination.total = res.result.total;
          that.showLoadingMore = that.pagination.total > that.dataSource.length;
          that.loading = false;
          that.loadingMore = false
        });
      },
      onLoadMore() {
        this.loadingMore = true;
        this.pagination.page++;
        this.init(false);
      },
      handleAction(record, action, index) {
        this.currentTemplate = record;
        let that = this;
        that.newData = {
          id: ''
        };
        if (action == 'edit' || action == 'new') {
          setTimeout(function() {
            that.form && that.form.resetFields();
          }, 0);
          that.actionInfo.modalStatus = true;
          that.actionInfo.modalTitle = '添加任务';
          if (action == 'edit') {
            //modal没显示之前不会实例化modal子元素，延迟处理
            setTimeout(function() {
              that.actionInfo.modalTitle = '编辑任务';
              that.form.setFieldsValue({
                name: record.name,
                sort: record.sort,
              });
              that.cover = record.cover;
              that.newData = record;
            }, 0);
          }
        } else if (action == 'del') {
          this.$confirm({
            title: '确定删除任务？',
            content: `删除任务「${this.currentTemplate.name}」后已以该任务创建的项目不受影响`,
            okText: '删除任务',
            okType: 'danger',
            cancelText: '再想想',
            onOk() {
              deleteAction(that.url.delete, {id: record.id}).then((res) => {
                that.dataSource.splice(index, 1);
                // that.init();
              });
              return Promise.resolve();
            }
          });
        }
      },
      handleSubmit() {
        let that = this;
        that.form.validateFields(
          (err) => {
            if (!err) {
              that.handleOk();
            }
          })
      },
      handleData(data) {
        if (data.id) {
          return httpAction(this.url.edit, data, 'put');
        } else {
          return httpAction(this.url.add, data, 'post');
        }
      },
      handleOk() {
        let that = this;
        that.actionInfo.confirmLoading = true;
        let obj = that.form.getFieldsValue();
        obj.projectTemplateId = that.$route.query.id;
        if (that.newData.id) {
          //编辑
          obj.id = that.newData.id;
        } else {
          //新增
          Object.assign(obj, that.newData);
        }
        console.log("handleOk obj=", obj);

        that.handleData(obj).then(res => {
          that.actionInfo.confirmLoading = false;
          if (!res.success) {
            that.$message.warning(res.message);
            return;
          }
          that.form.resetFields();
          that.newData = {
            id: ''
          };
          that.actionInfo.modalStatus = false;
          that.init();

        });
      },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          getBase64(info.file.originFileObj, (imageUrl) => {
            this.cover = info.file.response.data.url;
            this.uploadLoading = false;
          })
        }
      },
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片不能超过2MB!')
        }
        return isLt2M
      },
    }
  }
</script>
<style lang="less">
  .project-template-index {
    .ant-breadcrumb>span:last-child {
      color: rgba(0, 0, 0, 0.45) !important;
    }

    .ant-list-item-content {}
  }
</style>