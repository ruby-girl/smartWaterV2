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
          <!-- 编辑弹窗 -->
          <Dialog
            :show.sync="dialogFormVisible"
            :temp="temp"
            :dialog-status="dialogStatus"
            @createData="createData"
            @updateData="updateData"
          />
        </div>
        <span v-show="ifShow" class="telescopic telescopic1" @click="getUp">
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
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      name: "r",
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        roleName: "", // 角色名称
        editUserId: "-1", // 操作人
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000004"
      },
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableData: [],
      checksData: []
    };
  },
  methods: {
    /**
     * 伸缩功能
     * */
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
      getRolesList(this.listQuery).then(res => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    delRow(r) {
      this.$confirm("是否删除当前信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        deleteRole(r.Id).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    
    createData(dialog) {
      // addRole(dialog.RoleName).then(res => {
      //   this.$message({
      //     message: res.message,
      //     type: "success",
      //     duration: 4000
      //   });
      //   this.dialogFormVisible = false;
      //   this.handleFilter();
      // });
    },
    updateData(dialog) {
      updateRole(dialog.RoleName, dialog.Id).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        for (const v of this.tableData) {
          if (v.Id == this.temp.Id) {
            const index = this.tableData.indexOf(v);
            this.tableData.splice(index, 1, this.temp);
            break;
          }
        }
        this.dialogFormVisible = false;
      });
    },
    excel() {
      //导出
      exportExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    }
  },
  mounted() {}
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
    .user_tree {
      width: 280px;
      position: relative;
      background: #fff;
      padding: 0 13px;
      margin-right: 16px;
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
