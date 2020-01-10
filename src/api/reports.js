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
//机械表异常AbnormalReport/GetAbnormalRate_Dt
export function GetReportRate(data) {
    return request({
        url: '/AbnormalReport/GetAbnormalRate_Dt',
        method: 'post',
        data: data
    })
}
export function ExcelReportRate(data) {
    return request({
        url: '/AbnormalReport/Execl_GetAbnormalRate_Dt',
        method: 'post',
        data: data
    })
}

/* ************************** 用户业务办理************************** */
export function GetReportBusiness(data) {
    return request({
        url: '/CustomerBusinessReport/CustomerBusinessTotal',
        method: 'post',
        data: data
    })
}
export function ExcelReportBusiness(data) {
    return request({
        url: '/CustomerBusinessReport/CustomerBusinessTotalExcel',
        method: 'post',
        data: data
    })
}
//开户明细
export function GetReportOpen(data) {
    return request({
        url: '/CustomerBusinessReport/CustomerTotalDetail',
        method: 'post',
        data: data
    })
}
//过户明细
export function GetReportTransfer(data) {
    return request({
        url: '/CustomerBusinessReport/TransferChangeTotalDetail',
        method: 'post',
        data: data
    })
}
//销户明细
export function GetReportAccount(data) {
    return request({
        url: '/CustomerBusinessReport/AccountCanCellationTotalDetail',
        method: 'post',
        data: data
    })
}
//换表明细
export function GetReportChange(data) {
    return request({
        url: '/CustomerBusinessReport/WaterMeterChangeTotalDetail',
        method: 'post',
        data: data
    })
}
//升级明细
export function GetReportUpgrade(data) {
    return request({
        url: '/CustomerBusinessReport/WaterMeterUpgradeRecordTotalDetail',
        method: 'post',
        data: data
    })
}
//低保户明细
export function GetReportInsured(data) {
    return request({
        url: '/CustomerBusinessReport/InsuredMessageTotalDetail',
        method: 'post',
        data: data
    })
}