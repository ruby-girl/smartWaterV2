import request from '@/utils/request'
/*******抄表设置接口********/
/**
 * 抄表计划
 * */
export function getPlan(data) {
  return request({
    url: '/MeterReading/LoadMeterReadPlanCombox',
    method: 'post',
    data: data
  })
}

/**
 *表册抄表员与抄表计划联动查询,返回表册下拉选数据与抄表员下拉选数据
 * */
export function LoadRegisterBookAndMeterReader(data) {
  return request({
    url: '/MeterReading/LoadRegisterBookAndMeterReader',
    method: 'post',
    params: data
  })
}

/**
 *抄表设置定位查询
 * */
export function MeterReadingLocationQuery(data) {
  return request({
    url: '/MeterReading/MeterReadingLocationQuery',
    method: 'post',
    params: data
  })
}

/**
 *抄表设置分页查询
 * */
export function MeterReadingPageQuery(data) {
  return request({
    url: '/MeterReading/MeterReadingPageQuery',
    method: 'post',
    data: data
  })
}

/**
 *抄表进度查询
 * */
export function MeterReadingProcessQuery(data) {
  return request({
    url: '/MeterReading/MeterReadingProcessQuery',
    method: 'post',
    params: data
  })
}


/**
 *水量水费预估
 * */
export function WaterYieldPricePredict(data) {
  return request({
    url: '/MeterReading/WaterYieldPricePredict',
    method: 'post',
    data: data
  })
}

/**
 *机械表抄表
 * */
export function getReading(data) {
  return request({
    url: '/MeterReading/Reading',
    method: 'post',
    data: data
  })
}

/**
 *删除抄表
 * */
export function getReadDelete(data) {
  return request({
    url: '/MeterReading/DeleteMeterRecord',
    method: 'post',
    params: data
  })
}
