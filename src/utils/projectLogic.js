/**
 * @param {string} callback 回调方法
 * resData 卡片信息 包含几代卡片，通过为几代卡片分别从MOdel里获取卡号
 * resInfo 用户信息
 */
// IC卡读卡
import { GetICReadCardInfo } from "@/api/userSetting"; //IC卡读卡
export function ICReadCardInfo(callback) {
    let res = window.FXYB_WEB_CS_ICCard.ReadCardInfo();
    if (res != undefined && res != "") {
     let rJSON=JSON.parse(res)//处理后的res
      let resData=eval('(' + rJSON.Data + ')')//处理后的Data     
      if (rJSON.Result) {        
        GetICReadCardInfo({ jsonData: rJSON.Data }).then(resInfo => {
            callback(resInfo,resData)
        }).catch(()=>{
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