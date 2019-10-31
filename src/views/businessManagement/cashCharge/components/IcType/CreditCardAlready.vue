<template>
  <!-- 卡片-->
  <div>
    <div class="main-padding-20-y">
      <div class="ic-top-box display-flex align-items-center justify-content-flex-justify">
        <div>卡号：10123123</div>
        <div>用户已刷卡</div>
      </div>
      <div class="ic-box-border">
        <zebra-table label-left="日期"  label-right="前一月用水量"  value-left="2019:10-10 00:00:00"  value-right="10" :isGray="true"></zebra-table>
        <zebra-table label-left="月最低消费"  label-right="前二月用水量"  value-left="2019"  value-right="10" :isGray="false"></zebra-table>
        <zebra-table label-left="当前用水量"  label-right="前三月用水量"  value-left="2019"  value-right="10" :isGray="true"></zebra-table>
        <zebra-table label-left="表内累计流量"  label-right="前四月用水量"  value-left="2019"  value-right="10" :isGray="false"></zebra-table>
        <zebra-table label-left="是否强磁"  label-right="前五月用水量"  value-left="2019"  value-right="10" :isGray="true"></zebra-table>
        <zebra-table label-left="是否欠压"  label-right=""  value-left="2019"  value-right="" :isGray="false"></zebra-table>
      </div>
      <!-- 循环end -->
    </div>
  </div>
</template>
<script>
import ZebraTable from './ZebraTable'
export default {
  components: {ZebraTable},
  props: {},
  watch: {},
  data() {
    return {};
  },
  mounted() {},
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
}
</style>

