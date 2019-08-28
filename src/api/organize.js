import request from '@/utils/request'

/**
 * 部门接口
 * */
export function GetList(data) {
  return request({
    url: '/api/Department/GetList',
    method: 'post',
    data: data
  })
}

export function Add(data) {
  return request({
    url: '/api/Department/Add',
    method: 'post',
    data: data
  })
}

export function UpDate(data) {
  return request({
    url: '/api/Department/UpDate',
    method: 'post',
    data: data
  })
}

export function Delete(data) {
  return request({
    url: '/api/Department/Delete',
    method: 'post',
    data: data
  })
}

export function ComboBoxList(data) {
  return request({
    url: '/api/Department/ComboBoxList',
    method: 'post',
    data: data
  })
}

export function GetList_Execl(data) {
  return request({
    url: '/api/Department/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 * 岗位接口
 * */
export function GetListPost(data) {
  return request({
    url: '/api/Job/GetList',
    method: 'post',
    data: data
  })
}

export function AddPost(data) {
  return request({
    url: '/api/Job/Add',
    method: 'post',
    data: data
  })
}

export function UpDatePost(data) {
  return request({
    url: '/api/Job/UpDate',
    method: 'post',
    data: data
  })
}

export function DeletePost(data) {
  return request({
    url: '/api/Job/Delete',
    method: 'post',
    data: data
  })
}

export function linkComboBoxList(data) {
  return request({
    url: '/api/Job/ComboBoxList',
    method: 'post',
    params: data
  })
}

export function JobGetList_Execl(data) {
  return request({
    url: '/api/Job/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 *人员管理
 **/
export function peopleDelete(data) {
  return request({
    url: '/api/Employee/Delete',
    method: 'post',
    params: data
  })
}

export function peopleUpDate(data) {
  return request({
    url: '/api/Employee/UpDate',
    method: 'post',
    data: data
  })
}

export function peopleGetList(data) {
  return request({
    url: '/api/Employee/GetList',
    method: 'post',
    data: data
  })
}

export function peopleAdd(data) {
  return request({
    url: '/api/Employee/Add',
    method: 'post',
    data: data
  })
}

export function Employee_Execl(data) {
  return request({
    url: '/api/Employee/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 * 获取操作员信息
 * */
export function GetRoleNameList(data) {
  return request({
    url: '/api/User/GetLoginNameList',
    method: 'post',
    params: data
  })
}

/**
 * 获取操人员详情
 * */
export function GetBlObjById(data) {
  return request({
    url: '/api/Employee/GetBlObjById',
    method: 'post',
    params: data
  })
}


