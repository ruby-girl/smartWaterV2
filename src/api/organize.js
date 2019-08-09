import request from '@/utils/request'

/**
 * 部门接口
 * */
export function GetList(data) {
  return request({
    url: '/Department/GetList',
    method: 'post',
    params: data
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

/**
 * 岗位接口
 * */
export function GetListPost(data) {
  return request({
    url: '/Job/GetList',
    method: 'post',
    params: data
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

/**
 *人员管理
 **/
export function DeletePost1(data) {
  return request({
    url: '/Job/Delete',
    method: 'post',
    data: data
  })
}
