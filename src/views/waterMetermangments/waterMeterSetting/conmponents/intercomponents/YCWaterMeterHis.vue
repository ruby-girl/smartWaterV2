<template>
  <el-table
    ref="table"
    :data="hisData"
    height="453"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
    :cell-style="rowClsass"
    @sort-change="sortChanges"
  >
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="SA_UseWaterTypeHis_Id" :sortable="true" label="用户性质" width="150"></el-table-column>
    <el-table-column prop="LastReadNum" :sortable="true" label="水表起数" width="150"></el-table-column>
    <el-table-column prop="ReadNum" :sortable="true" label="水表止数" width="150"></el-table-column>
    <el-table-column prop="TotalWaterYield" :sortable="true" label="水量" width="150"></el-table-column>
    <el-table-column prop="TotalWaterPrice" :sortable="true" label="水费" width="150"></el-table-column>
    <el-table-column prop="PollutionDischarge" :sortable="true" label="污水费" width="150"></el-table-column>
    <el-table-column prop="PricePaid" :sortable="true" label="扣减金额" width="150"></el-table-column>
    <el-table-column prop="WaterAllowance" :sortable="true" label="固定减免量" width="200"></el-table-column>
    <el-table-column prop="Balance" :sortable="true" label="账户余额" width="200"></el-table-column>
    <el-table-column prop="WaterAllowance" :sortable="true" label="固定减免量" width="200"></el-table-column>
    <el-table-column prop="OrderTime" :sortable="true" label="最近一次抄表日期" width="200"></el-table-column>
    <el-table-column label="操作" width="200" fixed="right">
      <template slot-scope="scope">
        <span class="tbTextButton" @click="toogleExpand(scope.row)">
          水价构成
          <i :class="[rotate?'el-icon-caret-bottom aa':'el-icon-caret-bottom go']" class></i>
        </span>
        <span class="tbTextButton" @click="delRecord(scope.row)">删除</span>
      </template>
    </el-table-column>
    <el-table-column type="expand" fixed="right" width="1">
      <template slot-scope="props">
        <el-row>
          <el-col :span="8">
            <i class="numberTo">1</i>
            <span>
              1阶单价：
              <em>{{props.row.OneTotalPrice }}</em>元
            </span>
            <span class="waterMa100">
              1阶水量：
              <em>{{props.row.WaterYield1}}</em>吨
            </span>
            <span class="waterMa100">
              1阶水费：
              <strong>
                <em>{{props.row.TotalPrice1 }}</em>
              </strong>元
            </span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <i class="numberTo">2</i>
            <span>
              2阶单价：
              <em>{{props.row.OneTotalPrice }}</em>元
            </span>
            <span class="waterMa100">
              2阶水量：
              <em>{{props.row.WaterYield2}}</em>吨
            </span>
            <span class="waterMa100">
              2阶水费：
              <strong>
                <em>{{props.row.TotalPrice2 }}</em>
              </strong>元
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <i class="numberTo">3</i>
            <span>
              3阶单价：
              <em>{{props.row.OneTotalPrice }}</em>元
            </span>
            <span class="waterMa100">
              3阶水量：
              <em>{{props.row.WaterYield3}}</em>吨
            </span>
            <span class="waterMa100">
              3阶水费：
              <strong>
                <em>{{props.row.TotalPrice3 }}</em>
              </strong>元
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <i class="numberTo">4</i>
            <span>
              4阶单价：
              <em>{{props.row.OneTotalPrice }}</em>元
            </span>
            <span class="waterMa100">
              4阶水量：
              <em>{{props.row.WaterYield4}}</em>吨
            </span>
            <span class="waterMa100">
              4阶水费：
              <strong>
                <em>{{props.row.TotalPrice4 }}</em>
              </strong>元
            </span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <i class="numberTo">5</i>
            <span>
              5阶单价：
              <em>{{props.row.OneTotalPrice }}</em>元
            </span>
            <span class="waterMa100">
              5阶水量：
              <em>{{props.row.WaterYield5}}</em>吨
            </span>
            <span class="waterMa100">
              5阶水费：
              <strong>
                <em>{{props.row.TotalPrice5 }}</em>
              </strong>元
            </span>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "YCWaterMeterHis",
  props: {
    hisData: {
      default: [{ SA_UseWaterTypeHis_Id: "居民用水" }],
      type: Array
    }
  },
  data() {
    return {
      sortdata: {
        sort: "", // 排序方式 ASC或DESC ,
        filed: "" // 排序字段 ,
      },
      rotate: true
    };
  },
  methods: {
    toogleExpand(row) {
      const _this = this;
      let $table = _this.$refs.table;
      console.log($table);
      _this.hisData.map((item, index) => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      _this.rotate = !_this.rotate;
      $table.toggleRowExpansion(row);
    },
    rowClsass() {
      return "text-align: center;padding:5px 0";
    },
    delRecord() {
      console.log("删除抄表记录");
    },
    sortChanges({ column, prop, order }) {
      let that = this;
      this.sortdata.filed = prop;
      this.sortdata.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.$emit("sortProp", this.sortdata);
    }
  }
};
</script>
<style scoped>
.numberTo {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: rgba(0, 179, 161, 1);
  opacity: 1;
  border-radius: 100%;
  margin-right: 16px;
  font-weight: bold;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 16px;
  font-style: normal;
}
.waterMa100 {
  margin-left: 100px;
}
.el-row {
  padding: 5px 0;
}
span {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 36px;
  color: rgba(119, 124, 130, 1);
  opacity: 1;
}
em {
  font-style: normal;
  display: inline-block;
  width: 40px;
}
strong {
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 16px;
  color: rgba(255, 61, 61, 1);
  opacity: 1;
}
.go {
  transform: rotate(-180deg);
  transition: all 1s;
}
.aa {
  transition: all 1s;
}
.tbTextButton {
  font-size: 13px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 36px;
  color: rgba(0, 179, 161, 1);
  opacity: 1;
  cursor: pointer;
}
</style>