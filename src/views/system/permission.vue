<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建权限</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标识" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.label }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >Edit</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑权限' : '新建权限'"
    >
      <el-form :model="permission" label-width="80px" label-position="left">
        <el-form-item label="权限标识">
          <el-input v-model="permission.name" placeholder="唯一标识，为字母" />
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="permission.label" placeholder="权限显示名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="permission.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="权限描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible = false"
        >取消
        </el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { db } from '@/api/cloud'

const defaultForm = {
  id: '',
  name: '',
  label: '',
  description: ''
}

export default {
  data() {
    return {
      permission: Object.assign({}, defaultForm),
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      const res = await db.collection('permission').get()
      this.rolesList = res.data
    },
    handleAddRole() {
      this.permission = Object.assign({}, defaultForm)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.permission = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the permission?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await db
            .collection('permission')
            .where({ id: row.id })
            .remove()

          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await db
          .collection('permission')
          .where({ id: this.permission.id })
          .update({
            name: this.permission.name,
            label: this.permission.label,
            description: this.permission.description
          })
        this.getPermissions()
      } else {
        await db.collection('permission').add(this.permission)
        this.getPermissions()
      }

      const { description, name, label } = this.permission
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>权限标识: ${name}</div>
            <div>权限名称: ${label}</div>
            <div>描述: ${description}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
