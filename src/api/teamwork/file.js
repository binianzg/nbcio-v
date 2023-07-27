import request from '@/utils/request'

// 任务文件编辑
export function edit(data) {
  return request({
    url: '/tw/twFile/edit',
    method: 'post',
    params: data
  })
}

// 任务文件列表
export function fileList(data) {
  return request({
    url: '/tw/twFile/fileList',
    method: 'post',
    params: data
  })
}

// 删除任务文件
export function del(data) {
  return request({
    url: '/tw/twFile/delete',
    method: 'post',
    params: data
  })
}

// 恢复任务文件
export function recovery(data) {
  return request({
    url: '/tw/twFile/recovery',
    method: 'post',
    params: data
  })
}

// 任务文件移入回收站
export function recycle(data) {
  return request({
    url: '/tw/twFile/recycle',
    method: 'post',
    params: data
  })
}

export function uploadFiles() {
    return window._CONFIG['domianURL'] + '/tw/twFile/uploadFiles';
}
