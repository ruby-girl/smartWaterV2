// 现金收费
import request from '@/utils/request'

export function GetOrder(data) {//表格数据
    return request({
      url: '/Order/GetOrder',
      method: 'post',
      data: data
    })
}
export function GetOrderView(data) {//卡片数据
    return request({
      url: '/Order/GetOrderView',
      method: 'post',
      data: data
    })
}
export function OrderFeeCancel(data) {//费用撤销
  return request({
    url: '/Order/OrderFeeCancel',
    method: 'post',
    params: data
  })
}
export function OrderFeeWaiver(data) {//费用减免
  return request({
    url: '/Order/OrderFeeWaiver',
    method: 'post',
    params: data
  })
}
// 费用详情
export function SelectFeeDetail(data){
  return request({
    url: '/PayMent/SelectFeeDetail',
    method: 'post',
    params: data
  })
}
// 收费查询

//列表
export function SelectPayMentDataList(data){
  return request({
    url: '/PayMent/SelectPayMentDataList',
    method: 'post',
    params: data
  })
}