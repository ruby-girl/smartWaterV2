<template>
  <div class="logo-container main-color">
    <div class="font-weight logo-margin">▍&nbsp;登录信息</div>
    <div class="display-flex logo-item-height">
      <div class="iconfont icondengluxinxi-zhanghao" />
      <div class="logo-label">账号:</div>
      <div class="main-color-fff">{{user.UserName}}</div>
    </div>
    <div class="display-flex logo-item-height">
      <div class="iconfont iconzhanghu" />
      <div class="logo-label">角色:</div>
      <div class="main-color-fff">
        <el-tooltip class="item" effect="dark" :content="user.RoleNames" placement="top" v-if="user.firstRole.length>0">
          <span>{{user.firstRole[0]}}...</span>
        </el-tooltip>
        <span v-else>{{user.RoleNames}}</span>
      </div>
    </div>
    <div class="display-flex">
      <div class="iconfont icondengluxinxi-youxiang" />
      <div class="logo-label">邮箱:</div>
    </div>
    <div class="logo-item-height">
      <div class="main-color-fff text-wrap">59703277@qq.com</div>
    </div>
    <div class="display-flex">
      <div class="iconfont icondengluxinxi-shangcidenglu" />
      <div class="logo-label">上次登录时间:</div>
    </div>
    <div class="logo-item-height">
      <div class="main-color-fff text-wrap">{{user.LastLoginTime}}</div>
    </div>
  </div>
</template>

<script>
import {getUserInfo} from '@/api/user'
export default {
  name: 'SidebarLogo',
  data() {
    return {
      user: {
        firstRole:[]
      }
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserInfo().then((res)=>{
        this.user=res.data
        this.user.firstRole=res.data.RoleNames.split(',')
      })
    }
  }  
}
</script>

<style lang="scss" scoped>
.logo-container{
  height:210px;
  width:164px;
  border: 1px solid #008C83;
  margin:20px auto;
  font-size: 14px;
  padding:15px;
  .logo-margin{
    margin-bottom: 20px;
  }
  .logo-label{
    padding:0 5px;
  }
  .logo-item-height{
    padding-bottom: 12px;
  }
}

</style>
