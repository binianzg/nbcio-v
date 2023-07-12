<template>
  <div class="project-space-task" :class="project.task_board_theme">
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
          <li class="actives"><a class="app" data-app="tasks">任务</a></li>
          <li class=""><a class="app" data-app="works" @click="$router.push('/estar/teamwork/space/files/' + id)">
              文件</a>
          <li class=""><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/overview/' + id)">
              概览</a>
          </li>
          <li class=""><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/features/' + id)">
              版本</a>
          </li>
        </ul> 
      </section>
      <div class="project-nav-footer">
        <a class="footer-item" @click="visibleDraw('taskSearch')">
          <a-icon type="search"></a-icon>
          <span> 筛选</span>
        </a>
        <a class="footer-item" :class="{active:slideMenuKey == 'member'}" @click="visibleDraw('member')">
          <a-icon type="user"></a-icon>
          <span> {{projectMembers.length}}</span>
        </a>
        <a class="footer-item" :class="{active:slideMenuKey == 'config'}" @click="visibleDraw('config')">
          <a-icon type="menu"></a-icon>
          <span> 菜单</span>
        </a>
      </div>
    </div>
    <wrapper-content :showHeader="false">
      <draggable v-model="taskStages"
        :options="{group:'stages',filter:'.undraggables',handle:'.ui-sortable-handle',ghostClass:'stage-ghost',animation: 200,forceFallback:false}"
        id="board-scrum-stages" class="board-scrum-stages" :move="stageMove" @update="stageSort">
        <div class="scrum-stage" v-for="(stage,index) in taskStages" :key="index" :id="stage.id"
          :class="{ 'fixed-creator': stage.fixedCreator == true}">
          <!--<a-spin wrapperClassName="tasks-loading" :spinning="stage.tasksLoading">-->
          <!--<a-tooltip placement="top" >
                     <template slot="title">
                         {{ stage.name }}
                         <span class="task-count" v-if="stage.list.length > 0"> · {{ stage.list.length }}</span>
                     </template>-->
          <header class="scrum-stage-header ui-sortable-handle" v-show="!stage.tasksLoading">
            <div class="stage-name hinted">
              {{ stage.name }}
              <span class="task-count" v-if="stage.tasks.length > 0"> · {{ stage.tasks.length }}</span>
            </div>
            <div class="stage-menu-toggler popover">
              <a-dropdown :trigger="['click']" placement="bottomCenter">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>编辑任务列表</span>
                  </template>
                  <a href="javascript:void(0)" class="menu-toggler-title">
                    <a-icon type="ellipsis" style="font-size: 18px;" />
                  </a>
                </a-tooltip>
                <!--<div slot="overlay" class="task-popover-content">-->
                <!--<header class="popover-header" name="333">
                                    <span class="popover-title">列表菜单</span>
                                </header>-->
                <a-menu slot="overlay" @click="doStage" :selectable="false">
                  <a-menu-item :key="'editStage_' + stage.id + '_' + index">
                    <a-icon type="edit"></a-icon>
                    编辑列表
                  </a-menu-item>
                  <a-menu-item :key="'setExecutor_' + stage.id + '_' + index">
                    <a-icon size="14" type="user"></a-icon>
                    设置本列所有任务执行者
                  </a-menu-item>
                  <!--<a-menu-item :key="'setEndTime_' + stage.id + '_' + index">
                                        <a-icon size="14" type="clock-circle"></a-icon>
                                        设置本列所有任务截止时间 *
                                    </a-menu-item>-->
                  <a-menu-item :key="'recycleBatch_' + stage.id + '_' + index">
                    <a-icon size="14" type="delete"></a-icon>
                    本列所有任务移到回收站
                  </a-menu-item>
                  <a-menu-item :key="'delStage_' + stage.id + '_' + index">
                    <a-icon size="14" type="delete"></a-icon>
                    删除列表
                  </a-menu-item>
                </a-menu>
                <!--</div>-->
              </a-dropdown>
            </div>
          </header>
          <!--</a-tooltip>-->
          <div class="scrum-stage-wrap ui-sortable" :class="{ 'hidden-creator-bottom': stage.showTaskCard}">
            <vue-scroll :ref="index + '-stage'" @handle-resize="handleResize($event,index)" :ops="scrollOps">
              <section :id="stage.id" :task-type-index="index" class="scrum-stage-content thin-scroll">
                <a-spin wrapperClassName="tasks-loading" :spinning="stage.tasksLoading">
                  <!--未完成列表-->
                  <draggable v-model="stage.unDoneTasks"
                    :options="{group:'task',ghostClass:'task-ghost',dragClass:'task-drag',fallbackClass:'task-drag',forceFallback:false}"
                    @end="taskSort" class="scrum-stage-tasks">
                    <template v-for="(task,taskIndex) in stage.unDoneTasks">
                      <div class="task task-card ui-sortable-handle" :index="taskIndex" :id="task.id"
                        :key="task.id" :class="showTaskPri(task.pri)" v-if="!task.done && task.canRead"
                        @click.stop="taskDetail(task.id,index)">
                        <div class="task-priority bg-priority-0"></div>
                        <a-tooltip :placement="index > 0 ? 'top':'right'">
                          <template slot="title">
                            <span v-if="task.hasUnDone" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                          </template>
                          <div class="check-box-wrapper" @click.stop="taskDone(task.id,index,taskIndex,1)">
                            <a-icon class="check-box" :class="{'disabled': task.hasUnDone}" type="border"
                              :style="{fontSize:'16px'}" />
                          </div>
                          <!--<a class="check-box"
                                                       :class="{'disabled': task.hasUnDone}"
                                                       @click.stop="taskDone(task.id,index,taskIndex,1)"></a>-->
                        </a-tooltip>
                        <div class="task-content-set open-detail">
                          <div class="task-content-wrapper">
                            <div class="task-content"> {{ task.name }}</div>
                            <a-tooltip placement="top" v-if="task.executor && task.executor.avatar">
                              <template slot="title">
                                <span>{{task.executor.name}}</span>
                              </template>
                              <img :src="task.executor.avatar" :title="task.executor.name"
                                class="avatar img-circle img-24 hinted">
                            </a-tooltip>
                          </div>
                          <div class="task-info-wrapper clearfix">
                            <div class="task-infos">
                              <span class="icon-wrapper" :style="{color: getStatusColor(task.status), fontSize: '12px'}"
                                v-if="task.status">{{task.statusText}}</span>
                              <span class="label" :class="showTimeLabel(task.end_time)" v-if="task.end_time">
                                <span :title="task.end_time">
                                  {{ showTaskTime(task.begin_time,task.end_time)}}
                                </span>
                              </span>
                              <span class="icon-wrapper muted" v-if="task.description">
                                <a-icon type="file-text"></a-icon>
                              </span>
                              <span class="icon-wrapper muted" v-if="task.hasSource">
                                <a-icon type="link"></a-icon>
                              </span>
                              <span class="icon-wrapper muted" v-if="task.hasComment">
                                <a-icon type="message" />
                              </span>
                              <span class="icon-wrapper muted" v-if="task.childCount[0] > 0">
                                <a-icon type="bars"></a-icon>
                                <span>{{task.childCount[1]}}/{{task.childCount[0]}}</span>
                              </span>
                              <span class="tag muted" v-for="tag in task.tags" :key="tag.id">
                                <a-badge status="success" :class="`badge-${tag.tag.color}`" />
                                {{tag.tag.name}}
                              </span>
                              <span :class="'icon-wrapper text text-' + task.task_execute.color"
                                v-if="task.execute_state > 0">{{ task.task_execute_name }}</span>
                              <span class="icon-wrapper muted" v-if="task.like">
                                <a-icon type="like" />
                                <span>{{task.like}}</span>
                              </span>
                            </div>
                          </div>
                          <footer class="task-info-footer" v-if="project.prefix && project.open_prefix">
                            <span class="task-id-number">
                              {{project.prefix}}-{{task.id_num}}
                            </span>
                          </footer>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <!--创建任务卡片-->
                  <div class="task-creator-wrap card" :id="'card' + index" v-show="stage.showTaskCard">
                    <form class="task-creator">
                      <a-input :ref="`inputTaskName${index}`" v-model="task.name" class="task-content-input"
                        type="textarea" :rows="3" placeholder="任务内容" @keyup.enter="createTask(stage.id,index)" />
                      <div class="handler-wrap">
                        <a-dropdown :trigger="['click']">
                          <a class="executor-handler"><img :src="defaultExecutor.avatar"
                              class="avatar img-circle img-24 hinted"> <span
                              class="creator-handler-text name">{{ defaultExecutor.realname }}</span></a>
                          <a-menu class="executor-handler-menu" @click="selectExecutor" slot="overlay">
                            <a-menu-item v-for="(member,index) in projectMembers" :key="index">
                              <img class="avatar img-circle img-32 pull-left m-r-sm " :src="member.avatar">
                              <span class="muted" style="line-height: 25px;">{{ member.name }}</span>
                              <a-icon type="check" class="muted" v-if="member.username == defaultExecutor.username"></a-icon>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </div>
                      <div class="submit-set">
                        <a-button type="default" size="large" class="middle-btn"
                          @click.stop="showTaskCard(index,false)">取消
                        </a-button>
                        <a-button :loading="createTaskLoading" :disabled="!task.name" type="primary" size="large"
                          class="middle-btn" :class="{'disabled-btn':!task.name}"
                          @click.stop="createTask(stage.id,index)">创建
                        </a-button>
                      </div>
                    </form>
                  </div>
                  <!--已完成列表-->
                  <draggable v-model="stage.doneTasks"
                    :options="{group:'task-done',ghostClass:'task-ghost',dragClass:'task-drag',fallbackClass:'task-drag',forceFallback:false}"
                    @end="taskSort" class="scrum-stage-tasks-done">
                    <!--<ul v-if="stage.tasks.length" class="scrum-stage-tasks-done">-->
                    <template v-for="(task,taskIndex) in stage.doneTasks">
                      <div class="task done task-card ui-sortable-handle" :index="taskIndex" :id="task.id"
                        :key="task.id" v-if="task.canRead" @click.stop="taskDetail(task.id,index)">
                        <div class="task-priority bg-priority-0"></div>
                        <span class="check-box-wrapper" @click.stop="taskDone(task.id,index,taskIndex,0)">
                          <a-icon class="check-box" type="check-square" :style="{fontSize:'16px'}"
                            :class="{'disabled': task.hasUnDone}" />
                        </span>
                        <!--<a class="check-box"
                                                   @click.stop="taskDone(task.id,index,taskIndex,0)">
                                                    <a-icon type="check"/>
                                                </a>-->
                        <div class="task-content-set open-detail">
                          <div class="task-content-wrapper">
                            <div class="task-content">{{ task.name }}</div>
                            <a-tooltip placement="top" v-if="task.executor && task.executor.avatar">
                              <template slot="title">
                                <span>{{task.executor.name}}</span>
                              </template>
                              <img v-if="task.executor && task.executor.avatar" :src="task.executor.avatar"
                                :title="task.executor.name" class="avatar img-circle img-24 hinted">
                            </a-tooltip>
                          </div>
                          <div class="task-info-wrapper clearfix">
                            <div class="task-infos">
                              <span class="tag muted" :class="'tag-color-'+ tag.color"
                                v-for="(tag,tag_index) in task.task_tag_item_list" :key="tag.id"> {{ tag.name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <!--</ul>-->
                  </draggable>
                  <div class="scrum-stage-tasks-done" v-show="stage.canNotReadCount">
                    <li class="task muted" style="margin: 0 10px 8px;">
                      <span><a-icon type="lock"></a-icon>
                        有 {{stage.canNotReadCount}} 个任务被隐藏（因为设置了仅参与者可见）</span>
                    </li>
                  </div>
                  <!--添加任务按钮-->
                  <div class="task-creator-handler-wrap" @click.stop="showTaskCard(index)" v-if="!stage.showTaskCard">
                    <a class="task-creator-handler link-add-handler">
                      <a-icon type="plus-circle" style="padding-right: 6px;"></a-icon>
                      添加任务
                    </a>
                  </div>
                </a-spin>
              </section>
            </vue-scroll>
          </div>
          <!--</a-spin>-->
        </div>
        <div class="scrum-stage undraggable create-stage">
          <header class="scrum-stage-header">
            <div class="stage-name hinted" style="width: 100%">
              <a class="muted" v-show="!showCreateStage" @click="showInputStrageName">
                <a-icon type="plus" />
                <span class="m-l-xs">新建任务列表</span>
              </a>
              <div v-show="showCreateStage">
                <div>
                  <a-input ref="inputStageName" v-model="stageName" placeholder="新建任务列表..." @keyup.enter="creteStage"
                    auto-focus></a-input>
                </div>
                <div class="submit-set create-stage-footer">
                  <a type="text" class="cancel-text muted" @click="showCreateStage = !showCreateStage">
                    取消
                  </a>
                  <a-button type="primary" class="middle-btn" @click="creteStage">保存</a-button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </draggable>
      <router-view></router-view>
    </wrapper-content>
    <!--编辑任务列表-->
    <a-modal :width="360" v-model="stageModal.modalStatus" :title="stageModal.modalTitle"
      :bodyStyle="{paddingBottom:'1px'}" :footer="null">
      <a-form @submit.prevent="editStage" :form="stageModal.form">
        <a-form-item>
          <a-input ref="inputStageTitle" placeholder='列表标题' v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入列表标题' }]}
                                            ]" />
        </a-form-item>
        <a-form-item>
          <div class="action-btn pull-right">
            <a type="text" class="cancel-text muted" @click="stageModal.modalStatus = false">
              取消
            </a>
            <a-button type="primary" htmlType='submit' class="middle-btn">保存</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--项目成员-->
    <a-drawer wrapClassName="info-drawer" title="项目成员" width=350 placement="right"
      @close="inviteMemberDraw.visible = false" :visible="inviteMemberDraw.visible">
      <div class="search-content">
        <a-input v-model="inviteMemberDraw.keyword" size="large" placeholder="输入昵称或邮箱查找">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="member-list">
        <div class="member-list-item ant-list-item header-action">
          <div class="ant-list-item-meta" @click="showInviteMember = true">
            <div class="ant-list-item-meta-avatar">
              <a-avatar icon="plus"></a-avatar>
            </div>
            <div class="ant-list-item-meta-content">
              <h4 class="ant-list-item-meta-title"><span>邀请新成员</span></h4>
            </div>
          </div>
        </div>
        <a-list itemLayout="horizontal" :loading="inviteMemberDraw.searching" :dataSource="projectMembers"
          :locale="{emptyText: (inviteMemberDraw.keyword && inviteMemberDraw.keyword.length > 1) ? '没有搜索到相关成员' : ''}">
          <a-list-item class="member-list-item" slot="renderItem" slot-scope="item,index">
            <span slot="actions" v-if="!item.is_owner">
              <a class="muted" @click="removeMember(item,index)"><a-icon type="user-delete" /> 移除</a>
              <!-- <a-button size="small" type="dashed" icon="user-add"
                                  v-if="!item.is_owner"
                        >操作</a-button>-->
            </span>
            <a-list-item-meta :description="item.email">
              <span slot="title">{{item.name}}</span>
              <a-avatar slot="avatar" icon="user" :src="item.avatar" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </a-drawer>
    <!--项目设置菜单-->
    <a-drawer wrapClassName="info-drawer" title="项目设置" width=350 placement="right" @close="configDraw.visible = false"
      :visible="configDraw.visible">
      <div class="config-wrapper">
        <ul class="config-menus">
          <li class="menu-item">
            <a @click="projectModal.modalStatus = true">
              <a-icon type="setting" />
              项目设置
            </a>
          </li>
          <li class="menu-item">
            <a @click="taskTagModal.modalStatus = true">
              <a-icon type="tags" />
              标签
            </a>
          </li>
          <li class="menu-item">
            <a @click="recycleModal.modalStatus = true">
              <a-icon type="delete" />
              查看回收站
            </a>
          </li>
          <li class="menu-item">
            <a :href="downLoadUrl" target="_blank">
              <a-icon type="copy" />
              下载导入任务模板
            </a>
          </li>
          <li class="menu-item">
            <a-upload name="file" :showUploadList="false" :action="uploadAction" :beforeUpload="beforeUpload"
              :data="{projectId: id}" :headers="headers" @change="handleChange">
              <a class="text-default" :loading="uploadLoading" :disabled="uploadLoading">
                <a-icon type="upload" v-show="!uploadLoading" />
                上传文件导入任务
              </a>
            </a-upload>
          </li>
          <li class="menu-item">
            <a>
              <a-icon type="logout" />
              导出任务 *
            </a>
          </li>
          <li class="menu-item">
            <a>
              <a-icon type="copy" />
              复制项目 *
            </a>
          </li>
          <li class="menu-item">
            <a>
              <a-icon type="block" />
              保存为项目模板 *
            </a>
          </li>
        </ul>

      </div>
    </a-drawer>
    <!--项目设置-->
    <a-modal destroyOnClose class="project-config-modal" :width="800" v-model="projectModal.modalStatus"
      :title="projectModal.modalTitle" :footer="null">
      <project-config :id="id" @update="updateProject"></project-config>
    </a-modal>
    <!--回收站-->
    <a-modal class="recycle-bin-modal" :width="800" v-model="recycleModal.modalStatus" :title="recycleModal.modalTitle"
      :footer="null">
      <recycle-bin v-if="recycleModal.modalStatus" :id="id" @update="init"></recycle-bin>
    </a-modal>
    <!--任务标签-->
    <a-modal class="task-tag-modal" :width="800" v-model="taskTagModal.modalStatus" :title="taskTagModal.modalTitle"
      :footer="null">
      <task-tag v-if="taskTagModal.modalStatus" :id="id" @update="init"></task-tag>
    </a-modal>
    <!--设置任务执行者-->
    <a-modal class="invite-project-member" :width="360" v-model="projectMemberModal.modalStatus"
      :title="projectMemberModal.modalTitle" :footer="null">
      <div class="member-list">
        <a-list class="project-list" itemLayout="horizontal" :loading="loading" :dataSource="projectMembers">
          <a-list-item slot="renderItem" slot-scope="item">
            <span slot="actions">
              <a-button size="small" type="dashed" icon="user-add" @click="setExecutor(item)">设置</a-button>
            </span>
            <a-list-item-meta :description="item.email">
              <span slot="title">{{item.name}}</span>
              <a-avatar slot="avatar" icon="user" :src="item.avatar" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </a-modal>

    <a-drawer wrapClassName="info-drawer task-search" title="任务筛选" width=350 placement="right"
      @close="taskSearch.visible = false" :visible="taskSearch.visible">
      <task-search :project-id="id" @search="taskSearchAction"></task-search>
    </a-drawer>
    <invite-project-member v-model="showInviteMember" :project-id="id"
      v-if="showInviteMember"></invite-project-member>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import _ from 'lodash'
  import moment from 'moment'
  import {
    COMMON
  } from '../const/common'
  import draggable from 'vuedraggable'
  import projectSelect from '../components/projectSelect'
  import inviteProjectMember from '../components/inviteProjectMember'
  import projectConfig from '../components/projectConfig'
  import RecycleBin from '../components/recycleBin'
  import TaskTag from '../components/taskTag'
  import TaskSearch from '../components/taskSearch'
  import WrapperContent from '../components/WrapperContent'

  import {
    getStagesByProjectId as getTaskStages,
    sort,
    getTasks
  } from "@/api/teamwork/task";
  import {
    prejectset as getProject
  } from "@/api/teamwork/project";
  import {
    inviteMember,
    listByProjectId as getProjectMembers,
    removeMember
  } from "@/api/teamwork/member";
  import {
    taskSave as createTask,
    taskDone,
    sortTask,
    recycleBatch,
    batchAssignTask
  } from "@/api/teamwork/task";
  import {
    taskStagesSave as createState,
    taskStagesEdit as editStage,
    taskStagesDel as delStage
  } from "@/api/teamwork/task";
  import {
    checkResponse,
    getApiUrl,
    getAuthorization,
    getUploadUrl
  } from "@/assets/tw/js/utils";
  import {
    formatTaskTime
  } from "@/assets/tw/js/dateTime";
  import {
    collect
  } from "@/api/teamwork/project";
  import {
    notice
  } from "@/assets/tw/js/notice";
  
  import { USER_INFO } from "@/store/mutation-types";
  import Vue from 'vue';
  import '@/assets/tw/css/theme.less';

  export default {
    name: "project-space-task",
    components: {
      RecycleBin,
      TaskTag,
      draggable,
      projectSelect,
      TaskSearch,
      inviteProjectMember,
      projectConfig,
      WrapperContent
    },
    data() {
      return {
        id: this.$route.params.id,
        loading: true,
        project: {
          task_board_theme: 'simple'
        },
        stageName: '',
        task: {}, //当前任务
        taskStatusList: COMMON.TASK_STATUS,
        taskStages: [], //任务列表
        defaultExecutor: {}, //默认执行人
        projectMembers: [], //项目成员列表
        projectMembersCopy: [], //项目成员列表副本
        createTaskLoading: false, //创建任务loading
        showCreateStage: false,

        preId: '',
        nextId: '',

        taskSearchParams: {},

        stageKeys: [],
        stageModal: {
          form: this.$form.createForm(this),
          stageId: '',
          stageIndex: 0,
          modalStatus: false,
          confirmLoading: false,
          modalTitle: '编辑列表',
        },

        slideMenuKey: '',
        showInviteMember: false,
        inviteMemberDraw: {
          visible: false,
          keyword: '',
          searching: false,
          list: [],
        },
        configDraw: {
          visible: false,
        },
        taskSearch: {
          visible: false,
        },


        downLoadUrl: getUploadUrl('project/task/_downloadTemplate'),
        uploadLoading: false,
        uploadAction: getApiUrl('project/task/uploadFile'),

        /*项目设置*/
        projectModal: {
          modalStatus: false,
          modalTitle: '项目设置',
        },
        /*回收站*/
        recycleModal: {
          modalStatus: false,
          modalTitle: '查看回收站',
        },
        /*任务标签*/
        taskTagModal: {
          modalStatus: false,
          modalTitle: '任务标签',
        },

        /*项目成员*/
        projectMemberModal: {
          loading: false,
          currentStageIndex: 0,
          modalStatus: false,
          modalTitle: '设置任务执行者',
        },
        userInfo: {},
      }
    },
    computed: {
      ...mapState({
        //userInfo: state => state.userInfo,
        //viewRefresh: state => state.common.viewRefresh,
        //socketAction: state => state.socketAction,
      }),
      headers() {
        //return getAuthorization();
      },
      scrollOps() {
        return {
          rail: {
            background: '#e5e5e5',
            opacity: 1
          },
          bar: {
            keepShow: true
          }
        }
      }
    },
    watch: {
      $route(to, from) {
        console.log("$route to, from",to,from);
        if (this.id != to.params.id) {
          this.id = to.params.id;
          this.userInfo = Vue.ls.get(USER_INFO);
          this.defaultExecutor = this.userInfo;
          this.getProject();
          this.getProjectMembers();
          this.init();
        }
        if (from.name == 'taskdetail') {
          const stageIndex = from.query.from;
          this.getTaskStages(false);
          if (stageIndex != undefined) {
            let searchParams = this.taskSearchParams;
            let params = Object.assign({
              stageId: this.taskStages[stageIndex].id
            }, searchParams);
            getTasks(params).then((res) => {
              console.log("$route getTasks res",res);
              this.taskStages[stageIndex].tasksLoading = false;
              this.taskStages[stageIndex].tasks = res.result;
              let doneTasks = this.taskStages[stageIndex].doneTasks = [];
              let unDoneTasks = this.taskStages[stageIndex].unDoneTasks = [];
              res.result.forEach((task) => {
                if (task.done) {
                  doneTasks.push(task);
                } else {
                  unDoneTasks.push(task);
                }
              });
            });
          }
        }
      },
      socketAction(val) {
        if (val.action === 'organization:task') {
          const data = val.data.data;
          if (data.projectId == this.id) {
            this.getTaskStages(false);
          }
        }
      },
      viewRefresh() {
        console.log('viewRefresh');
        // this.getTaskStages(false);
      },
      inviteMemberDraw: {
        handler(newVal) {
          if (newVal.visible) {
            this.slideMenuKey = 'member';
          } else {
            this.slideMenuKey = false;
          }
          if (newVal.keyword) {
            this.searchInviteMember();
          }
        },
        deep: true
      },
      configDraw: {
        handler(newVal) {
          if (newVal.visible) {
            this.slideMenuKey = 'config';
          } else {
            this.slideMenuKey = false;
          }
        },
        deep: true
      },
      showInviteMember(val) {
        if (!val) {
          this.getProjectMembers();
        }
      },
    },
    created() {
      this.userInfo = Vue.ls.get(USER_INFO);
      this.defaultExecutor = this.userInfo;
      console.log("created this.defaultExecutor",this.defaultExecutor);
      this.getProject();
      this.getProjectMembers();
      this.init();
    },
    methods: {
      init() {
        this.getTaskStages();
      },
      getProject() {
        this.loading = true;
        getProject({
          id: this.id
        }).then((res) => {
          console.log("getProject res",res);
          this.loading = false;
          this.project = res.result;
          console.log("getProject project",this.project);
        });
      },
      getProjectMembers() {
        getProjectMembers({
          projectId: this.id
        }).then((res) => {
          console.log("getProjectMembers res",res);
          this.projectMembers = res.result;
          this.projectMembersCopy = res.result;
          console.log("getProjectMembers projectMembers",this.projectMembers);
        });
      },
      getTaskStages(showLoading = true) {
        let that = this;
        console.log("getTaskStages id=",that.id);
        getTaskStages({
          projectId: that.id, pageSize: 100
        }).then((res) => {
          console.log("getTaskStages res=",res);
          let taskStages = [];
          if (!showLoading) {
            res.result.list.forEach((v) => {
              v.tasksLoading = false;
              taskStages.push(v);
            });
            // that.taskStages = taskStages;
          } else {
            //提前赋值，展现loading
            this.taskStages = taskStages = res.result.list;
          }
          console.log("getTaskStages taskStages=",taskStages);
          if (taskStages) {
            let searchParams = that.taskSearchParams;
            let params = {};
            taskStages.forEach((v, k) => {
              params = {
                stageId: v.id
              };
              params = Object.assign(params, searchParams);
              console.log("getTaskStages params",params);
              getTasks(params).then((res) => {
                console.log("getTaskStages getTasks res",res);
                let canNotReadCount = 0;
                res.result.forEach((task) => {
                  if (!task.canRead) {
                    canNotReadCount++;
                  }
                  if (task.done) {
                    v.doneTasks.push(task);
                  } else {
                    v.unDoneTasks.push(task);
                  }
                });
                console.log("k,v ",k,v);
                console.log("doneTasks ",v.doneTasks);
                console.log("unDoneTasks ",v.unDoneTasks);
                v.canNotReadCount = canNotReadCount;
                v.tasksLoading = false;
                v.tasks = res.result;
                if (!showLoading) {
                  that.$set(that.taskStages, k, v);
                }
              })
            });
          }
        })
      },
      filterTask(tasks, done) {
        return tasks.filter(item => item.done == done);
      },
      taskSearchAction(value) {
        console.log(value);
        this.taskSearchParams = value;
        this.getTaskStages();
      },
      //显示添加任务卡片
      showTaskCard(index = false, show = true) {
        console.log("showTaskCard taskStages",this.taskStages);
        this.taskStages.forEach((v) => {
          v.showTaskCard = false;
        });
        if (index === false) {
          return false;
        }
        this.taskStages[index].showTaskCard = show;
        this.$nextTick(() => {
          //滚动创建到创建窗口
          this.$refs[index + '-stage'][0].scrollIntoView('#card' + index);
          this.$refs[`inputTaskName${index}`][0].focus();

        });
      },
      selectExecutor({
        key
      }) {
        this.defaultExecutor = this.projectMembers[key];
      },
      //准备添加任务
      createTask(stageId, stageIndex) {
        if (!this.task.name) {
          this.$message.warning('任务内容不能为空', 2);
          return false
        }
        this.task.stage_id = stageId;
        this.task.project_id = this.id;
        this.task.assign_to = this.defaultExecutor.username;
        this.confirmCreateTask(stageIndex);
      },
      //添加任务
      confirmCreateTask(stageIndex) {
        let that = this;
        if (that.createTaskLoading) {
          that.$message.warning('正在添加任务，请稍后...', 2);
          return false;
        }
        setTimeout(function() {
          if (that.createTaskLoading === true) {
            that.$message.loading({
              content: '正在添加任务，请稍后...',
              duration: 5
            })
          }
        }, 2000);
        that.createTaskLoading = true;
        console.log("confirmCreateTask task",that.task);
        createTask(that.task).then(res => {
          that.createTaskLoading = false;
          if (res.success) {
            that.$message.destroy();
            let taskStages = that.taskStages[stageIndex];
            taskStages.tasks.push(res.result);
            that.taskStages[stageIndex].unDoneTasks.push(res.result);
            that.task = {};
          }
        }).catch(() => {
          that.createTaskLoading = false;
        });
      },
      taskDone(taskId, stageIndex, taskIndex, done) {
        let task = null;
        let unDoneTasks = this.taskStages[stageIndex].unDoneTasks;
        let doneTasks = this.taskStages[stageIndex].doneTasks;
        if (done) {
          task = unDoneTasks[taskIndex];
        } else {
          task = doneTasks[taskIndex];
        }
        // let task = this.taskStages[stageIndex].tasks[taskIndex];
        if (task.hasUnDone) {
          return false;
        }
        task.done = done;
        if (done) {
          unDoneTasks.splice(taskIndex, 1);
          doneTasks.push(task);
          doneTasks = doneTasks.sort(function(a, b) {
            if (a.sort === b.sort) {
              return a.id_num - b.id_num;
            } else {
              return a.sort - b.sort;
            }
          });
        } else {
          doneTasks.splice(taskIndex, 1);
          unDoneTasks.push(task);
          unDoneTasks = unDoneTasks.sort(function(a, b) {
            if (a.sort === b.sort) {
              return a.id_num - b.id_num;
            } else {
              return a.sort - b.sort;
            }
          });
        }
        taskDone(taskId, done).then((res) => {
          if (!res.success) {
            return false;
          }
          //可能会触发工作流，所以全部刷新
          this.getTaskStages(false);
        });
      },
      showInputStrageName() {
        this.showCreateStage = !this.showCreateStage;
        this.$nextTick(() => {
          this.$refs.inputStageName.focus();
        });
      },
      doStage(action) {
        let that = this;
        let actionKeys = action.key.split('_');
        const stageId = actionKeys[actionKeys.length - 2];
        const stageIndex = actionKeys[actionKeys.length - 1];
        const actionKey = actionKeys[0];
        switch (actionKey) {
          case 'editStage':
            this.stageModal.stageId = stageId;
            this.stageModal.stageIndex = stageIndex;
            this.$nextTick(() => {
              this.stageModal.form.setFieldsValue({
                name: this.taskStages[stageIndex].name,
              });
              this.$refs.inputStageTitle.focus();
            });
            this.stageModal.modalStatus = true;
            break;
          case 'recycleBatch':
            //您确定要把列表下的所有任务移到回收站吗？
            this.$confirm({
              title: '移到回收站',
              content: `您确定要把列表下的所有任务移到回收站吗？`,
              okText: '移到回收站',
              okType: 'danger',
              cancelText: `再想想`,
              onOk() {
                that.taskStages[stageIndex].tasks = [];
                that.$set(that.taskStages[stageIndex], 'doneTasks', []);
                recycleBatch({
                  stageId: stageId
                }).then(res => {
                  if (!res.success) {
                    return false;
                  }
                  that.$set(that.taskStages[stageIndex], 'doneTasks', []);
                  that.$set(that.taskStages[stageIndex], 'unDoneTasks', []);
                });
                return Promise.resolve();
              }
            });
            break;
          case 'setEndTime':
            this.set_type_endTime_modal = true;
            break;
          case 'setExecutor':
            this.projectMemberModal.currentStageIndex = stageIndex;
            this.projectMemberModal.modalStatus = true;
            break;
          case 'delStage':
            if (this.taskStages[stageIndex].tasks.length > 0) {
              this.$warning({
                title: '删除列表',
                content: `请先清空此列表上的任务，然后再删除这个列表`,
                okText: '确定',
              });
              return false;
            }
            this.$confirm({
              title: '删除列表',
              content: `您确定要永远删除这个列表吗？`,
              okText: '删除',
              okType: 'danger',
              cancelText: `再想想`,
              onOk() {
                delStage(stageId);
                that.taskStages.splice(stageIndex, 1);
                return Promise.resolve();
              }
            });
            break;
        }
      },
      creteStage() {
        if (!this.stageName) {
          this.$message.warning('请输入列表名称', 2);
          return false;
        }
        createState({
          name: this.stageName,
          projectId: this.id
        }).then(res => {
          if (!res.success) {
            return false;
          }
          const stage = res.result;
          this.taskStages.push(stage);
          this.stageName = '';
          this.$nextTick(() => {
            document.getElementById("board-scrum-stages").scrollLeft = 10000;
          });
        });
      },
      editStage() {
        let stage = this.stageModal.form.getFieldsValue();
        if (!stage.name) {
          this.$message.warning('请输入列表名称', 2);
          return false;
        }
        editStage({
          name: stage.name,
          stageId: this.stageModal.stageId
        }).then((res) => {
          if (!res.success) {
            return false;
          }
          this.taskStages[this.stageModal.stageIndex].name = stage.name;
          this.stageModal.modalStatus = false;
        });
      },
      setExecutor(member) {
        let stage = this.taskStages[this.projectMemberModal.currentStageIndex];
        let taskIds = [];
        stage.tasks.forEach((v) => {
          if (v.canRead) {
            taskIds.push(v.id);
          }
        });
        if (taskIds) {
          batchAssignTask({
            taskIds: JSON.stringify(taskIds),
            executorId: member.id
          }).then(res => {
            this.projectMemberModal.modalStatus = false;
            if (!res.success) {
              return false;
            }
            getTasks({
              stageId: stage.id
            }).then((res) => {
              let canNotReadCount = 0;
              res.result.forEach((task) => {
                if (!task.canRead) {
                  canNotReadCount++;
                }
              });
              stage.canNotReadCount = canNotReadCount;
              stage.tasksLoading = false;
              stage.tasks = res.result;
            });
          });
        } else {
          this.projectMemberModal.modalStatus = false;
        }
      },
      showTaskPri(pri) {
        return {
          'warning': pri == 1,
          'error': pri == 2,
        }
      },
      showTimeLabel(time) {
        let str = 'label-primary';
        if (time == null) {
          return str;
        }
        let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
        if (cha < 0) {
          str = 'label-danger';
        } else if (cha == 0) {
          str = 'label-warning';
        } else if (cha > 7) {
          str = 'label-normal'
        }
        return str;
      },
      showTaskTime(time, timeEnd) {
        return formatTaskTime(time, timeEnd);
        // return moment(time).format('MM月DD日 HH:mm')
      },
      taskDetail(id, stageIndex) {
        this.$router.push(`${this.$route.path}/detail/${id}?from=${stageIndex}`);
      },
      stageMove(evt) {
        this.preId = evt.draggedContext.element.id;
        this.nextId = evt.relatedContext.element.id;

      },
      stageSort() {
        sort(this.preId, this.nextId, this.id);
      },
      taskSort(event) {
        console.log(event);
        const toStageId = event.to.parentNode.parentNode.parentNode.getAttribute('id');
        let ids = '';
        for (let i = 0, len = event.to.children.length; i < len; i++) {
          ids += ',' + event.to.children[i].getAttribute('id');
        }
        sortTask({
          stageId: toStageId,
          ids: ids.substr(1)
        }).then(res => {
          this.getTaskStages(false);
        });
      },
      handleResize(vertical, stageIndex) {
        if (vertical.barSize) {
          this.taskStages[stageIndex].fixedCreator = true;
        }
      },

      visibleDraw(type) {
        if (type == 'member') {
          this.configDraw.visible = false;
          this.taskSearch.visible = false;
          this.inviteMemberDraw.visible = !this.inviteMemberDraw.visible;

        } else if (type == 'taskSearch') {
          this.taskSearch.visible = !this.taskSearch.visible;
          this.configDraw.visible = false;
          this.inviteMemberDraw.visible = false;
        } else {
          this.inviteMemberDraw.visible = false;
          this.taskSearch.visible = false;
          this.configDraw.visible = !this.configDraw.visible;
        }
      },
      removeMember(member, index) {
        let that = this;
        this.$confirm({
          title: `您确定要将「${member.name}」从项目中移除吗？`,
          content: `移除后该成员将不能查看任何关于该项目的信息`,
          okText: '移除',
          okType: 'danger',
          cancelText: '再想想',
          onOk() {
            removeMember(member.id, that.id).then((res) => {
              if (!res.success) {
                return;
              }
              that.projectMembers.splice(index, 1);
              notice({
                title: '移除成功'
              }, 'notice', 'success');
            });
            return Promise.resolve();
          }
        });
      },
      inviteMember(item) {
        inviteMember(item.memberId, this.projectId).then((res) => {
          if (res.success) {
            item.joined = true;
          }
        })
      },
      searchInviteMember: _.debounce(
        function() {
          if (!this.inviteMemberDraw.keyword) {
            this.projectMembers = JSON.parse(JSON.stringify(this.projectMembersCopy));
          }
          /*if (this.inviteMemberDraw.keyword.length <= 1) {
              return false;
          }*/
          this.searching = true;
          this.projectMembers = this.projectMembers.filter(item => item.name.indexOf(this.inviteMemberDraw.keyword) !=
            -1);
        }, 500
      ),
      updateProject(data) {
        this.project = data;
      },
      collectProject() {
        const type = this.project.collected ? 'cancel' : 'collect';
        collect(this.project.id, type).then((res) => {
          if (!res.success) {
            return;
          }
          this.project.collected = !this.project.collected;
        })
      },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          notice(`正在导入，请稍后...`, 'message', 'loading', 0);
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          console.log(info);
          this.uploadLoading = false;
          if (checkResponse(info.file.response, true)) {
            const count = info.file.response.data;
            if (count) {
              notice(`成功导入${count}个任务`, 'message', 'success');
            } else {
              notice(`没有成功导入任何任务`, 'message', 'warning');
            }
            this.getTaskStages(false);
          }
        }
      },
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('文件不能超过2MB!')
        }
        return isLt2M
      },
      getStatusColor(status) {
        const statusInfo = this.taskStatusList.find(item => item.id == status);
        if (statusInfo) {
          return statusInfo.color;
        }
        return '';
      }
    }
  }
</script>

<style lang="less">
  @import "../../../../assets/tw/css/components/task";

  .project-space-task {
    .tasks-loading {
      .ant-spin-blur {
        opacity: 0;
      }
    }
  }

  .info-drawer {
    top: 116px;
    width: 0 !important;

    .ant-drawer-mask {
      visibility: hidden;
    }

    .ant-drawer-content {
      /*background-color: #f7f7f7;*/
    }

    .ant-drawer-header {
      /*background-color: #f7f7f7;*/
      text-align: center;
    }

    .ant-drawer-body {
      padding: 12px 0;
    }

    .search-content {
      padding: 0 24px;
    }
  }

  .info-drawer {
    .member-list {
      padding-top: 12px;

      .ant-list-item-meta {
        align-items: center;
      }

      .member-list-item {
        padding: 12px 24px;

        &:hover {
          background-color: #eee;
          cursor: pointer;
        }
      }
    }
  }

  .info-drawer {
    .config-wrapper {
      position: relative;
      padding-bottom: 1px;

      .config-menus {
        padding: 0;
        list-style: none;

        .menu-item {
          position: relative;
          line-height: 30px;

          &:hover {
            background: #eeeeee;
          }

          &:first-child>a {
            margin-top: -6px;
          }

          a {
            display: block;
            cursor: pointer;
            padding: 5px 15px;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #383838;
            font-weight: 600;

            .anticon {
              width: 24px;
              text-align: center;
              font-size: 15px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
</style>