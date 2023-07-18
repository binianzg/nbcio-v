<template>
  <div class="project-space-overview" :class="project.task_board_theme">
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
          <li class="actives"><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/overview/' + id)">
              概览</a>
          </li>
          <li class=""><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/features/' + id)">
              版本</a>
          </li>
        </ul>
      </section>
    </div>
    <wrapper-content :showHeader="false">
      <div class="overview-item m-b">
        <div class="content-item">
          <h3 class="m-sm m-b text-center">任务燃尽图</h3>
          <a-spin :spinning="burnoutMap.loading">
            <ve-line v-if="!burnoutMap.loading" :data="burnoutMap.chartData" :settings="burnoutMap.chartSettings"
              :extend="burnoutMap.chartExtend" :series="burnoutMap.series" :legend-visible="false"
              height="200px"></ve-line>
          </a-spin>
        </div>
      </div>
      <div class="overview-item">
        <div class="content-left">
          <div class="content-item log-list">
            <div class="title">
              项目信息
              <a-tooltip :mouseEnterDelay="0.5">
                <template slot="title">
                  <span>添加信息</span>
                </template>
                <a class="pull-right muted" @click="createInfo()">
                  <a-icon type="plus-circle" />
                </a>
              </a-tooltip>
            </div>
            <div class="list-content">
              <a-list>
                <a-list-item :key="index" v-for="(item, index) in projectInfoList">
                  <a-list-item-meta>
                    <div slot="title">
                      <a-tooltip :mouseEnterDelay="0.5">
                        <template slot="title">
                          <span>{{item.description ? item.description : '暂无描述'}}</span>
                        </template>
                        <span>{{ item.name }} </span>
                      </a-tooltip>
                      <!--                                            <span class="right-item muted"> {{ formatTime(item.create_time) }}-->
                      <!--                                        </span>-->
                    </div>
                    <div slot="description">
                      {{ item.value }}
                    </div>
                  </a-list-item-meta>
                  <span slot="actions" @click="editInfo(item)">
                    <a-tooltip title="编辑">
                      <a-icon type="edit" />
                    </a-tooltip>
                  </span>
                  <span slot="actions" @click="delInfo(item,index)">
                    <a-tooltip title="删除">
                      <a-icon type="delete" />
                    </a-tooltip>
                  </span>
                </a-list-item>
              </a-list>
            </div>
          </div>
          <div class="content-item log-list">
            <div class="title">
              项目动态
            </div>
            <div class="list-content">
              <a-list>
                <div v-if="showLoadingMore" slot="loadMore"
                  :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                  <a-spin v-if="loadingMore" />
                  <a-button v-else @click="onLoadMore">查看更多动态</a-button>
                </div>
                <a-list-item :key="index" v-for="(item, index) in activities">
                  <a-list-item-meta>
                    <a-avatar slot="avatar" :src="item.member_avatar" />
                    <div slot="title">
                      <span>{{ item.member_name }} </span>
                      <span v-if="item.is_comment == 0"> <span v-html="item.remark "></span></span>&nbsp;
                      <template v-if="item.is_comment == 1">发表了评论
                        <p class="comment-text">{{ item.content }}</p>
                      </template>
                      <span class="right-item muted"> {{ formatTime(item.create_time) }}
                      </span>
                    </div>
                    <div slot="description">
                      <template v-if="item.action_type == 'task'">
                        <router-link class="muted"
                          :to="`/project/space/task/${item.project_code}/detail/${item.source_code}`">
                          {{ item.sourceInfo.name }}
                        </router-link>
                      </template>
                      <template v-if="item.action_type == 'project'">
                        <span v-html="item.content"></span>
                      </template>
                    </div>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="content-item">
            <div class="list-content">
              <div class="default-list">
                <a-list>
                  <a-list-item :key="index" v-for="(item, index) in [project]">
                    <a-list-item-meta>
                      <a-avatar slot="avatar" :src="item.cover" />
                      <div slot="title">
                        <span>{{ item.name }}</span>
                      </div>
                      <div slot="description">
                        {{item.owner_name}} 创建于
                        {{moment(item.create_time).format('YYYY年MM月DD日')}}
                      </div>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </div>
            </div>
            <p class="">{{project.description}}</p>
            <div class="project-date m-b-lg m-t-lg">
              <div class="muted m-b-xs">
                <a-tag color="green">项目周期</a-tag>
              </div>
              <a-range-picker v-model="projectDate" format="YYYY年MM月DD日" @change="ondateChange" />
            </div>
            <div class="project-stats m-b-lg">
              <div class="muted m-b-xs">
                <a-tag color="green">项目统计</a-tag>
              </div>
              <div class="stats-content">
                <div class="stats-item" :key="index" v-for="(stats, index) in projectStats">
                  <div class="stats-title muted">{{stats.title}}</div>
                  <div class="stats-number">{{stats.number}}</div>
                  <a-tooltip placement="right" :mouseEnterDelay="0.3" :title="`${stats.schedule}%`">
                    <a-progress strokeColor="#1890ff" :strokeWidth="3" :showInfo="false" :percent="stats.schedule" />
                  </a-tooltip>
                </div>
              </div>
            </div>
            <div>
              <div class="muted">
                <a-tag color="green">新增任务趋势</a-tag>
              </div>
              <ve-line :data="chartData" :settings="chartSettings" :extend="chartExtend" :legend-visible="false"
                height="200px"></ve-line>
            </div>
          </div>
        </div>
      </div>
    </wrapper-content>
    <!--项目信息-->
    <a-modal class="project-info" :width="400" v-model="infoModal.modalStatus" :title="infoModal.modalTitle"
      :confirmLoading="infoModal.loading" @ok="handleSubmit">
      <a-form @submit.prevent="handleSubmit" :form="infoModal.form">
        <a-form-item>
          <a-input placeholder='名称' v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入名称' }]}
                                            ]" />
        </a-form-item>
        <a-form-item>
          <a-textarea placeholder='内容' :rows="2" v-decorator="['value']" />
        </a-form-item>
        <a-form-item>
          <a-textarea placeholder='描述' :rows="2" v-decorator="['description']" />
        </a-form-item>
        <a-form-item>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import moment from "moment";
  import VeLine from 'v-charts/lib/line.common'
  import {
    getProjectReport as projectReport,
    projectStats,
    doData,
    prejectset
  } from "@/api/teamwork/project";
  import {
    infoDoData as doInfo,
    infoList as getInfoList,
    infoDelete as delProjectInfo
  } from "@/api/teamwork/project";
  import {
    collect
  } from "@/api/teamwork/project";
  import {
    checkResponse
  } from "@/assets/tw/js/utils";
  import {
    getLogBySelfProject
  } from "@/api/teamwork/project";
  import {
    dateTotalForProject
  } from "@/api/teamwork/task";
  import {
    relativelyTime
  } from "@/assets/tw/js/dateTime";
  import pagination from "../mixins/pagination";
  import projectSelect from '../components/projectSelect'
  import WrapperContent from '../components/WrapperContent'
  import '@/assets/tw/css/theme.less';

  export default {
    name: "project-space-overview",
    components: {
      VeLine,
      projectSelect,
      WrapperContent
    },
    mixins: [pagination],
    data() {
      return {
        id: this.$route.params.id,
        loading: true,
        project: {
          task_board_theme: 'simple'
        },
        projectDate: [],
        activities: [],
        projectInfoList: [],
        showLoadingMore: false,
        loadingMore: false,
        infoModal: {
          form: this.$form.createForm(this),
          newData: {
            id: ''
          },
          loading: false,
          modalStatus: false,
          modalTitle: '项目信息',
        },
        burnoutMap: {
          loading: true,
          chartData: {
            columns: ['日期', '实际剩余任务', '理想剩余任务'],
            rows: []
          },
          series: [{
              type: 'line',
              name: '实际剩余任务',
              smooth: false,
              color: '#1890ff',
              data: [],
            },
            {
              type: 'line',
              name: '理想剩余任务',
              color: '#52C41A',
              smooth: false,
              lineStyle: {
                type: 'dashed'
              },
              data: []
            },
          ],
          chartSettings: {},
          chartExtend: {
            grid: {
              left: '5',
              right: '20',
              top: '10',
              bottom: '0'
            },
            xAxis: {
              show: true,
              // boundaryGap: false,
              splitLine: {
                show: false
              }
            },
            yAxis: {
              show: true,
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: ['#e4e4e4']
                }
              }
            },
            tooltip: {
              backgroundColor: '#fff',
              textStyle: {
                color: '#333'
              },
              borderWidth: 1,
              borderColor: '#e8e8e8',
            },
            axisPointer: {
              lineStyle: {
                width: 0
              }
            }
          }
        },
        chartData: {
          columns: ['日期', '任务'],
          rows: [],
        },
        chartSettings: {
          area: true,
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: '#e6f7ff'
          }
        },
        chartExtend: {
          grid: {
            left: '-20',
            right: '0',
            top: '10',
            bottom: '0'
          },
          xAxis: {
            show: false,
          },
          yAxis: {
            show: false,
          },
          tooltip: {
            backgroundColor: '#fff',
            textStyle: {
              color: '#333'
            },
            borderWidth: 1,
            borderColor: '#e8e8e8',
          },
          axisPointer: {
            lineStyle: {
              width: 0
            }
          }
        },

        projectStats: [{
            title: '未完成',
            key: 'unDone',
            number: 0,
            schedule: 0
          },
          {
            title: '已完成',
            key: 'done',
            number: 0,
            schedule: 0
          },
          {
            title: '已逾期',
            key: 'overdue',
            number: 0,
            schedule: 0
          },
          {
            title: '待认领',
            key: 'toBeAssign',
            number: 0,
            schedule: 0
          },
          {
            title: '今日到期',
            key: 'expireToday',
            number: 0,
            schedule: 0
          },
          {
            title: '逾期完成',
            key: 'doneOverdue',
            number: 0,
            schedule: 0
          },
        ]
      }
    },
    created() {
      this.getProject();
      this.init();
    },
    methods: {
      moment,
      init() {
        this.getProjectInfoList();
        this.getProjectLog();
        this.overviewForProject();
        this.getProjectStats();
        this.getProjectReport();
      },
      getProject() {
        this.loading = true;
        prejectset({id:this.id}).then((res) => {
          this.loading = false;
          this.project = res.result;
          if (this.project.beginTime) {
            this.projectDate = [moment(this.project.beginTime), moment(this.project.endTime)];
          }
        });
      },
      getProjectReport() {
        let that = this;
        projectReport({
          projectId: this.id
        }).then(res => {
          console.log("getProjectReport res",res);
          let rows = [];
          res.result.date.forEach((v) => {
            rows.push({
              '日期': v
            })
          });
          that.burnoutMap.loading = false;
          that.burnoutMap.chartData.rows = rows;
          that.burnoutMap.series[0].data = res.result.undoneTask;
          that.burnoutMap.series[1].data = res.result.baseLineList;

        });
      },
      getProjectLog(reset = true) {
        let that = this;
        if (reset) {
          that.pagination.page = 1;
          that.pagination.pageSize = 20;
          that.showLoadingMore = false;
        }
        getLogBySelfProject({projectId: that.id}).then(res => {
          console.log("getLogBySelfProject res",res);
          let list = [];
          res.result.list.forEach((item) => {
            list.push(item);
            //只显示任务的完成动态
            // if (item.action_type === 'task') {
            //     if ((item.type === 'done' || item.type === 'redo')) {
            //         list.push(item);
            //     }
            // } else {
            //     list.push(item);
            // }
          });
          if (reset) {
            that.activities = [];
          }
          that.activities = that.activities.concat(list);
          that.pagination.total = res.result.total;
          that.showLoadingMore = that.pagination.total > that.activities.length;
          that.loading = false;
          that.loadingMore = false;
        })
      },
      getProjectInfoList() {
        let that = this;
        getInfoList({
          projectId: that.id
        }).then(res => {
          console.log("getInfoList res",res);
          that.projectInfoList = res.result;
        });
      },
      getProjectStats() {
        let that = this;
        projectStats({
          projectId: this.id
        }).then(res => {
          console.log("projectStats res",res);
          const taskStats = res.result;
          const total = taskStats['total'];
          this.projectStats.forEach((v, k) => {
            v.number = taskStats[v.key];
            if (total) {
              v.schedule = parseInt(v.number / total * 100);
            }
          })
        });
      },
      onLoadMore() {
        this.loadingMore = true;
        this.pagination.page++;
        this.getProjectLog(false);
      },
      overviewForProject() {
        dateTotalForProject({
          projectId: this.id
        }).then(res => {
          console.log("dateTotalForProject res",res);
          let list = [];
          res.result.forEach((v) => {
            list.push({
              '日期': moment(v.date).format('M月D日'),
              '任务': v.total,
            })
          });
          this.chartData.rows = list;
        })
      },
      createInfo() {
        let that = this;
        that.infoModal.newData = {
          id: ''
        };
        setTimeout(function() {
          that.infoModal.form && that.infoModal.form.resetFields();
        }, 0);
        that.infoModal.modalStatus = true;
        that.infoModal.modalTitle = '添加字段';
      },
      editInfo(info) {
        let that = this;
        that.infoModal.newData = info;
        that.infoModal.modalStatus = true;
        setTimeout(function() {
          that.infoModal.modalTitle = '编辑字段';
          that.infoModal.form.setFieldsValue({
            name: info.name,
            value: info.value,
            description: info.description,
          });
        }, 0);
      },
      delInfo(info, index) {
        let that = this;
        that.$confirm({
          title: '确定删除当前字段吗？',
          okText: '删除',
          okType: 'danger',
          cancelText: '再想想',
          onOk() {
            delProjectInfo({
              infoId: info.id
            }).then(() => {
              that.projectInfoList.splice(index, 1);
              // that.init();
            });
            return Promise.resolve();
          }
        });
      },
      handleSubmit() {
        let that = this;
        that.infoModal.form.validateFields(
          (err) => {
            if (!err) {
              that.handleOk();
            }
          })
      },
      handleOk() {
        let that = this;
        that.infoModal.loading = true;
        let obj = that.infoModal.form.getFieldsValue();
        if (that.infoModal.newData.id) {
          //编辑
          obj.infoId = that.infoModal.newData.id;
        } else {
          //新增
          Object.assign(obj, that.infoModal.newData);
        }
        obj.projectId = that.projectId;
        console.log(obj);
        doInfo(obj).then(res => {
          that.infoModal.loading = false;
          if (!checkResponse(res)) {
            return;
          }
          that.infoModal.form.resetFields();
          that.infoModal.newData = {
            id: 0
          };
          that.infoModal.modalStatus = false;
          that.getProjectInfoList();
        });
      },
      collectProject() {
        const type = this.project.collected ? 'cancel' : 'collect';
        collect(this.project.id, type).then((res) => {
          if (!checkResponse(res)) {
            return;
          }
          this.project.collected = !this.project.collected;
        })
      },
      ondateChange(e) {
        console.log(e);
        const project = this.project;
        doData({
          projectId: project.id,
          begin_time: e.length ? e[0].format('YYYY-MM-DD') : '',
          end_time: e.length ? e[1].format('YYYY-MM-DD') : '',
        });
      },
      formatTime(time) {
        return relativelyTime(time);
      },
    }
  }
</script>

<style lang="less">
  /*@import "../../../assets/css/components/task";*/
  .project-info {
    .ant-modal-body {
      padding-bottom: 0;
    }
  }

  .project-space-overview {
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

      .overview-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .content-item {
        background: #fff;
        padding: 6px 18px 18px 18px;
        border-radius: 4px;
        width: 100%;

        .title {
          font-size: 16px;
          padding: 6px 0 0 0;
        }
      }

      .content-left {
        width: 730px;

        .log-list {
          background: #fff;
          margin-bottom: 15px;

          .list-content {
            padding-top: 12px;

            .ant-list-item-meta-title {
              position: relative;
            }

            .right-item {
              float: right;
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }

      .content-right {
        width: 325px;

        .project-date {
          .ant-calendar-picker {
            border: none;

            &:focus {
              border: none;
            }

          }

          .ant-calendar-picker-input {
            border: none;
          }
        }

        .project-stats {
          .stats-content {
            display: flex;
            flex-wrap: wrap;

            .stats-item {
              width: 80px;
              /*height: 100px;*/
              margin-right: 16px;
              margin-bottom: 16px;
              padding: 12px;

              .stats-title {}

              .stats-number {
                /*font-weight: bold;*/
                font-size: 32px;
              }
            }
          }
        }
      }
    }
  }
</style>