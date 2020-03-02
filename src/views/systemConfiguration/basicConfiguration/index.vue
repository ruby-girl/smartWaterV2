<template>
  <div class="section-container">
    <div class="section-full-container">
      <div class="box-container">
        <div class="box-item">
          <div class="border-bottom">
            <config-title title="系统配置" />
            <switch-item label="开启多人口家庭用水量" :swithValue.sync="postData.IsMorePeople" />
            <div class="font-small" v-show="postData.IsMorePeople=='1'?true:false">
              人口基数为
              <input
                type="text"
                class="config-input"
                @blur="handleInput('PopulationBase',$event)"
                v-model="postData.PopulationBase"
              />人时，每个阶梯结算周期内，增加各阶梯水量
              <input
                type="text"
                class="config-input"
                @blur="handleInputDelDecimalFloat('PeopleAddYield',$event)"
                v-model="postData.PeopleAddYield"
              />吨；每增加
              <input
                type="text"
                class="config-input"
                @blur="handleInput('AddPeopleNum',$event)"
                v-model="postData.AddPeopleNum"
              />人，
              <div>
                增加各阶梯水量
                <input
                  type="text"
                  @blur="handleInputDelDecimalFloat('AddPeopleNumAddYield',$event)"
                  class="config-input"
                  v-model="postData.AddPeopleNumAddYield"
                />吨。（此配置只针对居民用水）
              </div>
            </div>
          </div>
          <div class="pt-15">
            <switch-item label="开启固定减免" :swithValue.sync="postData.IsInsuredMessageWaterAllowance" />
            <div
              class="pr-15 font-small"
              v-show="postData.IsInsuredMessageWaterAllowance=='1'?true:false"
            >
              低保户
              <input
                type="text"
                class="config-input"
                @blur="handleInputDelDecimalFloat('InsuredMessageWaterAllowance',$event)"
                v-model="postData.InsuredMessageWaterAllowance"
              />吨/户表.月
            </div>
          </div>
        </div>
        <!-- 费用设置 -->
        <div class="box-item">
          <div class="border-bottom">
            <config-title title="费用设置" />
            <switch-item label="是否开启违约金" :swithValue.sync="postData.OverdueFineState" />
            <div class="font-small" v-show="postData.OverdueFineState=='1'?true:false">
              费用生成月的下
              <el-select v-model="postData.OverdueParam.Month" size="small" class="small-select">
                <el-option value="1">1</el-option>
                <el-option value="2">2</el-option>
                <el-option value="3">3</el-option>
                <el-option value="4">4</el-option>
              </el-select>月的
              <el-select v-model="postData.OverdueParam.MonthDay" size="small" class="small-select">
                <el-option value="1">1</el-option>
                <el-option value="2">2</el-option>
                <el-option value="3">3</el-option>
                <el-option value="4">4</el-option>
              </el-select>日起，每日收取总金额
              <input
                type="text"
                v-model="postData.OverdueParam.InterestRate"
                @blur="handleInputDelDecimalFloat('OverdueParam',$event,'InterestRate')"
                class="config-input"
              />‰，违约金总额不高于总金额的
              <input
                type="text"
                class="config-input"
                @blur="handleInputDelDecimalFloat('OverdueParam',$event,'OverdueFineUpBound')"
                v-model="postData.OverdueParam.OverdueFineUpBound"
              />％。
            </div>
          </div>
          <div class="pt-15">
            <switch-item label="开启垃圾费" :swithValue.sync="postData.IsGarbage" />
            <div class="pr-15 font-small" v-show="postData.IsGarbage=='1'?true:false">
              每月收费
              <input
                type="text"
                @blur="handleInputDelDecimalFloat('GarbageCost',$event)"
                class="config-input"
                v-model="postData.GarbageCost"
              />元。
            </div>
          </div>
        </div>
        <!-- 提醒设置 -->
        <div class="box-item">
          <div class="border-bottom">
            <config-title title="提醒设置" />
            <switch-item label="低保户生效日期到期消息提醒" :swithValue.sync="postData.IsInsuredMessageNotify" />
            <div class="font-small" v-show="postData.IsInsuredMessageNotify=='1'?true:false">
              低保户到期前
              <el-select
                v-model="postData.InsuredMessageRecheckMonth"
                size="small"
                class="small-select"
              >
                <el-option value="1">1</el-option>
                <el-option value="2">2</el-option>
                <el-option value="3">3</el-option>
              </el-select>月进行对用户发送短信提醒，短信模板
              <el-select
                v-model="postData.InsuredMessageShortMsgTempleteId"
                size="small"
                class="medium-select"
              >
                <el-option
                  value="dbhdq"
                  label="低保户到期提醒"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="pt-15">
            <switch-item
              label="当带阀水表用户当日用水量高于预警量是,发送预警消息"
              :swithValue.sync="postData.IsWaterYieldAlarmMsg"
            />
            <div
              class="font-small border-bottom"
              style="padding-bottom:10px;"
              v-show="postData.IsWaterYieldAlarmMsg=='1'?true:false"
            >
              是否发送短信至用户
              <el-select size="small" class="small-select" v-model="postData.IsSendToCustomer">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>请选择收短信的
              <span class="text-decoration" @click="selectUserShow=true">工作人员</span>，短信模板
              <el-select
                size="small"
                class="medium-select"
                v-model="postData.WaterYeildAlarmShortMsgTempleteId"
              >
                <el-option
                  value="yjtx"
                  label="用户用水预警提醒"
                ></el-option>
              </el-select>
              <!-- 增加的预警列表 s -->
              <div v-for="(item,i) in postData.CaliberAlarmVal">
                当水表口径为
                <el-select
                  @change="filterCaliberSize()"
                  size="small"
                  v-model="item.CaliberSize"
                  :class="{'small-select':true,'error-border':item.isError}"
                >
                  <el-option :value="i" v-for="i in item.option" :key="i+1">{{i}}</el-option>
                </el-select>时，预警量为
                <input
                  type="text"
                  @blur="handleInputForin($event,i)"
                  class="config-input"
                  v-model="item.AlarmVal"
                />
                <i
                  class="iconfont iconicon-test main-color pointer"
                  v-show="i==postData.CaliberAlarmVal.length-1"
                  @click="pushCaliberAlarmVal"
                ></i>
                <i
                  class="iconfont icon- main-color-pink pointer"
                  v-show="i!==postData.CaliberAlarmVal.length-1"
                  @click="delCaliberAlarmVal(i)"
                ></i>
              </div>
              <!-- 增加的预警列表 e -->
            </div>
            <div>
              <switch-item label="用户欠费是否发送短信" :swithValue.sync="postData.IsSendBalanceLessMsg" />
              <switch-item
                label="用户余额不足是否发送短信"
                :swithValue.sync="postData.IsSendArrearsClosingValveMsg"
              />
              <switch-item
                label="用户充值到账是否发送短信"
                :swithValue.sync="postData.IsSendRechargeToAccountMsg"
              />
            </div>
          </div>
        </div>
        <!-- 水表设置 -->
        <div class="box-item">
          <div class="border-bottom" style="padding-bottom: 5px;">
            <config-title title="水表设置" />
            <div class="box-item-bottom-border">
              <switch-item label="支持非卡表用户开卡" :swithValue.sync="postData.IsOpenCard" />
            </div>
            <switch-item label="远传表欠费关阀" :swithValue.sync="postData.IsCloseValve" />
          </div>
          <div class="pt-15" v-show="postData.IsCloseValve=='1'?true:false">
            <div style="font-size:18px;">远传表不关阀时间</div>
            <div class="font-small">
              节假日欠费是否不关阀
              <el-select
                size="small"
                v-model="postData.IsHolidayNotCloseValve"
                class="small-select"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </div>
            <div class="font-small" v-for="(item,i) in postData.NotColseTimes">
              <span v-show="i==0">自定义不关阀时间</span>
              <span v-show="i!==0">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
              <el-date-picker
                v-model="item.timevalue"
                type="datetimerange"
                :editable="false"
                :unlink-panels="true"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="getTime(i)"
              ></el-date-picker>
              <i
                class="iconfont iconicon-test main-color pointer"
                v-show="i==postData.NotColseTimes.length-1"
                @click="pushTime"
              ></i>
              <i
                class="iconfont icon- main-color-pink pointer"
                v-show="i!==postData.NotColseTimes.length-1"
                @click="delTime(i)"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center box-absolute" v-permission="['241']">
        <el-button size="mini" type="primary" @click="confirm">确认</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
      <config-select-user
        :show.sync="selectUserShow"
        :ReceiveSortMsgEmp.sync="postData.ReceiveSortMsgEmpArr"
      />
    </div>
  </div>
</template>
<script>
let checkedOption = []; //已经选中的口径
let option = [15, 20, 25, 40, 50, 65, 80, 100, 150, 200];
import ConfigTitle from "./components/ConfigTitle";
import SwitchItem from "./components/SwitchItem";
import ConfigSelectUser from "./components/ConfigSelectUser";
import { AddBasicConfigInfo, GetBasicConfigVal } from "@/api/basicConfig";
import { getTemplateName } from "@/api/shotMsg"; //获取模板下拉框
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { delDecimal,delDecimal_float } from "@/utils/index";
export default {
  name: "basicConfig",
  components: { SwitchItem, ConfigTitle, ConfigSelectUser },
  directives: { permission },
  data() {
    return {
      postData: {
        IsMorePeople: "0", //是否开启多人口
        PopulationBase: "", //人口基数
        PeopleAddYield: "", //每个阶梯结算周期内，增加各阶梯水量xx吨 ,
        AddPeopleNum: "", //每增加XX人 ,
        AddPeopleNumAddYield: "", //各阶梯增加水量xx吨 ,
        IsInsuredMessageWaterAllowance: "1", //是否开启低保户固定减免 0否 1是
        InsuredMessageWaterAllowance: "", //低保户水量固定减免
        OverdueFineState: "0", //是否开启违约金 0否 1是
        OverdueParam: {
          //违约金计算公式 ,
          OverdueFineTimeType: "1",
          Day: 0,
          Month: "",
          MonthDay: "",
          InterestRate: "",
          OverdueFineUpBound: "" //违约金上限
        },
        IsGarbage: "0", //是否开启垃圾费 0否 1是
        GarbageCost: "", //垃圾费
        IsInsuredMessageNotify: "0", //是否开启低保户到期消息提醒 0关 1开 true开 false关 ,
        InsuredMessageRecheckMonth: "", //低保户到期前 x月进行对用户发送短信提醒
        InsuredMessageShortMsgTempleteId: "dbhdq", //短信模板
        IsWaterYieldAlarmMsg: "0", // 当带阀水表用户当日用水量高于预警量时，是否发送预警消息 0否 1是
        IsSendToCustomer: "0", //当带阀水表用户当日用水量高于预警量时，是否发送短信至用户 0否 1是
        ReceiveSortMsgEmp: "", //接受短信的员工Id列表 用逗号分隔 ,
        ReceiveSortMsgEmpArr: [],
        WaterYeildAlarmShortMsgTempleteId: "yjtx", //预计发送短信的模板 ,
        CaliberAlarmVal: [], //水表口径及对应的报警值 ,例[{CaliberSize:20,AlarmVal:110},{CaliberSize:25,AlarmVal:120}]
        IsOpenCard: "0", //是否开启制卡和补卡 支持非卡表用户开卡
        IsCloseValve: "0", //远传表欠费是否关阀 0否 1是
        IsHolidayNotCloseValve: "0", //远传表节假日是否不关阀 0否 1是
        NotColseTimes: [], //自定义不关阀时间
        IsSendBalanceLessMsg: "0", //是否发送余额不足短信
        IsSendArrearsClosingValveMsg: "0", //是否发送欠费关阀短信
        IsSendRechargeToAccountMsg: "0" //是否发送充值到账短信
      },
      timevalue: "",
      editStarDate: "",
      editEndDate: "",
      selectUserShow: false,
      templateNmaeList: []
    };
  },
  mounted() {
    // getTemplateName({ isSysTemplate: "" }).then(res => {
    //   this.templateNmaeList = res.data;
    // });
    GetBasicConfigVal().then(res => {
      res.data.NotColseTimes.forEach(item => {
        item.timevalue = [];
        item.timevalue.push(item.StarDate);
        item.timevalue.push(item.EndDate);
      });
      this.postData = res.data;
      // 回填下拉框口径
      this.filterCaliberSize();
      this.initArr();
      this.setTime();
    });
  },
  methods: {
    initArr() {
      //如果后台返回的NotColseTimes CaliberAlarmVal为空，push一个对象显示,处理接收短信工作人员，切割为数组
      if (this.postData.NotColseTimes.length < 1) {
        let obj = {
          StarDate: "",
          EndDate: "",
          timevalue: []
        };
        this.postData.NotColseTimes.push(obj);
      }
      if (this.postData.CaliberAlarmVal.length < 1) {
        let obj = {
          CaliberSize: "",
          AlarmVal: "",
          option: [15, 20, 25, 40, 50, 65, 80, 100, 150, 200]
        };
        this.postData.CaliberAlarmVal.push(obj);
      }
      this.postData.ReceiveSortMsgEmpArr = this.postData.ReceiveSortMsgEmp.split(
        ","
      );
    },
    handleInput(model, e, i) {
      if (i) this.postData[model][i] = delDecimal(e.target.value);
      else this.postData[model] = delDecimal(e.target.value);
    },
    handleInputForin(e, index) {
      this.postData.CaliberAlarmVal[index].AlarmVal = delDecimal_float(
        e.target.value
      );
    },
    handleInputDelDecimalFloat(model, e, i){
      if (i) this.postData[model][i] = delDecimal_float(e.target.value);
      else this.postData[model] = delDecimal_float(e.target.value);    
    },
    cancel() {
      GetBasicConfigVal().then(res => {
        this.postData = res.data;
        // 回填下来框口径
        this.filterCaliberSize();
        this.initArr();
      });
    },
    confirm() {
      if (!this.testValue()) {
        this.$message({
          message: "添加的预警量不能为空或0!",
          type: "error"
        });
        return;
      }
      this.handleTime(); //清除没有选择时间的选项
      this.postData.ReceiveSortMsgEmp = this.postData.ReceiveSortMsgEmpArr.join(
        ","
      );
      AddBasicConfigInfo(this.postData).then(res => {
        this.$message({
          message: "配置成功！",
          type: "success"
        });
      });
    },
    // 验证口径-预警量
    testValue() {
      if (this.postData.IsWaterYieldAlarmMsg == "1") {
        let isNotPass = this.postData.CaliberAlarmVal.some(item => {
          return !item.AlarmVal;
        });
        if (isNotPass) return false;
        else return true;
      }
      return true;
    },
    getTime(n) {
      this.postData.NotColseTimes.forEach((item, i) => {
        if (n == i) {
          if (item.timevalue) {
            item.StarDate = item.timevalue[0];
            item.EndDate = item.timevalue[1];
          } else {
            item.StarDate = "";
            item.EndDate = "";
          }
        }
      });
    },
    setTime() {
      //回填时间
      this.postData.NotColseTimes.forEach(item => {
        item.timevalue = [];
        item.timevalue.push(item.StarDate);
        item.timevalue.push(item.EndDate);
      });
    },
    // 处理自定开阀时间   s
    pushTime() {
      let obj = {
        StarDate: "",
        EndDate: ""
      };
      this.postData.NotColseTimes.push(obj);
    },
    delTime(i) {
      this.postData.NotColseTimes = this.postData.NotColseTimes.filter(
        (item, index) => {
          return index !== i;
        }
      );
    },
    handleTime() {
      //清除没有选择时间的选项
      this.postData.NotColseTimes = this.postData.NotColseTimes.filter(item => {
        return item.StarDate;
      });
    },
    // 处理口径 预警数组
    pushCaliberAlarmVal() {
      this.filterCaliberSize();
      let obj = {
        CaliberSize: "",
        AlarmVal: "",
        option: []
      };
      obj.option = option.filter(key => !checkedOption.includes(key)); //处理新增加里可以选择的下拉框的值
      this.postData.CaliberAlarmVal.push(obj);
    },
    delCaliberAlarmVal(i) {
      this.postData.CaliberAlarmVal = this.postData.CaliberAlarmVal.filter(
        (item, index) => {
          return index !== i;
        }
      );
    },
    // 判断口径是否有相同的,处理所有下拉框可选值
    filterCaliberSize() {
      checkedOption = [];
      this.postData.CaliberAlarmVal.forEach((item, index) => {
        checkedOption.push(item.CaliberSize);
      }); //先获取已选定的全部口径
      this.postData.CaliberAlarmVal.forEach((item, index) => {
        item.option = option.filter(
          key => !checkedOption.includes(key) || key == item.CaliberSize
        ); //重新计算已经添加的组里下拉框选项
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.section-container {
  color: #5b5b5b;
  padding: 0;
  .box-container {
    height: calc(100vh- 100px);
  }
  .config-input {
    border: none;
    border-bottom: 1px solid #8c9299;
    width: 60px;
    text-align: center;
    &:focus {
      outline: none;
    }
  }
  .font-small {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .border-bottom {
    border-bottom: 1px solid #d3d6e0;
  }
  .pt-15 {
    padding-top: 10px;
  }
  .small-select {
    /deep/ .el-input--small .el-input__inner {
      width: 90px;
      height: 26px;
    }
  }
  .medium-select {
    /deep/ .el-input--small .el-input__inner {
      width: 136px;
      height: 26px;
    }
  }
}
.box-item {
  line-height: 33px;
  padding: 10px 15px;
  background: #fff;
  border-bottom: 5px solid #eee;
  margin-bottom: 10px;
  .box-item-bottom-border {
    border-bottom: 1px solid #d3d6e0;
    margin-bottom: 5px;
    padding-bottom: 5px;
  }
}
.section-full-container {
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 10px;
  background: #eee;
}
.text-decoration {
  border-bottom: 1px solid #00b2a1;
  color: #00b2a1;
  cursor: pointer;
}
.error-border {
  border: 1px solid #f56c6c;
}
/deep/ .el-range-editor--medium.el-input__inner {
  height: 30px;
  .el-range-input {
    width: 52%;
  }
  .el-range__close-icon {
    position: relative;
    margin-top: -5px;
  }
  .el-range-separator {
    line-height: 23px;
  }
}
.box-absolute{
  position: absolute;
  width: 100%;
  background: #eee;
  padding-top: 10px;
  bottom:0;
}
</style>

