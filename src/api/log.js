import request from '@/utils/request'
//日志管理  


//获取模块
export function getBoxList(data) {
  return request({
    url: '/Dictionary/GetBLogComboBoxList',
    method: 'get',
    params: data
  })
}

export function getLogList(data) {
  return request({
    url: '/BLog/GetList',
    method: 'post',
    data: data
  })
}
