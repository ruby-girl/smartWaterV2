<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import { planConpanySelect } from '@/api/plan'
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
    planConpanySelect().then(res => {
       this.$store.state.app.companyArr=res.data
    })
    
  
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

