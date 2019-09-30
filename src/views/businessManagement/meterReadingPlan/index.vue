<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head />
      </div>
      <div class="table-top-btn-padding display-flex justify-content-flex-justify">
        <el-button type="primary" size="mini" @click>
          <i class="iconfont icontianjia"></i>新增抄表计划
        </el-button>
        <div>
          <el-button type="success" size="mini" @click>
            <i class="iconfont icondaochuexcel"></i>导出Excel
          </el-button>
          <el-button type="warning" size="mini" @click>
            <i class="iconfont iconbiaogezidingyi"></i>表格自定义
          </el-button>
        </div>
      </div>
      <!-- <customTable ref="myChild" /> -->
      <!-- <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :cell-class-name="cellClass"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          :cell-style="{'padding':'7px 0'}"
          @sort-change="sortChanges"
        >
          <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              :min-width="item.ColProp=='EditTime'?'160px':'110px'"
              :prop="item.ColProp"
              align="center"
              sortable="custom"
              :label="item.ColDesc"
            /> 
          </template>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
            min-width="150px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center" v-if="row.UserStatusCode=='ZC'">
                <div class="main-color" @click="handleUpdate(row)" v-permission="['1010106']">
                  <a>编辑</a>
                </div>
                <div class="main-color-red pl-15" @click="cancel(row)" v-permission="['1010105']">
                  <a>注销</a>
                </div>
                <div class="main-color pl-15" @click="reset(row)" v-permission="['1010107']">
                  <a>重置密码</a>
                </div>
              </div>
              <div v-else class="display-flex justify-content-flex-center">
                <el-tooltip effect="dark" content="账号已注销，不可进行操作" placement="bottom-start">
                  <div class="disable-color" v-permission="['1010106']">
                    <a>编辑</a>
                  </div>
                </el-tooltip>
                <el-tooltip effect="dark" content="账号已注销，不可进行操作" placement="bottom-start">
                  <div class="disable-color pl-15" v-permission="['1010105']">
                    <a>注销</a>
                  </div>
                </el-tooltip>
                <el-tooltip effect="dark" content="账号已注销，不可进行操作" placement="bottom-start">
                  <div class="disable-color pl-15" v-permission="['1010107']">
                    <a>重置密码</a>
                  </div>
                </el-tooltip>
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
         <add-dialog
        :add-show.sync="addDialogFormVisible"
        :temp="temp"
        @createData="createData"
        :role-list="roleList"
      /> -->
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import customTable from "@/components/CustomTable/index";
export default {
  name: "MeterReadingPlan",
  components: {
    SelectHead,
    customTable
  },
  data(){
      return {
          listQuery: {
            // 查询条件
            page: 1,
            limit: 10,
            sort: "", //升序
            filed: "", //排序字段
            roldId: "-1", // 角色ID
            userState: "-1", // 账号状态
            empNo: "", // 人员编号
            empName:"",//人员姓名
            loginName:"",//账号
            editUserId: "-1", // 操作人
            editStartTime: "", // 操作时间起
            editEndTime: "", // 操作时间止
            tableId: "0000005"
          },
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
      getRoles().then(res => {
        this.roleList = res.data;
      });
    });
  },
  methods: {
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    }
  }
};
</script>
<style scoped>
</style>