<template>
  <div class="logo-container">
    <h1 class="sidebar-title">{{ title }} </h1>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  data() {
    return {
      title: '',
      logo: '//www.baidu.com/s?wd=%E4%BB%8A%E6%97%A5%E6%96%B0%E9%B2%9C%E4%BA%8B&tn=SE_PclogoS_8whnvm25&sa=ire_dl_gh_logo&rsv_dl=igh_logo_pcs'
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-container{
  height:200px;
  width:150px;
  border: 1px solid #008C83;
  margin:0 auto;
}
.sidebar-title {
  margin: 0;
  color: #fff;
  text-align: center;
  font-weight: 600;
  line-height: 50px;
  font-size: 14px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}
</style>
