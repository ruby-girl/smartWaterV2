<template>
  <!-- 卡片-->
  <div>
    <div class="main-padding-20-y">
      <div class="ic-top-box display-flex align-items-center justify-content-flex-justify">
        <div>卡号：{{icInfo.UserCardCredited.CardNo}}</div>
        <div class="main-color" style="font-size:16px;">用户已刷卡</div>
      </div>
      <div class="ic-box-border">
        <zebra-table label-left="日期"  label-right="前一月用水量"  :value-left="icInfo.UserCardCredited.Year+'-'+icInfo.UserCardCredited.Month+'-'+icInfo.UserCardCredited.Day"  :value-right="icInfo.UserCardCredited.BeforeOneUse" :isGray="true"></zebra-table>
        <zebra-table label-left="月最低消费"  label-right="前二月用水量"  :value-left="icInfo.UserCardCredited.MonthlyMinimumSpending"  :value-right="icInfo.UserCardCredited.BeforeTwoUse" :isGray="false"></zebra-table>
        <zebra-table label-left="当前用水量"  label-right="前三月用水量"  :value-left="icInfo.UserCardCredited.ThisMonthUse"  :value-right="icInfo.UserCardCredited.BeforeThreeUse" :isGray="true"></zebra-table>
        <zebra-table label-left="表内累计流量"  label-right="前四月用水量"  :value-left="icInfo.UserCardCredited.CumulativeFlow"  :value-right="icInfo.UserCardCredited.BeforeFourUse" :isGray="false"></zebra-table>
        <zebra-table label-left="是否强磁"  label-right="前五月用水量"  :value-left="icInfo.UserCardCredited.IsMagnetic?'否':'是'"  :value-right="icInfo.UserCardCredited.BeforeFiveUse" :isGray="true"></zebra-table>
        <zebra-table label-left="是否欠压"  label-right=""  :value-left="icInfo.UserCardCredited.IsBrown?'否':'是'"  value-right="" :isGray="false"></zebra-table>
      </div>
      <!-- 循环end -->
    </div>
  </div>
</template>
<script>
import ZebraTable from './ZebraTable'
export default {
  components: {ZebraTable},
  props: {
    icInfo:{}
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.ic-box-border {
  border: 1px solid #dbe3e8;
  .ic-item:last-child{
      border:none;
  }
}
.ic-top-box{
    padding: 20px 0;
    color:#46494C;
    font-size: 14px;
}
</style>

