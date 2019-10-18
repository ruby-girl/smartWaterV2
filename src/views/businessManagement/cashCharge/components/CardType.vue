<template>
  <!-- 新增弹窗 -->
  <div>
    <div class="main-padding-20-y card-container" :style="{'height':saveTableHeight+'px'}">
      <!-- 循环 -->
      <div v-for="(item,i) in cardData" :key="i">
        <div class="display-flex align-items-center justify-content-flex-justify card-head">
          <el-checkbox
            :indeterminate="item.isIndeterminate"
            v-model="item.checkAll"
            @change="handleCheckAllChange(item.checkAll,i)"
          >{{item.time}}</el-checkbox>
          <div class="card-sort font-14">
            <span>按日期：</span>
            <span>降序</span>
            <span>升序</span>
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
                       <el-checkbox-group
                      v-model="item.checkedCardDate"
                      @change="handleCheckedCardChange(item.checkedCardDate,i)"
                    >
                      <div class="item-time-head">
                        <el-checkbox :label="li.id">{{li.itemTime}}</el-checkbox>
                      </div>
                    </el-checkbox-group>
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
                      <!-- 详情，票据打印按钮 -->
                      <div
                        class="card-item-btn-box display-flex justify-content-flex-center font-14"
                      >
                        <div class="card-item-btn" @click="details">详情</div>
                        <div class="card-item-btn" @click="reset">费用撤回</div>
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
    checkedAllParent: {
      //父元素全选
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
            { itemTime: "2019-04", money: "80.00", id: "11", type: 2 },
            { itemTime: "2019-03", money: "80.00", id: "22", type: 1 },
            { itemTime: "2019-02", money: "80.00", id: "33", type: 3 }
          ]
        },
        {
          time: "2018年费用",
          checkAll: false,
          checkedCardDate: [], //行已选中的数据
          tableListId: [], //行所有数据的ID
          isIndeterminate: false,
          arr: [
            { itemTime: "2018-04", money: "80.00", id: "44", type: 4 },
            { itemTime: "2018-03", money: "80.00", id: "55", type: 1 },
            { itemTime: "2018-02", money: "80.00", id: "66", type: 1 }
          ]
        }
      ]
    };
  },
  mounted() {
    this.cardData.map((item, i) => {
      item.arr.map(m => {
        item.tableListId.push(m.id);
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
      let childFlase = this.cardData.filter(item => {
        //全不选，“ ”
        return item.checkAll == false&&item.isIndeterminate==false;
      });
      if (childFlase.length == this.cardData.length) {
        this.$emit("update:isIndeterminateParent", false);
        this.$emit("update:checkedAllParent", false);
      }
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
.card-head {
  padding: 6px 0;
  margin-top: 15px;
  margin-bottom: 10px;
  /deep/ .el-checkbox__label {
    color:#46494C;
    font-size: 16px;
    font-weight: bold;
  }
}
.card-item-box {
  width: 100%;
}
.card-item-bottom-box {
  border:1px solid rgba(230,235,240,1);
  box-shadow:0px 2px 6px rgba(0,0,0,0.1);
  margin: 10px 0;
   border-radius:4px;
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
      border: 1px solid #00b2a1 !important;
      color: #00b2a1 !important;
      margin-right: 8px;
    }
    .card-item-btn {
      border: 1px solid #777c82;
      color: #777c82;
      padding: 2px 3px;
      border-radius: 4px;
    }
  }
}
.item-time-head{
  background: #9CB85C;
  padding: 5px;
  border-radius:4px 4px 0 0;
  /deep/ .el-checkbox__label{
    color:#fff;
  }
}
</style>

