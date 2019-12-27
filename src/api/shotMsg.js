import request from '@/utils/request'
/* ******************* 短信管理   ********************** */
/* ********  短信设置*********** */


//获取所有模板
export function getTemplateName(data) {
    return request({
        url: '/ShorMsg/ShortMsgTemplateListNotPage',
        method: 'post',
        params: data
    })
}
//获取列表数据
export function getSettingList(data) {
    return request({
        url: '/ShorMsg/ShortMsgTemplateList',
        method: 'post',
        data
    })
}
//添加模板信息
export function addTemplate(data) {
    return request({
        url: '/ShorMsg/InsertShortMsgTemplate',
        method: 'post',
        data
    })
}
//删除模板信息
export function delTemplate(data) {
    return request({
        url: '/ShorMsg/DelTemplateById',
        method: 'post',
        params: data
    })
}
//模板信息详情
export function detaileTemplate(data) {
    return request({
        url: '/ShorMsg/SelectTemplateModel',
        method: 'post',
        params: data
    })
}
//编辑信息详情
export function editTemplate(data) {
    return request({
        url: '/ShorMsg/UpdateTemplateInfo',
        method: 'post',
        data
    })
}
/* ********  短信状态查询 *********** */
//获取列表信息
export function getSelectList(data) {
    return request({
        url: '/ShorMsg/SendShortMsgList',
        method: 'post',
        data
    })
}
//剩余短信
export function getAllNum(data) {
    return request({
        url: '/ShorMsg/SelectAccountShortMsgNum',
        method: 'post',
        data
    })
}
//查询已用短信
export function getSendNum(data) {
    return request({
        url: '/ShorMsg/SelectSendAccountShortMsgNum',
        method: 'post',
        data
    })
}
/* ********  手动发送短信 *********** */
//获取列表信息
export function getSMSList(data) {
    return request({
        url: '/Customer/GetCustomerDataList',
        method: 'post',
        data
    })
}
//发送短信
export function sendShorMsg(data) {
    return request({
        url: '/ShorMsg/HanderSendShortMsgToCheckedCus?templateId=' + data.templateId,
        method: 'post',
        data: data.cusIds
    })
}
//群发
export function sendShorMsgAll(data) {
    return request({
        url: '/ShorMsg/HanderSendShortMsgToWhere?templateId=' + data.templateId,
        method: 'post',
        data: data.obj
    })
}