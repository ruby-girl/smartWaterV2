import request from '@/utils/request'

export function searJXMeterWater(data) {//机械表查询
  return request({
    url: "/WaterMeter/GetWaterMeter1List",
    method: 'post',
    data
  })
}
export function excelJXMeterWater(data) {//机械表导出
  return request({
    url: "/WaterMeter/GetWaterMeter1List_Execl",
    method: 'post',
    data
  })
}
export function searJXHisWater(data) {//机械表历史
  return request({
    url: "/WaterMeter/GetWaterMeter1MeterReadList",
    method: 'post',
    data
  })
}
export function editJXHisWater(data) {//获取机械编辑信息
  return request({
    url: "/WaterMeter/GetWaterMeter1BlById",
    method: 'post',
    data
  })
}
export function saveJXHisWater(data) {//编辑机械编辑信息
  return request({
    url: "/WaterMeter/WaterMeter1UpDate",
    method: 'post',
    data
  })
}
export function searICMeterWater(data) {//ic表查询
  return request({
    url: "/WaterMeter/GetWaterMeter2List",
    method: 'post',
    data
  })
}
export function excelICMeterWater(data) {//ic表导出
  return request({
    url: "/WaterMeter/GetWaterMeter2List_Execl",
    method: 'post',
    data
  })
}
export function searICHisWater(data) {//ic表历史
  return request({
    url: "/WaterMeter/GetWaterMeter2MeterReadList",
    method: 'post',
    data
  })
}
export function searYCMeterWater(data) {//远传表查询
  return request({
    url: "/WaterMeter/SelectWaterMeter3DataList",
    method: 'post',
    data
  })
}
export function exportYCWaterINfo(data) {//远传表导出
  return request({
    url: "/WaterMeter/SelectWaterMeter3DataListToExcel",
    method: 'post',
    data
  })
}
export function searYCHisWater(data) {//远传表历史
  return request({
    url: "/WaterMeter/MeterReading3Detail",
    method: 'post',
    data
  })
}
export function readYCWaterinfo (data) {//抄表
  return request({
    url: "/WaterMeter/MeterReading3",
    method: 'post',
    data
  })
}
export function lockYCChange (data) {//远传表阀门锁定开关
  return request({
    url: "/WaterMeter/LockSwitchingValve3?isOpen="+data.isOpen,
    method: 'post',
    data:data.waterMeterId
  })
}
export function  unLockYCChange(data) {//解锁
  return request({
    url: "/WaterMeter/Unlock3",
    method: 'post',
    data
  })
}
export function  DeleteMeterReading(data) {//删除抄表记录
  return request({
    url: "/WaterMeter/DeleteMeterReading3ById",
    method: 'GET',
    params:data
  })
}


//物联网

export function  getWLWWaterInfo(data) {//查询
  return request({
    url: "/WaterMeter/SelectWaterMeter4DataList",
    method: 'post',
    data
  })
}
export function  excelWLWWaterInfo(data) {//导出
  return request({
    url: "/WaterMeter/SelectWaterMeter4DataListToExcel",
    method: 'post',
    data
  })
}
export function  GetMeter4ErrorTypeNum(data) {//异常统计
  return request({
    url: "/WaterMeter/GetMeter4ErrorTypeNum",
    method: 'GET',
    params:data
  })
}
export function  searWLWHisWater(data) {//历史
  return request({
    url: "/WaterMeter/GetMeter4ReportedDetail",
    method: 'POST',
    data
  })
}
export function  ValveLockOpen(data) {//锁定开
  return request({
    url: "/WaterMeter/ValveLockOpen",
    method: 'POST',
    params:data
  })
}
export function  ValveLockClose(data) {//锁定关
  return request({
    url: "/WaterMeter/ValveLockClose",
    method: 'POST',
    params:data
  })
}
export function  ValveUnLock(data) {//解锁
  return request({
    url: "/WaterMeter/ValveUnLock",
    method: 'POST',
    params:data
  })
}


