<template>
  <div class="components-container">
    <div class="create-btn" style="margin-bottom: 10px">
      <el-button v-permission="'function.create'" type="primary" :disabled="loading" @click="dialogVisible = true">新建</el-button>
      <el-button v-permission="'function.read'" icon="el-icon-refresh" type="info" style="margin-left: 5px" :disabled="loading" @click="getFunctions">刷新</el-button>
    </div>

    <el-select v-model="currentFuncIndex" placeholder="选择函数" style="margin-left: 5px; width: 300px" :loading="loading">
      <el-option
        v-for="(item, index) in functions"
        :key="item._id"
        :label="item.label + ` (${item.name}) `"
        :value="index"
      />
    </el-select>
    <el-button v-permission="'function.edit'" type="primary" style="margin-left: 5px" :disabled="loading || !functions.length" @click="updateFunc">保存</el-button>
    <el-button v-permission="'function.delete'" type="info" size="mini" style="margin-left: 20px" :disabled="loading|| !functions.length" @click="removeFunc">删除</el-button>

    <div style="display: flex;">
      <div class="editor-container">
        <js-editor ref="jsEditor" v-model="value" />
      </div>
      <div class="invoke-panel">
        <div class="title">调用参数
          <el-button v-permission="'function.debug'" size="mini" type="success" style="margin-left: 10px" :disabled="loading || !func" @click="launch">运行</el-button>

        </div>
        <div class="editor">
          <json-editor ref="jsonEditor" v-model="invokeParams" :line-numbers="true" />
        </div>
        <div v-if="invokeResult" class="invoke-result">
          <div class="title">执行日志 <span v-if="invokeResult">（ RequestId: {{ invokeResult.requestId }} ）</span></div>
          <div class="logs">
            <div v-for="(log, index) in logs" :key="index" class="log-item">
              <pre>- {{ log }}</pre>
            </div>
          </div>
          <div class="title" style="margin-top: 20px">调用结果 <span v-if="invokeTime"> （ {{ invokeTime }} ms ）</span></div>
          <div class="result">
            <pre>{{ invokeReturn || '[ undefined ]' }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="创建函数"
      width="400px"
    >
      <el-form :model="form" label-width="80px" label-position="left">
        <el-form-item label="函数名称">
          <el-input v-model="form.name" placeholder="函数名" />
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="form.label" placeholder="显示名称" />
        </el-form-item>
        <el-form-item label="函数描述">
          <el-input v-model="form.description" placeholder="函数描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="info"
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button type="primary" @click="create">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jsEditor from '@/components/JsEditor'
import jsonEditor from '@/components/JsonEditor'
import { db } from '@/api/cloud'
import { launchFunction } from '@/api/func'

const defaultValue = `
exports.main = async function (ctx) {
  const { auth, body } = ctx
  const db = less.database()

  console.log(requestId)
  return 'ok'
}
`
const defaultForm = {
  name: '',
  code: defaultValue,
  tags: [],
  label: '',
  description: ''
}

const defaultParamValue = {
  greeting: 'hi'
}
export default {
  name: 'FunctionEditorPage',
  components: { jsEditor, jsonEditor },
  data() {
    return {
      form: { ...defaultForm },
      loading: false,
      value: defaultValue,
      functions: [], // 所有函数
      currentFuncIndex: 0,
      dialogVisible: false,
      invokeParams: defaultParamValue,
      invokeResult: null
    }
  },
  computed: {
    // 当前选择的函数
    func() {
      const funcs = this.functions
      if (!funcs || !funcs.length) {
        return null
      }
      return this.functions[this.currentFuncIndex]
    },
    // 调用云函数的日志
    logs() {
      if (!this.invokeResult) {
        return []
      }
      return this.invokeResult.logs
    },
    // 调用云函数返回的值
    invokeReturn() {
      if (!this.invokeResult) {
        return ''
      }
      return this.invokeResult.data
    },
    // 云函数执行用时
    invokeTime() {
      if (!this.invokeResult) {
        return null
      }
      return this.invokeResult.time_usage
    }
  },
  watch: {
    func(val) {
      this.value = val.code
    }
  },
  created() {
    this.getFunctions()
  },
  methods: {
    async getFunctions() {
      this.loading = true
      const r = await db.collection('functions')
        .get()

      if (!r.ok) {
        console.error(r.error)
        return
      }

      this.functions = r.data
      this.currentFuncIndex = 0
      this.value = this.func.code
      this.loading = false
    },
    async updateFunc() {
      if (this.loading) {
        return
      }
      if (this.validate()) {
        return
      }

      this.loading = true
      const r = await db.collection('functions')
        .where({
          _id: this.func._id
        })
        .update({
          code: this.value,
          update_time: Date.now()
        })

      if (!r.ok) {
        this.$message('保存失败!')
        this.loading = false
        return
      }

      this.$notify({
        type: 'success',
        title: '保存',
        message: '保存云函数成功!'
      })

      this.loading = false
    },
    async create() {
      if (!this.form.name || !this.form.label) {
        this.$message('请正确填写表单！')
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true

      const { total } = await db.collection('functions')
        .where({
          name: this.form.name
        }).count()

      if (total) {
        this.loading = false
        this.$message('该函数函数已存在！')
        return
      }
      const r = await db.collection('functions')
        .add({
          name: this.form.name,
          label: this.form.label,
          code: defaultValue,
          tags: this.form.tags,
          description: this.form.description,
          status: 0,
          version: 0,
          create_time: Date.now(),
          update_time: Date.now()
        })

      if (!r.ok) {
        this.$message('创建失败!')
        this.loading = false
        return
      }

      await this.getFunctions()

      this.func = this.functions[0]

      this.$notify({
        type: 'success',
        title: '操作结果',
        message: '创建函数成功!'
      })
      this.form = { ...defaultForm }
      this.dialogVisible = false
      this.loading = false
    },
    async removeFunc() {
      if (!this.func) {
        this.$message('请选择要删除的函数！')
        return
      }
      if (this.loading) {
        return
      }

      const confirm = await this.$confirm('确定删除该条函数，该操作不可恢复？')
        .catch(() => false)

      if (!confirm) return

      this.loading = true

      const r = await db.collection('functions')
        .where({
          _id: this.func._id
        })
        .remove()

      if (r.ok && r.deleted) {
        this.$notify({
          title: '操作成功',
          type: 'success',
          message: '删除云函数成功！'
        })
        this.getFunctions()
      } else {
        this.$message('删除云函数操作失败 ' + r.error)
      }

      this.loading = false
    },
    async launch() {
      if (!this.func) {
        this.$message('请选择要运行的函数！')
        return
      }
      if (this.loading) {
        return
      }

      const param = this.invokeParams
      const res = await launchFunction(this.func.name, param, true)
      this.invokeResult = res
    },
    validate() {
      let error = null
      let value

      if (value === '') {
        error = '函数值不可为空'
      }

      if (error) {
        this.$message(error)
        return error
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container{
  position: relative;
  height: 100%;
  margin-top: 10px;
  width: 50%;
}

.invoke-panel {
  padding-left: 20px;
  padding-top: 10px;
  width: 50%;
  .title {
    font-weight: bold;
    span {
      font-weight: normal;
      color: gray;
    }
  }
  .editor{
    margin-top: 10px;
    border: 1px dashed gray;
    margin-left: 2px;
    width: 80%;
  }
  .invoke-result {
    margin-top: 20px;
    .logs {
      margin-top: 10px;
      padding: 10px;
      padding-left: 20px;
      background: rgba(233, 243, 221, 0.472);
      border-radius: 10px;
      overflow-x: auto;
    }
    .result {
      margin-top: 10px;
      padding: 16px;
      background: rgba(233, 243, 221, 0.472);
      border-radius: 10px;
    }
  }
}
</style>

