<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="10vh"
    width="560px"
    center
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      :model="ShortMsgTempParam"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
       :rules="rules"
    >
      <el-form-item label="模板名称">
        <el-input v-model="ShortMsgTempParam.TemplateName"></el-input>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-select v-model="ShortMsgTempParam.IsSysTemplate" placeholder="请选择模板类型">
          <el-option label="自定义" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <p class="temPlateText">
        <span @click="textClick('【姓名】')">姓名</span>
        <span @click="textClick('【电话】')">电话</span>
        <span @click="textClick('【用户编号】')">用户编号</span>
        <span @click="textClick('【当前时间】')">当前时间</span>
      </p>
      <el-form-item label="模板内容" prop="TemplateContent">
        <el-input type="textarea" :rows="7" v-model="ShortMsgTempParam.TemplateContent"></el-input>
      </el-form-item>
      <el-form-item label="发送方式">
        <el-radio-group v-model="ShortMsgTempParam.SendMethod" @change="methodChage">
          <el-radio :label="1">手动发送</el-radio>
          <el-radio :label="0">自动发送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-radio-group v-model="ShortMsgTempParam.SendModality" :disabled="Ischange">
          <el-radio :disabled="ShortMsgTempParam.SendMethod==0"  :label="0">及时发送</el-radio>
          <el-radio  :label="1">定时发送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定时发送时间" v-if="ShortMsgTempParam.SendModality!=0" class="datePicker">
        <el-date-picker
          :disabled="ShortMsgTempParam.SendMethod==0"
          v-model="ShortMsgTempParam.ResetShortMsgTemplateSendTime"
          format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="timePicker" v-if="ShortMsgTempParam.SendModality!=0">
        <el-select v-model="ShortMsgTempParam.TimerSendStartTime" placeholder="请选择">
          <el-option v-for="item in 24" :key="item" :label="item<10?'0'+item:item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <span
        v-if="ShortMsgTempParam.SendModality!=0"
        style="display: inline-block;line-height: 28px;margin-top: 18px; margin-right: 10px"
      >~</span>
      <el-form-item class="timePicker" v-if="ShortMsgTempParam.SendModality!=0">
        <el-select v-model="ShortMsgTempParam.TimerSendEndTime " placeholder="请选择">
          <el-option
            v-for="item in 24"
            :label="item<10?'0'+item:item"
            :value="item"
            :key="item"
            :disabled="item<=ShortMsgTempParam.TimerSendStartTime"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="addMeterReadingPlan">确认</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addTemplate } from "@/api/shotMsg";
export default {
  props: {
    addShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      AdialogFormVisible: false,
      ShortMsgTempParam: {
        Id: "",
        IsSysTemplate: 0, //模板类型
        SysTemplateType: "", //系统模板类型
        TemplateName: "", //模板名称
        TemplateContent: "", //模板内容
        SendMethod: "", //发送方式
        SendModality: "", //定时发送
        TimerSendStartTime: "",
        TimerSendEndTime: "",
        ResetShortMsgTemplateSendTime: "" //自定义模板发送时间
      },
      Ischange:true,
      rules: {
        TemplateContent: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },

  watch: {
    addShow() {
      this.AdialogFormVisible = this.addShow;
      this.ShortMsgTempParam.IsSysTemplate = 0;
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:addShow", val);
    }
  },
  methods: {
    //发送方式改变
    methodChage(){
      this.ShortMsgTempParam.SendModality=""
      if(this.ShortMsgTempParam.SendMethod!=""){
        this.Ischange=false
      }
    },
    textClick(text) {
      this.ShortMsgTempParam.TemplateContent += text;
    },
    addMeterReadingPlan() {
      let that = this;
      if (this.ShortMsgTempParam.TemplateContent == "") {
        that.$message({
          message: "模板内容不能为空",
          type: "warning"
        });
        return false
      }
      addTemplate(this.ShortMsgTempParam).then(res => {
        if (res.code == 0) {
          this.AdialogFormVisible = false;

          that.$message({
            message: res.msg ? res.msg : "添加成功",
            type: "success"
          });
          this.ShortMsgTempParam = {};
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
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-top: 30px;
}
.timePicker {
  /deep/.el-form-item__content {
    width: 80px;
  }
  /deep/.el-input__inner {
    width: 80px !important;
  }
}
/deep/.el-form-item__content {
  width: 300px;
}
/deep/.el-input__inner {
  width: 300px !important;
}
.datePicker {
  /deep/.el-form-item__content {
    width: 120px;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 120px !important;
  /deep/.el-input__inner {
    width: 120px !important;
  }
}
.el-form-item {
  margin-top: 18px;
  margin-bottom: 0;
}
.temPlateText {
  margin-top: 28px;
  margin-bottom: 0;
  padding-left: 100px;
  span {
    cursor: pointer;
    padding: 3px 12px;
    line-height: 17px;
    color: rgba(109, 167, 131, 1);
    border: 1px solid rgba(109, 167, 131, 1);
    border-radius: 50px;
    margin-right: 5px;
  }
}
</style>

