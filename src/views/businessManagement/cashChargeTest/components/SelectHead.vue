<template>
  <div>
    <div class="display-flex align-items-center justify-content-flex-justify">
      <el-form
        :inline="true"
        :model="selectHead"
        class="head-search-form form-inline-small-input"
        size="small"
        @submit.native.prevent
      >
        <el-form-item >
          <el-select
            v-model="selectHead.CustomerQueryType"
            placeholder="请选择"
           class="user-select-box"
          style="width: 100px;float: left;margin-right:3px;"
          >
            <el-option label="用户编号" value="1"></el-option>
            <el-option label="姓名/简码" value="2"></el-option>
            <el-option label="水表编号" value="6"></el-option>
          </el-select>
          <el-input
            v-model="selectHead.CustomerQueryValue"
            maxlength="20"
            placeholder="(长度1-30)"
            @keyup.enter.native="handleFilter"
            style="width: 180px;float: left"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleFilter">
            <i class="iconfont iconsousuo"></i>搜索
          </el-button>
          <el-button type="success" size="mini" @click="handleFilterIC">
            <i class="iconfont iconduka"></i>读卡
          </el-button>
        </el-form-item>
      </el-form>
      <div class="payment-records" @click="toPaymentQuery">
        <div class="payment-num-more" v-show="paymentNum>99">{{paymentNum}}</div>
        <div class="payment-num" v-show="paymentNum<100&&paymentNum>0">{{paymentNum}}</div>
        <span>查询缴费记录>></span>
      </div>
    </div>
  </div>
</template>
<script>
import { GetCustomerDataList } from "@/api/userSetting"; ////模糊查询用户
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    headUser: {
      type: Object
    },
    paymentNum:{}
  },
  watch: {
    headUser(val) {
      this.user = val;
    }
  },
  data() {
    return {
      timevalue: [],
      editUserList: [],
      user: {}
    };
  },
  methods: {
    handleFilter() {
      if (!this.selectHead.CustomerQueryValue) {
        this.$message({
          message: "请输入要查询的用户！",
          type: "error",
          duration: 4000
        });
        this.$emit("clearData");
        return;
      }
      GetCustomerDataList(this.selectHead).then(res => {
        if (res.data.length == 0) {
          this.$message({
            message: "未查询到用户！",
            type: "error",
            duration: 4000
          });
          this.user={}
          this.$emit("clearData");
        } else if (res.data.length == 1) {
          this.user = res.data[0];
          this.$emit("handleFilter", res.data[0]);
        } else {
          this.$parent.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
    },
    handleFilterIC() {
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
    },
    toPaymentQuery() {
      this.paymentNum=''
      this.$router.push({
        path: "/businessManagement/paymentQuery",
        query: {
          id: "qwe"
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.payment-records {
  color: #00b2a1;
  font-size: 13px;
  padding: 10px 10px 0 0;
  cursor: pointer;
  position: relative;
  .payment-num {
    position: absolute;
    background: #ff5656;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    line-height: 17px;
    font-size: 12px;
    top: -6px;
    right: 15px;
    color: #fff;
    text-align: center;
  }
}
.head-bottom-box {
  background: #f5f5f5;
  padding: 15px;
  line-height: 25px;
}
.head-search-form{
  margin-top:10px;
  padding-left: 10px;
  /deep/ .el-form-item--small.el-form-item{
    margin-bottom: 0;
  }
}
</style>

