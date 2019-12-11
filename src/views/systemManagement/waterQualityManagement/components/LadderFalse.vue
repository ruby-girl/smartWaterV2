<template>
  <!-- 新增弹窗 -->

  <el-form
    ref="dataFormFalse"
    :model="temp"
    :inline="true"
    :rules="rules"
    class="form-inline-small-input ladder-form-padding head-search-form"
    size="small"
    label-width="110px"
  >
    <el-form-item label="用水性质" prop="UseWaterTypeName">
      <el-input v-model="temp.UseWaterTypeName" placeholder="长度1-50" maxlength="50" />
    </el-form-item>
    <el-form-item label="用水性质类型" prop="WaterPropertyType">
      <el-select v-model="temp.WaterPropertyType" placeholder="请选择">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in typeList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="阶梯结算月数" prop="LadderResetTime">
      <el-select v-model="temp.LadderResetTime" placeholder="请选择" @change="ladderResetTimeFunc(temp.LadderResetTime)">
        <el-option label="1" value="1" />
        <el-option label="3" value="3" />
        <el-option label="12" value="12" />
      </el-select>
    </el-form-item>
    <el-form-item label="污水费" prop="SewagePrice">
      <el-input
        v-model="temp.SewagePrice"
        @blur="changeTwoDecimal_x($event)"
        @keyup.native="money($event)"
      />
    </el-form-item>
    <el-form-item label="其他费用1">
      <el-input
        v-model="temp.OtherPrice1"
        @blur="changeTwoDecimal_x($event)"
        @keyup.native="money($event)"
      />
    </el-form-item>
    <el-form-item label="其他费用2">
      <el-input
        v-model="temp.OtherPrice2"
        @blur="changeTwoDecimal_x($event)"
        @keyup.native="money($event)"
      />
    </el-form-item>
    <div class="ladder-box">
      <el-form-item label="单价" label-width="80px" prop="NotLadderPrice">
        <el-input
          v-model="temp.NotLadderPrice"
          @blur="changeTwoDecimal_x($event,'all')"
          @keyup.native="money($event)"
        />
      </el-form-item>
      <el-form-item label="合计单价" label-width="100px" prop="TotalPrice">
        <el-input class="big-blue-color" v-model="temp.TotalPrice" readonly />
      </el-form-item>
    </div>
    <el-form-item label="开始执行日期">
      <el-date-picker
        v-model="temp.StartPlanDate"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="选择日期时间"
        :picker-options="pickerOptions"
        :disabled="dialogStatus=='update'"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="新计价启用日期" v-if="dialogStatus=='update'" label-width="150px">
        <el-select v-model="temp.NewPriceUseDate" placeholder="请选择">
          <el-option :label="item" :value="item" v-for="item in timeOption" :key="item"/>
        </el-select>
      </el-form-item>
  </el-form>
</template>
<script>
import { getTimeOption,yearTimeOption,threeTimeOption } from "@/utils/projectLogic"; //获取时间下拉框
import { updateMoney, delDecimal } from "@/utils/index.js";
export default {
  props: {
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    },
    dialogStatus: {
      type: String,
      default: "create"
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
 watch: {
    "temp.LadderResetTime": {
      handler(val) {
        this.timeOption = [];
        if(val==1){
          this.oneMonth()
        }else if(val==3){
          this.timeOption=threeTimeOption(new Date())
        }else{
         this.timeOption=yearTimeOption(new Date(),5)
        }
        this.temp.NewPriceUseDate=this.timeOption[0]
      },
      immediate: true
    }
  },
  data() {
    return {
      pickerOptions: {
      disabledDate(time) {
          return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
      }
    },
      ladder: [
        { type: 1, num: 0, start: 0, tot: 20 },
        { type: 2, num: 0, start: 0, tot: 20 },
        { type: 3, num: 0, start: 0, tot: 20 }
      ],
      rules: {
        UseWaterTypeName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        WaterPropertyType: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        LadderResetTime: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        SewagePrice: [{ required: true, message: "不能为空", trigger: "blur" }],
        NotLadderPrice: [
          { required: true, message: "不能为0", trigger: "blur" }
        ],
        TotalPrice: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      timeOption:[]
    };
  },
  methods: {
    oneMonth() {       
      for (let i = 1; i < 6; i++) {
       this.timeOption.push(getTimeOption(new Date(), i+1))
      }
    },
    // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    },
    // 补齐小数
    changeTwoDecimal_x(e, n) {
      e.target.value = delDecimal(e.target.value);
      if (typeof n !== "undefined" && n == "all") {
        let num =
          parseFloat(this.temp.NotLadderPrice) +
          parseFloat(this.temp.SewagePrice) +
          parseFloat(this.temp.OtherPrice1) +
          parseFloat(this.temp.OtherPrice2);
        this.temp.TotalPrice = delDecimal(num);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.ladder-form-padding {
  padding: 40px 20px;
}
.ladder-box {
  padding: 15px 0;
  padding-bottom: 0;
  background: #f5f5f5;
  margin: 0 20px;
  margin-bottom: 20px;
}
.big-blue-color /deep/ .el-input__inner {
  color: #33b300;
  font-size: 20px;
}
</style>

