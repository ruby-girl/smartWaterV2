<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="65px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item label="模板名称" v-show="show1||isShow" prop="templateName">
        <el-select
          v-model="selectHead.templateName"
          filterable
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.templateName,'templateName',templateNmaeList,'模板名称')"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in templateNmaeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板类型" v-show="show2||isShow" prop="templateType" label-width="70px">
        <el-select
          v-model="selectHead.isSysTemplate"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.isSysTemplate,'isSysTemplate',templateType,'模板类型')"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in templateType"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送方式" v-show="show3||isShow" prop="sendMethod" label-width="70px">
        <el-select
          v-model="selectHead.sendMethod"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.sendMethod,'sendMethod',sendType,'发送方式')"
        >
          <el-option label="全部" value></el-option>
          <el-option v-for="item in sendType" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" v-show="show4||isShow" prop="sendModality" label-width="70px">
        <el-select
          v-model="selectHead.sendModality"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.sendModality,'sendModality',sendTime,'发送方式')"
        >
          <el-option label="全部" value></el-option>
          <el-option v-for="item in sendTime" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="timePicker" label="定时发送时间" v-show="show5||isShow" label-width="90px">
        <el-select v-model="selectHead.timerSendStartTime" placeholder="请选择" @change="getSendTime">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in 24"
            :key="item"
            :disabled="selectHead.timerSendEndTime!=''&&item>=selectHead.timerSendEndTime"
            :label="item<10?'0'+item:item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <span
        v-show="show5||isShow"
        style="display: inline-block;line-height: 28px; margin-right: 10px"
      >~</span>
      <el-form-item class="timePicker" v-show="show5||isShow">
        <el-select v-model="selectHead.timerSendEndTime" @change="getSendTime" placeholder="请选择">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in 24"
            :label="item<10?'0'+item:item"
            :value="item"
            :key="item"
            :disabled="item<=selectHead.timerSendStartTime"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <span class="isShow" :class="{tro:isShow}" v-if="showBtn">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button round type="primary" size="mini" @click="handleFilter">
          <i class="iconfont iconsousuo"></i>
          搜索
        </el-button>
        <el-button size="mini" class="btn-add" round @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getTemplateName } from "@/api/shotMsg"; //获取模板列表
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    searchWidth: {}
  },
  data() {
    return {
      selectHead: {},
      // warterMeterPlanDate: [],
      companyOptions: [],
      planStateOptions: [],
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      showBtn: false,
      templateNmaeList: [],
      templateType: [
        //模板类型
        {
          Id: 1,
          Name: "系统"
        },
        {
          Id: 0,
          Name: "自定义"
        }
      ],
      sendType: [
        //模板类型
        {
          Id: 1,
          Name: "自动发送"
        },
        {
          Id: 0,
          Name: "手动发送"
        }
      ],
      sendTime: [
        //模板类型
        {
          Id: 0,
          Name: "及时发送"
        },
        {
          Id: 1,
          Name: "定时发送"
        }
      ]
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        this.show5 = this.showLabel(5, val);
        if (Math.floor((val - 180) / 280) >= 5) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
        }
      },
      immediate: true
    }
  },

  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("warterMeterPlanDate");
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },
    handleFilter() {
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getSendTime() {
      let dateStart = this.selectHead.timerSendStartTime;
      let dateEnd = this.selectHead.timerSendEndTime;
      let dateStipe;
      if (dateStart < 10) {
        dateStart = "0" + dateStart;
      }
      if (dateEnd < 10) {
        dateEnd = "0" + dateEnd;
      }
      dateStipe = dateStart + "~" + dateEnd;
      this.$emit(
        "getText",
        dateStipe,
        "warterMeterPlanDate",
        "",
        "定时发送日期"
      );
    },
    // getTime() {
    //   //时间格式化
    //   let date = this.selectHead.warterMeterPlanDate;
    //   let dateStipe;
    //   if (date) {
    //     this.selectHead.timerSendStartTime = date[0];
    //     this.selectHead.timerSendEndTime = date[1];
    //     dateStipe =
    //       this.selectHead.timerSendStartTime.split(" ")[0] +
    //       "~" +
    //       this.selectHead.timerSendEndTime.split(" ")[0];
    //     this.$emit(
    //       "getText",
    //       dateStipe,
    //       "warterMeterPlanDate",
    //       "",
    //       "定时发送日期"
    //     );
    //   } else {
    //     this.selectHead.timerSendStartTime = "";
    //     this.selectHead.timerSendEndTime = "";
    //     dateStipe = "";
    //     this.$emit(
    //       "getText",
    //       dateStipe,
    //       "warterMeterPlanDate",
    //       "",
    //       "定时发送日期"
    //     );
    //   }
    // },
    //获取模板名称
    getNameList() {
      getTemplateName({ isSysTemplate: "" }).then(res => {
        this.templateNmaeList = [];
        res.data.forEach(element => {
          let obj = {
            Id: element.Id,
            Name: element.TemplateName
          };
          this.templateNmaeList.push(obj);
        });
      });
    }
  },
  mounted() {
    this.getNameList();
    this.selectHead = this.$parent.selectHead;
    this.planStateOptions = [];
    this.planStateOptions = getDictionaryOption("抄表计划状态");
  }
};
</script>
<style lang="scss" scoped>
.timePicker {
  /deep/.el-form-item__content {
    width: 80px;
  }
  /deep/.el-input__inner {
    width: 80px !important;
  }
}
</style>

