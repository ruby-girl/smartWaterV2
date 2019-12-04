<template>
  <div class="left_box">
    <h3>水表升级</h3>
    <div class="user_info">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <h4>原水表信息</h4>
        <el-button type="success" size="mini" class="redingK" @click="handleFilterIC">
          <i class="iconfont icontianjia"></i>读卡
        </el-button>
      </div>
      <el-form ref="userInfo" :model="userInfo" label-width="70px">
        <el-form-item label="用户编号">
          <el-input
            v-model="userInfo.CustomerNo"
            @keydown.enter.native="searchEnter(1,userInfo.CustomerNo)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            v-model="userInfo.CustomerName"
            @keydown.enter.native="searchEnter(2,userInfo.CustomerName)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="原水表编号">
          <el-input v-model="userInfo.SA_WaterMeterNo" class="left-input" disabled></el-input>
        </el-form-item>
        <el-form-item label="原水表类型">
          <el-input v-model="userInfo.WaterMeterTypeName" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item v-show="showInfo&&waterInfo.WaterMeterTypeName=='IC卡表水表'" label="表端余额">
          <el-input class="totalMoney left-input" v-model="userInfo.Balance" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" class="thisLable">
          <u class="thisJD" @click="thisTotalWater">当前阶梯总用水量</u>
          <el-input v-model="userInfo.Address" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" label="账户余额">
          <el-input class="totalMoney left-input" v-model="userInfo.Balance" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" label="用水性质">
          <el-input v-model="userInfo.UseWaterTypeName" class="left-input"></el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" label="地址">
          <el-input v-model="userInfo.AreaName" disabled class="left-input"></el-input>
        </el-form-item>
      </el-form>
      <p class="showInfo" :class="{tro:showInfo}">
        <i class="icon iconfont iconjianqu3" @click="showInfo=!showInfo"></i>
      </p>
    </div>
    <div class="waterInfo">
      <h4>升级后水表信息</h4>
      <el-form ref="waterInfo" :model="userInfo" label-width="70px">
        <el-form-item label="水表类型">
          <el-select v-model="UpgradeWaterNeedInfo.WaterType" placeholder="请选择" class="left-input">
            <el-option label="IC卡水表" value="1102" />
            <el-option label="远传水表" value="1103" />
            <el-option label="物联网水表" value="1104" />
          </el-select>
        </el-form-item>
        <div v-if="UpgradeWaterNeedInfo.WaterType=='1102'">
          <el-form-item label="新水表编号">
            <el-input v-model="UpgradeWaterNeedInfo.WaterMeterNo" class="left-input"></el-input>
          </el-form-item>
          <el-form-item label="报警金额">
            <el-input v-model="UpgradeWaterNeedInfo.meter2Param.AlarmMoney" class="left-input"></el-input>
          </el-form-item>
          <el-form-item label="水表样式">
            <el-select
              v-model="UpgradeWaterNeedInfo.meter2Param.MeterStyle"
              placeholder="请选择"
              class="left-input"
            >
              <el-option v-for="item in waterStyleList" :label="item.name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item label="水表口径">
            <el-select
              v-model="UpgradeWaterNeedInfo.meter2Param.MeterDiameter"
              placeholder="请选择"
              class="left-input"
            >
              <el-option v-for="item in waerMeterDirSize" :label="item.name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item label="表端余额">
            <el-input class="totalMoney left-input" v-model="waterInfo.MeterBalance" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input class="totalMoney left-input" disabled v-model="waterInfo.MeterBalance">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="UpgradeWaterNeedInfo.WaterType=='1103'">
          <el-form-item label="新水表编号">
            <el-input v-model="UpgradeWaterNeedInfo.WaterMeterNo" class="left-input"></el-input>
          </el-form-item>
          <el-form-item label="集中器号">
            <el-input v-model="UpgradeWaterNeedInfo.meter3Param.ConcentratorNo" class="left-input"></el-input>
          </el-form-item>
          <el-form-item label="采集器号">
            <el-input v-model="UpgradeWaterNeedInfo.meter3Param.CollectorNo" class="left-input"></el-input>
          </el-form-item>
          <el-form-item label="水表口径">
            <el-select
              v-model="UpgradeWaterNeedInfo.meter3Param.MeterDiameter"
              placeholder="请选择"
              class="left-input"
            >
              <el-option v-for="item in waerMeterDirSize" :label="item.name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input class="totalMoney left-input" disabled v-model="waterInfo.MeterBalance">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="UpgradeWaterNeedInfo.WaterType=='1104'">
          <el-form-item label="新水表编号">
            <el-input v-model="UpgradeWaterNeedInfo.WaterMeterNo" disabled class="left-input"></el-input>
          </el-form-item>
          <el-form-item label="报警量">
            <el-input
              v-model="UpgradeWaterNeedInfo.meter4Param.WaterAmountAlarm"
              disabled
              class="left-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="透支量">
            <el-input
              v-model="UpgradeWaterNeedInfo.meter4Param.WaterAmountOverdraft"
              disabled
              class="left-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="表端余额：">
            <el-input class="totalMoney left-input" v-model="waterInfo.MeterBalance">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="IMSI">
            <el-input v-model="UpgradeWaterNeedInfo.meter4Param.IMSI" disabled class="left-input"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <p class="userBtn">
      <el-button size="small" type="primary" @click>确认升级</el-button>
    </p>
    <select-user :selectUserShow="selectUserShow" :headQuery="params" @handleFilter="handleFilter" />
    <water-numDetail ref="numDetaile" />
  </div>
</template>
<script>
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import { getWaterInfo, waterAccount } from "@/api/userAccount"; //水表信息
import SelectUser from "@/components/SelectUser/index"; //水表信息
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import { getWaterTotalNum } from "@/api/waterMeterMang"; //获取用水量
import WaterNumDetail from "./WaterNumDetail"
import "@/styles/userAccount.scss";
export default {
  name: "Upadate",
  components: { SelectUser,WaterNumDetail },

  data() {
    return {
      userInfo: {
        //用户信息
      },
      waterInfo: {}, //水表信息
      totalMoney: 0,
      selectUserShow: false, //查询多个用户弹窗
      params: {
        //回车查询数据
        page: 1,
        limit: 10,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      userList: [], //回车查询数据列表
      showInfo: false,
      UpgradeWaterNeedInfo: {
        meter2Param: {
          MeterDiameter: "", //水表口径
          MeterStyle: "", //水表样式
          AlarmMoney: "" //报警金额
          // GuaranteedAmount  :"",//保底量
        }, //ic卡
        meter3Param: {
          ConcentratorNo: "", //集中器号
          CollectorNo: "", //采集器编号
          MeterDiameter: "" //水表口径
          // AlarmMoney  :'',//报警金额
          // ConcentratorNo :'',//集中器号
        }, //远传表
        meter4Param: {
          //物联网
          WaterAmountAlarm: "", //报警量
          WaterAmountOverdraft: "", //透支量
          IMSI: "" //IMSI
        },
        WaterMeterId: "", //水表Id
        WaterMeterNo: "", //水表编号
        NewWaterBalance: "", //升级后余额
        WaterType: "1104", //升级后水表类型
        CustomerId: "" //用户ID
      },
      thisWaterMerter: {
        customerId:"",//用户id
        useWaterTypeId:"",

      },
      waerMeterDirSize: [], //水表口径
      waterStyleList: [] //水表样式
    };
  },

  methods: {
    //当前用水量
    thisTotalWater() {
      this.thisWaterMerter.customerId=this.userInfo.Id
      this.thisWaterMerter.useWaterTypeId=this.userInfo.SA_UseWaterType_Id
      // console.log(this.userInfo)
      this.$refs.numDetaile.dialogVisible=true
      // getWaterTotalNum(this.thisWaterMerter).then(res=>{
      //   console.log(res)
      // })
    },
    //回车模糊查询
    searchEnter(num, val) {
      if (val == "") {
        return;
      }
      this.params.CustomerQueryType = num;
      this.params.CustomerQueryValue = val;
      GetCustomerDataList(this.params).then(res => {
        if (res.code == 0) {
          this.userInfo = {};
          this.waterInfo = {};
          if (res.data.length == 0) {
            this.$message({
              message: "该用户不存在",
              type: "warning"
            });
            return false;
          }
          if (res.data.length > 1) {
            this.userList = res.data;
            this.selectUserShow = true;
          } else {
            this.userInfo = res.data[0];
            // this.getWaterMeterInfo(res.data[0].Id);
          }
        }
      });
    },
    //选择用户信息
    handleFilter(val) {
      this.userInfo = val;
      this.getWaterMeterInfo(val.Id);
      this.selectUserShow = false;
    },
    //获取水表信息
    getWaterMeterInfo(id) {
      getWaterInfo({ customerId: id }).then(res => {
        if (res.code == 0) {
          this.waterInfo = res.data;
          this.totalMoney = this.waterInfo.MeterBalance + this.userInfo.Balance;
        } else {
          this.$message({
            type: "warning",
            message: res.msg ? res.msg : "未查询到该用户水表信息"
          });
        }
      });
    },

    //读卡
    handleFilterIC() {
      try {
        // resInfo用户信息  resData卡片信息
        // ICReadCardInfo((resInfo,resData)=>{
        //   console.log('头部咯')
        //   console.log(resData)
        //this.$emit("handleFilterIcParent", resInfo,resData)
        // })
        // 读卡
        ICReadCardInfo(resData => {
          console.log("头部咯");
          console.log(resData);
          this.$emit("handleFilterIcParent", resData);
        });
      } catch (error) {
        console.log("请在CS端操作1");
      }
    }
  },
  created() {
    this.waerMeterDirSize = getDictionaryOption("口径类型");
    this.waterStyleList = getDictionaryOption("水表样式");
  }
};
</script>
<style lang="scss" scoped>
.left_box {
  background: #fff;
  height: 100%;
  padding: 7px 13px;
  .left-input {
    width: 160px !important;
    /deep/ .el-input--medium {
      width: 100% !important;
    }
    /deep/ input.el-input__inner {
      width: 100% !important;
      margin-left: 6px;
    }
  }
  h3 {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 16px;
    color: rgba(119, 119, 119, 1);
    opacity: 1;
  }
  .user_info,
  .waterInfo {
    margin: 10px 0;
    background: rgba(245, 245, 245, 1);
    padding: 13px;
    .thisLable {
      position: relative;
    }
    .thisJD {
      position: absolute;
      left: -56px;
      display: inline-block;
      width: 56px;
      height: 37px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 18px;
      color: rgba(0, 178, 161, 1);
      opacity: 1;
      cursor: pointer;
    }
    .showInfo {
      text-align: center;
      margin: 0;
      padding: 0;
      .icon {
        font-size: 22px;
        color: rgba(0, 178, 161, 1);
        opacity: 1;
        cursor: pointer;
      }
    }
    .tro {
      transform: rotate(180deg);
    }
    .el-form {
      margin-top: 18px;
    }
    .el-form-item {
      margin-bottom: 12px;
    }
    .redingK {
      padding: 5px;
      width: 64px;
      height: 28px;
      background: rgba(117, 194, 0, 1);
      opacity: 1;
      border-radius: 4px;
    }
  }
  .waterInfo {
    margin: 0;
  }
  h4 {
    padding: 0;
    margin: 0;
    padding-left: 9px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 16px;
    color: rgba(83, 83, 83, 1);
    opacity: 1;
  }
  .userJB {
    width: 180px;
    display: inline-block;
  }

  .text {
    display: inline-block;
    width: 56px;
    height: 19px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 16px;
    color: rgba(91, 91, 91, 1);
    opacity: 1;
    text-align: right;
  }
  .userBtn {
    text-align: center;
    margin-top: 10px;
    .el-button {
      background: rgba(0, 179, 161, 1);
      opacity: 1;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 17px;
      color: rgba(254, 254, 255, 1);
      opacity: 1;
    }
  }
}
</style>