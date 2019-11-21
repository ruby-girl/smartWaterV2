import request from '@/utils/request'

export function searJXMeterWater(data) {//机械表查询
  return request({
    url: "/WaterMeter/GetWaterMeter1List",
    method: 'post',
    data
  })
}
export function searJXHisWater(data) {//机械表历史
  return request({
    url: "/WaterMeter/GetWaterMeter1MeterReadList",
    method: 'post',
    data
  })
}
export function editJXHisWater(data) {//获取机械编辑信息
  return request({
    url: "/WaterMeter/GetWaterMeter1BlById",
    method: 'post',
    data
  })
}
export function saveJXHisWater(data) {//编辑机械编辑信息
  return request({
    url: "/WaterMeter/WaterMeter1UpDate",
    method: 'post',
    data
  })
}