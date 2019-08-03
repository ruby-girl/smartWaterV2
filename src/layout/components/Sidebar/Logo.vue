<template>
  <div class="logo-container main-color">
    <div class="font-weight logo-margin">▍&nbsp;登录信息</div>
    <div class="display-flex logo-item-height">
      <div class="iconfont icondengluxinxi-zhanghao" />
      <div class="logo-label">账号:</div>
      <div class="main-color-fff">admin</div>
    </div>
    <div class="display-flex logo-item-height">
      <div class="iconfont iconzhanghu" />
      <div class="logo-label">角色:</div>
      <div class="main-color-fff">管理员</div>
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
      <div class="main-color-fff text-wrap">2018-08-02</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  data() {
    return {
      title: 'asdasdasd',
      logo: '//www.baidu.com/s?wd=%E4%BB%8A%E6%97%A5%E6%96%B0%E9%B2%9C%E4%BA%8B&tn=SE_PclogoS_8whnvm25&sa=ire_dl_gh_logo&rsv_dl=igh_logo_pcs'
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
