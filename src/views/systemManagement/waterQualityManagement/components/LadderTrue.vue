<template>
  <!-- 新增弹窗 -->
  <div>
    <el-form
      ref="dataFormTrue"
      :model="temp"
      :inline="true"
      :rules="rules"
      class="form-inline-small-input head-search-form ladder-form-padding"
      size="small"
      label-width="110px"
    >
      <el-form-item label="用水性质" prop="UseWaterTypeName">
        <el-input v-model="temp.UseWaterTypeName" placeholder="长度1-50" maxlength="50" />
      </el-form-item>
      <el-form-item label="用水性质类型" prop="WaterPropertyType">
        <el-select v-model="temp.WaterPropertyType" placeholder="请选择">
          <el-option v-for="item in typeList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="阶梯结算月数" prop="LadderResetTime">
        <el-select v-model="temp.LadderResetTime" placeholder="请选择">
          <el-option label="1" value="1" />
          <el-option label="3" value="3" />
          <el-option label="12" value="12" />
        </el-select>
      </el-form-item>
      <el-form-item label="污水费" prop="SewagePrice">
        <el-input
          v-model="temp.SewagePrice"
          @blur="delDecimal_x($event,'SewagePrice')"
          @keyup.native="money($event,'SewagePrice')"
        />
      </el-form-item>
      <el-form-item label="其他费用1">
        <el-input
          v-model="temp.OtherPrice1"
          @blur="delDecimal_x($event,'OtherPrice1')"
          @keyup.native="money($event,'OtherPrice1')"
        />
      </el-form-item>
      <el-form-item label="其他费用2">
        <el-input
          v-model="temp.OtherPrice2"
          @blur="delDecimal_x($event,'OtherPrice2')"
          @keyup.native="money($event,'OtherPrice2')"
        />
      </el-form-item>
      <div class="ladder-box">
        <div v-for="(item,i) in temp.ladder">
          <div class="display-flex" v-if="temp.LadderNumber>i">
            <div class="display-flex align-items-center ladder-item">
              <i class="main-color-red">*</i>
              <span>{{i+1}}阶单价</span>
              <div class="table-input-y ml-5">
                <input
                  type="text"
                  v-model="item.LadderPrice"
                  @blur="delDecimal_x_ladder($event,i)"
                  @keyup="money_ladder($event,i)"
                />
                <span>元/吨</span>
              </div>
            </div>
            <div class="display-flex align-items-center ladder-item">
              <i class="main-color-red">*</i>
              <span>{{i+1}}阶起始量</span>
              <div class="table-input-y ml-5">
                <input
                  type="text"
                  :readonly="i==0?true:false"
                  v-model="item.LadderWaterNum"            
                  @keyup="delDecimal_int($event,i)"
                />
                <span>吨</span>
              </div>
            </div>
            <div class="display-flex align-items-center ladder-item">
              <i class="main-color-red">*</i>
              <span>{{i+1}}阶合计单价</span>
              <div class="table-input-y ml-5">
                <input
                  class="big-blue-color"
                  type="text"
                  readonly
                  v-model="item.TotalPrice"
                />
                <span>元/吨</span>
              </div>
            </div>
            <div
              class="display-flex align-items-center ladder-item"
              v-if="(i+1)==temp.LadderNumber"
            >
              <!-- <span class="main-color cursor" v-if="temp.LadderNumber<5" @click="addLadderNumber">增加</span>&nbsp;&nbsp;&nbsp;
              <span
                class="main-color-red cursor"
                @click="delLadderNumber"
                v-if="temp.LadderNumber>2"
              >删除</span> -->
              <i
              class="iconfont iconicon-test main-color pointer"
             v-if="temp.LadderNumber<5"
              @click="addLadderNumber"
            ></i>
            <i
              class="iconfont icon- main-color-pink pointer"
              @click="delLadderNumber"
                v-if="temp.LadderNumber>2"
                style="margin-left:10px;"
            ></i>
            </div>
          </div>
        </div>
      </div>
      <el-form-item label="开始执行日期">
        <el-date-picker
          v-model="temp.StartPlanDate"
          format="yyyy-MM-dd HH:mm:ss"
          :disabled="dialogStatus=='update'"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="新计价启用日期" v-if="dialogStatus=='update'" label-width="150px">
        <el-select v-model="temp.NewPriceUseDate" placeholder="请选择">
          <el-option :label="item" :value="item" v-for="item in timeOption" :key="item"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getTimeOption,yearTimeOption,threeTimeOption } from "@/utils/projectLogic"; //获取时间下拉框
import { updateMoney, delDecimal,delDecimal_float } from "@/utils/index.js";
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
          return (
            time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
          );
        }
      },
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
        SewagePrice: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      timeOption: []
    };
  },
  methods: {
    oneMonth() {       
      for (let i = 1; i < 6; i++) {
       this.timeOption.push(getTimeOption(new Date(), i+1))
      }
    },
    delDecimal_int(e,i){//起始量，整数
     this.temp.ladder[i].LadderWaterNum= delDecimal(e.target.value);
    },
    addLadderNumber() {
      this.temp.LadderNumber++;
    },
    delLadderNumber() {
      this.temp.LadderNumber--;
    },
    //只允许输入金额
    money(e,txt) {
      this.temp[txt]= updateMoney(e.target.value);
    },
    money_ladder(e,i){//阶梯只允许输入金额
      this.temp.ladder[i].LadderPrice=updateMoney(e.target.value);
    },
    delDecimal_x(e,txt){
      this.temp[txt] = delDecimal_float(e.target.value);
       //更改污水费，其他费用全部重新计算合计
       this.setTotNum();
    },
    // 补齐小数
    delDecimal_x_ladder(e, n) {
        let num =
         (parseFloat(this.temp.ladder[n].LadderPrice)*100 +
          parseFloat(this.temp.SewagePrice)*100 +
          parseFloat(this.temp.OtherPrice1)*100 +
          parseFloat(this.temp.OtherPrice2)*100)/100;
        this.temp.ladder[n].TotalPrice = delDecimal_float(num);      
    },
    setTotNum() {
      this.temp.ladder.map(item => {
        item.TotalPrice =
          (parseFloat(item.LadderPrice)*100 +
          parseFloat(this.temp.SewagePrice)*100 +
          parseFloat(this.temp.OtherPrice1)*100+
          parseFloat(this.temp.OtherPrice2)*100)/100;
      });
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
  background: #f5f5f5;
  margin: 0 20px;
  margin-bottom: 20px;
  .ladder-item {
    padding-left: 15px;
  }

  .table-input-y {
    border: 1px solid rgba(216, 226, 231, 1);
    border-top: none;
    height: 32px;
    background: #fff;
    padding-right: 10px;
    .big-blue-color {
      color: #33b300;
      font-size: 20px;
    }
    input {
      border: none;
      height: 100%;
      text-align: center;
      width: 120px;
      &:focus {
        outline: none;
        // border-color:#00B3A1;
      }
    }
  }
  > .display-flex:first-child .table-input-y {
    border-top: 1px solid rgba(216, 226, 231, 1);
  }
}
.cursor {
  cursor: pointer;
}
.ml-5 {
  margin-left: 5px;
}
</style>

