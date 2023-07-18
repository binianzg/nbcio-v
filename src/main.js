/** init domain config */
import './config'

import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
import { VueAxios } from "@/utils/request"


import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";

require('@jeecg/antd-online-mini')
require('@jeecg/antd-online-mini/dist/OnlineForm.css')

import Antd, { version } from 'ant-design-vue'
console.log('ant-design-vue version:', version)

import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import Print from 'vue-print-nb-jeecg'
/*import '@babel/polyfill'*/
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import SSO from '@/cas/sso.js'
import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'

import JDictSelectTag from './components/dict/index.js'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus';
import JeecgComponents from '@/components/jeecg/index'
import '@/assets/less/JAreaLinkage.less'
import VueAreaLinkage from 'vue-area-linkage'
import '@/components/jeecg/JVxeTable/install'
import '@/components/JVxeCells/install'
// ElementUI 放置最前，Antd放置于后
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//For IM add by nbacheng 2022-08-17
import { dateStr, formatDateTime } from "@/utils/im/ChatUtils.js";
if (process.env.VUE_APP_MODE === "web") {
  Vue.prototype.winControl = require("@/mode/webControl").default;
} 
//For erp add by nbacheng 2022-08-25
import utils from '@/utils/utils'
//for formdesigner  add by nbchang 2022-09-03
import formDesigner from '@/components/formdesigner/components/index'
import '@/components/formdesigner/assets/iconfont/iconfont.js'
//for highlightjs add by nbchang 2022-09-20
//import highlightPlugin from "@highlightjs/vue-plugin";
//import 'highlight.js/styles/dark.css'; // 引入内置样式
// 引入bpmn-process-designer插件 add by nbacheng 2022-09-29
import "@/plugins/package/theme/element-variables.scss";
import "@/plugins/package/theme/index.scss";

import { vuePlugin } from "@/plugins/package/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);

// 引入bpmn插件
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

// 大屏引入 add by nbacheng2023-03-22
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import echarts from 'echarts';
// 全局定义echarts
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

Vue.component('bs-chart', ECharts)  //不能用v-chart,否则有问题

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
Vue.use(Avue);
// 大屏引入 add by nbacheng2023-03-22

// 网盘引入全局函数
import globalFunction from '@/libs/globalFunction/index.js'
// 网盘引入文件操作相关插件
import fileOperationPlugins from '@/plugins/netdisk/fileOperationPlugins.js'
/**
 * vue-simple-uploader 中文官方文档 https://github.com/simple-uploader/vue-uploader/blob/master/README_zh-CN.md
 * simple-uploader.js 中文官方文档 https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md
 */
import uploader from 'vue-simple-uploader'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
Vue.use(uploader)
// 网盘引入
// add by nbacheng 2023-07-03 for teamwork
import VueClipboards from 'vue-clipboards';
Vue.use(VueClipboards);
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);
Vue.prototype.$vuescrollConfig = {
    vuescroll: {
        mode: 'native'
    },
    scrollPanel: {
        scrollingX: true,
    },
    bar: {
        delayTime: 500,
        onlyShowBarOnScroll: false,
        background: "#cecece",
        keepShow: false
    }
};
// add by nbacheng 2023-07-03

//For IM add by nbacheng 2022-08-17
Vue.use(ElementUI, { zhLocale });
Vue.use(ViewUI);
//for formdesigner  add by nbchang 2022-09-03
Vue.use(formDesigner);
//Vue.use(highlightPlugin);//for highlightjs add by nbchang 2022-09-20

//表单验证
import { rules } from '@/utils/rules'
Vue.prototype.rules = rules
Vue.config.productionTip = false
//IM
Vue.prototype.formatDateTime = formatDateTime;
Vue.prototype.dateStr = dateStr;
//For erp add by nbacheng 2022-08-25
Vue.prototype.$utils = utils
//For netdisk add by nbacheng 2023-04-07
for (let key in globalFunction) {
	Vue.prototype[`$${key}`] = globalFunction[key]
}
for (let key in fileOperationPlugins) {
	Vue.prototype[`$${key}`] = fileOperationPlugins[key]
}

Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(hasPermission)
Vue.use(JDictSelectTag)
Vue.use(Print)
Vue.use(preview)
Vue.use(vueBus);
Vue.use(JeecgComponents);
Vue.use(VueAreaLinkage);

SSO.init(() => {
  main()
})
function main() {
  new Vue({
    router,
    store,
    mounted () {
      store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
      store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
      store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
      store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
      store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
      store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
      store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
      store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
      store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
      store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
      store.commit('SET_MULTI_PAGE',Vue.ls.get(DEFAULT_MULTI_PAGE,config.multipage))
    },
    render: h => h(App)
  }).$mount('#app')
}