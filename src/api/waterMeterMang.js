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
export function editICWater(data) {//ic表历史
  return request({
    url: "/WaterMeter/WaterMeter2UpDate",
    method: 'post',
    data
  })
}
///WaterMeter/WaterMeter2UpDate
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
export function readYCWaterinfo(data) {//抄表
  return request({
    url: "/WaterMeter/MeterReading3",
    method: 'post',
    data
  })
}
export function lockYCChange(data) {//远传表阀门锁定开关
  return request({
    url: "/WaterMeter/LockSwitchingValve3?isOpen=" + data.isOpen,
    method: 'post',
    data: data.waterMeterId
  })
}
export function unLockYCChange(data) {//解锁
  return request({
    url: "/WaterMeter/Unlock3",
    method: 'post',
    data
  })
}
export function GetCommandRecord(data) {//获取指令记录
  return request({
    url: "/WaterMeter/GetCommandRecord",
    method: 'GET',
    params: data

  })
}
export function getWaterDevice() {//获取设备信息
  return request({
    url: "/WaterMeter/Device3",
    method: 'post',

  })
}

export function DeleteMeterReading(data) {//删除抄表记录
  return request({
    url: "/WaterMeter/DeleteMeterReading3ById",
    method: 'GET',
    params: data
  })
}


//物联网

export function getWLWWaterInfo(data) {//查询
  return request({
    url: "/WaterMeter/SelectWaterMeter45DataList",
    method: 'post',
    data
  })
}
export function excelWLWWaterInfo(data) {//导出
  return request({
    url: "/WaterMeter/SelectWaterMeter45DataListToExcel",
    method: 'post',
    data
  })
}
export function GetMeter4ErrorTypeNum(data) {//异常统计
  return request({
    url: "/WaterMeter/GetMeter45ErrorTypeNum",
    method: 'GET',
    params: data
  })
}
export function searABHisWater(data) {//ab历史
  return request({
    url: "/WaterMeter/GetMeter4ABReportedDetail",
    method: 'POST',
    data
  })
}
export function searCYHisWater(data) {//C(预付费)历史
  return request({
    url: "/WaterMeter/GetMeter5CYFReportedDetail",
    method: 'POST',
    data
  })
}
export function searCHHisWater(data) {//C(后付费)历史
  return request({
    url: "/WaterMeter/GetMeter5CHFReportedDetail",
    method: 'POST',
    data
  })
}
export function ValveLockOpen(data) {//锁定开
  return request({
    url: "/WaterMeter/ValveLockOpen",
    method: 'POST',
    params: data
  })
}
export function ValveLockClose(data) {//锁定关
  return request({
    url: "/WaterMeter/ValveLockClose",
    method: 'POST',
    params: data
  })
}
export function ValveUnLock(data) {//解锁
  return request({
    url: "/WaterMeter/ValveUnLock",
    method: 'POST',
    params: data
  })
}
export function EditWlWInfo(data) {//编辑
  return request({
    url: "/WaterMeter/EditWLWABWaterInfo",
    method: 'POST',
    data
  })
}

//------------------------------------水表升级-----------------------------------------------
//WaterMeterUpgrade/SelectMeter1ThisLadderWaterYield
export function getWaterTotalNum(data) {//总用水量详情获取
  return request({
    url: "/WaterMeterUpgrade/SelectMeter1ThisLadderWaterYield",
    method: 'POST',
    params: data
  })
}
export function getYCWaterInfo(data) {//根据远传表编号  获取水表信息
  return request({
    url: "/Customer/GetYCWaterMeterByWaterMeterNo",
    method: 'GET',
    params: data
  })
}
export function getWLWaterInfo(data) {//根据物联网编号  获取水表信息
  return request({
    url: "/Customer/GetWLWWaterMeterABCByWaterMeterNo",
    method: 'GET',
    params: data
  })
}
export function UpgradeInfo(data) {//升级
  return request({
    url: "/WaterMeterUpgrade/SubmitUpgradeInfo?balance=" + data.balance,
    method: 'POST',
    data: data.UpgradeWaterNeedInfo
    
  })
}
export function getUpgradeRecordList(data) {//获取升级记录
  return request({
    url: "/WaterMeterUpgrade/SelectUpgradeRecordList",
    method: 'POST',
    data: data
  })
}
export function ExcelUpgradeRecordList(data) {//导出升级记录
  return request({
    url: "/WaterMeterUpgrade/UpgradeRecordList_OutExcel",
    method: 'POST',
    data
  })
}
export function checkResidueMon(data) {//检查是否欠费
  return request({
    url: "/WaterMeterUpgrade/CheckCustomerResidueMoney",
    method: 'POST',
    params: data
  })
}
//
export function checkMeterRecord(data) {//检查是否存在未抄表
  return request({
    url: "/WaterMeterUpgrade/CheckMeterRecord",
    method: 'POST',
    params: data
  })
}
export function checkWaterMOney(data) {//检查ic卡输入的表端余额是否合理
  return request({
    url: "/WaterMeterUpgrade/CheckMeter2ResidueMoney",
    method: 'POST',
    params: data
  })
}
// --------------------水表换表-----------------------------------
export function OldChangeNew(data) {// 机械表、远传、物联以旧换新
  return request({
    url: "/WaterMeter/OldChangeNew",
    method: 'POST',
    data: data
  })
}
export function GetICK_OldChangeNew(data) {// IC以旧换新
  return request({
    url: "/WaterMeter/GetICK_OldChangeNew",
    method: 'GET',
    params: data
  })
}

export function Exchange(data) {// 用户互换（支持远传、物联）
  return request({
    url: "/WaterMeter/Exchange",
    method: 'POST',
    params: data
  })
}
export function WaterMeterChangeList(data) {// 查询换表记录
  return request({
    url: "/WaterMeter/WaterMeterChangeList",
    method: 'POST',
    data: data
  })
}

export function AccountCanCellationList_Execl(data) {// 导出
  return request({
    url: "/WaterMeter/AccountCanCellationList_Execl",
    method: 'POST',
    data: data
  })
}