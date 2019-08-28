import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Login/Login',
    method: 'post',
    data
  })
}
// 获取配置项
export function getDictionaryItem() {
  return request({
    url: '/api/Dictionary/GetDictionaryListAll',
    method: 'get',
  })
}

//首页
export function GetTodayData() {
  return request({
    url: '/api/FirstPage/GetTodayData',
    method: 'post',
  })
}

export function GetSoftExpirationDate() {
  return request({
    url: '/api/FirstPage/GetSoftExpirationDate',
    method: 'post',
  })
}

export function GetNearly5DaysData() {
  return request({
    url: '/api/FirstPage/GetNearly5DaysData',
    method: 'post',
  })
}

export function GetFirstPageRoleInfo() {
  return request({
    url: '/api/FirstPage/GetFirstPageRoleInfo',
    method: 'post',
  })
}
