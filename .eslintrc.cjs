module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:jsx-a11y/recommended',
    'plugin:cypress/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  // below is specific to for e2e linting rules
  overrides: [
    {
      files: ['*.test.js', '*.spec.js', '*.cy.js'],
      rules: {
        'no-unused-expressions': 'off',
        'cypress/unsafe-to-chain-command': 'off',
        'cypress/no-unnecessary-waiting': 'warn',
        'cypress/no-assigning-return-values': 'off'
      }
    },
    {
      files: ['*.jsx'],
      rules: {
        'spaced-comment': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'jsx-a11y', 'prettier'],
  // general project rules
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        jsxSingleQuote: true,
        singleAttributePerLine: true
      }
    ],
    'react/display-name': 'off', // allows for forwardRefs without nonsense
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never', propElementValues: 'always' }
    ],
    'react/hook-use-state': ['error', { allowDestructuredState: true }],
    'react/jsx-boolean-value': ['error'],
    'no-multiple-empty-lines': 'off',
    'no-trailing-spaces': 'off',
    'space-before-function-paren': 'off',
    'padded-blocks': 'off',
    indent: 'off',
    'no-debugger': 'off',
    'react/prop-types': 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'array-callback-return': 'warn',
    'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Za-z][A-Za-z0-9]*Types$' }],
    'react/no-unknown-property': 'warn',
    'spaced-comment': 'off',
    'multiline-ternary': 'off',
    'prefer-arrow-callback': 'error',
    camelcase: 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
