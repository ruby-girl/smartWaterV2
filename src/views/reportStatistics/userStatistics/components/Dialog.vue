<template>
  <el-dialog
    :close-on-click-modal="false"
    top="0vh"
    title="用户详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="80%">
    <p class="reportExport"><i class="icon iconfont iconlujing1 fr"></i></p>
    <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges" show-summary>
      <el-table-column
        prop="date"
        label="用户编号"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="姓名"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="水厂"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="所属区域"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="水表类型"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="用水性质"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="用户类型"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="电话"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="用户状态"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="开户人"
        align="center"
        min-width="200px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="开户时间"
        align="center"
        min-width="200px">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import { AddPost, UpDatePost } from "@/api/organize"// 请求方法
  export default {
    name: "Dialog",
    data() {
      return {
        tableData:[],
        dialogVisible: false,
        tableHeight:null
      }
    },
    methods: {
      handleClose(){//编辑弹窗关闭事件
        this.dialogVisible = false;
        this.ruleForm = {
          SYS_Department_Id: '',
          JobName: ''
        }
        this.$refs['ruleForm'].resetFields();
      },
      exportExcel(){//导出
      },
      sortChanges(){//排序
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight -  140
    }
  }
</script>
<style lang="scss">
  .reportExport{ width: 100%;height: 34px;position: relative;border: 1px solid #e6ebf5;border-bottom:none;margin: 0;
    i{
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-left: solid 1px #e6ebf5;
      cursor: pointer;
    }
    i:hover {color: #00B3A1}
  }
</style>
