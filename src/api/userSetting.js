import request from '@/utils/request'

/**
 * 获取用户编号
 * */
export function GetCustomerNo(data) {
  return request({
    url: '/Customer/GetCustomerNo',
    method: 'get',
    data: data
  })
}

/**
 * 释放用户编号
 * */
export function ReleaseCustomerNo(data) {
  return request({
    url: 'Customer/ReleaseCustomerNo',
    method: 'post',
    params: data
  })
}

/**
 *更新用户信息
 * */
export function UpdateCustomerInfo(data) {
  return request({
    url: '/Customer/Update',
    method: 'post',
    data: data
  })
}

/**
 *通过用户Id 获得业务实体
 * */
export function GetBlObjById(data) {
  return request({
    url: '/Customer/GetBlObjById',
    method: 'get',
    params: data
  })
}

/**
 *远传表开户
 * */
export function AddYCCustomer(data) {
  return request({
    url: '/Customer/AddYCCustomer',
    method: 'post',
    data: data
  })
}

/**
 *根据远传水表编号，获取水表信息
 * */
export function GetYCWaterMeterByWaterMeterNo(data) {
  return request({
    url: '/Customer/GetYCWaterMeterByWaterMeterNo',
    method: 'get',
    params: data
  })
}

/**
 *根据物联网水表编号，获取物联网水表信息
 * */
export function GetWLWWaterMeterByWaterMeterNo(data) {
  return request({
    url: '/Customer/GetWLWWaterMeterByWaterMeterNo',
    method: 'get',
    params: data
  })
}

/**
 *根据用户ID获取机械表水表信息
 * */
export function GetJXInfoByCustomerId(data) {
  return request({
    url: '/Customer/GetJXInfoByCustomerId',
    method: 'get',
    params: data
  })
}

/**
 *根据用户ID获取IC水表信息
 * */
export function GetICInfoByCustomerId(data) {
  return request({
    url: '/Customer/GetICInfoByCustomerId',
    method: 'get',
    params: data
  })
}

/**
 *物联网开户，开户申请
 * */
export function AddWLWCustomer(data) {
  return request({
    url: '/Customer/AddWLWCustomer',
    method: 'post',
    data: data
  })
}

/**
 * 机械表开户
 * */
export function AddJXCustomer(data) {
  return request({
    url: '/Customer/AddJXCustomer',
    method: 'post',
    data: data
  })
}

/**
 * IC卡开户
 * */
export function AddICCustomer(data) {
  return request({
    url: '/Customer/AddICCustomer',
    method: 'post',
    data: data
  })
}

/**
 * 查询用户历史业务
 * */
export function GetBusinessLogByCustomerId(data) {
  return request({
    url: '/Customer/GetBusinessLogByCustomerId',
    method: 'get',
    params: data
  })
}


/**
 * 根据用户ID获取远传表水表信息
 * */
export function GetYCInfoByCustomerId(data) {
  return request({
    url: '/Customer/GetYCInfoByCustomerId',
    method: 'get',
    params: data
  })
}

/**
 * 根据用户ID获取物联网水表信息
 * */
export function GetWLWInfoByCustomerId(data) {
  return request({
    url: '/Customer/GetWLWInfoByCustomerId',
    method: 'get',
    params: data
  })
}

/**
 * 根据条件分类查询用户合计数量
 * */
export function GetWaterTypeCustomerNum(data) {
  return request({
    url: '/Customer/GetWaterTypeCustomerNum',
    method: 'post',
    data: data
  })
}

/**
 * 分页查询用户数据列表
 * */
export function GetCustomerDataList(data) {
  return request({
    url: '/Customer/GetCustomerDataList',
    method: 'post',
    data: data
  })
}

/**
 * 导出查询用户数据列表
 * */
export function GetCustomerDataList_ToExcel(data) {
  return request({
    url: '/Customer/GetCustomerDataList_ToExcel',
    method: 'post',
    data: data
  })
}

/**
 * 获取所有启用状态的用水性质列表 不分页
 * */
export function GetWaterPropertyList(data) {
  return request({
    url: '/WaterProperty/GetWaterPropertyList',
    method: 'post',
    data: data
  })
}

// IC卡读卡
// IC卡读卡
export function GetICReadCardInfo(data){
  return request({
    url: '/Customer/GetICReadCardInfo',
    method: 'post',
    data: data
  })
}













