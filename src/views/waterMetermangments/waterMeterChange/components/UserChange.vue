<template>
  <!--左侧树形菜单-->
  <div class="tab-container">
    <div class="transfer-container">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">原水表信息</div>
        <!-- <el-button type="success" size="mini" @click="handleFilterIC">
          <i class="iconfont iconduka"></i>读卡
        </el-button>-->
      </div>
      <el-form
        ref="form"
        class="head-search-form big-margin-label"
        label-width="86px"
        style="margin-top:10px;"
      >
        <el-form-item label="用户编号">
          <el-input
            class="left-input"
            v-model="user.CustomerNo"
            @keyup.enter.native="handleSelect(user.CustomerNo,1,1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            class="left-input"
            v-model="user.CustomerName"
            @keyup.enter.native="handleSelect(user.CustomerName,2,1)"
            placeholder="回车进行模糊查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="水表类型">
          <el-input class="left-input" v-model="user.WaterMeterTypeName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="原水表编号">
          <el-input class="left-input" v-model="user.SA_WaterMeterNo" :disabled="true"></el-input>
        </el-form-item>
        <!-- 远传 -->
        <el-form-item label="账户余额" v-show="(showInfo&&user.WaterMeterTypeId==1103)||(screeWidth>1339&&user.WaterMeterTypeId==1103)">
          <el-input class="left-input" v-model="user.Balance" :disabled="true"></el-input>
        </el-form-item>
        <!-- 物联网 -->
        <el-form-item label="表端余额" v-show="(showInfo&&user.WaterMeterTypeId==1104)||(screeWidth>1339&&user.WaterMeterTypeId==1104)">
          <el-input class="left-input" v-model="user.meterBalance" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" v-show="showInfo||screeWidth>1339">
          <el-input class="left-input" v-model="user.Address" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <p class="showInfo" :class="{tro:showInfo}" v-if="screeWidth<1440">
        <i class="icon iconfont iconjianqu3" @click="showInfo=!showInfo"></i>
      </p>
    </div>
    <div class="transfer-container" style="margin-top:13px;">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">新水表信息</div>
      </div>
      <el-form
        class="head-search-form big-margin-label"
        ref="user"
        label-width="86px"
        style="margin-top:10px;"
      >
        <el-form-item label="用户编号">
          <el-input
            class="left-input"
            @keyup.enter.native="handleSelect(newUser.CustomerName,1,2)"
            v-model="newUser.CustomerNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            class="left-input"
            @keyup.enter.native="handleSelect(newUser.CustomerName,2,2)"
            placeholder="回车进行模糊查询"
            v-model="newUser.CustomerName"
          ></el-input>
        </el-form-item>
        <el-form-item label="水表类型">
          <el-input class="left-input" v-model="newUser.WaterMeterTypeName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="原水表编号">
          <el-input class="left-input" v-model="newUser.SA_WaterMeterNo" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账户余额" v-show="user.WaterMeterTypeId==1103">
          <el-input class="left-input" v-model="newUser.Balance" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="表端余额" v-show="user.WaterMeterTypeId==1104">
          <el-input class="left-input" v-model="newUser.meterBalance" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input class="left-input" v-model="newUser.Address" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom-btn-box">
      <el-button type="primary" @click="change" size="mini" style="padding:8px 14px;">确认换表</el-button>
    </div>
    <select-user
      :selectUserShow.sync="selectUserShow"
      :headQuery="params"
      @handleFilter="handleFilter"
    />
  </div>
</template>
<script>
import { Exchange} from "@/api/waterMeterMang";
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import SelectUser from "@/components/SelectUser";
export default {
  components: { SelectUser },
  data() {
    return {
      ifShowChild: false,
      fileShow: false,
      name: "r",
      user: { WaterMeterTypeId: 1103 },
      showInfo: false,
      accountShow: false, //账户转存弹窗
      newUser: {},
      postData:{ 
        oneCustomerId: "",
        twoCustomerId: "",
        remark: "备注"
      },
      params: {
        page: 1,
        Limit: 10,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      selectUserShow: false,
      setUserType: 1,
      screeWidth:1024
    };
  },
  mounted(){
    this.screeWidth = window.screen.width
  },
  methods: {
    // 模糊查询用户 val:输入的值 n:模糊查询类型,userType: 1旧用户2新用户
    handleSelect(val, n, userType) {
      if (!val) {
        if (userType == 1) this.user = {};
        else  this.newUser = {};
        return false;
      }
      this.setUserType=userType
      this.params.CustomerQueryValue = val;
      this.params.CustomerQueryType = n;
      GetCustomerDataList(this.params).then(res => {
        if (res.data.length == 0) {
          this.$message({
            message: "未查询到用户！",
            type: "error",
            duration: 4000
          });
          if (userType == 1) this.user = {};
          else this.newUser = {};
        } else if (res.data.length == 1) {
          if (userType == 1) this.user = res.data[0];
          else this.newUser = res.data[0];
        } else {
          this.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
    },
    change() {
      this.postData.oneCustomerId=this.user.Id
      this.postData.twoCustomerId=this.newUser.Id
      if (!this.postData.oneCustomerId||!this.postData.twoCustomerId) {
        this.$message({
          message: "请先查询需要换表的用户信息！",
          type: "error",
          duration: 4000
        });
        return;
      }
      this.changeFunc()
    },
    //进行过户操作
    changeFunc() {
      Exchange(this.postData).then(res => {
        this.$message({
          message: "操作成功！",
          type: "success",
          duration: 4000
        });
        this.user = {};
        this.newUser = {};
      });
    },
    handleFilter(val) {
      if(this.setUserType==1){
        this.user = val;
      }else{
         this.newUser=val
      }
    },
    // IC卡读卡
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
  }
};
</script>
<style lang="scss" scoped>
.top-title {
  color: #535353;
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
  .short-input {
    width: 80px;
    /deep/ input.el-input__inner {
      width: 100% !important;
    }
  }
  .left-input {
    width: 160px !important;
    /deep/ input.el-input__inner {
      width: 100% !important;
    }
    /deep/ .el-select > .el-input {
      width: 150px !important;
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
.big-margin-label {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
