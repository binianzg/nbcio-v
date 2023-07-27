<template>
  <div class="project-space-gantt">
    <div class="project-navigation">
      <div class="project-nav-header">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a>
              <a-icon type="home" />
              首页
            </a>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <section class="nav-body">
        <ul class="nav-wrapper nav nav-underscore pull-left">
          <li><a class="app" data-app="tasks" @click="$router.push('/estar/teamwork/space/task/' + id)">任务</a></li>
          <li class="app"><a class="app" data-app="works" @click="$router.push('/estar/teamwork/space/files/' + id)">
              文件</a>
          <li><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/overview/' + id)">
              概览</a>
          </li>
          <li class=""><a class="app" data-app="build" @click="$router.push('/estar/teamwork/space/features/' + id)">
              版本</a>
          </li>
          <li class="actives"><a class="app" data-app="build"
              @click="$router.push('/estar/teamwork/space/gantt/' + id)">
              甘特图</a>
          </li>
        </ul>
      </section>
    </div>
    <wrapper-content :showHeader="false">
      <div class="content-wrapper">
        <div class="ganntClass" :style="{ height: ganttHeight }" v-loading="ganttLoading">
          <div ref="gantt" class="gantt-container" />
        </div>
      </div>
    </wrapper-content>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import {
    getTasksGanttByProjectId
  } from "@/api/teamwork/task";
  import WrapperContent from '../components/WrapperContent'
  import '@/assets/tw/css/theme.less';
  import gantt from 'dhtmlx-gantt';
  import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

  export default {
    name: "project-space-gantt",
    components: {
      WrapperContent
    },
    data() {
      return {
        id: this.$route.params.id,
        loading: true,
        showLoading: false,
        loadingMore: false,
        //gantt高度
        ganttHeight: innerHeight - 50 + 'px',
        ganttLoading: false,
        projectId: '',
        tasksGantt: {
        },

      }
    },
    created() {
      //清空gantt数据
      gantt.clearAll();
      this.projectId = this.$route.params.id;
      this.getTasksGantt();
    },
    mounted() {
      var that = this;
      //本地化
      gantt.i18n.setLocale("cn");

      //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
      gantt.config.autosize = false;
      //只读模式：打开后不可以操作甘特图
      gantt.config.readonly = false;
      //是否显示左侧树表格
      gantt.config.show_grid = true;
      //表格列设置：我们在后台获取数据后，会解析到这个表格列中，这里面会含有很多隐藏列，作用是甘特图中不需要看隐藏列，但当我们获取甘特图的任务时，这些隐藏列会跟随任务方便使用
      gantt.config.columns = [{
          //最左侧新增符号列，甘特图内置可选使用列
          name: 'add',
          label: '',
          width: '40'
        },
        {
          name: 'text',
          label: '任务名称',
          tree: true,
          width: '150'
        },
        {
          name: 'assign_to',
          label: '执行人',
          width: '100'
        },
        {
          name: 'start_date',
          label: '开始时间',
          align: 'center',
          width: '90'
        },
        {
          name: 'end_date',
          label: '结束时间',
          align: 'center',
          width: '90'
        }
      ];

      //自适应
      //gantt.config.fit_tasks = true;

      //开启提示：鼠标悬浮在gantt行上显示
      gantt.plugins({
        tooltip: true
      });

      gantt.attachEvent('onGanttReady', function() {
        var tooltips = gantt.ext.tooltips;
        gantt.templates.tooltip_text = function(start, end, task) {
          return '编号：' + task.id + '<br/>名称：' + task.text + '<br/>执行人：' +
            task.assign_to + '<br/>开始时间：' + gantt.templates.tooltip_date_format(start) + '<br/>结束时间：' + gantt
            .templates.tooltip_date_format(end);
        };
      });

      //禁用双击事件
      gantt.config.details_on_dblclick = false;
      //关闭所有错误提示信息：gantt有自己的异常消息，如果不关闭可能页面会弹出异常消息
      gantt.config.show_errors = false;

      //灯箱事件
      gantt.attachEvent('onBeforeLightbox', function(task_id) {
        //刷新灯箱数据
        //gantt.resetLightbox();
        //true：打开灯箱
        //return true;

        //这里调用了自己的页面，没有打开默认灯箱
        that.addTask(task_id);
      });

      //禁止拖动设置任务长度
      gantt.attachEvent('onBeforeTaskDrag', function(id, mode, e) {
        return false;
      });
      //禁止拖动任务
      gantt.config.drag_move = false;
      //禁止拖动任务进度
      gantt.config.drag_progress = false;
      //禁止拖放添加Link
      gantt.config.drag_links = false;

      //开启标记
      gantt.plugins({
        marker: true
      });

      //标记当前日期
      var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
      var markerId = gantt.addMarker({
        start_date: new Date(),
        css: 'today', //标记样式，style中对应
        text: '今天',
        title: dateToStr(new Date())
      });
      gantt.getMarker(markerId);

      //设置 scale_unit 属性为 month，以显示月刻度
      gantt.config.scale_unit = "month";
      //设置 step 属性为 1，以每个月显示一个刻度
      gantt.config.step = 1;
      //设置 date_scale 属性为 %Y-%m-%d，以显示年月日格式的刻度
      gantt.config.date_scale = "%Y-%m-%d";
      //设置 scale_date 属性为 gantt.date.monthStart，以从每个月的第一天开始显示刻度。
      gantt.config.scale_date = gantt.date.monthStart;
      //表头高度
      gantt.config.scale_height = 60;
      
      gantt.config.scales = [
      	{unit: "month", format: "%F, %Y"},
      	{unit: "day", step: 1, format: "%j, %D"}
      ];
  
      //设置 subscale 属性为一个包含两个刻度的对象，分别为 day 和 week。
      gantt.config.subscales = [ // 配置时间
        {
          unit: "day",
          step: 1,
          date: "%j %D"
        },
      ];
      // 初始化
      gantt.init(this.$refs.gantt);
      //gantt.clearAll(); // 防止数据缓存问题
      //gantt.parse(tasks);
    },
    methods: {
      //获取甘特图数据
      
      getTasksGantt() {
        let that = this;
        getTasksGanttByProjectId({
          projectId: that.id
        }).then((res) => {
          console.log("getTasksGanttByProjectId res=", res);
          this.tasksGantt = res.result;
          // 数据解析:将数据解析到gantt列数据中
          gantt.parse(this.tasksGantt);
          // 刷新数据
          gantt.refreshData();
          //展开甘特图
          gantt.batchUpdate(function () {
                  gantt.eachTask(function (task) {
                      gantt.open(task.id)
                  })
          });
          this.ganttLoading = false;
        });
      },
      //自定义新增任务
      addTask(taskId) {
        var that = this;
        this.$nextTick(() => {
          that.$refs.taskAdd.init(task, action, parentTask, $this.milestoneOriginalData);
        });
        //删除任务：每次调用gantt内置新增事件时，gantt会直接新增任务到甘特图中，而我们需要的是自定义新增任务
        gantt.deleteTask(taskId);
        //灯箱事件必须返回布尔值，这里使用了自定义灯箱返回false，即不打开灯箱
        return false;
      }
    },
  }
</script>

<style lang="less">
  .project-space-gantt {

    .project-navigation {
      top: 0px;
      z-index: 4;
    }

    .layout-content {
      padding: 0px;
      width: 100%;
      margin: 0px 0px 0px;
      background: initial;

      .content-item {
        background: #fff;
        padding: 0px 0px 0px 0px;
        border-radius: 4px;
      }
    }

    .wrapper-main {
      padding: 24px 0 12px 0px;
      background: initial;
    }
  }

  .gantt-container {
    height: 100%;
    width: 100%;
  }

  .ganntClass {
    background-color: #fff;
    padding: 10px;
    border-radius: 4px;
  }

  //今日标记样式
  .today {}
</style>