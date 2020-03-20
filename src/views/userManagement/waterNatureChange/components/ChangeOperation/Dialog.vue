<template>
  <!-- 编辑弹窗 -->
  <el-dialog title="变更用水性质" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="30vh" width="500px" @open="isOpenFun" center>
    <el-form
      ref="dataForm"
      :model="temp"
      :inline="true"
      class="form-inline-small-input head-search-form"
      size="small"
      label-width="140px"
      @submit.native.prevent
    >
      <el-form-item label="用水性质">
       <el-select
            v-model="temp.SA_UseWaterType_Id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in waterProperty"
              :key="item.Id"
              :label="item.UseWaterTypeName"
              :value="item.Id"
            />
          </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="updateData()">{{isOpen?"提交审核":"确定"}}</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {ConfirmChangeWaterProperty} from "@/api/system"
import { getOpenFlag } from "@/utils/projectLogic";
export default {
  props: {  
    temp: {},
    show: {
      type: Boolean,
      default: false
    },
    waterProperty:{}//用水性质
  },
  data() {
    return {
      dialogFormVisible: false,
      obj:{
          newWaterPropertyId:'',
          customerId:''
      },
      isOpen:false
    }
  },
  watch: {
    show (v) {
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible (val, oldVal) {
      if (val === oldVal) {
        return
      }
      this.$emit('update:show', val)
    }
  },
  methods: {
    isOpenFun(){
       getOpenFlag(2907).then(val => {
      this.isOpen = val;
    });
    },
    updateData() {
        this.obj.newWaterPropertyId=this.temp.SA_UseWaterType_Id
        this.obj.customerId=this.temp.Id
        ConfirmChangeWaterProperty(this.obj).then(res=>{
            this.dialogFormVisible=false
            this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
            this.$emit('getList')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.head-search-form{
    margin-bottom: 150px;
}
</style>

