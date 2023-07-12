import request from '@/utils/request'

// 列表
export function listIndex(data) {
  return request({
    url: '/tw/twProjectVersion/listIndex',
    method: 'post',
    data: data
  })
}

// 编辑
export function edit(data) {
  return request({
    url: '/tw/twProjectVersion/edit',
    method: 'post',
    data: data
  })
}

// 保存
export function save(data) {
  return request({
    url: '/tw/twProjectVersion/save',
    method: 'post',
    data: data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/tw/twProjectVersion/delete',
    method: 'post',
    data: data
  })
}

// 修改版本状态
export function changeStatus(data) {
  return request({
    url: '/tw/twProjectVersion/changeStatus',
    method: 'post',
    data: data
  })
}

// 获取版本任务
export function getVersionTask(data) {
  return request({
    url: '/tw/twProjectVersion/getVersionTask',
    method: 'post',
    data: data
  })
}

// 获取版本日志
export function getVersionLog(data) {
  return request({
    url: '/tw/twProjectVersion/getVersionLog',
    method: 'post',
    data: data
  })
}

// 获取版本信息
export function getVersionInfo(data) {
  return request({
    url: '/tw/twProjectVersion/getVersionInfo',
    method: 'post',
    data: data
  })
}

// 移除版本任务
export function removeVersionTask(data) {
  return request({
    url: '/tw/twProjectVersion/removeVersionTask',
    method: 'post',
    data: data
  })
}

// 关联版本任务
export function addVersionTask(data) {
  return request({
    url: '/tw/twProjectVersion/addVersionTask',
    method: 'post',
    data: data
  })
}