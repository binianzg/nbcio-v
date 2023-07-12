import request from '@/utils/request'

// 获取日程安排列表
export function GetList(data) {
  return request({
    url: '/oa/oaSchedule/getlist',
    method: 'get',
    params: data
  })
}
// 新建日程安排
export function ScheduleCreate(data) {
  return request({
    url: '/oa/oaSchedule/Create',
    method: 'post',
    data
  })
}
// 删除日程安排
export function ScheduleDelete(id) {
  return request({
    url: `/oa/oaSchedule/Delete/${id}`,
    method: 'DELETE',
  })
}
// 获取日历列表
export function GetCalList() {
  return request({
    url: '/oa/oaCalendar/getlist',
    method: 'get',
  })
}
export function ScheduleInfo(params) {
  return request({
    url: '/oa/oaSchedule/queryById',
    method: 'get',
    params
  })
}  
// 更新日程安排
export function ScheduleUpdate(data) {
  return request({
    url: `/oa/oaSchedule/Update/${data.id}`,
    method: 'PUT',
    data
  })
}
// app用
export function AppDayList() {
  return request({
    url: '/oa/oaSchedule/AppDayList',
    method: 'get',
  })
}
export function AppList() {
  return request({
    url: '/oa/oaSchedule/AppList',
    method: 'get',
  })
}
