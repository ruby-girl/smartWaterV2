/*******报表接口********/
import request from '@/utils/request'

/**
 * 费用统计报表表格查询接口
 * */
export function FeeStatisticsReportGetList(data) {
  return request({
    url: '/FeeStatisticsReport/FeeStatisticsReportGetList',
    method: 'post',
    data: data
  })
}

/**
 * POST费用统计报表表格导出
 * */
export function FeeStatisticsReportGetListToExcel(data) {
  return request({
    url: '/FeeStatisticsReport/FeeStatisticsReportGetListToExcel',
    method: 'post',
    data: data
  })
}


/**
 * GET /api/获取某水厂当前遗留欠款
 * */
export function GetPastArrears(data) {
  return request({
    url: '/FeeStatisticsReport/GetPastArrears',
    method: 'get',
    params: data
  })
}



/**
 * 垃圾费统计
 * */
export function GarbageReportDt(data) {
  return request({
    url: '/GarbageReport/GarbageReportDt',
    method: 'post',
    data: data
  })
}


/**
 * 垃圾费统计导出
 * */
export function Execl_GarbageReportDt(data) {
  return request({
    url: '/GarbageReport/Execl_GarbageReportDt',
    method: 'post',
    data: data
  })
}


/**
 * 抄表率统计
 * */
export function MeterReadPercentStatistics(data) {
  return request({
    url: '/MeterReadPercent/MeterReadPercentStatistics',
    method: 'post',
    data: data
  })
}


/**
 * 抄表率统计导出
 * */
export function MeterReadPercentStatistics_ToExcel(data) {
  return request({
    url: '/MeterReadPercent/MeterReadPercentStatistics_ToExcel',
    method: 'post',
    data: data
  })
}


/**
 * 用水性质 有阶梯
 * */
export function WaterPropertyReportToLadder(data) {
  return request({
    url: '/WaterPropertyReport/WaterPropertyReportToLadder',
    method: 'post',
    data: data
  })
}

/**
 * 用水性质导出有阶梯
 * */
export function WaterPropertyReportToLadderToExcel(data) {
  return request({
    url: '/WaterPropertyReport/WaterPropertyReportToLadderToExcel',
    method: 'post',
    data: data
  })
}


/**
 * 用水性质 无阶梯
 * */
export function WaterPropertyReportToNotLadder(data) {
  return request({
    url: '/WaterPropertyReport/WaterPropertyReportToNotLadder',
    method: 'post',
    data: data
  })
}

/**
 * 用水性质导出 无阶梯
 * */
export function WaterPropertyReportToNotLadderToExcel(data) {
  return request({
    url: '/WaterPropertyReport/WaterPropertyReportToNotLadderToExcel',
    method: 'post',
    data: data
  })
}


/**
 * 用户统计报表
 * */
export function GetCustomerReportData(data) {
  return request({
    url: '/CustomerReport/GetCustomerReportData',
    method: 'post',
    data: data
  })
}


/**
 * 用户统计报表导出
 * */
export function GetCustomerReportDataToExcel(data) {
  return request({
    url: '/CustomerReport/GetCustomerReportDataToExcel',
    method: 'post',
    data: data
  })
}
















