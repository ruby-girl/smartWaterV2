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
