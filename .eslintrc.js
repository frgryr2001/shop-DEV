module.exports = {
  env: {
    commonjs: true,

    es2021: true,

    node: true
  },

  extends: ['standard', 'prettier'],
  plugins: ['prettier'],

  overrides: [
    {
      env: {
        node: true
      },

      files: ['.eslintrc.{js,cjs}'],

      parserOptions: {
        sourceType: 'script'
      }
    }
  ],

  parserOptions: {
    ecmaVersion: 'latest'
  },

  rules: {
    'no-console': 1,

    'no-lonely-if': 1,

    'no-unused-vars': 1,

    'no-trailing-spaces': 1,

    'no-multi-spaces': 1,

    'no-multiple-empty-lines': 1,

    'space-before-blocks': ['error', 'always'],

    'space-before-function-paren': ['error', 'never'],

    'object-curly-spacing': [1, 'always'],

    indent: ['warn', 2],

    semi: 0,

    quotes: ['error', 'single'],

    'array-bracket-spacing': 1,

    'linebreak-style': 0,

    'no-unexpected-multiline': 'warn',

    'keyword-spacing': 1,

    'comma-dangle': 1,

    'comma-spacing': 1,

    'arrow-spacing': 1
  }
};
