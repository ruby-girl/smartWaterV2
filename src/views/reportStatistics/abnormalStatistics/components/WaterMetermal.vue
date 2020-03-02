 <template>
  <div class="onBox">
    <div ref="formHeight">
      <select-head :searchWidth="searchWidth" @getText="getText" ref="seachChild" />
    </div>
    <div class="contanier">
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
      <div class="main-padding-20-y" id="table">
        <el-table
          :data="tableData"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
        >
          <el-table-column type="index" fixed="left" label="#" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(selectHead.page - 1) * selectHead.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="SA_WaterFactory_Name" label="水厂" width="180"></el-table-column>
          <el-table-column align="center" prop="CustomerNo" label="用户编号" width="180"></el-table-column>
          <el-table-column align="center" prop="CustomerName" label="姓名" width="180"></el-table-column>
          <el-table-column align="center" prop="Tel" label="电话" width="180"></el-table-column>
          <el-table-column align="center" prop="UserType" label="用户类型" width="180"></el-table-column>
          <el-table-column align="center" prop="WaterMeterTypeId" label="水表类型" width="180"></el-table-column>
          <el-table-column align="center" prop="MeterDiameter" label="口径" width="180"></el-table-column>
          <el-table-column align="center" prop="UseWaterTypeName" label="用水性质" width="180"></el-table-column>
          <el-table-column align="center" prop="LastReadNum" label="上次读数" width="180"></el-table-column>
          <el-table-column align="center" prop="ReadNum" label="本次读数" width="180"></el-table-column>
          <el-table-column align="center" prop="LastWaterYield" label="上次水量" width="180"></el-table-column>
          <el-table-column align="center" prop="TotalWaterYield" label="本次水量" width="180"></el-table-column>
          <el-table-column align="center" prop="Pre" label="水量倍率" width="180"></el-table-column>
          <el-table-column align="center" prop="LastReadDate" label="本次抄表时间" width="180"></el-table-column>
          <el-table-column align="center" prop="ReadDate" label="上次抄表时间" width="180"></el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="selectHead.page"
          :limit.sync="selectHead.limit"
          @pagination="searchTableList('0')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./selected/WaterMeterSelected";
import SearchTips from "@/components/SearchTips/index";
import Pagination from "@/components/Pagination/index"; //分页
import { GetReportRate, ExcelReportRate } from "@/api/reports";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "WaterMetermal",
  components: { SelectHead, SearchTips, Pagination },
  data() {
    return {
      selectHead: {
        page: 1,
        limit: 20,
        SA_WaterFactory_Id: "", //水厂
        MeterDiameter: 0, //口径
        WaterMeter: 0, //水表类型
        UserType: 0, //用户类型
        StarDateTime: "",
        EndDateTime: "",
        Pre: "", //用水量
        UpOrDown: "U" //用水量
      },
      tableHeight: null,
      tableData: [], //表格数据
      total: 0,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024
    };
  },
  methods: {
    delTips(val) {
      if (val == "dateArr") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.StarDateTime = "";
        this.selectHead.EndDateTime = "";
        this.$refs.seachChild.dateArr = [];
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      this.searchTableList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    //导出
    excel() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      ExcelReportRate(this.orderData).then(res => {
        if (res.code == 0) {
          window.location.href = `${this.common.excelPath}${res.data}`;
        } else {
          this.$message({
            type: "warning",
            msg: res.msg ? res.msg : "导出失败  "
          });
        }
      });
    },
    //查询
    searchTableList(num) {
      if (!this.selectHead.Pre || !this.selectHead.UpOrDown) {
        this.$message({
          message: "水量倍率为必填项",
          type: "warning"
        });
        return false;
      }
      if (!this.selectHead.StarDateTime || !this.selectHead.EndDateTime) {
        this.$message({
          message: "日期不能为空，请选择!",
          type: "warning"
        });
        return false;
      }
      if (num != 0) {
        this.selectHead.page = 1;
        this.orderData = Object.assign({}, this.selectHead);
      } else {
        this.orderData.page = this.selectHead.page;
        this.orderData.limit = this.selectHead.limit;
      }

      GetReportRate(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
        this.total = res.count;
      });
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("onBox")[0].offsetHeight -
        document.getElementById("table").offsetTop -
        47;

      this.$refs.searchTips.showTabBtn = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.onBox {
  height: 100%;
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
</style>
