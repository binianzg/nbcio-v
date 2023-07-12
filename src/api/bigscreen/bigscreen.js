import {axios as request} from '@/utils/request'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

// 根据code获取数据源类型json数据
export function GetSourceTypeByCode(code) {
  return request({
    url: '/bs/bsSourceType/queryByCode' + code,
    method: 'get'
  })
}

// 数据源测试连接
export function testConnection (data) {
  return request({
    url: '/bs/bsDataSource/testConnection',
    method: 'post',
    data,
  })
}

// 测试数据转换，以及返回数据table列表
export function testTransformSet (data) {
  return request({
    url: '/bs/bsDataSet/testTransform',
    method: 'post',
    data,
  })
}

// 保存大屏设计
export function insertDashboard(data) {
  return request({
    url: '/bs/bsReportDashboard',
    method: 'post',
    data,
  })
}

// 预览、查询大屏详情
export function detailDashboard(data) {
  return request({
    url: '/bs/bsReportDashboard/' + data,
    method: 'get',
  })
}

// 数据集查询
export function queryAllDataSet(data) {
  return request({
    url: 'dataSet/queryAllDataSet',
    method: 'get',

  })
}

// 获取数据集信息
export function detailBysetId(data) {
  return request({
    url: 'dataSet/detailBysetId/' + data,
    method: 'get',
  })
}

// 获取动态数据
export function getData(data) {
  return request({
    url: '/bs/bsReportDashboard/getData',
    method: 'post',
    data,
  })
}

// 导出大屏
export function exportDashboard(data) {
  const token = Vue.ls.get(ACCESS_TOKEN);
  return new Promise((resolve) =>{
    axios({
      method:'get',
      url: window._CONFIG['domianURL'] + '/bs/bsReportDashboard/export',
      params:data,
      headers: {"X-Access-Token":token},
      responseType:'blob'
    }).then(res =>{
      console.log("exportDashboard Promise res=",res);
      resolve(res.data);
    }).catch(err =>{
      resolve('error');
    })
  })

}

// 导入大屏
export function importDashboard(data) {
  return request({
    url: '/bs/bsReportDashboard/import',
    method: 'post',
    data,
  })
}
