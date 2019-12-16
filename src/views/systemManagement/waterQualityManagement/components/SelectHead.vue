<template>
 <div class="position-search-head">
   <el-form
    :inline="true"
    :model="selectHead"
    :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
    size="small"
    label-width="90px"
    @submit.native.prevent
    ref="formHeight"
  >
    <el-form-item label="用水性质" prop="WaterPropertyName" :label-width="!isShow?'64px':''">
      <el-input
        v-model="selectHead.WaterPropertyName"
        placeholder="长度1-50"
        maxlength="50"
        @blur="getText(selectHead.WaterPropertyName,'WaterPropertyName','','用水性质')"
      />
    </el-form-item>
    <el-form-item label="是否阶梯" label-width="64px" prop="IsLadder">
      <el-select v-model="selectHead.IsLadder" placeholder="请选择" @keydown.enter.native="handleFilter" @change="getText(selectHead.IsLadder,'IsLadder',isLadderOption,'是否阶梯')">
        <el-option label="全部" value="-1" />
          <el-option v-for="item in isLadderOption" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="用水性质类型"  v-show="showLabel(3)||isShow" prop="WaterPropertyType">
      <el-select v-model="selectHead.WaterPropertyType" placeholder="请选择" @keydown.enter.native="handleFilter" @change="getText(selectHead.WaterPropertyType,'WaterPropertyType',typeList,'用水性质类型')">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in typeList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
      <el-button round  type="primary" size="mini"  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
      <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
    </el-form-item>
  </el-form>
 </div>
</template> 
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      oldOptions: [],
      editUserList: [],
      isShow:false,
      ShowIcon:false,
      searchWidth:0,
      isLadderOption:[
        { Name: "是", Id: "1" },
        { Name: "否", Id: "0" }
      ]
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  mounted(){
     this.searchWidth=this.$parent.$refs.formHeight.clientWidth
     if(this.showLabel(3)) this.ShowIcon=false//如果能全部显示，隐藏按钮
     else this.ShowIcon=true
  },
  methods: {
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    showLabel(n){
      if(Math.floor((this.searchWidth-180)/260)>(n-1)||this.isShow)
         return true
      return false
    },
    handleFilter() {
      this.$emit("handleFilter");
    },
    resetting(){//重置
      this.$refs['formHeight'].resetFields();  
       this.$parent.tipsDataCopy=[]
       this.$parent.delTips("timevalue")
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

