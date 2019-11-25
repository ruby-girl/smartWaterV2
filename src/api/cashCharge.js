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

export function OrderAfterOverdueFeeWaiver(data) {//违约金减免
  return request({
    url: '/Order/OrderAfterOverdueFeeWaiver',
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
// 结算
export function Settlement(data){
  return request({
    url: '/PayMent/Settlement',
    method: 'post',
    data: data
  })
}

// 收费查询--------

//列表
export function SelectPayMentDataList(data){
  return request({
    url: '/PayMent/SelectPayMentDataList',
    method: 'post',
    data: data
  })
}
//
// 根据条件计算缴费数据之和
export function GetWaterTypeCustomerNum(data){
  return request({
    url: '/PayMent/GetWaterTypeCustomerNum',
    method: 'post',
    data: data
  })
}
// 缴费单冲红
export function RedPayMentDataByPayMentId(data){
  return request({
    url: '/PayMent/RedPayMentDataByPayMentId',
    method: 'post',
    params: data
  })
}
// 导出收费查询
export function SelectPayMentDataListToExcel(data){
  return request({
    url: '/PayMent/SelectPayMentDataListToExcel',
    method: 'post',
    data: data
  })
}


// 账单详情-----------------------

// 列表
export function SelectBillDataList(data){
  return request({
    url: '/PayMent/SelectBillDataList',
    method: 'post',
    data: data    
  })
}

// 导出
export function SelectBillDataListToExcel(data){
  return request({
    url: '/PayMent/SelectBillDataListToExcel',
    method: 'post',
    data: data    
  })
}

// 欠费管理-----------
// 欠费管理列表--按用户查询
export function GetList(data){
  return request({
    url: '/Order/GetList',
    method: 'post',
    data: data    
  })
}
// 欠费管理列表--按用户查询

export function GetListByWaterFactory(data){
  return request({
    url: '/Order/GetListByWaterFactory',
    method: 'post',
    data: data    
  })
}