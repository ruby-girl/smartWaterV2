import request from '@/utils/request'

export function searJXMeterWater(data) {//机械表查询
  return request({
    url:"/WaterMeter/GetWaterMeter1List",
    method: 'post',
    data
  })
}
export function searJXHisWater(data) {//机械表历史
return request({
    url:"/WaterMeter/GetWaterMeter1MeterReadList",
    method: 'post',
    data
})
}