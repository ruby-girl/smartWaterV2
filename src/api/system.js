import request from '@/utils/request'

// 系统设置

// 用水性质-start
// 增加用水性质
export function addWaterQuality(data) {
  return request({
    url: '/WaterProperty/AddWaterProperty',
    method: 'post',
    data:data
  })
}
// 删除用水性质
export function delWaterQuality(data) {
  return request({
    url: '/WaterProperty/Add',
    method: 'post',
    params:data
  })
}

//加载表格
export function getWaterQualityList(data){
  return request({
    url: '/WaterProperty/GetWaterPropertyList_C',
    method: 'post',
    data:data
  })
}