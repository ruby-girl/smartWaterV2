/**
 * @param {string} callback 回调方法
 * resData 卡片信息 包含几代卡片，通过为几代卡片分别从MOdel里获取卡号
 * resInfo 用户信息
 */
// IC卡读卡
import { GetICReadCardInfo } from "@/api/userSetting"; //IC卡读卡
import { GetAreaListNotPNode } from "@/api/userArea"; //区域列表
export function ICReadCardInfo(callback) {
  let res = window.FXYB_WEB_CS_ICCard.ReadCardInfo();
  if (res != undefined && res != "") {
    let rJSON = JSON.parse(res)//处理后的res
    let resData = eval('(' + rJSON.Data + ')')//处理后的Data     
    if (rJSON.Result) {
      GetICReadCardInfo({ jsonData: rJSON.Data }).then(resInfo => {
        callback(resInfo, resData)
      }).catch(() => {
        console.info('123')
        callback(resData)
      }
      );
    } else {
      this.$message({
        message: "读取错误！",
        type: "error",
        duration: 4000
      });
    }
  }
}

// 获取筛选条件，区域树形
function mapTree(org) {
  const haveChildren =
    Array.isArray(org.children) && org.children.length > 0;
  if (haveChildren) {
    return {
      //分别将我们查询出来的值做出改变他的key
      label: org.label,
      id: org.Id,
      //判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
      children: org.children.map(i => mapTree(i))
    };
  } else {
    return {
      label: org.label,
      id: org.Id
    }
  }
}
export function getOrgTree(callback,id) {
  let orgTreeAll = 
    {
      id: '-1',
      label: '全部'
    }
  GetAreaListNotPNode({pid:id}).then(res => {
    let resResult =res.data
    // orgTree[0].id = resResult[0].Id
    // orgTree[0].label = resResult[0].label
     let orgTree= resResult.map(org => mapTree(org));
     orgTree.unshift(orgTreeAll)
    //  console.log(orgTree)
    //  orgTreeAll.push(orgTree)
    return callback(orgTree)
  });
}