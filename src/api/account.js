import request from '@/utils/request'

export function getSelectUser() {//获取操作人下拉框(账户无分页)
    return request({
      url: '/User/GetLoginNameList',
      method: 'post'
    })
}

export function getAccountList(data) {//获取账号列表
    return request({
      url: '/User/GetUserList',
      method: 'post',
      data
    })
}
export function getAccountDetail(data) {//获取账号详情
    return request({
      url: `/User/GetUserModel?userId=${data}`,
      method: 'post',
      data
    })
}
export function deitAccount(data) {//编辑
  return request({
    url: `/User/EditUserRoleName`,
    method: 'post',
    data
  })
}
export function numGetAccount(data) {//通过人员编号获取该用户信息
  return request({
    url: `/Employee/GetObjByEmpNo?empNo=${data}`,
    method: 'post',
  })
}
export function addAccount(data) {//新增
  return request({
    url: '/User/InsertUser',
    method: 'post',
    data
  })
}
export function cancelAccount(data) {//注销
  return request({
    url: `/User/Cancel?userId=${data}`,
    method: 'post',
  })
}
export function resetPwd(data) {//重置密码
  return request({
    url: `/User/ResetPwd`,
    method: 'post',
    data
  })
}
export function exportExcel(data) {//导出
  return request({
    url: '/User/ExcelGetUserList',
    method: 'post',
    data
  })
}