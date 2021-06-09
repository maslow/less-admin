<template>
  <div class="json-editor">
    <div ref="jseditor" class="editor" :style="{minHeight: `${minHeight}px`}" />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript'
// import $ from 'lodash'
import { less_declare, path_declare, crypto_declare, url_declare } from './types/index'

// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false
})
// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2016,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  typeRoots: ['file:///node_modules/@types']
})

monaco.languages.typescript.javascriptDefaults.addExtraLib(crypto_declare, 'file:///node_modules/@types/crypto/index.d.ts')
monaco.languages.typescript.javascriptDefaults.addExtraLib(path_declare, 'file:///node_modules/@types/path/index.d.ts')
monaco.languages.typescript.javascriptDefaults.addExtraLib(url_declare, 'file:///node_modules/@types/url/index.d.ts')
monaco.languages.typescript.javascriptDefaults.addExtraLib(less_declare, 'globals.d.ts')

// monaco.editor.createModel(crypto_declare, 'typescript', monaco.Uri.parse('file:///node_modules/@types/crypto/index.d.ts'))
// monaco.editor.createModel(path_declare, 'typescript', monaco.Uri.parse('file:///node_modules/@types/path/index.d.ts'))

// When resolving definitions and references, the editor will try to use created models.
// Creating a model for the library allows "peek definition/references" commands to work with the library.
// monaco.editor.createModel(less_declare, 'typescript', monaco.Uri.parse('globals.d.ts'))

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
      value: '',
      language: 'javascript',
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
      tabSize: 2
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
