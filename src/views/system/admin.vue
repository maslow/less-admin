<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建管理员</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
      :title="dialogType === 'edit' ? '编辑管理员' : '新建管理员'"
    >
      <el-form :model="admin" label-width="100px" label-position="left">
        <el-form-item label="管理员标识">
          <el-input v-model="admin.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="管理员名称">
          <el-input v-model="admin.name" placeholder="管理员名称" />
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
  uid: undefined,
  username: '',
  name: ''
}

export default {
  data() {
    return {
      admin: Object.assign({}, defaultForm),
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false
    }
  },
  created() {
    this.getAdmins()
  },
  methods: {
    async getAdmins() {
      const res = await db.collection('admin').get()
      this.rolesList = res.data
    },
    handleAddRole() {
      this.admin = Object.assign({}, defaultForm)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.admin = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the admin?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          if (row.uid === 1) {
            return
          }
          await db
            .collection('admin')
            .where({ uid: row.uid })
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
          .collection('admin')
          .where({ uid: this.admin.uid })
          .update({
            name: this.admin.name,
            username: this.admin.username
          })
        this.getAdmins()
      } else {
        await db.collection('admin').add(this.admin)
        this.getAdmins()
      }

      const { username, name } = this.admin
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>管理员账户: ${username}</div>
            <div>管理员名称: ${name}</div>
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
  .admin-tree {
    margin-bottom: 30px;
  }
}
</style>
