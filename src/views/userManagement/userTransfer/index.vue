<template>
  <div class="tree_container">
    <div class="user_box">
      <left-box @getUp="getUp" :ifShow="ifShow"></left-box>
      <div class="user_table">
        <div class="section-full-container">
          <div ref="formHeight">
            <select-head :select-head="listQuery" @handleFilter="handleFilter" />
          </div>
          <div class="display-flex justify-content-flex-justify">
           <div></div>
            <div>
              <el-button type="success" size="mini" @click="excel">
                <i class="iconfont icondaochuexcel"></i>导出Excel
              </el-button>
              <el-button type="warning" size="mini" @click="setCustomData()">
                <i class="iconfont iconbiaogezidingyi"></i>表格自定义
              </el-button>
            </div>
          </div>
          <customTable ref="myChild" />
          <div class="main-padding-20-y">
            <el-table
              :key="tableKey"
              :data="tableData"
              border
              :height="tableHeight"
              style="width: 100%;"
              :header-cell-style="{'background-color': '#F0F2F5'}"
              :cell-style="{'padding':'7px 0'}"
              @sort-change="sortChanges"
            >
              <el-table-column fixed="left" label="序号" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <template v-for="(item ,index) in tableHead">
                <el-table-column
                  :key="index"
                  min-width="100px"
                  :prop="item.ColProp"
                  align="center"
                  :sortable="item.IsSortBol?'custom':null"
                  :label="item.ColDesc"
                />
              </template>
              <el-table-column label="操作" align="center" class-name="small-padding">
                <template slot-scope="{row}">
                  <div class="display-flex justify-content-flex-center">
                    <div class="main-color" @click="handleUpdate(row)">
                      <a>编辑</a>
                    </div>
                    <div class="main-color-red pl-15" @click="delRow(row)">
                      <a>删除</a>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              @pagination="getList"
            />
          </div>
        </div>
        <span v-show="ifShow" class="telescopic telescopic1" @click="getUp(false)">
          展开
          <i class="iconfont iconshouqi1" style="font-size: 12px;"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import LeftBox from "./components/Left"
import {TransferCustomerList} from "@/api/userAccount";
import customTable from "@/components/CustomTable/index";
import Pagination from "@/components/Pagination";
import "@/styles/organization.scss";
export default {
  name: "userSeting",
  components: { SelectHead, customTable, Pagination,LeftBox},
  data() {
    return {
      ifShow: false,
      total: 0,
      tableKey: 9,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
       SA_WaterFactory_Id:'-1',//水厂
       UserType:'-1',//用户类型
       WaterTypeId:'-1',//水表类型
       TransferCustomer:'',//查询类型
       Customer:'',//Input值
       OpId:'-1',//过户操作员
       Star_TransferDate:'',//开始时间
       End_TransferDate:'',//开始时间
       tableId: "0000004"
      },
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableData: [],
      checksData: []
    };
  },
  computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
   mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 220;
      this.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
     
    });
  },
  methods: {
    getUp(v) {
      this.ifShow =v;
      if (this.ifShow) {
        document.getElementsByClassName("user_tree")[0].classList.add("hide");
      } else {
        document
          .getElementsByClassName("user_tree")[0]
          .classList.remove("hide");
      }
    },
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    },
    getList() {
      TransferCustomerList(this.listQuery).then(res => {
        this.total = res.count;
        this.tableData = res.data;
      });
    },
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
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    excel() {
      //导出
      exportExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tree_container {
  .icon {
    font-size: 14px;
  }
  background: #eff1f4;
  .telescopic {
    position: absolute;
    display: block;
    top: 300px;
    color: #777c82;
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
  position: relative;
  padding: 16px 16px 0 16px;
  height: calc(100vh - 74px);
  .user_box {
    display: flex;
    height: inherit;
    > div {
      transition: width 0.2s;
      -webkit-transition: width 0.2s;
      position: relative;
    }
    .user_table {
      flex: 1;
      -webkit-flex: 1;
      background: #fff;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }
  }
  .el-button--mini {
    padding: 7px 5px;
  }
  .hide {
    width: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    margin-right: 0 !important;
  }
  .none {
    display: none;
  }
  .user_table {
    .el-button--small {
      padding: 7px 15px;
    }
  }
}
</style>
