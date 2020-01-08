import request from '@/utils/request'
/*****************************************用水量 ********************************/
//按水厂
export function GetReportFactory(data) {
    return request({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByWaterFactory',
        method: 'post',
        data: data
    })
}
export function ExcelReportFactory(data) {
    return request({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByWaterFactoryToExcel',
        method: 'post',
        data: data
    })
}
//按区域
export function GetReportArea(data) {
    return request({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByArea',
        method: 'post',
        data: data
    })
}
export function ExcelReportArea(data) {
    return request({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByAreaToExcel',
        method: 'post',
        data: data
    })
}
//按用户
export function GetReportUser(data) {
    return request({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByUser',
        method: 'post',
        data: data
    })
}
export function ExcelReportUser(data) {
    return request({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByUserToExcel',
        method: 'post',
        data: data
    })
}
/* ************************** 异常统计************************** */
//长时间未交费
export function GetReportPay(data) {
    return request({
        url: '/AbnormalReport/GetLongTimeNoPayDT',
        method: 'post',
        data: data
    })
}
export function ExcelReportPay(data) {
    return request({
        url: '/AbnormalReport/Execl_LongTimeNoPayDT',
        method: 'post',
        data: data
    })
}
//用水异常
export function GetReportYield(data) {
    return request({
        url: '/AbnormalReport/GetUserTotalWaterYieldDT',
        method: 'post',
        data: data
    })
}
export function ExcelReportYield(data) {
    return request({
        url: '/AbnormalReport/Execl_UserTotalWaterYieldDT',
        method: 'post',
        data: data
    })
}