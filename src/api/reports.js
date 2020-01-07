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
    return GetReportFactory({
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
    return GetReportFactory({
        url: '/WaterConsumption/GetWaterConsumptionReportDataByAreaToExcel',
        method: 'post',
        data: data
    })
}