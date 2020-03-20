
<template>
  <div class="section-container">
    <el-container>
      <el-aside width="0">
        <div ref="updateHeight">
          <upadate-water class="account-user" ref="update" />
        </div>
        <span v-show="ifShow" class="telescopic telescopic2" @click="closeAccount">
          水表升级
          <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
        </span>
      </el-aside>

      <el-main>
        <div ref="formHeight">
          <selecte-head
            :editUserList="editUserList"
            :selectHead="listQuery"
            @handleFilter="seachAccountOrder"
            @getText="getText"
            :searchWidth="searchWidth"
          />
        </div>
        <div class="contanier">
          <search-tips
            :tipsData="tipsData"
            ref="searchTips"
            @delTips="delTips"
            @excel="excelWaterAccountOrder"
          />
          <!-- <customTable ref="myChild" /> -->
          <div class="main-padding-20-y" id="table">
            <el-table
              :key="tableKey"
              :data="tableData"
              border
              fit
              :height="tableHeight"
              style="width: 100%;"
              :header-cell-style="{'background-color': '#F0F2F5'}"
              @sort-change="sortChanges"
            >
              <el-table-column fixed="left" label="#" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
                </template>
              </el-table-column>

              <template v-for="(item ,index) in tableHeadData">
                <el-table-column
                  v-if="item.IsFreeze"
                  :key="index"
                  min-width="190px"
                  :sortable="item.IsSortBol?'custom':null"
                  :prop="item.ColProp"
                  align="center"
                  :label="item.ColDesc"
                  :fixed="item.Freeze"
                />
                <el-table-column
                  v-else
                  :key="index"
                  min-width="190px"
                  sortable="custom"
                  :prop="item.ColProp"
                  align="center"
                  :label="item.ColDesc"
                />
              </template>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              @pagination="seachAccountOrder('0')"
            />
          </div>
        </div>
        <span v-show="!ifShow" class="telescopic telescopic1" @click="closeAccount">
          水表升级
          <i class="iconfont iconshouqi1" style="font-size: 12px;"></i>
        </span>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import UpadateWater from "./components/UpadateWater";
import SelecteHead from "./components/SelecteHead";
// import customTable from "@/components/CustomTable/index";
import Pagination from "@/components/Pagination";
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import {
  getUpgradeRecordList,
  ExcelUpgradeRecordList
} from "@/api/waterMeterMang"; //获取操作人下拉框waterAccountPost
import { legalTime } from "@/utils/index"; //时间格式化
import SearchTips from "@/components/SearchTips/index";
import {
  delTips,
  getText,
  pushItem,
  getTipsChangeWidth
} from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "waterMeterUpdate",
  components: { UpadateWater, SelecteHead, Pagination, SearchTips },
  data() {
    return {
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        CustomerQueryType: "1", //查询类型
        CustomerQueryType: "", //查询值
        SA_WaterFactory_Id: "-1", //水厂ID
        UserType: -1, // 用户类型
        OldWaterMeterTypeId: -1, //升级前水表类型
        NewWaterMeterTypeId: -1, //升级后水表类型
        UpgradeEmpId: "-1", // 操作人
        StartUpgradeDate: "", // 操作时间起
        EndUpgradeDate: "", // 操作时间止
        timevalue: [],
        tableId: "0000028"
      },
      checksData: [],
      tableKey: 0,
      tableData: [],
      tableHeight: null,
      total: 0,
      customHeight: "", //自定义高度
      ifShow: false,
      editUserList: [], //操作员、经办人
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      searchWidth: 1024 //右侧宽度
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("el-main")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      58;

    this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.searchWidth = this.$refs.formHeight.clientWidth;
  },
  watch: {
    ifShow() {
      let _this = this;
      setTimeout(function() {
        _this.searchWidth = _this.$refs.formHeight.clientWidth;
      }, 200);
    }
  },
  computed: {
    tableHeadData: function() {
      //获取表头信息
      const arrayHead = [];
      const data = this.checksData;
      for (let i = 0; i < data.length; i++) {
        // 过滤选中列
        if (data[i].IsCheck) {
          arrayHead.push(data[i]);
        }
      }
      return arrayHead;
    }
  },
  methods: {
    //删除面包屑
    delTips(val) {
      //返回的查询条件的属性
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.StartUpgradeDate = "";
        this.listQuery.EndUpgradeDate = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.seachAccountOrder();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    //表格自定义方法

    //左侧显示隐藏
    closeAccount() {
      this.ifShow = !this.ifShow;
      let that = this;
      if (this.ifShow) {
        document.getElementsByClassName("el-aside")[0].classList.remove("none");
        document.getElementsByClassName("el-aside")[0].classList.add("hide");
        getTipsChangeWidth(this);

        setTimeout(function() {
          let asideHeight = document.getElementsByClassName("el-aside")[0]
            .offsetHeight;
          let conentHeight = that.$refs.updateHeight.offsetHeight;
          if (asideHeight < conentHeight) {
            that.$refs.update.showInfo = false;
            that.$refs.update.showSelect = true;
          } else {
            that.$refs.update.showInfo = true;
            that.$refs.update.showSelect = false;
          }
        }, 200);
      } else {
        document.getElementsByClassName("el-aside")[0].classList.remove("hide");
        document.getElementsByClassName("el-aside")[0].classList.add("none");
        getTipsChangeWidth(this);
        that.$refs.update.showInfo = true;
      }
    },
    //查询记录
    seachAccountOrder(num) {
      if (this.listQuery.timevalue.length > 0) {
        this.listQuery.StartUpgradeDate =
          this.listQuery.StartUpgradeDate.split(" ")[0] + " 00:00:00";
        this.listQuery.EndUpgradeDate =
          this.listQuery.EndUpgradeDate.split(" ")[0] + " 23:58:59";
      }

      if (num != 0) {
        this.listQuery.page = 1;
        this.orderData = Object.assign({}, this.listQuery);
      } else {
        this.orderData.page = this.listQuery.page;
        this.orderData.limit = this.listQuery.limit;
      }
      getUpgradeRecordList(this.orderData).then(res => {
        if (res.code == 0) {
          this.tipsData = pushItem(this.tipsDataCopy);
          this.tableData = res.data;
          this.total = res.count;
          let timeObj = this.tableData;
          timeObj.forEach((item, index) => {
            for (let i in item) {
              i == "CancelDate" ? (item[i] = legalTime(item[i])) : "";
            }
          });
        } else {
          this.$message({
            type: "warning",
            msg: res.msg ? res.msg : "查询失败"
          });
        }
      });
    },
    //导出
    excelWaterAccountOrder() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      ExcelUpgradeRecordList(this.orderData).then(res => {
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
    sortChanges({ column, prop, order }) {
      //排序
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.seachAccountOrder();
    }
  }
};
</script>
<style lang="scss" scoped>
.section-container {
  .el-container {
    height: 100%;
    .el-aside {
      padding: 0;
      margin-bottom: 0;
      position: relative;
      transition: width 0.2s;
      overflow: scroll;

      background: #fff;
    }

    .el-main {
      background: #fff;
      padding: 0;
      position: relative;
    }
    .contanier {
      padding: 14px;
      padding-top: 0;
    }
  }
  h3 {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 16px;
    color: rgba(119, 119, 119, 1);
    opacity: 1;
  }
  .telescopic {
    position: absolute;
    display: block;
    top: 300px;
    color: #00b2a1;
    font: normal 16px "Microsoft YaHei";
    width: 30px;
    margin: 0 auto;
    word-wrap: break-word;
    -webkit-box-shadow: 1px 1px 5px #cecece;
    background: #fff;
    padding: 15px 0;
    z-index: 999;
    text-align: center;
    cursor: pointer;
    box-shadow: 1px 1px 5px #cecece;
  }
  .telescopic1 {
    left: 0;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
  .telescopic2 {
    right: 0px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }
  .hide {
    width: 284px !important;
    // padding: 0 !important;
    // overflow: hidden;
    // // margin-right: 0 !important;
    margin-right: 14px;
  }
  .none {
    width: 0 !important;
    // padding: 0 !important;
    // overflow: hidden;
    // // margin-right: 0 !important;
    margin-right: 0px !important;
  }
}
</style>