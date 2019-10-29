<template>
  <div class="section-container">
    <div>
      <div ref="formHeight" class="cash-padding-bg padding-20">
        <select-head :select-head="listQuery" @handleFilter="handleFilter" />
      </div>

      <!-- 表格模式 -->
      <el-row :gutter="10" class="container-bottom-box display-flex">
        <!-- 左边表格 -->
        <el-col :md="14" :lg="16" :xl="16" class="cash-padding-bg">
          <div class="table-top-btn-padding display-flex justify-content-flex-justify">
            <div class="display-flex">
              <el-tooltip popper-class="tooltip" content="卡片模式" placement="bottom" effect="light" :visible-arrow='false'>
              <div
                @click="type=2"
                :class="{'change-tab':true,'iconfont':true,'iconzu':true,'tab-active': this.type==2}"
              ></div>
              </el-tooltip>
              <el-tooltip  popper-class="tooltip" content="表格模式" placement="bottom" effect="light" :visible-arrow='false'>
              <div
                @click="type=1"
                :class="{'change-tab':true,'iconfont':true,'iconzu1':true,'tab-active': this.type==1}"
                style="border:none"
              ></div>
               </el-tooltip>
            </div>
            <div v-if="type==1">
              <el-button type="success" size="mini" @click="excel">
                <i class="iconfont icondaochuexcel"></i>导出Excel
              </el-button>
              <el-button type="warning" size="mini" @click="setCustomData()">
                <i class="iconfont iconbiaogezidingyi"></i>表格自定义
              </el-button>
            </div>
            <div v-else>
              <el-checkbox :indeterminate="isIndeterminateParent" v-model="checkedAllParent" @change="parentChange">全选</el-checkbox>
            </div>
          </div>
          <components
            :is="typeComponents"
            :listQuery="listQuery"
            :total="total"
            :tableHeight="tableHeight"
            ref="tableTypeCard"
            :tableData="tableData"
            :saveTableHeight="saveTableHeight"
            :checkedAllParent.sync="checkedAllParent"
            :isIndeterminateParent.sync="isIndeterminateParent"
            @details="details"
            @reset="reset"
            @feeWaiver="feeWaiver"
          ></components>
        </el-col>
        <!-- 左边表格end -->
        <!-- 右 -->
        <el-col :md="10" :lg="8" :xl="8" class="cash-padding-bg cash-right-box" :style="{'minHeight':saveTableHeight+'px'}">
          <right-box @selectPint="selectPint" @selectPayment="selectPayment"></right-box>
        </el-col>
        <!-- 右 -->
      </el-row>
    </div>
    <water-details :waterDetailsShow.sync="waterDetailsShow"></water-details>
    <over-details :overDetailsShow.sync="overDetailsShow"></over-details>
    <select-user :selectUserShow.sync="selectUserShow"></select-user>
    <fee-waiver :feeWaiverShow.sync="feeWaiverShow"></fee-waiver>
    <over-fee-waiver :overFeeWaiverShow.sync="overFeeWaiverShow"></over-fee-waiver>
    <select-pint :selectPintShow.sync="selectPintShow"></select-pint>
    <payment-code :paymentCodeShow.sync="paymentCodeShow"></payment-code>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import TableType from "./components/TableType";
import CardType from "./components/CardType";
import RightBox from "./components/RightBox";
import WaterDetails from "./components/WaterDetails";//水费详情弹窗
import OverDetails from "./components/OverDetails";//除水费外其它费用详情弹窗
import SelectUser from "./components/SelectUser";
import FeeWaiver from "./components/FeeWaiver";//水费减免弹窗
import OverFeeWaiver from "./components/OverFeeWaiver";//除水费外其它费用减免弹窗
import SelectPint from "./components/SelectPint";//选择打印机
import PaymentCode from "./components/PaymentCode";//扫码支付
import {
  getRolesList,
  addRole,
  updateRole,
  deleteRole,
  exportExcel
} from "@/api/role";
export default {
  name: "cashCharge",
  components: { SelectHead, TableType, CardType, RightBox,WaterDetails,OverDetails,SelectUser,FeeWaiver,OverFeeWaiver,SelectPint,PaymentCode},
  data() {
    return {
      total: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        roleName: "", // 角色名称
        editUserId: "-1", // 操作人
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000004"
      },
      type: 1, //左侧展示模式 1：表格 2：卡片
      typeComponents: "TableType", //默认表格模式
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableHeight: 0,
      tableData: [],
      saveTableHeight: 0,
      checkedAllParent: false, //全选
      isIndeterminateParent:false,//复选框属性
      waterDetailsShow:false,//水费详情弹窗
      overDetailsShow:false,//其它费用详情弹窗
      selectUserShow:false,//多用户选择弹窗
      feeWaiverShow:false,//费用减免弹窗
      overFeeWaiverShow:false,
      selectPintShow:false,//选择打印机
      paymentCodeShow:false//扫码支付弹窗
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 205;
      that.saveTableHeight = that.tableHeight+20;
      window.onresize = () => {
        that.tableHeight = document.body.clientHeight - formHeight - 205;
      };
    });
  },
  watch: {
    type(v, o) {
      this.typeComponents = v == 2 ? "CardType" : "TableType";
    }
  },
  methods: {
    getList() {
      getRolesList(this.listQuery).then(res => {
        this.total = res.count;
        res.data.filter(item => {
          if (item.Id == "ad0a3b59-f6c3-4a83-bca1-88a38b824e84") {
            //demo
            item.tooltip = "这是提示语句";
          }
        });
        this.tableData = res.data;
      });
    },
    setCustomData() {
      this.$refs.tableTypeCard.$refs.myChild.isCustom = !this.$refs
        .tableTypeCard.$refs.myChild.isCustom;
      if (this.$refs.tableTypeCard.$refs.myChild.isCustom)
        this.tableHeight = this.tableHeight - 105;
      else this.tableHeight = this.tableHeight + 105;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    delRow(r) {
      this.$confirm("是否删除当前信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        deleteRole(r.Id).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    createData(dialog) {
      addRole(dialog.RoleName).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        this.handleFilter();
      });
    },
    updateData(dialog) {
      updateRole(dialog.RoleName, dialog.Id).then(res => {
       this.dialogFormVisible = false;
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.getList();
      });
    },
    excel() {
      //导出
      exportExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    parentChange(v){
      this.isIndeterminateParent=false
    },
    // 费用详情
    details(n){
      this.waterDetailsShow=true
    },
    // 费用撤回
    reset(){
      this.$confirm("是否确认撤销欠费？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        // deleteRole(r.Id).then((res)=>{
        //   this.$message({
        //     message: res.message,
        //     type: "success",
        //     duration: 4000
        //   });
        //   this.getList()
        // })
      });
    },
    // 费用减免
    feeWaiver(){
      this.overFeeWaiverShow=true
    },
    // 选择打印机
    selectPint(){
      this.selectPintShow=true
    },
    // 选择支付方式
    selectPayment(i){
      if(i==2){
        this.paymentCodeShow=true
      }     
    }
  }
};
</script>
<style lang="scss" scoped>
.container-bottom-box {
  border-top: 15px solid #eff1f4;
  height:calc(100vh - 205px);
}
.cash-padding-bg {
  padding:0 20px 20px 20px !important;
  background: #fff;
}
.padding-20{
  padding: 20px !important;
}
.cash-right-box {
  border-left: 15px solid #eff1f4;
  padding: 15px;
  overflow: auto;
}
/deep/ .is-disabled .el-checkbox__inner {
  background: #B4BCC1 !important;
}
/deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label{
  color:#fff;
}
.change-tab {
  background: #f0f0f0;
  font-size: 13px;
  padding: 5px 20px 2px 20px;
  line-height: 24px;
  border-right: 1px solid #d9d9d9;
  cursor: pointer;
  color: #999999;
}
.tab-active {
  color: #00b2a1;
}
.tooltip{
  color:#ddd;
}

</style>