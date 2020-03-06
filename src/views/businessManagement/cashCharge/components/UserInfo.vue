<template>
  <div>
    <el-row class="head-bottom-box 11" v-show="!isIC">
      <el-col :md="8" :lg="3" :xl="2">
        <span>姓名:</span>
        <span>{{user.CustomerName}}</span>
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
    </el-row>
    <div v-show="isIC">
      <div v-if="icInfo.UserCardCredited">
        <div
          :class="{'head-bottom-box display-flex align-items-center flex-wrap':true,'show-user':isShow}"
          v-show="icInfo.CardType==1"
        >
          <div class="user-item" v-for="(item,i) in list" :key="1+i">
            <span>{{item.label}}:</span>
            <span :class="{'addr-width':item.model=='Address'}">{{user[item.model]}}</span>
          </div>
          <!-- 已刷卡 -->
          <div class="user-item" v-for="(item,i) in readList" :key="i+'s'">
            <span>{{item.label}}:</span>
            <span
              v-if="item.model=='Year'"
            >{{icInfo.UserCardCredited.Year+'-'+icInfo.UserCardCredited.Month+'-'+icInfo.UserCardCredited.Day}}</span>
            <span
              v-else-if="item.model=='IsMagnetic'"
            >{{icInfo.UserCardCredited.IsMagnetic?'否':'是'}}</span>
            <span v-else-if="item.model=='IsBrown'">{{icInfo.UserCardCredited.IsBrown?'否':'是'}}</span>
            <span v-else>{{icInfo.UserCardCredited[item.model]}}</span>
          </div>
          <span class="show-more" @click="toggleShow()">{{txt}}</span>
        </div>
      </div>
      <div v-if="icInfo.UserCard">
        <!-- 未刷卡 -->
        <div
          :class="{'head-bottom-box display-flex align-items-center flex-wrap':true,'show-user':isShow}"
          v-show="icInfo.CardType==0"
        >
          <div class="user-item" v-for="(item,i) in list" :key="i+'a'">
            <span>{{item.label}}:</span>
            <span :class="{'addr-width':item.model=='Address'}">{{user[item.model]}}</span>
          </div>
          <div class="user-item" v-for="(item,i) in noReadList" :key="i+'b'">
            <span>{{item.label}}:</span>
            <span>{{icInfo.UserCard[item.model]}}</span>
          </div>
          <span class="show-more" @click="toggleShow()">{{txt}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["headUser", "icInfo", "isIC"],
  watch: {
    headUser(val) {
      this.user = val;
    }
  },
  data() {
    return {
      user: {},
      isShow: false,
      txt: "查看更多",
      list: [
        { label: "姓名", model: "CustomerName" },
        { label: "水表类型", model: "WaterMeterTypeName" },
        { label: "电话", model: "Tel" },
        { label: "水表编号", model: "SA_WaterMeterNo" },
        { label: "地址", model: "Address" }
      ],
      readList: [
        { label: "卡号", model: "CardNo" },
        { label: "日期", model: "Year" },
        { label: "月最低消费(元)", model: "MonthlyMinimumSpending" },
        { label: "当前用水量(吨)", model: "ThisMonthUse" },
        { label: "表内累计流量(吨)", model: "CumulativeFlow" },
        { label: "是否强磁", model: "IsMagnetic" },
        { label: "是否欠压", model: "IsBrown" },
        { label: "前一月用水量(吨)", model: "BeforeOneUse" },
        { label: "前二月用水量(吨)", model: "BeforeTwoUse" },
        { label: "前三月用水量(吨)", model: "BeforeThreeUse" },
        { label: "前四月用水量(吨)", model: "BeforeFourUse" },
        { label: "前五月用水量(吨)", model: "BeforeFiveUse" }
      ],
      noReadList: [     
        { label: "卡号", model: "Tel" },
        { label: "水表口径", model: "MeterDiameter" },
        { label: "充值次数", model: "RechargeCount" },
        { label: "充值金额", model: "RechargeMoney" },
        { label: "量不足提示量(吨)", model: "InsufficientAmountTips" },
        { label: "月最低消费(元)", model: "MonthlyMinimumSpending" },
        { label: "一阶单价", model: "FirstPrice", start: "一", num: "0" },
        {
          label: "二阶单价",
          model: "SecondPrice",
          start: "二",
          num: "SecondAmount"
        },
        {
          label: "三阶单价",
          model: "ThirdPrice",
          start: "三",
          num: "ThirdAmount"
        }
      ]
    };
  },
  methods: {
    toggleShow() {
      console.info(this.icInfo);
      this.isShow = !this.isShow;
      if (this.isShow) this.txt = "收起";
      else this.txt = "查看更多";
    }
  }
};
</script>
<style lang="scss" scoped>
.head-bottom-box {
  background: #f5f5f5;
  padding: 8px 15px 8px 15px;
  line-height: 35px;
  font-size: 14px;
  position: absolute;
  top: 50px;
  width: calc(100% - 20px);
  height: 50px;
  overflow: hidden;
  z-index: 1111;
  border-radius: 4px;
  
}
.show-user {
  height: auto !important;
}
.show-more {
  position: absolute;
  right: 20px;
  top: 7px;
  color: #00b2a1;
  cursor: pointer;
}
.user-item {
  height: 35px;
  font-size: 14px;
  & span:first-child {
    height: 100%;
    display: inline-block;
    color: #777c82;
    display: inline-block;
    vertical-align:top;
  }
  & span:last-child {
    height: 100%;
    display: inline-block;
    color: #46494c;
  }
}
.addr-width{
  display: inline-block;
  max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
@media screen and (max-width: 1024px) {
  .user-item {
    width: 30%;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1200px) {
  .user-item {
    width: 25%;
  }
}
@media screen and (min-width: 1201px) and (max-width: 1600px) {
  .user-item {
    width: 20%;
  }
}
@media screen and (min-width: 1601px) {
  .user-item {
    width: 16%;
  }
}
</style>

