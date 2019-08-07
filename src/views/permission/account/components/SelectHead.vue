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
      <el-select
        v-model="selectHead.userNum"
        multiple
        placeholder="可多选">
       <el-option
         v-for="item in editUserList"
         :key="item.label"
         :label="item.label"
         :value="item.type">
       </el-option>
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
        @change="getTime">
      </el-date-picker>
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
        return {}
      }
    }
  },
  data() {
    return {
      timevalue: [],
      editUserList: [{ label: '羊子兮', type: 1 }, { label: '羊子兮2', type: 2 }]
    }
  },
  methods: {
    getTime(v) {
      this.selectHead.startTime = v[0]
      this.selectHead.endTime = v[1]
    },
    handleFilter() {
      console.info(this.selectHead)
      this.$emit('handleFilter', this.selectHead)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

