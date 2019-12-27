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
    >
      <el-form-item label="模板名称">
        <el-input v-model="ShortMsgTempParam.TemplateName"></el-input>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-select v-model="ShortMsgTempParam.IsSysTemplate" :disabled="ShortMsgTempParam.IsSysTemplate==1||ShortMsgTempParam.SendMethod==0" placeholder="请选择模板类型">
          <el-option label="系统" :value="1"></el-option>
          <el-option label="自定义" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <p class="temPlateText">
        <span @click="textClick('【姓名】')">姓名</span>
        <span @click="textClick('【电话】')">电话</span>
        <span @click="textClick('【用户编号】')">用户编号</span>
        <span @click="textClick('【当前时间】')">当前时间</span>
      </p>
      
      <el-form-item label="模板内容">
        <el-input type="textarea" :rows="10" v-model="ShortMsgTempParam.TemplateContent"></el-input>
      </el-form-item>
      <el-form-item label="发送方式">
        <el-radio-group v-model="ShortMsgTempParam.SendMethod" :disabled="ShortMsgTempParam.IsSysTemplate==1">
          <el-radio :label="1">手动发送</el-radio>
          <el-radio :label="0">自动发送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-radio-group v-model="ShortMsgTempParam.SendModality">
          <el-radio :disabled="ShortMsgTempParam.SendMethod==0" :label="1">及时发送</el-radio>
          <el-radio :label="0">定时发送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定时发送时间" class="datePicker">
        <el-date-picker
          :disabled="ShortMsgTempParam.SendMethod==0"
          v-model="ShortMsgTempParam.ResetShortMsgTemplateSendTime"
          format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="timePicker">
        <el-select v-model="ShortMsgTempParam.TimerSendStartTime" placeholder="请选择">
          <el-option v-for="item in 24"  :key="item" :label="item<10?'0'+item:item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <span style="display: inline-block;line-height: 28px;margin-top: 18px; margin-right: 10px">~</span>
      <el-form-item class="timePicker">
        <el-select v-model="ShortMsgTempParam.TimerSendEndTime " placeholder="请选择">
          <el-option
            v-for="item in 24"
            :label="item<10?'0'+item:item"
             :key="item"
            :value="item"
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
import { editTemplate } from "@/api/shotMsg";
export default {
  props: {
    editShow: {
      type: Boolean,
      default: false
    },
    editModel:{}
  },
  data() {
    return {
      AdialogFormVisible: false,
      ShortMsgTempParam: {
        Id: "",
        IsSysTemplate: "", //模板类型
        SysTemplateType: "", //系统模板类型
        TemplateName: "", //模板名称
        TemplateContent: "", //模板内容
        SendMethod: "", //发送方式
        SendModality: "", //定时发送
        TimerSendStartTime: "",
        TimerSendEndTime: "",
        ResetShortMsgTemplateSendTime: "" //自定义模板发送时间
      }
    };
  },

  watch: {
    editModel(){
       this.editModel.IsSysTemplate=this.editModel.IsSysTemplate?1:0
       this.editModel.SendMethod=this.editModel.SendMethod?0:1
       this.editModel.SendModality=this.editModel.SendModality?0:1
      this.ShortMsgTempParam=this.editModel
    },
    editShow() {
      this.AdialogFormVisible = this.editShow;
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:editShow", val);
    }
  },
  methods: {
    addMeterReadingPlan() {
      let that = this;

      editTemplate(this.ShortMsgTempParam).then(res => {
        if (res.code == 0) {
          this.AdialogFormVisible = false;

          that.$message({
            message: res.msg ? res.msg : "保存成功",
            type: "success"
          });
          this.$parent.searchTableList();
        } else {
          that.$message({
            message: res.msg ? res.msg : "保存失败",
            type: "warning"
          });
        }
      });
    },
    textClick(text){
      this.ShortMsgTempParam.TemplateContent+=text
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
  margin-bottom: 12px;
  padding-left: 100px;
  cursor: pointer;
  span {
    padding: 3px 12px;
    line-height: 17px;
    color: rgba(109, 167, 131, 1);
    border: 1px solid rgba(109, 167, 131, 1);
    border-radius:50px;
    margin-right: 5px;
  }
}
</style>

