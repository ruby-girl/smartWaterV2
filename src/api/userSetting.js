import request from '@/utils/request'

/**
 * 用户设置接口
 * */
export function GetList(data) {
  return request({
    url: '/Department/GetList',
    method: 'post',
    data: data
  })
}
