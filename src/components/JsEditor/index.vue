<template>
  <div class="json-editor">
    <div ref="jseditor" class="editor" />
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
  name: 'JsEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      jsEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsEditor.getValue()
      if (value !== editorValue) {
        this.jsEditor.setValue(this.value)
      }
    }
  },
  mounted() {
    this.jsEditor = monaco.editor.create(this.$refs.jseditor, {
      value: '',
      language: 'javascript',

      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      readOnly: false
      // theme: 'vs-dark'
    })
  },
  methods: {
    getValue() {
      return this.jsEditor.getValue()
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
