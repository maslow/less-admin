<template>
  <div class="json-editor">
    <div ref="jseditor" class="editor" :style="{minHeight: `${minHeight}px`}" />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'

import { less_declare, path_declare, crypto_declare, url_declare, cloudsdk_declare, axios_declare, less_api_database_declare, mongodb_declare } from './types/index'

// compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2016,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  allowJs: false // 此选项为 true 会影响 main 函数的类型推导
  // typeRoots: ['node_modules/@types']
})

monaco.languages.typescript.typescriptDefaults.addExtraLib(crypto_declare, 'file:///node_modules/@types/crypto/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(less_api_database_declare, 'file:///node_modules/@types/less-api-database/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(mongodb_declare, 'file:///node_modules/@types/mongodb/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(cloudsdk_declare, 'file:///node_modules/@/cloud-sdk/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(axios_declare, 'file:///node_modules/@types/axios/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(path_declare, 'file:///node_modules/@types/path/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(url_declare, 'file:///node_modules/@types/url/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(less_declare, 'globals.d.ts')

export default {
  name: 'FunctionEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'height', 'dark'],
  data() {
    return {
      editor: false
    }
  },
  computed: {
    minHeight() {
      return this.height || 150
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.editor.setValue(this.value)
      }
    }
  },
  mounted() {
    this.editor = monaco.editor.create(this.$refs.jseditor, {
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      theme: this.dark ? 'vs-dark' : 'vs',
      readOnly: false,
      formatOnType: true,
      fontSize: 16,
      linkedEditing: true,
      cursorBlinking: 'expand',
      smoothScrolling: true,
      renderWhitespace: 'selection',
      tabSize: 2,
      model: monaco.editor.createModel('', 'typescript', monaco.Uri.parse('index.ts'))
    })

    this.editor.onDidChangeModelContent(e => {
      this.$emit('input', this.editor.getValue())
    })
  },
  methods: {
    getValue() {
      return this.editor.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
  height: 100%;
  position: relative;

.editor {
  width: 100%;
  min-height: 600px;
}
}
</style>
