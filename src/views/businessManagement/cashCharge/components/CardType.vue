<template>
  <!-- 卡片-->
  <div>
    <div class="main-padding-20-y card-container" :style="{'height':saveTableHeight+'px'}">
      <!-- 循环 -->
      <div v-for="(item,i) in cardData" :key="i" class="set-first-margin">
        <div class="display-flex align-items-center justify-content-flex-justify card-head">
          <el-checkbox
            :indeterminate="item.isIndeterminate"
            v-model="item.checkAll"
            @change="handleCheckAllChange(item.checkAll,i)"
          >{{item.time}}</el-checkbox>
          <div class="card-sort font-14">
            <span>按日期：</span>
            <span @click="sortChanges">降序</span>
            <span @click="sortChanges">升序</span>
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
                            <el-checkbox :label="li.id" :disabled="li.isDisable">{{li.itemTime}}</el-checkbox>
                          </div>
                        </el-checkbox-group>
                        <div v-if="li.isDisable">审核中...</div>
                      </div>
                      <div
                        class="card-item-mony-box display-flex align-items-center justify-content-flex-justify"
                      >
                        <span
                          :class="{'main-color-tiffany':li.type==2,'main-color-warn':li.type==4,'main-color-orange':li.type==3}"
                        >{{li.type==1?'水费':li.type==2?'制卡费':li.type==3?'安装费':'维修费'}}</span>
                        <span>
                          <span class="main-color-pink font-weight">80</span>元
                        </span>
                      </div>
                      <!-- 详情，费用减免。。按钮 -->
                      <div
                        class="card-item-btn-box display-flex justify-content-flex-center font-14"
                      >
                        <div class="card-item-btn" @click="details">详情</div>
                        <div class="card-item-btn margin-samll" @click="reset">费用撤回</div>
                        <div class="card-item-btn" @click="feeWaiver">费用减免</div>
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
  </div>
</template>
<script>
import { deepClone } from "@/utils/index";
export default {
  props: {
    listQuery: {
      type: Object,
      default: function() {
        return {};
      }
    },
    total: {
      type: Number,
      default: 0
    },
    saveTableHeight: {
      type: Number,
      default: 100
    },
     //父元素全选
    checkedAllParent: {
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
      this.cardData.map(item => {
        if (v) {
          item.checkAll = true;
          item.isIndeterminate = false;
          item.checkedCardDate = item.tableListId;
        } else {
          item.checkAll = false;
          item.isIndeterminate = false;
          item.checkedCardDate = [];
        }
      });    
    }
  },
  data() {
    return {
      tableKey: 1,
      tableData: [],
      checksData: [],
      cardData: [
        {
          time: "2019年费用",
          checkAll: false,
          checkedCardDate: [], //行已选中的数据
          tableListId: [], //行所有数据的ID
          isIndeterminate: false,
          arr: [
            {
              itemTime: "2019-04",
              money: "80.00",
              id: "11",
              type: 2,
              isDisable: true
            },
            {
              itemTime: "2019-03",
              money: "80.00",
              id: "22",
              type: 1,
              isDisable: true
            },
            {
              itemTime: "2019-02",
              money: "80.00",
              id: "33",
              type: 3,
              isDisable: false
            }
          ]
        },
        {
          time: "2018年费用",
          checkAll: false,
          checkedCardDate: [], //行已选中的数据
          tableListId: [], //行所有数据的ID
          isIndeterminate: false,
          arr: [
            {
              itemTime: "2018-04",
              money: "80.00",
              id: "44",
              type: 4,
              isDisable: false
            },
            {
              itemTime: "2018-03",
              money: "80.00",
              id: "55",
              type: 1,
              isDisable: false
            },
            {
              itemTime: "2018-02",
              money: "80.00",
              id: "66",
              type: 1,
              isDisable: false
            }
          ]
        }
      ],
      saveCardData: [] //不含禁用状态的数据
    };
  },
  mounted() {
    this.cardData.map((item, i) => {
      item.arr.map(m => {
        if (!m.isDisable) {
          //筛选不是禁用状态的数据，处理勾选状态
          item.tableListId.push(m.id);
        }
      });
    });
  },
  methods: {
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableData.length > 0) {
        this.listQuery.page = 1;
        this.getList();
      }
    },
    getList() {},
    // 全选
    handleCheckAllChange(val, i) {
      this.cardData.map((item, a) => {
        if (a == i) {
          item.isIndeterminate = false;
          item.checkedCardDate = val ? item.tableListId : [];
        }
      });
      this.changeParent();
    },
    handleCheckedCardChange(value, i) {
      let checkedCount = value.length;
      this.cardData.map((item, a) => {
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
      this.saveCardData.map((item, a) => {
        item.arr = item.arr.filter((li, n) => {
          return !li.isDisable;
        });
      });
    },
    changeParent() {
      // 判断是否都选中了，然后更新父组件的选项框
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
    },
    details() {
      this.$emit("details", "1");
    },
    reset() {
      this.$emit("reset", "1");
    },
    feeWaiver(){
      this.$emit("feeWaiver", "1");
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  overflow: auto;
}
.card-sort {
  color: #fff;
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
  }
  .card-item-btn-box {
    text-align: center;
    padding-bottom: 20px;
    :first-child {
      border: 1px solid #bc9d1a !important;
      color: #bc9d1a !important;
    }
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
.item-time-head {
  background: #9cb85c;
  padding: 5px;
  border-radius: 4px 4px 0 0;
  /deep/ .el-checkbox__label {
    color: #fff;
  }
}
</style>

