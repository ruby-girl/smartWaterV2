<template>
  <!-- 卡片-->
  <div ref="myCard">
    <div
      class="main-padding-20-y card-container"
      :style="{'height':tableHeight+'px'}"
      v-if="cardData.length>0"
    >
      <!-- 循环 -->
      <div v-for="(item,i) in cardData" :key="i" class="set-first-margin">
        <div class="display-flex align-items-center justify-content-flex-justify card-head">
          <el-checkbox
            :indeterminate="item.isIndeterminate"
            v-model="item.checkAll"
            @change="handleCheckAllChange(item.checkAll,i)"
          >{{item.YearStr}}</el-checkbox>
          <div class="card-sort font-14" v-if="i==0">
            <span>按日期：</span>
            <span :class="{'sort-active':cardQuery.sort=='DESC','pointer':true}" @click="sortChanges('ASC')">降序</span>
            <span  :class="{'sort-active':cardQuery.sort=='ASC','pointer':true}" @click="sortChanges('DESC')">升序</span>
          </div>
        </div>
        <!-- 具体 -->
        <div>
          <div class="display-flex align-items-center justify-content-flex-justify">
            <div class="card-item-box">
              <!-- 循环 -->
              <div class="display-flex align-items-center flex-wrap">
                <div v-for="(li,n) in item.arr" :key="n">
                  <div class="card-item">
                    <div class="card-item-bottom-box">
                      <div
                        class="display-flex item-time-head align-items-center justify-content-flex-justify"
                      >
                        <el-checkbox-group
                          v-model="item.checkedCardDate"
                          @change="handleCheckedCardChange(item.checkedCardDate,i)"
                        >
                          <div>
                            <el-checkbox :label="li.Id" :disabled="li.isDisable">{{li.YearMonth}}</el-checkbox>
                          </div>
                        </el-checkbox-group>
                        <div v-if="li.ChargeFlag==1003">审核中...</div>
                      </div>
                      <div
                        class="card-item-mony-box display-flex align-items-center justify-content-flex-justify"
                      >
                        <span
                          :class="{'main-color-tiffany':li.OrderType==2001,'main-color-warn':li.OrderType==2002,'main-color-orange':li.OrderType==2003}"
                        >{{li.OrderTypeStr}}</span>
                        <span>
                          <span class="main-color-pink font-weight">{{li.PriceSurplus}}</span>元
                        </span>
                      </div>
                      <!-- 详情，费用减免。。按钮 -->
                      <!-- <div
                        class="card-item-btn-box display-flex justify-content-flex-center font-14"
                      >
                        <div class="card-item-btn" @click="details(li)">详情</div>
                        <div class="card-item-btn margin-samll" @click="reset(li.Id)">费用撤回</div>
                        <div class="card-item-btn" @click="feeWaiver(li)">费用减免</div>
                      </div> -->
                      <div class="display-flex justify-content-flex-justify secur-content plr-10 card-item-btn-box">
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="费用详情"
                placement="bottom"
              >
                <i
                  class="icon iconfont iconbiaodan2"
                  @click="details(li)"
                ></i>
              </el-tooltip>
              <!-- 违约金减免 s-->
              <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':li.ChargeFlag!==1002||li.OrderType!==2001||li.LateFee==0?true:false}"
                :popper-class="li.ChargeFlag!==1002||li.OrderType!==2001||li.LateFee==0?'':'tooltip'"
                :effect="li.ChargeFlag!==1002||li.OrderType!==2001||li.LateFee==0?'dark':'light'"
                :visible-arrow="li.ChargeFlag!==1002||li.OrderType!==2001||li.LateFee==0?true:false"
                :content="li.ChargeFlag!==1002||li.OrderType!==2001||li.LateFee==0?'该笔费用不允许减免':'违约金减免'"
                placement="bottom"
              > 
                <i
                  class="icon iconfont iconweiyuejinjianmian font-19" style="padding-left:10px"
                  @click="li.ChargeFlag!==1002||li.OrderType!==2001||li.LateFee==0?'':feeWaiver(li,'违约金')"
                ></i>
              </el-tooltip>
              <!-- 违约金减免 e -->
              <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':li.ChargeFlag==1002?false:true}"
                :popper-class="li.ChargeFlag==1002?'tooltip':''"
                :effect="li.ChargeFlag==1002?'light':'dark'"
                :visible-arrow="li.ChargeFlag==1002?false:true"
                :content="li.ChargeFlag==1002?'费用撤回':'该笔费用不允许撤回'"
                placement="bottom"
              >
                <i
                  class="icon iconfont iconchexiao2" style="padding-left:10px"
                 @click="li.ChargeFlag==1002?reset(li):''"
                ></i>
              </el-tooltip>
               <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':li.ChargeFlag!==1002||li.OrderType!==2001?true:false}"
                :popper-class="li.ChargeFlag!==1002||li.OrderType!==2001?'':'tooltip'"
                :effect="li.ChargeFlag!==1002||li.OrderType!==2001?'dark':'light'"
                :visible-arrow="li.ChargeFlag!==1002||li.OrderType!==2001?true:false"
                :content="li.ChargeFlag!==1002||li.OrderType!==2001?'该笔费用不允许减免':'水费减免'"
                placement="bottom"
              > 
                <i
                  class="icon iconfont iconshuifeijianmian font-19" style="padding-left:10px"
                  @click="li.ChargeFlag!==1002||li.OrderType!==2001?'':feeWaiver(li,'水费')"
                ></i>
              </el-tooltip>
              <!-- <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':row.ChargeFlag!==1002||row.OrderType!==2001?true:false}"
                :popper-class="row.ChargeFlag!==1002||row.OrderType!==2001?'':'tooltip'"
                :effect="row.ChargeFlag!==1002||row.OrderType!==2001?'dark':'light'"
                :visible-arrow="row.ChargeFlag!==1002||row.OrderType!==2001?true:false"
                :content="row.ChargeFlag!==1002||row.OrderType!==2001?'该笔费用不允许减免':'费用减免'"
                placement="bottom"
              > 
                <i
                  class="icon iconfont iconjianmianshui"
                  @click="row.ChargeFlag!==1002||row.OrderType!==2001?'':feeWaiver(row)"
                ></i>
              </el-tooltip> -->
            </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 循环e -->
            </div>
          </div>
        </div>
      </div>
      <!-- 循环end -->
    </div>
    <div class="no-data text-center" v-else>暂无数据</div>
  </div>
</template>
<script>
import { deepClone } from "@/utils/index";
import { GetOrderView } from "@/api/cashCharge";
export default {
  props: {
    cardQuery: {
      type: Object,
      default: function() {
        return {};
      }
    },
    tableHeight: {
      type: Number,
      default: 100
    },
    checkedAllParent: { //父元素全选
      type: Boolean,
      default: false
    },
    isIndeterminateParent: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    checkedAllParent(v, o) {
     this.checkedAllParentFunc(v)
    }
  },
  data() {
    return {
      tableKey: 1,
      checksData: [],
      cardData: [],
      saveCardData: [] //不含禁用状态的数据
    };
  },
  mounted() {},
  methods: {
    // 父元素触发全选
    checkedAllParentFunc(boolean){
       this.cardData.map(item => {
        if (boolean) {
          item.checkAll = true;
          item.isIndeterminate = false;
          item.checkedCardDate = item.tableListId;
        } else {
          item.checkAll = false;
          item.isIndeterminate = false;
          item.checkedCardDate = [];
        }
      });
      this.selectCheckedItem();
    },
    sortChanges(sort) {
      //筛选
      this.cardQuery.filed = 'ArrearsDate';
      this.cardQuery.sort =sort
      if (this.cardData.length > 0) {
        this.cardQuery.page = 1;
        this.getCardList();
      }
    },
    getCardList() {
      GetOrderView(this.cardQuery).then(res => {
        this.cardData = [];
        let obj = {
          checkAll: false,
          checkedCardDate: [], //行已选中的数据
          tableListId: [], //行所有数据的ID
          isIndeterminate: false,
          YearStr: ""
        };
        res.data.forEach(item => {
          obj.YearStr = item.YearStr;
          obj.arr = item.vdlist;
          this.cardData.push(obj);
        });
        this.IsDisable();
      }); 
    },
    // 处理能勾选的数据
    IsDisable() {
      this.cardData.forEach((item, i) => {
        item.arr.forEach(m => {
          if (m.ChargeFlag !== 1003) {
            //筛选不是禁用状态的数据，处理勾选状态
            item.tableListId.push(m.Id);
          }
        });
      });
      this.$emit("update:isIndeterminateParent", false);
      this.$emit("update:checkedAllParent", true);//初始化全选
    },   
    // 全选
    handleCheckAllChange(val, i) {
      this.cardData.forEach((item, a) => {
        if (a == i) {
          item.isIndeterminate = false;
          item.checkedCardDate = val ? item.tableListId : [];
        }
      });
      this.changeParent();
    },
    handleCheckedCardChange(value, i) {
      let checkedCount = value.length;
      this.cardData.forEach((item, a) => {
        if (a == i) {
          item.checkAll = checkedCount === item.tableListId.length;
          item.isIndeterminate =
            checkedCount > 0 && checkedCount < item.tableListId.length;
        }
      });
      this.changeParent();
    },
    // 选取不含有禁用状态的数据
    selectNoDisable() {
      let _this = this;
      this.saveCardData = deepClone(this.cardData);
      this.saveCardData.forEach((item, a) => {
        item.arr = item.arr.filter((li, n) => {
          return !li.isDisable;
        });
      });
    },
    changeParent() {
      // 判断是否都选中，然后更新父组件的选项框
      let childIsIndeterminate = this.cardData.filter(item => {
        return item.checkedCardDate.length > 0;
      });
      let childCheckedCardDate = this.cardData.filter(item => {
        return item.checkAll == true;
      });
      if (childIsIndeterminate.length > 0) {
        //至少有一个不选中状态 “-”
        this.$emit("update:isIndeterminateParent", true);
      }
      if (childCheckedCardDate.length == this.cardData.length) {
        //全选，“√”
        this.$emit("update:isIndeterminateParent", false);
        this.$emit("update:checkedAllParent", true);
      }
      let childFalse = this.cardData.filter(item => {
        //全不选，“ ”
        return item.checkAll == false && item.isIndeterminate == false;
      });
      if (childFalse.length == this.cardData.length) {
        this.$emit("update:isIndeterminateParent", false);
        this.$emit("update:checkedAllParent", false);
      }
      this.selectCheckedItem();
    },
    // 通过ID获取数据，传递给父级
    selectCheckedItem() {
      // 有数据的行
      let childIsIndeterminate = this.cardData.filter(item => {
        return item.checkedCardDate.length > 0;
      });
      let data = [];
      // 选择的行ID筛选数据
      childIsIndeterminate.forEach(item => {
        item.arr.forEach(li => {
          item.checkedCardDate.forEach(i => {
            if (li.Id == i) {
              data.push(li);
            }
          });
        });
      });
      this.$emit("update:totalLength", data.length);
      this.$emit("calculatedAmount", data);
    },
    details(id) {
      this.$emit("details", id);
    },
    // 撤回
    reset(id) {
      this.$emit("reset", id);
    },
    // id:费用ID，num:减免前金额 type：费用类型
    feeWaiver(row,type) {
      this.$emit("feeWaiver", row,type);
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  overflow: auto;
}
.card-sort {
  color: #46494c;
  .sort-active{
    opacity: 0.3;
  }
}
.set-first-margin:first-child {
  margin-top: 8px;
}
.card-head {
  padding: 4px 0;
  /deep/ .el-checkbox__label {
    color: #46494c;
    font-size: 16px;
    font-weight: bold;
  }
}
.card-item-box {
  width: 100%;
}
.card-item-bottom-box {
  border: 1px solid rgba(230, 235, 240, 1);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  border-radius: 4px;
  .disable-txt {
    display: inline-block;
    height: 30px;
    width: 80px;
    color: #000;
    z-index: 10000;
  }
}
.card-item {
  width: 178px;
  margin-right: 10px;

  /deep/ .el-checkbox-group {
    width: 100%；;
  }
  .card-item-mony-box {
    height: 82px;
    padding: 0 15px;
    font-size: 16px;
  }
  .card-item-btn-box {
    text-align: center;   
    .iconfont {
      cursor: pointer;
       font-size: 23px;
    }
    .iconbiaodan2{
      color:#B59200 !important;
    }
    .iconchexiao2{
      color:#777C82 !important;
    }
    padding:0 20px 20px 20px;
    .card-item-btn {
      border: 1px solid #777c82;
      color: #777c82;
      padding: 2px 3px;
      border-radius: 4px;
      cursor: pointer;
    }
    .margin-samll {
      margin: 0 3px;
      & + .card-item-btn {
        color: #00b2a1;
        border: 1px solid #00b2a1;
      }
    }
  }
}
.no-data {
  color: #909399;
  padding-top: 20vh;
  font-size: 14px;
}
.item-time-head {
  background: #9cb85c;
  padding: 5px;
  border-radius: 4px 4px 0 0;
  /deep/ .el-checkbox__label {
    color: #fff;
  }
}
</style>

