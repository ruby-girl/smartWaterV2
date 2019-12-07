<template>
  <!--左侧树形菜单-->
  <div class="user_tree">
    <div class="type-title">水表换表</div>
     <el-tabs v-model="activeName">
    <el-tab-pane label="以旧换新" name="first">
      <old-for-new></old-for-new>
    </el-tab-pane>
    <el-tab-pane label="用户互换" name="second">
      <user-change></user-change>>
    </el-tab-pane>
  </el-tabs>
  <span v-show="!ifShowChild" class="telescopic telescopic2" @click="getUp">
      用户过户
      <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
  </span>
  </div>
</template>
<script>
import "@/styles/organization.scss";
import { IsTransfer,TransferCustomer } from "@/api/userAccount";
import OldForNew from "./OldForNew"
import UserChange from "./UserChange"
export default {
  components: {OldForNew,UserChange},
  props: { ifShow: {} },
  data() {
    return {
      activeName:'first',
       params: {
        page: 1,
        Limit: 10,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      selectUserShow: false,
      ifShowChild:false
    };
  },
  watch: {
    ifShow(v) {
      this.ifShowChild = v;
    }
  },
  mounted(){
    this.getUp(true)
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
          this.IsTransferFunc(this.user.Id);
        } else {
          this.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
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
.type-title{
  color:#777;
  padding: 11px 0;
  font-weight: bold;
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
   .telescopic2 {
    right: 0px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }
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
      padding: 0 11px;
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
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}
/deep/ .el-tabs__header{
  margin-bottom: 0;
}
.bottom-btn-box {
  text-align: center;
  padding: 25px 0;
}
</style>
