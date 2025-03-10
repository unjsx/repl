<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Output from './output/Output.vue'
import type { Store } from './store'
import { computed, provide, toRefs, useTemplateRef } from 'vue'
import {
  type EditorComponentType,
  injectKeyPreviewRef,
  injectKeyProps,
} from './types'
import EditorContainer from './editor/EditorContainer.vue'
import type * as monaco from 'monaco-editor-core'
import { useRouteQuery } from './utils'

import 'floating-vue/dist/style.css'
import './dropdown.css'

export interface Props {
  previewTheme?: boolean
  editor: EditorComponentType
  store: Store
  autoResize?: boolean
  showCompileOutput?: boolean
  clearConsole?: boolean
  layout?: 'horizontal' | 'vertical'
  layoutReverse?: boolean
  ssr?: boolean
  previewOptions?: {
    headHTML?: string
    bodyHTML?: string
    placeholderHTML?: string
    customCode?: {
      importCode?: string
      useCode?: string
    }
    showRuntimeError?: boolean
    showRuntimeWarning?: boolean
  }
  editorOptions?: {
    showErrorText?: string | false
    virtualFilesText?: string | false
    autoSaveText?: string | false
    monacoOptions?: monaco.editor.IStandaloneEditorConstructionOptions
  }
  splitPaneOptions?: {
    codeTogglerText?: string
    outputTogglerText?: string
  }
}

const autoSave = useRouteQuery<boolean>('auto-save', false)
const virtualFiles = useRouteQuery<boolean>('virtual-files', false)
const props = withDefaults(defineProps<Props>(), {
  previewTheme: false,
  autoResize: true,
  showCompileOutput: true,
  clearConsole: true,
  layoutReverse: false,
  ssr: false,
  layout: 'horizontal',
  previewOptions: () => ({}),
  editorOptions: () => ({}),
  splitPaneOptions: () => ({}),
})

if (!props.editor) {
  throw new Error('The "editor" prop is now required.')
}

const outputRef = useTemplateRef('output')

props.store.init()

const editorSlotName = computed(() => (props.layoutReverse ? 'right' : 'left'))
const outputSlotName = computed(() => (props.layoutReverse ? 'left' : 'right'))

provide(injectKeyProps, {
  ...toRefs(props),
  autoSave,
  virtualFiles,
})
provide(
  injectKeyPreviewRef,
  computed(() => outputRef.value?.previewRef?.container ?? null),
)

/**
 * Reload the preview iframe
 */
function reload() {
  outputRef.value?.reload()
}

defineExpose({ reload })
</script>

<template>
  <div class="vue-repl">
    <SplitPane :layout="layout">
      <template #[editorSlotName]>
        <EditorContainer :editor-component="editor" />
      </template>
      <template #[outputSlotName]>
        <Output
          ref="output"
          :editor-component="editor"
          :show-compile-output="props.showCompileOutput"
          :ssr="!!props.ssr"
        />
      </template>
    </SplitPane>
  </div>
</template>

<style>
.vue-repl,
.v-popper__popper {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text: #000;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;
}
.vue-repl {
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-soft);
}

.dark .vue-repl,
.v-popper__popper {
  --bg: #1a1a1a;
  --bg-soft: #282828;
  --border: #383838;
  --text: #fff;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}

html.dark {
  color-scheme: dark;
}

.vue-repl button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
