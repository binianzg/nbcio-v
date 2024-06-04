import {filterObj} from '@/utils/util';
import {deleteAction, downFile, getAction} from '@/api/manage'
import Vue from 'vue'
import {ACCESS_TOKEN} from "@/store/mutation-types"
import JEllipsis from '@/components/jeecg/JEllipsis'
import { listCustomForm } from "@/api/form";

export const flowableMixin = {
  components: {
    JEllipsis
  },
  data(){
    return {
      //token header
      //tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      customformList: [],
      formQueryParams:{
        pageNum: 1,
        pageSize: 1000,
      },
    }
  },
  created() {
    this.ListCustomForForm();
  },
  computed:{
    /*所有的流程表单，组件化注册，无需维护，从后端获取*/
    allFormComponent:function(){
      return this.customformList;
    }
  },
  methods:{
    /* 挂载自定义业务表单列表 */
    async ListCustomForForm() {
      listCustomForm(this.formQueryParams).then(res => {
        let that = this;
        let  cfList = res.result.records;
        cfList.forEach((item, index) => {
          let cms = {
              text:item.flowName,
              routeName:item.routeName,
              component:() => import(`@/views/${item.routeName}.vue`),
              businessTable:'test_demo'
          }
          that.customformList.push(cms);
        })
      })
    },
    getFormComponent(routeName){
      return _.find(this.allFormComponent,{routeName:routeName})||{};
    },
   
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      // this.loadData();
    },
    millsToTime(mills) {
      if (!mills) {
        return "";
      }
      let s = mills / 1000;
      if (s < 60) {
        return s.toFixed(0) + " 秒"
      }
      let m = s / 60;
      if (m < 60) {
        return m.toFixed(0) + " 分钟"
      }
      let h = m / 60;
      if (h < 24) {
        return h.toFixed(0) + " 小时"
      }
      let d = h / 24;
      if (d < 30) {
        return d.toFixed(0) + " 天"
      }
      let month = d / 30
      if (month < 12) {
        return month.toFixed(0) + " 个月"
      }
      let year = month / 12
      return year.toFixed(0) + " 年"
    
    },
  }

}