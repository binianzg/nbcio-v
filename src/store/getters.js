import Vue from 'vue'
import { USER_INFO, ENHANCE_PRE } from "@/store/mutation-types"
import { allColumnList } from '@/libs/map.js'

const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => {state.user.avatar = Vue.ls.get(USER_INFO).avatar; return state.user.avatar},
  username: state => state.user.info.username,
  nickname: state => {state.user.info.realname = Vue.ls.get(USER_INFO).realname; return state.user.info.realname},
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  userInfo: state => {state.user.info = Vue.ls.get(USER_INFO); return state.user.info},
  addRouters: state => state.permission.addRouters,
  onlAuthFields: state => {return state.online.authFields },
  enhanceJs:(state) => (code) => {
    state.enhance.enhanceJs[code] = Vue.ls.get(ENHANCE_PRE+code);
    return state.enhance.enhanceJs[code]
  },
  sysSafeMode: state => state.user.sysSafeMode,
  // 网盘表格显示列 add by nbacheng for netdisk 2023-04-10
  selectedColumnList: (state) =>
  	state.netdisk.selectedColumnList === null
  		? allColumnList
  		: state.netdisk.selectedColumnList.split(','),
  // 文件查看模式
  fileModel: (state) =>
  	state.netdisk.fileModel === null ? 0 : Number(state.netdisk.fileModel),
  // 网格模式 & 时间线模式下 文件图标大小
  gridSize: (state) => state.netdisk.gridSize,
  // 剩余存储空间
  remainderStorageValue: (state) =>
  	state.netdisk.totalStorageValue - state.netdisk.storageValue,
}

export default getters
