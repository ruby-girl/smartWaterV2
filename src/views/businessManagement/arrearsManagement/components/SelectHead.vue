<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form backgrounf-fff form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    <div class="dialog-title-border-shadow">
      <el-radio-group v-model="type">
        <el-radio :label="'1'">按用户查询</el-radio>
        <el-radio :label="'2'">按水厂查询</el-radio>
      </el-radio-group>
    </div>
    <div style="padding:15px;padding-bottom:0;" v-show="type==1">
      <el-form-item label="用户：" >
        <el-select v-model="selectHead.Enumcqt" placeholder="请选择" style="width: 100px;float: left">
          <el-option label="用户编号" value="1"></el-option>
          <el-option label="姓名/简码" value="2"></el-option>
          <el-option label="水表编号" value="6"></el-option>
        </el-select>
        <el-input
          v-model="selectHead.Customer"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          style="width: 180px;float: left"
        />
      </el-form-item>
      <el-form-item label="水厂：" v-if="this.waterWorks.length>1">
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="欠费日期：">
        <el-date-picker
          v-model="timevalue"
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getTime"
          @keydown.enter.native="handleFilter"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="所属区域：">
        <treeselect :searchable="false" v-model="selectHead.SA_UserArea_Id" :options="orgTree" />
      </el-form-item>
      <transition-group name="fade">
        <el-form-item label="费用类型：" v-show="ifMore" key="type">
          <el-select
            v-model="selectHead.Enumot"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option v-for="item in Enumot" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="欠费金额："  v-show="ifMore" key="TotalPrice ">
          <el-input
          v-model="selectHead.Star_TotalPrice"
          maxlength="20"      
          @blur="testMoney()"
          @keyup.native="money($event)"
          style="width: 80px;float: left"
        />~<el-input
          v-model="selectHead.End_TotalPrice"
          maxlength="20"
          @blur="testMoney()"
          @keyup.native="money($event)"      
          style="width: 80px;float: right"
        />
      </el-form-item>
        <el-form-item label="用户类型：" v-show="ifMore" key="state">
          <el-select
            v-model="selectHead.Enumut"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option v-for="item in Enumut" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="水表类型：" v-show="ifMore" key="Enumwm">
          <el-select
            v-model="selectHead.Enumwm"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option v-for="item in Enumwm" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用状态：" v-show="ifMore" key="Enumcf">
          <el-select
            v-model="selectHead.Enumcf"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option v-for="item in Enumcf" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
      </transition-group>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleFilter">
          <i class="iconfont iconsousuo"></i>搜索
        </el-button>
        <el-button type="success" size="mini" @click="OrdersFeeCancels()">撤销所选欠费</el-button>
        <i v-show="ifMore" class="icon iconfont getUpDown" @click="toggleShow(false)">收起 &#xe692;</i>
        <i v-show="!ifMore" class="icon iconfont getUpDown" @click="toggleShow(true)">展开 &#xe68f;</i>
      </el-form-item>
    </div>
    <div style="padding:15px;padding-bottom:0;" v-show="type==2">
      <el-form-item label="水厂：" v-if="this.waterWorks.length>1">
        <el-select
          v-model="factoryQuery.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="欠费日期：">
        <el-date-picker
          v-model="timevalueFactory"
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getTimeFactory"
          @keydown.enter.native="handleFilterFactory"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="费用类型：" key="type">
        <el-select
          v-model="factoryQuery.Enumot"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumot" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型：" key="state">
        <el-select
          v-model="factoryQuery.Enumut"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumut" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型：" key="Enumwm">
        <el-select
          v-model="factoryQuery.Enumwm"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumwm" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="费用状态：" key="Enumcf">
        <el-select
          v-model="factoryQuery.Enumcf"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumcf" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleFilterFactory">
          <i class="iconfont iconsousuo"></i>搜索
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
import { parseStartTimeFunc, parseEndTimeFunc } from "@/utils/index";
import { getDictionaryOption } from "@/utils/permission";
import { getOrgTree } from "@/utils/projectLogic";
import { updateMoney, changeTwoDecimal } from "@/utils/index";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {
    selectHead: {
      //按用户查询条件
      type: Object,
      default: function() {
        return {};
      }
    },
    selectType: {},
    factoryQuery: {
      //按水厂查询条件
      type: Object,
      default: function() {
        return {};
      }
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    "selectHead.SA_WaterFactory_Id": {//选择水厂动态获取区域
      handler(val, oldVal) {
       
       this.getArea(val)
      },
      immediate: true
    },
    selectType(val) {
      this.type = val;
    },
    type(val){
       this.$emit("update:selectType", val);  
    }
  },
  components: { Treeselect },
  data() {
    return {
      Enumot: [], //费用类型
      Enumut: [], //用户类型
      Enumwm: [], //水表类型
      Enumcf: [], //费用状态
      timevalue: [],
      timevalueFactory: [],
      areaList: [], //区域列表
      ifMore: false,
      value: 0,
      orgTree: [],
      type: "1"
    };
  },
  created() {
    // 填充默认时间--s
    let start = parseStartTimeFunc(new Date(), 1);
    let end = parseEndTimeFunc(new Date());
    this.timevalue.push(new Date(start));
    this.timevalue.push(new Date(end));
     this.timevalueFactory.push(new Date(start));
    this.timevalueFactory.push(new Date(end));
    this.selectHead.Star_ArrearsDate  = start;
    this.selectHead.End_ArrearsDate = end;
    this.factoryQuery.Star_ArrearsDate  = start;
    this.factoryQuery.End_ArrearsDate = end;
    // 填充默认时间--e
    this.Enumwm = getDictionaryOption("水表类型");
    this.Enumut = getDictionaryOption("用户类型");
    this.Enumot = getDictionaryOption("费用类型");
    this.Enumcf = getDictionaryOption("费用状态");
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.waterWorks[0].Id;
      this.factoryQuery.SA_WaterFactory_Id = this.waterWorks[0].Id;
    }
  },
  mounted() {
    // 获取区域
  //  this.getArea('-1')
  },
  methods: {
    getArea(id){
      getOrgTree(
      function(res) {
        this.orgTree = res;
        this.selectHead.SA_UserArea_Id='-1'
      }.bind(this),
      id
    );
    },
    getTime(v) {
      if (v) {
        this.selectHead.Star_ArrearsDate = v[0];
        this.selectHead.End_ArrearsDate = v[1];
      } else {
        this.selectHead.Star_ArrearsDate = "";
        this.selectHead.End_ArrearsDate = "";
      }
    },
    getTimeFactory(v) {
      if (v) {
        this.factoryQuery.Star_ArrearsDate = v[0];
        this.factoryQuery.End_ArrearsDate = v[1];
      } else {
        this.factoryQuery.Star_ArrearsDate = "";
        this.factoryQuery.End_ArrearsDate = "";
      }
    },
    handleFilter() {
      //用户查询
      this.$emit("handleFilter", this.selectHead);
    },
    handleFilterFactory() {
      //水厂查询
      this.$emit("handleFilterFactory", this.factoryQuery);
    },
    toggleShow(type) {
      this.ifMore = type;
      this.$emit("toggleShow", type);
    },
    // 补齐小数-
    testMoney() {
    //  this.num= changeTwoDecimal(this.num);
      if(parseFloat(this.selectHead.Star_TotalPrice)>parseFloat(this.selectHead.End_TotalPrice)){
         this.$message({
            message: '请规范填写欠费金额！',
            type: "error",
            duration: 4000
          });
          this.selectHead.End_TotalPrice=''
          this.selectHead.Star_TotalPrice=''
      }
      if(parseFloat(this.selectHead.Star_TotalPrice)!==''&&parseFloat(this.selectHead.End_TotalPrice)!==''){
        if(parseFloat(this.selectHead.Star_TotalPrice)==parseFloat(this.selectHead.End_TotalPrice)){
           this.$message({
            message: '请规范填写欠费金额！',
            type: "error",
            duration: 4000
          });
           this.selectHead.End_TotalPrice=''
          this.selectHead.Star_TotalPrice=''
        }
      }

    },
     // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    },
    // 批量撤销
    OrdersFeeCancels(){
      this.$emit("toggleShow");
    }
  }
};
</script>
<style lang="scss" scoped>
.backgrounf-fff {
  background: #fff;
  .dialog-title-border-shadow {
    line-height: 40px;
    padding-left: 20px;
  }
}
.getUpDown {
  font-size: 14px;
  color: #00b3a0;
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
}
</style>

