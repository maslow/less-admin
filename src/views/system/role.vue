<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色标识" width="220">
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
      <el-table-column align="center" label="权限">
        <template slot-scope="{ row }">
          <el-tag
            v-for="perm in row.permissions"
            :key="perm._id"
            style="margin: 3px 6px"
            closable
          >
            {{ perm.label }}
          </el-tag>
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
      :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色标识">
          <el-input v-model="role.name" placeholder="唯一标识，为字母" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="role.label" placeholder="角色显示名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible = false"
        >Cancel
        </el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { db } from '@/api/cloud'
import { applyMap2arrayInArray, array2map } from '@/utils/array'

const defaultForm = {
  _id: undefined,
  name: '',
  label: '',
  description: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultForm),
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await db.collection('roles').get()
      const { data: permissions } = await db.collection('permissions').get()
      const permsMap = array2map(permissions, 'name')
      this.rolesList = applyMap2arrayInArray(permsMap, res.data, 'permissions')
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultForm)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          if (row.id === 1) {
            return
          }
          await db
            .collection('roles')
            .where({ _id: row._id })
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
          .collection('roles')
          .where({ _id: this.role._id })
          .update({
            name: this.role.name,
            label: this.role.label,
            description: this.role.description
          })
        this.getRoles()
      } else {
        await db.collection('roles').add(this.role)
        this.getRoles()
      }

      const { description, name, label } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色标识: ${name}</div>
            <div>角色名称: ${label}</div>
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
