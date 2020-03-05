<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="68px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item label="水厂" :label-width="!isShow?'40px':''" prop="WaterFactoryId">
        <el-select
          v-model="selectHead.WaterFactoryId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterFactoryId,'WaterFactoryId',waterWorksOption,'水厂')"
        >
          <el-option label="全部" value="-1" v-show="waterWorksOption.length>1"/>
          <el-option v-for="item in waterWorksOption" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="CustomerQueryType">
        <el-select
          v-model="selectHead.CustomerQueryType"
          placeholder="请选择"
          class="user-select-box"
          style="width: 100px;float: left;margin-right:3px;"
          @change="getscName(selectHead.CustomerQueryType)"
        >
          <el-option label="用户编号" value="1"></el-option>
          <el-option label="姓名/简码" value="2"></el-option>
        </el-select>
        <el-input
          v-model="selectHead.CustomerQueryValue"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
          style="width: 180px;float: left"
        />
      </el-form-item>
      <transition-group name="fade">
        <el-form-item label="用户类型"  prop="UserType" v-show="showLabel(2)||isShow" key="UserType">
          <el-select
            v-model="selectHead.UserType"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.UserType,'UserType',userType,'用户类型')"
          >
            <el-option label="全部" value="-1" />
            <el-option v-for="item in userType" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用水性质" prop="WaterPropertyId" v-show="showLabel(3)||isShow" key="WaterPropertyId">
          <el-select
            v-model="selectHead.WaterPropertyId"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.WaterPropertyId,'WaterPropertyId',waterProperty,'用水性质')"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in waterProperty"
              :key="item.Id"
              :label="item.UseWaterTypeName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="水表类型" prop="WaterTypeId" v-show="showLabel(4)||isShow" key="WaterTypeId">
          <el-select
            v-model="selectHead.WaterTypeId"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.WaterTypeId,'WaterTypeId',waterType,'水表类型')"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in waterType"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="SA_UserArea_Id" v-show="showLabel(5)||isShow" key="SA_UserArea_Id">
          <treeselect placeholder="请选择" :searchable="false" v-model="selectHead.SA_UserArea_Id" :options="orgTree" />
        </el-form-item>
      </transition-group>
      <el-form-item>
        <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
         <el-button type="primary" size="mini" round @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
       <el-button size="mini" class="btn-add" round  @click="resetting"><i class="iconfont icon_zhongzhi"></i>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission";
import { getOrgTree } from "@/utils/projectLogic";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    waterProperty:{}
  },
  components: { Treeselect },
  data() {
    return {
      userType: [], //用户类型
      waterType: [], //水表类型
      waterWorksOption: [], //水厂
      orgTree: [],
      isShow: false,
      ShowIcon: false,
      searchWidth: 0,
      secNmae: "用户编号"
    };
  },
  created() {
    this.searchWidth = document.body.clientWidth - 160; //160左侧导航宽度
    this.waterWorksOption = this.$store.state.user.waterWorks;
    if (this.waterWorksOption.length == 1) {    
      this.selectHead.SA_WaterFactory_Id = this.waterWorksOption[0].Id;
      this.getArea(this.selectHead.SA_WaterFactory_Id)
    }else{
      this.getArea(-1)
    }
    this.userType = getDictionaryOption("用户类型");
    this.waterType = getDictionaryOption("水表类型");
  },
  mounted() {
    if (this.showLabel(5)) this.ShowIcon = false;
    //如果能全部显示，隐藏按钮
    else this.ShowIcon = true;
  },
  methods: {
    getscName(id) {
      this.secNmae = id == 1 ? "用户编号" : "姓名/简码";
      this.getText(
        this.selectHead.customerQueryValue,
        "customerQueryValue",
        "",
        this.secNmae
      );
      
    },
    getArea(id) {
      getOrgTree(
        function(res) {
          this.orgTree = res;
          this.selectHead.SA_UserArea_Id = "-1";
        }.bind(this),
        id
      );
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
      if(name=='水厂'){
        this.getArea(val)
      }
    },
    showLabel(n) {
      if (Math.floor((this.searchWidth - 180) / 310) > n || this.isShow)
        return true;
      return false;
    },
    handleFilter() {
      this.$emit("handleFilter");
    },
    resetting(){//重置
      this.$refs['formHeight'].resetFields();  
       this.$parent.tipsDataCopy=[]
      this.$parent.getList()    
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

