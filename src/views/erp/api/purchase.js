import {axios as request} from '@/utils/request'

// 采购入库审核通过，id为主表单单据id
export function ApprovePass(id) {
  return request({
    url: '/purchase/erpInSheet/approvePass' + id,
    method: 'post'
  })
}