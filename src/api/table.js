import request from '@/utils/request'

export function GetTable(data) {//通过ID 获取表格样式
  return request({
    url: '/TableStyle/GetTable',
    method: 'post',
    params: data
  })
}

export function AddTableStyle(data) {//设置表格样式
  return request({
    url: '/TableStyle/AddTableStyle',
    method: 'post',
    data: data
  })
}
