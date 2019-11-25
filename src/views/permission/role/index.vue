<template>
  <div class="section-container">
   <div class="section-full-container">
      <div ref="formHeight">
      <select-head :select-head="listQuery" @handleFilter="handleFilter" />
    </div>
    <div class="display-flex justify-content-flex-justify">
      <el-button type="primary" size="mini"  @click="addRole"><i class="iconfont icontianjia"></i>添加</el-button>
      <div>
        <el-button type="success" size="mini"  @click="excel"><i class="iconfont icondaochuexcel"></i>导出Excel</el-button>
      <el-button
        type="warning"
        size="mini"
        @click="setCustomData()"
      ><i class="iconfont iconbiaogezidingyi"></i>表格自定义</el-button>
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
        <el-table-column type="index" label="序号" width="80" align="center"/>
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
              <div  class="main-color-red pl-15" @click="delRow(row)">
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
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import Pagination from "@/components/Pagination";
import Dialog from "./components/Dialog";
import customTable from "@/components/CustomTable/index";
import { getRolesList, addRole, updateRole,deleteRole,exportExcel } from "@/api/role";
export default {
  name:'RolePermission',
  components: { SelectHead, Pagination, Dialog, customTable },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed:"",
        sort:"",
        roleName: "", // 角色名称
        editUserId: "-1", // 操作人
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: '0000004'
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
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if(this.$refs.myChild.isCustom)
        this.tableHeight=this.tableHeight-80
      else
        this.tableHeight=this.tableHeight+80
    },
    getList() {
      getRolesList(this.listQuery).then(res => {
        this.total=res.count
        this.tableData=res.data
      });
    },
    sortChanges({prop, order }){//筛选
      this.listQuery.filed=prop
      this.listQuery.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
      if(this.tableData.length>0){
        this.listQuery.page=1
        this.getList()
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
        deleteRole(r.Id).then((res)=>{
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList()
        })
      });
    },
    addRole() {
      this.temp = {};
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData(dialog) {
      addRole(dialog.RoleName).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        this.handleFilter();
      });
    },
    updateData(dialog) {
      updateRole(dialog.RoleName,dialog.Id).then(
        res => {
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
        }
      );
    },
    excel(){//导出
      exportExcel(this.listQuery).then((res)=>{      
        window.location.href = `${this.common.excelPath}${res.data}`;
      })
    }
  }
};
</script>

