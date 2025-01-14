import request from '@/utils/request'
import {getShareToken, getToken} from "@/utils/auth";

// 设计报表
export function design(data) {
  return request({
    url: 'report/design',
    method: 'post',
    data,
  })
}

// 预览报表，渲染数据
export function preview(data) {
  return request({
    url: '/bs/bsReportExcel/preview',
    method: 'post',
    data,
  })
}

// 导出报表
export function exportExcel(data) {
  return request({
    url: '/bs/bsReportExcel/exportExcel',
    method: 'post',
    data,
  })
}

// 导出报表
export function exportPdf(data) {
  return request({
    url: '/bs/bsReportExcel/exportPdf',
    method: 'post',
    data,
  })
}

//  获取所有数据集
export function queryAllDataSet() {
  return request({
    url: '/bs/bsDataSet/queryAllDataSet',
    method: 'get',
  })
}

//  获取对应数据集的列集合
export function detail(data) {
  return request({
    url: '/bs/bsDataSet/detailBysetId/' + data,
    method: 'get',
  })
}

//  获取对应数据集的列集合
export function detailBysetCode(data) {
  return request({
    url: '/bs/bsDataSet/detailBysetCode/' + data,
    method: 'get',
  })
}

//  根据reportCode获取报表表格详情
export function detailByReportCode(data) {
  return request({
    url: '/bs/bsReportExcel/detailByReportCode/' + data,
    method: 'get',
  })
}

// reportExcel
export function addReportExcel (data) {
  return request({
    url: '/bs/bsReportExcel/add',
    method: 'post',
    data,
  })
}

// reportExcel
export function editReportExcel (data) {
  return request({
    url: '/bs/bsReportExcel/edit',
    method: 'put',
    data,
  })
}