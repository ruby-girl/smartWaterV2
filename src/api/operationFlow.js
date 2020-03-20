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
 * 根据流程编码获取所有流程
 * */
export function GetProcessConfig(data) {
  return request({
    url: '/ProcessConfig/GetProcessConfig',
    method: 'post',
    params: data
  })
}

/**
 * 删除流程
 * */
export function DeleteProcessConfig(data) {
  return request({
    url: '/ProcessConfig/DeleteProcessConfig',
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

/**
 * 根据部门获取岗位
 * */
export function CacheComboBoxByPIdZhuanYong(data) {
  return request({
    url: '/Job/CacheComboBoxByPIdZhuanYong',
    method: 'post',
    params: data
  })
}

/**
 * 根据岗位获取人员信息
 * */
export function ComboBoxListZhuanYong(data) {
  return request({
    url: '/Employee/ComboBoxListZhuanYong',
    method: 'post',
    params: data
  })
}

/**
 * 根据角色获取人员信息
 * */
export function ComboBoxListByRoseZhuanYong(data) {
  return request({
    url: '/Employee/ComboBoxListByRoseZhuanYong',
    method: 'post',
    params: data
  })
}


/**
 * 获取所有流程子集
 * */
export function GetProcessMenuChildren(data) {
  return request({
    url: '/ProcessMenu/GetProcessMenuChildren',
    method: 'post',
    params: data
  })
}

/**
 * 流程复制
 * */
export function ProcessCopy(data) {
  return request({
    url: '/ProcessConfig/ProcessCopy',
    method: 'post',
    params: data
  })
}


/**
 * 流程人组新增ID
 * */
export function GetMD5Id(data) {
  return request({
    url: '/ProcessConfig/GetMD5Id',
    method: 'post',
    params: data
  })
}


/**
 * 节点修改
 * */
export function UpdateProcessConfig(data) {
  return request({
    url: '/ProcessConfig/UpdateProcessConfig',
    method: 'post',
    data: data
  })
}
