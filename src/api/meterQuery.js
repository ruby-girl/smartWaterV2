/*******抄表查询接口********/
import request from '@/utils/request'

/**
 * 抄表查询分页查询
 * */
export function ReadingQueryPageQuery(data) {
  return request({
    url: '/ReadingQuery/ReadingQueryPageQuery',
    method: 'post',
    data: data
  })
}

/**
 * 查询水厂下的抄表员，及表册 用于加载查询条件（抄表查询页面 按抄表时间查询时 使用此接口）
 * */
export function QueryMeterReaderByFactoryId(data) {
  return request({
    url: '/ReadingQuery/QueryMeterReaderByFactoryId',
    method: 'post',
    params: data
  })
}

/**
 * 导出抄表查询
 * */
export function MeterReadPlanExport(data) {
  return request({
    url: '/ReadingQuery/MeterReadPlanExport',
    method: 'post',
    data: data
  })
}
