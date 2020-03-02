<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="30vh"
    width="760px"
    center
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      :model="addPlanData"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="水厂：">
        <el-select v-model="addPlanData.SA_WaterFactory_Id" placeholder="请选择" @change="setPlanDate">
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划抄表日期：" class="planDate" label-width="110px;">
        <el-date-picker
          v-model="addPlanData.StartPlanDate"
          type="date"
          disabled
          placeholder="选择日期时间"
        ></el-date-picker>
        <el-date-picker
          v-model="addPlanData.EndPlanDate"
          type="date"
          placeholder="选择日期时间"
          :picker-options="endDateLimit"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="addPlanData.IsAutoGenerateOrder">抄表计划到期后自动生成费用</el-checkbox>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="addMeterReadingPlan">确认</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getCompanyPlanDate, addMeterReadingPlan } from "@/api/plan";
export default {
  props: {
    addShow: {
      type: Boolean,
      default: false
    },
    companyOptions: {
      type: Array,
      default: []
    }
  },

  watch: {
    addShow() {
      this.AdialogFormVisible = this.addShow;
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:addShow", val);
    }
  },
  methods: {
    addMeterReadingPlan() {
      let that = this;
      if (!this.addPlanData.SA_WaterFactory_Id) {
        that.$message({
          message: "请选择水厂",
          type: "warning"
        });
        return false;
      }
      if (!this.addPlanData.EndPlanDate) {
        that.$message({
          message: "请选择抄表结束时间",
          type: "warning"
        });
        return false;
      }
      const dateTime = this.addPlanData.EndPlanDate.split(" ")[0];
      this.addPlanData.EndPlanDate = dateTime + " 23:59:59";
      // this.addPlanData.StartPlanDate =this.addPlanData.StartPlanDate + " 00:00:00";

      addMeterReadingPlan(this.addPlanData).then(res => {
        if (res.code == 0) {
          this.AdialogFormVisible = false;
          this.addPlanData = {
            SA_WaterFactory_Id: "",
            StartPlanDate: "",
            EndPlanDate: "",
            PlanName: "",
            IsAutoGenerateOrder: "",
            IsApplyOtherFactory: false
          };
          that.$message({
            message: res.msg ? res.msg : "添加成功",
            type: "success"
          });
          this.$parent.searchTableList();
        } else {
          that.$message({
            message: res.msg ? res.msg : "添加失败",
            type: "warning"
          });
        }
      });
    },
    setPlanDate(n) {
      let that = this;
      getCompanyPlanDate({
        SA_WaterFactory_Id: that.addPlanData.SA_WaterFactory_Id
      }).then(res => {
        if (res.code == 0) {
          that.addPlanData.StartPlanDate = res.data;
          const ETime = res.data.split(" ")[0];
          that.addPlanData.EndPlanDate = that.getNextMonth(ETime);

          that.endDateLimit = {
            disabledDate(time) {
              return time.getTime() < new Date(res.data);
            }
          };
        }
      });
    },
    getNextMonth(time) {
      let date = new Date(time);
      let nextDate = new Date(date.setMonth(date.getMonth() + 1));
      let year = nextDate.getFullYear();
      let month = nextDate.getMonth() + 1;
      let day = nextDate.getDate();
      let nextMonth = year + "-" + month + "-" + day;
      let dateNum = new Date(nextMonth).getTime();
      let lastDay = new Date(dateNum - 24 * 60 * 60 * 1000);
      let lastyear = lastDay.getFullYear();
      let lastmonth = lastDay.getMonth() + 1;
      let lastday = lastDay.getDate();
      let lastnextMonth = lastyear + "-" + lastmonth + "-" + lastday;
      return lastnextMonth;
    }
  },
  data() {
    return {
      AdialogFormVisible: false,
      addPlanData: {
        SA_WaterFactory_Id: "",
        StartPlanDate: "",
        EndPlanDate: "",
        PlanName: "",
        IsAutoGenerateOrder: "",
        IsApplyOtherFactory: false
      },
      warterMeterPlanDate: [],
      endDateLimit: null
    };
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-top: 30px;
}
.planDate {
  /deep/.el-input__inner {
    width: 100% !important;
  }
}
</style>

