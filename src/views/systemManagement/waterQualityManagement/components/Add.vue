<template>
  <!-- 新增弹窗 -->
  <el-dialog
    :title="dialogStatus=='create'?'添加':'编辑'"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="1020px"
    center
    custom-class="nopadding"
    @closed="addDialogClose"
    @open="isOpenFun"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormAdd"
      :model="temp"
      :inline="true"
      class="form-inline-small-input dialog-title-border-shadow"
      size="small"
      label-width="120px"
    >
      <el-form-item label="是否执行阶梯计价">
        <el-radio-group v-model="temp.isLadder">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'2'">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <components :dialogStatus="dialogStatus" :is="LadderComponents" :temp="temp" ref="childrenTemp" :type-list="typeList"></components>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="createData">{{isOpen?"提交审核":"确定"}}</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import LadderTrue from "./LadderTrue";
import LadderFalse from "./LadderFalse";
import {ladderChangeObj} from "@/utils/index"
import { getOpenFlag } from "@/utils/projectLogic";
export default {
  props: {
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    },
    dialogStatus:{
      type: String,
      default: 'create'
    },
    addShow: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    LadderTrue,
    LadderFalse
  },
  watch: {
    addShow() {
      this.AdialogFormVisible = this.addShow;     
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:addShow", val);
    },
    "temp.isLadder": {    
      handler(val, oldVal) {
        if (val == 1) {
          this.LadderComponents = "LadderTrue";
        } else {
          this.LadderComponents = "LadderFalse";
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      timevalue: [],
      LadderComponents: "LadderTrue",
      AdialogFormVisible: false,
      userOptions: [],
      userOptionsSave: [],
      isOpen:false
    };
  },
  methods: {
    isOpenFun(){
       getOpenFlag(2908).then(val => {
      this.isOpen = val;
    });
    },
    updateData() {
      this.$refs["childrenTemp"].$refs["dataFormTrue"].validate(valid => {
        if (!valid) return false;
        else {
          this.$emit("updateData", this.temp);
        }
      });
    },
    // 新增
    createData() {   
      let judge=this.temp.isLadder==1?"dataFormTrue":"dataFormFalse"
      this.$refs["childrenTemp"].$refs[judge].validate(valid => {
        if (!valid) return false;
        else {
          if(this.temp.isLadder==1){
            if(!this.validateTrue()){
              return false
            }
          }
          this.temp.isLadder==1?this.temp.IsLadder=true:this.temp.IsLadder=false
         if(this.dialogStatus=='create'){
            this.$emit("createData", this.temp);
         }else{
           this.$emit("updateData", this.temp);
         }
        }
      });
    },
    // 验证为有阶梯时
    validateTrue() {
      // 去第一个阶段
      let LadderNumber = this.temp.LadderNumber;
      let arr = this.temp.ladder.filter(function(item, i) {
        return i !== 0 && i < LadderNumber;
      });
      // 有为空的阶段
      let notNum = arr.filter(item => {
        return (
          item.LadderPrice == 0 ||
          item.LadderWaterNum == 0 ||
          item.TotalPrice == 0
        );
      });
      if (notNum.length > 0) {
        this.$message({
          message: "请正确填写已添加的阶段！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      let arrFirst = this.temp.ladder.filter(function(item, i) {
        return i == 0 && (item.LadderPrice == 0 || item.TotalPrice == 0);
      });
      if (arrFirst.length > 0) {
        this.$message({
          message: "请正确填写已添加的阶段！",
          type: "error",
          duration: 4000
        });
        return false;
      } else {
        // 阶梯数组赋值给对象
        this.temp=ladderChangeObj(this.temp)
        return true;
      }
    },
    addDialogClose() {
      this.$nextTick(() => {
        this.userOptions = this.userOptionsSave;
        this.$refs["dataFormAdd"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

