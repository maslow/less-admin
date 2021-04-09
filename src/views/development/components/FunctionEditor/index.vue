<template>
  <div class="json-editor">
    <div ref="jseditor" class="editor" :style="{minHeight: `${minHeight}px`}" />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript'
// import $ from 'lodash'
import { less_declare } from './types'

// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false
})
// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES6,
  allowNonTsExtensions: true
})

// When resolving definitions and references, the editor will try to use created models.
// Creating a model for the library allows "peek definition/references" commands to work with the library.
monaco.languages.typescript.javascriptDefaults.addExtraLib(less_declare, 'less.d.ts')
monaco.editor.createModel(less_declare, 'typescript', monaco.Uri.parse('less.d.ts'))

export default {
  name: 'FunctionEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'height'],
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
      theme: 'vs-dark',
      readOnly: false,
      formatOnType: true,
      fontSize: 16,
      linkedEditing: true,
      cursorBlinking: 'expand',
      smoothScrolling: true,
      renderWhitespace: 'selection'
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
