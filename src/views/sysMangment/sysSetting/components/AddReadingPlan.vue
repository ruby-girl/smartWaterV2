<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="560px"
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
      <el-form-item label="模板名称">
        <el-input v-model="addPlanData.name"></el-input>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-select v-model="addPlanData.region" placeholder="请选择模板类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板内容">
        <el-input type="textarea" :rows="10" v-model="addPlanData.desc"></el-input>
      </el-form-item>
      <el-form-item label="发送方式">
        <el-radio-group v-model="addPlanData.resource">
          <el-radio label="自动发送"></el-radio>
          <el-radio label="手动发送"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-radio-group v-model="addPlanData.resource1">
          <el-radio label="及时发送"></el-radio>
          <el-radio label="定时发送"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定时发送时间">
        <el-date-picker
          v-model="addPlanData.value1"
          format="yyyy-MM-dd HH"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
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
          that.addPlanData.EndPlanDate = ETime;
          that.endDateLimit = {
            disabledDate(time) {
              return time.getTime() < new Date(res.data);
            }
          };
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
/deep/.el-form-item__content {
  width: 300px;
}
/deep/.el-input__inner {
  width: 300px !important;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 300px !important;
}
.el-form-item{
  margin-top: 18px;
  margin-bottom: 0;
}
</style>

