import request from '@/utils/request'

export function searchPlanList(data) {//查询
  return request({
    url: '/MeterReadPlan/MeterReadPlanPageQuery',
    method: 'post',
    data
  })
}
export function exportPlanList(data) {//导出
  return request({
    url: '/MeterReadPlan/MeterReadPlanExport',
    method: 'post',
    data
  })
}
export function changeListState(data) {//数据绑定or数据补录
  return request({
    url: '/MeterReadPlan/DataSupplementaryInputChange',
    method: 'post',
    params:data
  })
}
export function planConpanySelect(data) {//抄表页面水厂下拉
  return request({
    url: '/SA_WaterFactory/ComboBoxListAuth',
    method: 'post',
    params:data
  })
}
export function delPlanList(data) {//删除
  return request({
    url: '/MeterReadPlan/DeleteMeterReadPlan',
    method: 'post',
    params:data
  })
}
export function getCompanyPlanDate(data) {//增加计划根据水厂获取时间
  return request({
    url: '/MeterReadPlan/GetPlanStartTimeByFactory',
    method: 'get',
    params:data
  })
}
export function addMeterReadingPlan(data) {//添加抄表计划
  return request({
    url: '/MeterReadPlan/ManualCreateMeterReadPlan',
    method: 'post',
    data
  })
}
//POST /api/MeterReadPlan/ManualCreateMeterReadPlan