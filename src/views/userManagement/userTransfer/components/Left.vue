<template>
  <!--左侧树形菜单-->
  <div class="user_tree head-search-form">
    <!-- <div class="type-title">用户过户</div> -->
    <div class="transfer-container">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">原用户信息</div>
        <el-button type="success" size="mini" @click="handleFilterIC">
          <i class="iconfont iconduka"></i>读卡
        </el-button>
      </div>
      <el-form ref="form" label-width="70px" style="margin-top:10px;">
        <el-form-item label="姓名">
          <el-input
            class="left-input"
            v-model="user.CustomerName"
            @keyup.enter.native="handleSelect(user.CustomerName,2)"
            placeholder="回车进行模糊查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            class="left-input"
            v-model="user.Tel"
            @keyup.enter.native="handleSelect(user.Tel,3)"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input
            class="left-input"
            v-model="user.CustomerNo"
            @keyup.enter.native="handleSelect(user.CustomerNo,1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件号">
          <el-input
            class="left-input"
            v-model="user.IdentityNo"
            @keyup.enter.native="handleSelect(user.IdentityNo,4)"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            class="left-input"
            v-model="user.Address"
            @keyup.enter.native="handleSelect(user.Address,5)"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="transfer-container">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">新用户信息</div>
      </div>
      <el-form
        :model="newUser"
        ref="user"
        :rules="rules"
        label-width="68px"
        style="margin-top:10px;"
      >
        <div class="display-flex align-items-center justify-content-flex-justify">
          <el-form-item label="姓名" prop="NewCustomerName">
            <el-input v-model="newUser.NewCustomerName" class="short-input" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="人口" label-width="55px" prop="NewPeopleNo">
            <el-input
              class="people-input"
              v-model="newUser.NewPeopleNo"
              maxlength="2"
              @keyup.native="testNumber"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="电话" prop="NewTel">
          <el-input class="left-input" v-model="newUser.NewTel" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="证件号" prop="NewIdentityNo">
          <el-input class="left-input" v-model="newUser.NewIdentityNo" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="newUser.Remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom-btn-box">
        <el-button style="padding:8px 14px;" type="success" size="mini" @click="fileShow=true">
          <i class="iconfont iconfujian" style="margin-right:3px;"></i>附件
        </el-button>
      </div>
    </div>
    <span v-show="!ifShowChild" class="telescopic telescopic2" @click="getUp">
      用户过户
      <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
    </span>
    <div class="bottom-btn-box">
      <el-button type="primary" v-permission="['226']" @click="account" size="mini" style="padding:8px 14px;">确认过户</el-button>
    </div>
    <fileList :show.sync="fileShow" :file.sync="file"></fileList>
    <select-user
      :selectUserShow.sync="selectUserShow"
      :headQuery="params"
      @handleFilter="handleFilter"
    />
    <account-balances
      :accountShow.sync="accountShow"
      :user="newUser"
      @accountBalancesFunc="accountBalancesFunc"
    />
  </div>
</template>
<script>
import "@/styles/organization.scss";
import { IsTransfer, TransferCustomer } from "@/api/userAccount";
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import SelectUser from "@/components/SelectUser";
import AccountBalances from "./AccountBalances";
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import FileList from "./FileList";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  components: { FileList, SelectUser, AccountBalances },
  props: ['ifShow'],
  directives: { permission },
  data() {
    return {
      ifShowChild: false,
      fileShow: false,
      name: "r",
      user: {},
      accountShow: false, //账户转存弹窗
      newUser: {
        CustomerId: "",
        NewCustomerName: "", //姓名
        NewTel: "", //电话
        NewPeopleNo: "", //人口
        NewIdentityNo: "", //证件号
        Remark: "", //备注
        FileIdList: [], //文件合集
        BalanceValue: 0, //余额
        OperatorEmpId: "", //经办人ID
        IsBalanceDeposit: false //是否转存
      },
      IsArrearageRes: {}, //是否欠费接口返回的所有信息
      file: [],
      params: {
        page: 1,
        Limit: 20,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      selectUserShow: false,
      rules: {
        NewCustomerName: [{ required: true, message: "必填", trigger: "blur" }],
        NewTel: [
          { required: true, message: "必填", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
            message: "请正确输入电话号码",
            trigger: "blur"
          }
        ],
        NewPeopleNo: [{ required: true, message: "必填", trigger: "blur" }],
        NewIdentityNo: [
          { required: true, message: " ", trigger: "blur" },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: "请正确输入身份证号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    ifShow(v) {
      this.ifShowChild = v;
    }
  },
  methods: {
    getUp() {
      this.ifShowChild = true;
      if (this.ifShow) {
        document.getElementsByClassName("user_tree")[0].classList.add("hide");
      } else {
        document
          .getElementsByClassName("user_tree")[0]
          .classList.remove("hide");
      }
      this.$emit("getUp", this.ifShowChild);
    },
    testNumber() {
      this.newUser.NewPeopleNo = this.newUser.NewPeopleNo.replace(/[^\d]/g, "");
    },
    account() {
      if (!this.user.CustomerNo) {
        this.$message({
          message: "请先查询需要过户的用户信息！",
          type: "error",
          duration: 4000
        });
        return;
      }
      if (this.IsArrearageRes.IsArrearage) {
        this.$message({
          message: "您选择的用户存在欠费不允许过户!",
          type: "error",
          duration: 4000
        });
        return;
      }
      this.$refs["user"].validate(valid => {
        if (!valid) return false;
        else {
          this.IsBalanceDepositFunc(); //如果双方信息通过，这里询问账户余额是否转存
        }
      });
    },
    IsBalanceDepositFunc() {
      this.accountShow = true;
    },
    //进行过户操作
    accountBalancesFunc(user) {
      user.FileIdList = this.file;
      this.accountShow = false;
      TransferCustomer(user).then(res => {
        this.$message({
          message: "操作成功！",
          type: "success",
          duration: 4000
        });
        this.user = {};
        this.newUser = {
          CustomerId: "",
          NewCustomerName: "", //姓名
          NewTel: "", //电话
          NewPeopleNo: "", //人口
          NewIdentityNo: "", //证件号
          Remark: "", //备注
          FileIdList: [], //文件合集
          BalanceValue: 0, //余额
          OperatorEmpId: "", //经办人ID
          IsBalanceDeposit: false //是否转存
        };
      });
    },
    // 模糊查询用户
    handleSelect(val, n) {
      if (!val) {
        this.user = {};
        return false;
      }
      this.params.CustomerQueryValue = val;
      this.params.CustomerQueryType = n;
      this.getUser();
    },
    handleFilter(val) {
      if (res.data[0].CustomerState != 1301) {
        this.$message({
          message: "请注意该用户状态不正常！",
          type: "error",
          duration: 4000
        });
        this.user = {};
        return;
      }
      if (val.WaterMeterTypeId == 1102) {
        this.$message({
          message: "卡表用户请先读卡！",
          type: "error",
          duration: 4000
        });
        return;
      }
      this.user = val;
      this.IsTransferFunc(val.Id);
    },
    // 查询用户是否有欠费
    IsTransferFunc(id) {
      this.newUser.CustomerId = id;
      IsTransfer({ CustomerId: id }).then(res => {
        this.user.BalanceValue = res.data.Balance;
        this.newUser.BalanceValue = res.data.Balance;
        this.IsArrearageRes = res.data;
      });
    },
    // IC卡读卡
    handleFilterIC() {
      try {
        // 读卡
        ICReadCardInfo(resData => {
          this.getUser(resData);
        });
      } catch (error) {
        console.log("请在CS端操作1");
      }
    },
    // 查询用户信息
    getUser(info) {
      let postData = {};
      if (info) {
        if (info.CardType == 1) {
          postData.CustomerQueryValue = info.UserCardCredited.CardNo;
        } else {
          postData.CustomerQueryValue = info.UserCard.CardNo;
        }
        postData.CustomerQueryType = "8";
        postData.page = 1;
        postData.limit = 20;
      } else {
        postData = Object.assign({}, this.params);
      }
      GetCustomerDataList(postData).then(res => {
        if (res.data.length == 0) {
          this.$message({
            message: "未查询到用户！",
            type: "error",
            duration: 4000
          });
          this.user = {};
        } else if (res.data.length == 1) {
          if (res.data[0].CustomerState != 1301) {
            this.$message({
              message: "请注意该用户状态不正常！",
              type: "error",
              duration: 4000
            });
            this.user = {};
            return;
          }
          if (res.data[0].WaterMeterTypeId == 1102 && !info) {
            this.$message({
              message: "卡表用户请先读卡！",
              type: "error",
              duration: 4000
            });
            return;
          }
          this.user = res.data[0];
          this.IsTransferFunc(this.user.Id);
        } else {
          this.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.type-title {
  color: #777;
  padding: 11px 0;
  font-weight: bold;
  font-size: 14px;
}
.top-title {
  color: #535353;
  font-size: 14px;
}
.tree_container {
  .icon {
    font-size: 14px;
  }
  background: #eff1f4;
  .telescopic {
    position: absolute;
    display: block;
    top: 220px;
    color: #00b2a1;
    font: normal 16px "Microsoft YaHei";
    width: 30px;
    margin: 0 auto;
    word-wrap: break-word;
    -webkit-box-shadow: 1px 1px 5px #cecece;
    background: #fff;
    padding: 15px 0;
    z-index: 999;
    text-align: center;
    cursor: pointer;
    box-shadow: 1px 1px 5px #cecece;
  }
  .telescopic1 {
    left: 0;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
  .telescopic2 {
    right: 0px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }
  position: relative;
  padding: 16px 16px 0 16px;
  height: calc(100vh - 74px);
  .user_box {
    display: flex;
    height: inherit;
    > div {
      transition: width 0.2s;
      -webkit-transition: width 0.2s;
      position: relative;
    }
    .user_tree {
      width: 280px;
      position: relative;
      background: #fff;
      padding: 0 13px;
      margin-right: 16px;
      height: 100%;
      overflow: auto;
    }
    .user_table {
      flex: 1;
      -webkit-flex: 1;
      background: #fff;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }
  }
  .short-input {
    width: 80px;
    /deep/ input.el-input__inner {
      width: 100% !important;
    }
  }
  .left-input {
    width: 170px !important;
    /deep/ input.el-input__inner {
      width: 100% !important;
    }
  }
  .people-input {
    width: 35px;
    /deep/ input.el-input__inner {
      width: 100% !important;
      padding: 0 2px;
      text-align: center;
    }
  }
  .el-button--mini {
    padding: 7px 5px;
  }
  .hide {
    width: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    margin-right: 0 !important;
  }
  .none {
    display: none;
  }
  .user_table {
    .el-button--small {
      padding: 7px 15px;
    }
  }
}
.transfer-container {
  padding: 10px 13px 5px 2px;
  background: #f5f5f5;
  margin-top: 15px;
  /deep/ .el-form-item {
    margin-bottom: 13px;
  }
}
.bottom-btn-box {
  text-align: center;
  padding: 25px 0;
}
</style>
