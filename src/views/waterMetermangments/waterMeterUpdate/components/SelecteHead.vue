<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    <el-form-item v-if="companyShow" label="水厂">
      <el-select
        v-model="selectHead.SA_WaterFactory_Id "
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyParentOptions,'水厂')"
      >
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in companyParentOptions"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型">
      <el-select
        v-model="selectHead.UserType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.UserType,'UserType',userTypeList,'用户类型')"
      >
        <el-option label="全部" :value="-1" />
        <el-option
          v-for="item in userTypeList"
          :key="item.Id"
          :label="item.Name"
          :value="Number(item.Id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="升级前水表类型" label-width="120px">
      <el-select
        v-model="selectHead.OldWaterMeterTypeId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.OldWaterMeterTypeId,'OldWaterMeterTypeId',WaterMeterList,'升级前水表类型')"
      >
        <el-option label="全部" :value="-1" />
        <el-option
          v-for="item in WaterMeterList"
          :key="item.Id"
          :label="item.Name"
          :value="Number(item.Id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="升级后水表类型" label-width="120px">
      <el-select
        v-model="selectHead.NewWaterMeterTypeId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.NewWaterMeterTypeId,'NewWaterMeterTypeId',WaterMeterList,'升级后水表类型')"
      >
        <el-option label="全部" :value="-1" />
        <el-option
          v-for="item in WaterMeterList"
          :key="item.Id"
          :label="item.Name"
          :value="Number(item.Id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        v-model="selectHead.CustomerQueryType"
        placeholder="请选择"
        style="width: 100px;float: left;margin-right:4px;"
        class="short-select"
        @change="getscName(selectHead.CustomerQueryType)"
      >
        <el-option label="用户姓名" value="2"></el-option>
        <el-option label="用户编号" value="1"></el-option>
        <el-option label="用户电话" value="3"></el-option>
        <el-option label="用户证件号" value="4"></el-option>
        <el-option label="用户地址" value="5"></el-option>
      </el-select>
      <el-input
        v-model="selectHead.CustomerQueryValue"
        maxlength="20"
        placeholder="(长度1-30)"
        @keyup.enter.native="handleFilter"
        @change="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
        style="width: 180px;float: left"
      />
    </el-form-item>
    <el-form-item label="操作员" label-width="80">
      <el-select
        v-model="selectHead.UpgradeEmpId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.UpgradeEmpId,'UpgradeEmpId',editUserList,'操作员')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in editUserList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>

    <el-form-item label="升级日期">
      <el-date-picker
        v-model="selectHead.timevalue"
        type="datetimerange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="getTime"
        @keydown.enter.native="handleFilter"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import { getName } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    editUserList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "1",
              label: "组件交互文档"
            }
          ]
        }
      ],

      companyParentOptions: [], //水厂
      companyShow: true,
      userTypeList: [],
      WaterMeterList: [],
      secNmae: ""
    };
  },
  created() {
    this.companyParentOptions = this.$store.state.user.waterWorks;
    if (this.companyParentOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions[0].Id;
      this.companyShow = false;
    }
    this.userTypeList = getDictionaryOption("用户类型");
    this.WaterMeterList = getDictionaryOption("水表类型");
  },
  methods: {
    getscName(id) {
      this.secNmae = getName(id);
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.StartUpgradeDate = v[0];
        this.selectHead.EndUpgradeDate = v[1];
        date =
          this.selectHead.StartUpgradeDate +
          "~" +
          this.selectHead.EndUpgradeDate;
        this.$emit("getText", date, "timevalue", "", "升级日期");
      } else {
        this.selectHead.StartUpgradeDate = "";
        this.selectHead.EndUpgradeDate = "";
        date = "";
        this.$emit("getText", date, "timevalue", "", "升级日期");
      }
    },
    handleFilter() {
      // this.$parent.seachAccountOrder()
      this.$emit("handleFilter");
      // this.$parent.seachAccountOrder()
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  margin-top: 17px;
}
</style>

