<template>
  <div class="json-editor">
    <div ref="jseditor" class="editor" :style="{minHeight: `${minHeight}px`}" />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript'

// TIP: 本页面残留的注释代码为 auto-typings 研究（未完成），暂保留注释以便下回继续。

// import { AutoTypings, LocalStorageCache } from 'monaco-editor-auto-typings'

import { less_declare, path_declare, crypto_declare, url_declare } from './types/index'
const typeRoot = 'file:///'
// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false
})
// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2016,
  allowNonTsExtensions: true,
  allowSyntheticDefaultImports: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  typeRoots: ['file:///node_modules/@types']
})

monaco.languages.typescript.javascriptDefaults.addExtraLib(crypto_declare, 'file:///node_modules/@types/crypto/index.d.ts')
monaco.languages.typescript.javascriptDefaults.addExtraLib(path_declare, 'file:///node_modules/@types/path/index.d.ts')
monaco.languages.typescript.javascriptDefaults.addExtraLib(url_declare, 'file:///node_modules/@types/url/index.d.ts')
monaco.languages.typescript.javascriptDefaults.addExtraLib(less_declare, 'globals.d.ts')

// When resolving definitions and references, the editor will try to use created models.
// Creating a model for the library allows "peek definition/references" commands to work with the library.

monaco.editor.createModel(crypto_declare, 'typescript', monaco.Uri.parse('file:///node_modules/@types/crypto/index.d.ts'))
monaco.editor.createModel(path_declare, 'typescript', monaco.Uri.parse('file:///node_modules/@types/path/index.d.ts'))
monaco.editor.createModel(less_declare, 'typescript', monaco.Uri.parse(typeRoot + 'globals.d.ts'))

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
      model: monaco.editor.createModel('', 'javascript' /* ,monaco.Uri.parse(typeRoot + 'index.js') */)
    })

    this.editor.onDidChangeModelContent(e => {
      this.$emit('input', this.editor.getValue())
    })

    // const cache = new LocalStorageCache()

    // AutoTypings.create(this.editor, {
    //   sourceCache: cache,

    //   onUpdate: (u, t) => {
    //     // console.log(u)
    //     if (u.type !== 'ResolvedNewDefinationFile') {
    //       return
    //     }

    //     // eslint-disable-next-line prefer-const
    //     let { source, uri, packageName } = u
    //     if (uri.path.endsWith('package.json')) {
    //       return
    //     }

    //     // const reg_module = /^\/node_modules\/(.+)\/.*\.ts$/
    //     // const [, packageName] = uri.path.match(reg_module)
    //     if (packageName && uri.path.endsWith('index.d.ts')) {
    //       const pkgName = packageName.replace('@types/', '')
    //       console.log('package: ', pkgName)
    //       source = `
    //       declare module '${pkgName}' {
    //         ${source}
    //       }
    //       `
    //     }

    //     const p = uri.path.replace('/node_modules/', 'node_modules/@types/')
    //     monaco.languages.typescript.javascriptDefaults.addExtraLib(source, typeRoot + p)
    //     monaco.languages.typescript.typescriptDefaults.addExtraLib(source, typeRoot + p)
    //     monaco.editor.createModel(source, 'typescript', monaco.Uri.parse(typeRoot + p))
    //     // console.log(monaco.languages.typescript.javascriptDefaults.getExtraLibs())
    //   }
    // })
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
