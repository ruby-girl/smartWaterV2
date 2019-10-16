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
              <div class="display-flex align-items-center  flex-wrap">
                <div v-for="(li,n) in item.arr" :key="n">
                  <div class="card-item">
                    <el-checkbox-group
                      v-model="item.checkedCardDate"
                      @change="handleCheckedCardChange(item.checkedCardDate,i)"
                    >
                      <el-checkbox :label="li.id">{{li.itemTime}}</el-checkbox>
                    </el-checkbox-group>
                    <div class="card-item-bottom-box">
                      <div
                        class="card-item-mony-box display-flex align-items-center justify-content-flex-justify"
                      >
                        <span :class="{'main-color-tiffany':li.type==2,'main-color-warn':li.type==4,'main-color-orange':li.type==3}">{{li.type==1?'水费':li.type==2?'制卡费':li.type==3?'安装费':'维修费'}}</span>
                        <span><span class="main-color-pink font-weight">80</span>元</span>
                      </div>
                      <!-- 详情，票据打印按钮 -->
                      <div class="card-item-btn-box display-flex justify-content-flex-center font-14">
                        <div class="card-item-btn">详情</div>
                        <div class="card-item-btn">票据打印</div>
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
            { itemTime: "2019-04", money: "80.00", id: "11",type:2 },
            { itemTime: "2019-03", money: "80.00", id: "22" ,type:1},
            { itemTime: "2019-02", money: "80.00", id: "33" ,type:3}
          ]
        },
        {
          time: "2018年费用",
          checkAll: false,
          checkedCardDate: [], //行已选中的数据
          tableListId: [], //行所有数据的ID
          isIndeterminate: false,
          arr: [
            { itemTime: "2018-04", money: "80.00", id: "44",type:4},
            { itemTime: "2018-03", money: "80.00", id: "55" ,type:1},
            { itemTime: "2018-02", money: "80.00", id: "66" ,type:1}
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
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container{
    overflow: auto;
}
.card-sort {
  color: #fff;
}
.card-head {
  background: #00b2a1;
  padding: 6px 15px;
  margin-top: 15px;
  margin-bottom: 10px;
  /deep/ .el-checkbox__label {
    color: #fff !important;
    font-size: 16px;
    font-weight: bold;
  }
}
.card-item-box {
  width: 100%;
}
.card-item-bottom-box{
     border: 1px solid #d9d9d9;
     margin:10px 0;
}
.card-item {
  width: 178px;
  margin-right: 10px;  
  /deep/ .el-checkbox-group {
    width: 100%；;
  }
  .card-item-mony-box {
    background: #f5f5f5;
    height: 82px;
    padding:0 15px;
  }
  .card-item-btn-box {
    text-align: center;
    padding: 10px 0;
    :first-child {
      border: 1px solid #00b2a1 !important;
      color: #00b2a1 !important;
      margin-right: 8px;
    }
    .card-item-btn {
      border: 1px solid #777c82;
      color: #777c82;
      padding:2px 3px;
      border-radius: 4px;
    }
  }
}
</style>

