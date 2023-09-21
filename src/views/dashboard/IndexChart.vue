<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="项目信息">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div >
            <a target="_blank" href="https://gitee.com/nbacheng/nbcio-boot"><span class="profile-name">后端代码</span></a><br/>
            <a target="_blank" href="https://gitee.com/nbacheng/nbcio-vue.git"><span class="profile-name">前端代码</span></a><br/>
            <a target="_blank" href="http://122.227.135.243:9888"><span class="profile-name">在线演示</span></a>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<a target="_blank" href="http://122.227.135.243:9888/h5/"><span class="profile-name">H5在线演示</span></a><br/>
            <a target="_blank" href="https://nbacheng.blog.csdn.net/"><span class="profile-name">博客地址</span></a>
          </div>
          <template slot="footer">
             <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=NH67tV_dqCGQaFhzxsl2B_fdXxWvkBs6&jump_from=webapi&authKey=nf2iLush7UnIOgdVfEl+qqPZdLiUnH1LG+3nEHlwtAAWAJX4UuH1IEOj3APFZDmR"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="NBCIO 亿事达企业管理平" title="NBCIO 亿事达企业管理平"></a>
          </template>
        </chart-card> 
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="任务总数" :total="tasksum">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">任务总数<span></span></template> 
        </chart-card> 
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="流程总数" :total="flowsum">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">流程总数<span> {{  }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总访问量" :total="loginfo.totalVisitCount">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">总访问量 <span></span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="任务数" key="1">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="任务数排行" :dataSource="taskmonth.dataSource"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="流程数" key="2">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="流程数排行" :dataSource="flowmonth.dataSource"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一周访问量统计" :style="{ marginTop: '24px' }">
          <a-row>
            <a-col :span="6">
              <head-info title="今日IP" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日访问" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="总访问量" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"  />
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'

  import Trend from '@/components/Trend'
  import { getLoginfo,getVisitInfo } from '@/api/api'

  const rankList = []
  for (let i = 0; i < 7; i++) {
    rankList.push({
      name: '白鹭岛 ' + (i+1) + ' 号店',
      total: 1234.56 - i * 100
    })
  }
  const barData = []
  for (let i = 0; i < 12; i += 1) {
    barData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200
    })
  }
  export default {
    name: "IndexChart",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      HeadInfo
    },
    data() {
      return {
        tasktotal: {
          url: '/online/cgreport/api/getColumnsAndData/1661243615517978626',
          loading: false,
          dataSource: [],
        },
        flowtotal: {
          url: '/online/cgreport/api/getColumnsAndData/1661247259512520705',
          loading: false,
          dataSource: [],
        },
        taskmonth: {
          url: '/online/cgreport/api/getColumnsAndData/1661271436906840066',
          loading: false,
          dataSource: [],
        },
        flowmonth: {
          url: '/online/cgreport/api/getColumnsAndData/1661271700409794562',
          loading: false,
          dataSource: [],
        },
        loading: true,
        center: null,
        rankList,
        barData,
        loginfo:{},
        visitFields:['ip','visit'],
        visitInfo:[],
        indicator: <a-icon type="loading" style="font-size: 24px" spin />
      }
    },
    computed: {  //为了消除页面报错
      tasksum() {
        if(this.tasktotal.dataSource.length>0){
          return String(this.tasktotal.dataSource[0].total);
        }
      },
      flowsum() {
        if(this.flowtotal.dataSource.length>0){
          return String(this.flowtotal.dataSource[0].total);
        }
      },
    },  
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 100)
      console.log("created tasktotal=",this.tasktotal);  
      this.loadData(this.tasktotal);
      this.loadData(this.flowtotal);
      this.loadData(this.taskmonth);
      this.loadData(this.flowmonth);
      this.initLogInfo();
    },
    methods: {
      loadData(data) {
        data.loading = true;
        this.$http.get(data.url)
          .then(res => data.dataSource =  res.result.data.records)
          .finally(() => data.loading = false);
        //console.log("loadData data=",data);  
      },
      initLogInfo () {
        getLoginfo(null).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            this.loginfo = res.result;
          }
        })
        getVisitInfo().then(res=>{
          if(res.success){
             this.visitInfo = res.result;
           }
         })
      },
    }
  }
</script>

<style lang="less" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>