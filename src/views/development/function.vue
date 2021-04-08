<template>
  <div class="components-container">
    <div v-if="func" class="header">
      <h3>函数: {{ func.label }}</h3>
      调用名：<el-tag type="success">{{ func.name }}</el-tag>
    </div>
    <div class="create-btn" style="margin-bottom: 10px; margin-top: 10px;">
      <el-button
        v-permission="'function.read'"
        icon="el-icon-refresh"
        type="primary"
        :disabled="loading"
        @click="getFunction"
      >刷新</el-button>
      <el-button
        v-permission="'function.edit'"
        type="primary"
        style="margin-left: 5px"
        :disabled="loading || !func"
        @click="updateFunc"
      >保存</el-button>
    </div>

    <div style="display: flex;">
      <div class="editor-container">
        <js-editor ref="jsEditor" v-model="value" />
      </div>
      <div class="invoke-panel">
        <div class="title">
          调用参数
          <el-button
            v-permission="'function.debug'"
            size="mini"
            type="success"
            style="margin-left: 10px"
            :disabled="loading || !func"
            @click="launch"
          >运行</el-button>
        </div>
        <div class="editor">
          <json-editor
            ref="jsonEditor"
            v-model="invokeParams"
            :line-numbers="true"
          />
        </div>
        <div v-if="invokeResult" class="invoke-result">
          <div class="title">
            执行日志
            <span
              v-if="invokeResult"
            >（ RequestId: {{ invokeResult.requestId }} ）</span>
          </div>
          <div class="logs">
            <div v-for="(log, index) in logs" :key="index" class="log-item">
              <pre>- {{ log }}</pre>
            </div>
          </div>
          <div class="title" style="margin-top: 20px">
            调用结果 <span v-if="invokeTime"> （ {{ invokeTime }} ms ）</span>
          </div>
          <div class="result">
            <pre>{{ invokeReturn || '[ undefined ]' }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsEditor from '@/components/JsEditor'
import jsonEditor from '@/components/JsonEditor'
import { db, cloud } from '@/api/cloud'

const defaultParamValue = {
  code: 'hi'
}
export default {
  name: 'FunctionEditorPage',
  components: { jsEditor, jsonEditor },
  data() {
    return {
      loading: false,
      value: '',
      func: null,
      invokeParams: defaultParamValue,
      invokeResult: null
    }
  },
  computed: {
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
  async created() {
    await this.getFunction()
    this.setTagViewTitle()
  },
  methods: {
    /**
     * 获取函数数据
     */
    async getFunction() {
      const func_id = this.$route.params.id
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
      this.value = this.func.code
      this.loading = false
    },
    /**
     * 保存函数代码
     */
    async updateFunc(showTip = true) {
      if (this.loading) {
        return
      }
      if (this.validate()) {
        return
      }

      this.loading = true
      const r = await db
        .collection('functions')
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

      if (showTip) {
        this.$notify({
          type: 'success',
          title: '保存',
          message: '保存云函数成功!'
        })
      }

      this.loading = false
    },
    /**
     * 运行函数代码
     */
    async launch() {
      await this.updateFunc(false)
      if (this.loading) {
        return
      }

      let param = this.invokeParams
      if (typeof param === 'string') {
        param = JSON.parse(param)
      }

      const res = await cloud.invokeFunctin(this.func.name, param, true)
      this.invokeResult = res
    },
    setTagViewTitle() {
      const label = this.func.label
      const title = this.$route.meta.title
      const route = Object.assign({}, this.$route, { title: `${title}: ${label}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    validate() {
      let error = null

      if (this.value === '') {
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
.editor-container {
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
  .editor {
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

