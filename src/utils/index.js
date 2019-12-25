/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
/**
 * @param {object} res
 * @returns {object}
 */
// 阶梯转换 后端返回的对象，将5个阶梯转换为数组
export function ladderChangeArr(res) {
  const actions = {
    "0": ["OneLadderWaterNum", "OneLadderPrice", "OneTotalPrice"],
    "1": ["TwoLadderWaterNum", "TwoLadderPrice", "TwoTotalPrice"],
    "2": ["ThreeLadderWaterNum", "ThreeLadderPrice", "ThreeTotalPrice"],
    "3": ["FourLadderWaterNum", "FourLadderPrice", "FourTotalPrice"],
    "4": ["FiveLadderWaterNum", "FiveLadderPrice", "FiveTotalPrice"]
  };
  let ladder = {
    ladder: [
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 }
    ]
  }
  // 对象中 ladder就是阶梯值-可用来做循环
  let details = { ...res, ...ladder };
  details.ladder.map(function (item, i) {
    details.ladder[i].LadderWaterNum = details[actions[i][0]];
    details.ladder[i].LadderPrice = details[actions[i][1]];
    details.ladder[i].TotalPrice = details[actions[i][2]];
  });
  return details
}
/**
 * @param {object} details
 * @returns {object}
 */
// 阶梯转换->数组中的值-赋值给需要传给后端的对象
export function ladderChangeObj(details) {
  const actions = {
    "0": ["OneLadderWaterNum", "OneLadderPrice", "OneTotalPrice"],
    "1": ["TwoLadderWaterNum", "TwoLadderPrice", "TwoTotalPrice"],
    "2": ["ThreeLadderWaterNum", "ThreeLadderPrice", "ThreeTotalPrice"],
    "3": ["FourLadderWaterNum", "FourLadderPrice", "FourTotalPrice"],
    "4": ["FiveLadderWaterNum", "FiveLadderPrice", "FiveTotalPrice"]
  };

  details.ladder.map(function (item, i) {
    details[actions[i][0]] = item.LadderWaterNum
    details[actions[i][1]] = item.LadderPrice
    details[actions[i][2]] = item.TotalPrice
  })
  return details
}



// 阶梯转换 后端返回的对象，将5个阶梯转换为数组(单价水量水费)
export function ladderChangeArrs(res) {
  const actions = {
    "0": [ "OneLadderPrice", "WaterYield1","TotalPrice1"],
    "1": [ "TwoLadderPrice", "WaterYield2","TotalPrice2"],
    "2": [ "ThreeLadderPrice", "WaterYield3","TotalPrice3"],
    "3": [ "FourLadderPrice", "WaterYield4","TotalPrice4"],
    "4": [ "FiveLadderPrice", "WaterYield5","TotalPrice5"]
  };
  let ladder = {
    ladder: [
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
      { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 }
    ]
  }
  // 对象中 ladder就是阶梯值-可用来做循环
  let details = { ...res, ...ladder };
  details.ladder.map(function (item, i) {
    details.ladder[i].LadderWaterNum = details[actions[i][1]];//水量
    details.ladder[i].LadderPrice = details[actions[i][0]];//单价
    details.ladder[i].TotalPrice = details[actions[i][2]];//水费
  });
  return details
}

export function parseTimeFiveEight(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: 23,
    i: 59,
    s: 59
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 当前时间
export function parseStartTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 *
 * @param {String} time 时间
 * @param {String} day 起始日
 * @param {String} cFormat 格式
 */
// 开始时间 00：00：00填充 day:日
export function parseStartTimeFunc(time,day,cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: day?day:date.getDate(),
    h: 0,
    i: 0,
    s: 0,
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 结束 23：59：59填充
export function parseEndTimeFunc(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: 23,
    i: 59,
    s: 59,
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
export function updateMoney(value) {
  value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
  if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    value = value.slice(0, 8)
    value = parseFloat(value);
  } else if (value.indexOf(".") > 0 && value != "") {
    var attr = value.split(".")
    if (attr[0].length > 8) {
      var last = attr[0].slice(0, 8)
      var n = attr[1].slice(0, 2)
      console.log('n--' + n)
      value = last + '.' + n
    }
  }
  return value
}
//补齐 保留2位小数
export function changeTwoDecimal(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}
// 不补齐，删除最后的小数点
export function delDecimal(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  return s_x;
}
/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * Prompt information
 * @params obj vue对象
 * @params type 1警告 2成功
 * @params msg 提示信息
 * */
export function promptInfoFun(obj, type, msg) {
  let types = ''
  type == 1 ? types = 'warning' : types = 'success'
  obj.$message({
    message: msg,
    type: types,
    duration: 4000
  });
}
/**
 *判断是否合法的时间
 * @param {String} time_str
 * @returns {String}
 * */
export function legalTime(time_str) {
  if (!time_str) return ''
  let timeYear = new Date(time_str).getFullYear()
  if (timeYear == 1970) return ''
  var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  var r = time_str.match(reg);
  if (r == null)
    return ''
  else
    return time_str
}


/**
 * scroNum 数字滚动方法
 //* @param scroID 选择器名字
 //* @param number 数字大小
 //* @param h 单个数字高度
 * return null
 */
export function scroNum(scroID, number ,h = 32) {//数字滚动
  let $num_item = document.getElementById(scroID).querySelectorAll('.dataOne>div')
  $num_item.forEach((item,i)=>{
    item.style.top = 0 + 'px'//清空上次top值再计算本次top值
  })

  $num_item.forEach(item=>{
    item.style.transition = 'all 1s ease-in-out'
  })

  let numberStr = number.toString();
  if (numberStr.length <= $num_item.length - 1) {
    let tempStr = "";
    for (let a = 0; a < $num_item.length - numberStr.length; a++) {
      tempStr += "0";
    }
    numberStr = tempStr + numberStr;
  }
  let numberArr = numberStr.split("");
  $num_item.forEach((item,i)=>{
    setTimeout(function () {
      item.style.top = - parseInt(numberArr[i]) * h - h * 10 + 'px'
    }, i * 50)
  })

}
/**
 * 数字逐渐增加显示
 * @param scroID 选择器
 * @param maxsNum 数字大小
 * */
export function numRunFun(obj, maxsNum) {
  let num = 0;
  let maxNum = maxsNum;
 // let numId = document.getElementById(scroID);

  // 利用setTimeout模拟Interval
  function numSlideFun(){
    num++; // 调节速度 可以小数
    if(num >= maxNum){
      obj.innerHTML = maxNum;
      return;
    }else{
      obj.innerHTML = ~~(num);
      setTimeout(function(){	// 利用setTimeout模拟setInterval
        return numSlideFun();
      },10);// 也可以调节速度
    }
  }
  numSlideFun();
}
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    /*   "h+": this.getHours(), //小时
       "m+": this.getMinutes(), //分
       "s+": this.getSeconds(), //秒*/
    "h+": 0, //小时
    "m+": 0, //分
    "s+": 0, //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 数组去重
 * */
export function onlyArr(array) {
  var n = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1) n.push(array[i]);
  }
  return n;
}
