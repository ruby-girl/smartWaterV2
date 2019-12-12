<template>
  <div class="section-container secur-setting">
    <el-tabs v-model="typeCheck">
      <el-tab-pane label="低保户管理" name="1">
        <user-secur-mangment @getDetaile="getDetaile" @goHisWeb="comeHisWeb" />
      </el-tab-pane>
      <el-tab-pane label="历史记录 " name="2">
        <user-secur-order ref="order" @getDetaile="getDetaile" />
      </el-tab-pane>
    </el-tabs>
    <secur-dataile ref="detaile" :detaileData="detaileData" />
  </div>
</template>
<script>
import UserSecurMangment from "./components/UserSecurMangment"; //低保户管理
import UserSecurOrder from "./components/UserSecurOrder"; //历史
import SecurDataile from "./components/SecurDataile"; //详情
import { getInssureDetaile } from "@/api/inSecur";
export default {
  name: "UserSecur",
  components: { UserSecurMangment, UserSecurOrder, SecurDataile },
  data() {
    return {
      typeCheck: "1",
      detaileData: {}
    };
  },
  methods: {
    //详情
    getDetaile(id) {
      getInssureDetaile({ InsuredMessageId: id }).then(res => {
        detaileData: {
        }
        this.detaileData = res.data;
        this.$refs.detaile.dialogVisible = true;
      });
    },
    //历史
    comeHisWeb(CustomerNo) {
      this.typeCheck = "2";
      this.$refs.order.getText(
        CustomerNo,
        "CustomerQueryValue",
        "",
        "用户编号"
      );
      this.$nextTick(function() {
        this.$refs.order.$refs.selected.selectHead.CustomerQueryType = "1";
        this.$refs.order.$refs.selected.selectHead.CustomerQueryValue = CustomerNo;
        this.$refs.order.seachAccountOrder();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-setting {
  .el-tabs {
    background: #fff;
    height: 100%;
    /deep/.el-tabs__header {
      background: #eee;
      margin: 0;
    }
    /deep/.el-tabs__content {
      padding: 14px 12px;
    }
  }
}
</style>