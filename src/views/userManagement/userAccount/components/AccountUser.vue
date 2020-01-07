<template>
  <div class="left_box">
    <div class="user_info">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <h4>用户信息</h4>
        <el-button type="success" size="mini" class="redingK" @click="handleFilterIC">
          <i class="iconfont iconduka"></i>读卡
        </el-button>
      </div>
      <el-form ref="userInfo" :model="userInfo" label-width="70px">
        <el-form-item label="姓名/简码">
          <el-input
            v-model="userInfo.CustomerName"
            @keydown.enter.native="searchEnter(2,userInfo.CustomerName)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="userInfo.Tel"
            @keydown.enter.native="searchEnter(3,userInfo.Tel)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input
            v-model="userInfo.CustomerNo"
            @keydown.enter.native="searchEnter(1,userInfo.CustomerNo)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件号">
          <el-input
            v-model="userInfo.IdentityNo"
            @keydown.enter.native="searchEnter(4,userInfo.IdentityNo)"
            class="left-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="userInfo.Address" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item label="账户余额">
          <el-input class="totalMoney left-input" v-model="userInfo.Balance" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="userInfo.Remark" class="left-input"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="waterInfo">
      <h4>水表信息</h4>
      <el-form ref="waterInfo" :model="userInfo" label-width="70px">
        <el-form-item label="水表编号">
          <el-input v-model="waterInfo.WaterMeterNo" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item label="水表类型">
          <el-input v-model="waterInfo.WaterMeterTypeName" disabled class="left-input"></el-input>
        </el-form-item>
        <el-form-item label="表端余额">
          <el-input
            class="totalMoney left-input"
            v-model="waterInfo.MeterBalance"
            :disabled="waterInfo.WaterMeterTypeName=='IC卡表水表'?false:true"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="6">
        <span class="text">总计</span>
      </el-col>
      <el-col :span="16">
        <span class="totalMoney">{{totalMoney}}</span>元
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-col :span="6">
        <span class="text">经办人</span>
      </el-col>
      <el-col :span="16">
        <el-select
          v-model="accountList.operatorEmpId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
        >
          <el-option
            v-for="item in editUserList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-col>
    </el-row>

    <p class="userBtn">
      <el-button size="small" type="primary" @click="accountBtn">确认销户</el-button>
    </p>
    <select-user :selectUserShow="selectUserShow" :headQuery="params" @handleFilter="handleFilter" />
  </div>
</template>
<script>
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import { getWaterInfo, waterAccount } from "@/api/userAccount"; //水表信息
import SelectUser from "@/components/SelectUser/index"; //水表信息
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import "@/styles/userAccount.scss";
export default {
  name: "AccountUser",
  components: { SelectUser },
  props: {
    editUserList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      userInfo: {
        //用户信息
      },
      waterInfo: {}, //水表信息
      totalMoney: 0,
      selectUserShow: false,
      params: {
        page: 1,
        limit: 10,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      userList: [],
      accountList: {
        customerId: "",
        remark: "",
        operatorEmpId: "",
        icMeterBalance: ""
      }
    };
  },

  methods: {
    //回车模糊查询
    searchEnter(num, val) {
      if (val == "") {
        return;
      }
      this.selectUserShow = false;
      this.params.CustomerQueryType = num;
      this.params.CustomerQueryValue = val;
      GetCustomerDataList(this.params).then(res => {
        if (res.code == 0) {
          this.userInfo = {};
          this.waterInfo = {};
          this.totalMoney = 0;
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
            this.getWaterMeterInfo(res.data[0].Id);
          }
        }
      });
    },
    //选择用户信息
    handleFilter(val) {
      this.userInfo = val;
      this.selectUserShow = false;
      this.getWaterMeterInfo(val.Id);
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
    //销户
    accountBtn() {
      if (
        this.userInfo.Id == undefined ||
        this.waterInfo.MeterBalance == undefined
      ) {
        this.$message({
          message: "请先查询信息在进行操作",
          type: "warning"
        });
        return false;
      }
      this.accountList.customerId = this.userInfo.Id;
      this.accountList.remark = this.userInfo.remark
        ? this.userInfo.remark
        : "";
      this.accountList.icMeterBalance = this.waterInfo.MeterBalance;
      console.log(this.accountList);
      waterAccount(this.accountList).then(res => {
        console.log(res);
      });
    },
    getUser(info) {
      let postData = {};
      if (info) {
        if (info.CardType != 1) {
          this.$message({
            message: "该卡是未刷卡状态，请刷卡后再进行操作",
            type: "warning"
          });
          return false;
        }
        postData.CustomerQueryValue = info.UserCardCredited.CardNo;
        postData.CustomerQueryType = "8";
        postData.page = 1;
        postData.limit = 20;
        GetCustomerDataList(this.postData).then(res => {
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
              this.userInfo = res.data[0];
              this.getWaterMeterInfo(res.data[0].Id);
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
  created() {}
};
</script>
<style lang="scss" scoped>
.left_box {
  background: #fff;
  height: 100%;
  padding: 7px 13px;

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
    padding: 13px 6px;
    .el-form {
      margin-top: 18px;
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
    .left-input {
      width: 170px !important;
      /deep/ input.el-input__inner {
        width: 100% !important;
      }
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