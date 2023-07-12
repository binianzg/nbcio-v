<template>
  <div style="background:#FFF;">
    <a-row :gutter="24">
      <!--<a-col :span="2">
        <a-button @click="handleCalAdd" style="margin-bottom: 20px" type="primary">新建日历</a-button>
      </a-col>-->
      <a-col :span="4">
        <a-button @click="handleSchAdd" style="margin-bottom: 20px" type="primary">新建日程</a-button>
      </a-col>
      <a-col :span="20">
        <j-checkbox
          v-model="jCheckbox"
          :options="jCheckboxOptions"
          @change="onSelCalChange"
        />
      </a-col>
    </a-row>
    <FullCalendar
      class="fullCalendar"
      @eventDrop="handleDrop"
      ref="fullCalendar"
      :options="calendarOptions"
    />
    <oa-calendar-modal ref="modalCalForm" @ok="modalCalFormOk" @deleteCalendar="deleteCalendar"></oa-calendar-modal>
    <oa-schedule-modal ref="modalForm" :startTime="inStart" :endTime="inEnd" @ok="modalFormOk" @deleteSchedule="deleteSchedule"></oa-schedule-modal>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import scrollgridPlugin from "@fullcalendar/scrollgrid";
var moment = require("moment");
import calendar from "solarday2lunarday";
import OaCalendarModal from './modules/OaCalendarModal'
import OaScheduleModal from './modules/OaScheduleModal';
import { GetList, ScheduleInfo, GetCalList } from '@/api/oa/schedule';
import estar from '../util/estar';
import { deleteAction, getAction } from '@/api/manage'


export default {
  components: {
    FullCalendar, // 像使用自定义组件一样使用
    OaScheduleModal,
    OaCalendarModal,
  },
  data() {
    return {
      isDay: false,
      isWeek: false,
      isMonth: true,
      custom: null,
      day: null,
      week: null,
      month: null,
      bfindSchedule: false,
      calendarApi: null,
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          interactionPlugin,
          listPlugin,
          momentPlugin,
          timeGridPlugin,
          resourceTimelinePlugin,
          scrollgridPlugin,
        ], // 需要用哪个插件引入后放到这个数组里
        // initialDate: new Date(), // 日历第一次加载时显示的初始日期。可以解析为Date的任何职包括ISO8601日期字符串，例如"2014-02-01"。
        initialView: "dayGridMonth", // 日历加载时的初始视图，默认值为'dayGridMonth'，可以为任何可用视图的值，如例如'dayGridWeek'，'timeGridDay'，'listWeek'
        locale: "zh-cn", // 设置日历的语言，中文为 “zh-cn”
        firstDay: "1", // 设置每周的第一天，默认值取决于当前语言环境，该值为代表星期几的数字，且值必须为整数，星期日=0
        // weekNumberCalculation: 'ISO', // 指定"ISO"结果为ISO8601周数。指定"ISO"将firstDay的默认值更改为1（Monday）
        buttonText: {
          // 文本将显示在headerToolbar / footerToolbar的按钮上。不支持HTML注入。所有特殊字符将被转义。
          today: "今天",
          month: "月",
          week: "周",
          day: "日",
          list: '周列表',
        },

        editable: true,
        eventDrop: this.DropEvent,
        dayMaxEvents: true, // 在dayGrid视图中如果每个单元格事件超出单元格会出现'+more'
        moreLinkContent: "查看更多",
        // 点击+more触发该回调
        moreLinkClick: this.eventLimitClickFun,
        // unselectAuto: true,
        selectable: true, // 允许用户点击或拖拽选中
        // dayHeaderContent: this.columnHeaderHtmlFun,
        headerToolbar: {
          // 在日历顶部定义按钮和标题。将headerToolbar选项设置为false不会显示任何标题工具栏。可以为对象提供属性start/center/end或left/center/right。这些属性包含带有逗号/空格分隔值的字符串。用逗号分隔的值将相邻显示。用空格分隔的值之间会显示一个很小的间隙。
          // right: "today prev next title",
          start: "today prev next",
          end: "dayGridMonth,timeGridWeek,timeGridDay listWeek,custom",
          center: "title",
        },
        views: {
          dayGridMonth: {
            dayCellContent(item) {
              //console.log("data", item);
              let _date = moment(item.date).format("YYYY-MM-DD");
              let startDate = "";
              _date = _date.split("-");
              startDate = _date[2];
              let _dateF = calendar.solar2lunar(_date[0], _date[1], _date[2]);

              let _dateS = "";

              //console.log("_dateF", _dateF);
              if (startDate[0] == "0") {
                startDate = startDate[1];
              } else {
                startDate = startDate;
              }
              if (_dateF.Term !== "") {
                _dateS = _dateF.Term;
              } else {
                _dateS = _dateF.IDayCn;
              }
              return {
                html: `<p style="letter-spacing: 1px;margin-top: 7.5px;"><label>${startDate}</label><span style="margin-left:2px">${_dateS}</span></p>`,
              };
            },
          },
        },
        displayEventTime:true, //显示事件开始时间
        displayEventEnd:true, //显示事件结束时间
        eventTimeFormat: {
          // 在每个事件上显示的时间的格式
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        },
        validRange: this.validRange,
        events: [],
        //eventColor: "#f08f00", // 修改日程背景色
      

        // events: [ // 将在日历上显示的事件对象， events 可以是数组、json、函数。具体可以查看官方文档
        //     title: '标题',
        //     start: '事件开始事件',
        //     end: '事件结束事件', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
        //     backgroundColor: '#FDEBC9', // 该事件的背景颜色
        //     borderColor: '#FDEBC9', // 该事件的边框颜色
        //     textColor: '#F9AE26' // 该事件的文字颜色
        // ],
        customButtons: {
          // 定义可在headerToolbar / footerToolbar中使用的自定义按钮
          today: {
            text: "今天", // 按钮的展示文本
            click: this.todayClick, // 点击按钮触发的事件，这里要注意的是当按钮绑定了事件之后该按钮原本自带的事件将会失效
          },
          next: {
            click: this.nextClick,
          },
          prev: {
            click: this.prevClick,
          },
          custom: {
            text: "找日程",
            click: this.findSchedule,
          },
          timeGridDay: {
            text: "日",
            click: this.dayView,
          },
          timeGridWeek: {
            text: "周",
            click: this.weekView,
          },
          dayGridMonth: {
            text: "月",
            click: this.monthView,
          },
        },
        //datesSet: this.datesSet,
        eventClick: this.handleEventClick, // 点击事件时，触发该回调
        // eventDrop:this.handleDrop,
        eventMouseEnter: this.handleMouseEnter, // 鼠标悬停在事件上时，触发该回调
        eventMouseLeave: this.handleMouseLeave, // 鼠标移除时，触发该回调
        //dateClick: this.handleDateClick, // 当用户单击日期或时间时,触发该回调，触发此回调，您必须加载interaction插件
        // 双击日历日程事件 
        select: this.handleDateSelect,
        
      },
      validRange: {
          start: '2022-01-01',
          end: moment().add(6, 'months').format('YYYY-MM-DD')
      },
      startTime: '',//日历当前的开始结束时间
      endTime: '',
      inStart:'',//传入到表单的开始结束时间
      inEnd:'',
      url: {
        list: "/oa/oaSchedule/list",
        delete: "/oa/oaSchedule/delete",
        deleteBatch: "/oa/oaSchedule/deleteBatch",
      },
      calurl: {
        list: "/oa/oaCalendar/list",
        delete: "/oa/oaCalendar/delete",
        deleteBatch: "/oa/oaCalendar/deleteBatch",
      },
      selectTimeStamp: [],
      jCheckbox: '',
      jCheckboxlist: [],
      jCheckboxOptions: [],
    };
  },
  mounted() {
    // 这里有两点要注意，想要调用插件的方法，要在组件上设置ref
    // 并且在组件未加载的时候this.$refs中是没有fullCalendar的，所以未加载的时候调用方法会报错
    this.calendarApi = this.$refs.fullCalendar.getApi();
    this.custom = document.getElementsByClassName("fc-custom-button")[0];
    this.day = document.getElementsByClassName("fc-timeGridDay-button")[0];
    this.week = document.getElementsByClassName("fc-timeGridWeek-button")[0];
    this.month = document.getElementsByClassName("fc-dayGridMonth-button")[0];
    this.initCalData();
  },
  methods: {
    DropEvent(info) {
      console.log("拖动", info.event.title);
    },
    initData() {
      this.startTime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      this.endTime = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      this.searchData();
    },
    initCalData() {
      GetCalList().then(res => {
        if (res.success) {
          console.log("GetCalList result=",res.result)
          this.jCheckboxOptions = res.result.map(o => (
          {label: o.name, value: o.id}))
          this.jCheckboxOptions.forEach((item, index) => {
            this.jCheckboxlist.push(item.value)
          })
          this.jCheckbox = JSON.stringify(this.jCheckboxlist)
          this.jCheckbox = this.jCheckbox.replace(/\"/g,"")
          this.jCheckbox = this.jCheckbox.replace("[","")
          this.jCheckbox = this.jCheckbox.replace("]","")
          console.log("jCheckboxOptions",this.jCheckboxOptions)
          console.log("jCheckboxlist ",this.jCheckboxlist)
          console.log("jCheckbox ",this.jCheckbox)
          this.initData();
        }  
        
      })
    },
    onSelCalChange(checkedValues) {
      console.log("onSelCalChange ",checkedValues)
      console.log("onSelCalChange jCheckbox",this.jCheckbox)
      this.initData();
    },
    datesSet(calendar) {
      let view = calendar.view
      console.log("datesSet view",view)
      this.startTime = estar.toDate(view.activeStart, "yyyy-MM-dd HH:mm")
      this.endTime = estar.toDate(view.activeEnd, "yyyy-MM-dd HH:mm")
      this.searchData()
    },
    searchData() {
      let query = {
        startTime: this.startTime,
        endTime: this.endTime,
        ids: this.jCheckbox
      }
      console.log("searchData query",query)
      GetList(query).then(res => {
        if (res.success) {
            this.calendarOptions.events = [];
            this.calendarOptions.events = res.result.map(o => ({
            id: o.id,
            title: o.title,
            start: o.startTime,
            end: o.endTime,
            color: o.color,
            editable: false,
            allDay: o.allday == 1? true:false,
            backgroundColor: o.color
          }))
        }  
        
      })
    },
    // 选中日历格快速新增
     handleDateSelect (selectInfo) {
      console.log("handleDateSelect selectInfo=",selectInfo)
      console.log("handleDateSelect timeStamp=",selectInfo.jsEvent.timeStamp)
      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      // 当点击两次同日历格时判断（要第一次点击选中之后在点击才会生效）
     if ((moment(selectInfo.endStr).valueOf() - moment(selectInfo.startStr).valueOf() === 86400000 &&
        moment(selectInfo.startStr).valueOf() >= moment(moment().format('YYYY-MM-DD')).valueOf() &&
        selectInfo.view.type === 'dayGridMonth') ||
        ((selectInfo.view.type === 'timeGridWeek' || selectInfo.view.type === 'timeGridDay') &&
          moment(selectInfo.startStr).valueOf() >= moment(moment().format('YYYY-MM-DD')).valueOf() &&
          (selectInfo.allDay ? (moment(selectInfo.endStr).valueOf() - moment(selectInfo.startStr).valueOf() === 86400000)
            : (moment(selectInfo.end).valueOf() - moment(selectInfo.start).valueOf() > 1800000))
        )) {
        let temporaryTime = {}
        temporaryTime = {
          timeStamp: selectInfo.jsEvent.timeStamp,
          timeString: moment(selectInfo.start).format('YYYY-MM-DD')
        }
        // 第一次点击时获取选中
        if (this.selectTimeStamp.length === 0) {
          console.log("第一次点击selectTimeStamp.length=",this.selectTimeStamp.length)
          this.selectTimeStamp.push({
            timeStamp: selectInfo.jsEvent.timeStamp,
            timeString: moment(selectInfo.start).format('YYYY-MM-DD')
          })
        } else {
          // 第二次点击时判断是否和第一次一样，不一样就删除第一次的，添加第二次的
          this.selectTimeStamp.forEach(item => {
            if (item.timeString === temporaryTime.timeString) {
              console.log("第二次点击添加内容",item.timeString)
              console.log("第二次点击添加内容",temporaryTime.timeString)
              this.handleDateDblClick(selectInfo)
            } else {
              this.selectTimeStamp.splice(this.selectTimeStamp.findIndex(event => event.timeString === item.timeString), 1)
              this.selectTimeStamp.push({
                timeStamp: selectInfo.jsEvent.timeStamp,
                timeString: moment(selectInfo.start).format('YYYY-MM-DD')
              })
            }
          })
        }
      }
      // 判断过去时间不能新增
      if ((moment(selectInfo.endStr).valueOf() - moment(selectInfo.startStr).valueOf() > 86400000 &&
        moment(selectInfo.startStr).valueOf() < moment(moment().format('YYYY-MM-DD')).valueOf() &&
        selectInfo.view.type === 'dayGridMonth') ||
        ((selectInfo.view.type === 'timeGridWeek' || selectInfo.view.type === 'timeGridDay') &&
          moment(selectInfo.startStr).valueOf() < moment(moment().format('YYYY-MM-DD')).valueOf() &&
          (selectInfo.allDay ? (moment(selectInfo.endStr).valueOf() - moment(selectInfo.startStr).valueOf() > 86400000)
            : (moment(selectInfo.end).valueOf() - moment(selectInfo.start).valueOf() > 1800000))
        )) {
        this.$confirm({
          title: '提示',
          content: '过去时间不能进行新增!',
          okText: '确定',
          cancelText: '取消',
          onOk () {
          }
        })
      }
      // 判断获取的时间大于当前、以及两天以上
      if ((moment(selectInfo.endStr).valueOf() - moment(selectInfo.startStr).valueOf() > 86400000 &&
        moment(selectInfo.startStr).valueOf() >= moment(moment().format('YYYY-MM-DD')).valueOf() &&
        selectInfo.view.type === 'dayGridMonth') ||
        ((selectInfo.view.type === 'timeGridWeek' || selectInfo.view.type === 'timeGridDay') &&
          moment(selectInfo.startStr).valueOf() >= moment(moment().format('YYYY-MM-DD')).valueOf() &&
          (selectInfo.allDay ? (moment(selectInfo.endStr).valueOf() - moment(selectInfo.startStr).valueOf() > 86400000)
            : (moment(selectInfo.end).valueOf() - moment(selectInfo.start).valueOf() > 1800000))
        )) {
        //内容
      }
    },
    handleCalAdd: function () {
      this.$refs.modalCalForm.add();
      this.$refs.modalCalForm.title = "新增";
      this.$refs.modalCalForm.disableSubmit = false;
    },
    handleSchAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
    /***************
     * 双击新建日程
     */
    handleDateDblClick(selectInfo) {
      console.log("handleDateDblClick selectInfo=",selectInfo)
      let startTime = estar.toDate(selectInfo.startStr, "yyyy-MM-dd HH:00:00"),
        clickTime = estar.toDate(selectInfo.startStr, "yyyyMMdd"),
        currTime = estar.toDate(new Date(), "yyyyMMdd");
      if (clickTime < currTime) return
      if (clickTime == currTime) {
        let thisDate = new Date();
        thisDate.setHours(thisDate.getHours() + 1);
        startTime = estar.toDate(thisDate, "yyyy-MM-dd HH:00:00");
      }
      this.inStart = startTime;
      this.inEnd = startTime;
      this.handleSchAdd(); 
    },
    
    /***************
     * 新建日程
     */
    handleDateClick(dateClickInfo) {
      console.log("handleDateClick dateClickInfo=",dateClickInfo);
      let startTime = estar.toDate(dateClickInfo.date, "yyyy-MM-dd HH:00:00"),
        clickTime = estar.toDate(dateClickInfo.date, "yyyyMMdd"),
        currTime = estar.toDate(new Date(), "yyyyMMdd");
      if (clickTime < currTime) return
      if (clickTime == currTime) {
        let thisDate = new Date();
        thisDate.setHours(thisDate.getHours() + 1);
        startTime = estar.toDate(thisDate, "yyyy-MM-dd HH:00:00");
      }
      this.inStart = startTime;
      this.inEnd = startTime;
      this.handleSchAdd(); 
    },
    //添加日历完成后更新日历列表
    modalCalFormOk() {
      this.initCalData();
    },
    //删除日历
    deleteCalendar(id) {
      let that = this;
      that.$confirm({
        title: '提示',
        content: '是否真的要删除日历!',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          that.handleCalDelete(id);
        }
      })
    },
    handleCalDelete: function (id) {
      if(!this.calurl.delete){
        this.$message.error("请设置calurl.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.calurl.delete, {id: id}).then((res) => {
        if (res.success) {
          that.initCalData();
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    //添加日程完成后更新日历的日程界面
    modalFormOk() {
      this.initData();
    },
    handleDelete: function (id) {
      if(!this.url.delete){
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {id: id}).then((res) => {
        if (res.success) {
          that.initData();
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    //删除日程
    deleteSchedule(id) {
      let that = this;
      that.$confirm({
        title: '提示',
        content: '是否真的要删除日程!',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          that.handleDelete(id);
        }
      })
    },
    eventLimitClickFun(data) {},
    handleDrop(data) {
      console.log("handleDrop", data);
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleDetail:function(record){
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.handleDetail();
      this.$refs.modalForm.title="详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    handleEventClick(data) {
      console.log("handleEventClick", data.event.title, data);
      ScheduleInfo({id: data.event.id}).then(res => {
        console.log("ScheduleInfo=",res);
        if (res.success) {
          let startTime = estar.toDate(data.event.start, "yyyy-MM-dd HH:00:00"),
            clickTime = estar.toDate(data.event.start, "yyyyMMdd"),
            currTime = estar.toDate(new Date(), "yyyyMMdd");
            console.log("ScheduleInfo clickTime,currTime",clickTime,currTime);
          if (clickTime < currTime) {
            this.handleDetail(res.result);
            console.log("handleDetail");
          }
          else {
            this.handleEdit(res.result);
            console.log("handleEdit");
          }
        }
      })
    },
    handleMouseEnter(mouseEnterInfo) {
      // console.log(mouseEnterInfo.event.startStr,"33334467")
      // 提示：mouseEnterInfo.event.startStr 可以获取当前事件的开始事件
    },
    handleMouseLeave(mouseEnterInfo) {
      // console.log(mouseEnterInfo,"555777")
    },
    todayClick(mouseEvent, htmlElement) {
      this.calendarApi.today(); // 将日历移动到当前日期。
      this.calendarApi.getDate(); // 返回日期的日历的当前日期
    },
    nextClick(mouseEvent, htmlElement) {
      // calendarApi.next() // 将日历向前移动一步（例如，一个月或一周）。
      this.calendarApi.next();
      // 如果dayGridMonth查看日历，则将日历向前移动一个月。
      // 如果日历位于dayGridWeek或中timeGridWeek，则将日历向前移动一周。
      // 如果日历位于dayGridDay或中timeGridDay，则将日历向前移动一天。
    },
    prevClick(mouseEvent, htmlElement) {
      this.calendarApi.prev(); // 将日历后退一步（例如，一个月或一周）。
      // 如果dayGridMonth查看日历，则将日历后移一个月。
      // 如果日历位于dayGridWeek或中timeGridWeek，则将日历后移一周。
      // 如果日历位于dayGridDay或中timeGridDay，则将日历移回一天。
    },
    dayView(mouseEvent, htmlElement) {
      this.isDay = true;
      this.isWeek = false;
      this.isMonth = false;
      this.bfindSchedule = false;
      this.custom.className = "fc-button fc-button-primary";
      this.day.className =
        "fc-timeGridDay-button fc-button-active fc-button fc-button-primary";
      this.month.className =
        "fc-dayGridMonth-button fc-button fc-button-primary";
      this.week.className =
        "fc-timeGridWeek-button fc-button fc-button-primary";
      // this.$refs.fullCalendar.changeView('timeGridDay')
      //console.log("$refs", this.$refs.fullCalendar);
      this.calendarApi.changeView("timeGridDay");
    },
    weekView(mouseEvent, htmlElement) {
      this.isDay = true;
      this.isWeek = true;
      this.isMonth = false;
      this.bfindSchedule = false;
      this.custom.className = "fc-button fc-button-primary";
      this.day.className = "fc-timeGridDay-button  fc-button fc-button-primary";
      this.month.className =
        "fc-dayGridMonth-button  fc-button fc-button-primary";
      this.week.className =
        "fc-timeGridWeek-button fc-button-active fc-button fc-button-primary";
      this.calendarApi.changeView("timeGridWeek");
    },
    monthView(mouseEvent, htmlElement) {
      this.isDay = true;
      this.isWeek = false;
      this.isMonth = true;
      this.bfindSchedule = false;
      this.custom.className = "fc-button fc-button-primary";
      this.day.className = "fc-timeGridDay-button  fc-button fc-button-primary";
      this.month.className =
        "fc-dayGridMonth-button fc-button-active fc-button fc-button-primary";
      this.week.className =
        "fc-timeGridWeek-button fc-button fc-button-primary";
      this.calendarApi.changeView("dayGridMonth");
    },
    findSchedule(mouseEvent, htmlElement) {
      this.bfindSchedule = true;
      this.custom.className = "fc-button-active fc-button fc-button-primary";
      this.day.className = "fc-timeGridDay-button fc-button fc-button-primary";
      this.month.className =
        "fc-dayGridMonth-button fc-button fc-button-primary";
      this.week.className =
        "fc-timeGridWeek-button fc-button fc-button-primary";
      // this..className=""
    },
    columnHeaderHtmlFun(title) {
      console.log("columnHeaderHtmlFun", title);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .fc-theme-standard{
    .fc-scrollgrid{
      border:none;
    }
    td{
      border:none;
    }
    th{
      border:none;
    }
  }
  .fullCalendar {
    .fc-toolbar {
      height: 65px;
      .fc-toolbar-chunk {
        height: 65px;
        display: flex;
        align-items: center;
        .fc-today-button {
          width: 64px;
          height: 32px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.25);
          letter-spacing: 5px;
          font-weight: 400;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          border-radius: 3px;
          margin-left: 16px;
        }
        .fc-prev-button {
          color: #7d8292;
          background: #fff;
          border-color: #fff;
          box-shadow: none;
          padding: 0;
          margin-left: 12px;
          // border: none;
          // width: 16px;
          // height: 16px;
          // background: white;
          // color: #7d8292;
        }
        .fc-next-button {
          color: #7d8292;
          background: #fff;
          border-color: #fff;
          box-shadow: none;
          padding: 0;
          // border: none;
          // width: 16px;
          // height: 16px;
          // background: white;
          // color: #7d8292;

          // margin-left:12px;
        }
        .fc-toolbar-title {
          transform: translateX(12px);
          font-family: MicrosoftYaHei-Bold;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.85);
          letter-spacing: 0;
          font-weight: 700;
          line-height: 65px;
        }
        .fc-button-group {
          // background:#f1f2f3;
          // border-radius: 3px;
          width: 326px;
          height: 32px;
          .fc-timeGridDay-button {
            // width:65px;
            // height:28px;
            // border:none;
          }
          .fc-button-primary {
            background: #f1f2f3;
            border-color: #f1f2f3;
            color: #797b7c;
          }
          .fc-button-active {
            background: #ffffff;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.09);
            border-radius: 4px;
          }
          .fc-button {
            padding: 0;
          }
        }
      }
    }
    .fc-scrollgrid td{
      border: 1px solid rgba(0,0,0,0.15);
    }

    // .fc-scrollgrid {
    //   border-top: none;
    //   thead {
    //     tr {
    //       th {
    //         border-left-color: #ffff !important;
    //       }
    //     }
    //   }
    // }
    .fc-daygrid-day-top {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .fc-col-header-cell-cushion {
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #000000;
      letter-spacing: 1px;
      font-weight: 400;
      padding: 12px 4px;
    }

    .fc-col-header {
      border-top-color: #ffff;
      thead {
        border-color: #ffff !important;
        tr {
          th {
            // border:1px solid #fff !important;
            border-top-color: #fff !important;
            border-left-color: #ffff !important;
            border-right-color: #fff !important;
          }
        }
      }
    }

    // table{
    //   .row{
    //     border-top-color:white !important;
    //     border-left-color:white !important;
    //     border-right-color:white !important;
    //   }
    // }

    .fc-event-title::before {
      content: "";
      width: 8px;
      height: 8px;
      background: red;
      border-radius: 50%;
    }
    .fc-license-message{
      display:none;
    }
  }
}
</style>

<style scoped lang="css">
/* /deep/ .fc-theme-standard td, .fc-theme-standard th{
  border:none !important;
} */
/deep/ .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
  margin-left: 0;
}
</style>
