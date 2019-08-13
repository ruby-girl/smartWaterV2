import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {//获取所有角色-下拉框
  return request({
    url: '/Role/GetRoleNameList',
    method: 'post'
  })
}

export function getRolesList(data) {//查询角色表格
  return request({
    url: '/Role/GetRoleList',
    method: 'post',
    data
  })
}

export function addRole(name) {//添加
  return request({
    url: `/Role/InsertRoleName?roleName=${name}`,
    method: 'post',
  })
}

export function updateRole(name,id) {//编辑
  return request({
    url: `/Role/EditRoleName?roleName=${name}&roleId=${id}`,
    method: 'post',
  })
}

export function deleteRole(id) {//删除
  return request({
    url: `/Role/DeleteRoleName?roleId=${id}`,
    method: 'post'
  })
}

export function exportExcel(data) {//导出
  return request({
    url: '/Role/ExcelGetRoleList',
    method: 'post',
    data
  })
}