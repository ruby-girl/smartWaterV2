<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    title="选择工作人员"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="30vh"
    width="680px"
    center
  >
    <div class="config-dialog-body">
      <div class="config-dialog-head">
        <el-form
          ref="dataForm"
          :model="user"
          :inline="true"
          class="form-inline-small-input head-search-form"
          size="small"
          @submit.native.prevent
        >
          <el-form-item label="部门" label-width="60px" prop="RoleName">
            <el-select v-model="user.DepartmentId" placeholder="请选择" @change="getUser(1)">
              <el-option
                v-for="item in departmentOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" label-width="150px" prop="RoleName">
            <el-select
              :disabled="user.DepartmentId==''?true:false"
              v-model="user.JobId"
              placeholder="请选择"
              @change="getUser()"
            >
              <el-option
                v-for="item in customerQueryTypeOption"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 左侧展示 -->
      <div class="display-flex checkbox-box">
        <div class="config-dialog-left">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            v-show="data.length>0"
          >全选</el-checkbox>
          <el-checkbox-group v-model="checkedArr" @change="handlecheckitemChange">
            <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index">
              <div>{{item.Name}}</div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 右侧已选中 -->
        <div class="flex-1 config-dialog-right">
          <div
            class="display-flex align-items-center justify-content-flex-justify flex-wrap secur-content"
          >
            <div v-for="item in checkAllData" >
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                :content="item.Name"
                placement="bottom"
              >
                <span class="display-flex align-items-center config-label-name-box">
                  <i class="iconfont iconrenyuan"></i>
                  <span class="config-label-name">{{item.Name}}</span>
                  <i class="iconfont iconguanbi pointer" @click="delItem(item.Id)"></i>
                </span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary">确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ComboBoxList, linkComboBoxList } from "@/api/organize";
import { ComboBoxListByBice } from "@/api/basicConfig"; //根据不买呢 岗位获取人员

export default {
  props: {
    ReceiveSortMsgEmp: {},
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: {
        DepartmentId: "",
        JobId: ""
      },
      checkAll: false,
      checkAllData: [], //选中的数据
      isIndeterminate: false,
      departmentOption: [],
      customerQueryTypeOption: [],
      dialogFormVisible: true,
      checkedArr: ["1"],
      allId: [], //所有数据的ID
      data: []
    };
  },
  mounted() {
    ComboBoxList().then(res => {
      //部门
      this.departmentOption = res.data;
    });
  },
  watch: {
    show() {
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:show", val);
    }
  },
  methods: {
    updateData() {},
    handleCheckAllChange() {
      if (this.checkAll) {
        this.checkAll = true;
        this.isIndeterminate = false;
        this.checkedArr = Object.assign([], this.allId);
      } else {
        this.checkAll = false;
        this.isIndeterminate = false;
        this.checkedArr = [];
      }
      this.setCheckAllData();
    },
    getUser(type) {
      //获取具体人员
      if (type) {
        this.user.JobId = "";
        linkComboBoxList({ SYS_Department_Id: this.user.DepartmentId }).then(
          res => {
            this.customerQueryTypeOption = res.data;
          }
        );
      }
      ComboBoxListByBice(this.user).then(res => {
        this.data = res.data;
        this.allId = this.data.map(item => {
          return item.Id;
        });
      });
    },
    setCheckAllData() {
      //根据选中的ID获取数据详情，用来展示选中的人员
      this.checkAllData = [];
      this.data.forEach(item => {
        this.checkedArr.forEach(i => {
          if (item.Id == i) {
            this.checkAllData.push(item);
          }
        });
      });
    },
    handlecheckitemChange() {
      this.setCheckAllData();
      if (this.checkedArr !== this.allId && this.checkedArr.length < 1) {
        this.checkAll = false;
        this.isIndeterminate = false;
        return;
      }
      if (this.checkedArr == this.allId && this.checkedArr.length > 0) {
        this.checkAll = true;
        this.isIndeterminate = false;
        return;
      }
      if (this.checkedArr !== this.allId && this.checkedArr.length > 0) {
        this.checkAll = false;
        this.isIndeterminate = true;
        return;
      }
    },
    delItem(id){//删除选中的

    }
  }
};
</script>
<style lang="scss" scoped>
.config-dialog-body {
  border: 1px solid #d8e2e7;
}
.config-dialog-head {
  background: #f0f2f5;
  padding: 15px 0 5px 0;
}
.checkbox-box {
  .config-dialog-left {
    width: 280px;
    border-right: 1px solid #d8e2e7;
    padding: 10px 17px 17px 17px;
    overflow-y: scroll;
  }
  .config-dialog-right {
    padding: 10px;
    line-height: 30px;
    .config-label-name-box {
      background: #f5f5f5;
      padding: 0 5px;
    }
    .config-label-name {
      width: 120px;
      display: inline-block;
      padding: 0 3px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  /deep/ .el-checkbox {
    line-height: 30px;
  }
  height: 366px;
}
</style>

