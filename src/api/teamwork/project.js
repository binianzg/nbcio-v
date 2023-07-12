import request from '@/utils/request'

// 项目设置
export function prejectset(id) {
  return request({
    url: '/tw/twProject/projectset',
    method: 'post',
    params: id
  })
}

// 项目编辑
export function prejectedit(data) {
  return request({
    url: '/tw/twProject/edit',
    method: 'put',
    data: data
  })
}

// 退出项目
export function quit(id) {
  return request({
    url: '/tw/twProject/quit',
    method: 'post',
    params: id
  })
}

// 项目归档
export function archive(id) {
  return request({
    url: '/tw/twProject/archive',
    method: 'post',
    params: id
  })
}

// 取消归档
export function recoveryArchive(id) {
  return request({
    url: '/tw/twProject/recoveryArchive',
    method: 'post',
    params: id
  })
}

// 项目放到回收站
export function recycle(id) {
  return request({
    url: '/tw/twProject/recycle',
    method: 'post',
    params: id
  })
}

// 恢复项目
export function recovery(id) {
  return request({
    url: '/tw/twProject/recovery',
    method: 'post',
    params: id
  })
}

// 收藏项目
export function collect(id) {
  return request({
    url: '/tw/twProject/collect',
    method: 'post',
    params: id
  })
}

//项目详细页面初始化
export function selfList(data) {
  return request({
    url: '/tw/twProject/selfList',
    method: 'post',
    data
  })
}


// 项目日志
export function getLogBySelfProject(data) {
  return request({
    url: '/tw/twProject/getLogBySelfProject',
    method: 'post',
    data: data
  })
}

// 项目状态
export function projectStats(data) {
  return request({
    url: '/tw/twProject/projectStats',
    method: 'post',
    data: data
  })
}

// 项目报告
export function getProjectReport(data) {
  return request({
    url: '/tw/twProject/getProjectReport',
    method: 'post',
    data: data
  })
}

// 项目信息列表
export function infoList(data) {
  return request({
    url: '/tw/twProject/infoList',
    method: 'post',
    data: data
  })
}

export function doData(data) {
    let url = 'tw/twProject/save';
    if (data.projectId) {
        url = 'tw/twProject/edit';
    }
    return $http.post(url, data);
}

export function infoDoData(data) {
    let url = 'tw/twProjectInfo/save';
    if (data.infoCode) {
        url = 'tw/twProjectInfo/edit';
    }
    return $http.post(url, data);
}

// 删除项目信息
export function infoDelete(data) {
  return request({
    url: '/tw/twProject/infoDelete',
    method: 'post',
    data: data
  })
}