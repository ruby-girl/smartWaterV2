import request from '@/utils/request'

/* ------------------------低保户管理--------------- */
//获取低保户列表
export function getInssured(data) {
    return request({
        url: '/InsuredMessage/InssuredManageListPageQuery',
        method: 'post',
        data
    })
}
//导出
export function excelInssured(data) {
    return request({
        url: '/InsuredMessage/InssuredManageListPageQueryExport',
        method: 'post',
        data
    })
}
//获取历史信息
export function getInssuredHis(data) {
    return request({
        url: '/InsuredMessage/InssuredManageHisListPageQuery',
        method: 'post',
        data
    })
}
//导出历史信息
export function excelInssuredHis(data) {
    return request({
        url: '/InsuredMessage/InssuredManageHisListPageQueryExport',
        method: 'post',
        data
    })
}
//详情
export function getInssureDetaile(data) {
    return request({
        url: '/InsuredMessage/GetInsuredDetailOutById',
        method: 'post',
        params:data
    })
}
//复审
export function reviewInssure(data) {
    return request({
        url: '/InsuredMessage/InsuredReCheck',
        method: 'post',
        data
    })
}
