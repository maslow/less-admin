<template>
  <div class="json-editor">
    <div ref="jseditor" class="editor" :style="{minHeight: `${minHeight}px`}" />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'

import { less_declare } from './types/index'
import { loadPackageTypings } from '@/api/func'

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

monaco.languages.typescript.typescriptDefaults.addExtraLib(less_declare, 'globals.d.ts')

export default {
  name: 'FunctionEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'height', 'dark', 'name'],
  data() {
    return {
      editor: {}
    }
  },
  computed: {
    minHeight() {
      return this.height || 150
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor?.getValue()
      if (value !== editorValue) {
        this.editor.setValue(this.value)
      }
    }
  },
  mounted() {
    const now = Date.now()
    const filename = `index-${now}.ts`
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
      model: monaco.editor.createModel(this.value, 'typescript', monaco.Uri.parse(filename))
    })

    this.editor.onDidChangeModelContent(e => {
      this.$emit('input', this.editor?.getValue())
    })
    this.loadDefaultDeclarations()
  },
  methods: {
    getValue() {
      return this.editor?.getValue()
    },
    async loadDefaultDeclarations(packageName) {
      this.loadDeclaration('@')
      this.loadDeclaration('less-api-database')
      this.loadDeclaration('axios')
      this.loadDeclaration('@types/node')
      this.loadDeclaration('mongodb')
      this.loadDeclaration('moment')
    },
    async loadDeclaration(packageName) {
      const r = await loadPackageTypings(packageName)
      if (r.code) {
        return
      }

      r.data.forEach(async lib => {
        await this.addExtraLib(lib)
      })
    },
    async addExtraLib(lib) {
      const { path, content } = lib

      const fullpath = `file:///node_modules/${path}`

      const defaults = monaco.languages.typescript.typescriptDefaults
      const loaded = defaults.getExtraLibs()
      const keys = Object.keys(loaded)

      if (keys.includes(fullpath)) {
        console.log(`${path} already exists in ts extralib`)
        return
      }
      try {
        defaults.addExtraLib(content, fullpath)
      } catch (error) {
        console.log(error, fullpath, keys)
        throw error
      }
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
