<template>
  <div class="section-container">
    <div class="section-full-container">
      <div class="box-item">
        <div class="border-bottom">
          <config-title title="系统配置" />
          <switch-item label="开启多人口家庭用水量" :swithValue.sync="postData.BasicParam.IsMorePeople" />
          <div class="font-small" v-show="postData.BasicParam.IsMorePeople==true?true:false">
            人口基数为
            <input type="text" class="config-input" v-model="postData.BasicParam.PopulationBase"/>人时，每个阶梯结算周期内，增加各阶梯水量
            <input type="text" class="config-input" v-model="postData.BasicParam.PeopleAddYield"/>吨；每增加
            <input type="text" class="config-input" v-model="postData.BasicParam.AddPeopleNum"/>人，
            <div>
              增加各阶梯水量
              <input type="text" class="config-input" v-model="postData.BasicParam.AddPeopleNumAddYield"/>吨。（此配置只针对居民用水）
            </div>
          </div>
        </div>
        <div class="pt-15">
          <switch-item
            label="开启固定减免"
            :swithValue.sync="postData.BasicParam.InsuredMessageWaterAllowance"
          />
          <div class="pr-15 font-small" v-show="postData.BasicParam.InsuredMessageWaterAllowance==true?true:false">
            低保户
            <input type="text" class="config-input" v-model="postData.BasicParam.AddPeopleNumAddYield"/>吨/户表.月
          </div>
        </div>
      </div>
      <!-- 费用设置 -->
      <div class="box-item">
        <div class="border-bottom">
          <config-title title="费用设置" />
          <switch-item label="是否开启违约金" :swithValue.sync="postData.BasicParam.OverdueFineState" />
          <div class="font-small"  v-show="postData.BasicParam.OverdueFineState==true?true:false">
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
              class="config-input"
            />‰，违约金总额不高于总金额的
            <input
              type="text"
              class="config-input"
              v-model="postData.OverdueParam.OverdueFineUpBound"
            />％。
          </div>
        </div>
        <div class="pt-15">
          <switch-item label="开启垃圾费" :swithValue.sync="postData.BasicParam.IsGarbage" />
          <div class="pr-15 font-small" v-show="postData.BasicParam.IsGarbage==true?true:false">
            每月收费
            <input type="text" class="config-input" v-model="postData.BasicParam.GarbageCost"/>元。
          </div>
        </div>
      </div>
      <!-- 提醒设置 -->
      <div class="box-item">
        <div class="border-bottom">
          <config-title title="提醒设置" />
          <switch-item
            label="低保户生效日期到期消息提醒"
            :swithValue.sync="postData.BasicParam.IsInsuredMessageNotify"
          />
          <div class="font-small" v-show="postData.BasicParam.IsInsuredMessageNotify==true?true:false">
            低保户到期前
            <el-select
              v-model="postData.BasicParam.InsuredMessageRecheckMonth"
              size="small"
              class="small-select"
            >
              <el-option value="1">1</el-option>
              <el-option value="2">2</el-option>
              <el-option value="3">3</el-option>
            </el-select>月进行对用户发送短信提醒，短信模板
            <el-select
              v-model="postData.BasicParam.InsuredMessageShortMsgTempleteId"
              size="small"
              class="medium-select"
            >
              <el-option value="1">1</el-option>
              <el-option value="2">2</el-option>
            </el-select>
          </div>
        </div>
        <div class="pt-15">
          <switch-item
            label="当带阀水表用户当日用水量高于预警量是,发送预警消息"
            :swithValue.sync="postData.BasicParam.IsWaterYieldAlarmMsg"
          />
          <div class="font-small" v-show="postData.BasicParam.IsWaterYieldAlarmMsg==true?true:false">
            是否发送短信至用户
            <el-select size="small" class="small-select" v-model="postData.BasicParam.IsSendToCustomer">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>请选择收短信的<span class="text-decoration" @click="selectUserShow=true">工作人员</span>，短信模板
            <el-select size="small" class="medium-select" v-model="postData.BasicParam.WaterYeildAlarmShortMsgTempleteId">
              <el-option value="1">1</el-option>
              <el-option value="2">2</el-option>
            </el-select>
            <div>
              当水表口径为
              <el-select
                size="small"
                v-model="caliberSize"
                class="medium-select"
              > 
                <el-option value="15">15</el-option>
                <el-option value="20">20</el-option>
                <el-option value="25">25</el-option>
                <el-option value="40">40</el-option>
                <el-option value="50">50</el-option>
                <el-option value="65">65</el-option>
                <el-option value="80">80</el-option>
                <el-option value="100">100</el-option>
                <el-option value="150">150</el-option>
                <el-option value="200">200</el-option>
              </el-select>时，预警量为
              <input type="text" class="config-input" v-model="AlarmVal"/>
              <i class="iconfont iconicon-test main-color"></i>
            </div>
          </div>
        </div>
      </div>
      <!-- 水表设置 -->
      <div class="box-item">
        <div class="border-bottom" style="padding-bottom: 5px;">
          <config-title title="水表设置" />
          <div class="box-item-bottom-border">
             <switch-item label="支持非卡表用户开卡" :swithValue.sync="postData.BasicParam.IsOpenCard" />
          </div>
          <switch-item label="远传表欠费关阀" :swithValue.sync="postData.BasicParam.IsCloseValve" />
        </div>
        <div class="pt-15" v-show="postData.BasicParam.IsCloseValve==true?true:false">
          <div>远传表不关阀时间</div>
          <div class="font-small">
            节假日是否开阀
            <el-select
              size="small"
              v-model="postData.BasicParam.IsHolidayNotCloseValve"
              class="small-select"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </div>
          <div class="font-small">
            自定义开阀
            <el-date-picker v-model="timevalue" type="datetime" size="small" placeholder="选择日期时间"></el-date-picker>
          </div>
        </div>
      </div>
      <div class="text-center">
        <el-button size="mini" type="primary" @click="confirm">确认</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
      <config-select-user
      :show.sync="selectUserShow"
      :ReceiveSortMsgEmp.sync="postData.BasicParam.ReceiveSortMsgEmp"
    />
    </div> 
  </div>
</template>
<script>
import ConfigTitle from "./components/ConfigTitle";
import SwitchItem from "./components/SwitchItem";
import ConfigSelectUser from "./components/ConfigSelectUser";
import {AddWaterProperty} from "@/api/basicConfig"
export default {
  name: "basicConfig",
  components: { SwitchItem, ConfigTitle, ConfigSelectUser },
  data() {
    return {
      postData: {
        BasicParam: {
          IsMorePeople: true,
          PopulationBase: 1, //人口基数 ,
          PeopleAddYield: "", //每个阶梯结算周期内，增加各阶梯水量xx吨 ,
          AddPeopleNum: "", //每增加XX人 ,
          AddPeopleNumAddYield: "", //各阶梯增加水量xx吨 ,
          InsuredMessageWaterAllowance: true, //是否开启低保户固定减免 1否 0是 true是 false否 ,
          OverdueFineState: true, //是否开启违约金 1否 0是 true是 false否 ,
          OverdueParam: "", //违约金计算公式 ,
          IsGarbage: true, //是否开启垃圾费 1否 0是 true是 false否 ,
          GarbageDateType: "", //垃圾费收取方式，按年收取 YEAR，按月收取 MONTH ,
          GarbageCost: "", //垃圾费
          IsInsuredMessageNotify: true, //是否开启低保户到期消息提醒 0关 1开 true开 false关 ,
          InsuredMessageRecheckMonth: '1', //低保户到期前 x月进行对用户发送短信提醒
          InsuredMessageShortMsgTempleteId: "", //短信模板
          IsWaterYieldAlarmMsg: true, // 当带阀水表用户当日用水量高于预警量时，是否发送预警消息 0否 1是 true是 false否 ,
          IsSendToCustomer: '1', //当带阀水表用户当日用水量高于预警量时，是否发送短信至用户 0否 1是 true是 false否 ,
          ReceiveSortMsgEmp: "", //接受短信的员工Id列表 用逗号分隔 ,
          WaterYeildAlarmShortMsgTempleteId: "", //预计发送短信的模板 ,
          CaliberAlarmVal: "", //水表口径及对应的报警值 ,例[{caliberSize:20,AlarmVal:110},{caliberSize:25,AlarmVal:120}]
          IsOpenCard: true, //是否开启制卡和补卡 支持非卡表用户开卡 true是 false否 ,
          IsCloseValve: true, //远传表欠费是否关阀 0否 1是 true是 false否 ,
          IsHolidayNotCloseValve: '1', //远传表节假日是否不关阀 0否 1是 true是 false否 ,
          NotColseTimes: "" //自定义不关阀时间
        },
        OverdueParam: {
          OverdueFineTimeType: "1", //违约金类型 0：费用生成后N天开始执行(公式一) 1：N月后的Y日开始执行(公式二) ,
          Day: "", //费用生成后N天开始执行 ,
          Month: '1', // N月后的Y日开始执行 ,
          MonthDay: '2', //N月后的Y日开始执行 ,
          InterestRate: "", //违约金利率‰ ,
          OverdueFineUpBound: "" //违约金上限=本金*n％
        },
        WaterCaliberAlarmValue: {
          CaliberSize: "", //口径大小
          AlarmVal: "", //报警值 ,
          Id: "", //
          CreateTime: "",
          CreateUserId: "", //创建人ID
          EditTime: "",
          EditUserId: "", //修改人ID
          DataState: "" //是否有效
        },
        NotColseValveTime: {
          Id: "",
          StartTime: "",
          EndTime: "",
          DataState: "" //数据状态
        }
      },
      AlarmVal:'',//预警值，
      caliberSize:15,//水表口径
      timevalue: "",
      selectUserShow: false
    };
  },
  methods: {
    confirm() {
      console.info('人员',this.postData.BasicParam.ReceiveSortMsgEmp);
      AddWaterProperty(this.postData).then(res=>{
        
      })
    },
    cancel() {}
  }
};
</script>
<style lang="scss" scoped>
.section-container {
  color: #5b5b5b;
  padding: 0;
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
  .box-item-bottom-border{
    border-bottom: 1px solid #d3d6e0;
    margin-bottom: 5px;
    padding-bottom: 5px;
  }
}
.add-btn-config {
  border: 1px solid #00b2a1;
  color: #00b2a1;
  border-radius: 50%;
}
.section-full-container {
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 10px;
  background: #eee;
}
.text-decoration{
  border-bottom: 1px solid #00b2a1;
  color:#00b2a1;
  cursor: pointer;
}
</style>

