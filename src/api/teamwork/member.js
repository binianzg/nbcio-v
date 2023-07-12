import request from '@/utils/request'

// 项目添加成员列表
export function listForAdd (data) {
  return request({
    url: '/tw/twProjectMember/listForAdd',
    method: 'post',
    params: data
  })
}

// 根据项目Id获取成员列表
export function listByProjectId(projectId) {
  return request({
    url: '/tw/twProjectMember/listByProjectId',
    method: 'post',
    params: projectId
  })
}

// 项目添加成员
export function addMember (data) {
  return request({
    url: '/tw/twProjectMember/addMember',
    method: 'post',
    params: data
  })
}

// 邀请项目成员
export function inviteMember (data) {
  return request({
    url: '/tw/twProjectMember/inviteMember',
    method: 'post',
    params: data
  })
}

// 邀请新成员 模糊查询
export function searchInviteMember (data) {
  return request({
    url: '/tw/twProjectMember/searchInviteMember',
    method: 'post',
    params: data
  })
}

// 列出邀请新成员
export function listForInvite (data) {
  return request({
    url: '/tw/twProjectMember/listForInvite',
    method: 'post',
    params: data
  })
}

// 移除项目成员
export function removeMember (data) {
  return request({
    url: '/tw/twProjectMember/removeMember',
    method: 'post',
    params: data
  })
}

// 项目添加成员模糊搜索成员
export function searchMember (data) {
  return request({
    url: '/tw/twProjectMember/searchMember',
    method: 'post',
    params: data
  })
}

