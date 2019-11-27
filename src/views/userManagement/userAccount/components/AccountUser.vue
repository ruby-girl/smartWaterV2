<template>
  <div class="left_box">
    <h3>用户销户</h3>
    <div class="user_info">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <h4>用户信息</h4>
        <el-button type="success" size="mini" class="redingK">
          <i class="iconfont icontianjia"></i>读卡
        </el-button>
      </div>
      <el-form ref="userInfo" :model="userInfo" label-width="70px">
        <el-form-item label="姓名：">
          <el-input v-model="userInfo.CustomerName" @keydown.enter.native="searchEnter(2)"></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="userInfo.Tel"></el-input>
        </el-form-item>
        <el-form-item label="用户编号：">
          <el-input v-model="userInfo.CustomerNo"></el-input>
        </el-form-item>
        <el-form-item label="证件号：">
          <el-input v-model="userInfo.IdentityNo"></el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-input v-model="userInfo.Address"></el-input>
        </el-form-item>
        <el-form-item label="账户余额：">
          <el-input v-model="userInfo.Balance"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="userInfo.Remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="waterInfo">
      <h4>水表信息</h4>
      <el-form ref="waterInfo" :model="userInfo" label-width="70px">
        <el-form-item label="水表编号：">
          <el-input v-model="waterInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="水表类型：">
          <el-input v-model="waterInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="表端余额">
          <el-input v-model="waterInfo.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <p>
      <span class="text">总计：</span>
      <span class="totalMoney">{{totalMoney}}</span>元
    </p>
    <p>
      <span class="text">经办人：</span>
      <el-input class="userJB" placeholder="请输入内容" v-model="user"></el-input>
    </p>
    <p class="userBtn">
      <el-button size="small" type="primary">确认销户</el-button>
    </p>
    <el-dialog
      title="历史详情"
      :visible.sync="viewWaterHistory"
      top="30vh"
      width="836px"
      hight="432px"
      center
      :close-on-click-modal="false"
    >
      <iC-water-meterHis
        :hisData="hisData"
        @sortProp="sortProp"
        :meterReadListParam="meterReadListParam"
      />

      <pagination
        v-show="histotal>0"
        :total="histotal"
        :page.sync="meterReadListParam.page"
        :limit.sync="meterReadListParam.limit"
      />
    </el-dialog>
  </div>
</template>
<script>
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import { getWaterInfo } from "@/api/userSetting"; //水表信息
import Pagination from "@/components/Pagination";

export default {
  name: "AccountUser",
  data() {
    return {
      userInfo: {
        //用户信息
      },
      waterInfo: {},
      user: "admin",
      totalMoney: "333.00",
      viewWaterHistory:false,
      histotal:0,
      params:{
        page:1,
        Limit:10,
        CustomerQueryType:"",
        CustomerQueryValue:"",
      },
    };
  },
  methods: {
    searchEnter(num) {
      if (num == 2) {
        this.params.CustomerQueryValue = this.userInfo.CustomerName;
      } else if (num == 3) {
        this.params.CustomerQueryValue = this.userInfo.Tel;
      } else if (num == 1) {
        this.params.CustomerQueryValue = this.userInfo.CustomerNo;
      } else if (num == 4) {
        this.params.CustomerQueryValue = this.userInfo.IdentityNo;
      }
      GetCustomerDataList(this.params).then(res => {
        console.log(res);
      });
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
      margin-bottom: 10px;
    }
    .redingK {
      padding: 7px 5px;
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