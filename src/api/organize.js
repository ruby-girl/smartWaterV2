import request from '@/utils/request'

/**
 * 部门接口
 * */
export function GetList(data) {
  return request({
    url: '/Department/GetList',
    method: 'post',
    data: data
  })
}

export function Add(data) {
  return request({
    url: '/Department/Add',
    method: 'post',
    data: data
  })
}

export function UpDate(data) {
  return request({
    url: '/Department/UpDate',
    method: 'post',
    data: data
  })
}

export function Delete(data) {
  return request({
    url: '/Department/Delete',
    method: 'post',
    data: data
  })
}

export function ComboBoxList(data) {
  return request({
    url: '/Department/ComboBoxList',
    method: 'post',
    data: data
  })
}

export function GetList_Execl(data) {
  return request({
    url: '/Department/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 * 岗位接口
 * */
export function GetListPost(data) {
  return request({
    url: '/Job/GetList',
    method: 'post',
    data: data
  })
}

export function AddPost(data) {
  return request({
    url: '/Job/Add',
    method: 'post',
    data: data
  })
}

export function UpDatePost(data) {
  return request({
    url: '/Job/UpDate',
    method: 'post',
    data: data
  })
}

export function DeletePost(data) {
  return request({
    url: '/Job/Delete',
    method: 'post',
    data: data
  })
}

export function linkComboBoxList(data) {
  return request({
    url: '/Job/ComboBoxList',
    method: 'post',
    params: data
  })
}

export function JobGetList_Execl(data) {
  return request({
    url: '/Job/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 *人员管理
 **/
export function peopleDelete(data) {
  return request({
    url: '/Employee/Delete',
    method: 'post',
    params: data
  })
}

export function peopleUpDate(data) {
  return request({
    url: '/Employee/UpDate',
    method: 'post',
    data: data
  })
}

export function peopleGetList(data) {
  return request({
    url: '/Employee/GetList',
    method: 'post',
    data: data
  })
}

export function peopleAdd(data) {
  return request({
    url: '/Employee/Add',
    method: 'post',
    data: data
  })
}

export function Employee_Execl(data) {
  return request({
    url: '/Employee/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 * 获取操作员信息
 * */
export function GetRoleNameList(data) {
  return request({
    url: '/User/GetLoginNameList',
    method: 'post',
    params: data
  })
}

/**
 * 获取操人员详情
 * */
export function GetBlObjById(data) {
  return request({
    url: '/Employee/GetBlObjById',
    method: 'post',
    params: data
  })
}

// 水厂管理API-----start
export function waterFactoryGetList(data) {
  return request({
    url: '/SA_WaterFactory/GetList',
    method: 'post',
    data: data
  })
}

// 下拉框水厂
export function waterFactoryGetSelectList(data) {
  return request({
    url: '/SA_WaterFactory/ComboBoxList',
    method: 'post',
    data: data
  })
}

// 编辑水厂
export function waterFactoryUpDate(data) {
  return request({
    url: '/SA_WaterFactory/UpDate',
    method: 'post',
    data: data
  })
}

// 新增水厂
export function waterFactoryAdd(data) {
  return request({
    url: '/SA_WaterFactory/Add',
    method: 'post',
    data: data
  })
}

// 删除水厂
export function waterFactoryDelete(data) {
  return request({
    url: '/SA_WaterFactory/Delete',
    method: 'post',
    data: data
  })
}

// 导出水厂
export function waterFactoryExcel(data) {
  return request({
    url: '/SA_WaterFactory/Excel',
    method: 'post',
    data: data
  })
}
// 水厂管理API-----end