/*******业务流程接口********/
import request from '@/utils/request'

/**
 * 流程目录树形结构
 * */
export function GetProcessMenu(data) {
  return request({
    url: '/ProcessMenu/GetProcessMenu',
    method: 'post',
    data: data
  })
}

/**
 * 设置流程状态
 * */
export function SetProcessMenuState(data) {
  return request({
    url: '/ProcessMenu/SetProcessMenuState',
    method: 'post',
    params: data
  })
}

/**
 * 获取所有模组信息
 * */
export function GetProcessModuleInfo(data) {
  return request({
    url: '/ProcessConfig/GetProcessModuleInfo',
    method: 'post',
    data: data
  })
}

/**
 * 修改模组信息
 * */
export function UpdateProcessModuleInfo(data) {
  return request({
    url: '/ProcessConfig/UpdateProcessModuleInfo',
    method: 'post',
    data: data
  })
}

/**
 * 删除模组
 * */
export function DeleteProcessModuleInfo(data) {
  return request({
    url: '/ProcessConfig/DeleteProcessModuleInfo',
    method: 'post',
    params: data
  })
}

/**
 * 获取新增流程ID
 * */
export function GetProcessConfigId(data) {
  return request({
    url: '/ProcessConfig/GetProcessConfigId',
    method: 'post',
    params: data
  })
}

/**
 * 新增模组
 * */
export function AddProcessModuleInfo(data) {
  return request({
    url: '/ProcessConfig/AddProcessModuleInfo',
    method: 'post',
    data: data
  })
}
