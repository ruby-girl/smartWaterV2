<template>
  <el-menu
    default-active="2">
    <el-submenu index="1">
      <template slot="title">
        <span>用户管理</span>
      </template>
      <el-menu-item index="1-1">用户开户</el-menu-item>
      <el-menu-item index="1-2">低保户管理</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <span>收费管理</span>
      </template>
      <el-menu-item index="2-1">用户开户</el-menu-item>
      <el-menu-item index="2-2">低保户管理</el-menu-item>
    </el-submenu>
    <el-menu-item index="3">
      <span slot="title">导航3</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
    export default {
        name: "MenuTree"
    }
</script>

<style scoped>

</style>
