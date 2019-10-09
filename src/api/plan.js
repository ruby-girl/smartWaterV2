import request from '@/utils/request'

export function searchPlanList(data) {
  return request({
    url: '/MeterReadPlan/MeterReadPlanPageQuery',
    method: 'post',
    data
  })
}