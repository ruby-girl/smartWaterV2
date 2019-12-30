<template>
  <el-form
    :inline="true"
    :model="selectHead"
    :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
    size="small"
    label-width="68px"
    @submit.native.prevent
    ref="formHeight"
  >
    <el-form-item prop="Customer">
      <el-select
        v-model="selectHead.Enumcqt"
        placeholder="请选择"
        class="short-select-item"
        style="width: 100px;float: left;margin-right:3px"
        @change="getscName(selectHead.Enumcqt)"
      >
        <el-option v-for="item in EnumcqtOption" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
      <el-input
        v-model="selectHead.Customer"
        maxlength="20"
        @keyup.enter.native="handleFilter"
        style="width: 180px;float: left"
        @blur="getText(selectHead.Customer,'Customer','',secNmae)"
      />
    </el-form-item>
    <el-form-item label="水厂：" v-if="this.waterWorks.length>1" prop="SA_WaterFactory_Id">
      <el-select
        v-model="selectHead.SA_WaterFactory_Id"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',waterWorks,'水厂')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <transition-group name="fade">
      <el-form-item prop="SA_UserArea_Id" label="所属区域" v-show="showLabel(2)||isShow" key="SA_UserArea_Id">
        <treeselect
          :searchable="false"
          @select="tree"
          v-model="selectHead.SA_UserArea_Id"
          :options="orgTree"
        />
      </el-form-item>
      <el-form-item prop="Enumot" label="费用类型" key="type" v-show="showLabel(3)||isShow">
        <el-select
          v-model="selectHead.Enumot"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.Enumot,'Enumot',Enumot,'费用类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumot" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="Star_TotalPrice" label="欠费金额" class="money-input" key="TotalPrice" v-show="showLabel(4)||isShow">
        <el-input
          v-model="selectHead.Star_TotalPrice"
          maxlength="20"
          @blur="testMoney()"
          @keyup.native="money($event)"
          style="width: 88px !important;float: left"
        />~
        <el-input
          v-model="selectHead.End_TotalPrice"
          maxlength="20"
          @blur="testMoney()"
          @keyup.native="money($event)"
          style="width: 80px !important;float: right"
        />
      </el-form-item>
      <el-form-item prop="Enumut"  label="用户类型" key="state" v-show="showLabel(5)||isShow">
        <el-select
          v-model="selectHead.Enumut"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.Enumut,'Enumut',Enumut,'用户类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumut" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="Enumwm" label="水表类型" key="Enumwm" v-show="showLabel(6)||isShow">
        <el-select
          v-model="selectHead.Enumwm"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.Enumwm,'Enumwm',Enumwm,'水表类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumwm" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="Enumcf" label="费用状态" key="Enumcf" v-show="showLabel(7)||isShow">
        <el-select
          v-model="selectHead.Enumcf"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.Enumcf,'Enumcf',Enumcf,'费用状态')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumcf" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="timevalue" label="欠费日期" key="time" v-show="showLabel(8)||isShow">
        <el-date-picker
          v-model="selectHead.timevalue"
          type="daterange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getTime"
          @keydown.enter.native="handleFilter"
        ></el-date-picker>
      </el-form-item>
    </transition-group>
    <el-form-item>
      <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
        <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
      </span>
      <el-button type="primary" size="mini" round @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
       <el-button size="mini" class="btn-add" round  @click="resetting"><i class="iconfont icon_zhongzhi"></i>重置</el-button>
      <!-- <el-button size="mini" class="special-btn" round @click="OrdersFeeCancels()">撤销所选欠费</el-button> -->
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission";
import { getOrgTree } from "@/utils/projectLogic";
import Treeselect from "@riophae/vue-treeselect";
import { updateMoney, changeTwoDecimal } from "@/utils/index";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    "selectHead.SA_WaterFactory_Id": {
      //选择水厂动态获取区域
      handler(val, oldVal) {
        this.getArea(val);
      },
      immediate: true
    }
  },
  components: { Treeselect },
  data() {
    return {
      Enumot: [], //费用类型
      Enumut: [], //用户类型
      Enumwm: [], //水表类型
      Enumcf: [
        { Name: "未缴费", Id: "1002" },
        { Name: "审批中", Id: "1003" },
        { Name: "已撤销", Id: "1004" }
      ], //费用状态
      EnumcqtOption:[
        { Name: "用户编号", Id: "1" },
        { Name: "姓名/简码", Id: "2" },
        { Name: "水表编号", Id: "6" }
      ],
      userType: [], //用户类型
      waterType: [], //水表类型
      waterWorks: [], //水厂
      orgTree: [],
      isShow: false,
      ShowIcon: true,
      searchWidth: 0,
      secNmae: "用户编号"
    };
  },
  created() {
    this.searchWidth = document.body.clientWidth - 160; //160左侧导航宽度
    this.Enumwm = getDictionaryOption("水表类型");
    this.Enumut = getDictionaryOption("用户类型");
    this.Enumot = getDictionaryOption("费用类型");
    // this.Enumcf = getDictionaryOption("缴费单缴费状态");
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.waterWorks[0].Id;
    }
  },
  methods: {
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.Star_ArrearsDate = v[0] + " 00:00:00";
        this.selectHead.End_ArrearsDate = v[1] + " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.Star_ArrearsDate = "";
        this.selectHead.End_ArrearsDate = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "欠费日期");
    },
    tree(n,t){
       this.getText(n.Name,'SA_UserArea_Id','','区域')
    },
    getscName(val) {
      this.EnumcqtOption.forEach(item => {
        if (item.Id == val) {
          this.secNmae = item.Name;
          this.getText(this.selectHead.Customer,'Customer','',item.Name)
        }
      });
    },
    getArea(id) {
      getOrgTree(
        function(res) {
          this.orgTree = res;
          this.selectHead.SA_UserArea_Id = "-1";
        }.bind(this),
        id
      );
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    showLabel(n) {
      if (this.waterWorks.length == 1) n = n - 1;
      if (Math.floor((this.searchWidth - 250) / 310) > n || this.isShow)
        return true;
      return false;
    },
    handleFilter() {
      if(this.resTest())  this.$emit("handleFilter");  
    },
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.selectHead.End_TotalPrice=''
      this.$parent.tipsDataCopy = [];
      this.$parent.getList();
    },
    resTest() {
      if (
        (!this.selectHead.End_TotalPrice && this.selectHead.Star_TotalPrice) ||
        (!this.selectHead.Star_TotalPrice && this.selectHead.End_TotalPrice)
      ) {
        this.$message({
          message: "请规范填写欠费金额！",
          type: "error",
          duration: 4000
        });
        this.selectHead.End_TotalPrice = "";
        this.selectHead.Star_TotalPrice = "";
        return false;
      }
      if (this.selectHead.End_TotalPrice) {
       this.getText(this.selectHead.Star_TotalPrice+'~'+this.selectHead.End_TotalPrice,'TotalPrice','','欠费金额')
      }
      return true
    },
    // 补齐小数-
    testMoney() {
      //  this.num= changeTwoDecimal(this.num);
      if (
        parseFloat(this.selectHead.Star_TotalPrice) >
        parseFloat(this.selectHead.End_TotalPrice)
      ) {
        this.$message({
          message: "请规范填写欠费金额！",
          type: "error",
          duration: 4000
        });
        this.selectHead.End_TotalPrice = "";
        this.selectHead.Star_TotalPrice = "";
        return false;
      }
      if (
        parseFloat(this.selectHead.Star_TotalPrice) !== "" &&
        parseFloat(this.selectHead.End_TotalPrice) !== ""
      ) {
        if (
          parseFloat(this.selectHead.Star_TotalPrice) ==
          parseFloat(this.selectHead.End_TotalPrice)
        ) {
          this.$message({
            message: "请规范填写欠费金额！",
            type: "error",
            duration: 4000
          });
          this.selectHead.End_TotalPrice = "";
          this.selectHead.Star_TotalPrice = "";
          return false;
        }
      }
    },
    // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    }
  }
};
</script>
<style lang="scss" scoped>
.money-input {
  /deep/ .el-input .el-input__inner {
    width: 82px;
  }
}
</style>

