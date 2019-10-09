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
    data
  })
}
export function palnStateSelect(data) {//抄表状态下拉
  return request({
    url: '/Dictionary/GetDictionaryListAll',
    method: 'get',
    params:data
  })
}
//POST /api/SA_WaterFactory/ComboBoxListAuthGET /api/Dictionary/GetDictionaryListAll