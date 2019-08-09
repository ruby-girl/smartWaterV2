<template>
  <div class="app-container">
    <div>asdad</div>
  </div>
</template>

<script>
export default {
  name: 'PagePermission',
  created() {
    this.$confirm('这里是需要确认的信息', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'warningBox',
      showClose: false
    }).then(() => {
      
    })
  },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    }
  }
}
</script>
