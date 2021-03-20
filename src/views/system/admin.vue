<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddForm">新建管理员</el-button>
    <el-table :data="admins" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="{ row }">
          <el-tag
            v-for="role in row.roles"
            :key="role.id"
            closable
            @close="removeRole(row, role)"
          >
            {{ role.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑管理员' : '新建管理员'"
    >
      <el-form :model="admin" label-width="100px" label-position="left">
        <el-form-item label="管理员标识">
          <el-input v-model="admin.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="管理员密码">
          <el-input
            v-model="admin.password"
            type="password"
            :placeholder="dialogType === 'edit' ? '不修改则留空' : '管理员密码'"
          />
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
        <el-button type="primary" @click="confirmForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { db } from '@/api/cloud'
import * as user from '@/api/user'
import { array2map, applyMap2arrayInArray } from '../../utils/array'

const defaultForm = {
  uid: undefined,
  username: '',
  name: '',
  password: ''
}

export default {
  data() {
    return {
      admin: Object.assign({}, defaultForm),
      admins: [],
      dialogVisible: false,
      dialogType: 'new',
      roles: [] // 所有的角色列表
    }
  },
  async created() {
    await this.getRoles()
    await this.getAdmins()
  },
  methods: {
    /** 获取管理员列表 */
    async getAdmins() {
      const res = await db.collection('admins')
        .get()

      const rolesMap = array2map(this.roles, 'name')
      this.admins = applyMap2arrayInArray(rolesMap, res.data, 'roles')
    },
    /** 获取所有的角色列表 */
    async getRoles() {
      const res = await db.collection('roles').get()
      this.roles = res.data || []
    },
    /** 打开添加表单  */
    handleAddForm() {
      this.admin = Object.assign({}, defaultForm)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    /** 打开编辑表单 */
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.admin = deepClone(scope.row)
      this.admin.password = ''
    },
    /** 删除数据 */
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
            .collection('admins')
            .where({ uid: row.uid })
            .remove()

          this.admins.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },

    /** 编辑或新建 */
    async confirmForm() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        const data = {
          uid: this.admin.uid
        }
        if (this.admin.username) {
          data['username'] = this.admin.username
        }
        if (this.admin.name) {
          data['name'] = this.admin.name
        }
        if (this.admin.password) {
          data['password'] = this.admin.password
        }

        await user.edit(data)
        this.getAdmins()
      } else {
        const data = {
          username: this.admin.username,
          name: this.admin.name,
          password: this.admin.password
        }
        await user.add(data)
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
    },

    /** 删除管理员的一个角色 */
    async removeRole(admin, role) {
      // TODO
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
