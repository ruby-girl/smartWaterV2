<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'PagePermission',
  components: { SwitchRoles },
  created() {
    this.$confirm('这里是需要确认的信息', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'warningBox',
      showClose: false
    }).then(() => {
      console.log('asd')
    })
  },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    }
  }
}
</script>
