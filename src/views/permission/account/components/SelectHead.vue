<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent
  >
    <el-form-item label="人员编号：">
      <el-input v-model="selectHead.roleName" placeholder @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label="角色：">
      <el-select v-model="selectHead.userNum" multiple collapse-tags placeholder="可多选" @change="selectChange">
        <!-- <el-option label="全部" value="-1" /> -->
        <el-option
          v-for="item in editUserList"
          :key="item.label"
          :label="item.label"
          :value="item.type"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态：">
      <el-select v-model="selectHead.editName" placeholder="请选择">
        <el-option label="全部" value />
        <el-option
          v-for="item in editUserList"
          :key="item.label"
          :label="item.label"
          :value="item.type"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="操作人：">
      <el-select v-model="selectHead.editName" placeholder="请选择">
        <el-option label="全部" value />
        <el-option
          v-for="item in editUserList"
          :key="item.label"
          :label="item.label"
          :value="item.type"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间：">
      <el-date-picker
        v-model="timevalue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd HH-mm-ss"
        @change="getTime"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" class="iconfont iconsousuo" @click="handleFilter">搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      timevalue: [],
      oldOptions: [],
      editUserList: [
        { label: "全部", type: "-1" },
        { label: "羊子兮", type: 1 },
        { label: "羊子兮2", type: 2 },
        { label: "羊子兮3", type: 4 },
        { label: "羊子兮4", type: 3},
        { label: "羊子兮5", type: 5 },
        { label: "羊子兮6", type: 6 },
        { label: "羊子兮7", type: 7},
        { label: "羊子兮8", type: 8 },
        { label: "羊子兮9", type: 9 },
        { label: "羊子兮10", type: 10}
      ]
    };
  },
  methods: {
    getTime(v) {
      this.selectHead.startTime = v[0];
      this.selectHead.endTime = v[1];
    },
    handleFilter() {
     this.selectHead.userNum=this.selectHead.userNum.filter((item)=>{
       return item!== "-1"
     })
      this.$emit("handleFilter", this.selectHead);
    },
    selectChange(val) {
      let allValues = [];
      //保留所有值
      for (let item of this.editUserList) {
        allValues.push(item.type);
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 0 ? [] : this.oldOptions[1]
      // 若是全部选择
      if (val.includes("-1")) this.selectHead.userNum = allValues;
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes("-1") && !val.includes("-1")) this.selectHead.userNum = [];
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes("-1") && val.includes("-1")) {
        const index = val.indexOf("-1");
        val.splice(index, 1); // 排除全选选项
        this.selectHead.userNum = val;
      }
      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes("-1") && !val.includes("-1")) {
        console.log(11);
        if (val.length === allValues.length - 1)
          this.selectHead.userNum = ["-1"].concat(val);
      }
      //储存当前最后的结果 作为下次的老数据
      this.oldOptions[1] = this.selectHead.userNum;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

