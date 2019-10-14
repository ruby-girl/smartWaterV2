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

//水价构成--or 编辑前获取详情
export function SelectUpdateWaterPropertyBeforeInfo(data){
  return request({
    url: '/WaterProperty/SelectUpdateWaterPropertyBeforeInfo',
    method: 'post',
    params:data
  })
}

//历史水价
export function GetWaterPropertyById(id,data){
  return request({
    url: '/WaterProperty/GetWaterPropertyById',
    method: 'post',
    data:data,
    params:id,
  })
}

//导出历史水价
export function GetWaterPropertyHisList_OutExcel(id,data){
  return request({
    url: '/WaterProperty/GetWaterPropertyHisList_OutExcel',
    method: 'post',  
    data:data,
    params:id,
  })
}
//历史水价--水价构成
export function SelectWaterPropertyHisInfo(id,data){
  return request({
    url: '/WaterProperty/SelectWaterPropertyHisInfo',
    method: 'post',  
    data:data,
    params:id,
  })
}

