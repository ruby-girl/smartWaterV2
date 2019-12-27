<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    title="选择工作人员"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="20vh"
    width="680px"
    center
    @closed="close"
    @open="open"
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
          <el-checkbox-group v-model="checkedArr">
            <el-checkbox
              v-for="(item,index) in data"
              :label="item.Id"
              :key="index"
              @change="handlecheckitemChange(item.Id)"
            >
              <div>{{item.Name}}</div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 右侧已选中 -->
        <div class="flex-1 config-dialog-right">
          <div
            class="display-flex align-items-center justify-content-flex-justify flex-wrap secur-content"
          >
            <div v-for="item in checkAllData">
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
      <el-button size="mini" type="primary" @click="confirm">确认</el-button>
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
      dialogFormVisible: false,
      checkedArr: [],
      allId: [], //所有数据的ID
      data: [],
      allData:[]//所有的人员信息
    };
  },
  mounted() {
    ComboBoxList().then(res => { //部门 
      this.departmentOption = res.data;
    });
    ComboBoxListByBice(this.user).then(res => {//。此刻this.user={ DepartmentId: "",JobId: ""}获取所有的人员，用来初始化回填显示已经选中的人员
      this.allData=res.data
    })  
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
    open(){
      this.checkedArr = this.ReceiveSortMsgEmp;
      //打开弹窗 回填显示已经选中的人员（左侧无人员展示）。此刻this.user={ DepartmentId: "",JobId: ""}获取所有的人员
      this.setCheckAllData(this.allData); 
    },
    close(){
      this.checkedArr=this.ReceiveSortMsgEmp//关闭弹窗，不保存 勾选的数据
      this.user={
         DepartmentId: "",
        JobId: ""
      }
      this.data=[]
    },
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
      this.setCheckAllData(this.data);
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
        this.allId = [...new Set(this.allId)]; //后端返回的数据会有重复的ID：一个用户多个岗位
        let newArr = this.getArrEqual(this.allId, this.checkedArr); //如果现在所有的选中项包含 新请求回来的数据，处理全选复选框
        if (newArr.length == this.allId.length) {
          //如果所有的重复数据 等于 新数据=全选
          this.checkAll = true;
          this.isIndeterminate = false;
        } else if (newArr.length > 0) {
          this.checkAll = false;
          this.isIndeterminate = true;
        } else {
          this.checkAll = false;
          this.isIndeterminate = false;
        }
      });
    },
    // 获取2个数组相同的值
    getArrEqual(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j] === arr2[i]) {
            newArr.push(arr1[j]);
          }
        }
      }
      return newArr;
    },
    setCheckAllData(arr) {//根据选中的ID获取数据详情，用来展示选中的人员--数据回填  
      this.checkAllData = [];
      arr.forEach(item => {
        this.checkedArr.forEach(i => {
          if (item.Id == i) {
            this.checkAllData.push(item);
          }
        });
      });
    },
    setRightBox(id) {// 删除or增加数据到右侧
      let isHave = this.checkedArr.some(item => {
        return item == id;
      });
      if (isHave) { //如果包含，处理右侧需要展示的对象数组 checkAllData
        this.data.forEach(item => {
          if (item.Id == id) {
            this.checkAllData.push(item);
          }
        });
      } else { //删除右侧数据
        this.checkAllData = this.checkAllData.filter(item => {
          return item.Id !== id;
        });
      }
    },
    handlecheckitemChange(id) {
      this.setRightBox(id);
      if (
        this.checkedArr.length !== this.allId.length &&
        this.checkedArr.length < 1
      ) {
        this.checkAll = false;
        this.isIndeterminate = false;
        return;
      }
      if (
        this.checkedArr.length == this.allId.length &&
        this.checkedArr.length > 0
      ) {
        this.checkAll = true;
        this.isIndeterminate = false;
        return;
      }
      if (
        this.checkedArr.length !== this.allId.length &&
        this.checkedArr.length > 0
      ) {
        this.checkAll = false;
        this.isIndeterminate = true;
        return;
      }
    },
    delItem(id) { //删除选中的
      this.checkedArr = this.checkedArr.filter(item => {
        return item !== id;
      });
      this.handlecheckitemChange(id)
    },
    confirm() {
      if(this.checkedArr.length<1){
        this.$message({
            message: '请勾选工作人员接收短信的工作人员！',
            type: "error",
            duration: 4000
          });
          return
      }
      this.dialogFormVisible=false
      this.$emit("update:ReceiveSortMsgEmp", this.checkedArr);
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
    overflow-y: auto;
    .config-label-name-box {
      background: #f5f5f5;
      padding: 0 5px;
      margin-bottom: 5px;
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

