import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login/Login',
    method: 'post',
    data
  })
}
// 获取配置项
export function getDictionaryItem() {
  return request({
    url: '/Dictionary/GetDictionaryListAll',
    method: 'get',
  })
}

//首页
export function GetTodayData() {
  return request({
    url: '/FirstPage/GetTodayData',
    method: 'post',
  })
}

export function GetSoftExpirationDate() {
  return request({
    url: '/FirstPage/GetSoftExpirationDate',
    method: 'post',
  })
}

export function GetNearly5DaysData() {
  return request({
    url: '/FirstPage/GetNearly5DaysData',
    method: 'post',
  })
}

export function GetFirstPageRoleInfo() {
  return request({
    url: '/FirstPage/GetFirstPageRoleInfo',
    method: 'post',
  })
}
