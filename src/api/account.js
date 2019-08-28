import request from '@/utils/request'

export function getSelectUser() {//获取操作人下拉框(账户无分页)
    return request({
      url: '/api/User/GetLoginNameList',
      method: 'post'
    })
}

export function getAccountList(data) {//获取账号列表
    return request({
      url: '/api/User/GetUserList',
      method: 'post',
      data
    })
}
export function getAccountDetail(data) {//获取账号详情
    return request({
      url: `/api/User/GetUserModel?userId=${data}`,
      method: 'post',
      data
    })
}
export function deitAccount(data) {//编辑
  return request({
    url: `/api/User/EditUserRoleName`,
    method: 'post',
    data
  })
}
export function numGetAccount(data) {//通过人员编号获取该用户信息
  return request({
    url: `/api/Employee/GetObjByEmpNo?empNo=${data}`,
    method: 'post',
  })
}
export function addAccount(data) {//新增
  return request({
    url: '/api/User/InsertUser',
    method: 'post',
    data
  })
}
export function cancelAccount(data) {//注销
  return request({
    url: `/api/User/Cancel?userId=${data}`,
    method: 'post',
  })
}
export function resetPwd(data) {//重置密码
  return request({
    url: `/api/User/ResetPwd`,
    method: 'post',
    data
  })
}
export function exportExcel(data) {//导出
  return request({
    url: '/api/User/ExcelGetUserList',
    method: 'post',
    data
  })
}
