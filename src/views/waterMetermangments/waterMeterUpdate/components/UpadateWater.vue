<template>
  <div class="left_box">
    <div class="user_info">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <h4>原水表信息</h4>

        <el-button type="success" size="mini" class="redingK" @click="handleFilterIC">
          <i class="iconfont iconduka"></i>读卡
        </el-button>
      </div>
      <el-form ref="userInfo" :model="userInfo" label-width="70px">
        <el-form-item label="用户编号">
          <el-input
            v-model="userInfo.CustomerNo"
            placeholder="回车进行模糊查询"
            @keydown.enter.native="searchEnter(1,userInfo.CustomerNo)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            v-model="userInfo.CustomerName"
            placeholder="回车进行模糊查询"
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
        <el-form-item v-show="showInfo&&userInfo.WaterMeterTypeName=='IC卡表水表'" label="表端余额">
          <el-input
            class="totalMoney left-input"
            v-model="userInfo.BdBalance"
            @input="IcMoneyChange(userInfo.BdBalance)"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="showInfo&&userInfo.WaterMeterTypeName=='机械表水表'" class="thisLable">
          <u class="thisJD" @click="thisTotalWater">当前阶梯总用水量</u>
          <el-input v-model="waterDetaileList.TotalYield" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" label="账户余额">
          <el-input class="totalMoney left-input" v-model="userInfo.Balance" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" label="用水性质">
          <el-input v-model="userInfo.UseWaterTypeName" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item v-show="showInfo" label="地址">
          <el-input v-model="userInfo.AreaName" disabled class="left-input"></el-input>
        </el-form-item>
      </el-form>
      <p class="showInfo" v-if="showSelect" :class="{tro:showInfo}">
        <i class="icon iconfont iconjianqu3" @click="showInfo=!showInfo"></i>
      </p>
    </div>
    <div class="waterInfo">
      <h4>升级后水表信息</h4>
      <el-form ref="waterInfo" :model="waterInfo" label-width="70px">
        <el-form-item label="水表类型">
          <el-select
            v-model="UpgradeWaterNeedInfo.WaterType"
            placeholder="请选择"
            class="left-input"
            @change="switchWater(UpgradeWaterNeedInfo.WaterType)"
          >
            <el-option label="IC卡水表" v-if="userInfo.WaterMeterTypeId=='1101'" value="1102" />
            <el-option
              label="远传水表"
              v-if="userInfo.WaterMeterTypeId=='1101'||userInfo.WaterMeterTypeId=='1102'"
              value="1103"
            />
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
              <el-option
                v-for="(item,index) in waterStyleList"
                :label="item.Name"
                :value="item.Id"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="水表口径">
            <el-select
              v-model="UpgradeWaterNeedInfo.meter2Param.MeterDiameter"
              placeholder="请选择"
              class="left-input"
            >
              <el-option
                v-for="(item,index) in waerMeterDirSize"
                :label="item.Name"
                :value="item.Id"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="表端余额">
            <el-input class="totalMoney left-input" value="0" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input
              class="totalMoney left-input"
              disabled
              v-model="UpgradeWaterNeedInfo.NewWaterBalance"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="UpgradeWaterNeedInfo.WaterType=='1103'">
          <el-form-item label="新水表编号">
            <el-input
              v-model="UpgradeWaterNeedInfo.WaterMeterNo"
              placeholder="回车进行水表查询"
              @keydown.enter.native="getYCWater(UpgradeWaterNeedInfo.WaterMeterNo)"
              class="left-input"
            ></el-input>
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
              <el-option
                v-for="(item,index) in waerMeterDirSize"
                :label="item.Name"
                :value="item.Id"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input
              class="totalMoney left-input"
              disabled
              v-model="UpgradeWaterNeedInfo.NewWaterBalance"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="UpgradeWaterNeedInfo.WaterType=='1104'">
          <el-form-item label="新水表编号">
            <el-input
              v-model="UpgradeWaterNeedInfo.WaterMeterNo"
              placeholder="回车进行水表查询"
              @keydown.enter.native="getWlWWater(UpgradeWaterNeedInfo.WaterMeterNo)"
              class="left-input"
            ></el-input>
          </el-form-item>
          <el-form-item :label="WMType?'报警金额':'报警量'">
            <el-input
              v-model="UpgradeWaterNeedInfo.meter4Param.WaterAmountAlarm"
              class="left-input"
            ></el-input>
          </el-form-item>
          <el-form-item :label="WMType?'透支金额':'透支量'">
            <el-input
              v-model="UpgradeWaterNeedInfo.meter4Param.WaterAmountOverdraft"
              class="left-input"
            ></el-input>
          </el-form-item>

          <el-form-item label="账户余额">
            <el-input
              class="totalMoney left-input"
              disabled
              v-model="UpgradeWaterNeedInfo.NewWaterBalance"
            >
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
      <el-button v-permission="['207']" size="small" type="primary" @click="updateWater">确认升级</el-button>
    </p>
    <select-user :selectUserShow="selectUserShow" :headQuery="params" @handleFilter="handleFilter" />
    <water-numDetail ref="numDetaile" />
  </div>
</template>
<script>
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import { getWaterInfo, waterAccount } from "@/api/userAccount"; //水表信息
import SelectUser from "@/components/SelectUser/index"; //水表信息
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import {
  getWaterTotalNum,
  getYCWaterInfo,
  getWLWaterInfo,
  UpgradeInfo,
  checkResidueMon,
  checkMeterRecord,
  checkWaterMOney
} from "@/api/waterMeterMang"; //获取用水量
import WaterNumDetail from "./WaterNumDetail";
import "@/styles/userAccount.scss";
import { async } from "q";
export default {
  name: "UpadateWater",
  components: { SelectUser, WaterNumDetail },
  directives: { permission },
  data() {
    return {
      userInfo: {
        //用户信息
        BdBalance: 0
      },
      WMType: true,
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
      showInfo: true,
      showSelect: false,
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
        customerId: "", //用户id
        useWaterTypeId: ""
      },
      waerMeterDirSize: [], //水表口径
      waterStyleList: [], //水表样式
      waterDetaileList: {}
    };
  },

  methods: {
    //检查是否欠费
    checkNoMoney(Id, val) {
      checkResidueMon({ customerId: Id }).then(res => {
        checkMeterRecord({ customerId: Id }).then(res => {
          if (val) {
            this.userInfo = val.data[0];
            this.UpgradeWaterNeedInfo.NewWaterBalance = this.userInfo.Balance;
          }
        });
      });
    },

    //升级
    async updateWater() {
      if (!this.userInfo.Id) {
        this.message({
          message: "请查询出用户后再升级",
          type: "warning"
        });
        return;
      }
      if (this.userInfo.WaterMeterTypeName != "IC卡表水表") {
        checkResidueMon({ customerId: this.userInfo.Id }).then(res => {
          checkMeterRecord({ customerId: this.userInfo.Id }).then(res => {
            this.updateApi();
          });
        });
      }
      if (this.userInfo.WaterMeterTypeName == "IC卡表水表") {
        let params = {
          customerId: this.userInfo.Id,
          customerBalance: this.userInfo.Balance,
          inputResidueMoney: this.userInfo.BdBalance
        };
        checkWaterMOney(params).then(res => {
          this.updateApi();
        });
      }
    },
    //升级请求
    updateApi() {
      let apiData = Object.assign({}, this.UpgradeWaterNeedInfo);
      if (this.WMType) {
        apiData.WaterType = "1105";
      }
      UpgradeInfo({
        UpgradeWaterNeedInfo: apiData,
        balance: this.UpgradeWaterNeedInfo.NewWaterBalance
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message ? res.message : "升级成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.message ? res.message : "升级失败",
            type: "warning"
          });
        }
        this.UpgradeWaterNeedInfo = this.$options.data().UpgradeWaterNeedInfo;
        this.userInf = {};
        this.waterInfo = {};
      });
    },
    //切换升级水表
    switchWater(num) {
      this.waterInfo = {};
      this.UpgradeWaterNeedInfo = this.$options.data().UpgradeWaterNeedInfo;
      this.UpgradeWaterNeedInfo.WaterType = num;
      this.UpgradeWaterNeedInfo.NewWaterBalance = this.userInfo.Balance;
      this.UpgradeWaterNeedInfo.CustomerId = this.userInfo.Id;
    },
    getWlWWater(num) {
      getWLWaterInfo({ WaterMeterNo: num }).then(res => {
        this.waterInfo = res.data;
        this.UpgradeWaterNeedInfo.meter4Param.WaterAmountAlarm = this.waterInfo.WaterAmountAlarm;
        this.UpgradeWaterNeedInfo.meter4Param.WaterAmountOverdraft = this.waterInfo.WaterAmountOverdraft;
        this.UpgradeWaterNeedInfo.meter4Param.IMSI = this.waterInfo.IMSI;
        this.UpgradeWaterNeedInfo.WaterMeterId = this.waterInfo.Id;
        this.UpgradeWaterNeedInfo.CustomerId = this.userInfo.Id;

        if (this.waterInfo.WMType == "1105") {
          this.WMType = true;
        } else {
          this.WMType = false;
        }
      });
    },
    getYCWater(num) {
      //远传表水表信息
      getYCWaterInfo({ WaterMeterNo: num }).then(res => {
        this.waterInfo = res.data;
        this.UpgradeWaterNeedInfo.meter3Param.ConcentratorNo = this.waterInfo.ConcentratorNo;
        this.UpgradeWaterNeedInfo.meter3Param.CollectorNo = this.waterInfo.CollectorNo;
        this.UpgradeWaterNeedInfo.meter3Param.MeterDiameter = this.waterInfo.MeterDiameter;
        this.UpgradeWaterNeedInfo.CustomerId = this.userInfo.Id;
      });
    },
    //当前用水量
    thisTotalWater() {
      this.thisWaterMerter.customerId = this.userInfo.Id;
      this.thisWaterMerter.useWaterTypeId = this.userInfo.SA_UseWaterType_Id;

      getWaterTotalNum(this.thisWaterMerter).then(res => {
        if (res.data == null) {
          this.$set(this.waterDetaileList, "TotalYield", 0);
        } else {
          this.waterDetaileList = res.data;
          this.$refs.numDetaile.dialogVisible = true;
        }
      });
    },
    //回车模糊查询
    searchEnter(num, val) {
      if (val == "") {
        return;
      }
      this.selectUserShow = false;
      this.params.CustomerQueryType = num;
      this.params.CustomerQueryValue = val;
      GetCustomerDataList(this.params).then(res => {
        if (res.data[0].WaterMeterTypeName == "IC卡表水表") {
          this.$message({
            message: "卡表用户请先读卡",
            type: "warning"
          });
          return false;
        }
        if (res.data[0].WaterMeterTypeName == "物联网水表") {
          this.$message({
            message: "物联网表暂不支持水表升级功能",
            type: "warning"
          });
          return false;
        }
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
            this.checkNoMoney(res.data[0].Id, res);
          }
        }
      });
    },
    //ic卡 输入表端余额
    IcMoneyChange(num) {
      this.UpgradeWaterNeedInfo.NewWaterBalance =
        Number(this.userInfo.Balance) + Number(num);
      let params = {
        customerId: this.userInfo.Id,
        customerBalance: this.userInfo.Balance,
        inputResidueMoney: num
      };
      checkWaterMOney(params).then(res => {});
    },
    //选择用户信息
    handleFilter(val) {
      if (val.WaterMeterTypeName == "IC卡表水表") {
        this.$message({
          message: "卡表用户请先读卡",
          type: "warning"
        });
        return false;
      } else {
        this.userInfo = val;
        this.checkNoMoney(val.Id);
        this.selectUserShow = false;
        this.UpgradeWaterNeedInfo.NewWaterBalance = this.userInfo.Balance;
        this.UpgradeWaterNeedInfo.CustomerId = this.userInfo.CustomerId;
      }
      // this.getWaterMeterInfo(res.data[0].Id);
    },
    //获取水表信息
    getWaterMeterInfo(id) {
      getWaterInfo({ customerId: id }).then(res => {
        if (res.code == 0) {
          this.waterInfo = res.data;
        } else {
          this.$message({
            type: "warning",
            message: res.msg ? res.msg : "未查询到该用户水表信息"
          });
        }
      });
    },
    getUser(info) {
      let postData = {};
      if (info) {
        postData.CustomerQueryValue = info.UserCardCredited.CardNo;
        postData.CustomerQueryType = "8";
        postData.page = 1;
        postData.limit = 20;
        GetCustomerDataList(postData).then(res => {
          if (res.code == 0) {
            this.userInfo = {};
            this.waterInfo = {};
            if (res.data.length == 0) {
              this.$message({
                message: "未查询到用户！",
                type: "warning"
              });
              return false;
            } else {
              if (
                res.data[0].WaterMeterTypeName == "IC卡表水表" &&
                info.CardType != 1
              ) {
                this.$message({
                  message: "该卡是未刷卡状态，请刷卡后再进行操作",
                  type: "warning"
                });
                return false;
              }
              this.userInfo = res.data[0];
              this.UpgradeWaterNeedInfo.NewWaterBalance = this.userInfo.Balance;
              this.UpgradeWaterNeedInfo.CustomerId = this.userInfo.Id;
            }
            // this.getWaterMeterInfo(res.data[0].Id);
          }
        });
      }
    },
    //读卡
    handleFilterIC() {
      try {
        ICReadCardInfo(resData => {
          this.getUser(resData);
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
      /deep/ .el-form-item__label {
        padding: 0 !important;
      }
    }
    .el-form-item {
      margin-bottom: 12px;
    }
    .redingK {
      color: #fff;
      background-color: #33b300;
      border-color: #33b300;
      padding: 7px 5px;
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