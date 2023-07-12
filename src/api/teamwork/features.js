import request from '@/utils/request'

// 列表
export function listIndex(data) {
  return request({
    url: '/tw/twProjectFeatures/listIndex',
    method: 'post',
    data: data
  })
}

// 编辑
export function edit(data) {
  return request({
    url: '/tw/twProjectFeatures/edit',
    method: 'post',
    data: data
  })
}

// 保存
export function save(data) {
  return request({
    url: '/tw/twProjectFeatures/save',
    method: 'post',
    data: data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/tw/twProjectFeatures/delete',
    method: 'post',
    data: data
  })
}