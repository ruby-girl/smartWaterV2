import request from '@/utils/request'

/**
 * 部门接口
 * */
export function GetList(data) {
  return request({
    url: '/Department/GetList',
    method: 'post',
    data: data
  })
}

export function Add(data) {
  return request({
    url: '/Department/Add',
    method: 'post',
    data: data
  })
}

export function UpDate(data) {
  return request({
    url: '/Department/UpDate',
    method: 'post',
    data: data
  })
}

export function Delete(data) {
  return request({
    url: '/Department/Delete',
    method: 'post',
    data: data
  })
}

export function ComboBoxList(data) {
  return request({
    url: '/Department/ComboBoxList',
    method: 'post',
    data: data
  })
}

export function GetList_Execl(data) {
  return request({
    url: '/Department/GetList_Execl',
    method: 'post',
    data: data
  })
}

/*部门编辑*/
export function GetEditObjById(data) {
  return request({
    url: '/Department/GetEditObjById',
    method: 'post',
    params: data
  })
}

/**
 * 岗位接口
 * */
export function GetListPost(data) {
  return request({
    url: '/Job/GetList',
    method: 'post',
    data: data
  })
}

export function AddPost(data) {
  return request({
    url: '/Job/Add',
    method: 'post',
    data: data
  })
}

export function UpDatePost(data) {
  return request({
    url: '/Job/UpDate',
    method: 'post',
    data: data
  })
}

export function DeletePost(data) {
  return request({
    url: '/Job/Delete',
    method: 'post',
    data: data
  })
}

export function linkComboBoxList(data) {
  return request({
    url: '/Job/ComboBoxList',
    method: 'post',
    params: data
  })
}

export function JobGetList_Execl(data) {
  return request({
    url: '/Job/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 *人员管理
 **/
export function peopleDelete(data) {
  return request({
    url: '/Employee/Delete',
    method: 'post',
    params: data
  })
}

export function peopleUpDate(data) {
  return request({
    url: '/Employee/UpDate',
    method: 'post',
    data: data
  })
}

export function peopleGetList(data) {
  return request({
    url: '/Employee/GetList',
    method: 'post',
    data: data
  })
}

export function peopleAdd(data) {
  return request({
    url: '/Employee/Add',
    method: 'post',
    data: data
  })
}

export function Employee_Execl(data) {
  return request({
    url: '/Employee/GetList_Execl',
    method: 'post',
    data: data
  })
}

export function MeterReaderList(data) {
  return request({
    url: '/Employee/MeterReaderList',
    method: 'post',
    params: data
  })
}

/**
 * 获取操作员信息
 * */
export function GetRoleNameList(data) {
  return request({
    url: '/User/GetLoginNameList',
    method: 'post',
    params: data
  })
}

/**
 * 获取操人员详情
 * */
export function GetBlObjById(data) {
  return request({
    url: '/Employee/GetBlObjById',
    method: 'post',
    params: data
  })
}

// 水厂管理API-----start
export function waterFactoryGetList(data) {
  return request({
    url: '/SA_WaterFactory/GetList',
    method: 'post',
    data: data
  })
}


// 编辑水厂
export function waterFactoryUpDate(data) {
  return request({
    url: '/SA_WaterFactory/UpDate',
    method: 'post',
    data: data
  })
}

// 新增水厂
export function waterFactoryAdd(data) {
  return request({
    url: '/SA_WaterFactory/Add',
    method: 'post',
    data: data
  })
}

// 删除水厂
export function waterFactoryDelete(data) {
  return request({
    url: '/SA_WaterFactory/Delete',
    method: 'post',
    data: data
  })
}

// 导出水厂
export function waterFactoryExcel(data) {
  return request({
    url: '/SA_WaterFactory/GetList_Execl',
    method: 'post',
    data: data
  })
}

//获得水厂下拉数据
export function WaterFactoryComboBoxList(data) {
  return request({
    url: 'SA_WaterFactory/ComboBoxList',
    method: 'post',
    data: data
  })
}
//获得具有权限水厂下拉数据
export function WaterFactoryComboBoxListAuth(data) {
  return request({
    url: 'SA_WaterFactory/ComboBoxListAuth',
    method: 'post',
    data: data
  })
}
// 水厂管理API-----end

// 添加片区
export function BlockAreaAdd(data) {
  return request({
    url: '/SA_BlockArea/Add',
    method: 'post',
    data: data
  })
}

// 修改片区
export function BlockAreaUpDate(data) {
  return request({
    url: '/SA_BlockArea/UpDate',
    method: 'post',
    data: data
  })
}

// 删除片区
export function BlockAreaDelete(data) {
  return request({
    url: '/SA_BlockArea/Delete',
    method: 'post',
    data: data
  })
}

// 获取片区下拉数据
export function BlockAreaComboBoxList(data) {
  return request({
    url: '/SA_BlockArea/ComboBoxList',
    method: 'post',
    data: data
  })
}

// 片区分页查询
export function BlockAreaGetList(data) {
  return request({
    url: '/SA_BlockArea/GetList',
    method: 'post',
    data: data
  })
}

//片区导出
export function BlockAreaExecl(data) {
  return request({
    url: '/SA_BlockArea/GetList_Execl',
    method: 'post',
    data: data
  })
}

//通过id获取当前片区信息
export function BlockAreaGetObjById(data) {
  return request({
    url: '/SA_BlockArea/GetObjById/'+data.Id,
    method: 'post',
  })
}

//用户设置低保户申请
export function InsuredMessageApply(data) {
  return request({
    url: '/Customer/InsuredMessageApply',
    method: 'post',
    data: data
  })
}
