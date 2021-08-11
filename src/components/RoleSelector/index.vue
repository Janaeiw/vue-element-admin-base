<template>
  <el-select
    :loading="loading"
    :multiple="multiple"
    v-model="roleId"
    placeholder="请选择"
    filterable
    clearable
    :popper-append-to-body="false"
    @change="onChange"
  >
    <el-option
      v-for="item in roles"
      :key="item.id"
      :label="item.title"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { readAllRoles } from '@/api/role'
export default {
  name: 'RoleSelector',
  props: {
    type: {
      type: Number,
      default: 0
    },
    value: {
      type: [Array, String, Number],
      default() {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      roleId: [],
      roles: []
    }
  },
  watch: {
    value(val) {
      this.roleId = val
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      readAllRoles({
        type: this.type
      }).then((res) => {
        this.roles = res.data || []
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    onChange() {
      this.$emit('input', this.roleId)
      this.$emit('change', this.roleId)
    }
  }
}
</script>
