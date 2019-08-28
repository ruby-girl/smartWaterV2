import request from '@/utils/request'

export function FileUpload(data) {//获取所有角色-下拉框
  return request({
    url: '/api/Files/Upload',
    method: 'post',
    data:data
  })
}


export function FileDelete(data) {
  return request({
    url: '/api/Files/Delete',
    method: 'post',
    params: data
  })
}


export function getFile(data) {
  return request({
    url: '/api/Files/Delete',
    method: 'post',
    data: data
  })
}

export function DeleteList(data) {
  return request({
    url: '/api/Files/DeleteList',
    method: 'post',
    data: data
  })
}
