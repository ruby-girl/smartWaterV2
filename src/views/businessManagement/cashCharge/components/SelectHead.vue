<template>
  <div>
    <div class="display-flex align-items-center justify-content-flex-justify user-bottom">
      <el-form
        :inline="true"
        :model="selectHead"
        class="head-search-form form-inline-small-input"
        size="small"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="">
          <el-select
            v-model="selectHead.CustomerQueryType"
            placeholder="请选择"
           class="user-select-box"
          style="width: 100px;float: left;margin-right:3px;"
          >
            <el-option v-for="item in typeOption" :key="item.Id" :label="item.Name" :value="item.Id" />
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
          <el-button type="primary" round="" size="mini" @click="handleFilter">
            <i class="iconfont iconsousuo"></i>搜索
          </el-button>
          <el-button  class="special-btn" round="" size="mini" @click="handleFilterIC" v-permission="['152']">
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

    <!-- <el-row class="head-bottom-box">
      <el-col :md="8" :lg="3" :xl="2"><span>姓名:</span><span>{{user.CustomerName}}</span>
      </el-col>
      <el-col :md="8" :lg="4" :xl="3">
        水表类型:
        <span>{{user.WaterMeterTypeName}}</span>
      </el-col>
      <el-col :md="8" :lg="4" :xl="3">
        电话:
        <span>{{user.Tel}}</span>
      </el-col>
      <el-col :md="8" :lg="6" :xl="4">
        水表编号:
        <span>{{user.SA_WaterMeterNo}}</span>
      </el-col>
      <el-col :md="12" :lg="7" :xl="12" class="text-wrap">
        地址:
        <span>{{user.Address}}</span>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import { GetCustomerDataList } from "@/api/userSetting"; ////模糊查询用户
import { ICReadCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import permission from "@/directive/permission/index.js"; // 权限判断指令
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
  directives: {permission},
  watch: {
    headUser(val) {
      this.user = val;
    }
  },
  data() {
    return {
      timevalue: [],
      editUserList: [],
      user: {},
      typeOption:[     
        { Name: "用户编号", Id: "1" },
        { Name: "姓名/简码", Id: "2" },
        { Name: "水表编号", Id: "6" },
      ],
      secName:''
    };
  },
  methods: {
    getscName(val){
       this.typeOption.forEach(item => {
        if (item.Id == val) {
          this.secNmae = item.Name;
          this.getText(this.selectHead.CustomerQueryValue,'CustomerQueryValue','',item.Name);
        }
      });
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
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
      this.getUser()
    },
     handleFilterIC() {
      try {
        // 读卡
        ICReadCardInfo((resData)=>{
          this.getUser(resData)    
        },error=>{
           this.user={}
          this.$emit("clearData");
        })
      } catch (error) {
        console.log("请在CS端操作1");
      }
    },
     // 查询用户信息
    getUser(info){
      let postData={} 
      if(info){
        this.$emit("update:icInfo",info)
        if(info.CardType==1){
          postData.CustomerQueryValue=info.UserCardCredited.CardNo;
          postData.CustomerQueryType="8";
          postData.page=1;
          postData.limit=20
        }
        else{
          postData.CustomerQueryValue=info.UserCard.CardNo;
          postData.CustomerQueryType="8";
          postData.page=1;
          postData.limit=20
        }
      }else{ 
        postData=Object.assign({},this.selectHead)
      }
      GetCustomerDataList(postData).then(res => {
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
          if(info&&this.user.WaterMeterTypeId=='1102') this.$emit("handleFilterIcParent", res.data[0]);
          else if(!info&&this.user.WaterMeterTypeId=='1102'){
             this.$message({
            message: "卡表用户请先读卡！",
            type: "error",
            duration: 4000
          });
          this.user={}
          this.$emit("clearData");
          }else{
            this.$emit("handleFilter", res.data[0]);
          }
        }else {
          this.$parent.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
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
  padding-bottom: 10px;
  cursor: pointer;
  position: relative;
  .payment-num {
    position: absolute;
    background: #ff5656;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    line-height: 12px;
    font-size: 12px;
    top: -20px;
    right: 15px;
    color: #fff;
    text-align: center;
  }
  .payment-num {
    position: absolute;
    background: #ff5656;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    top: -20px;
    right: 15px;
    color: #fff;
    text-align: center;
  }
}
.head-bottom-box {
  background: #f5f5f5;
  padding: 15px;
  line-height: 30px;
  font-size: 14px;
}
.user-bottom{
  margin-bottom: 60px;
}
</style>

