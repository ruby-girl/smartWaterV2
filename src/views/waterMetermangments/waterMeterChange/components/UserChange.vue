<template>
  <!--左侧树形菜单-->
  <div class="tab-container">
    <div class="transfer-container">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">原水表信息</div>
        <el-button type="success" size="mini" @click="handleFilterIC">
          <i class="iconfont iconduka"></i>读卡
        </el-button>
      </div>
      <el-form ref="form" class="head-search-form" label-width="106px" style="margin-top:10px;">
          <el-form-item label="用户编号">
          <el-input  class="left-input" v-model="user.CustomerNo" @keyup.enter.native="handleSelect(user.CustomerNo,1)"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
          class="left-input"
            v-model="user.CustomerName"
            @keyup.enter.native="handleSelect(user.CustomerName,2)"
            placeholder="回车进行模糊查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="水表类型">
          <el-input class="left-input" v-model="user.Tel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="原水表编号">
          <el-input class="left-input" v-model="user.IdentityNo" :disabled="true"></el-input>
        </el-form-item>
         <el-form-item label="账户余额">
          <el-input class="left-input" v-model="user.IdentityNo" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input class="left-input" v-model="user.Address" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div><i></i></div>
    </div>
    <div class="transfer-container" style="margin-top:13px;">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">新水表信息</div>    
      </div>
      <el-form class="head-search-form"  ref="user" label-width="86px" style="margin-top:10px;">
           <el-form-item label="用户编号" prop="NewTel">
          <el-input class="left-input" @keyup.enter.native="handleSelect(newUser.CustomerName,1,)" v-model="newUser.NewTel"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="NewTel">
          <el-input class="left-input" @keyup.enter.native="handleSelect(newUser.CustomerName,2)" placeholder="回车进行模糊查询"  v-model="newUser.NewTel"></el-input>
        </el-form-item>
        <el-form-item label="水表类型" prop="NewTel">
          <el-input class="left-input"  v-model="newUser.NewTel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="原水表编号" prop="NewTel">
          <el-input class="left-input"  v-model="newUser.NewTel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账户余额" prop="NewTel">
          <el-input class="left-input"  v-model="newUser.NewTel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="NewTel">
          <el-input class="left-input"  v-model="newUser.NewTel" :disabled="true"></el-input>
        </el-form-item>

      </el-form>
    </div>
    <div class="bottom-btn-box">
      <el-button type="primary" @click="account" size="mini" style="padding:8px 14px;">确认过户</el-button>
    </div>
    <select-user
      :selectUserShow.sync="selectUserShow"
      :headQuery="params"
      @handleFilter="handleFilter"
    />
  </div>
</template>
<script>
import "@/styles/organization.scss";
import { IsTransfer,TransferCustomer } from "@/api/userAccount";
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import SelectUser from "@/components/SelectUser";
export default {
  props: { ifShow: {} },
  components: {SelectUser},
  data() {
    return {
      ifShowChild: false,
      fileShow: false,
      name: "r",
      user: {},
      accountShow: false, //账户转存弹窗
      newUser: {
        CustomerId:'',
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
        Limit: 10,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      selectUserShow: false
    };
  },
  watch: {
    ifShow(v) {
      this.ifShowChild = v;
    }
  },
  methods: {
      // 模糊查询用户
    handleSelect(val, n) {
      if (!val) {
        this.user = {};
        return false;
      }
      this.params.CustomerQueryValue = val;
      this.params.CustomerQueryType = n;
      GetCustomerDataList(this.params).then(res => {
        if (res.data.length == 0) {
          this.$message({
            message: "未查询到用户！",
            type: "error",
            duration: 4000
          });
          this.user = {};
        } else if (res.data.length == 1) {
          this.user = res.data[0];
        } else {
          this.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
    },
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
    testNumber(){
      this.newUser.NewPeopleNo = this.newUser.NewPeopleNo.replace(/[^\d]/g,'');
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
      if(this.IsArrearageRes.IsArrearage){
           this.$message({
            message: "您选择的用户存在欠费不允许过户!",
            type: "error",
            duration: 4000
          });
          return
      }
     
      this.IsBalanceDepositFunc(); //如果双方信息通过，这里询问账户余额是否转存
    },
     //进行过户操作
    accountBalancesFunc(user) { 
      user.FileIdList=this.file
      this.accountShow=false
      TransferCustomer(user).then(res=>{
        this.$message({
            message: "操作成功！",
            type: "success",
            duration: 4000
          });
          this.user={}
          this.newUser={
            CustomerId:'',
            NewCustomerName: "", //姓名
            NewTel: "", //电话
            NewPeopleNo: "", //人口
            NewIdentityNo: "", //证件号
            Remark: "", //备注
            FileIdList: [], //文件合集
            BalanceValue: 0, //余额
            OperatorEmpId: "", //经办人ID
            IsBalanceDeposit: false //是否转存
          }
      })
    },
    handleFilter(val) {
      this.user = val;  
      this.IsTransferFunc(val.Id);
    },
    // 查询用户是否有欠费
    IsTransferFunc(id) {
      this.newUser.CustomerId=id
      IsTransfer({ CustomerId: id }).then(res => {
        this.user.BalanceValue=res.data.Balance
        this.IsArrearageRes = res.data;
      });
    },
    // IC卡读卡
    handleFilterIC(){
      try {
        // resInfo用户信息  resData卡片信息
        // ICReadCardInfo((resInfo,resData)=>{
        //   console.log('头部咯')
        //   console.log(resData)
        //this.$emit("handleFilterIcParent", resInfo,resData) 
        // })
        // 读卡
          ICReadCardInfo((resData)=>{
          console.log('头部咯')
          console.log(resData)
          this.$emit("handleFilterIcParent", resData)      
        })
      } catch (error) {
        console.log("请在CS端操作1");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.top-title{
color:#535353;
font-size: 14px;
}
.tree_container {
  .icon {
    font-size: 14px;
  }
  background: #eff1f4;
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
    .tab-container {
      width: 100%;
      position: relative;
      background: #fff;
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
  .short-input{
    width:80px;
   /deep/ input.el-input__inner{
      width:100% !important;
    }
  }
  .left-input{
    width:160px !important;
     /deep/ input.el-input__inner{
      width:100% !important;
    }
    /deep/ .el-select > .el-input{
         width:150px !important;
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
  padding: 10px 5px 5px 2px;
  background: #f5f5f5;
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}
.bottom-btn-box {
  text-align: center;
  padding: 25px 0;
}
</style>
