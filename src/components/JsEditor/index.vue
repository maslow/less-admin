<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
// require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/javascript-lint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'

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
    this.jsEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'javascript',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true,
      hint: 'auto',
      fontSize: 24,
      autocorrect: true,
      spellcheck: true,
      hintOptions: {
        completeSingle: false
      }

      // extraKeys: { 'Tab': 'autocomplete' }
    })

    this.jsEditor.setValue(this.value)
    this.jsEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
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

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 800px;
      font-size: 20px;
    }

    .CodeMirror-scroll {
      min-height: 800px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}
</style>
