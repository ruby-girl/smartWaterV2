import request from '@/utils/request'


/*------------用户销户----------*/
//获取水表信息
export function getWaterInfo(data) {//机械表查询
    return request({
        url: "/Customer/WaterMeterModel",
        method: 'GET',
        params:data
    })
}
///销户GET /api/Customer/InsertAccountCanCellation
export function waterAccount(data) {//机械表查询
    return request({
        url: "/Customer/InsertAccountCanCellation",
        method: 'GET',
        params:data
    })
}
///销户记录查询 POST /api/Customer/AccountCanCellationList
export function waterAccount(data) {//机械表查询
    return request({
        url: "/Customer/AccountCanCellationList",
        method: 'POST',
        data
    })
}
///销户记录导出POST /api/Customer/AccountCanCellationList_Execl
export function excelWaterAccount(data) {//机械表查询
    return request({
        url: "/Customer/AccountCanCellationList_Execl",
        method: 'POST',
        data
    })
}