import request from '@/utils/request'

export function GetTable(data) {//通过ID 获取表格样式
  return request({
    url: '/api/TableStyle/GetTable',
    method: 'post',
    params: data
  })
}

export function AddTableStyle(data) {//设置表格样式
  return request({
    url: '/api/TableStyle/AddTableStyle',
    method: 'post',
    data: data
  })
}

export function InitTableStyle(data) {//默认样式
  return request({
    url: '/api/TableStyle/InitTableStyle',
    method: 'post',
    data: data
  })
}


