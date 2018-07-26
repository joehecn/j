
module.exports = {
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    __static: true,
    Promise: true
  },
  rules: {
    "no-console": ["error", { allow: ["log"] }],
    "no-constant-condition": ["error", { "checkLoops": false }]
  },
  plugins: [
    'html'
  ]
}