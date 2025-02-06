// @ts-nocheck
import jsxMacros from '@vue-macros/jsx-macros/raw.js'
import jsxDirective from '@vue-macros/jsx-directive/raw.js'
import { transform } from '@babel/standalone'
import jsx from '@babel/plugin-transform-react-jsx'

export default {
  plugins: [
    jsxMacros({
      lib: 'react',
    }),
    jsxDirective({
      lib: 'react'
    }),
    {
      name: 'vite-plugin-react',
      transform(src, id) {
        if (id.match(/\.[jt]sx$/))
          return (
            'import React from "react"\n' +
            transform(src, {
              plugins: [jsx],
            }).code
          )
      },
    },
  ],
}
