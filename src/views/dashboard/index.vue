<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  created(){
      document.onkeydown = function(e) {
        var ev = document.all ? window.event : e;
        var obj = ev.target || ev.srcElement;
        var t = obj.type;    
        if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") {
				// 禁用BackSpace事件
            return false;
        }
    };
    this.$store.dispatch("user/getWaterWorks")//获取全局该操作人有权限操作的水厂
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  }
}
</script>
<style lang="scss">
  .dashboard-container{
    height: calc(100vh - 64px);position: relative;
  }
</style>

