import request from '@/utils/request'

/**
 * 登录人提交的信息
 * */
export function GetInfosBySubmission(data) {
  return request({
    url: '/MyWorkbench/GetInfosBySubmission',
    method: 'post',
    data: data
  })
}

/**
 * 等待当前登录用户处理的审核流程数据
 * */
export function GetInfosByToBeAudited(data) {
  return request({
    url: '/MyWorkbench/GetInfosByToBeAudited',
    method: 'post',
    data: data
  })
}

/**
 * 查询流程数据
 * */
export function GetAuditedInfo(data) {
  return request({
    url: '/MyWorkbench/GetAuditedInfo',
    method: 'post',
    data: data
  })
}

/**
 * 当前登录人已经审核的数据
 * */
export function GetBusinessFlowRecordByCurrentUser(data) {
  return request({
    url: '/MyWorkbench/GetBusinessFlowRecordByCurrentUser',
    method: 'post',
    data: data
  })
}

/**
 * 审核环境查看
 * */
export function GetAuditLink(data) {
  return request({
    url: '/MyWorkbench/GetAuditLink',
    method: 'post',
    params: data
  })
}

/**
 * 审核流程记录 倒序
 * */
export function GetAuditRecord(data) {
  return request({
    url: '/MyWorkbench/GetAuditRecord',
    method: 'post',
    params: data
  })
}

/**
 * 审核信息详情
 * */
export function GetAuditDetail(data) {
  return request({
    url: '/MyWorkbench/GetAuditDetail',
    method: 'post',
    params: data
  })
}

/**
 * 审核流程
 * */
export function ProcessOperation(data) {
  return request({
    url: '/MyWorkbench/ProcessOperation',
    method: 'post',
    data: data
  })
}

/**
 * 当前登陆人信息
 * */
export function GetCurrInfo(data) {
  return request({
    url: '/MyWorkbench/GetCurrInfo',
    method: 'post',
    data: data
  })
}

/**
 * 提交导出
 * */
export function GetInfosBySubmissionExcel(data) {
  return request({
    url: '/MyWorkbench/GetInfosBySubmissionExcel',
    method: 'post',
    data: data
  })
}

/**
 * 待审核导出
 * */
export function GetInfosByToBeAuditedExcel(data) {
  return request({
    url: '/MyWorkbench/GetInfosByToBeAuditedExcel',
    method: 'post',
    data: data
  })
}

/**
 * 查询审核导出
 * */
export function GetAuditedInfoExcel(data) {
  return request({
    url: '/MyWorkbench/GetAuditedInfoExcel',
    method: 'post',
    data: data
  })
}

/**
 * 我已审核导出
 * */
export function GetBusinessFlowRecordByCurrentUserExcel(data) {
  return request({
    url: '/MyWorkbench/GetBusinessFlowRecordByCurrentUserExcel',
    method: 'post',
    data: data
  })
}
