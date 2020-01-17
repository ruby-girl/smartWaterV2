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
      <el-form-item
        label="水厂"
        :label-width="isShow?'68px':'40px'"
        prop="SA_WaterFactory_Id"
        v-show="show1||isShow"
      >
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyOptions,'水厂')"
        >
          <el-option label="全部" v-if="companyOptions.length!=1" value="-1"></el-option>
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模块" v-show="show2||isShow" prop="sYS_Model_Name">
         <treeselect
            placeholder="请选择"
            :searchable="false"
            v-model="selectHead.sYS_Model_Name"
            :options="orgTree"
            @change="getText(selectHead.sYS_Model_Name ,'AreasYS_Model_NameId',orgTree,'模块')"
          />
      
      </el-form-item>
      <el-form-item label="操作人" v-show="show3||isShow" prop="user_Id">
        <el-select
          v-model="selectHead.user_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.user_Id,'user_Id',editUserList,'操作人')"
        >
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in editUserList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作类容" v-show="show4||isShow" key="content" prop="content">
        <el-input
          v-model="selectHead.content"
          maxlength="50"
          @change="getText(selectHead.content,'content','','操作类容')"
        />
      </el-form-item>
      <el-form-item label="日期" label-width="40px" v-show="show5||isShow">
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          default-format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          @keydown.enter.native="handleFilter"
          @change="getTime"
        />
      </el-form-item>
      <el-form-item>
        <span class="isShow" :class="{tro:isShow}" v-if="showBtn">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button round type="primary" size="mini" @click="handleFilter">
          <i class="iconfont iconsousuo"></i>
          搜索
        </el-button>
        <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission";
import { getLabelName } from "@/utils/projectLogic"; //获取lable
import {getBoxList} from "@/api/log"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { getSelectUser } from "@/api/account"; //获取操作人下拉框
export default {
  components:{Treeselect},
  props: {
    searchWidth: {}
  },
  data() {
    return {
      companyOptions: [], //水厂
      WaterMeterList: [], //水表类型
      userTypeList: [], //用户类型
      editUserList: [], //操作员、经办人
      selectHead: {},
      planStateOptions: [],
      dateArr: [], //日期数组
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      showBtn: false,
      orgTree:[],//模块
      editUserList:[],//操作人
      
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        this.show5 = this.showLabel(5, val);
        if (Math.floor((val - 180) / 280) < 6) {
          this.showBtn = true;
        } else {
          this.showBtn = false;
        }
      },
      immediate: true
    }
  },
  methods: {
     mapTree(org) {
  const haveChildren =
    Array.isArray(org.children) && org.children.length > 0;
  if (haveChildren) {
    return {
      //分别将我们查询出来的值做出改变他的key
      label: org.label,
      id: org.label,
      Id: org.label,
      Name: org.label,
      //判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
      children: org.children.map(i => this.mapTree(i))
    };
  } else {
    return {
      label: org.label,
      id: org.label,
      Id: org.label,
      Name: org.label
    }
  }
},
    getTree(){
      getBoxList().then(res=>{
        this.orgTree = res.data.map(org => this.mapTree(org));
        // this.orgTree=res.data
      })
    },
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("dateArr");
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n  || this.isShow) return true;
      return false;
    },
    handleFilter() {
      this.selectHead.WaterFactoryName = getLabelName(
        this.selectHead.SA_WaterFactory_Id,
        this.companyOptions
      );
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime() {
      //时间格式化
      let date = this.dateArr;
      let dateRang=''
      if (date) {
        this.selectHead.starDateTime = date[0] 
        this.selectHead.endDateTime = date[1] 
dateRang=date[0] +"~"+date[1]
        this.$emit("getText", dateRang, "dateArr", "", "日期");
      } else {
        dateRang=''
      this.selectHead.starDateTime =""
        this.selectHead.endDateTime = "" 
        this.$emit("getText", dateRang, "dateArr", "", "日期");
      }
    }
  },
  created() {
    this.companyOptions = this.$store.state.user.waterWorks;
    if (this.companyOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions.Id;
    }
    this.getTree()
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  mounted() {
    this.selectHead = this.$parent.selectHead;
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 100%;
}
  /deep/.vue-treeselect{
      width:180px!important;
    }
</style>