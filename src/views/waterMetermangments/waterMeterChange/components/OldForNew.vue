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
      <el-form
        class="head-search-form big-margin-label"
        :model="user"
        ref="oldUser"
        :rules="oldUser"
        label-width="86px"
        style="margin-top:10px;"
      >
        <el-form-item label="用户编号">
          <el-input
            class="left-input"
            v-model="user.CustomerNo"
            @keyup.enter.native="handleSelect(user.CustomerNo,1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            class="left-input"
            v-model="user.CustomerName"
            @keyup.enter.native="handleSelect(user.CustomerName,2)"
            placeholder="回车进行模糊查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="原水表类型">
          <el-input class="left-input" v-model="user.WaterMeterTypeName" :disabled="true"></el-input>
        </el-form-item>
        <!-- 机械或远传    -->
        <el-form-item
          label="原水表读数"
          prop="oldRead"
          v-show="user.WaterMeterTypeId==1101||user.WaterMeterTypeId==1103"
        >
          <el-input class="left-input" v-model="newUser.oldRead"></el-input>
        </el-form-item>
        <!-- 物联网 -->
        <el-form-item
          prop="wlwWaterYield"
          label="换表期间用水量"
          v-show="user.WaterMeterTypeId==1104"
          class="big-label-width"
        >
          <el-input class="left-input" v-model="newUser.wlwWaterYield"></el-input>
        </el-form-item>
        <el-form-item label="原水表编号">
          <el-input class="left-input" v-model="user.SA_WaterMeterNo" :disabled="true"></el-input>
        </el-form-item>
        <!-- IC -->
        <el-form-item label="表端余额" prop="meterBalance" v-show="user.WaterMeterTypeId==1102">
          <el-input class="left-input" v-model="newUser.meterBalance" :disabled="false"></el-input>
        </el-form-item>
        <!-- 物联网账户余额-->
        <el-form-item label="账户余额" v-show="user.WaterMeterTypeId==1104">
          <el-input class="left-input" v-model="user.Balance" :disabled="true"></el-input>
        </el-form-item>
        <!-- 物联网e -->
        <el-form-item label="账户余额" v-show="user.WaterMeterTypeId!==1104">
          <el-input class="left-input" v-model="user.Balance" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input class="left-input" v-model="user.Address" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="transfer-container" style="margin-top:13px;">
      <div class="display-flex align-items-center justify-content-flex-justify">
        <div class="font-weight pl-15 top-title">新水表信息</div>
      </div>
      <el-form
        class="head-search-form big-margin-label"
        :model="newUser"
        ref="user"
        :rules="rules"
        label-width="86px"
        style="margin-top:10px;"
      >
        <el-form-item label="新水表编号" prop="newWaterMeterNo" v-show="user.WaterMeterTypeId!==1101">
          <el-input class="left-input" v-model="newUser.newWaterMeterNo"  @blur="getNewWaterType(user.WaterMeterTypeId,newUser.newWaterMeterNo)"></el-input>
        </el-form-item>
        <el-form-item label="新水表编号" v-show="user.WaterMeterTypeId==1101">
          <el-input class="left-input" v-model="newUser.newWaterMeterNo"></el-input>
        </el-form-item> 
        <!-- 机械表 -->
        <el-form-item label="新水表读数" prop="newRead" v-show="user.WaterMeterTypeId==1101">
          <el-input class="left-input" v-model="newUser.newRead"></el-input>
        </el-form-item>
        <!-- 机械表 -->
         <!-- AB版物联网 -->
        <el-form-item label="报警量" prop="waterAmountAlarm" v-show="user.WaterMeterTypeId==1104&&newUser.isAB==2&&newUser.isAB!==isAB">
          <el-input class="left-input" v-model="newUser.waterAmountAlarm"></el-input>
        </el-form-item>
        <el-form-item label="透支量" prop="waterAmountOverdraft" v-show="user.WaterMeterTypeId==1104&&newUser.isAB==2&&newUser.isAB!==isAB">
          <el-input class="left-input" v-model="newUser.waterAmountOverdraft"></el-input>
        </el-form-item>
        <!-- AB版物联网 -->
        <!-- C版物联网 -->
        <el-form-item label="报警金额" prop="waterAmountAlarm" v-show="user.WaterMeterTypeId==1104&&newUser.isAB!==2&&newUser.isAB!==isAB">
          <el-input class="left-input" @blur="handleInputDelDecimalFloat('waterAmountAlarm',$event)" v-model="newUser.waterAmountAlarm"></el-input>
        </el-form-item>
        <el-form-item label="透支金额" prop="waterAmountOverdraft" v-show="user.WaterMeterTypeId==1104&&newUser.isAB!==2&&newUser.isAB!==isAB">
          <el-input class="left-input" @blur="handleInputDelDecimalFloat('waterAmountOverdraft',$event)" v-model="newUser.waterAmountOverdraft"></el-input>
        </el-form-item>
        <!-- C版物联网 -->

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="newUser.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-form class="is-page" v-show="user.WaterMeterTypeId=='1101'||user.WaterMeterTypeName=='1103'">
      <el-form-item label="字轮是否翻页">
        <el-radio-group v-model="newUser.isPage">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
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
import { OldChangeNew, GetICK_OldChangeNew } from "@/api/waterMeterMang";
import { GetCustomerDataList } from "@/api/userSetting"; //回车搜索
import SelectUser from "@/components/SelectUser";
import { ICReadCardInfo,WriteCardInfo } from "@/utils/projectLogic"; //IC卡读卡
import {RollBackICSettlement} from "@/api/cashCharge";
import { GetWLW_ABC_WaterMeterNo } from "@/api/waterMeterMang"//判断物联网是AB版还是C版
import {delDecimal_float } from "@/utils/index";
export default {
  components: { SelectUser },
  props: { ifShow: {} },
  data() {
    const validateNewRead = (rule, value, callback) => {
      if (!this.newUser.newRead && this.user.WaterMeterTypeId == 1101) {
        callback(new Error("必填"));
      } else {
        callback();
      }
    };
    const validateMeterBalance = (rule, value, callback) => {
      if (!this.newUser.meterBalance && this.user.WaterMeterTypeId == 1102) {
        //IC卡表端余额必填
        callback(new Error("必填"));
      } else {
        callback();
      }
    };
    const validateOldRead = (rule, value, callback) => {
      if (
        !this.newUser.oldRead &&
        (this.user.WaterMeterTypeId == 1101 ||
          this.user.WaterMeterTypeId == 1103)
      ) {   
        callback(new Error("必填"));
      } else {
        callback();
      }
    };
    const validatewlwWaterYield = (rule, value, callback) => {
      if (!this.newUser.wlwWaterYield && this.user.WaterMeterTypeId == 1104) {
        callback(new Error("必填"));
      } else {
        callback();
      }
    };
      const validateWaterAmountAlarm = (rule, value, callback) => {
      if (this.newUser.waterAmountAlarm==='' && this.user.WaterMeterTypeId == 1104&&this.newUser.isAB!==this.isAB) {    
        callback(new Error("必填"));
      } else {
        callback();
      }
     
    };
    const validateWaterAmountOverdraft = (rule, value, callback) => {
      if (this.newUser.waterAmountOverdraft==='' && this.user.WaterMeterTypeId == 1104&&this.newUser.isAB!==this.isAB) {      
        callback(new Error("必填"));
      } else {
        callback();
      }
      
    };
    const validateNewWaterMeterNo = (rule, value, callback) => {
      if (!this.newUser.newWaterMeterNo && this.user.WaterMeterTypeId !== 1101) {       
        callback(new Error("必填"));
      } else {
        callback();
      }
    };
    return {
      user: {
        WaterMeterTypeId: 1101
      },
      isAB:0,
      newUser: {
        customerId: "",
        oldRead: "", //读数（机械，远传必填）
        newWaterMeterNo: "", //新水表编号
        wlwWaterYield: "", //物联网用水量
        newRead: "", //新水表读数（机械表必填
        meterBalance: "", //IC卡表端余额
        remark: "", //备注
        isAB:1,
        isPage: false, //是否翻页
        waterAmountAlarm:'',//报警量或报警金额（AB—C，C—AB预付费传值
        waterAmountOverdraft:''//透支量或透支金额（AB—C，C—AB预付费传值）
      },
      params: {
        page: 1,
        Limit: 20,
        CustomerQueryType: "",
        CustomerQueryValue: ""
      },
      selectUserShow: false,
      rules: {
        newRead: [
          { required: true, trigger: "blur", validator: validateNewRead }
        ],
        waterAmountAlarm:[{ required: true, trigger: "blur", validator: validateWaterAmountAlarm }],
        waterAmountOverdraft:[{ required: true, trigger: "blur", validator: validateWaterAmountOverdraft }],
        remark: [{ required: true, message: "必填", trigger: "blur" }],
        newWaterMeterNo: [{ required: true, validator: validateNewWaterMeterNo,trigger: "blur" }]
      },
      oldUser: {
        meterBalance: [
          { required: true, trigger: "blur", validator: validateMeterBalance }
        ],
        oldRead: [
          { required: true, validator: validateOldRead, trigger: "blur" }
        ],
        wlwWaterYield: [
          { required: true, validator: validatewlwWaterYield, trigger: "blur" }
        ]
      }
    };
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
      this.getUser();
    },
    getNewWaterType(type,num){//新水表查询水表类型
      if(type==1104){
       this.getWLW(num,'newUser')
      }
    },
    change() {
      if (!this.user.CustomerNo) {
        this.$message({
          message: "请先查询需要换表的用户信息！",
          type: "error",
          duration: 4000
        });
        return;
      }
      let isPass,isNewPass;
      isPass = this.testUser();
      isNewPass = this.testNewUser();
      if (isNewPass && isPass) {
        this.changeRes();
      }
    },
    testUser() {
      let isPass;
      this.$refs["oldUser"].validate(valid => {
       isPass=valid  
      });
      return isPass
    },
    testNewUser() {
      let isPass;
      this.$refs["user"].validate(valid => {
        isPass=valid
      });
     return isPass
    },
    //进行过户操作
    changeRes() {
      let Func =
        this.user.WaterMeterTypeId == 1102 ? GetICK_OldChangeNew : OldChangeNew;
      Func(this.newUser).then(res => {

        this.$message({
          message: "操作成功！",
          type: "success",
          duration: 4000
        });
        if( this.user.WaterMeterTypeId == 1102){
          this.wCard(res.data)
        }
        this.user = {};
        this.newUser = {
          customerId: "",
          oldRead: "", //读数（机械，远传必填）
          newWaterMeterNo: "", //新水表编号
          wlwWaterYield: "", //物联网用水量
          newRead: "", //新水表读数（机械表必填）
          remark: "", //备注
          isPage: false //是否翻页
        };
      });
    },
     //换表成功，进行写卡操作
    wCard(Info) {    
        WriteCardInfo(Info, errorRes => {
          // 读卡
          // 错误回调，执行回滚
        RollBackICSettlement({ businessId: errorRes.BusinessId })      
        })  
    },
    handleFilter(val) {
      if (val.CustomerState != 1301) {
        this.$message({
          message: "请注意该用户状态不正常！",
          type: "error",
          duration: 4000
        });
        this.user = {};
        this.newUser.customerId = "";
        return;
      }
      if (val.WaterMeterTypeId == "1102") {
        this.$message({
          message: "卡表用户请先读卡！",
          type: "warning",
          duration: 4000
        });
        return;
      }
      this.user = val;
      this.newUser.customerId = val.Id;
      if(val.WaterMeterTypeId==1104) this.getWLW(val.SA_WaterMeterNo) 
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
        if (info.CardType !== 1) {
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
          this.newUser.customerId = "";
        } else if (res.data.length == 1) {
          if (info) {
            this.user = res.data[0];
            this.newUser.customerId = res.data[0].Id;          
            if(res.data[0].WaterMeterTypeId==1104) this.getWLW(res.data[0].SA_WaterMeterNo)
          } else {
            //如果不是读卡数据，查询出来是IC卡用户，提示需读卡操作
            if (res.data[0].CustomerState != 1301) {
              this.$message({
                message: "请注意该用户状态不正常！",
                type: "error",
                duration: 4000
              });
               this.user = {};
              this.newUser.customerId = "";
              return;
            }
            if (res.data[0].WaterMeterTypeId == "1102") {
              this.$message({
                message: "卡表用户请先读卡！",
                type: "warning",
                duration: 4000
              });
              return;
            } else {
              this.user = res.data[0];
              if(res.data[0].WaterMeterTypeId==1104){
                 this.getWLW(res.data[0].SA_WaterMeterNo)
              }
              this.newUser.customerId = res.data[0].Id;
            }
          }
        } else {
          this.selectUserShow = true; //查找出多个，弹出用户列表，进行选择
        }
      });
    },
    //查询物联网为AB版还是C版
    getWLW(Id,isNew){
      GetWLW_ABC_WaterMeterNo({WaterMeterNo:Id}).then(res=>{
        if(isNew) res.data=== 1104 ? this.newUser.isAB = 2: this.newUser.isAB = 1 //1104 AB版本 05 C版本
        else res.data=== 1104 ? this.isAB = 2: this.isAB = 1 //1104 AB版本 05 C版本
      })
    },
    handleInputDelDecimalFloat(model, e){
    this.newUser[model] = delDecimal_float(e.target.value);  
    },
    // 如果是AB->AB C->C,隐藏报警量透支量等输入框

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
      width: 160px !important;
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
.is-page {
  margin: 6px;
  /deep/ .el-radio-group {
    margin-left: 20px;
  }
}
/deep/ .el-form-item__content .el-textarea {
  width: 160px !important;
}
.big-label-width {
  /deep/ .el-form-item__label {
    line-height: 14px;
  }
}
.big-margin-label {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
