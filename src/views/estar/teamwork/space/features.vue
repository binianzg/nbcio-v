<template>
  <div class="project-space-features" :class="project.task_board_theme">
    <div class="project-navigation">
      <div class="project-nav-header">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a>
              <a-icon type="home" />
              首页
            </a>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <project-select class="nav-title" style="display: inline-block" :id="id"></project-select>
            <span class="actions">
              <a-tooltip :mouseEnterDelay="0.3" :title="project.collected ? '取消收藏' : '加入收藏'" @click="collectProject">
                <a-icon type="star" theme="filled" style="color: grey;" v-show="!project.collected" />
                <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="project.collected" />
              </a-tooltip>
            </span>
            <span class="label label-normal" v-if="project.private === 0"><a-icon type="global" /> 公开</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <section class="nav-body">
        <ul class="nav-wrapper nav nav-underscore pull-left">
          <li><a class="app" data-app="tasks" @click="$router.push('/estar/teamwork/space/task/' + id)">任务</a></li>
          <li class=""><a class="app" data-app="works" @click="$router.push('/estar/teamwork/space/files/' + id)">
              文件</a>
          <li><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/overview/' + id)">
              概览</a>
          </li>
          <li class="actives"><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/features/' + id)">
              版本</a>
          </li>
          <li class=""><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/gantt/' + id)">
              甘特图</a>
          </li>
        </ul>
      </section>
    </div>
    <wrapper-content :showHeader="false">
      <div class="content-wrapper">
        <div class="content-item features-content">
          <div class="actions m-t">
            <a-dropdown placement="bottomCenter" :trigger="['click']" v-if="currentProjectFeatures">
              <a class="m-r text-default features-list-dropdown">
                <span class="m-r-xs">{{currentProjectFeatures.name}}</span>
                <a-icon type="down" />
              </a>
              <a-menu class="field-right-menu" slot="overlay" :selectable="false" @click="changeProjectFeatures">
                <a-menu-item :key="projectFeatures.id" v-for="projectFeatures in projectFeaturesList">
                  <div class="menu-item-content">
                    <div>
                      <a-radio :checked="currentProjectFeatures.id == projectFeatures.id"></a-radio>
                      <span color="green">{{projectFeatures.name}}</span>
                    </div>
                    <div>
                      <a class="muted">
                        <a-icon type="edit" @click.stop="editFeatures(projectFeatures)"></a-icon>
                      </a>
                      <a class="muted">
                        <a-icon type="delete" class="m-l" @click.stop="deleteFeatures(projectFeatures)"></a-icon>
                      </a>
                    </div>
                  </div>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button icon="plus" type="primary" @click="createFeatures">创建版本库</a-button>
            <a-divider class="m-b-lg m-t-lg"></a-divider>
          </div>
          <a-spin :spinning="loading" v-if="currentProjectFeatures">
            <template v-if="versionTotal">
              <div :key="versionType" v-for="(versionItem,versionType) in versionList">
                <a style="cursor: pointer;display: block" class="muted m-l-sm m-b-sm"
                  v-if="versionType == 'published' && versionItem.length" @click="showPublished = !showPublished">
                  <span class="m-r-sm">已发布版本</span>
                  <a-icon type="up" v-show="showPublished" />
                  <a-icon type="ellipsis" v-show="!showPublished" />
                </a>
                <div class="version-content" :class="{'published':versionType == 'published'}">
                  <template v-for="(version,versionIndex) in versionItem">
                    <a-card class="version-item" :key="versionIndex" hoverable
                      v-show="versionType != 'published' || (versionType == 'published' && showPublished)"
                      @click="showVersionDetail(version.id)">
                      <template slot="title">
                        <strong :class="{'muted':versionType == 'published'}">{{version.name}}</strong>
                        <a-dropdown placement="bottomCenter" :trigger="['click']" v-show="versionType == 'normal'">
                          <span class="version-status" :class="`status-${version.status}`" @click.stop="()=>{}">
                            <a-icon type="schedule" /> <span class="m-l-xs">{{version.statusText}}</span>
                          </span>
                          <a-menu class="field-right-menu" slot="overlay" :selectable="false"
                            @click="changeVersionStatus($event,versionType,version,versionIndex)">
                            <a-menu-item key="0">
                              <div class="menu-item-content">
                                <a-tag>未开始</a-tag>
                                <a-icon type="check" class="check muted" v-show="version.status == 0"></a-icon>
                              </div>
                            </a-menu-item>
                            <a-menu-item key="1">
                              <div class="menu-item-content">
                                <a-tag color="blue">进行中</a-tag>
                                <a-icon type="check" class="check muted" v-show="version.status == 1"></a-icon>
                              </div>
                            </a-menu-item>
                            <a-menu-item key="2">
                              <div class="menu-item-content">
                                <a-tag color="red">延期发布</a-tag>
                                <a-icon type="check" class="check muted" v-show="version.status == 2"></a-icon>
                              </div>
                            </a-menu-item>
                            <a-menu-item key="3">
                              <div class="menu-item-content">
                                <a-tag color="green">已发布</a-tag>
                                <a-icon type="check" class="check muted" v-show="version.status == 3"></a-icon>
                              </div>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </template>
                      <div class="publish-time muted">
                        <template v-if="version.publish_time || version.plan_publish_time ">
                          <span v-if="versionType == 'normal'">预计发布时间：{{version.plan_publish_time}}</span>
                          <span v-else>发布时间：{{version.publish_time}}</span>
                        </template>
                      </div>
                      <a-tooltip v-show="versionType == 'normal'" placement="top" :mouseEnterDelay="0.3"
                        :title="`当前进度：${version.schedule}%`">
                        <a-progress :strokeWidth="4" :showInfo="false" :percent="parseInt(version.schedule)" />
                      </a-tooltip>
                    </a-card>
                  </template>
                  <a-card class="version-item version-create" hoverable v-show="versionType == 'normal'"
                    @click="createVersion">
                    <a class="muted">
                      <div>
                        <a-icon type="plus"></a-icon>
                        <div>创建版本</div>
                      </div>
                    </a>
                  </a-card>
                </div>
              </div>
            </template>
            <div class="text-center" v-else>
              <p class="muted">暂无可用版本</p>
              <a-button type="primary" @click="createVersion">创建版本</a-button>
            </div>
          </a-spin>
        </div>
      </div>
    </wrapper-content>
    <a-modal destroyOnClose :width="360" v-model="projectFeatures.modalStatus" :title="projectFeatures.modalTitle"
      :bodyStyle="{paddingBottom:'1px'}" :footer="null">
      <a-form @submit.prevent="handleSubmit" :form="form">
        <a-form-item>
          <a-input placeholder='版本库名称' v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入版本库名称' }]}
                                            ]" />
        </a-form-item>
        <a-form-item>
          <a-textarea placeholder='版本库简介' :rows="2" v-decorator="['description']" />
        </a-form-item>
        <a-form-item>
          <div class="action-btn">
            <a-button type="primary" htmlType='submit' block size="large" :loading="projectFeatures.confirmLoading"
              class="middle-btn">{{projectFeatures.modalTitle}}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal destroyOnClose :width="500" v-model="projectVersion.modalStatus" :title="projectVersion.modalTitle"
      :bodyStyle="{paddingBottom:'1px'}" :footer="null">
      <a-form @submit.prevent="handleSubmitProjectVersion" :form="projectVersionForm">
        <a-form-item>
          <a-input placeholder='版本名称' v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入版本名称' }]}
                                            ]" />
        </a-form-item>
        <a-form-item>
          <a-textarea placeholder='版本备注' :rows="2" v-decorator="['description']" />
        </a-form-item>
        <a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-date-picker showTime format="YYYY年MM月DD日 HH:mm" style="width: 100%" placeholder="选择开始时间"
                v-decorator="['startTime']"></a-date-picker>
            </a-col>
            <a-col :span="12">
              <a-date-picker showTime format="YYYY年MM月DD日 HH:mm" style="width: 100%" placeholder="选择预计发布时间"
                v-decorator="['planPublishTime']"></a-date-picker>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <div class="action-btn">
            <a-button type="primary" htmlType='submit' block size="large" :loading="projectVersion.confirmLoading"
              class="middle-btn">创建版本
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal destroyOnClose :width="360" v-model="publishVersion.modalStatus" title="实际发布时间"
      :bodyStyle="{paddingBottom:'1px'}" :footer="null">
      <a-form @submit.prevent="handleSubmitPublishVersion" :form="publishVersionForm">
        <a-form-item>
          <a-date-picker showTime format="YYYY年MM月DD日 HH:mm" style="width: 100%" placeholder="选择实际发布时间"
            v-decorator="['publishTime']"></a-date-picker>
        </a-form-item>
        <a-form-item>
          <div class="action-btn">
            <a-button type="primary" htmlType='submit' block size="large" :loading="publishVersion.confirmLoading"
              class="middle-btn">确认发布
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal destroyOnClose class="task-detail-modal" width="min-content" :closable="false" title="" :footer="null"
      v-model="versionDetail.modalStatus" @cancel="versionDetailClose">
      <version-detail :versionId="versionDetail.id" @close="versionDetailClose"></version-detail>

    </a-modal>
  </div>
</template>

<script>
  import moment from "moment";
  import {
    prejectset as getProject
  } from "@/api/teamwork/project";
  import {
    collect
  } from "@/api/teamwork/project";
  import {
    checkResponse
  } from "@/assets/tw/js/utils";
  import {
    relativelyTime
  } from "@/assets/tw/js/dateTime";
  import pagination from "../mixins/pagination";
  import {
    save,
    listIndex as getProjectFeatureList,
    edit,
    del
  } from "@/api/teamwork/features";
  import {
    save as saveProjectVersion,
    listIndex as getProjectVersionList,
    changeStatus
  } from "@/api/teamwork/version";
  import versionDetail from "../components/versionDetail"
  import projectSelect from "../components/projectSelect"
  import WrapperContent from "../components/WrapperContent"
  import '@/assets/tw/css/theme.less';

  export default {
    name: "project-space-features",
    components: {
      versionDetail,
      projectSelect,
      WrapperContent
    },
    mixins: [pagination],
    data() {
      return {
        id: this.$route.params.id,
        project: {
          task_board_theme: 'simple'
        },
        loading: true,
        form: this.$form.createForm(this),
        projectVersionForm: this.$form.createForm(this),
        publishVersionForm: this.$form.createForm(this),
        projectFeaturesList: [],
        currentProjectFeatures: null,
        currentProjectVersion: null,
        versionTotal: 1,
        versionList: {
          normal: [],
          published: []
        },
        showPublished: false,
        projectFeatures: {
          modalStatus: false,
          confirmLoading: false,
          modalTitle: '编辑版本库',
          info: null
        },
        projectVersion: {
          modalStatus: false,
          confirmLoading: false,
          modalTitle: '编辑版本',
          info: null
        },
        publishVersion: {
          modalStatus: false,
          confirmLoading: false,
          info: null,
          status: -1,
        },
        versionDetail: {
          modalStatus: false,
          id: ''
        },
      }
    },
    created() {
      this.getProject();
      this.init();
    },
    methods: {
      init() {
        this.getProjectFeaturesList();
      },
      getProject() {
        this.loading = true;
        getProject({id:this.id}).then((res) => {
          this.loading = false;
          this.project = res.result;
        });
      },
      getProjectFeaturesList() {
        getProjectFeatureList({
          projectId: this.id
        }).then(res => {
          this.projectFeaturesList = res.result;
          if (res.result.length && !this.currentProjectFeature) {
            this.currentProjectFeatures = res.result[0];
            this.getProjectVersionList();
          }
        })
      },
      getProjectVersionList() {
        let that = this;
        that.loading = true;
        console.log("getProjectVersionList projectFeaturesId",this.currentProjectFeatures.id);
        getProjectVersionList({
          projectFeaturesId: this.currentProjectFeatures.id
        }).then(res => {
          console.log("getProjectVersionList res",res);
          let versionTotal = 0;
          let normal = [];
          let published = [];
          res.result.forEach(v => {
            versionTotal++;
            if (v.status == 3) {
              published.push(v);
            } else {
              normal.push(v);
            }
          });
          that.versionTotal = versionTotal;
          that.versionList.normal = normal;
          that.versionList.published = published;
          that.loading = false;
        })
      },
      createFeatures() {
        let that = this;
        that.projectFeatures.modalStatus = true;
        that.projectFeatures.info = null;
        that.projectFeatures.modalTitle = '创建版本库';
      },
      editFeatures(features) {
        let that = this;
        that.projectFeatures.modalStatus = true;
        that.projectFeatures.modalTitle = '编辑版本库';
        that.projectFeatures.info = features;
        this.$nextTick(function() {
          that.form.setFieldsValue({
            name: features.name,
            description: features.description,
          });
        })
      },
      deleteFeatures(features) {
        let that = this;
        this.$confirm({
          title: '删除版本库',
          content: `若将『${features['name']}』 删除，所有与版本库相关的信息将会被彻底删除，删除后不可恢复。`,
          okText: '删除',
          okType: 'danger',
          cancelText: `再想想`,
          onOk() {
            del({
              featuresId: features.id
            }).then(res => {
              const result = checkResponse(res);
              if (!result) {
                return false;
              }
              if (that.currentProjectFeatures.id == features.id) {
                that.currentProjectFeatures = null;
              }
              that.init();
            });
            return Promise.resolve();
          }
        });
      },
      createVersion() {
        let that = this;
        that.projectVersion.modalStatus = true;
        that.projectVersion.info = null;
        that.projectVersion.modalTitle = '创建版本';
      },
      changeVersionStatus(e, versionType, version, index) {
        let that = this;
        if (e.key == version.id) {
          return false;
        }
        if (e.key == 3) {
          //请确认当前版本发布内容已全部完成后再发布。
          this.$confirm({
            title: '发布提示',
            content: `请确认当前版本发布内容已全部完成后再发布。`,
            okText: '确认发布',
            okType: 'primary',
            onOk() {
              that.publishVersion.info = version;
              that.publishVersion.status = e.key;
              that.publishVersion.modalStatus = true;
              that.$nextTick(function() {
                that.publishVersionForm.setFieldsValue({
                  publishTime: moment(),
                });
              });
              return Promise.resolve();
            }
          });

        } else {
          changeStatus({
            versionId: version.id,
            status: e.key
          }).then(res => {
            this.getProjectVersionList();
          });
        }
      },
      showVersionDetail(id) {
        this.versionDetail.modalStatus = true;
        this.versionDetail.id = id;
      },
      versionDetailClose() {
        this.versionDetail.modalStatus = false;
        this.versionDetail.id = '';
        this.getProjectVersionList();
      },
      handleSubmitPublishVersion() {
        let that = this;
        that.publishVersionForm.validateFields(
          (err) => {
            if (!err) {
              let obj = that.publishVersionForm.getFieldsValue();
              obj.publishTime = moment(obj.publishTime).format('YYYY-MM-DD HH:mm');
              changeStatus({
                versionId: this.publishVersion.info.id,
                status: this.publishVersion.status,
                publishTime: obj.publishTime,
              }).then(res => {
                that.publishVersion.modalStatus = false;
                that.getProjectVersionList();
              });
            }
          })
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
      handleOk() {
        let that = this;
        that.projectFeatures.confirmLoading = true;
        let obj = that.form.getFieldsValue();
        console.log("handleOk obj",obj);
        obj.projectId = this.id;
        if (that.projectFeatures.info) {
          obj.featuresId = that.projectFeatures.info.id;
          edit(obj).then(res => {
            that.projectFeatures.confirmLoading = false;
            if (!res.success) {
              return;
            }
            that.form.resetFields();
            this.getProjectFeaturesList();
            that.projectFeatures.modalStatus = false;
          });
        } else {
          save(obj).then(res => {
            that.projectFeatures.confirmLoading = false;
            if (!checkResponse(res)) {
              return;
            }
            that.form.resetFields();
            that.projectFeatures.modalStatus = false;
            that.init();
          });
        }

      },
      handleSubmitProjectVersion() {
        let that = this;
        that.projectVersionForm.validateFields(
          (err) => {
            if (!err) {
              that.handleOkProjectVersion();
            }
          })
      },
      handleOkProjectVersion() {
        let that = this;
        that.projectVersion.confirmLoading = true;
        let obj = that.projectVersionForm.getFieldsValue();
        obj.featuresId = this.currentProjectFeatures.id;
        obj.startTime = moment(obj.startTime).format('YYYY-MM-DD HH:mm');
        obj.planPublishTime = moment(obj.planPublishTime).format('YYYY-MM-DD HH:mm');
        saveProjectVersion(obj).then(res => {
          that.projectVersion.confirmLoading = false;
          if (!checkResponse(res)) {
            return;
          }
          that.projectVersionForm.resetFields();
          that.projectVersion.modalStatus = false;
          that.getProjectVersionList();
        });
      },
      changeProjectFeatures(e) {
        this.currentProjectFeatures = this.projectFeaturesList.find(item => item.id == e.key);
        this.getProjectVersionList();
      },
      collectProject() {
        const type = this.project.collected ? 'collect' : 'cancel';
        let params = {
          id: this.project.id,
          type: type,
        }
        collect(params).then((res) => {
          if (!checkResponse(res)) {
            return;
          }
          this.project.collected = !this.project.collected;
        })
      },
      formatTime(time) {
        return relativelyTime(time);
      },
    }
  }
</script>

<style lang="less">
  /*@import "../../../assets/css/components/task";*/

  .project-space-features {
    .project-navigation {
      top: 0px;
      z-index: 4;
    }

    .wrapper-main {
      background: initial;

    }

    .layout-content {
      padding: 12px;
      width: 1100px;
      margin: 12px auto auto;
      background: initial;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .content-item {
        /*background: #fff;*/

        .title {
          font-size: 16px;
          padding: 6px 0 0 0;
        }
      }

      .content-wrapper {
        width: 100%;
      }

      .actions {}

      .version-content {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 28px;
        width: calc(100% + 12px);
        flex-shrink: 0;

        .ant-card {
          width: 345px;
          height: 102px;
          margin: 0 6px 16px;
          flex: 0 0 auto;
          align-items: center;
          border-radius: 4px;
          /*display: inline-block;*/

          .ant-card-head {
            padding: 0 16px;
            border-bottom: none;

            .ant-card-head-title {
              padding: 12px 0;
              display: flex;
              justify-content: space-between;
              font-size: 14px;

              .version-status {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 82px;
                height: 28px;
                border-radius: 4px;
                background: #f5f5f5;
                padding: 4px 8px;

                &.status-0 {
                  color: #a6a6a6;
                }

                &.status-1 {
                  color: #1890ff;
                  background: #e6f7ff;
                  border-color: #91d5ff;
                }

                &.status-2 {
                  color: #f5222d;
                  background: #fff1f0;
                  border-color: #ffa39e;
                }

                &.status-3 {
                  color: #52c41a;
                  background: #f6ffed;
                  border-color: #b7eb8f;
                }
              }
            }
          }

          .ant-card-body {
            height: 100%;
            padding: 0 16px 16px 16px;

            .publish-time {
              min-height: 21px;
            }
          }
        }

        .version-create {
          .ant-card-body {
            padding-top: 16px;
          }

          a {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
        }

        &.published {
          .ant-card {
            height: auto;
          }
        }
      }
    }
  }

  .features-list-dropdown {
    cursor: pointer;
  }
</style>