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
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/javascript-hint'
import './jsHint'
import $ from 'lodash'

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
      fontSize: 24,
      autocorrect: true,
      spellcheck: true,
      extraKeys: { 'Tab': 'autocomplete' },
      hintOptions: {
        // hint: javascriptHint,
        globalScope: {
          ctx: {
            auth: { uid: String },
            body: Object,
            query: Object
          },
          db: { 'collection()': Function },
          less: {
            'fetch()': {},
            storage: {},
            'database()': Function,
            Buffer: {},
            assert: {},
            crypto: {},
            path: {},
            qs: {}
          }
        },
        completeSingle: false
      }

    })

    const showHint = $.throttle(this.jsEditor.showHint, 1000)
    this.jsEditor.setValue(this.value)
    this.jsEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
      showHint.call(this.jsEditor)
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
      font-size: 16px;
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
