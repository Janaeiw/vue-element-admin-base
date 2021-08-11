module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['error', {
      "anonymous": 'ignore',
      'named': 'never',
      'asyncArrow': 'always'
    }]
    // 'camelcase': ['error', { 'properties': 'never', 'ignoreDestructuring': true }]
  }
}
