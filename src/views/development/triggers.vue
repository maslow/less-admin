<template>
  <div class="app-container">
    <div v-if="func" class="func-title">
      <h3>触发函数: {{ func.label }}</h3>
      函数调用名：<el-tag type="success">{{ func.name }}</el-tag>
    </div>
    <!-- 数据检索区 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="搜索"
        style="width: 200px;margin-right: 10px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-permission="'trigger.create'" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="showCreateForm">
        新建触发器
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="240"
      >
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="showUpdateForm(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <span v-if="row.type">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="间隔" align="center">
        <template slot-scope="{row}">
          <span v-if="row.duration">{{ row.duration }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span v-if="row.description">{{ row.description }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.created_at">{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.updated_at">{{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag type="success">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="340" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-permission="'trigger.edit'" type="primary" size="mini" @click="showUpdateForm(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" v-permission="'trigger.delete'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 表单对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="触发器名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="触发器类型" />
        </el-form-item>
        <el-form-item label="事件" prop="event">
          <el-input v-model="form.event" placeholder="触发器事件" />
        </el-form-item>
        <el-form-item label="间隔" prop="duration">
          <el-input v-model="form.duration" placeholder="触发器间隔" />
        </el-form-item>
        <el-form-item label="触发器描述">
          <el-input
            v-model="form.desc"
            :autosize="{ minRows: 3, maxRows: 6}"
            type="textarea"
            placeholder="触发器描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?handleCreate():handleUpdate()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { db } from '@/api/cloud'

// 默认化创建表单的值
function getDefaultFormValue() {
  return {
    _id: null,
    name: '',
    type: '',
    event: '/db/functions#add',
    duration: 5,
    desc: '',
    status: 1,
    created_at: Date.now(),
    updated_at: Date.now()
  }
}

const formRules = {
  name: [{ required: true, message: '触发器名不可为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择触发器类型', trigger: 'blur' }]
}

export default {
  name: 'TriggerListPage',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      status = status ?? 0
      const statusMap = {
        1: 'applied'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loading: false,
      value: '',
      func: null,
      funcId: '',

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined
      },
      showReviewer: false,
      form: getDefaultFormValue(),
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: formRules,
      downloadLoading: false
    }
  },
  created() {
    this.funcId = this.$route.params.funcId
    this.getFunction()
    this.getList()
  },
  methods: {
    /**
     * 获取函数数据
     */
    async getFunction() {
      const func_id = this.funcId
      this.loading = true
      const r = await db
        .collection('functions')
        .where({ _id: func_id })
        .getOne()

      if (!r.ok || !r.data) {
        this.$notify({
          type: 'error',
          title: '错误',
          message: '加载函数失败：' + r.error
        })
        return
      }

      this.func = r.data
      this.loading = false
    },
    /**
     * 获取数据列表
     */
    async getList() {
      this.listLoading = true

      // 拼装查询条件 by this.listQuery
      const { limit, page, keyword } = this.listQuery
      const query = { }
      if (keyword) {
        query['$or'] = [
          { name: db.RegExp({ regexp: `.*${keyword}.*` }) },
          { desc: db.RegExp({ regexp: `.*${keyword}.*` }) }
        ]
      }

      // 执行数据查询
      const res = await db.collection('triggers')
        .where(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .get()
        .catch(() => { this.listLoading = false })

      this.list = res.data

      // 获取数据总数
      const { total } = await db.collection('triggers')
        .where(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .count()
        .catch(() => { this.listLoading = false })

      this.total = total
      this.listLoading = false
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 显示创建表单
    showCreateForm() {
      this.form = getDefaultFormValue()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建请求
    handleCreate() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (!valid) { return }

        const params = { ...this.form, func_id: this.funcId }
        console.log(params)

        // 执行创建请求
        const r = await db.collection('triggers')
          .add(params)

        if (!r.id) {
          this.$notify({
            type: 'error',
            title: '操作失败',
            message: '创建失败！' + r.error
          })
          return
        }

        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '创建成功！'
        })

        this.getList()
        this.dialogFormVisible = false
      })
    },
    // 显示更新表单
    showUpdateForm(row) {
      this.form = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新请求
    handleUpdate() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (!valid) { return }

        // 执行创建请求
        const r = await db.collection('triggers')
          .where({ _id: this.form._id })
          .update({
            name: this.form.name,
            type: this.form.type,
            event: this.form.event,
            duration: this.form.duration,
            desc: this.form.desc,
            updated_at: Date.now()
          })

        if (!r.ok) {
          this.$notify({
            type: 'error',
            title: '操作失败',
            message: '更新失败！' + r.error
          })
          return
        }

        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '更新成功！'
        })

        this.getList()
        this.dialogFormVisible = false
      })
    },
    // 删除请求
    async handleDelete(row, index) {
      await this.$confirm('确认要删除此数据？', '删除确认')

      // 执行删除请求
      const r = await db.collection('triggers')
        .where({ _id: row._id })
        .remove()

      if (!r.ok) {
        this.$notify({
          type: 'error',
          title: '操作失败',
          message: '删除失败！' + r.error
        })
        return
      }

      this.$notify({
        type: 'success',
        title: '操作成功',
        message: '删除成功！'
      })

      this.list.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.func-title {
  margin-bottom: 20px;
}

</style>
