<script>
export default {
  created() {
    const { params, query } = this.$route
    let { path } = params
    path = typeof path === 'undefined' ? '/' : '/' + path
    this.$router.replace({ path, query })
  },
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
