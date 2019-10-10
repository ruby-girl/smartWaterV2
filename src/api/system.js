import request from '@/utils/request'

// 增加用水性质
export function addWaterQuality(data) {
  return request({
    url: '/WaterProperty/AddWaterProperty',
    method: 'post',
    data:data
  })
}