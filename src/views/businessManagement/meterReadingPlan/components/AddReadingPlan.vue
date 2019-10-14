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
      <el-form-item label="计划抄表日期：">
        <el-date-picker
          v-model="addPlanData.StartPlanDate"
          type="datetime"
          readonly
          placeholder="选择日期时间"
        ></el-date-picker>
        <el-date-picker
          v-model="addPlanData.EndPlanDate"
          type="datetime"
          default-time="23:59:59"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="addPlanData.IsAutoGenerateOrder">抄表计划到期后自动生成订单</el-checkbox>
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
      addMeterReadingPlan(this.addPlanData).then(res => {
        if (res.code == 0) {
          this.AdialogFormVisible = false;
          that.$message({
            message: res.msg ? res.msg : "添加成功",
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg ? res.msg : "warning",
            type: "success"
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
        }
      });
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
      warterMeterPlanDate: []
    };
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-top: 30px;
}
</style>

