<template>
  <div class="main">
    <FullCalendar :options="calendarOptions"></FullCalendar>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  components: {
    FullCalendar
  },

  data() {
    return {
      calendarOptions: {
        plugins: [
          // dayGridPlugin,   //日期刻度
          timeGridPlugin, //时间刻度
          interactionPlugin // 编写事件
        ],
        
        headerToolbar: {
          left: "prev,next today", //翻页按钮
          center: "title",        //当前周时间
          right: ""  //不显示右侧
        },
        slotLabelFormat: {  //时间格式
          hour: "2-digit",   //补零 2位数
          minute: "2-digit",
          // meridiem: false,
          hour12: false // 设置时间为24小时
        },
        events: [   //数据
          
          {
            title: "11111",
            start: "2020-11-04 09:00:00",
            end: "2020-11-04 11:00:00",
            instanceId: 70
          },
          {
            title: "22222",
            start: "2020-11-02 02:00:00",
            end: "2020-11-02 12:30:00",
            instanceId: 71
          },
          {
            title: "33333",
            start: "2020-11-03 05:00:00",
            end: "2020-11-03 07:30:00",
            instanceId: 72
          }
        ],
        dragRevertDuration: 500, //如果拖拽不成功，多久回复原状，毫秒
        initialView: "timeGridWeek", //类型
        minTime: "00:00",
        maxTime: "24:00",
        initialEvents: [],
        height: "auto", //高度
        locale: "zh-cn", //语言
        allDaySlot: false, //是否显示全天事件
        editable: true, //事件是否可编辑，移动, 拉伸,改变大小等。
        selectable: true, //单击或拖动选择日历中的对象，包括天和时间
        selectMirror: true,
        unselectAuto: true, //点击页面日历以外的位置时，是否自动取消当前的选中状态
        dayMaxEvents: true,
        weekends: true, //是否显示周末
        weekNumbers: true, //	是否在日历中显示周次(全年第几周)，
        slotEventOverlap: true, // 相同时间段的多个日程视觉上是否允许重叠
        displayEventEnd: true, //所有视图显示结束时间
        /**
         事件 
        **/
        absouluteTop:this.absouluteTopFn,  // 自定义吸顶
        eventAdd: this.eventAddFn,
        select: this.selectFn, //新建事件
        eventClick: this.eventClickFn, //已有事件删除
        eventsSet: this.eventsSetFn,
        eventRender: this.eventRenderFn, //修改事件内容显示格式
        eventStartEditable: true, //是否让事件在开始时就可以拖动。
        eventChange: this.eventChangeFn //修改拖拽之后的events
        // eventRemove:
      },
      params: {
        title: "",
        startStr: "",
        endStr: "",
        instanceId: ""
      }
    };
  },
  mounted() {
    this.eventRenderFn();
  },
  methods: {
    eventChangeFn(e) {
      // console.log(e.event);
      // console.log(e.oldEvent);
      console.log(this.calendarOptions.events);
    },
    eventRenderFn(calEvent, element, view) {},
    clearParams() {
      this.params = {
        title: "",
        startStr: "",
        endStr: "",
        instanceId: ""
      };
    },
    eventAddFn(obj) {
      console.log(obj.event);
      this.params.title = obj.event._def.title;
      this.params.instanceId = obj.event._instance.instanceId;
      this.calendarOptions.events.push(this.params);
      this.clearParams();
    },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },

    selectFn(selectInfo) {
      let title = prompt("请输入心间信息");
      let calendarApi = selectInfo.view.calendar;
      this.params.startStr = selectInfo.startStr;
      this.params.endStr = selectInfo.endStr;
      calendarApi.unselect(); // clear date selection
      console.log();

      if (title) {
        calendarApi.addEvent({
          // id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr
          // allDay: selectInfo.allDay
        });
      }
    },

    eventClickFn(clickInfo) {
      if (confirm(`是否删除 '${clickInfo.event.title}'`)) {
        clickInfo.event.remove();
      }
    },

    eventsSetFn(events) {
      this.currentEvents = events;
    }
  }
};
</script>

<style  scoped>
.main {
  margin-top: 100px;
}
</style>