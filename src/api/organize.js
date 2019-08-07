import request from '@/utils/request'

export function GetList(data) {
  return request({
    url: '/Department/GetList',
    method: 'get',
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
    method: 'delete',
    data: data
  })
}
