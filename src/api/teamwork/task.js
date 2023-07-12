import request from '@/utils/request'

// 任务保存
export function taskSave(data) {
  return request({
    url: '/tw/twTask/taskSave',
    method: 'post',
    params: data
  })
}

// 点赞
export function like(data) {
  return request({
    url: '/tw/twTask/like',
    method: 'post',
    params: data
  })
}

// 根据登录用户读取项目任务
export function taskRead(data) {
  return request({
    url: '/tw/twTask/taskRead',
    method: 'post',
    params: data
  })
}

// 任务详情 任务编辑
export function taskEdit(data) {
  return request({
    url: '/tw/twTask/taskEdit',
    method: 'post',
    params: data
  })
}

// 任务详情  添加评论
export function createComment(data) {
  return request({
    url: '/tw/twTask/createComment',
    method: 'post',
    params: data
  })
}

// 任务详情 打开任务详情日志
export function taskLog(data) {
  return request({
    url: '/tw/twTask/taskLog',
    method: 'post',
    params: data
  })
}

// 任务详情 新建标签保存
export function taskSetTag(data) {
  return request({
    url: '/tw/twTask/taskSetTag',
    method: 'post',
    params: data
  })
}

// 任务详情 设置私有
export function setPrivate(data) {
  return request({
    url: '/tw/twTask/setPrivate',
    method: 'post',
    params: data
  })
}

// 资源关联
export function taskSources(data) {
  return request({
    url: '/tw/twTask/taskSources',
    method: 'post',
    params: data
  })
}

// 任务工时
export function taskWorkTimeList(data) {
  return request({
    url: '/tw/twTask/taskWorkTimeList',
    method: 'post',
    params: data
  })
}

// 保存任务工时
export function saveTaskWorkTime(data) {
  return request({
    url: '/tw/twTask/saveTaskWorkTime',
    method: 'post',
    params: data
  })
}

// 编辑任务工时
export function editTaskWorkTime(data) {
  return request({
    url: '/tw/twTask/editTaskWorkTime',
    method: 'post',
    params: data
  })
}

// 删除任务工时
export function delTaskWorkTime(data) {
  return request({
    url: '/tw/twTask/delTaskWorkTime',
    method: 'post',
    params: data
  })
}

// 收藏
export function star(data) {
  return request({
    url: '/tw/twTask/star',
    method: 'post',
    params: data
  })
}

// 通过成员id查任务列表
export function listByMember(data) {
  return request({
    url: '/tw/twTask/listByMember',
    method: 'post',
    params: data
  })
}

// 获取任务标签列表
export function getListByTaskTag(data) {
  return request({
    url: '/tw/twTask/getListByTaskTag',
    method: 'post',
    params: data
  })
}

// 通过任务Id恢复任务
export function recovery(data) {
  return request({
    url: '/tw/twTask/recovery',
    method: 'post',
    params: data
  })
}

// 保存任务列表
export function taskStagesSave(data) {
  return request({
    url: '/tw/twTask/taskStagesSave',
    method: 'post',
    params: data
  })
}

// 编辑任务列表
export function taskStagesEdit(data) {
  return request({
    url: '/tw/twTask/taskStagesEdit',
    method: 'post',
    params: data
  })
}

// 删除任务列表
export function taskStagesDel(data) {
  return request({
    url: '/tw/twTask/taskStagesDel',
    method: 'post',
    params: data
  })
}

// 根据taskId删除任务
export function del(id) {
  return request({
    url: '/tw/twTask/delete',
    method: 'post',
    params: id
  })
}

// 恢复任务
export function taskRecycle(data) {
  return request({
    url: '/tw/twTask/taskRecycle',
    method: 'post',
    params: data
  })
}

// 批量恢复任务
export function recycleBatch(data) {
  return request({
    url: '/tw/twTask/recycleBatch',
    method: 'post',
    params: data
  })
}

// 获取任务成员
export function getTaskMembers(data) {
  return request({
    url: '/tw/twTask/getTaskMembers',
    method: 'post',
    params: data
  })
}
// 获取任务阶段列表
export function GetStagesList(params) {
  return request({
    url: '/tw/twTaskStagesTemplate/listByTemplateId',
    method: 'get',
    params
  })
}

// 根据projectId获取任务阶段列表
export function getStagesByProjectId(projectId) {
  return request({
    url: '/tw/twTaskStages/getStages',
    method: 'post',
    params: projectId
  })
}

// 批量获取任务列表
export function batchAssignTask(data) {
  return request({
    url: '/tw/twTask/batchAssignTask',
    method: 'post',
    params: data
  })
}

// 批量邀请成员
export function inviteMemberBatch(data) {
  return request({
    url: '/tw/twTaskMember/inviteMemberBatch',
    method: 'post',
    params: data
  })
}


// 打开任务详情 时间总数
export function dateTotalForProject(data) {
  return request({
    url: '/tw/twTask/dateTotalForProject',
    method: 'post',
    params: data
  })
}

// 打开任务详情 添加加标签初始化
export function taskToTags(data) {
  return request({
    url: '/tw/twTask/taskToTags',
    method: 'post',
    params: data
  })
}

// 获取任务列表
export function assignTask(data) {
  return request({
    url: '/tw/twTask/assignTask',
    method: 'post',
    params: data
  })
}

// 获取任务列表
export function getTasks(tasks) {
  return request({
    url: '/tw/twTaskStages/getTasks',
    method: 'post',
    params: tasks
  })
}

// 获取已做任务列表
export function taskDone(iddone) {
  return request({
    url: '/tw/twTaskStages/taskDone',
    method: 'post',
    params: iddone
  })
}

// 获取任务排序
export function sortTask(threeId) {
  return request({
    url: '/tw/twTaskStages/sortTask',
    method: 'post',
    params: threeId
  })
}

// 任务阶段排序
export function sort(data) {
  return request({
    url: '/tw/twTaskStages/sort',
    method: 'post',
    params: data
  })
}

// 项目添加任务流程与规则
export function saveAndRules (data) {
  return request({
    url: '/tw/twTaskWorkflow/saveandrules',
    method: 'post',
    params: data
  })
}

// 修改任务流程与规则
export function editAndRules (data) {
  return request({
    url: '/tw/twTaskWorkflow/editandrules',
    method: 'post',
    params: data
  })
}

// 删除项目任务流程与规则
export function removeAndRules (data) {
  return request({
    url: '/tw/twTaskWorkflow/removeandrules',
    method: 'post',
    params: data
  })
}

// 根据workflowId获取任务流程规则
export function getWorkflowRules(workflowId) {
  return request({
    url: '/tw/twTaskWorkflowRule/getrules',
    method: 'post',
    params: workflowId
  })
}

// 根据projectId获取任务流程
export function getWorkflow(projectId) {
  return request({
    url: '/tw/twTaskWorkflow/getlist',
    method: 'post',
    params: projectId
  })
}

// 删除项目任务关联文件
export function sourceDel (data) {
  return request({
    url: '/tw/twSourceLink/sourceDel',
    method: 'post',
    params: data
  })
}
