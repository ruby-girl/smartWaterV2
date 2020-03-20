import { Message } from 'element-ui'
/**
 * @param {string} callback 回调方法
 * resInfo 卡片信息 包含几代卡片，通过为几代卡片分别从MOdel里获取卡号
 */
// IC卡读卡
import { GetICReadCardInfo } from "@/api/userSetting"; //IC卡读卡
import { GetAreaListNotPNode } from "@/api/userArea"; //区域列表
export function ICReadCardInfo(callback, errorCallBack) {
  let res = window.FXYB_WEB_CS_ICCard.ReadCardInfo();
  if (res != undefined && res != "") {
    let rJSON = JSON.parse(res)//处理后的res
    // let resData = eval('(' + rJSON.Data + ')')//处理后的Data
    if (rJSON.Result) {
      GetICReadCardInfo({ jsonData: rJSON.Data }).then(resData => {
        let resIcInfo;
        if (resData.data.ProductType == '2') {
          resIcInfo = resData.data.ProductTwoModel
        } else {
          resIcInfo = resData.data.ProductOneModel
        }
        callback(resIcInfo)
      }).catch(resError => {
        if (errorCallBack) {
          errorCallBack(resError)
        }
      })
    } else {
      Message.error({
        message: '读取错误',
        type: 'error',
        duration: 4000
      })
    }
  }
}
//IC写卡 objJson:卡片信息 callback:写卡失败后回调
export function WriteCardInfo(objJson, callback, successCallback) {
  let res = window.FXYB_WEB_CS_ICCard.WriteCardInfo(JSON.stringify(objJson.CardInfo));
  if (res != undefined && res != "") {
    let rJSON = JSON.parse(res)//处理后的res
    // let resData = eval('(' + rJSON.Data + ')')//处理后的Data
    if (rJSON.Result) {
      // Message.success({
      //   message: '写卡成功',
      //   type: 'success',
      //   duration: 4000
      // })
      if (successCallback) {
        successCallback()
      }
    } else {
      Message.error({
        message: '写卡错误！',
        type: 'error',
        duration: 4000
      })
      callback(objJson)
    }
  }
}
/**
 * 用户制卡
 * param customerId 用户ID
 * obj vue 实列
 * waterType 水表类型
 * */
import { GetICWriteCard, RollBackICWriteCard, GetICReplaceWriteCardInfo, RollBacICkReplaceWriteCardInfo } from "@/api/userSetting";
import { promptInfoFun } from "@/utils/index"
export function getMarkCard(param, obj,waterType) {
  try {
    if (FXYB_WEB_CS_ICCard) {
      GetICWriteCard(param).then(res => {//写卡
        if (res.code == 0) {
          let ress = FXYB_WEB_CS_ICCard.WriteCardInfo(JSON.stringify(res.data.CardInfo));
          if (ress != undefined && ress != "") {
            let dataJosn = JSON.parse(ress)//cs 制卡返回数据
            if (dataJosn.Result) {
              if (waterType == 1102) {//区分IC卡 是否跳转至收费界面
                obj.$confirm("制卡成功，是否跳转至现金收费界面？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  iconClass: "el-icon-question questionIcon",
                  customClass: "warningBox deleteBox",
                  showClose: false
                }).then(() => {
                  obj.$router.push({path: "/businessManagement/cashCharge"});
                })
              } else {
                promptInfoFun(obj, 2, '制卡成功');
              }
            } else {
              RollBackICWriteCard({ businessId: res.data.BusinessId }).then(res => { })
              promptInfoFun(obj, 1, dataJosn.ErrMsg);
            }
          } else {
            promptInfoFun(obj, 1, "读取错误!");
          }
        } else {
          promptInfoFun(obj, 1, res.message);
        }
      });
    }
  } catch (e) {
    promptInfoFun(obj, 1, '请在CS端操作');
    return
  }
}
/**
 * 用户补卡
 * param customerId 用户ID
 * isCard 是否已刷卡
 * obj vue 实列
 * */
export function getPatchCard(param, obj) {
  try {
    if (FXYB_WEB_CS_ICCard) {
      GetICReplaceWriteCardInfo(param).then(res => {//补卡
        if (res.code == 0) {
          let ress = FXYB_WEB_CS_ICCard.WriteCardInfo(JSON.stringify(res.data.CardInfo));
          if (ress != undefined && ress != "") {
            let dataJosn = JSON.parse(ress)//cs 制卡返回数据
            if (dataJosn.Result) {
              promptInfoFun(obj, 2, '补卡成功');
            } else {
              RollBacICkReplaceWriteCardInfo({ businessId: res.data.BusinessId }).then(res => { })
              promptInfoFun(obj, 1, dataJosn.ErrMsg);
            }
          } else {
            promptInfoFun(obj, 1, '读取错误');
          }
        } else {
          promptInfoFun(obj, 1, res.message);
        }
      });
    }
  } catch (e) {
    promptInfoFun(obj, 1, '请在CS端操作');
    return
  }
}

// 获取筛选条件，区域树形 --再次赋值Id,Name 面包屑getText需要用
function mapTree(org) {
  const haveChildren =
    Array.isArray(org.children) && org.children.length > 0;
  if (haveChildren) {
    return {
      //分别将我们查询出来的值做出改变他的key
      label: org.label,
      id: org.Id,
      Id: org.Id,
      Name: org.label,
      //判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
      children: org.children.map(i => mapTree(i))
    };
  } else {
    return {
      label: org.label,
      id: org.Id,
      Id: org.Id,
      Name: org.label
    }
  }
}
export function getOrgTree(callback, id) {
  let orgTreeAll =
  {
    id: '-1',
    label: '全部',
    Id: '-1',
    Name: '全部'
  }
  GetAreaListNotPNode({ pid: id }).then(res => {
    let resResult = res.data
    let orgTree = resResult.map(org => mapTree(org));
    orgTree.unshift(orgTreeAll)
    return callback(orgTree)
  });
}
/*
*val 搜索数据值
*model 对应绑定的属性
* arr   下拉框循环的数组（输入框传“”）
* name  对应的搜索lable
*/
//删除--筛选条件面包屑
export function delTips(val, that, tipsDataCopy, obj) { //{val,this,arr1}=>{绑定的model,父组件this,变化时的数组,搜索传入的对象}
  //学初始化值属性存在
  let initData = that.$options.data();//获取data初始化数据
  that[obj][val] = initData[obj][val];//将初始化数据赋值给这个值
  for (let i = 0; i < tipsDataCopy.length; i++) {
    if (tipsDataCopy[i].model == val) {
      tipsDataCopy.splice(i, 1);
    }
  }
  return tipsDataCopy
}
/*
*val 搜索数据值
*model 对应绑定的属性
* arr   下拉框循环的数组（输入框传“”）
* tipsDataCopy 对应的数组
* that 组件this对象
* name  对应的搜索lable
*/
//获取-筛选条件面包屑
export function getText(val, model, arr, tipsDataCopy, that, name) {
  let obj = {};
  for (let i = 0; i < tipsDataCopy.length; i++) {
    if (tipsDataCopy[i].model == model) {//判断是否有相同的收缩条件
      tipsDataCopy.splice(i, 1);

    }
  }
  if (arr && val == "-1") {
    return false
  } else if (!arr && val == "") {
    return false
  } else {
    obj = that.$refs.searchTips.getArrData(val, model, arr, name);//调用面包屑组件里面的方法
    return obj
  }


}
// 筛选条件面包屑
export function pushItem(tipsDataCopy) {
  let tipsData = [];
  tipsDataCopy.forEach(item => {
    if (item) {
      tipsData.push(item);
    }
  });
  return tipsData
}
//左右布局 面包屑宽度获取 that==this对象
export function getTipsChangeWidth(that) {
  setTimeout(function () {
    that.$refs.searchTips.widthData =
      document.getElementsByClassName("el-main")[0].clientWidth -
      244 +
      "px";
  }, 200);
}

//根据Id 获取偶所的Name用户查询类型 用户编号=1，姓名/简码=2，电话=3，证件号=4，地址=5,水表编号=6 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
export function getName(id) {
  let name = ""
  if (id == 1) {
    name = "用户编号"
  } else if (id == 2) {
    name = "姓名/简码"
  } else if (id == 3) {
    name = "电话"
  } else if (id == 4) {
    name = "证件号"
  } else if (id == 5) {
    name = "地址"
  } else if (id == 6) {
    name = "水表编号"
  }
  return name
}


// 阶梯计数1个月---获取几个月后的日期
export function getTimeOption(time, n) {
  var d = new Date(time);
  d.setMonth((d.getMonth() - 1) + n);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  return year + '-' + month + '-01'
}
// 阶梯计数12个月
export function yearTimeOption(time, n) {
  var d = new Date(time);
  var year = d.getFullYear()
  let arr = []
  arr.push((year + 1) + '-01-01')
  for (let a = 2; a < n + 1; a++) {
    arr.push((year + a) + '-01-01')
  }
  return arr
}
// 阶梯计数3个月
export function threeTimeOption(time) {
  var d = new Date(time);
  var year = d.getFullYear();
  let arr;
  if (d.getMonth() + 1 < 4) {
    arr = [year + '-04-01', year + '-07-01', year + '-10-01', (year + 1) + '-01-01', (year + 1) + '-04-01']
  } else if (d.getMonth() + 1 < 7) {
    arr = [year + '-07-01', year + '-10-01', (year + 1) + '-01-01', (year + 1) + '-04-01', (year + 1) + '-07-01']
  } else if (d.getMonth() + 1 < 10) {
    arr = [year + '-10-01', (year + 1) + '-01-01', (year + 1) + '-04-01', (year + 1) + '-07-01', (year + 1) + '-10-01']
  } else {
    arr = [(year + 1) + '-01-01', (year + 1) + '-04-01', (year + 1) + '-07-01', (year + 1) + '-10-01', (year + 2) + '-01-01']
  }
  return arr
}

export function getFileFun(data, object) {//获取附件信息,data 详情接口返回salist 数据集合 obejec vue对象
  let files = []
  let fileData = data
  let obj = {}
  for (let i = 0; i < fileData.length; i++) {//区分不同文件类型设置不同展示样式
    let thisType;
    const Suffix = fileData[i].FileExtName.split('.')[1]
    if (Suffix === 'docx' || Suffix === 'doc') {
      thisType = 1
    } else if (Suffix === 'xlsx' || Suffix === 'xls') {
      thisType = 2
    } else if (Suffix === 'pdf') {
      thisType = 3
    } else {
      thisType = 0
    }
    obj = {
      id: fileData[i].Id,
      name: fileData[i].FileName,
      type: thisType,
      url: object.baseUrl + (fileData[i].RelativePath).replace("~", ""),
    }
    files.push(obj)
  }
  return files
}
// 表格无数据，禁止导出
export function isExport(data) {
  if (data.length < 1) {
    Message({
      message: '当前列表无数据，不可导出！',
      type: 'warning',
      duration: 3500
    })
    return false
  }
  return true
}

import { GetProcessConfig } from "@/api/operationFlow"
export function getOpenFlag(code) {//获取是否开启审核权限,code 为权限栏目ID 参照流程设置左侧tree
  let codeNum = new Promise(function (resolve, reject) {        //做一些异步操作
    GetProcessConfig({ code: code }).then((res) => {
      if (res.code == 0) {
        resolve(res.data.ProcessState)
      }
    })
  });
  return codeNum.then(function (value) { return value })
}
/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

//格式化日期：yyyy-MM-dd
function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);
}

//获得某月的天数
function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

//获得本月的开始日期
export function getMonthStartDate() {
  var monthStartDate = new Date(nowYear, nowMonth, 1);
  return formatDate(monthStartDate);
}

//获得本月的结束日期
export function getMonthEndDate() {
  var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
  return formatDate(monthEndDate);
}

//报表统计获取下拉框的lable
export function getLabelName(id, list) {
  let label = ""
  if (list) {
    list.forEach(val => {
      if (val.Id == id) {
        label = val.Name
      }
    })
  }
  return label
}
//删除时间 tooltip
export function closeDelTip() {
  setTimeout(() => {
    let tag = document.getElementsByClassName("el-tooltip__popper")
    for (let i = 0; i < tag.length; i++) {
      tag[i].style.display = "none"
    }
  }, 50)
}


